import jwt
from datetime import datetime, timedelta
from flask import current_app
from functools import wraps
from flask import request, jsonify
from app.models.user import User

def generate_token(user_id, remember_me=False):
    """Generate JWT token for user"""
    # Set token expiration based on remember_me
    expiration_time = timedelta(days=30) if remember_me else timedelta(days=1)
    
    payload = {
        'user_id': str(user_id),
        'exp': datetime.utcnow() + expiration_time,
        'iat': datetime.utcnow(),
        'remember_me': remember_me
    }
    
    return jwt.encode(
        payload,
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )

def decode_token(token):
    """Decode JWT token and return user_id"""
    try:
        payload = jwt.decode(
            token,
            current_app.config['SECRET_KEY'],
            algorithms=['HS256']
        )
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    """Decorator to require JWT authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({'message': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        # Decode token and get user
        user_id = decode_token(token)
        if not user_id:
            return jsonify({'message': 'Token is invalid or expired'}), 401
        
        # Find user in database
        current_user = User.find_by_id(user_id)
        if not current_user:
            return jsonify({'message': 'User not found'}), 401
        
        # Add current user to request context
        request.current_user = current_user
        
        return f(*args, **kwargs)
    
    return decorated