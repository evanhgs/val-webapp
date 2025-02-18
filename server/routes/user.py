from flask import Blueprint, jsonify
from server.models import User


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
    return
