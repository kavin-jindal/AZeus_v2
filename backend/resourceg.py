from azure.mgmt.resource.resources import ResourceManagementClient

class ResourceManager:
    def __init__(self, cred, sub_id):
        self.cred = cred
        self.sub_id = sub_id
        self.client = ResourceManagementClient(cred, sub_id)
        
    def get_groups(self):
        groups = self.client.resource_groups.list()
        groups_list = []
        for group in groups:
            groups_dic = {
                "id": group.id,
                "name": group.name,
                "location": group.location,
                "properties": group.properties,
                "managed_by": group.managed_by
            }
            groups_list.append(groups_dic)
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
