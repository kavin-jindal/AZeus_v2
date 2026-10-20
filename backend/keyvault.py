from azure.mgmt.keyvault import KeyVaultManagementClient
from azure.keyvault.secrets import SecretClient
from azure.keyvault.certificates import CertificateClient
from azure.keyvault.keys import KeyClient

class KeyVault:
    def __init__(self, cred, sub_id):
        self.cred = cred
        self.sub_id = sub_id
        self.vault_client = KeyVaultManagementClient(
            credential=cred, 
            subscription_id=sub_id)

    def get_vaults(self):
        vaults = []
        for vault in self.vault_client.vaults.list():
            vaults.append({
                "name":vault.name,
                "id":vault.id,
                "url":(
                    f"https://{vault.name}.vault.azure.net"

                )
            })
            return vaults

    def get_secrets(self, vault_url):
        secrets=[]
        client = SecretClient(credential=self.cred, vault_url=vault_url)  
        for secret in client.list_properties_of_secrets():
            secrets.append({

            "name":secret.name,
            "value":client.get_secret(secret.name)
        })
        return secrets
        


    


'''# certs
cert_client = CertificateClient(credential=cred, vault_url=vault_url)
y = cert_client.list_properties_of_certificates()
for i in y:
    print(i.name)
    value = cert_client.get_certificate(i.name)'''

'''key_client = KeyClient(credential=cred, vault_url=vault_url)
z = key_client.list_properties_of_keys()
for j in z:
    print(j.name)
    print(value)'''
