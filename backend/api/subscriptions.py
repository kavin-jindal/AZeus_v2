"""
Subscriptions API Blueprint
Handles home overview and general subscription/tenant enumeration routes.
"""

from quart import Blueprint, render_template
from . import get_azure_data

subscriptions_bp = Blueprint("subscriptions", __name__)

@subscriptions_bp.route("/")
@subscriptions_bp.route("/home")
async def home():
    data = get_azure_data()
    return await render_template(
        "index.html",
        sub_data=data["sub_data"],
        tenant_data=data["tenant_data"],
        username=data["user_info"]["user_name"],
        tenant_domain=data["tenant_data"]["tenant_domain"],
        groups=data["groups"],
        resource=data["resources"],
        vaults_data=data["vaults_data"],
        metrics=data["metrics"]
    )

@subscriptions_bp.route("/api/overview")
async def api_overview():
    data = get_azure_data()
    return {
        "success": True,
        "sub_data": data["sub_data"],
        "tenant_data": data["tenant_data"],
        "username": data["user_info"]["user_name"],
        "groups": data["groups"],
        "resources": data["resources"],
        "vaults": data["vaults_data"],
        "metrics": data["metrics"]
    }

@subscriptions_bp.route("/api/refresh")
async def api_refresh():
    data = get_azure_data(force_refresh=True)
    return {
        "success": True,
        "sub_data": data["sub_data"],
        "tenant_data": data["tenant_data"],
        "username": data["user_info"]["user_name"],
        "groups": data["groups"],
        "resources": data["resources"],
        "vaults": data["vaults_data"],
        "metrics": data["metrics"]
    }
