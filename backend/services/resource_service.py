"""
Resource Service
Business logic for discovering resource groups and individual cloud assets.
"""

from ..azure_clients.resource_client import AzureResourceClient

class ResourceService:
    def __init__(self, cred, sub_id):
        self.cred = cred
        self.sub_id = sub_id
        self.client = AzureResourceClient(cred, sub_id)

    def get_groups(self):
        """
        Discovers resource groups. If direct listing is restricted, parses
        unique resource group names from discovered subscription assets.
        """
        groups_list = []
        try:
            groups = self.client.list_resource_groups()
            for group in groups:
                groups_list.append({
                    "id": group.id,
                    "name": group.name,
                    "location": group.location,
                    "properties": getattr(group, "properties", None),
                    "managed_by": getattr(group, "managed_by", None)
                })
        except Exception as e:
            print(f"Direct resource group listing failed: {e}")

        # Fallback discovery from resources if direct group listing returned empty or failed
        if not groups_list:
            try:
                resources = self.client.list_resources()
                found_rgs = {}
                for r in resources:
                    if not r.id:
                        continue
                    parts = r.id.split('/')
                    if "resourceGroups" in parts:
                        idx = parts.index("resourceGroups")
                        if idx + 1 < len(parts):
                            rg_name = parts[idx + 1]
                            if rg_name not in found_rgs:
                                found_rgs[rg_name] = r.location or "Global"
                for rg_name, rg_loc in found_rgs.items():
                    groups_list.append({
                        "id": f"/subscriptions/{self.sub_id}/resourceGroups/{rg_name}",
                        "name": rg_name,
                        "location": rg_loc,
                        "properties": None,
                        "managed_by": None
                    })
            except Exception as e2:
                print(f"Fallback resource group discovery failed: {e2}")

        return groups_list

    def get_resources(self, resource_group_name=None):
        """Lists resources in subscription or scoped to a specific resource group."""
        try:
            if resource_group_name:
                resources = self.client.list_resources_by_group(resource_group_name)
            else:
                resources = self.client.list_resources()
            res_list = []
            for res in resources:
                res_list.append({
                    "name": res.name,
                    "id": res.id,
                    "type": res.type,
                    "location": res.location,
                    "tags": res.tags or {}
                })
            return res_list
        except Exception as e:
            print(f"Error fetching resources: {e}")
            return []
