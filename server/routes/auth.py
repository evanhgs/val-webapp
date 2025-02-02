from flask import Blueprint, jsonify

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')

@auth_bp.route('/register')
def register():
    return jsonify({"members": ["members1", "members2", "members3"]})