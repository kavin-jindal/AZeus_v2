from quart import Quart, render_template, send_from_directory
import os

app = Quart(__name__, template_folder="ui", static_folder="ui", static_url_path="")

@app.route("/")
async def home():
    return await render_template("index.html")

@app.route("/<path:path>")
async def static_proxy(path):
    ui_dir = os.path.join(os.path.dirname(__file__), "ui")
    file_path = os.path.join(ui_dir, path)
    if os.path.exists(file_path):
        return await send_from_directory(ui_dir, path)
    return "Not Found", 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8089, debug=True)
