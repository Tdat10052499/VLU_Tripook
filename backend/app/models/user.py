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
        self.is_verified = False  # Require email verification
        self.verification_token = None
        self.verification_token_expires = None
        self.verification_sent_count = 0  # Track rate limiting
        self.last_verification_sent = None  # Timestamp of last email sent
        self.reset_token = None
        self.reset_token_expires = None
        self.role = "user"  # 'user', 'provider', 'admin'
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
        
        # Provider-specific information (only set when role becomes 'provider')
        self.provider_info = None
        
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def set_password(self, password):
        """Hash and set password using Werkzeug (consistent with registration)"""
        from werkzeug.security import generate_password_hash
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Check if provided password matches hash"""
        if not self.password_hash:
            return False
        from werkzeug.security import check_password_hash
        try:
            return check_password_hash(self.password_hash, password)
        except Exception:
            # Fallback: try bcrypt for old passwords
            try:
                return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
            except Exception:
                return False

    def generate_verification_token(self, expires_in=86400):
        """Generate email verification token (expires in 24 hours by default)"""
        self.verification_token = secrets.token_urlsafe(32)
        self.verification_token_expires = datetime.utcnow().timestamp() + expires_in
        return self.verification_token

    def verify_email_token(self, token):
        """Verify email token"""
        if not self.verification_token or self.verification_token != token:
            return False
        if datetime.utcnow().timestamp() > self.verification_token_expires:
            return False
        return True
    
    def can_send_verification_email(self):
        """Check if user can send verification email (rate limiting: 3 emails per hour)"""
        # Already verified
        if self.is_verified:
            return False, "Email đã được xác thực"
        
        # Check rate limiting
        if self.last_verification_sent:
            time_since_last = datetime.utcnow().timestamp() - self.last_verification_sent
            
            # Reset count after 1 hour
            if time_since_last >= 3600:
                self.verification_sent_count = 0
            
            # Check if exceeded limit (3 emails per hour)
            if self.verification_sent_count >= 3 and time_since_last < 3600:
                remaining_time = int((3600 - time_since_last) / 60)
                return False, f"Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau {remaining_time} phút"
            
            # Check cooldown (60 seconds between emails)
            if time_since_last < 60:
                remaining_time = int(60 - time_since_last)
                return False, f"Vui lòng đợi {remaining_time} giây trước khi gửi lại"
        
        return True, "OK"
    
    def mark_verification_sent(self):
        """Mark that verification email was sent (for rate limiting)"""
        now = datetime.utcnow().timestamp()
        
        # Reset count if more than 1 hour has passed
        if self.last_verification_sent and (now - self.last_verification_sent) >= 3600:
            self.verification_sent_count = 0
        
        self.verification_sent_count += 1
        self.last_verification_sent = now

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

    @staticmethod
    def validate_age(date_of_birth):
        """Validate age (must be 16 or older)"""
        if not date_of_birth:
            return False, "Date of birth is required"
        
        try:
            if isinstance(date_of_birth, str):
                birth_date = datetime.strptime(date_of_birth, '%Y-%m-%d')
            else:
                birth_date = date_of_birth
            
            today = datetime.now()
            age = today.year - birth_date.year
            
            # Adjust if birthday hasn't occurred this year
            if today.month < birth_date.month or (today.month == birth_date.month and today.day < birth_date.day):
                age -= 1
            
            if age < 16:
                return False, "You must be at least 16 years old to register"
            
            return True, "Valid age"
            
        except (ValueError, TypeError):
            return False, "Invalid date format"

    @staticmethod
    def validate_phone(phone):
        """Validate Vietnamese phone number (10 digits, starts with 0)"""
        if not phone:
            return False, "Phone number is required"
        
        # Remove spaces and dashes
        clean_phone = re.sub(r'[\s-]', '', phone)
        
        # Check format: exactly 10 digits, starts with 0
        phone_pattern = r'^0\d{9}$'
        
        if not re.match(phone_pattern, clean_phone):
            return False, "Phone number must be exactly 10 digits and start with 0"
        
        return True, "Valid phone number"

    def validate_registration_data(self):
        """Validate all registration data"""
        errors = []
        
        # Validate age
        age_valid, age_msg = self.validate_age(self.date_of_birth)
        if not age_valid:
            errors.append(age_msg)
        
        # Validate phone
        phone_valid, phone_msg = self.validate_phone(self.phone)
        if not phone_valid:
            errors.append(phone_msg)
        
        return len(errors) == 0, errors

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
            'provider_info': self.provider_info,
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
                'verification_token_expires': self.verification_token_expires,
                'verification_sent_count': self.verification_sent_count,
                'last_verification_sent': self.last_verification_sent,
                'reset_token': self.reset_token,
                'reset_token_expires': self.reset_token_expires
            })
        
        return user_dict

    @staticmethod
    def from_dict(data):
        # Support both 'name' and 'fullName' fields for backward compatibility
        user_name = data.get('name') or data.get('fullName') or ''
        
        user = User(
            email=data['email'],
            name=user_name,
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
        user.verification_token_expires = data.get('verification_token_expires')
        user.verification_sent_count = data.get('verification_sent_count', 0)
        user.last_verification_sent = data.get('last_verification_sent')
        user.reset_token = data.get('reset_token')
        user.reset_token_expires = data.get('reset_token_expires')
        user.role = data.get('role', 'user')
        user.status = data.get('status', 'active')
        user.preferences = data.get('preferences', {
            "currency": "USD",
            "language": "en",
            "notifications": {"email": True, "push": True, "sms": False}
        })
        user.provider_info = data.get('provider_info')
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
    
    def upgrade_to_provider(self, provider_data):
        """Upgrade user to provider role with additional information"""
        self.role = "provider"
        self.provider_info = {
            "company_name": provider_data.get("company_name", ""),
            "business_type": provider_data.get("business_type", ""),  # "hotel", "tour", "transport"
            "description": provider_data.get("description", ""),
            "address": provider_data.get("address", ""),
            "business_phone": provider_data.get("business_phone", ""),
            "business_email": provider_data.get("business_email", ""),
            "website": provider_data.get("website", ""),
            "bank_account": {
                "account_number": provider_data.get("bank_account", {}).get("account_number", ""),
                "bank_name": provider_data.get("bank_account", {}).get("bank_name", ""),
                "account_holder": provider_data.get("bank_account", {}).get("account_holder", "")
            },
            "vnpay_info": {
                "merchant_id": provider_data.get("vnpay_info", {}).get("merchant_id", "")
            },
            "approved_at": datetime.utcnow(),
            "is_active": True
        }
        self.updated_at = datetime.utcnow()
        return self.save()
    
    def is_provider(self):
        """Check if user is a provider"""
        return self.role == "provider"
    
    def is_active_provider(self):
        """Check if user is an active provider"""
        return (self.role == "provider" and 
                self.provider_info and 
                self.provider_info.get("is_active", False))