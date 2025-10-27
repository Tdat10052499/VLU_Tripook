from flask import request
from flask_restful import Resource
from app.utils.jwt_auth import token_required
from app.models.activity import Activity
from app.models.trip import Trip
from app.models.user import User

class ActivitiesResource(Resource):
    @token_required
    def get(self, trip_id):
        """Get all activities for a trip"""
        try:
            # Get user info from token
            user_id = request.current_user_id
            # Get user_id from JWT token
            
            # Find user in database
            user = User.find_by_id(user_id)
            if not user:
                return {
                    'success': False,
                    'message': 'User not found'
                }, 404
            
            # Find trip and verify ownership
            trip = Trip.find_by_id(trip_id)
            if not trip:
                return {
                    'success': False,
                    'message': 'Trip not found'
                }, 404
            
            if trip.user_id != str(user._id):
                return {
                    'success': False,
                    'message': 'Unauthorized'
                }, 403
            
            # Get activities for the trip
            activities = Activity.find_by_trip(trip_id)
            
            # Convert activities to dict format
            activities_data = []
            for activity in activities:
                activity_dict = activity.to_dict()
                activity_dict['id'] = str(activity_dict['_id'])
                del activity_dict['_id']
                activity_dict['created_at'] = activity.created_at.isoformat()
                activity_dict['updated_at'] = activity.updated_at.isoformat()
                activities_data.append(activity_dict)
            
            return {
                'success': True,
                'data': activities_data,
                'message': 'Activities retrieved successfully'
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to get activities: {str(e)}'
            }, 500

    @token_required
    def post(self, trip_id):
        """Create a new activity for a trip"""
        try:
            # Get user info from token
            user_id = request.current_user_id
            # Get user_id from JWT token
            
            # Find user in database
            user = User.find_by_id(user_id)
            if not user:
                return {
                    'success': False,
                    'message': 'User not found'
                }, 404
            
            # Find trip and verify ownership
            trip = Trip.find_by_id(trip_id)
            if not trip:
                return {
                    'success': False,
                    'message': 'Trip not found'
                }, 404
            
            if trip.user_id != str(user._id):
                return {
                    'success': False,
                    'message': 'Unauthorized'
                }, 403
            
            # Get activity data from request
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['title', 'description', 'location', 'date']
            for field in required_fields:
                if field not in data:
                    return {
                        'success': False,
                        'message': f'Missing required field: {field}'
                    }, 400
            
            # Create new activity
            activity = Activity(
                trip_id=trip_id,
                title=data['title'],
                description=data['description'],
                location=data['location'],
                date=data['date'],
                cost=data.get('cost')
            )
            
            # Save activity
            activity.save()
            
            # Return activity data
            activity_dict = activity.to_dict()
            activity_dict['id'] = str(activity_dict['_id'])
            del activity_dict['_id']
            activity_dict['created_at'] = activity.created_at.isoformat()
            activity_dict['updated_at'] = activity.updated_at.isoformat()
            
            return {
                'success': True,
                'data': activity_dict,
                'message': 'Activity created successfully'
            }, 201
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to create activity: {str(e)}'
            }, 500

class ActivityResource(Resource):
    @token_required
    def get(self, trip_id, activity_id):
        """Get a specific activity"""
        try:
            # Get user info from token
            user_id = request.current_user_id
            # Get user_id from JWT token
            
            # Find user in database
            user = User.find_by_id(user_id)
            if not user:
                return {
                    'success': False,
                    'message': 'User not found'
                }, 404
            
            # Find trip and verify ownership
            trip = Trip.find_by_id(trip_id)
            if not trip:
                return {
                    'success': False,
                    'message': 'Trip not found'
                }, 404
            
            if trip.user_id != str(user._id):
                return {
                    'success': False,
                    'message': 'Unauthorized'
                }, 403
            
            # Find activity
            activity = Activity.find_by_id(activity_id)
            if not activity or activity.trip_id != trip_id:
                return {
                    'success': False,
                    'message': 'Activity not found'
                }, 404
            
            # Return activity data
            activity_dict = activity.to_dict()
            activity_dict['id'] = str(activity_dict['_id'])
            del activity_dict['_id']
            activity_dict['created_at'] = activity.created_at.isoformat()
            activity_dict['updated_at'] = activity.updated_at.isoformat()
            
            return {
                'success': True,
                'data': activity_dict,
                'message': 'Activity retrieved successfully'
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to get activity: {str(e)}'
            }, 500

    @token_required
    def put(self, trip_id, activity_id):
        """Update a specific activity"""
        try:
            # Get user info from token
            user_id = request.current_user_id
            # Get user_id from JWT token
            
            # Find user in database
            user = User.find_by_id(user_id)
            if not user:
                return {
                    'success': False,
                    'message': 'User not found'
                }, 404
            
            # Find trip and verify ownership
            trip = Trip.find_by_id(trip_id)
            if not trip:
                return {
                    'success': False,
                    'message': 'Trip not found'
                }, 404
            
            if trip.user_id != str(user._id):
                return {
                    'success': False,
                    'message': 'Unauthorized'
                }, 403
            
            # Find activity
            activity = Activity.find_by_id(activity_id)
            if not activity or activity.trip_id != trip_id:
                return {
                    'success': False,
                    'message': 'Activity not found'
                }, 404
            
            # Get update data
            data = request.get_json()
            
            # Update activity fields
            if 'title' in data:
                activity.title = data['title']
            if 'description' in data:
                activity.description = data['description']
            if 'location' in data:
                activity.location = data['location']
            if 'date' in data:
                activity.date = data['date']
            if 'cost' in data:
                activity.cost = data['cost']
            
            # Save updated activity
            activity.save()
            
            # Return updated activity data
            activity_dict = activity.to_dict()
            activity_dict['id'] = str(activity_dict['_id'])
            del activity_dict['_id']
            activity_dict['created_at'] = activity.created_at.isoformat()
            activity_dict['updated_at'] = activity.updated_at.isoformat()
            
            return {
                'success': True,
                'data': activity_dict,
                'message': 'Activity updated successfully'
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to update activity: {str(e)}'
            }, 500

    @token_required
    def delete(self, trip_id, activity_id):
        """Delete a specific activity"""
        try:
            # Get user info from token
            user_id = request.current_user_id
            # Get user_id from JWT token
            
            # Find user in database
            user = User.find_by_id(user_id)
            if not user:
                return {
                    'success': False,
                    'message': 'User not found'
                }, 404
            
            # Find trip and verify ownership
            trip = Trip.find_by_id(trip_id)
            if not trip:
                return {
                    'success': False,
                    'message': 'Trip not found'
                }, 404
            
            if trip.user_id != str(user._id):
                return {
                    'success': False,
                    'message': 'Unauthorized'
                }, 403
            
            # Find activity
            activity = Activity.find_by_id(activity_id)
            if not activity or activity.trip_id != trip_id:
                return {
                    'success': False,
                    'message': 'Activity not found'
                }, 404
            
            # Delete activity
            activity.delete()
            
            return {
                'success': True,
                'data': None,
                'message': 'Activity deleted successfully'
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to delete activity: {str(e)}'
            }, 500
