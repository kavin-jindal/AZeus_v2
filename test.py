from backend.keyvault import KeyVault
from backend.info import AzureAccountInfo
from azure.identity import DefaultAzureCredential
from azure.mgmt.subscription import SubscriptionClient

cred = DefaultAzureCredential()
azure = AzureAccountInfo()
subscription = azure.sub_info()
sub_id = subscription["sub_id"]
name = subscription["sub_name"]
print(id)
print(name)


keyvault = KeyVault(cred=cred, sub_id=sub_id)
vaults = keyvault.get_vaults()
for vault in vaults:
    print(vault['name'])



