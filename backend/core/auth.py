"""
Azure Authentication Core Module
Provides Azure credential initialization using AzureCliCredential and DefaultAzureCredential.
"""

from azure.identity import AzureCliCredential, DefaultAzureCredential
from azure.core.exceptions import ClientAuthenticationError

_global_credential = None

def get_azure_credential(force_new=False):
    """
    Returns an authenticated Azure credential instance from the original codebase.
    """
    global _global_credential
    if _global_credential is not None and not force_new:
        return _global_credential

    try:
        cred = AzureCliCredential()
        _global_credential = cred
        print("Auth successful")
        return _global_credential
    except ClientAuthenticationError as e:
        print("Authentication failed:", e)
        try:
            cred = DefaultAzureCredential()
            _global_credential = cred
            return _global_credential
        except Exception:
            return cred
