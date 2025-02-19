from flask import Blueprint, jsonify
from server.models import User
from server.routes.auth import get_user_id_from_jwt

user_bp = Blueprint('user_bp', __name__, url_prefix='/user')



""" 
Profil 
L'utilisateur est connecté et clique sur 'Profil'.
React envoie une requête GET /user/profile.
Objectif est de récupérer le username, email, photo de profil, bio, date de création à partir du token JWT 
"""
@user_bp.route('/profile', methods=['POST'])
def profile():
    user_id = get_user_id_from_jwt()
    user = User.query.filter_by(id=user_id).first()
    
    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401
    
    return jsonify({
        "username": user.username,
        "email": user.email,
        "bio": user.bio,
        # "profile_picture": user.profile_picture,  # TODO: afficher les photos à partir d'une base de donnée
        "created_at": user.created_at, 
    }), 200


"""
to do next
Modification d'infos
"""


"""
to do next
Follow,Followed, Unfollow
"""