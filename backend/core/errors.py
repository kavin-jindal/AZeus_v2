"""
Shared Error Handling
Re-exports Azure core exceptions from the original codebase.
"""

from azure.core.exceptions import (
    AzureError,
    ClientAuthenticationError,
    ResourceNotFoundError,
    HttpResponseError
)

__all__ = [
    "AzureError",
    "ClientAuthenticationError",
    "ResourceNotFoundError",
    "HttpResponseError",
]
