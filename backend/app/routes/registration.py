from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
from app.utils.database import get_db
from app.utils.jwt_auth import generate_token
from app.services.email_service import send_verification_email
import random
import string
from datetime import datetime, timedelta
from bson import ObjectId
import re

registration_bp = Blueprint('registration', __name__, url_prefix='/api/registration')

# CORS origins configuration
ALLOWED_ORIGINS = ['http://localhost', 'http://localhost:3000', 'http://localhost:80']

# Test route to verify blueprint is working
@registration_bp.route('/test', methods=['GET'])
@cross_origin(origins=ALLOWED_ORIGINS)
def test_route():
    return jsonify({'message': 'Registration blueprint is working!'})

def generate_verification_code():
    """Generate a 6-digit verification code"""
    return ''.join(random.choices(string.digits, k=6))

def validate_email(email):
    """Validate email format"""
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    """Validate Vietnamese phone number"""
    pattern = r'^[0-9]{10,11}$'
    return re.match(pattern, phone.replace(' ', '')) is not None

@registration_bp.route('/register', methods=['POST', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS)
def register_user():
    try:
        data = request.get_json()
        print(f"Registration data received: {data}")  # Debug log
        
        # Validate required fields
        required_fields = ['userType', 'email', 'password', 'fullName', 'phone']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False,
                    'message': f'Trường {field} là bắt buộc'
                }), 400

        email = data['email'].lower().strip()
        user_type = data['userType']
        
        # Validate email format
        if not validate_email(email):
            return jsonify({
                'success': False,
                'message': 'Email không hợp lệ'
            }), 400

        # Validate phone format
        if not validate_phone(data['phone']):
            return jsonify({
                'success': False,
                'message': 'Số điện thoại không hợp lệ'
            }), 400

        # Validate password
        if len(data['password']) < 6:
            return jsonify({
                'success': False,
                'message': 'Mật khẩu phải có ít nhất 6 ký tự'
            }), 400

        # Check password confirmation
        if data['password'] != data.get('confirmPassword'):
            return jsonify({
                'success': False,
                'message': 'Mật khẩu xác nhận không khớp'
            }), 400

        # Get database
        db = get_db()
        
        # Check if email already exists
        existing_user = db.users.find_one({'email': email})
        if existing_user:
            return jsonify({
                'success': False,
                'message': 'Email đã được sử dụng'
            }), 400

        # Validate provider specific fields
        if user_type == 'provider':
            provider_fields = ['companyName', 'businessType', 'businessAddress']
            for field in provider_fields:
                if field not in data or not data[field]:
                    return jsonify({
                        'success': False,
                        'message': f'Trường {field} là bắt buộc cho nhà cung cấp'
                    }), 400

        # Create user document
        user_doc = {
            'email': email,
            'name': data['fullName'],
            'username': data['fullName'].replace(' ', '').lower(),
            'password_hash': generate_password_hash(data['password']),
            'phone': data['phone'],
            'picture': '',
            'address': '',
            'role': 'provider' if user_type == 'provider' else 'user',
            'status': 'active',  # Active ngay, không cần admin duyệt
            'is_verified': True,  # Bỏ qua xác thực email
            'preferences': {
                'currency': 'VND',
                'language': 'vi',
                'notifications': {'email': True, 'push': True, 'sms': False}
            },
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }

        # Add provider specific fields
        if user_type == 'provider':
            user_doc['provider_info'] = {
                'company_name': data['companyName'],
                'business_type': data['businessType'],
                'address': data['businessAddress'],
                'business_license': data.get('businessLicense', ''),
                'description': data.get('businessDescription', ''),
                'is_active': True,
                'approved_at': datetime.utcnow()
            }

        # Insert user
        result = db.users.insert_one(user_doc)
        user_id = str(result.inserted_id)

        # Generate JWT token cho user mới
        token = generate_token(user_id)
        
        # Tạo user object để trả về
        user_data = {
            'id': user_id,
            'email': email,
            'fullName': data['fullName'],
            'role': user_doc['role'],
            'accountStatus': user_doc['accountStatus']
        }

        return jsonify({
            'success': True,
            'message': 'Đăng ký thành công!',
            'token': token,
            'user': user_data
        }), 201

    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra trong quá trình đăng ký'
        }), 500

@registration_bp.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS)
def simple_login():
    """Simple login without reCAPTCHA for development"""
    try:
        data = request.get_json()
        
        if not data or not data.get('login') or not data.get('password'):
            return jsonify({
                'success': False,
                'message': 'Email/username và password là bắt buộc'
            }), 400
        
        login_identifier = data['login'].lower().strip()
        password = data['password']
        remember_me = data.get('remember_me', False)
        
        # Get database
        db = get_db()
        
        # Find user by email or username
        user_data = db.users.find_one({
            '$or': [
                {'email': login_identifier},
                {'username': login_identifier}
            ]
        })
        
        if not user_data:
            return jsonify({
                'success': False,
                'message': 'Email hoặc mật khẩu không đúng'
            }), 401
        
        # Check password
        password_hash = user_data.get('password_hash')
        if not password_hash or not check_password_hash(password_hash, password):
            return jsonify({
                'success': False,
                'message': 'Email hoặc mật khẩu không đúng'
            }), 401
        
        # Generate JWT token
        user_id = str(user_data['_id'])
        token = generate_token(user_id, remember_me)
        
        # Prepare user data to return
        user_response = {
            'id': user_id,
            'email': user_data['email'],
            'name': user_data.get('name', ''),
            'username': user_data.get('username', ''),
            'role': user_data.get('role', 'user'),
            'status': user_data.get('status', 'active'),
            'phone': user_data.get('phone', ''),
            'picture': user_data.get('picture', ''),
            'is_verified': user_data.get('is_verified', False),
            'provider_info': user_data.get('provider_info')
        }
        
        return jsonify({
            'success': True,
            'message': 'Đăng nhập thành công',
            'data': {
                'token': token,
                'user': user_response,
                'remember_me': remember_me
            }
        }), 200
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra trong quá trình đăng nhập'
        }), 500

