from flask import Flask, send_from_directory
from config import db 

# les instances classées ici :
app = Flask(__name__, static_folder='../client/dist', static_url_path='/')


def create_app(config_class):
    app.config.from_object(config_class)

    db.init_app(app)

    with app.app_context():
        from models import User
        db.create_all()

    return app

