"""
Core system utilities: Azure authentication, tenant/subscription info, and error handling.
"""

from .auth import get_azure_credential
from .info import AzureAccountInfo
from .errors import ClientAuthenticationError

__all__ = [
    "get_azure_credential",
    "AzureAccountInfo",
    "ClientAuthenticationError",
]
