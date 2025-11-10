from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from app.utils.jwt_auth import decode_token
from app.models.user import User

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
        payload = decode_token(token.replace('Bearer ', ''))
        user = User.find_by_id(payload['user_id'])
        
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
                    'is_verified': user.is_verified
                }
            },
            'message': 'User profile retrieved successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to get user profile: {str(e)}'
        }), 500
