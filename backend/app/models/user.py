from datetime import datetime
from bson import ObjectId
import bcrypt
import secrets
import re
from app.utils.database import get_db

class User:
    def __init__(self, email, name, password=None, username=None, picture=None, phone=None, date_of_birth=None, gender=None, address=None):
        self.email = email
        self.name = name
        self.username = username or email.split('@')[0]  # Generate username from email if not provided
        self.picture = picture or ""
        self.phone = phone or ""
        self.date_of_birth = date_of_birth
        self.gender = gender  # 'male', 'female', 'other'
        self.address = address or ""
        self.password_hash = None
        if password:
            self.set_password(password)
        self.is_verified = True  # Auto-verify for development
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
            'email': self.email,
            'name': self.name,
            'username': self.username,
            'picture': self.picture,
            'phone': self.phone,
            'date_of_birth': self.date_of_birth,
            'gender': self.gender,
            'address': self.address,
            'is_verified': self.is_verified,
            'role': self.role,
            'status': self.status,
            'preferences': self.preferences,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
        
        # Only include _id if it exists and is not None
        if hasattr(self, '_id') and self._id is not None:
            user_dict['_id'] = self._id
        
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
            username=data.get('username'),
            picture=data.get('picture'),
            phone=data.get('phone'),
            date_of_birth=data.get('date_of_birth'),
            gender=data.get('gender'),
            address=data.get('address')
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
        try:
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
            
        except Exception as e:
            print(f"Database error in User.save(): {e}")
            raise Exception(f"Could not save user to database: {str(e)}")

    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        try:
            db = get_db()
            collection = db.users
            
            user_data = collection.find_one({'email': email})
            if user_data:
                return User.from_dict(user_data)
            return None
        except Exception as e:
            print(f"Database error in User.find_by_email(): {e}")
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
    
    @staticmethod
    def validate_password(password, username=None):
        """Validate password requirements"""
        if len(password) < 6:
            return False, "Mật khẩu phải có ít nhất 6 ký tự"
        
        # Check for at least one uppercase letter
        if not any(c.isupper() for c in password):
            return False, "Mật khẩu phải có ít nhất 1 chữ cái viết hoa"
        
        # Check for at least one digit
        if not any(c.isdigit() for c in password):
            return False, "Mật khẩu phải có ít nhất 1 chữ số"
        
        # Check for at least one letter (a-z or A-Z)
        if not any(c.isalpha() for c in password):
            return False, "Mật khẩu phải có ít nhất 1 chữ cái"
        
        # Check for at least one special character
        special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
        if not any(c in special_chars for c in password):
            return False, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*()_+-=[]{}|;:,.<>?)"
        
        # Check if password contains username
        if username and username.lower() in password.lower():
            return False, "Mật khẩu không được chứa tên người dùng"
        
        return True, ""
    
    @staticmethod
    def validate_email(email):
        """Validate email format"""
        import re
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            return False, "Invalid email format"
        return True, ""
    
    @staticmethod
    def validate_username(username):
        """Validate username requirements"""
        import re
        if len(username) < 3:
            return False, "Username must be at least 3 characters long"
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            return False, "Username can only contain letters, numbers, and underscores"
        return True, ""
    
    @staticmethod
    def find_by_username(username):
        """Find user by username"""
        db = get_db()
        collection = db.users
        
        user_data = collection.find_one({'username': username})
        if user_data:
            return User.from_dict(user_data)
        return None
    
    @staticmethod
    def find_by_login(login_identifier):
        """Find user by email or username"""
        db = get_db()
        collection = db.users
        
        # Try exact match first
        user_data = collection.find_one({
            '$or': [
                {'email': login_identifier},
                {'username': login_identifier}
            ]
        })
        
        if user_data:
            return User.from_dict(user_data)
        
        # Try case-insensitive search as fallback
        user_data = collection.find_one({
            '$or': [
                {'email': {'$regex': f'^{re.escape(login_identifier)}$', '$options': 'i'}},
                {'username': {'$regex': f'^{re.escape(login_identifier)}$', '$options': 'i'}}
            ]
        })
        
        if user_data:
            return User.from_dict(user_data)
        
        return None
    
    @staticmethod
    def find_by_verification_token(token):
        """Find user by verification token"""
        db = get_db()
        collection = db.users
        
        user_data = collection.find_one({'verification_token': token})
        if user_data:
            return User.from_dict(user_data)
        return None
    
    @staticmethod
    def find_by_reset_token(token):
        """Find user by password reset token"""
        db = get_db()
        collection = db.users
        
        user_data = collection.find_one({
            'reset_token': token,
            'reset_token_expires': {'$gt': datetime.utcnow()}
        })
        if user_data:
            return User.from_dict(user_data)
        return None