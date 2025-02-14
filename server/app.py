import os
from server.main import create_app
from server.config import DevelopmentConfig, ProductionConfig
from flask import send_from_directory, render_template

# parametre à changer selon le choix
app = create_app(DevelopmentConfig)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return render_template("api.html")
    return render_template("api.html")


if __name__ == '__main__':
    app.run()