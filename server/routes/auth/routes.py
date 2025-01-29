from flask import Blueprint, render_template

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')

@auth_bp.route('/')
@auth_bp.route('/register')
def register():
    return render_template('home.html')

