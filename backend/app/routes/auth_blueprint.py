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
