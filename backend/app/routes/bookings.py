from flask import Blueprint, request, jsonify
from datetime import datetime
from bson import ObjectId
import re
from app.utils.database import get_db
from app.utils.jwt_auth import token_required

bookings_bp = Blueprint('bookings', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    """Validate Vietnamese phone number (10 digits, starts with 0)"""
    pattern = r'^0[0-9]{9}$'
    return re.match(pattern, phone) is not None

@bookings_bp.route('/bookings', methods=['POST'])
def create_booking():
    """
    Create a new booking (supports both authenticated users and guests)
    
    Request body:
    {
        "service_id": "string",
        "service_type": "accommodation|tour|transport",
        "check_in": "YYYY-MM-DD",
        "check_out": "YYYY-MM-DD",
        "guests": number,
        "special_requests": "string" (optional),
        "guest_info": {  # Required if not authenticated
            "fullName": "string",
            "email": "string",
            "phone": "string"
        }
    }
    """
    try:
        db = get_db()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['service_id', 'service_type', 'check_in', 'check_out', 'guests']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if user is authenticated
        auth_header = request.headers.get('Authorization')
        user_id = None
        guest_info = None
        
        if auth_header and auth_header.startswith('Bearer '):
            # Try to get user from token
            try:
                from app.utils.jwt_auth import decode_token
                token = auth_header.split(' ')[1]
                payload = decode_token(token)
                user_id = payload.get('user_id')
                
                # Get user info from database
                user = db.users.find_one({'_id': ObjectId(user_id)})
                if user:
                    guest_info = {
                        'fullName': user.get('name') or user.get('username'),
                        'email': user.get('email'),
                        'phone': user.get('phone', '')
                    }
            except:
                pass  # Token invalid or expired, treat as guest
        
        # If not authenticated or user not found, require guest_info
        if not guest_info:
            if 'guest_info' not in data:
                return jsonify({'error': 'guest_info is required for non-authenticated bookings'}), 400
            
            guest_info = data['guest_info']
            
            # Validate guest info
            if not guest_info.get('fullName'):
                return jsonify({'error': 'fullName is required'}), 400
            if len(guest_info.get('fullName', '')) < 3:
                return jsonify({'error': 'fullName must be at least 3 characters'}), 400
                
            if not guest_info.get('email'):
                return jsonify({'error': 'email is required'}), 400
            if not validate_email(guest_info.get('email')):
                return jsonify({'error': 'Invalid email format'}), 400
                
            if not guest_info.get('phone'):
                return jsonify({'error': 'phone is required'}), 400
            if not validate_phone(guest_info.get('phone')):
                return jsonify({'error': 'Invalid phone format. Must be 10 digits starting with 0'}), 400
        
        # Validate dates
        try:
            check_in_date = datetime.strptime(data['check_in'], '%Y-%m-%d')
            check_out_date = datetime.strptime(data['check_out'], '%Y-%m-%d')
            
            if check_out_date <= check_in_date:
                return jsonify({'error': 'check_out must be after check_in'}), 400
                
            if check_in_date < datetime.now().replace(hour=0, minute=0, second=0, microsecond=0):
                return jsonify({'error': 'check_in cannot be in the past'}), 400
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        # Validate guests
        if data['guests'] < 1 or data['guests'] > 20:
            return jsonify({'error': 'guests must be between 1 and 20'}), 400
        
        # Validate service exists
        service_collection = None
        if data['service_type'] == 'accommodation':
            service_collection = db.accommodations
        elif data['service_type'] == 'tour':
            service_collection = db.tours
        elif data['service_type'] == 'transport':
            service_collection = db.transports
        else:
            return jsonify({'error': 'Invalid service_type'}), 400
        
        service = service_collection.find_one({'_id': ObjectId(data['service_id'])})
        if not service:
            return jsonify({'error': 'Service not found'}), 404
        
        # Generate booking reference
        booking_reference = f"BK{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Calculate nights and total amount
        nights = (check_out_date - check_in_date).days
        base_price = float(service.get('price', 0))
        total_amount = base_price * nights
        
        # Create booking document
        booking = {
            'user_id': ObjectId(user_id) if user_id else None,
            'guest_info': guest_info,
            'service_id': ObjectId(data['service_id']),
            'service_type': data['service_type'],
            'service_name': service.get('name', ''),
            'booking_reference': booking_reference,
            'check_in': check_in_date,
            'check_out': check_out_date,
            'nights': nights,
            'guests': data['guests'],
            'special_requests': data.get('special_requests', ''),
            'total_amount': total_amount,
            'currency': 'VND',
            'price_breakdown': {
                'base_price': base_price,
                'nights': nights,
                'subtotal': total_amount,
                'taxes': 0,
                'fees': 0,
                'total': total_amount
            },
            'status': 'pending',
            'payment_status': 'pending',
            'payment_method': None,
            'booking_date': datetime.utcnow(),
            'confirmed_at': None,
            'cancelled_at': None,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        # Insert into database
        result = db.bookings.insert_one(booking)
        
        # Return booking confirmation
        booking['_id'] = str(result.inserted_id)
        booking['user_id'] = str(booking['user_id']) if booking['user_id'] else None
        booking['service_id'] = str(booking['service_id'])
        booking['check_in'] = booking['check_in'].strftime('%Y-%m-%d')
        booking['check_out'] = booking['check_out'].strftime('%Y-%m-%d')
        booking['booking_date'] = booking['booking_date'].isoformat()
        booking['created_at'] = booking['created_at'].isoformat()
        booking['updated_at'] = booking['updated_at'].isoformat()
        
        return jsonify({
            'message': 'Booking created successfully',
            'booking': booking
        }), 201
        
    except Exception as e:
        print(f"Error creating booking: {str(e)}")
        return jsonify({'error': f'Failed to create booking: {str(e)}'}), 500


@bookings_bp.route('/bookings/<booking_id>', methods=['GET'])
def get_booking(booking_id):
    """Get booking details by ID"""
    try:
        db = get_db()
        
        booking = db.bookings.find_one({'_id': ObjectId(booking_id)})
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Convert ObjectId to string
        booking['_id'] = str(booking['_id'])
        booking['user_id'] = str(booking['user_id']) if booking['user_id'] else None
        booking['service_id'] = str(booking['service_id'])
        
        # Convert dates to ISO format
        if isinstance(booking.get('check_in'), datetime):
            booking['check_in'] = booking['check_in'].strftime('%Y-%m-%d')
        if isinstance(booking.get('check_out'), datetime):
            booking['check_out'] = booking['check_out'].strftime('%Y-%m-%d')
        if isinstance(booking.get('booking_date'), datetime):
            booking['booking_date'] = booking['booking_date'].isoformat()
        if isinstance(booking.get('created_at'), datetime):
            booking['created_at'] = booking['created_at'].isoformat()
        if isinstance(booking.get('updated_at'), datetime):
            booking['updated_at'] = booking['updated_at'].isoformat()
        
        return jsonify(booking), 200
        
    except Exception as e:
        print(f"Error getting booking: {str(e)}")
        return jsonify({'error': 'Failed to get booking'}), 500


@bookings_bp.route('/bookings/user', methods=['GET'])
@token_required
def get_user_bookings(current_user):
    """
    Get bookings for authenticated user with pagination and filtering
    
    Query parameters:
    - page: Page number (default: 1)
    - limit: Items per page (default: 20)
    - status: Filter by status (optional: pending, confirmed, completed, cancelled)
    - sort: Sort order (default: -created_at)
    """
    try:
        db = get_db()
        
        # Get query parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        status = request.args.get('status')
        sort_by = request.args.get('sort', '-created_at')
        
        # Validate pagination
        page = max(1, page)
        limit = min(100, max(1, limit))  # Max 100 items per page
        
        # Build query
        query = {'user_id': ObjectId(current_user['_id'])}
        if status:
            query['status'] = status
        
        # Build sort
        sort_field = sort_by.lstrip('-')
        sort_direction = -1 if sort_by.startswith('-') else 1
        
        # Get total count
        total = db.bookings.count_documents(query)
        
        # Get bookings with pagination
        skip = (page - 1) * limit
        bookings = list(db.bookings.find(query)
                       .sort(sort_field, sort_direction)
                       .skip(skip)
                       .limit(limit))
        
        # Convert ObjectId to string
        for booking in bookings:
            booking['_id'] = str(booking['_id'])
            booking['user_id'] = str(booking['user_id'])
            booking['service_id'] = str(booking['service_id'])
            
            # Convert dates
            if isinstance(booking.get('check_in'), datetime):
                booking['check_in'] = booking['check_in'].strftime('%Y-%m-%d')
            if isinstance(booking.get('check_out'), datetime):
                booking['check_out'] = booking['check_out'].strftime('%Y-%m-%d')
            if isinstance(booking.get('booking_date'), datetime):
                booking['booking_date'] = booking['booking_date'].isoformat()
            if isinstance(booking.get('created_at'), datetime):
                booking['created_at'] = booking['created_at'].isoformat()
            if isinstance(booking.get('updated_at'), datetime):
                booking['updated_at'] = booking['updated_at'].isoformat()
        
        # Calculate pagination metadata
        total_pages = (total + limit - 1) // limit
        has_next = page < total_pages
        has_prev = page > 1
        
        return jsonify({
            'bookings': bookings,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total,
                'total_pages': total_pages,
                'has_next': has_next,
                'has_prev': has_prev
            }
        }), 200
        
    except Exception as e:
        print(f"Error getting user bookings: {str(e)}")
        return jsonify({'error': 'Failed to get bookings'}), 500
