import subprocess
import json
from azure.mgmt.subscription import SubscriptionClient

class AzureAccountInfo():
    def __init__(self):
        self.account = json.loads(
            subprocess.check_output(
                ["cmd", "/c" "az", "account", "show"],
                text=True
            )
        )
        
    def sub_info(self, cred):
        sub_mgmt = SubscriptionClient(cred)
        return {
            "sub_id": self.account["id"],
            "sub_name": self.account["name"],
            "sub_state": self.account.get("state", "Enabled"),
            "cloud_name": self.account.get("environmentName", "AzureCloud"),
        }

    def tenant_info(self):
        return {
            "tenant_domain": self.account.get("tenantDefaultDomain") or "",
            "tenant_name": self.account.get("tenantDisplayName") or self.account.get("tenantDefaultDomain") or "",
            "tenant_id": self.account.get("tenantId", "")
        }

    def user_info(self):
        return {
            "user_name":self.account["user"]["name"]
        }





