from flask import Blueprint, request, jsonify, current_app
from app.models.user import User
from app.models.service import Service
from app.models.booking import Booking
from app.utils.jwt_auth import token_required

def get_current_user():
    """Get current user from request context"""
    return getattr(request, 'current_user', None)
from bson import ObjectId
from datetime import datetime, timedelta
import re

provider_bp = Blueprint('provider', __name__)

@provider_bp.route('/become-provider', methods=['POST'])
@token_required
def become_provider():
    """Upgrade user to provider with additional information"""
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
            
        # Check if user is already a provider
        if current_user.role == 'provider':
            return jsonify({'error': 'Bạn đã là đối tác của Tripook trước đó!'}), 400
            
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['company_name', 'business_type', 'business_phone', 'business_email']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate business type
        valid_business_types = ['hotel', 'tour', 'transport']
        if data['business_type'] not in valid_business_types:
            return jsonify({'error': 'Invalid business type'}), 400
        
        # Validate email format
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['business_email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate phone format (Vietnamese phone number)
        phone_pattern = r'^(\+84|0)[3-9]\d{8}$'
        if not re.match(phone_pattern, data['business_phone']):
            return jsonify({'error': 'Invalid Vietnamese phone number format'}), 400
        
        # Upgrade user to provider
        success = current_user.upgrade_to_provider(data)
        
        if success:
            # Return updated user info (excluding sensitive data)
            user_data = current_user.to_dict(include_sensitive=False)
            return jsonify({
                'message': 'Tài khoản của bạn đã được nâng cấp thành Provider thành công!',
                'user': user_data
            }), 200
        else:
            return jsonify({'error': 'Failed to upgrade to provider'}), 500
            
    except Exception as e:
        current_app.logger.error(f"Error in become_provider: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@provider_bp.route('/profile', methods=['GET'])
@token_required
def get_provider_profile():
    """Get provider profile information"""
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
            
        if not current_user.is_provider():
            return jsonify({'error': 'User is not a provider'}), 403
        
        user_data = current_user.to_dict(include_sensitive=False)
        return jsonify({'provider': user_data}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error in get_provider_profile: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@provider_bp.route('/profile', methods=['PUT'])
@token_required
def update_provider_profile():
    """Update provider profile information"""
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
            
        if not current_user.is_provider():
            return jsonify({'error': 'User is not a provider'}), 403
        
        data = request.get_json()
        
        # Update basic user info
        if 'name' in data:
            current_user.name = data['name']
        if 'phone' in data:
            current_user.phone = data['phone']
        if 'address' in data:
            current_user.address = data['address']
        
        # Update provider info
        if current_user.provider_info and 'provider_info' in data:
            provider_data = data['provider_info']
            if 'company_name' in provider_data:
                current_user.provider_info['company_name'] = provider_data['company_name']
            if 'description' in provider_data:
                current_user.provider_info['description'] = provider_data['description']
            if 'business_phone' in provider_data:
                current_user.provider_info['business_phone'] = provider_data['business_phone']
            if 'business_email' in provider_data:
                current_user.provider_info['business_email'] = provider_data['business_email']
            if 'website' in provider_data:
                current_user.provider_info['website'] = provider_data['website']
            if 'bank_account' in provider_data:
                current_user.provider_info['bank_account'].update(provider_data['bank_account'])
        
        current_user.updated_at = datetime.utcnow()
        success = current_user.save()
        
        if success:
            user_data = current_user.to_dict(include_sensitive=False)
            return jsonify({
                'message': 'Provider profile updated successfully',
                'provider': user_data
            }), 200
        else:
            return jsonify({'error': 'Failed to update profile'}), 500
            
    except Exception as e:
        current_app.logger.error(f"Error in update_provider_profile: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@provider_bp.route('/dashboard', methods=['GET'])
@token_required
def get_provider_dashboard():
    """Get provider dashboard statistics"""
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
            
        if not current_user.is_provider():
            return jsonify({'error': 'User is not a provider'}), 403
        
        # Get provider's services count
        services_count = Service.count_by_provider(current_user._id)
        
        # Get provider's bookings count
        bookings_count = Booking.count_by_provider(current_user._id)
        
        # Calculate date ranges for statistics
        today = datetime.utcnow()
        last_30_days = today - timedelta(days=30)
        
        # Get recent bookings count
        recent_bookings = Booking.count_by_provider_and_date(current_user._id, last_30_days)
        
        dashboard_data = {
            'total_services': services_count,
            'total_bookings': bookings_count,
            'recent_bookings': recent_bookings,
            'provider_since': current_user.provider_info.get('approved_at') if current_user.provider_info else None,
            'account_status': 'active' if current_user.is_active_provider() else 'inactive'
        }
        
        return jsonify({'dashboard': dashboard_data}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error in get_provider_dashboard: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@provider_bp.route('/services', methods=['POST'])
@token_required
def create_service():
    """Create a new service"""
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
            
        if not current_user.is_provider():
            return jsonify({'error': 'User is not a provider'}), 403
        
        # Parse form data
        service_data = request.form.get('service_data')
        if not service_data:
            return jsonify({'error': 'Service data is required'}), 400
        
        import json
        try:
            data = json.loads(service_data)
        except json.JSONDecodeError:
            return jsonify({'error': 'Invalid JSON data'}), 400
        
        # Validate required fields
        required_fields = ['name', 'service_type', 'description', 'location', 'pricing']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate service type
        valid_service_types = ['accommodation', 'tour', 'transportation']
        if data['service_type'] not in valid_service_types:
            return jsonify({'error': 'Invalid service type'}), 400
        
        # Handle uploaded images
        uploaded_files = []
        if 'images' in request.files:
            files = request.files.getlist('images')
            for file in files:
                if file and file.filename:
                    # In a real app, you would save files to storage (S3, local, etc.)
                    # For now, we'll just store the filename
                    uploaded_files.append({
                        'filename': file.filename,
                        'size': len(file.read()),
                        'content_type': file.content_type
                    })
                    file.seek(0)  # Reset file pointer
        
        # Create service data structure
        service_info = {
            'provider_id': current_user._id,
            'name': data['name'],
            'service_type': data['service_type'],
            'description': data['description'],
            'category': data.get('category', ''),
            'location': {
                'address': data['location']['address'],
                'city': data['location']['city'],
                'country': data['location'].get('country', 'Vietnam'),
                'coordinates': data['location'].get('coordinates', {'latitude': 0, 'longitude': 0})
            },
            'pricing': {
                'base_price': float(data['pricing']['base_price']),
                'currency': data['pricing'].get('currency', 'VND'),
                'pricing_type': data['pricing'].get('pricing_type', 'per_night')
            },
            'capacity': {
                'min_guests': int(data.get('capacity', {}).get('min_guests', 1)),
                'max_guests': int(data.get('capacity', {}).get('max_guests', 2))
            },
            'amenities': data.get('amenities', []),
            'images': uploaded_files,
            'availability': {
                'check_in_time': data.get('availability', {}).get('check_in_time', '14:00'),
                'check_out_time': data.get('availability', {}).get('check_out_time', '12:00'),
                'cancellation_policy': data.get('availability', {}).get('cancellation_policy', 'Standard')
            },
            'contact': {
                'phone': data.get('contact', {}).get('phone', ''),
                'email': data.get('contact', {}).get('email', '')
            },
            'is_active': data.get('is_active', True),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        # Create service using the Service model
        service = Service(service_info)
        service_id = service.create()
        
        if service_id:
            return jsonify({
                'message': 'Service created successfully',
                'service': {
                    'id': str(service_id),
                    **service_info
                }
            }), 201
        else:
            return jsonify({'error': 'Failed to create service'}), 500
            
    except Exception as e:
        current_app.logger.error(f"Error in create_service: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@provider_bp.route('/services', methods=['GET'])
@token_required
def get_provider_services():
    """Get all services for the current provider"""
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
            
        if not current_user.is_provider():
            return jsonify({'error': 'User is not a provider'}), 403
        
        # Get services for this provider
        services = Service.find_by_provider(current_user._id)
        
        return jsonify({
            'services': [service.to_dict() for service in services]
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error in get_provider_services: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@provider_bp.route('/bookings', methods=['GET'])
@token_required
def get_provider_bookings():
    """Get all bookings for provider's services"""
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
            
        if not current_user.is_provider():
            return jsonify({'error': 'User is not a provider'}), 403
        
        # Get bookings for this provider's services
        bookings = Booking.find_by_provider(current_user._id)
        
        return jsonify({
            'bookings': [booking.to_dict() for booking in bookings]
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error in get_provider_bookings: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@provider_bp.route('/bookings/<booking_id>/status', methods=['PUT'])
@token_required
def update_booking_status(booking_id):
    """Update booking status"""
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
            
        if not current_user.is_provider():
            return jsonify({'error': 'User is not a provider'}), 403
        
        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status:
            return jsonify({'error': 'Status is required'}), 400
        
        # Valid booking statuses
        valid_statuses = ['pending', 'confirmed', 'cancelled', 'completed']
        if new_status not in valid_statuses:
            return jsonify({'error': 'Invalid status'}), 400
        
        # Find booking and verify it belongs to provider's service
        booking = Booking.find_by_id(ObjectId(booking_id))
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Verify the service belongs to this provider
        service = Service.find_by_id(booking.service_id)
        if not service or service.provider_id != current_user._id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Update booking status
        success = booking.update_status(new_status)
        
        if success:
            return jsonify({
                'message': 'Booking status updated successfully',
                'booking': booking.to_dict()
            }), 200
        else:
            return jsonify({'error': 'Failed to update booking status'}), 500
            
    except Exception as e:
        current_app.logger.error(f"Error in update_booking_status: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500