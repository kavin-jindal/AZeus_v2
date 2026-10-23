"""
Azure Resource Management Client Wrapper
Direct interface with Azure Resource Management SDK (azure.mgmt.resource).
"""

from azure.mgmt.resource.resources import ResourceManagementClient

class AzureResourceClient:
    """Low-level wrapper around Azure ResourceManagementClient."""

    def __init__(self, cred, sub_id):
        self.cred = cred
        self.sub_id = sub_id
        self.client = ResourceManagementClient(cred, sub_id)

    def list_resource_groups(self):
        """Yields raw resource groups from Azure."""
        return self.client.resource_groups.list()

    def list_resources(self):
        """Yields all resources across the subscription."""
        return self.client.resources.list()

    def list_resources_by_group(self, group_name):
        """Yields resources within a specified resource group."""
        return self.client.resources.list_by_resource_group(group_name)

    def get_resource_group(self, group_name):
        """Fetches a specific resource group by name."""
        return self.client.resource_groups.get(group_name)
