from datetime import datetime
from bson import ObjectId
from app.utils.database import get_db

class Service:
    def __init__(self, name, service_type, provider_id=None):
        self.name = name
        self.service_type = service_type  # 'accommodation', 'transportation', 'activity', 'food', 'guide', 'insurance'
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
        return {
            'name': self.name,
            'service_type': self.service_type,
            'provider_id': self.provider_id,
            'description': self.description,
            'short_description': self.short_description,
            'category': self.category,
            'subcategory': self.subcategory,
            'images': self.images,
            'videos': self.videos,
            'thumbnail': self.thumbnail,
            'location': self.location,
            'pricing': self.pricing,
            'availability': self.availability,
            'features': self.features,
            'included_items': self.included_items,
            'excluded_items': self.excluded_items,
            'requirements': self.requirements,
            'policies': self.policies,
            'contact': self.contact,
            'status': self.status,
            'verified': self.verified,
            'featured': self.featured,
            'popular': self.popular,
            'total_bookings': self.total_bookings,
            'total_revenue': self.total_revenue,
            'average_rating': self.average_rating,
            'total_reviews': self.total_reviews,
            'seo': self.seo,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

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