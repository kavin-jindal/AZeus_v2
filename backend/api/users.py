"""
Users API Blueprint
Handles user and tenant context routes.
"""

from quart import Blueprint
from . import get_azure_data

users_bp = Blueprint("users", __name__)

@users_bp.route("/api/users")
async def api_users():
    data = get_azure_data()
    return {
        "success": True,
        "user": data["user_info"],
        "tenant": data["tenant_data"]
    }
