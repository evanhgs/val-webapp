from flask import Flask, render_template

app = Flask(__name__)


from routes.auth.routes import auth_bp
app.register_blueprint(auth_bp)
@app.route('/')
@app.route('/home')
def home():
    return render_template("home.html")



if __name__ == '__main__':
    app.run()
