from flask import Blueprint, jsonify
from server.app import db
from server.routes.auth import get_user_id_from_jwt


post_bp = Blueprint('post_bp', __name__, url_prefix='/post')


"""
Upload un nouveau post
- image_url => upload photo 
- caption 
- hidden_tag => false/true
- user_id 
"""
@post_bp.route('/upload', method=['POST'])
def upload_post():
    return 


@post_bp.route('/delete', method=['POST'])
def delete_post():
    return

# Récupérer tous les posts (ex: page Explore). 
@post_bp.route('/get-all', method=['POST'])
def get_all_post():
    return

# Récupérer les posts d'un utilisateur spécifique (ex: profil utilisateur). 
@post_bp.route('/get-user', method=['POST'])
def get_user_post():
    return

# Récupérer les posts des personnes suivies (ex: feed principal).
@post_bp.route('/get-followed', method=['POST'])
def get_followed_post():
    return