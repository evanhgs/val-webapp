from flask import Blueprint, jsonify

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')


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
    return

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