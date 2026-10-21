from quart import Quart, render_template, send_from_directory
import os
from azure.core.exceptions import ClientAuthenticationError
from azure.identity import DefaultAzureCredential, AzureCliCredential
from backend.info import AzureAccountInfo

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
    data = {

    }
    return await render_template("keyvault.html", data=data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8089, debug=True)
