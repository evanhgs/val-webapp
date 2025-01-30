from flask import Flask, send_from_directory


app = Flask(__name__, static_folder='../client/dist', static_url_path='/')



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

    app.run(debug=True)
