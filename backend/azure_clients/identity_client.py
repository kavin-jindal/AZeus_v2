"""
Azure Identity SDK Client Wrapper
Interfaces with Azure Identity and Microsoft Graph client where applicable.
"""

from azure.mgmt.subscription import SubscriptionClient

class AzureIdentityClient:
    """Low-level interface for identity, subscription, and directory clients."""

    def __init__(self, cred):
        self.cred = cred
        self.sub_client = SubscriptionClient(cred)

    def list_subscriptions(self):
        """Lists accessible Azure subscriptions."""
        return self.sub_client.subscriptions.list()

    def get_subscription(self, sub_id):
        """Gets details of an Azure subscription."""
        return self.sub_client.subscriptions.get(sub_id)
