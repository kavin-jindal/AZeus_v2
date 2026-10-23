from quart import Quart, render_template, send_from_directory, request
import os
from azure.core.exceptions import ClientAuthenticationError
from azure.identity import DefaultAzureCredential, AzureCliCredential
from backend.info import AzureAccountInfo
from backend.resourceg import ResourceManager
from backend.keyvault import KeyVault

# azure setup
try:
    cred = AzureCliCredential()
    
    
    

except ClientAuthenticationError as e:
    print("Authentication failed:", e)

else:
    print("Auth successful")

app = Quart(__name__, template_folder="ui", static_folder="ui", static_url_path="")

azure_info = AzureAccountInfo()

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
    global _cache
    if not force_refresh and _cache["vaults_data"] is not None:
        return _cache

    sub_info = azure_info.sub_info(cred=cred)
    tenant_info = azure_info.tenant_info()
    user_info = azure_info.user_info()

    sub_data = {
        "sub_id": sub_info.get("sub_id", ""),
        "sub_name": sub_info.get("sub_name", ""),
        "sub_state": sub_info.get("sub_state", "Active"),
        "cloud_name": sub_info.get("cloud_name", "AzureCloud")
    }

    tenant_data = {
        "tenant_domain": tenant_info.get("tenant_domain", ""),
        "tenant_name": tenant_info.get("tenant_name", "") or tenant_info.get("tenant_domain", ""),
        "tenant_id": tenant_info.get("tenant_id", "")
    }

    groups = []
    resources = []
    try:
        res_m = ResourceManager(cred=cred, sub_id=sub_data["sub_id"])
        groups = res_m.get_groups()
        resources = res_m.get_resources()
    except Exception as e:
        print(f"Error fetching resource groups: {e}")

    vault_list = []
    vaults_data = []
    try:
        keyv = KeyVault(cred=cred, sub_id=sub_data["sub_id"])
        vault_list = keyv.get_vaults()
        for vault in vault_list:
            v_url = vault.get("url") or f"https://{vault['name']}.vault.azure.net"
            secrets = keyv.get_secrets(vault_url=v_url)
            del_secrets = keyv.get_deleted_secrets(vault_url=v_url)
            certs = keyv.get_certs(vault_url=v_url)
            keys = keyv.get_keys(vault_url=v_url)
            
            rg_name = vault.get("resourceGroup") or ""
            if not rg_name and vault.get("id"):
                parts = vault["id"].split("/")
                if "resourceGroups" in parts:
                    idx = parts.index("resourceGroups")
                    if idx + 1 < len(parts):
                        rg_name = parts[idx + 1]

            vaults_data.append({
                "id": vault["name"],
                "name": vault["name"],
                "resourceGroup": rg_name or (groups[0]["name"] if groups else "Azure Managed"),
                "resourceId": vault["id"],
                "uri": v_url,
                "location": vault.get("location", "eastus"),
                "status": "accessible" if (secrets or keys or certs or del_secrets) else "restricted",
                "rbacAuth": vault.get("rbacAuth", False),
                "softDelete": vault.get("softDelete", "Disabled"),
                "purgeProtection": vault.get("purgeProtection", "Disabled"),
                "publicNetwork": vault.get("publicNetwork", "Enabled"),
                "secrets": secrets,
                "deleted_secrets": del_secrets,
                "certificates": certs,
                "keys": keys
            })
    except Exception as e:
        print(f"Error fetching key vault data: {e}")

    total_secrets = sum(len(v.get("secrets", [])) for v in vaults_data)
    total_del_secrets = sum(len(v.get("deleted_secrets", [])) for v in vaults_data)
    total_keys = sum(len(v.get("keys", [])) for v in vaults_data)
    total_certs = sum(len(v.get("certificates", [])) for v in vaults_data)
    primary_location = vaults_data[0]["location"] if vaults_data else (groups[0]["location"] if groups else "Global")

    metrics = {
        "vaults_count": len(vaults_data),
        "secrets_count": total_secrets,
        "del_secrets_count": total_del_secrets,
        "keys_count": total_keys,
        "certs_count": total_certs,
        "groups_count": len(groups),
        "resources_count": len(resources),
        "primary_location": primary_location
    }

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

@app.route("/")
@app.route("/home")
async def home():
    data = get_azure_data()
    return await render_template(
        "index.html",
        sub_data=data["sub_data"],
        tenant_data=data["tenant_data"],
        username=data["user_info"]["user_name"],
        tenant_domain=data["tenant_data"]["tenant_domain"],
        groups=data["groups"],
        resource=data["resources"],
        vaults_data=data["vaults_data"],
        metrics=data["metrics"]
    )

@app.route("/keyvault")
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

@app.route("/resource-groups")
@app.route("/resourcegroups")
async def resource_groups():
    data = get_azure_data()
    return await render_template(
        "resourcegroups.html",
        sub_data=data["sub_data"],
        tenant_data=data["tenant_data"],
        groups=data["groups"],
        resource=data["resources"],
        vaults_data=data["vaults_data"],
        username=data["user_info"]["user_name"],
        tenant_domain=data["tenant_data"]["tenant_domain"],
        metrics=data["metrics"]
    )

@app.route("/api/overview")
async def api_overview():
    data = get_azure_data()
    return {
        "success": True,
        "sub_data": data["sub_data"],
        "tenant_data": data["tenant_data"],
        "username": data["user_info"]["user_name"],
        "groups": data["groups"],
        "resources": data["resources"],
        "vaults": data["vaults_data"],
        "metrics": data["metrics"]
    }

@app.route("/api/refresh")
async def api_refresh():
    data = get_azure_data(force_refresh=True)
    return {
        "success": True,
        "sub_data": data["sub_data"],
        "tenant_data": data["tenant_data"],
        "username": data["user_info"]["user_name"],
        "groups": data["groups"],
        "resources": data["resources"],
        "vaults": data["vaults_data"],}
@app.route("/api/keyvault/recover-secret", methods=["POST"])
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
        keyv = KeyVault(cred=cred, sub_id=sub_id)
        res = keyv.recover_and_get_secret(vault_url=vault_url, secret_name=secret_name)
        if res.get("success"):
            get_azure_data(force_refresh=True)
        return res
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8089, debug=True, use_reloader=False)
