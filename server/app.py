import os
from server.main import create_app
from server.config import DevelopmentConfig, ProductionConfig
from flask import send_from_directory



# parametre à changer selon le choix
app = create_app(DevelopmentConfig)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html") # TO DO : faire une page exprès pour les erreurs 404


if __name__ == '__main__':
    app.run()