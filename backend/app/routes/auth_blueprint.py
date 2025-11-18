from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from app.utils.jwt_auth import generate_token, decode_token
from app.models.user import User
from app.services.email_service import email_service
from app.utils.recaptcha import RecaptchaVerifier
from email_validator import validate_email, EmailNotValidError
import secrets
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)

ALLOWED_ORIGINS = ['http://localhost', 'http://localhost:3000', 'http://localhost:80']

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
def login():
    """User login with email/username and password"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        data = request.get_json()
        
        if not data or not data.get('login') or not data.get('password'):
            return jsonify({
                'success': False,
                'message': 'Email/username and password are required'
            }), 400
        
        login_identifier = data['login'].lower().strip()
        password = data['password']
        remember_me = data.get('remember_me', False)
        recaptcha_response = data.get('recaptcha_token')
        
        # Verify reCAPTCHA
        recaptcha_result = RecaptchaVerifier.verify_recaptcha(
            recaptcha_response, 
            request.environ.get('REMOTE_ADDR')
        )
        
        if not recaptcha_result['success']:
            return jsonify({
                'success': False,
                'message': recaptcha_result['message']
            }), 400
        
        # Find user by email or username
        user = User.find_by_login(login_identifier)
        if not user or not user.check_password(password):
            return jsonify({
                'success': False,
                'message': 'Invalid email or password'
            }), 401
        
        # Generate token
        token = generate_token(user._id, remember_me)
        
        # Track login activity for analytics
        from app.models.login_activity import LoginActivity
        client_ip = request.environ.get('HTTP_X_REAL_IP', request.environ.get('REMOTE_ADDR'))
        browser_info = request.headers.get('User-Agent')
        login_tracker = LoginActivity(user._id, client_ip, browser_info)
        login_tracker.record_login()
        
        return jsonify({
            'success': True,
            'data': {
                'token': token,
                'user': {
                    'id': str(user._id),
                    'email': user.email,
                    'name': user.name,
                    'picture': user.picture,
                    'role': user.role,
                    'is_verified': user.is_verified,
                    'provider_info': user.provider_info
                },
                'remember_me': remember_me
            },
            'message': 'Login successful'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Login failed: {str(e)}'
        }), 500


@auth_bp.route('/simple-login', methods=['POST', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
def simple_login():
    """Simplified login without reCAPTCHA verification"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        from werkzeug.security import check_password_hash
        
        data = request.get_json()
        
        if not data or not data.get('login') or not data.get('password'):
            return jsonify({
                'success': False,
                'message': 'Email và mật khẩu là bắt buộc'
            }), 400
        
        login_identifier = data['login'].lower().strip()
        password = data['password']
        remember_me = data.get('remember_me', False)
        
        # Find user by email
        user = User.find_by_login(login_identifier)
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'Email hoặc mật khẩu không đúng'
            }), 401
        
        # Check password
        if not user.check_password(password):
            return jsonify({
                'success': False,
                'message': 'Email hoặc mật khẩu không đúng'
            }), 401
        
        # Generate token
        token = generate_token(user._id, remember_me)
        
        # Track login activity
        from app.models.login_activity import LoginActivity
        ip_address = request.environ.get('HTTP_X_REAL_IP', request.environ.get('REMOTE_ADDR'))
        user_agent = request.headers.get('User-Agent')
        activity = LoginActivity(user._id, ip_address, user_agent)
        activity.record_login()
        
        # Create user data to return
        user_data = {
            'id': str(user._id),
            'email': user.email,
            'fullName': user.name,
            'role': user.role,
            'accountStatus': 'active' if user.is_verified else 'pending'
        }
        
        return jsonify({
            'success': True,
            'message': 'Đăng nhập thành công!',
            'data': {
                'token': token,
                'user': user_data,
                'remember_me': remember_me
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Đã xảy ra lỗi trong quá trình đăng nhập: {str(e)}'
        }), 500


@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
def register():
    """User registration"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'name']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False,
                    'message': f'Field {field} is required'
                }), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        name = data['name']
        recaptcha_response = data.get('recaptcha_token')
        
        # Verify reCAPTCHA
        recaptcha_result = RecaptchaVerifier.verify_recaptcha(
            recaptcha_response,
            request.environ.get('REMOTE_ADDR')
        )
        
        if not recaptcha_result['success']:
            return jsonify({
                'success': False,
                'message': recaptcha_result['message']
            }), 400
        
        # Validate email
        try:
            validate_email(email)
        except EmailNotValidError:
            return jsonify({
                'success': False,
                'message': 'Invalid email format'
            }), 400
        
        # Check if user already exists
        existing_user = User.find_by_email(email)
        if existing_user:
            return jsonify({
                'success': False,
                'message': 'Email already registered'
            }), 400
        
        # Create new user
        user = User(
            email=email,
            name=name,
            role='user',
            is_verified=False
        )
        user.set_password(password)
        user.save()
        
        # Generate verification token
        verification_token = secrets.token_urlsafe(32)
        user.verification_token = verification_token
        user.verification_token_expiry = datetime.utcnow() + timedelta(hours=24)
        user.save()
        
        # Send verification email
        verification_link = f"{request.host_url}api/auth/verify-email?token={verification_token}"
        email_service.send_verification_email(email, name, verification_link)
        
        return jsonify({
            'success': True,
            'message': 'Registration successful. Please check your email to verify your account.',
            'data': {
                'email': email,
                'name': name
            }
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Registration failed: {str(e)}'
        }), 500


@auth_bp.route('/profile', methods=['GET', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
def get_profile():
    """Get current user profile"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    # Get token from Authorization header
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({
            'success': False,
            'message': 'Token is missing'
        }), 401
    
    try:
        user_id = decode_token(token.replace('Bearer ', ''))
        
        if not user_id:
            return jsonify({
                'success': False,
                'message': 'Invalid or expired token'
            }), 401
        
        user = User.find_by_id(user_id)
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': {
                'user': {
                    'id': str(user._id),
                    'email': user.email,
                    'name': user.name,
                    'picture': user.picture,
                    'is_verified': user.is_verified,
                    'role': user.role,
                    'provider_info': user.provider_info
                }
            },
            'message': 'User profile retrieved successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to get user profile: {str(e)}'
        }), 500


