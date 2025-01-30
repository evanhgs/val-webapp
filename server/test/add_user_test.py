import unittest
from config import db
from models import User, bcrypt

class TestUserModel(unittest.TestCase):

    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_set_password(self):
        user = User(username='testuser', email='test@example.com')
        user.set_password('password123')
        self.assertTrue(bcrypt.check_password_hash(user.password, 'password123'))

    def test_check_password(self):
        user = User(username='testuser', email='test@example.com')
        user.set_password('password123')
        self.assertTrue(user.check_password('password123'))
        self.assertFalse(user.check_password('wrongpassword'))

if __name__ == '__main__':
    unittest.main()