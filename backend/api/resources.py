"""
Resources API Blueprint
Handles Resource Group exploration and asset listing routes.
"""

from quart import Blueprint, render_template
from . import get_azure_data

resources_bp = Blueprint("resources", __name__)

@resources_bp.route("/resource-groups")
@resources_bp.route("/resourcegroups")
async def resource_groups():
    data = get_azure_data()
    return await render_template(
        "resourcegroups.html",
        sub_data=data["sub_data"],
        tenant_data=data["tenant_data"],
        groups=data["groups"],
        resource=data["resources"],
        vaults_data=data["vaults_data"],
        username=data["user_info"]["user_name"],
        tenant_domain=data["tenant_data"]["tenant_domain"],
        metrics=data["metrics"]
    )

@resources_bp.route("/api/resources")
async def api_resources():
    data = get_azure_data()
    return {
        "success": True,
        "groups": data["groups"],
        "resources": data["resources"]
    }
