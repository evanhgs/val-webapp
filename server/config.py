from flask_sqlalchemy import SQLAlchemy
import os 
import dotenv
import timedelta

dotenv.load_dotenv()

db = SQLAlchemy()


class Config():
    SECRET_KEY_APP = os.environ.get('SECRET_KEY_APP')


    
# dev param
class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DB_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = True

# production param
class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DB_URI_PROD')
    SQLALCHEMY_TRACK_MODIFICATIONS = False