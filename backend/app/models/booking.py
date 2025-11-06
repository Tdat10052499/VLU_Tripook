from datetime import datetime
from bson import ObjectId
from app.utils.database import get_db

class Booking:
    def __init__(self, user_id, trip_id, service_id=None, booking_type="trip"):
        self.user_id = ObjectId(user_id) if isinstance(user_id, str) else user_id
        self.trip_id = ObjectId(trip_id) if isinstance(trip_id, str) else trip_id
        self.service_id = ObjectId(service_id) if service_id and isinstance(service_id, str) else service_id
        self.booking_type = booking_type  # 'trip', 'service', 'package'
        
        # Booking details
        self.booking_reference = None
        self.start_date = None
        self.end_date = None
        self.number_of_guests = 1
        self.guest_details = []  # List of guest information
        
        # Pricing
        self.total_amount = 0.0
        self.currency = "USD"
        self.price_breakdown = {
            "base_price": 0.0,
            "taxes": 0.0,
            "fees": 0.0,
            "discounts": 0.0
        }
        
        # Status and dates
        self.status = "pending"  # 'pending', 'confirmed', 'cancelled', 'completed', 'refunded'
        self.payment_status = "pending"  # 'pending', 'paid', 'failed', 'refunded'
        self.confirmation_code = None
        
        # Special requests and notes
        self.special_requests = ""
        self.notes = ""
        
        # Timestamps
        self.booking_date = datetime.utcnow()
        self.confirmed_at = None
        self.cancelled_at = None
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def to_dict(self):
        """Convert booking to dictionary for MongoDB storage"""
        return {
            'user_id': self.user_id,
            'trip_id': self.trip_id,
            'service_id': self.service_id,
            'booking_type': self.booking_type,
            'booking_reference': self.booking_reference,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'number_of_guests': self.number_of_guests,
            'guest_details': self.guest_details,
            'total_amount': self.total_amount,
            'currency': self.currency,
            'price_breakdown': self.price_breakdown,
            'status': self.status,
            'payment_status': self.payment_status,
            'confirmation_code': self.confirmation_code,
            'special_requests': self.special_requests,
            'notes': self.notes,
            'booking_date': self.booking_date,
            'confirmed_at': self.confirmed_at,
            'cancelled_at': self.cancelled_at,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    @classmethod
    def from_dict(cls, data):
        """Create booking from dictionary"""
        booking = cls(
            user_id=data['user_id'],
            trip_id=data['trip_id'],
            service_id=data.get('service_id'),
            booking_type=data.get('booking_type', 'trip')
        )
        
        # Update all fields
        for key, value in data.items():
            if hasattr(booking, key):
                setattr(booking, key, value)
        
        return booking

    def save(self):
        """Save booking to database"""
        db = get_db()
        collection = db.bookings
        
        self.updated_at = datetime.utcnow()
        
        if hasattr(self, '_id'):
            # Update existing booking
            result = collection.update_one(
                {'_id': self._id},
                {'$set': self.to_dict()}
            )
            return result.modified_count > 0
        else:
            # Create new booking
            result = collection.insert_one(self.to_dict())
            self._id = result.inserted_id
            return True

    @classmethod
    def find_by_id(cls, booking_id):
        """Find booking by ID"""
        db = get_db()
        collection = db.bookings
        
        booking_data = collection.find_one({'_id': ObjectId(booking_id)})
        if booking_data:
            return cls.from_dict(booking_data)
        return None

    @classmethod
    def find_by_user(cls, user_id):
        """Find all bookings for a user"""
        db = get_db()
        collection = db.bookings
        
        bookings_data = collection.find({'user_id': ObjectId(user_id)}).sort('created_at', -1)
        return [cls.from_dict(data) for data in bookings_data]

    @classmethod
    def find_by_trip(cls, trip_id):
        """Find all bookings for a trip"""
        db = get_db()
        collection = db.bookings
        
        bookings_data = collection.find({'trip_id': ObjectId(trip_id)}).sort('created_at', -1)
        return [cls.from_dict(data) for data in bookings_data]

    def cancel(self, reason=None):
        """Cancel booking"""
        self.status = "cancelled"
        self.cancelled_at = datetime.utcnow()
        if reason:
            self.notes += f"\nCancellation reason: {reason}"
        return self.save()

    def confirm(self, confirmation_code=None):
        """Confirm booking"""
        self.status = "confirmed"
        self.confirmed_at = datetime.utcnow()
        if confirmation_code:
            self.confirmation_code = confirmation_code
        return self.save()
    
    @staticmethod
    def count_by_provider(provider_id):
        """Count bookings by provider"""
        try:
            db = get_db()
            collection = db.bookings
            return collection.count_documents({
                'provider_id': ObjectId(provider_id)
            })
        except Exception:
            return 0
    
    @staticmethod
    def count_by_provider_and_date(provider_id, start_date):
        """Count bookings by provider within date range"""
        try:
            db = get_db()
            collection = db.bookings
            return collection.count_documents({
                'provider_id': ObjectId(provider_id),
                'booking_date': {'$gte': start_date}
            })
        except Exception:
            return 0
    
    @staticmethod
    def find_by_provider(provider_id, skip=0, limit=10):
        """Find bookings by provider with pagination"""
        try:
            db = get_db()
            collection = db.bookings
            
            bookings_data = collection.find({
                'provider_id': ObjectId(provider_id)
            }).skip(skip).limit(limit).sort('booking_date', -1)
            
            bookings = []
            for booking_data in bookings_data:
                booking = Booking.from_dict(booking_data)
                bookings.append(booking)
            
            return bookings
        except Exception:
            return []