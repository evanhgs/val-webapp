from main import create_app
from config import DevelopmentConfig, ProductionConfig
from flask import send_from_directory


# parametre à changer selon le choix
app = create_app(DevelopmentConfig)


# les blueprints des routes ici :
@app.route('/')
def home():
    return send_from_directory(app.static_folder, "index.html")

@app.route('/<path:path>')
def serve_react(path):
    return send_from_directory(app.static_folder, path)

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, "index.html")



if __name__ == '__main__':
    app.run()