from flask import request, jsonify
from flask_restful import Resource
from flask_cors import cross_origin
from app.utils.jwt_auth import generate_token, token_required
from app.models.user import User
from app.services.email_service import email_service
from app.utils.recaptcha import RecaptchaVerifier
from email_validator import validate_email, EmailNotValidError
import secrets
from datetime import datetime, timedelta

ALLOWED_ORIGINS = ['http://localhost', 'http://localhost:3000', 'http://localhost:80']

class LoginResource(Resource):
    decorators = [cross_origin(origins=ALLOWED_ORIGINS)]
    
    def post(self):
        """User login with email/username and password"""
        try:
            data = request.get_json()
            
            if not data or not data.get('login') or not data.get('password'):
                return {
                    'success': False,
                    'message': 'Email/username and password are required'
                }, 400
            
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
                return {
                    'success': False,
                    'message': recaptcha_result['message']
                }, 400
            
            # Find user by email or username
            user = User.find_by_login(login_identifier)
            if not user or not user.check_password(password):
                return {
                    'success': False,
                    'message': 'Invalid email or password'
                }, 401
            
            # Check if user is verified (Skip for development)
            # if not user.is_verified:
            #     return {
            #         'success': False,
            #         'message': 'Please verify your email address before logging in',
            #         'need_verification': True
            #     }, 401
            
            # Generate JWT token with remember_me setting
            token = generate_token(user._id, remember_me)
            
            return {
                'success': True,
                'data': {
                    'token': token,
                    'user': {
                        'id': str(user._id),
                        'email': user.email,
                        'username': user.username,
                        'name': user.name,
                        'picture': user.picture,
                        'phone': user.phone,
                        'is_verified': user.is_verified
                    },
                    'remember_me': remember_me
                },
                'message': 'Login successful'
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Login failed: {str(e)}'
            }, 500

class RegisterResource(Resource):
    decorators = [cross_origin(origins=ALLOWED_ORIGINS)]
    
    def post(self):
        """User registration"""
        try:
            data = request.get_json()
            
            if not data:
                return {
                    'success': False,
                    'message': 'Request data is required'
                }, 400
            
            # Validate required fields
            required_fields = ['email', 'password', 'name']
            for field in required_fields:
                if not data.get(field):
                    return {
                        'success': False,
                        'message': f'{field.capitalize()} is required'
                    }, 400
            
            email = data['email'].lower().strip()
            password = data['password']
            name = data['name'].strip()
            username = data.get('username', '').strip()
            phone = data.get('phone', '').strip()
            date_of_birth = data.get('date_of_birth')
            gender = data.get('gender')
            recaptcha_response = data.get('recaptcha_token')
            
            # Verify reCAPTCHA
            recaptcha_result = RecaptchaVerifier.verify_recaptcha(
                recaptcha_response, 
                request.environ.get('REMOTE_ADDR')
            )
            
            if not recaptcha_result['success']:
                return {
                    'success': False,
                    'message': recaptcha_result['message']
                }, 400
            
            # Validate email format
            is_valid, error_msg = User.validate_email(email)
            if not is_valid:
                return {
                    'success': False,
                    'message': error_msg
                }, 400
            
            # Validate password strength (pass username for validation)
            is_valid, error_msg = User.validate_password(password, username)
            if not is_valid:
                return {
                    'success': False,
                    'message': error_msg
                }, 400
            
            # Validate username if provided
            if username:
                is_valid, error_msg = User.validate_username(username)
                if not is_valid:
                    return {
                        'success': False,
                        'message': error_msg
                    }, 400

            # Validate age (16+)
            if date_of_birth:
                is_valid, error_msg = User.validate_age(date_of_birth)
                if not is_valid:
                    return {
                        'success': False,
                        'message': error_msg
                    }, 400

            # Validate phone number
            if phone:
                is_valid, error_msg = User.validate_phone(phone)
                if not is_valid:
                    return {
                        'success': False,
                        'message': error_msg
                    }, 400
            # Check if user already exists
            existing_user = User.find_by_email(email)
            if existing_user:
                return {
                    'success': False,
                    'message': 'Email đã tồn tại trong hệ thống'
                }, 409
            
            # Check if username already exists (if username provided)
            if username:
                existing_username = User.find_by_username(username)
                if existing_username:
                    return {
                        'success': False,
                        'message': 'Username đã tồn tại trong hệ thống'
                    }, 409
            
            # Create new user
            user = User(
                email=email,
                name=name,
                username=username,
                password=password,
                phone=phone,
                date_of_birth=date_of_birth,
                gender=gender
            )

            # Validate all registration data
            is_valid, validation_errors = user.validate_registration_data()
            if not is_valid:
                return {
                    'success': False,
                    'message': '; '.join(validation_errors)
                }, 400
            # Generate verification token
            verification_token = secrets.token_urlsafe(32)
            user.verification_token = verification_token
            user.save()
            
            # Send verification email
            email_sent = email_service.send_verification_email(
                user.email, 
                verification_token, 
                user.name
            )
            
            if not email_sent:
                print(f"⚠️ Failed to send verification email to {user.email}")
            
            # For development, auto-verify users for immediate login
            user.is_verified = True
            user.verification_token = None
            user.save()
            
            return {
                'success': True,
                'data': {
                    'user': {
                        'id': str(user._id),
                        'email': user.email,
                        'username': user.username,
                        'name': user.name,
                        'phone': user.phone,
                        'date_of_birth': user.date_of_birth,
                        'gender': user.gender,
                        'is_verified': user.is_verified
                    }
                },
                'message': 'Registration successful. You can now log in.'
            }, 201
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Registration failed: {str(e)}'
            }, 500

