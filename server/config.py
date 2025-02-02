from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os 
import dotenv

dotenv.load_dotenv()

db = SQLAlchemy()
mig = Migrate()
cors = CORS()

class Config():
    SECRET_KEY_APP = os.environ.get('SECRET_KEY_APP')



# dev param
class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DB_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

# production param
class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DB_URI_PROD')
    SQLALCHEMY_TRACK_MODIFICATIONS = False