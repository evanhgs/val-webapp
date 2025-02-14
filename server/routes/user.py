from flask import Blueprint, jsonify
from server.models import User
from server.routes.auth import get_current_user

user_bp = Blueprint('user_bp', __name__, url_prefix='/user')



"""
Profil
L'utilisateur est connecté et clique sur 'Profil'.
React envoie une requête GET /user/profile.
Flask renvoie les informations de l'utilisateur.
React affiche les informations de l'utilisateur.
"""
@user_bp.route('/profile', methods=['GET'])
def profile():
    user = get_current_user()

    if not user:
        return jsonify({"message": "unauthorized"}), 401
    
    return jsonify({
        "username": user.username,
        "email": user.email,
        "bio": user.bio,
        #"profile_picture": user.profile_picture,
        "created_at": user.created_at
    }), 200
