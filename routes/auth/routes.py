from flask import app, Blueprints, render_template

auth_bp = Blueprints('auth', __name__, url_prefix='/auth')

@auth_bp.route('/')
@auth_bp.route('/register')
@app.route('/register')
def register():
    render_template('register.html')