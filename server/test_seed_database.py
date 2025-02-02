import unittest
from faker import Faker
import random
from flask_bcrypt import Bcrypt
import os, sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import create_app
from config import DevelopmentConfig, db
from models import User, Post, Like, Comment, Follow, Notification, Conversation, Message



bcrypt = Bcrypt()
fake = Faker()

class TestDatabaseSeeder(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Initialise l'application Flask en mode test"""
        cls.app = create_app(DevelopmentConfig)

        # temporate db in memory 
        cls.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        cls.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        cls.app.config['TESTING'] = True

        cls.app_context = cls.app.app_context()
        cls.app_context.push()
        db.create_all()

    @classmethod
    def tearDownClass(cls):
        """Nettoie la base de données après les tests"""
        db.session.remove()
        db.drop_all()
        cls.app_context.pop()

    def test_seed_database(self):
        """Remplit la base de données avec des données de test"""

        # Création des utilisateurs
        users = []
        for _ in range(10): 
            user = User(
                username=fake.user_name(),
                email=fake.email(),
                password=bcrypt.generate_password_hash("password").decode("utf-8")
            )
            db.session.add(user)
            users.append(user)

        db.session.commit()

        # posts
        posts = []
        for user in users:
            for _ in range(random.randint(1, 5)): 
                post = Post(
                    user_id=user.id,
                    content=fake.text(),
                    image_url=fake.image_url()
                )
                db.session.add(post)
                posts.append(post)

        db.session.commit()

        # likes et commentaires aléatoires
        for post in posts:
            for _ in range(random.randint(1, 5)): 
                liker = random.choice(users)
                like = Like(user_id=liker.id, post_id=post.id)
                db.session.add(like)

                commenter = random.choice(users)
                comment = Comment(user_id=commenter.id, post_id=post.id, content=fake.sentence())
                db.session.add(comment)

        db.session.commit()

        # Follows
        for user in users:
            followed_users = random.sample(users, random.randint(1, 5)) 
            for followed in followed_users:
                if user.id != followed.id: # Ne pas suivre soi-même
                    follow = Follow(follower_id=user.id, followed_id=followed.id)
                    db.session.add(follow)

        db.session.commit()

        # Ajout des conversations et messages
        conversations = []
        for _ in range(5): 
            user1, user2 = random.sample(users, 2)
            conversation = Conversation()
            db.session.add(conversation)
            db.session.commit() 

            conversations.append(conversation)

            # Messages dans la conversation
            for _ in range(random.randint(2, 10)):  # Chaque conversation contient entre 2 et 10 messages
                sender = random.choice([user1, user2])
                message = Message(
                    sender_id=sender.id,
                    conversation_id=conversation.id,
                    content=fake.sentence()
                )
                db.session.add(message)

        db.session.commit()

        print("✅ Base de données remplie avec succès !")

if __name__ == '__main__':
    unittest.main()
