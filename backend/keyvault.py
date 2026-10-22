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
        try:
            for vault in self.vault_client.vaults.list():
                vaults.append({
                    "name": vault.name,
                    "id": vault.id,
                    "location": vault.location,
                    "url": f"https://{vault.name}.vault.azure.net"
                })
        except Exception as e:
            print(f"Error listing vaults: {e}")
        return vaults

    def get_secrets(self, vault_url=None):
        secrets = []
        if not vault_url:
            return secrets
        try:
            client = SecretClient(credential=self.cred, vault_url=vault_url)  
            for secret in client.list_properties_of_secrets():
                secret_val = ""
                try:
                    sec_obj = client.get_secret(secret.name)
                    secret_val = sec_obj.value if sec_obj else ""
                except Exception:
                    secret_val = "<Access Restricted>"
                secrets.append({
                    "name": secret.name,
                    "value": secret_val,
                    "content_type": getattr(secret, "content_type", "") or "secret",
                    "updated": str(secret.updated_on.date()) if hasattr(secret, "updated_on") and secret.updated_on else ""
                })
        except Exception as e:
            print(f"Error getting secrets from {vault_url}: {e}")
        return secrets

    def get_certs(self, vault_url=None):
        certs = []
        if not vault_url:
            return certs
        try:
            client = CertificateClient(credential=self.cred, vault_url=vault_url)
            for cert in client.list_properties_of_certificates():
                tb = ""
                if hasattr(cert, "x509_thumbprint") and cert.x509_thumbprint:
                    tb = cert.x509_thumbprint.hex().upper()
                elif hasattr(cert, "thumbprint") and cert.thumbprint:
                    tb = cert.thumbprint.hex().upper() if hasattr(cert.thumbprint, "hex") else str(cert.thumbprint)
                certs.append({
                    "name": cert.name,
                    "id": cert.id,
                    "enabled_state": getattr(cert, "enabled", True),
                    "secret_id": getattr(cert, "secret_id", None),
                    "thumbprint": tb,
                    "expires": str(cert.expires_on.date()) if hasattr(cert, "expires_on") and cert.expires_on else "N/A"
                })
        except Exception as e:
            print(f"Error getting certs from {vault_url}: {e}")
        return certs
    
    def get_keys(self, vault_url=None):
        keys = []
        if not vault_url:
            return keys
        try:
            client = KeyClient(credential=self.cred, vault_url=vault_url)
            for key in client.list_properties_of_keys():
                keys.append({
                    "name": key.name,
                    "id": key.id,
                    "enabled_state": getattr(key, "enabled", True),
                    "key_type": getattr(key, "key_type", "RSA")
                })
        except Exception as e:
            print(f"Error getting keys from {vault_url}: {e}")
        return keys

        


    


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
