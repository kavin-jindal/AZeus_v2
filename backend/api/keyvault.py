"""
Key Vault API Blueprint
Handles Key Vault exploration, secret discovery, and secret recovery routes.
"""

from quart import Blueprint, render_template, request
from ..core.auth import get_azure_credential
from ..services.keyvault_service import KeyVaultService
from . import get_azure_data

keyvault_bp = Blueprint("keyvault", __name__)

@keyvault_bp.route("/keyvault")
async def keyvault():
    data = get_azure_data()
    return await render_template(
        "keyvault.html",
        sub_data=data["sub_data"],
        tenant_data=data["tenant_data"],
        vault_list=data["vault_list"],
        vaults_data=data["vaults_data"],
        username=data["user_info"]["user_name"],
        tenant_domain=data["tenant_data"]["tenant_domain"],
        groups=data["groups"],
        resource=data["resources"],
        metrics=data["metrics"]
    )

@keyvault_bp.route("/api/keyvault/recover-secret", methods=["POST"])
async def api_recover_secret():
    try:
        payload = await request.get_json()
        if not payload:
            return {"success": False, "error": "No JSON payload provided"}
        vault_url = payload.get("vault_url")
        secret_name = payload.get("secret_name")
        if not vault_url or not secret_name:
            return {"success": False, "error": "vault_url and secret_name are required"}

        data = get_azure_data()
        sub_id = data["sub_data"]["sub_id"]
        cred = get_azure_credential()
        keyv = KeyVaultService(cred=cred, sub_id=sub_id)
        res = keyv.recover_and_get_secret(vault_url=vault_url, secret_name=secret_name)
        if res.get("success"):
            get_azure_data(force_refresh=True)
        return res
    except Exception as e:
        return {"success": False, "error": str(e)}

@keyvault_bp.route("/api/keyvault/recover-key", methods=["POST"])
async def api_recover_key():
    try:
        payload = await request.get_json()
        if not payload:
            return {"success": False, "error": "No JSON payload provided"}
        vault_url = payload.get("vault_url")
        key_name = payload.get("key_name")
        if not vault_url or not key_name:
            return {"success": False, "error": "vault_url and key_name are required"}

        data = get_azure_data()
        sub_id = data["sub_data"]["sub_id"]
        cred = get_azure_credential()
        keyv = KeyVaultService(cred=cred, sub_id=sub_id)
        res = keyv.recover_key(vault_url=vault_url, key_name=key_name)
        if res.get("success"):
            get_azure_data(force_refresh=True)
        return res
    except Exception as e:
        return {"success": False, "error": str(e)}

@keyvault_bp.route("/api/keyvault/vaults")
async def api_vaults():
    data = get_azure_data()
    return {
        "success": True,
        "vaults": data["vaults_data"]
    }
