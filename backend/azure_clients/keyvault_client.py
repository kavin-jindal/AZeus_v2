"""
Azure Key Vault SDK Client Wrapper
Interfaces directly with KeyVaultManagementClient, SecretClient, KeyClient, and CertificateClient.
"""

from azure.mgmt.keyvault import KeyVaultManagementClient
from azure.keyvault.secrets import SecretClient
from azure.keyvault.certificates import CertificateClient
from azure.keyvault.keys import KeyClient

class AzureKeyVaultClient:
    """Low-level wrapper around Azure Key Vault management and data plane SDK clients."""

    def __init__(self, cred, sub_id):
        self.cred = cred
        self.sub_id = sub_id
        self.mgmt_client = KeyVaultManagementClient(credential=cred, subscription_id=sub_id)

    def list_vaults(self):
        """Lists Key Vault resources in the subscription."""
        return self.mgmt_client.vaults.list()

    def get_vault(self, resource_group_name, vault_name):
        """Gets detailed properties of a Key Vault instance."""
        return self.mgmt_client.vaults.get(resource_group_name, vault_name)

    def list_deleted_vaults(self):
        """Lists soft-deleted Key Vaults in the subscription."""
        return self.mgmt_client.vaults.list_deleted()

    def get_deleted_vault(self, vault_name, location):
        """Gets detailed properties of a soft-deleted Key Vault instance."""
        return self.mgmt_client.vaults.get_deleted(vault_name, location)

    def recover_vault(self, resource_group_name, vault_name, location, tenant_id):
        """Restores a soft-deleted Key Vault instance using begin_create_or_update with create_mode='recover'."""
        from azure.mgmt.keyvault.models import VaultCreateOrUpdateParameters, VaultProperties, Sku, SkuName, CreateMode

        parameters = VaultCreateOrUpdateParameters(
            location=location,
            properties=VaultProperties(
                tenant_id=tenant_id,
                sku=Sku(name=SkuName.standard, family="A"),
                create_mode=CreateMode.recover
            )
        )
        return self.mgmt_client.vaults.begin_create_or_update(
            resource_group_name=resource_group_name,
            vault_name=vault_name,
            parameters=parameters
        )

    def get_secret_client(self, vault_url):
        """Returns a SecretClient configured for the specified vault URL."""
        return SecretClient(vault_url=vault_url, credential=self.cred)

    def get_key_client(self, vault_url):
        """Returns a KeyClient configured for the specified vault URL."""
        return KeyClient(vault_url=vault_url, credential=self.cred)

    def get_certificate_client(self, vault_url):
        """Returns a CertificateClient configured for the specified vault URL."""
        return CertificateClient(vault_url=vault_url, credential=self.cred)
