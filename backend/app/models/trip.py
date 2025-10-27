from datetime import datetime
from bson import ObjectId
from app.utils.database import get_db

class Trip:
    def __init__(self, title, description, destination, start_date, end_date, user_id, budget=None):
        self.title = title
        self.description = description
        self.destination = destination
        self.start_date = start_date
        self.end_date = end_date
        self.budget = budget or 0.0
        self.currency = "USD"
        self.user_id = ObjectId(user_id) if isinstance(user_id, str) else user_id
        
        # Trip details
        self.trip_type = "leisure"  # 'leisure', 'business', 'adventure', 'cultural', 'romantic'
        self.group_size = 1
        self.difficulty_level = "easy"  # 'easy', 'moderate', 'challenging'
        self.duration_days = None
        
        # Media
        self.images = []
        self.videos = []
        self.thumbnail = ""
        
        # Itinerary and planning
        self.itinerary = []  # List of daily activities/plans
        self.waypoints = []  # List of locations/stops
        self.services = []   # List of booked services (accommodation, transport, etc.)
        
        # Location details
        self.location_details = {
            "country": "",
            "state": "",
            "city": "",
            "coordinates": {
                "latitude": None,
                "longitude": None
            },
            "timezone": ""
        }
        
        # Preferences
        self.preferences = {
            "accommodation_type": [],  # hotel, hostel, apartment, etc.
            "transportation_type": [],  # flight, train, car, bus, etc.
            "meal_preferences": [],    # vegetarian, vegan, halal, etc.
            "activity_types": [],      # outdoor, cultural, nightlife, etc.
            "accessibility_needs": []   # wheelchair, hearing, visual, etc.
        }
        
        # Status and visibility
        self.status = "planning"  # 'planning', 'booked', 'ongoing', 'completed', 'cancelled'
        self.visibility = "private"  # 'private', 'public', 'shared'
        self.featured = False
        self.template = False  # Can be used as template by others
        
        # Collaboration
        self.collaborators = []  # Users who can edit this trip
        self.shared_with = []    # Users who can view this trip
        
        # Statistics
        self.total_bookings = 0
        self.total_spent = 0.0
        self.average_rating = 0.0
        self.total_reviews = 0
        self.view_count = 0
        
        # Packing and preparation
        self.packing_list = []
        self.documents_needed = []
        self.reminders = []
        
        # Weather and conditions
        self.weather_info = {}
        self.best_time_to_visit = ""
        
        # Tags and categorization
        self.tags = []
        self.categories = []
        
        # SEO for public trips
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
        """Convert trip to dictionary for MongoDB storage"""
        return {
            'title': self.title,
            'description': self.description,
            'destination': self.destination,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'budget': self.budget,
            'currency': self.currency,
            'user_id': self.user_id,
            'trip_type': self.trip_type,
            'group_size': self.group_size,
            'difficulty_level': self.difficulty_level,
            'duration_days': self.duration_days,
            'images': self.images,
            'videos': self.videos,
            'thumbnail': self.thumbnail,
            'itinerary': self.itinerary,
            'waypoints': self.waypoints,
            'services': self.services,
            'location_details': self.location_details,
            'preferences': self.preferences,
            'status': self.status,
            'visibility': self.visibility,
            'featured': self.featured,
            'template': self.template,
            'collaborators': self.collaborators,
            'shared_with': self.shared_with,
            'total_bookings': self.total_bookings,
            'total_spent': self.total_spent,
            'average_rating': self.average_rating,
            'total_reviews': self.total_reviews,
            'view_count': self.view_count,
            'packing_list': self.packing_list,
            'documents_needed': self.documents_needed,
            'reminders': self.reminders,
            'weather_info': self.weather_info,
            'best_time_to_visit': self.best_time_to_visit,
            'tags': self.tags,
            'categories': self.categories,
            'seo': self.seo,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    @classmethod
    def from_dict(cls, data):
        """Create trip from dictionary"""
        trip = cls(
            title=data['title'],
            description=data['description'],
            destination=data['destination'],
            start_date=data['start_date'],
            end_date=data['end_date'],
            user_id=data['user_id'],
            budget=data.get('budget', 0.0)
        )
        
        # Update all fields
        for key, value in data.items():
            if hasattr(trip, key):
                setattr(trip, key, value)
        
        if '_id' in data:
            trip._id = data['_id']
        
        return trip

    def save(self):
        """Save trip to database"""
        db = get_db()
        collection = db.trips
        
        self.updated_at = datetime.utcnow()
        trip_data = self.to_dict()
        
        if hasattr(self, '_id') and self._id:
            # Update existing trip
            collection.update_one(
                {'_id': self._id},
                {'$set': trip_data}
            )
        else:
            # Create new trip
            result = collection.insert_one(trip_data)
            self._id = result.inserted_id
        
        return self

    @classmethod
    def find_by_id(cls, trip_id):
        """Find trip by ID"""
        db = get_db()
        collection = db.trips
        
        try:
            trip_data = collection.find_one({'_id': ObjectId(trip_id)})
            if trip_data:
                return cls.from_dict(trip_data)
        except:
            pass
        return None

    @classmethod
    def find_by_user(cls, user_id, status=None):
        """Find all trips for a user"""
        db = get_db()
        collection = db.trips
        
        query = {'user_id': ObjectId(user_id) if isinstance(user_id, str) else user_id}
        if status:
            query['status'] = status
            
        trips_data = collection.find(query).sort('created_at', -1)
        return [cls.from_dict(data) for data in trips_data]

    @classmethod
    def find_public_trips(cls, limit=None, featured_only=False):
        """Find public trips"""
        db = get_db()
        collection = db.trips
        
        query = {'visibility': 'public', 'status': {'$in': ['booked', 'completed']}}
        if featured_only:
            query['featured'] = True
            
        cursor = collection.find(query).sort('average_rating', -1)
        if limit:
            cursor = cursor.limit(limit)
            
        return [cls.from_dict(data) for data in cursor]

    @classmethod
    def search_trips(cls, query_text, filters=None):
        """Search trips by text and filters"""
        db = get_db()
        collection = db.trips
        
        # Build search query
        search_query = {
            'visibility': 'public',
            '$or': [
                {'title': {'$regex': query_text, '$options': 'i'}},
                {'description': {'$regex': query_text, '$options': 'i'}},
                {'destination': {'$regex': query_text, '$options': 'i'}},
                {'tags': {'$regex': query_text, '$options': 'i'}}
            ]
        }
        
        # Apply filters
        if filters:
            if 'destination' in filters:
                search_query['destination'] = {'$regex': filters['destination'], '$options': 'i'}
            if 'trip_type' in filters:
                search_query['trip_type'] = filters['trip_type']
            if 'budget_min' in filters:
                search_query['budget'] = {'$gte': filters['budget_min']}
            if 'budget_max' in filters:
                if 'budget' in search_query:
                    search_query['budget']['$lte'] = filters['budget_max']
                else:
                    search_query['budget'] = {'$lte': filters['budget_max']}
            if 'duration_min' in filters:
                search_query['duration_days'] = {'$gte': filters['duration_min']}
            if 'duration_max' in filters:
                if 'duration_days' in search_query:
                    search_query['duration_days']['$lte'] = filters['duration_max']
                else:
                    search_query['duration_days'] = {'$lte': filters['duration_max']}
        
        trips_data = collection.find(search_query).sort('average_rating', -1)
        return [cls.from_dict(data) for data in trips_data]

    @classmethod
    def get_popular_destinations(cls, limit=10):
        """Get popular destinations"""
        db = get_db()
        collection = db.trips
        
        pipeline = [
            {'$match': {'visibility': 'public', 'status': {'$in': ['booked', 'completed']}}},
            {'$group': {'_id': '$destination', 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}},
            {'$limit': limit}
        ]
        
        return list(collection.aggregate(pipeline))

    def add_collaborator(self, user_id):
        """Add a collaborator to the trip"""
        user_obj_id = ObjectId(user_id) if isinstance(user_id, str) else user_id
        if user_obj_id not in self.collaborators:
            self.collaborators.append(user_obj_id)
            return self.save()
        return False

    def remove_collaborator(self, user_id):
        """Remove a collaborator from the trip"""
        user_obj_id = ObjectId(user_id) if isinstance(user_id, str) else user_id
        if user_obj_id in self.collaborators:
            self.collaborators.remove(user_obj_id)
            return self.save()
        return False

    def share_with_user(self, user_id):
        """Share trip with a user (view only)"""
        user_obj_id = ObjectId(user_id) if isinstance(user_id, str) else user_id
        if user_obj_id not in self.shared_with:
            self.shared_with.append(user_obj_id)
            return self.save()
        return False

    def increment_view_count(self):
        """Increment view count"""
        self.view_count += 1
        return self.save()

    def update_statistics(self):
        """Update trip statistics (ratings, reviews, etc.)"""
        from app.models.review import Review
        from app.models.booking import Booking
        
        # Update review statistics
        rating_stats = Review.get_average_rating(self._id, 'trip')
        self.average_rating = rating_stats['average_rating']
        self.total_reviews = rating_stats['total_reviews']
        
        # Update booking statistics
        bookings = Booking.find_by_trip(self._id)
        self.total_bookings = len([b for b in bookings if b.status in ['confirmed', 'completed']])
        self.total_spent = sum(b.total_amount for b in bookings if b.status in ['confirmed', 'completed'])
        
        return self.save()

    def calculate_duration(self):
        """Calculate trip duration in days"""
        if self.start_date and self.end_date:
            delta = self.end_date - self.start_date
            self.duration_days = delta.days + 1  # Include both start and end day
            return self.duration_days
        return None

    def can_user_access(self, user_id):
        """Check if user can access this trip"""
        user_obj_id = ObjectId(user_id) if isinstance(user_id, str) else user_id
        
        # Owner always has access
        if self.user_id == user_obj_id:
            return True
        
        # Public trips can be accessed by anyone
        if self.visibility == 'public':
            return True
        
        # Check if user is collaborator or shared with
        return user_obj_id in self.collaborators or user_obj_id in self.shared_with

    def can_user_edit(self, user_id):
        """Check if user can edit this trip"""
        user_obj_id = ObjectId(user_id) if isinstance(user_id, str) else user_id
        
        # Owner and collaborators can edit
        return (self.user_id == user_obj_id or user_obj_id in self.collaborators)

    def delete(self):
        """Delete trip from database"""
        db = get_db()
        collection = db.trips
        
        if hasattr(self, '_id') and self._id:
            # Also delete associated activities
            activities_collection = db.activities
            activities_collection.delete_many({'trip_id': str(self._id)})
            
            # Delete the trip
            collection.delete_one({'_id': self._id})
            return True
        
        return False