@registration_bp.route('/verify-email', methods=['POST', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS)
def verify_email():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('code'):
            return jsonify({
                'success': False,
                'message': 'Email và mã xác thực là bắt buộc'
            }), 400

        email = data['email'].lower().strip()
        code = data['code'].strip()

        db = get_db()
        
        # Find verification record
        verification = db.email_verifications.find_one({
            'email': email,
            'code': code,
            'isUsed': False,
            'expiresAt': {'$gt': datetime.utcnow()}
        })

        if not verification:
            # Check if code is expired or invalid
            expired_verification = db.email_verifications.find_one({
                'email': email,
                'code': code,
                'isUsed': False
            })
            
            if expired_verification:
                return jsonify({
                    'success': False,
                    'message': 'Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.'
                }), 400
            else:
                return jsonify({
                    'success': False,
                    'message': 'Mã xác thực không đúng'
                }), 400

        # Update attempts
        db.email_verifications.update_one(
            {'_id': verification['_id']},
            {'$inc': {'attempts': 1}}
        )

        # Find user
        user = db.users.find_one({'email': email})
        if not user:
            return jsonify({
                'success': False,
                'message': 'Không tìm thấy người dùng'
            }), 404

        # Mark email as verified and verification as used
        db.users.update_one(
            {'_id': user['_id']},
            {
                '$set': {
                    'isEmailVerified': True,
                    'updatedAt': datetime.utcnow()
                }
            }
        )
        
        db.email_verifications.update_one(
            {'_id': verification['_id']},
            {'$set': {'isUsed': True}}
        )

        # Generate JWT token
        token = generate_token(str(user['_id']))

        # Prepare user data for response
        user_data = {
            'id': str(user['_id']),
            'email': user['email'],
            'fullName': user['fullName'],
            'role': user['role'],
            'accountStatus': user['accountStatus']
        }

        return jsonify({
            'success': True,
            'message': 'Xác thực email thành công!',
            'token': token,
            'user': user_data
        }), 200

    except Exception as e:
        print(f"Email verification error: {e}")
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra trong quá trình xác thực'
        }), 500

@registration_bp.route('/resend-verification', methods=['POST', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS)
def resend_verification():
    try:
        data = request.get_json()
        
        if not data.get('email'):
            return jsonify({
                'success': False,
                'message': 'Email là bắt buộc'
            }), 400

        email = data['email'].lower().strip()
        db = get_db()
        
        # Check if user exists
        user = db.users.find_one({'email': email})
        if not user:
            return jsonify({
                'success': False,
                'message': 'Không tìm thấy người dùng với email này'
            }), 404

        # Check if already verified
        if user.get('isEmailVerified'):
            return jsonify({
                'success': False,
                'message': 'Email đã được xác thực'
            }), 400

        # Check rate limiting (max 3 attempts in 10 minutes)
        recent_attempts = db.email_verifications.count_documents({
            'email': email,
            'createdAt': {'$gt': datetime.utcnow() - timedelta(minutes=10)}
        })
        
        if recent_attempts >= 3:
            return jsonify({
                'success': False,
                'message': 'Bạn đã yêu cầu quá nhiều lần. Vui lòng thử lại sau 10 phút.'
            }), 429

        # Generate new verification code
        verification_code = generate_verification_code()
        verification_doc = {
            'email': email,
            'code': verification_code,
            'expiresAt': datetime.utcnow() + timedelta(minutes=10),
            'attempts': 0,
            'isUsed': False,
            'createdAt': datetime.utcnow()
        }
        db.email_verifications.insert_one(verification_doc)

        # Send verification email
        try:
            send_verification_email(email, verification_code, user['fullName'])
        except Exception as e:
            print(f"Failed to send email: {e}")
            return jsonify({
                'success': False,
                'message': 'Không thể gửi email xác thực. Vui lòng thử lại sau.'
            }), 500

        return jsonify({
            'success': True,
            'message': 'Mã xác thực mới đã được gửi đến email của bạn'
        }), 200

    except Exception as e:
        print(f"Resend verification error: {e}")
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra khi gửi lại mã xác thực'
        }), 500

@registration_bp.route('/check-email', methods=['GET', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS)
def check_email_availability():
    try:
        email = request.args.get('email')
        print(f"Checking email availability for: {email}")  # Debug log
        
        if not email:
            return jsonify({
                'available': False,
                'message': 'Email là bắt buộc'
            }), 200

        email = email.lower().strip()
        
        # Validate email format
        if not validate_email(email):
            return jsonify({
                'available': False,
                'message': 'Email không hợp lệ'
            }), 200

        db = get_db()
        
        # Check if email exists
        existing_user = db.users.find_one({'email': email})
        is_available = existing_user is None
        
        print(f"Email {email} availability: {is_available}")  # Debug log
        
        return jsonify({
            'available': is_available
        }), 200

    except Exception as e:
        print(f"Email check error: {e}")
        return jsonify({
            'available': False,
            'message': 'Có lỗi xảy ra khi kiểm tra email'
        }), 200