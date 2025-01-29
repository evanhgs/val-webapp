from flask import Flask, send_from_directory


app = Flask(__name__, static_folder='../client/dist', static_url_path='/')


from routes.auth.routes import auth_bp
app.register_blueprint(auth_bp)

@app.route('/')
def home():
    return send_from_directory(app.static_folder, "index.html")



if __name__ == '__main__':

    app.run(debug=True)
