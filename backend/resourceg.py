from azure.mgmt.resource.resources import ResourceManagementClient

class ResourceManager():
    def __init__(self, cred, sub_id):
        self.cred = cred
        self.sub_id = sub_id

        self.client = ResourceManagementClient(cred, sub_id)
        
    def get_groups(self):
        groups = self.client.resource_groups.list()
        groups_list = [{}]
        for group in groups:
            groups_dic = {}
            groups_dic["id"] = group.id
            groups_dic["name"] = group.name
            groups_dic["location"] = group.location
            groups_dic["properties"]  =group.properties
            groups_dic["managed_by"] = group.managed_by
            groups_list.append(groups_dic)
        return groups_list
    

