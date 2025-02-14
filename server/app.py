import os
from server.main import create_app
from server.config import DevelopmentConfig, ProductionConfig
from flask import send_from_directory, render_template

# parametre à changer selon le choix
app = create_app(DevelopmentConfig)


@app.route('/')
def index():
    return render_template("index.html")


if __name__ == '__main__':
    app.run()