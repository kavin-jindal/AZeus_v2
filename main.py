from quart import Quart, render_template, send_from_directory
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
sub_info = azure_info.sub_info(cred=cred)
tenant_info = azure_info.tenant_info()
user_info = azure_info.user_info()

@app.route("/home")
async def home():
    sub_data = {
        "sub_id":sub_info['sub_id'],
        "sub_name":sub_info["sub_name"],
        
    }
    tenant_data = {
        "tenant_domain":tenant_info["tenant_domain"],
        "tenant_name":tenant_info["tenant_name"],
        "tenant_id":tenant_info["tenant_id"]
    }
    username = user_info["user_name"]
    
    return await render_template("index.html", sub_data=sub_data, tenant_data=tenant_data, username=username)

@app.route("/")
async def base():
    sub_data = {
        "sub_id":sub_info['sub_id'],
        "sub_name":sub_info["sub_name"],
        
    }
    tenant_data = {
        "tenant_domain":tenant_info["tenant_domain"],
        "tenant_name":tenant_info["tenant_name"],
        "tenant_id":tenant_info["tenant_id"]
    }
    username = user_info["user_name"]
    
    return await render_template("base.html", username=username)


@app.route("/keyvault")
async def keyvault():
    vault_list = []
    vaults_data = []
    try:
        keyv = KeyVault(cred=cred, sub_id=sub_info["sub_id"])
        vault_list = keyv.get_vaults()
        for vault in vault_list:
            v_url = vault.get("url") or f"https://{vault['name']}.vault.azure.net"
            secrets = keyv.get_secrets(vault_url=v_url)
            certs = keyv.get_certs(vault_url=v_url)
            keys = keyv.get_keys(vault_url=v_url)
            vaults_data.append({
                "id": vault["name"],
                "name": vault["name"],
                "resourceId": vault["id"],
                "uri": v_url,
                "location": vault.get("location", "eastus"),
                "status": "accessible" if (secrets or keys or certs) else "restricted",
                "rbacAuth": True,
                "softDelete": "Enabled",
                "purgeProtection": "Enabled",
                "publicNetwork": "Enabled",
                "secrets": secrets,
                "certificates": certs,
                "keys": keys
            })
    except Exception as e:
        print(f"Error fetching key vault data: {e}")

    username = user_info.get("user_name", "")
    tenant_domain = tenant_info.get("tenant_domain", "")
    return await render_template(
        "keyvault.html",
        vault_list=vault_list,
        vaults_data=vaults_data,
        username=username,
        tenant_domain=tenant_domain
    )    
@app.route("/resource-groups")
@app.route("/resourcegroups")
async def resource_groups():
    groups = []
    resources = []
    try:
        res_m = ResourceManager(cred=cred, sub_id=sub_info["sub_id"])
        groups = res_m.get_groups()
        resources = res_m.get_resources()
    except Exception as e:
        print(f"Error fetching resource groups: {e}")

    username = user_info.get("user_name", "")
    tenant_domain = tenant_info.get("tenant_domain", "")
    
    return await render_template(
        "resourcegroups.html",
        groups=groups,
        resource=resources,
        username=username,
        tenant_domain=tenant_domain
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8089, debug=True, use_reloader=False)
