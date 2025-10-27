from flask import request
from flask_restful import Resource
from datetime import datetime
from app.utils.jwt_auth import token_required
from app.models.trip import Trip
from app.models.user import User

class TripsResource(Resource):
    @token_required
    def get(self):
        """Get all trips for the authenticated user"""
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
            
            # Get user's trips
            trips = Trip.find_by_user(str(user._id))
            
            # Convert trips to dict format
            trips_data = []
            for trip in trips:
                trip_dict = trip.to_dict()
                trip_dict['id'] = str(trip_dict['_id'])
                del trip_dict['_id']
                trip_dict['created_at'] = trip.created_at.isoformat()
                trip_dict['updated_at'] = trip.updated_at.isoformat()
                trips_data.append(trip_dict)
            
            return {
                'success': True,
                'data': trips_data,
                'message': 'Trips retrieved successfully'
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to get trips: {str(e)}'
            }, 500

    @token_required
    def post(self):
        """Create a new trip"""
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
            
            # Get trip data from request
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['title', 'description', 'destination', 'start_date', 'end_date']
            for field in required_fields:
                if field not in data:
                    return {
                        'success': False,
                        'message': f'Missing required field: {field}'
                    }, 400
            
            # Create new trip
            trip = Trip(
                title=data['title'],
                description=data['description'],
                destination=data['destination'],
                start_date=data['start_date'],
                end_date=data['end_date'],
                user_id=str(user._id),
                budget=data.get('budget')
            )
            
            # Save trip
            trip.save()
            
            # Return trip data
            trip_dict = trip.to_dict()
            trip_dict['id'] = str(trip_dict['_id'])
            del trip_dict['_id']
            trip_dict['created_at'] = trip.created_at.isoformat()
            trip_dict['updated_at'] = trip.updated_at.isoformat()
            
            return {
                'success': True,
                'data': trip_dict,
                'message': 'Trip created successfully'
            }, 201
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to create trip: {str(e)}'
            }, 500

class TripResource(Resource):
    @token_required
    def get(self, trip_id):
        """Get a specific trip"""
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
            
            # Find trip
            trip = Trip.find_by_id(trip_id)
            if not trip:
                return {
                    'success': False,
                    'message': 'Trip not found'
                }, 404
            
            # Check if trip belongs to user
            if trip.user_id != str(user._id):
                return {
                    'success': False,
                    'message': 'Unauthorized'
                }, 403
            
            # Return trip data
            trip_dict = trip.to_dict()
            trip_dict['id'] = str(trip_dict['_id'])
            del trip_dict['_id']
            trip_dict['created_at'] = trip.created_at.isoformat()
            trip_dict['updated_at'] = trip.updated_at.isoformat()
            
            return {
                'success': True,
                'data': trip_dict,
                'message': 'Trip retrieved successfully'
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to get trip: {str(e)}'
            }, 500

    @token_required
    def put(self, trip_id):
        """Update a specific trip"""
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
            
            # Find trip
            trip = Trip.find_by_id(trip_id)
            if not trip:
                return {
                    'success': False,
                    'message': 'Trip not found'
                }, 404
            
            # Check if trip belongs to user
            if trip.user_id != str(user._id):
                return {
                    'success': False,
                    'message': 'Unauthorized'
                }, 403
            
            # Get update data
            data = request.get_json()
            
            # Update trip fields
            if 'title' in data:
                trip.title = data['title']
            if 'description' in data:
                trip.description = data['description']
            if 'destination' in data:
                trip.destination = data['destination']
            if 'start_date' in data:
                trip.start_date = data['start_date']
            if 'end_date' in data:
                trip.end_date = data['end_date']
            if 'budget' in data:
                trip.budget = data['budget']
            
            # Save updated trip
            trip.save()
            
            # Return updated trip data
            trip_dict = trip.to_dict()
            trip_dict['id'] = str(trip_dict['_id'])
            del trip_dict['_id']
            trip_dict['created_at'] = trip.created_at.isoformat()
            trip_dict['updated_at'] = trip.updated_at.isoformat()
            
            return {
                'success': True,
                'data': trip_dict,
                'message': 'Trip updated successfully'
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to update trip: {str(e)}'
            }, 500

    @token_required
    def delete(self, trip_id):
        """Delete a specific trip"""
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
            
            # Find trip
            trip = Trip.find_by_id(trip_id)
            if not trip:
                return {
                    'success': False,
                    'message': 'Trip not found'
                }, 404
            
            # Check if trip belongs to user
            if trip.user_id != str(user._id):
                return {
                    'success': False,
                    'message': 'Unauthorized'
                }, 403
            
            # Delete trip
            trip.delete()
            
            return {
                'success': True,
                'data': None,
                'message': 'Trip deleted successfully'
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to delete trip: {str(e)}'
            }, 500
