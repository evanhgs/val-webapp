from flask import Blueprint, jsonify, request
from server.app import db
from server.models import User, Post
from server.routes.auth import get_user_id_from_jwt
from server.routes.user import allowed_file, UPLOAD_FOLDER
from werkzeug.utils import secure_filename
import os 

post_bp = Blueprint('post_bp', __name__, url_prefix='/post')


"""
Upload un nouveau post
- image_url => upload photo 
- caption 
- hidden_tag => false/true
- user_id 
"""
@post_bp.route('/upload', methods=['POST'])
def upload_post():
    caption = request.form.get("caption")


    user_id = get_user_id_from_jwt()
    if not user_id:
        return jsonify({'message' : 'Not authorized'}), 401
    
    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    if 'file' not in request.files:
        return jsonify({'message': 'File not found' }), 404
    
    file = request.files.get('file')
    if not file:
        return jsonify({'message': 'File not selected' }), 404
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        if not filepath.startswith(UPLOAD_FOLDER):  # ça permet d'éviter les attaques par Directory traversal attack
            return jsonify({'message': 'Invalid file path' }), 400
        

        # une fois l'auth vérifiée on assigne la photo uploadée au post de l'utilisateur et ses données qui suivent
        file.save(filepath)
        try:
            new_post = Post(
                image_url=filename,
                caption=caption,
                user_id=user_id
            )
            db.session.add(new_post)
            db.session.commit()
        except: 
            db.session.rollback()
            return jsonify({'message': 'An error occurred while updating profile picture'}), 500
        
        return jsonify({
            'message': 'Post uploaded successfully',
            'post_url': f'/post/{new_post.id}',
            'post': {
                'caption': new_post.caption,
                'user_id':new_post.user_id,
                'created_at': str(new_post.created_at),
            }
        }), 200
        

"""
route pour afficher les infos d'un post
/!\ à faire - renvoyer les commentaires et likes associés au post
"""
@post_bp.route('/<id_post>', methods=['GET'])
def show_post(id_post):
    if not id_post:
        jsonify({'message': 'Missing the post id'}), 400
    
    post = Post.query.filter_by(id=id_post).first()
    if not post:
        return jsonify({'message': "The post was not found"}), 404

    return jsonify({
        'message': 'Post found',
        'post': {
            'id': post.id,
            'image_url': post.image_url,
            'caption': post.caption,
            'user_id': post.user_id,
            'created_at': str(post.created_at),
        }
    }), 200


@post_bp.route('/delete', methods=['POST'])
def delete_post():
    return

# Récupérer tous les posts (ex: page Explore). 
@post_bp.route('/get-all', methods=['POST'])
def get_all_post():
    return

# Récupérer les posts d'un utilisateur spécifique (ex: profil utilisateur). 
@post_bp.route('/get-user/', methods=['POST'])
def get_user_post():
    return

# Récupérer les posts des personnes suivies (ex: feed principal).
@post_bp.route('/get-followed', methods=['POST'])
def get_followed_post():
    return