class ForgotPasswordResource(Resource):
    decorators = [cross_origin(origins=ALLOWED_ORIGINS)]
    
    def post(self):
        """Request password reset"""
        try:
            data = request.get_json()
            
            if not data or not data.get('email'):
                return {
                    'success': False,
                    'message': 'Email is required'
                }, 400
            
            email = data['email'].lower().strip()
            
            # Find user by email
            user = User.find_by_email(email)
            if not user:
                # Don't reveal if email exists or not for security
                return {
                    'success': True,
                    'message': 'If an account with this email exists, you will receive a password reset link.'
                }, 200
            
            # Generate reset token
            reset_token = user.generate_reset_token()
            user.save()
            
            # TODO: Send reset email here
            # For development, return the token (remove in production)
            return {
                'success': True,
                'message': 'Password reset link has been sent to your email.',
                'reset_token': reset_token  # Remove this in production
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Password reset failed: {str(e)}'
            }, 500

class ResetPasswordResource(Resource):
    decorators = [cross_origin(origins=ALLOWED_ORIGINS)]
    
    def post(self):
        """Reset password with token"""
        try:
            data = request.get_json()
            
            if not data or not data.get('token') or not data.get('password'):
                return {
                    'success': False,
                    'message': 'Token and new password are required'
                }, 400
            
            token = data['token']
            new_password = data['password']
            
            # Validate password strength
            if len(new_password) < 6:
                return {
                    'success': False,
                    'message': 'Password must be at least 6 characters long'
                }, 400
            
            # Find user by reset token
            from app.utils.database import get_db
            db = get_db()
            collection = db.users
            
            user_data = collection.find_one({'reset_token': token})
            if not user_data:
                return {
                    'success': False,
                    'message': 'Invalid or expired reset token'
                }, 400
            
            user = User.from_dict(user_data)
            
            # Verify token is not expired
            if not user.verify_reset_token(token):
                return {
                    'success': False,
                    'message': 'Invalid or expired reset token'
                }, 400
            
            # Reset password
            user.set_password(new_password)
            user.reset_token = None
            user.reset_token_expires = None
            user.save()
            
            return {
                'success': True,
                'message': 'Password has been reset successfully. You can now log in.'
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Password reset failed: {str(e)}'
            }, 500

class AuthResource(Resource):
    decorators = [cross_origin(origins=ALLOWED_ORIGINS)]
    
    @token_required
    def get(self):
        """Get current user profile"""
        try:
            user = request.current_user
            
            return {
                'success': True,
                'data': {
                    'user': {
                        'id': str(user._id),
                        'email': user.email,
                        'name': user.name,
                        'picture': user.picture,
                        'is_verified': user.is_verified
                    }
                },
                'message': 'User profile retrieved successfully'
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to get user profile: {str(e)}'
            }, 500
    
    def options(self):
        """Handle preflight OPTIONS request"""
        return {}, 200

class VerifyEmailResource(Resource):
    decorators = [cross_origin(origins=ALLOWED_ORIGINS)]
    
    def post(self):
        """Verify email with token"""
        try:
            data = request.get_json()
            
            if not data or not data.get('token'):
                return {
                    'success': False,
                    'message': 'Verification token is required'
                }, 400
            
            verification_token = data['token']
            
            # Find user with this verification token
            user = User.find_by_verification_token(verification_token)
            if not user:
                return {
                    'success': False,
                    'message': 'Invalid or expired verification token'
                }, 400
            
            # Check if already verified
            if user.is_verified:
                return {
                    'success': True,
                    'message': 'Email is already verified'
                }, 200
            
            # Verify user
            user.is_verified = True
            user.verification_token = None
            user.save()
            
            return {
                'success': True,
                'message': 'Email verified successfully! You can now login.'
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Email verification failed: {str(e)}'
            }, 500
    
    def get(self):
        """Verify email with token from URL"""
        try:
            verification_token = request.args.get('token')
            
            if not verification_token:
                return {
                    'success': False,
                    'message': 'Verification token is required'
                }, 400
            
            # Find user with this verification token
            user = User.find_by_verification_token(verification_token)
            if not user:
                return {
                    'success': False,
                    'message': 'Invalid or expired verification token'
                }, 400
            
            # Check if already verified
            if user.is_verified:
                return {
                    'success': True,
                    'message': 'Email is already verified'
                }, 200
            
            # Verify user
            user.is_verified = True
            user.verification_token = None
            user.save()
            
            return {
                'success': True,
                'message': 'Email verified successfully! You can now login.'
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Email verification failed: {str(e)}'
            }, 500

class ResendVerificationResource(Resource):
    def post(self):
        """Resend verification email"""
        try:
            data = request.get_json()
            
            if not data or not data.get('email'):
                return {
                    'success': False,
                    'message': 'Email is required'
                }, 400
            
            email = data['email'].lower().strip()
            
            # Find user by email
            user = User.find_by_login(email)
            if not user:
                return {
                    'success': False,
                    'message': 'User not found'
                }, 404
            
            # Check if already verified
            if user.is_verified:
                return {
                    'success': False,
                    'message': 'Email is already verified'
                }, 400
            
            # Generate new verification token
            verification_token = secrets.token_urlsafe(32)
            user.verification_token = verification_token
            user.save()
            
            # Send verification email
            email_sent = email_service.send_verification_email(
                user.email, 
                verification_token, 
                user.name
            )
            
            if not email_sent:
                return {
                    'success': False,
                    'message': 'Failed to send verification email'
                }, 500
            
            return {
                'success': True,
                'message': 'Verification email sent successfully'
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to resend verification email: {str(e)}'
            }, 500