from datetime import datetime
from bson import ObjectId
from app.utils.database import get_db

class Service:
    def __init__(self, data=None, name=None, service_type=None, provider_id=None):
        # Support both dictionary initialization and legacy parameters
        if data and isinstance(data, dict):
            # Initialize from dictionary (new form data)
            self.name = data.get('name', '')
            self.service_type = data.get('service_type', '')
            self.provider_id = ObjectId(data.get('provider_id')) if data.get('provider_id') else None
            
            # Basic information from form
            self.description = data.get('description', '')
            self.category = data.get('category', '')
            
            # Location from form
            self.location = data.get('location', {
                "address": "",
                "city": "",
                "state": "",
                "country": "Vietnam",
                "coordinates": {"latitude": 0, "longitude": 0}
            })
            
            # Pricing from form
            self.pricing = data.get('pricing', {
                "base_price": 0.0,
                "currency": "VND",
                "pricing_type": "per_night"
            })
            
            # Capacity from form
            self.capacity = data.get('capacity', {
                "min_guests": 1,
                "max_guests": 2
            })
            
            # Amenities from form
            self.amenities = data.get('amenities', [])
            
            # Images from form
            self.images = data.get('images', [])
            
            # Availability from form
            self.availability = data.get('availability', {
                "check_in_time": "14:00",
                "check_out_time": "12:00",
                "cancellation_policy": "Standard"
            })
            
            # Contact from form
            self.contact = data.get('contact', {
                "phone": "",
                "email": ""
            })
            
            # Status from form
            self.is_active = data.get('is_active', True)
            self.status = "active" if self.is_active else "inactive"
            
        else:
            # Legacy initialization
            self.name = name or ''
            self.service_type = service_type or ''
            self.provider_id = ObjectId(provider_id) if provider_id and isinstance(provider_id, str) else provider_id
        
        # Basic information
        self.description = ""
        self.short_description = ""
        self.category = ""  # More specific category within service_type
        self.subcategory = ""
        
        # Media
        self.images = []  # List of image URLs
        self.videos = []  # List of video URLs
        self.thumbnail = ""  # Main thumbnail image
        
        # Location information
        self.location = {
            "address": "",
            "city": "",
            "state": "",
            "country": "",
            "postal_code": "",
            "coordinates": {
                "latitude": None,
                "longitude": None
            }
        }
        
        # Pricing
        self.pricing = {
            "base_price": 0.0,
            "currency": "USD",
            "price_type": "fixed",  # 'fixed', 'per_person', 'per_hour', 'per_day'
            "price_ranges": [],  # Different price tiers
            "seasonal_pricing": {},  # Seasonal variations
            "group_discounts": {}  # Group size discounts
        }
        
        # Availability
        self.availability = {
            "available_days": [],  # Days of week available
            "operating_hours": {},  # Daily operating hours
            "seasonal_availability": {},  # Seasonal availability
            "blackout_dates": [],  # Unavailable dates
            "advance_booking_days": 0,  # How many days in advance to book
            "max_capacity": None,  # Maximum people per booking
            "min_capacity": 1  # Minimum people per booking
        }
        
        # Features and amenities
        self.features = []  # List of features/amenities
        self.included_items = []  # What's included in the service
        self.excluded_items = []  # What's not included
        self.requirements = []  # Requirements (age, fitness level, etc.)
        
        # Policies
        self.policies = {
            "cancellation_policy": "",
            "refund_policy": "",
            "age_restrictions": "",
            "dress_code": "",
            "special_requirements": ""
        }
        
        # Contact information
        self.contact = {
            "phone": "",
            "email": "",
            "website": "",
            "social_media": {}
        }
        
        # Status and verification
        self.status = "active"  # 'active', 'inactive', 'pending', 'suspended'
        self.verified = False
        self.featured = False
        self.popular = False
        
        # Statistics
        self.total_bookings = 0
        self.total_revenue = 0.0
        self.average_rating = 0.0
        self.total_reviews = 0
        
        # SEO
        self.seo = {
            "meta_title": "",
            "meta_description": "",
            "keywords": [],
            "slug": ""
        }
        
        # Timestamps
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def to_dict(self):
        """Convert service to dictionary for MongoDB storage"""
        data = {
            'name': self.name,
            'service_type': self.service_type,
            'provider_id': self.provider_id,
            'description': self.description,
            'category': getattr(self, 'category', ''),
            'location': getattr(self, 'location', {}),
            'pricing': getattr(self, 'pricing', {}),
            'availability': getattr(self, 'availability', {}),
            'contact': getattr(self, 'contact', {}),
            'status': getattr(self, 'status', 'active'),
            'created_at': getattr(self, 'created_at', datetime.utcnow()),
            'updated_at': getattr(self, 'updated_at', datetime.utcnow())
        }
        
        # Add optional fields if they exist
        optional_fields = [
            'short_description', 'subcategory', 'images', 'videos', 'thumbnail',
            'features', 'included_items', 'excluded_items', 'requirements', 'policies',
            'verified', 'featured', 'popular', 'total_bookings', 'total_revenue',
            'average_rating', 'total_reviews', 'seo', 'amenities', 'capacity', 'is_active'
        ]
        
        for field in optional_fields:
            if hasattr(self, field):
                data[field] = getattr(self, field)
                
        return data

    @classmethod
    def from_dict(cls, data):
        """Create service from dictionary"""
        service = cls(
            name=data['name'],
            service_type=data['service_type'],
            provider_id=data.get('provider_id')
        )
        
        # Update all fields
        for key, value in data.items():
            if hasattr(service, key):
                setattr(service, key, value)
        
        return service

    def create(self):
        """Create new service in database"""
        try:
            db = get_db()
            collection = db.services
            
            # Set timestamps
            self.created_at = datetime.utcnow()
            self.updated_at = datetime.utcnow()
            
            # Create new service
            result = collection.insert_one(self.to_dict())
            self._id = result.inserted_id
            return self._id
        except Exception as e:
            print(f"Error creating service: {e}")
            return None

    def save(self):
        """Save service to database"""
        db = get_db()
        collection = db.services
        
        self.updated_at = datetime.utcnow()
        
        if hasattr(self, '_id'):
            # Update existing service
            result = collection.update_one(
                {'_id': self._id},
                {'$set': self.to_dict()}
            )
            return result.modified_count > 0
        else:
            # Create new service
            result = collection.insert_one(self.to_dict())
            self._id = result.inserted_id
            return True

    @classmethod
    def find_by_id(cls, service_id):
        """Find service by ID"""
        db = get_db()
        collection = db.services
        
        service_data = collection.find_one({'_id': ObjectId(service_id)})
        if service_data:
            return cls.from_dict(service_data)
        return None

    @classmethod
    def find_by_type(cls, service_type, status="active", limit=None):
        """Find services by type"""
        db = get_db()
        collection = db.services
        
        query = {
            'service_type': service_type,
            'status': status
        }
        
        cursor = collection.find(query).sort('created_at', -1)
        if limit:
            cursor = cursor.limit(limit)
            
        return [cls.from_dict(data) for data in cursor]

    @classmethod
    def find_by_provider(cls, provider_id, status="active"):
        """Find services by provider"""
        db = get_db()
        collection = db.services
        
        services_data = collection.find({
            'provider_id': ObjectId(provider_id),
            'status': status
        }).sort('created_at', -1)
        return [cls.from_dict(data) for data in services_data]

    @classmethod
    def find_by_location(cls, city=None, country=None, coordinates=None, radius_km=10):
        """Find services by location"""
        db = get_db()
        collection = db.services
        
        query = {'status': 'active'}
        
        if coordinates:
            # Geospatial query (requires proper indexing)
            lat, lng = coordinates
            query['location.coordinates'] = {
                '$near': {
                    '$geometry': {'type': 'Point', 'coordinates': [lng, lat]},
                    '$maxDistance': radius_km * 1000  # Convert km to meters
                }
            }
        else:
            if city:
                query['location.city'] = {'$regex': city, '$options': 'i'}
            if country:
                query['location.country'] = {'$regex': country, '$options': 'i'}
        
        services_data = collection.find(query).sort('average_rating', -1)
        return [cls.from_dict(data) for data in services_data]

    @classmethod
    def search_services(cls, query_text, filters=None):
        """Search services by text and filters"""
        db = get_db()
        collection = db.services
        
        # Build search query
        search_query = {
            'status': 'active',
            '$or': [
                {'name': {'$regex': query_text, '$options': 'i'}},
                {'description': {'$regex': query_text, '$options': 'i'}},
                {'category': {'$regex': query_text, '$options': 'i'}},
                {'features': {'$regex': query_text, '$options': 'i'}}
            ]
        }
        
        # Apply filters
        if filters:
            if 'service_type' in filters:
                search_query['service_type'] = filters['service_type']
            if 'price_min' in filters:
                search_query['pricing.base_price'] = {'$gte': filters['price_min']}
            if 'price_max' in filters:
                if 'pricing.base_price' in search_query:
                    search_query['pricing.base_price']['$lte'] = filters['price_max']
                else:
                    search_query['pricing.base_price'] = {'$lte': filters['price_max']}
            if 'rating_min' in filters:
                search_query['average_rating'] = {'$gte': filters['rating_min']}
            if 'verified' in filters:
                search_query['verified'] = filters['verified']
            if 'featured' in filters:
                search_query['featured'] = filters['featured']
        
        services_data = collection.find(search_query).sort('average_rating', -1)
        return [cls.from_dict(data) for data in services_data]

    @classmethod
    def get_featured_services(cls, service_type=None, limit=10):
        """Get featured services"""
        db = get_db()
        collection = db.services
        
        query = {
            'status': 'active',
            'featured': True
        }
        
        if service_type:
            query['service_type'] = service_type
        
        services_data = collection.find(query).sort('average_rating', -1).limit(limit)
        return [cls.from_dict(data) for data in services_data]

    def update_statistics(self):
        """Update service statistics (ratings, bookings, etc.)"""
        from app.models.review import Review
        from app.models.booking import Booking
        
        # Update review statistics
        rating_stats = Review.get_average_rating(self._id, 'service')
        self.average_rating = rating_stats['average_rating']
        self.total_reviews = rating_stats['total_reviews']
        
        # Update booking statistics
        bookings = Booking.find_by_service(self._id)
        self.total_bookings = len([b for b in bookings if b.status == 'completed'])
        
        return self.save()

    def add_booking(self, amount):
        """Add a booking to statistics"""
        self.total_bookings += 1
        self.total_revenue += amount
        return self.save()

    def delete(self):
        """Delete service"""
        if hasattr(self, '_id'):
            self.status = "inactive"
            return self.save()
        return False
    
    @staticmethod
    def count_by_provider(provider_id):
        """Count services by provider"""
        try:
            db = get_db()
            collection = db.services
            return collection.count_documents({
                'provider_id': ObjectId(provider_id),
                'status': {'$ne': 'deleted'}
            })
        except Exception:
            return 0
    
    @staticmethod
    def find_by_provider(provider_id, skip=0, limit=10):
        """Find services by provider with pagination"""
        try:
            db = get_db()
            collection = db.services
            
            services_data = collection.find({
                'provider_id': ObjectId(provider_id),
                'status': {'$ne': 'deleted'}
            }).skip(skip).limit(limit).sort('created_at', -1)
            
            services = []
            for service_data in services_data:
                service = Service.from_dict(service_data)
                services.append(service)
            
            return services
        except Exception:
            return []