from datetime import datetime
from bson import ObjectId
import bcrypt
import secrets
from app.utils.database import get_db

class User:
    def __init__(self, email, name, password=None, picture=None, phone=None, date_of_birth=None, gender=None, address=None):
        self.email = email
        self.name = name
        self.picture = picture or ""
        self.phone = phone or ""
        self.date_of_birth = date_of_birth
        self.gender = gender  # 'male', 'female', 'other'
        self.address = address or ""
        self.password_hash = None
        if password:
            self.set_password(password)
        self.is_verified = False
        self.verification_token = None
        self.reset_token = None
        self.reset_token_expires = None
        self.role = "user"  # 'user', 'admin'
        self.status = "active"  # 'active', 'inactive', 'suspended'
        self.preferences = {
            "currency": "USD",
            "language": "en",
            "notifications": {
                "email": True,
                "push": True,
                "sms": False
            }
        }
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def set_password(self, password):
        """Hash and set password"""
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def check_password(self, password):
        """Check if provided password matches hash"""
        if not self.password_hash:
            return False
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def generate_verification_token(self):
        """Generate email verification token"""
        self.verification_token = secrets.token_urlsafe(32)
        return self.verification_token

    def generate_reset_token(self, expires_in=3600):
        """Generate password reset token (expires in 1 hour by default)"""
        self.reset_token = secrets.token_urlsafe(32)
        self.reset_token_expires = datetime.utcnow().timestamp() + expires_in
        return self.reset_token

    def verify_reset_token(self, token):
        """Verify password reset token"""
        if not self.reset_token or self.reset_token != token:
            return False
        if datetime.utcnow().timestamp() > self.reset_token_expires:
            return False
        return True

    def to_dict(self, include_sensitive=False):
        user_dict = {
            '_id': getattr(self, '_id', None),
            'email': self.email,
            'name': self.name,
            'picture': self.picture,
            'is_verified': self.is_verified,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
        
        if include_sensitive:
            user_dict.update({
                'password_hash': self.password_hash,
                'verification_token': self.verification_token,
                'reset_token': self.reset_token,
                'reset_token_expires': self.reset_token_expires
            })
        
        return user_dict

    @staticmethod
    def from_dict(data):
        user = User(
            email=data['email'],
            name=data['name'],
            picture=data.get('picture')
        )
        user._id = data.get('_id')
        user.password_hash = data.get('password_hash')
        user.is_verified = data.get('is_verified', False)
        user.verification_token = data.get('verification_token')
        user.reset_token = data.get('reset_token')
        user.reset_token_expires = data.get('reset_token_expires')
        user.created_at = data.get('created_at', datetime.utcnow())
        user.updated_at = data.get('updated_at', datetime.utcnow())
        return user

    def save(self):
        """Save user to database"""
        db = get_db()
        collection = db.users
        
        self.updated_at = datetime.utcnow()
        user_data = self.to_dict(include_sensitive=True)
        
        if hasattr(self, '_id') and self._id:
            # Update existing user
            collection.update_one(
                {'_id': self._id},
                {'$set': user_data}
            )
        else:
            # Create new user
            result = collection.insert_one(user_data)
            self._id = result.inserted_id
        
        return self

    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        db = get_db()
        collection = db.users
        
        user_data = collection.find_one({'email': email})
        if user_data:
            return User.from_dict(user_data)
        return None

    @staticmethod
    def find_by_id(user_id):
        """Find user by MongoDB ID"""
        db = get_db()
        collection = db.users
        
        try:
            user_data = collection.find_one({'_id': ObjectId(user_id)})
            if user_data:
                return User.from_dict(user_data)
        except:
            pass
        return None