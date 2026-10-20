import subprocess
import json

class AzureAccountInfo():
    def __init__(self):
        self.account = json.loads(
            subprocess.check_output(
                ["cmd", "/c" "az", "account", "show"],
                text=True
            )
        )
        
    def sub_info(self):
        return {
            "sub_id":self.account["id"],
            "sub_name":self.account["name"]
        }

    def tenant_info(self):
        return {
            "tenant_domain":self.account.get("tenantDefaultDomain"),
            "tenant_name":self.account.get("tenantDisplayName"),
            "tenant_id":self.account["tenantId"]

        }

    def user_info(self):
        return {
            "user_name":self.account["user"]["name"]
        }





