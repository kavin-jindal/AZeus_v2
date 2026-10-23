"""
Subscription Service
Aggregates subscription context, directory details, and system-wide metrics.
"""

from ..core.info import AzureAccountInfo

class SubscriptionService:
    def __init__(self, cred=None):
        self.cred = cred
        self.info_provider = AzureAccountInfo()

    def get_subscription_data(self):
        """Returns normalized subscription metadata."""
        sub = self.info_provider.sub_info(cred=self.cred)
        return {
            "sub_id": sub.get("sub_id", ""),
            "sub_name": sub.get("sub_name", ""),
            "sub_state": sub.get("sub_state", "Active"),
            "cloud_name": sub.get("cloud_name", "AzureCloud")
        }

    def get_tenant_data(self):
        """Returns normalized tenant directory metadata."""
        tenant = self.info_provider.tenant_info()
        return {
            "tenant_domain": tenant.get("tenant_domain", ""),
            "tenant_name": tenant.get("tenant_name", "") or tenant.get("tenant_domain", ""),
            "tenant_id": tenant.get("tenant_id", "")
        }

    def get_user_data(self):
        """Returns signed in account user identity."""
        return self.info_provider.user_info()

    def compute_metrics(self, vaults_data, groups, resources):
        """Computes summary metrics across discovered Azure assets."""
        total_secrets = sum(len(v.get("secrets", [])) for v in vaults_data)
        total_del_secrets = sum(len(v.get("deleted_secrets", [])) for v in vaults_data)
        total_keys = sum(len(v.get("keys", [])) for v in vaults_data)
        total_del_keys = sum(len(v.get("deleted_keys", [])) for v in vaults_data)
        total_certs = sum(len(v.get("certificates", [])) for v in vaults_data)
        primary_location = vaults_data[0]["location"] if vaults_data else (groups[0]["location"] if groups else "Global")

        return {
            "vaults_count": len(vaults_data),
            "secrets_count": total_secrets,
            "del_secrets_count": total_del_secrets,
            "keys_count": total_keys,
            "del_keys_count": total_del_keys,
            "certs_count": total_certs,
            "groups_count": len(groups),
            "resources_count": len(resources),
            "primary_location": primary_location
        }
