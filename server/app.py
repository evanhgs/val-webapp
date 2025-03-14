import os
from server.main import create_app
from server.config import DevelopmentConfig, ProductionConfig
from flask import render_template

# utilisation de productconfig 
environment = os.environ.get('FLASK_ENV', 'production')
app = create_app(ProductionConfig if environment == 'production' else DevelopmentConfig)


@app.route('/')
def index():
    return render_template("index.html")


if __name__ == '__main__':
    app.run()