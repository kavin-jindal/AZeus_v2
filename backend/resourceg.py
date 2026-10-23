from azure.mgmt.resource.resources import ResourceManagementClient

class ResourceManager:
    def __init__(self, cred, sub_id):
        self.cred = cred
        self.sub_id = sub_id
        self.client = ResourceManagementClient(cred, sub_id)
        
    def get_groups(self):
        groups_list = []
        try:
            groups = self.client.resource_groups.list()
            for group in groups:
                groups_dic = {
                    "id": group.id,
                    "name": group.name,
                    "location": group.location,
                    "properties": group.properties,
                    "managed_by": group.managed_by
                }
                groups_list.append(groups_dic)
        except Exception as e:
            print(f"Direct resource group listing failed: {e}")

        # If direct listing was restricted or empty, derive groups from discovered resources
        if not groups_list:
            try:
                resources = self.client.resources.list()
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
        try:
            if resource_group_name:
                resources = self.client.resources.list_by_resource_group(resource_group_name)
            else:
                resources = self.client.resources.list()
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
        except Exception:
            return []
