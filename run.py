"""
AZeus v2 - Application Entry Point
"""

import os
from quart import Quart
from backend.api import register_blueprints

# Absolute path resolution for templates and static files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(BASE_DIR, "ui", "templates")
STATIC_DIR = os.path.join(BASE_DIR, "ui", "static")

app = Quart(
    __name__,
    template_folder=TEMPLATE_DIR,
    static_folder=STATIC_DIR,
    static_url_path="/static"
)

# Register API & Page Blueprints
register_blueprints(app)

@app.before_serving
async def startup():
    from backend.api import get_azure_data
    print("Initiating fresh Azure reconnaissance scan on startup...")
    try:
        get_azure_data(force_refresh=True)
        print("Fresh live reconnaissance complete.")
    except Exception as e:
        print(f"Warning: startup reconnaissance encountered an error: {e}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8089))
    app.run(host="0.0.0.0", port=port, debug=True, use_reloader=False)
