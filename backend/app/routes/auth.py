from flask import request, jsonify
from flask_restful import Resource
from app.utils.jwt_auth import generate_token, token_required
from app.models.user import User
from email_validator import validate_email, EmailNotValidError

class LoginResource(Resource):
    def post(self):
        """User login with email and password"""
        try:
            data = request.get_json()
            
            if not data or not data.get('email') or not data.get('password'):
                return {
                    'success': False,
                    'message': 'Email and password are required'
                }, 400
            
            email = data['email'].lower().strip()
            password = data['password']
            
            # Find user by email
            user = User.find_by_email(email)
            if not user or not user.check_password(password):
                return {
                    'success': False,
                    'message': 'Invalid email or password'
                }, 401
            
            # Check if user is verified
            if not user.is_verified:
                return {
                    'success': False,
                    'message': 'Please verify your email address before logging in',
                    'need_verification': True
                }, 401
            
            # Generate JWT token
            token = generate_token(user._id)
            
            return {
                'success': True,
                'data': {
                    'token': token,
                    'user': {
                        'id': str(user._id),
                        'email': user.email,
                        'name': user.name,
                        'picture': user.picture,
                        'is_verified': user.is_verified
                    }
                },
                'message': 'Login successful'
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Login failed: {str(e)}'
            }, 500

class RegisterResource(Resource):
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
            
            # Validate email format
            try:
                validate_email(email)
            except EmailNotValidError:
                return {
                    'success': False,
                    'message': 'Invalid email format'
                }, 400
            
            # Validate password strength
            if len(password) < 6:
                return {
                    'success': False,
                    'message': 'Password must be at least 6 characters long'
                }, 400
            
            # Check if user already exists
            existing_user = User.find_by_email(email)
            if existing_user:
                return {
                    'success': False,
                    'message': 'User with this email already exists'
                }, 409
            
            # Create new user
            user = User(email=email, name=name, password=password)
            verification_token = user.generate_verification_token()
            user.save()
            
            # TODO: Send verification email here
            # For now, we'll auto-verify for development
            user.is_verified = True
            user.save()
            
            return {
                'success': True,
                'data': {
                    'user': {
                        'id': str(user._id),
                        'email': user.email,
                        'name': user.name,
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