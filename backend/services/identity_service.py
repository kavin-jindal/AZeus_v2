"""
Identity Service
Manages Azure user identity, directory roles, and credential context.
"""

from ..core.info import AzureAccountInfo
from ..azure_clients.identity_client import AzureIdentityClient

class IdentityService:
    def __init__(self, cred=None):
        self.cred = cred
        self.info_provider = AzureAccountInfo()
        self.identity_client = AzureIdentityClient(cred) if cred else None

    def get_current_user(self):
        """Returns details about the active signed-in user."""
        return self.info_provider.user_info()

    def get_tenant_details(self):
        """Returns tenant directory metadata."""
        return self.info_provider.tenant_info()

    def get_accessible_subscriptions(self):
        """Enumerates accessible subscriptions via SubscriptionClient."""
        if not self.identity_client:
            return []
        try:
            subs = self.identity_client.list_subscriptions()
            return [{
                "subscription_id": s.subscription_id,
                "display_name": s.display_name,
                "state": str(s.state)
            } for s in subs]
        except Exception as e:
            print(f"Error enumerating subscriptions: {e}")
            return []
