from flask import Blueprint, jsonify, request
import jwt 
import datetime
import dotenv
import os
dotenv.load_dotenv()

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')

secret_key = os.environ.get('SECRET_KEY_JWT')

"""
Inscription
L"utilisateur remplit le formulaire dans React et clique sur "S"inscrire".
React envoie une requête POST /auth/register avec email, username, password.
Flask hache le mot de passe, stocke l"utilisateur en base et renvoie une réponse 201 Created.
React redirige vers la page de connexion.
"""
@auth_bp.route('/register', methods=['POST'])
def register():
    return 

"""
Connexion
L"utilisateur entre son email/mot de passe et clique sur "Se connecter".
React envoie une requête POST /auth/login.
Flask vérifie les identifiants et utilise login_user(user) pour enregistrer la session.
Flask renvoie une réponse 200 OK et React stocke l"état utilisateur.
React redirige vers la page d"accueil.
"""
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username == 'jeans' and password == 'password':
        token = jwt.encode({
            'username': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, secret_key, algorithm='HS256')
        return jsonify({"token": token}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

"""
Vérification de l"utilisateur connecté
Lors du chargement de la page, React envoie GET /auth/user.
Flask vérifie si une session existe avec current_user.is_authenticated.
Si oui, Flask retourne les infos de l"utilisateur, sinon il envoie 401 Unauthorized.
React met à jour l"état global (ex : setUser(userData)).
"""
@auth_bp.route('/user', methods=['GET'])
def user():
    return


"""
Déconnexion
"""
@auth_bp.route('/logout', methods=['GET'])
def logout():
    return

"""
Route protégée pour le JWT 
"""
@auth_bp.route('/protected', methods=['GET'])
def protected():
    token = request.headers.get('Authorization').split()[1]
    try:
        data = jwt.decode(token, secret_key, algorithms=['HS256'])
        return jsonify({"message": "Protected route accessed", "data": data}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401