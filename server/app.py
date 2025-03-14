import os
import dotenv
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

dotenv.load_dotenv()

# init des extensions
db = SQLAlchemy()
mig = Migrate()
cors = CORS()

# classes de configuration
class Config:
    SECRET_KEY_APP = os.environ.get('SECRET_KEY_APP')
    basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    SQLALCHEMY_DATABASE_URI = os.environ.get('DB_URI')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

def create_app(config_class):
    app = Flask(__name__)
    app.config.from_object(config_class)
    db.init_app(app)

    # autorise toutes les origines
    cors.init_app(app, resources={r"/*": {"origins": "*"}})
    mig.init_app(app, db)
    
    with app.app_context():
        from server.models import User, Post, Like, Comment, Follow, Notification, Conversation, Message
        # Les modèles sont importés pour être détectés par Flask-Migrate

    # importation de blueprints ici
    from server.routes.auth import auth_bp
    from server.routes.user import user_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)

    @app.route('/')
    def index():
        return render_template("index.html")

    return app

# Sélection de la configuration en fonction de l'environnement
environment = os.environ.get('FLASK_ENV', 'production')
app = create_app(ProductionConfig if environment == 'production' else DevelopmentConfig)



if __name__ == '__main__':
    app.run()