"""
Key Vault Service
Business logic for Key Vault discovery, security configuration evaluation,
active secret enumeration, soft-deleted secret discovery, and recovery.
"""

from ..azure_clients.keyvault_client import AzureKeyVaultClient

class KeyVaultService:
    def __init__(self, cred, sub_id, tenant_id=None):
        self.cred = cred
        self.sub_id = sub_id
        self.tenant_id = tenant_id
        if not self.tenant_id:
            try:
                from .subscription_service import SubscriptionService
                sub_svc = SubscriptionService(cred=self.cred)
                t_data = sub_svc.get_tenant_data()
                self.tenant_id = t_data.get("tenant_id")
            except Exception:
                pass
        self.client = AzureKeyVaultClient(cred, sub_id)

    def get_vaults(self):
        """Lists vaults and resolves detailed security settings per vault."""
        vaults = []
        try:
            for vault in self.client.list_vaults():
                rg_name = ""
                if vault.id:
                    parts = vault.id.split("/")
                    if "resourceGroups" in parts:
                        idx = parts.index("resourceGroups")
                        if idx + 1 < len(parts):
                            rg_name = parts[idx + 1]

                soft_delete = "Disabled"
                purge_protection = "Disabled"
                public_network = "Enabled"
                rbac_auth = False

                if rg_name:
                    try:
                        detail = self.client.get_vault(rg_name, vault.name)
                        props = getattr(detail, "properties", None)
                        if props:
                            is_soft_del = getattr(props, "enable_soft_delete", False)
                            days = getattr(props, "soft_delete_retention_in_days", None)
                            if is_soft_del:
                                soft_delete = f"Enabled ({days}d)" if days else "Enabled"
                            else:
                                soft_delete = "Disabled"

                            is_purge_prot = getattr(props, "enable_purge_protection", False)
                            purge_protection = "Enabled" if is_purge_prot else "Disabled"

                            rbac_auth = bool(getattr(props, "enable_rbac_authorization", False))

                            pna = getattr(props, "public_network_access", None)
                            if pna:
                                public_network = str(pna)
                            elif getattr(props, "network_acls", None):
                                acls = props.network_acls
                                default_act = getattr(acls, "default_action", "Allow")
                                public_network = "Disabled" if default_act == "Deny" else "Enabled"
                    except Exception as err:
                        print(f"Could not get properties for vault {vault.name}: {err}")

                vaults.append({
                    "name": vault.name,
                    "id": vault.id,
                    "location": vault.location,
                    "url": f"https://{vault.name}.vault.azure.net",
                    "resourceGroup": rg_name,
                    "softDelete": soft_delete,
                    "purgeProtection": purge_protection,
                    "rbacAuth": rbac_auth,
                    "publicNetwork": public_network
                })
        except Exception as e:
            print(f"Error listing vaults: {e}")
        return vaults

    def get_secrets(self, vault_url=None):
        """Retrieves active secrets with plaintext values where accessible."""
        secrets = []
        if not vault_url:
            return secrets
        try:
            client = self.client.get_secret_client(vault_url)
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

    def get_deleted_secrets(self, vault_url=None):
        """Retrieves soft-deleted secrets awaiting purge."""
        del_secrets = []
        if not vault_url:
            return del_secrets
        try:
            client = self.client.get_secret_client(vault_url)
            for secret in client.list_deleted_secrets():
                del_secrets.append({
                    "name": secret.name,
                    "id": secret.id,
                    "recovery_id": getattr(secret, "recovery_id", ""),
                    "scheduled_purge_date": str(secret.scheduled_purge_date.date()) if hasattr(secret, "scheduled_purge_date") and secret.scheduled_purge_date else "",
                    "deleted_date": str(secret.deleted_date.date()) if hasattr(secret, "deleted_date") and secret.deleted_date else ""
                })
        except Exception as e:
            print(f"Error getting deleted secrets from {vault_url}: {e}")
        return del_secrets

    def recover_and_get_secret(self, vault_url=None, secret_name=None):
        """Recovers a soft-deleted secret and retrieves its plaintext value."""
        if not vault_url or not secret_name:
            return {"success": False, "error": "Vault URL and secret name are required"}
        try:
            client = self.client.get_secret_client(vault_url)
            poller = client.begin_recover_deleted_secret(secret_name)
            poller.result()
            secret_obj = client.get_secret(secret_name)
            return {
                "success": True,
                "name": secret_name,
                "value": secret_obj.value if secret_obj else "",
                "content_type": getattr(secret_obj.properties, "content_type", "") or "secret",
                "updated": str(secret_obj.properties.updated_on.date()) if secret_obj and secret_obj.properties and secret_obj.properties.updated_on else ""
            }
        except Exception as e:
            print(f"Error recovering secret {secret_name} from {vault_url}: {e}")
            return {"success": False, "error": str(e)}

    def get_certs(self, vault_url=None):
        """Retrieves SSL/TLS certificates and thumbprints."""
        certs = []
        if not vault_url:
            return certs
        try:
            client = self.client.get_certificate_client(vault_url)
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
        """Retrieves cryptographic keys."""
        keys = []
        if not vault_url:
            return keys
        try:
            client = self.client.get_key_client(vault_url)
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

    def get_deleted_keys(self, vault_url=None):
        """Retrieves soft-deleted cryptographic keys."""
        del_keys = []
        if not vault_url:
            return del_keys
        try:
            client = self.client.get_key_client(vault_url)
            for key in client.list_deleted_keys():
                del_keys.append({
                    "name": key.name,
                    "id": key.id,
                    "recovery_id": getattr(key, "recovery_id", ""),
                    "scheduled_purge_date": str(key.scheduled_purge_date.date()) if hasattr(key, "scheduled_purge_date") and key.scheduled_purge_date else "",
                    "deleted_date": str(key.deleted_date.date()) if hasattr(key, "deleted_date") and key.deleted_date else "",
                    "key_type": getattr(key, "key_type", "RSA")
                })
        except Exception as e:
            print(f"Error getting deleted keys from {vault_url}: {e}")
        return del_keys

    def recover_key(self, vault_url=None, key_name=None):
        """Recovers a soft-deleted cryptographic key."""
        if not vault_url or not key_name:
            return {"success": False, "error": "Vault URL and key name are required"}
        try:
            client = self.client.get_key_client(vault_url)
            poller = client.begin_recover_deleted_key(key_name)
            poller.result()
            key_obj = client.get_key(key_name)
            return {
                "success": True,
                "name": key_name,
                "id": key_obj.id,
                "key_type": getattr(key_obj, "key_type", "RSA"),
                "enabled": getattr(key_obj.properties, "enabled", True)
            }
        except Exception as e:
            print(f"Error recovering key {key_name} from {vault_url}: {e}")
            return {"success": False, "error": str(e)}

    def get_deleted_vaults(self):
        """Retrieves soft-deleted key vaults in the subscription using list_deleted."""
        del_vaults = []
        try:
            for dv in self.client.list_deleted_vaults():
                props = getattr(dv, "properties", None)
                vault_id = getattr(props, "vault_id", "") if props else ""
                loc = getattr(props, "location", "") if props else getattr(dv, "location", "")
                del_date = str(props.deletion_date.date()) if props and hasattr(props, "deletion_date") and props.deletion_date else ""
                purge_date = str(props.scheduled_purge_date.date()) if props and hasattr(props, "scheduled_purge_date") and props.scheduled_purge_date else ""
                purge_protect = "Enabled" if props and getattr(props, "purge_protection_enabled", False) else "Disabled"
                tags = getattr(props, "tags", {}) or {}

                rg_name = ""
                if vault_id:
                    parts = vault_id.split("/")
                    lower_parts = [p.lower() for p in parts]
                    if "resourcegroups" in lower_parts:
                        idx = lower_parts.index("resourcegroups")
                        if idx + 1 < len(parts):
                            rg_name = parts[idx + 1]

                del_vaults.append({
                    "name": dv.name,
                    "id": getattr(dv, "id", "") or vault_id,
                    "vault_id": vault_id,
                    "resourceGroup": rg_name,
                    "location": loc,
                    "deletion_date": del_date,
                    "scheduled_purge_date": purge_date,
                    "purgeProtection": purge_protect,
                    "tags": tags
                })
        except Exception as e:
            print(f"Error listing deleted vaults: {e}")
        return del_vaults

    def recover_deleted_vault(self, vault_name, resource_group_name=None, location=None):
        """Restores a soft-deleted Key Vault instance."""
        if not vault_name:
            return {"success": False, "error": "Vault name is required"}
        try:
            # If resource_group_name or location are missing, attempt resolution from list_deleted
            if not resource_group_name or not location:
                for dv in self.get_deleted_vaults():
                    if dv["name"].lower() == vault_name.lower():
                        if not resource_group_name and dv.get("resourceGroup"):
                            resource_group_name = dv["resourceGroup"]
                        if not location and dv.get("location"):
                            location = dv["location"]
                        break

            if not resource_group_name:
                return {"success": False, "error": "Resource group name could not be resolved for this vault"}

            if not location:
                location = "eastus"

            poller = self.client.recover_vault(
                resource_group_name=resource_group_name,
                vault_name=vault_name,
                location=location,
                tenant_id=self.tenant_id
            )
            vault_obj = poller.result()
            return {
                "success": True,
                "name": vault_name,
                "id": getattr(vault_obj, "id", ""),
                "resourceGroup": resource_group_name,
                "location": location,
                "status": "Recovered"
            }
        except Exception as e:
            print(f"Error restoring key vault {vault_name}: {e}")
            return {"success": False, "error": str(e)}
