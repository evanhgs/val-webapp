from flask import Flask
from server.config import db, mig, cors

def create_app(config_class):
    app = Flask(__name__, static_folder='../client/src', static_url_path='/')
    app.config.from_object(config_class)
    db.init_app(app)

    cors.init_app(app, resources={r"/*": {"origins": "http://localhost:5173"}}) 
    mig.init_app(app, db)
    

    with app.app_context():
        from server.models import User, Post, Like, Comment, Follow, Notification, Conversation, Message
        # création des tables avec FlaskMigrate

    # les blueprints : 
    from server.routes.auth import auth_bp
    
    app.register_blueprint(auth_bp)

    return app

