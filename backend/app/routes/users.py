from flask import request, jsonify
from flask_restful import Resource
from app.utils.jwt_auth import token_required
from app.models.user import User

class UserResource(Resource):
    @token_required
    def get(self):
        """Get current user profile"""
        try:
            # Get user ID from JWT token
            user_id = request.current_user_id
            
            # Find user in database
            user = User.find_by_id(user_id)
            
            if not user:
                return {
                    'success': False,
                    'message': 'User not found'
                }, 404
            
            return {
                'success': True,
                'data': {
                    'id': str(user._id),
                    'email': user.email,
                    'name': user.name,
                    'picture': user.picture,
                    'created_at': user.created_at.isoformat(),
                    'updated_at': user.updated_at.isoformat()
                },
                'message': 'User profile retrieved successfully'
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to get user profile: {str(e)}'
            }, 500

    @token_required
    def put(self):
        """Update user profile"""
        try:
            # Get user ID from JWT token
            user_id = request.current_user_id
            
            # Find user in database
            user = User.find_by_id(user_id)
            
            if not user:
                return {
                    'success': False,
                    'message': 'User not found'
                }, 404
            
            # Get update data from request
            data = request.get_json()
            
            # Update user fields
            if 'name' in data:
                user.name = data['name']
            if 'email' in data:
                user.email = data['email']
            if 'picture' in data:
                user.picture = data['picture']
            
            # Save updated user
            user.save()
            
            return {
                'success': True,
                'data': {
                    'id': str(user._id),
                    'email': user.email,
                    'name': user.name,
                    'picture': user.picture,
                    'updated_at': user.updated_at.isoformat()
                },
                'message': 'User profile updated successfully'
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to update user profile: {str(e)}'
            }, 500
