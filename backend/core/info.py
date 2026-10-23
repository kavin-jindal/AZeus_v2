"""
Azure Tenant & Subscription Context Module
Retrieves active account, subscription, and directory profile from Azure CLI and Azure SDK.
"""

import subprocess
import json
from azure.mgmt.subscription import SubscriptionClient

class AzureAccountInfo:
    """
    Extracts current Azure tenant, subscription, and identity context.
    """
    def __init__(self):
        self.account = self._load_account()

    def _load_account(self):
        try:
            raw_output = subprocess.check_output(
                ["az", "account", "show"],
                text=True,
                shell=True
            )
            return json.loads(raw_output)
        except Exception as e:
            print(f"Warning: could not execute 'az account show': {e}")
            return {
                "id": "",
                "name": "",
                "state": "Unknown",
                "environmentName": "AzureCloud",
                "tenantId": "",
                "user": {"name": "Unknown User"}
            }

    def sub_info(self, cred=None):
        """Returns subscription metadata dictionary."""
        sub_id = self.account.get("id", "")
        sub_name = self.account.get("name", "")
        sub_state = self.account.get("state", "Enabled")
        cloud_name = self.account.get("environmentName", "AzureCloud")

        # Try to enrich via SubscriptionClient if cred provided
        if cred and sub_id:
            try:
                sub_mgmt = SubscriptionClient(cred)
                sub_obj = sub_mgmt.subscriptions.get(sub_id)
                if sub_obj:
                    sub_name = sub_obj.display_name or sub_name
                    sub_state = str(sub_obj.state) if sub_obj.state else sub_state
            except Exception:
                pass

        return {
            "sub_id": sub_id,
            "sub_name": sub_name,
            "sub_state": sub_state,
            "cloud_name": cloud_name,
        }

    def tenant_info(self):
        """Returns tenant directory metadata dictionary."""
        return {
            "tenant_domain": self.account.get("tenantDefaultDomain") or "",
            "tenant_name": self.account.get("tenantDisplayName") or self.account.get("tenantDefaultDomain") or "",
            "tenant_id": self.account.get("tenantId", "")
        }

    def user_info(self):
        """Returns signed-in account user identity."""
        user_dict = self.account.get("user", {})
        return {
            "user_name": user_dict.get("name", "Azure CLI User")
        }
