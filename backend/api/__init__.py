"""
API Blueprints and Centralized Data Orchestration for AZeus v2.
Fetches live Azure data directly without local database storage.
"""

from quart import Blueprint, render_template, request, jsonify
from ..core.auth import get_azure_credential
from ..services.subscription_service import SubscriptionService
from ..services.resource_service import ResourceService
from ..services.keyvault_service import KeyVaultService
from ..services.identity_service import IdentityService

# In-memory reconnaissance cache for the current session
_cache = {
    "sub_data": None,
    "tenant_data": None,
    "user_info": None,
    "groups": None,
    "resources": None,
    "vaults_data": None,
    "vault_list": None,
    "metrics": None
}

def get_azure_data(force_refresh=False):
    """
    Retrieves live reconnaissance dataset directly from Azure APIs.
    Caches in memory for the active session unless force_refresh=True.
    """
    global _cache

    if not force_refresh and _cache["vaults_data"] is not None:
        return _cache

    cred = get_azure_credential()
    sub_service = SubscriptionService(cred=cred)
    sub_data = sub_service.get_subscription_data()
    tenant_data = sub_service.get_tenant_data()
    user_info = sub_service.get_user_data()

    sub_id = sub_data.get("sub_id", "")

    # Discover resource groups and resources
    groups = []
    resources = []
    if sub_id:
        try:
            res_service = ResourceService(cred=cred, sub_id=sub_id)
            groups = res_service.get_groups()
            resources = res_service.get_resources()
        except Exception as e:
            print(f"Error fetching resource groups: {e}")

    # Discover Key Vaults, active secrets, deleted secrets, keys, deleted keys, and certificates
    vault_list = []
    vaults_data = []
    if sub_id:
        try:
            kv_service = KeyVaultService(cred=cred, sub_id=sub_id)
            vault_list = kv_service.get_vaults()
            for vault in vault_list:
                v_url = vault.get("url") or f"https://{vault['name']}.vault.azure.net"
                secrets = kv_service.get_secrets(vault_url=v_url)
                del_secrets = kv_service.get_deleted_secrets(vault_url=v_url)
                keys = kv_service.get_keys(vault_url=v_url)
                del_keys = kv_service.get_deleted_keys(vault_url=v_url)
                certs = kv_service.get_certs(vault_url=v_url)

                rg_name = vault.get("resourceGroup") or ""
                if not rg_name and vault.get("id"):
                    parts = vault["id"].split("/")
                    if "resourceGroups" in parts:
                        idx = parts.index("resourceGroups")
                        if idx + 1 < len(parts):
                            rg_name = parts[idx + 1]

                is_accessible = bool(secrets or keys or certs or del_secrets or del_keys)

                vaults_data.append({
                    "id": vault["name"],
                    "name": vault["name"],
                    "resourceGroup": rg_name or (groups[0]["name"] if groups else "Azure Managed"),
                    "resourceId": vault["id"],
                    "uri": v_url,
                    "location": vault.get("location", "eastus"),
                    "status": "accessible" if is_accessible else "restricted",
                    "rbacAuth": vault.get("rbacAuth", False),
                    "softDelete": vault.get("softDelete", "Disabled"),
                    "purgeProtection": vault.get("purgeProtection", "Disabled"),
                    "publicNetwork": vault.get("publicNetwork", "Enabled"),
                    "secrets": secrets,
                    "deleted_secrets": del_secrets,
                    "keys": keys,
                    "deleted_keys": del_keys,
                    "certificates": certs
                })
        except Exception as e:
            print(f"Error fetching key vault data: {e}")

    metrics = sub_service.compute_metrics(vaults_data, groups, resources)

    _cache = {
        "sub_data": sub_data,
        "tenant_data": tenant_data,
        "user_info": user_info,
        "groups": groups,
        "resources": resources,
        "vaults_data": vaults_data,
        "vault_list": vault_list,
        "metrics": metrics
    }

    return _cache

def register_blueprints(app):
    """Registers all feature blueprints onto the Quart application."""
    from .subscriptions import subscriptions_bp
    from .resources import resources_bp
    from .keyvault import keyvault_bp
    from .users import users_bp

    app.register_blueprint(subscriptions_bp)
    app.register_blueprint(resources_bp)
    app.register_blueprint(keyvault_bp)
    app.register_blueprint(users_bp)
