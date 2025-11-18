"""
Profile management routes
"""
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from bson import ObjectId
from datetime import datetime

from app.utils.jwt_auth import token_required, decode_token
from app.utils.database import get_db

profile_bp = Blueprint('profile', __name__)

ALLOWED_ORIGINS = ['http://localhost', 'http://localhost:3000', 'http://localhost:80']

@profile_bp.route('/profile', methods=['GET', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
def get_profile():
    """Get current user profile"""
    print(f"Profile route called! Method: {request.method}")
    
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        print("Handling OPTIONS preflight")
        return jsonify({}), 200
    
    # For GET request, require token
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
                'message': 'Token is invalid or expired'
            }), 401
        
        db = get_db()
        users_collection = db['users']
        
        user = users_collection.find_one(
            {'_id': ObjectId(user_id)},
            {'password': 0}  # Exclude password
        )
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        # Convert ObjectId to string
        user['_id'] = str(user['_id'])
        
        # Get bookings count (Chuyến đi)
        bookings_collection = db['bookings']
        bookings_count = bookings_collection.count_documents({
            'user_id': ObjectId(user_id)
        })
        
        # Get favorites count (Yêu thích)
        favorites_collection = db['favorites']
        favorites_count = favorites_collection.count_documents({
            'user_id': ObjectId(user_id)
        })
        
        # Add stats to user object
        user['stats'] = {
            'trips': bookings_count,
            'favorites': favorites_count
        }
        
        return jsonify({
            'success': True,
            'user': user,
            'message': 'User profile retrieved successfully'
        }), 200
        
    except Exception as e:
        print(f"Error getting profile: {e}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@profile_bp.route('/profile', methods=['PUT', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
def update_profile():
    """Update user profile"""
    print(f"Update profile route called! Method: {request.method}")
    
    # Handle OPTIONS request
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    # Require token
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
                'message': 'Token is invalid or expired'
            }), 401
        
        data = request.get_json()
        
        db = get_db()
        users_collection = db['users']
        
        # Fields that can be updated
        allowed_fields = ['name', 'phone', 'address', 'dateOfBirth', 'bio', 'gender']
        update_data = {}
        
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        
        if not update_data:
            return jsonify({
                'success': False,
                'message': 'No valid fields to update'
            }), 400
        
        # Add updated_at timestamp
        update_data['updated_at'] = datetime.utcnow()
        
        # Update user
        result = users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        # Get updated user
        updated_user = users_collection.find_one(
            {'_id': ObjectId(user_id)},
            {'password': 0}
        )
        updated_user['_id'] = str(updated_user['_id'])
        
        return jsonify({
            'success': True,
            'user': updated_user,
            'message': 'Profile updated successfully'
        }), 200
        
    except Exception as e:
        print(f"Error updating profile: {e}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@profile_bp.route('/profile/avatar', methods=['POST', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
def upload_avatar():
    """Upload user avatar (Base64)"""
    print(f"Upload avatar route called! Method: {request.method}")
    
    # Handle OPTIONS request
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    # Require token
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
                'message': 'Token is invalid or expired'
            }), 401
        
        data = request.get_json()
        
        if 'avatar' not in data:
            return jsonify({
                'success': False,
                'message': 'No avatar data provided'
            }), 400
        
        avatar_base64 = data['avatar']
        
        # Validate Base64 format (data:image/png;base64,...)
        if not avatar_base64.startswith('data:image/'):
            return jsonify({
                'success': False,
                'message': 'Invalid image format. Must be data URI'
            }), 400
        
        # Extract file extension
        try:
            header, encoded = avatar_base64.split(',', 1)
            image_type = header.split(';')[0].split('/')[1]  # png, jpg, jpeg, etc.
        except:
            return jsonify({
                'success': False,
                'message': 'Invalid Base64 format'
            }), 400
        
        # Validate image type
        allowed_types = ['png', 'jpg', 'jpeg', 'gif', 'webp']
        if image_type not in allowed_types:
            return jsonify({
                'success': False,
                'message': f'Invalid image type. Allowed: {", ".join(allowed_types)}'
            }), 400
        
        # Validate size (limit to 5MB)
        # Base64 encoding increases size by ~33%
        max_size = 5 * 1024 * 1024 * 4 // 3  # ~6.7MB in Base64
        if len(avatar_base64) > max_size:
            return jsonify({
                'success': False,
                'message': 'Image too large. Maximum size is 5MB'
            }), 400
        
        db = get_db()
        users_collection = db['users']
        
        # Update user avatar
        result = users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {
                '$set': {
                    'avatar': avatar_base64,
                    'avatar_updated_at': datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        return jsonify({
            'success': True,
            'avatar': avatar_base64,
            'message': 'Avatar uploaded successfully'
        }), 200
        
    except Exception as e:
        print(f"Error uploading avatar: {e}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@profile_bp.route('/profile/avatar', methods=['DELETE', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True)
def delete_avatar():
    """Delete user avatar"""
    print(f"Delete avatar route called! Method: {request.method}")
    
    # Handle OPTIONS request
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    # Require token
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
                'message': 'Token is invalid or expired'
            }), 401
        
        db = get_db()
        users_collection = db['users']
        
        # Remove avatar field
        result = users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {
                '$unset': {'avatar': '', 'avatar_updated_at': ''}
            }
        )
        
        return jsonify({
            'success': True,
            'message': 'Avatar deleted successfully'
        }), 200
        
    except Exception as e:
        print(f"Error deleting avatar: {e}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to get user profile: {str(e)}'
        }), 500