@auth_bp.route('/forgot-password', methods=['POST', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
def forgot_password():
    """Request password reset"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({
                'success': False,
                'message': 'Email is required'
            }), 400
        
        email = data['email'].lower().strip()
        user = User.find_by_email(email)
        
        if not user:
            return jsonify({
                'success': True,
                'message': 'If email exists, reset link has been sent'
            }), 200
        
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        user.reset_token = reset_token
        user.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
        user.save()
        
        # Send reset email
        email_service.send_password_reset_email(user.email, reset_token)
        
        return jsonify({
            'success': True,
            'message': 'Password reset link has been sent to your email'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to process request: {str(e)}'
        }), 500


@auth_bp.route('/reset-password', methods=['POST', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
def reset_password():
    """Reset password with token"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        data = request.get_json()
        
        if not data or not data.get('token') or not data.get('password'):
            return jsonify({
                'success': False,
                'message': 'Token and password are required'
            }), 400
        
        token = data['token']
        new_password = data['password']
        
        user = User.find_by_reset_token(token)
        
        if not user or user.reset_token_expiry < datetime.utcnow():
            return jsonify({
                'success': False,
                'message': 'Invalid or expired reset token'
            }), 400
        
        # Update password
        user.set_password(new_password)
        user.reset_token = None
        user.reset_token_expiry = None
        user.save()
        
        return jsonify({
            'success': True,
            'message': 'Password has been reset successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Password reset failed: {str(e)}'
        }), 500

@auth_bp.route('/recaptcha-config', methods=['GET', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
def get_recaptcha_config():
    """Get reCAPTCHA configuration"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        import os
        recaptcha_site_key = os.getenv('RECAPTCHA_SITE_KEY', '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI')
        
        return jsonify({
            'success': True,
            'data': {
                'siteKey': recaptcha_site_key,
                'enabled': bool(recaptcha_site_key)
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to get reCAPTCHA config: {str(e)}'
        }), 500

@auth_bp.route('/send-verification', methods=['POST', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
def send_verification():
    """Send verification email to user"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        # Get user from token
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({
                'success': False,
                'message': 'Authentication required'
            }), 401
        
        # Decode token (returns user_id string directly)
        user_id = decode_token(token)
        if not user_id:
            return jsonify({
                'success': False,
                'message': 'Invalid token'
            }), 401
        
        # Find user
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        # Check if already verified
        if user.is_verified:
            return jsonify({
                'success': False,
                'message': 'Email đã được xác thực'
            }), 400
        
        # Check rate limiting
        can_send, message = user.can_send_verification_email()
        if not can_send:
            return jsonify({
                'success': False,
                'message': message
            }), 429
        
        # Generate new verification token
        verification_token = user.generate_verification_token()
        user.mark_verification_sent()
        
        # Debug logging
        print(f"🔑 Generated token: {verification_token[:40]}...")
        print(f"⏰ Token expires (timestamp): {user.verification_token_expires}")
        print(f"📊 Sent count: {user.verification_sent_count}")
        print(f"🆔 User ID: {user._id if hasattr(user, '_id') else 'NO _id!'}")
        print(f"📧 User email: {user.email}")
        
        user.save()
        print(f"💾 User saved to DB")
        
        # Verify save worked
        from app.utils.database import get_db
        db = get_db()
        saved_user = db.users.find_one({'_id': user._id})
        if saved_user:
            print(f"✅ Verified: Token in DB = {saved_user.get('verification_token')[:20] if saved_user.get('verification_token') else 'NONE'}...")
        else:
            print(f"❌ ERROR: User not found in DB after save!")
        
        # Send verification email
        email_sent = email_service.send_verification_email(
            user.email, 
            verification_token, 
            user.name
        )
        
        if not email_sent:
            return jsonify({
                'success': False,
                'message': 'Không thể gửi email xác thực. Vui lòng thử lại sau.'
            }), 500
        
        return jsonify({
            'success': True,
            'message': f'Email xác thực đã được gửi đến {user.email}',
            'data': {
                'email': user.email,
                'sent_count': user.verification_sent_count,
                'can_resend_in': 60
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Lỗi gửi email xác thực: {str(e)}'
        }), 500


@auth_bp.route('/verify-email', methods=['GET', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
def verify_email():
    """Verify email using token from email link"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        # Get token from query params
        token = request.args.get('token')
        if not token:
            return jsonify({
                'success': False,
                'message': 'Token không hợp lệ'
            }), 400
        
        # Find user with this verification token
        from app.utils.database import get_db
        db = get_db()
        
        # Note: verification_token_expires is stored as timestamp (float)
        current_timestamp = datetime.utcnow().timestamp()
        user_data = db.users.find_one({
            'verification_token': token,
            'verification_token_expires': {'$gt': current_timestamp}
        })
        
        if not user_data:
            # Check if token expired
            expired_user = db.users.find_one({
                'verification_token': token
            })
            
            if expired_user:
                return jsonify({
                    'success': False,
                    'message': 'Token đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.'
                }), 400
            else:
                return jsonify({
                    'success': False,
                    'message': 'Token không hợp lệ'
                }), 400
        
        # Update user as verified
        db.users.update_one(
            {'_id': user_data['_id']},
            {
                '$set': {
                    'is_verified': True,
                    'verification_token': None,
                    'verification_token_expiry': None,
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        return jsonify({
            'success': True,
            'message': 'Email đã được xác thực thành công!',
            'data': {
                'email': user_data['email'],
                'is_verified': True
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Lỗi xác thực email: {str(e)}'
        }), 500
