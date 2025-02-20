from flask import Blueprint, jsonify, request
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
Modification du profil utilisateur
"""
@user_bp.route('/edit-profile', methods=['POST'])
def edit_profile():
    user_id = get_user_id_from_jwt()
    if not user_id:
        return jsonify({'message' : 'Not authorized'}), 401
    
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    data = request.get_json()
    new_username = data.get('username')
    new_email = data.get('email')
    new_bio = data.get('bio')

    # si la valeur n'est pas nulle et si elle est différente de celle de base
    # si la requete ne renvoie rien alors ça veut dire que c'est possible de changer
    if new_username and new_username != user.username:
        if User.query.filter_by(username=new_username).first():
            return jsonify({'message' : 'Username already taken'}), 400
        user.username=new_username
    
    if new_email and new_email != user.email:
        if User.query.filter_by(email=new_email).first():
            return jsonify({'message': 'Email already in use'}), 400
        user.email = new_email

    # on accepte la bio vide mais on ne peut pas la modifier si elle est absente
    if new_bio is not None: 
        user.bio = new_bio

    try:
        db.session.commit()
        return jsonify({
            'message': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'bio': user.bio
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500



"""
to do next
Follow,Followed, Unfollow
"""