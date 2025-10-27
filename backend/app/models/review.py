from datetime import datetime
from bson import ObjectId
from app.utils.database import get_db

class Review:
    def __init__(self, user_id, item_id, item_type="trip", rating=5):
        self.user_id = ObjectId(user_id) if isinstance(user_id, str) else user_id
        self.item_id = ObjectId(item_id) if isinstance(item_id, str) else item_id
        self.item_type = item_type  # 'trip', 'service', 'booking'
        self.rating = max(1, min(5, int(rating)))  # 1-5 stars
        
        # Review content
        self.title = ""
        self.content = ""
        self.pros = []  # List of positive aspects
        self.cons = []  # List of negative aspects
        
        # Detailed ratings (optional)
        self.detailed_ratings = {
            "value_for_money": None,
            "service_quality": None,
            "cleanliness": None,
            "location": None,
            "facilities": None
        }
        
        # Media attachments
        self.photos = []  # List of photo URLs
        self.videos = []  # List of video URLs
        
        # Review metadata
        self.booking_id = None  # Reference to booking if applicable
        self.verified_purchase = False  # True if user actually booked/used the service
        self.helpful_votes = 0  # Number of helpful votes from other users
        self.total_votes = 0   # Total votes (helpful + not helpful)
        
        # Moderation
        self.status = "published"  # 'published', 'pending', 'hidden', 'deleted'
        self.moderation_notes = ""
        self.flagged_count = 0
        
        # Response from business
        self.business_response = None
        self.business_response_date = None
        
        # Timestamps
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def to_dict(self):
        """Convert review to dictionary for MongoDB storage"""
        return {
            'user_id': self.user_id,
            'item_id': self.item_id,
            'item_type': self.item_type,
            'rating': self.rating,
            'title': self.title,
            'content': self.content,
            'pros': self.pros,
            'cons': self.cons,
            'detailed_ratings': self.detailed_ratings,
            'photos': self.photos,
            'videos': self.videos,
            'booking_id': self.booking_id,
            'verified_purchase': self.verified_purchase,
            'helpful_votes': self.helpful_votes,
            'total_votes': self.total_votes,
            'status': self.status,
            'moderation_notes': self.moderation_notes,
            'flagged_count': self.flagged_count,
            'business_response': self.business_response,
            'business_response_date': self.business_response_date,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    @classmethod
    def from_dict(cls, data):
        """Create review from dictionary"""
        review = cls(
            user_id=data['user_id'],
            item_id=data['item_id'],
            item_type=data.get('item_type', 'trip'),
            rating=data.get('rating', 5)
        )
        
        # Update all fields
        for key, value in data.items():
            if hasattr(review, key):
                setattr(review, key, value)
        
        return review

    def save(self):
        """Save review to database"""
        db = get_db()
        collection = db.reviews
        
        self.updated_at = datetime.utcnow()
        
        if hasattr(self, '_id'):
            # Update existing review
            result = collection.update_one(
                {'_id': self._id},
                {'$set': self.to_dict()}
            )
            return result.modified_count > 0
        else:
            # Create new review
            result = collection.insert_one(self.to_dict())
            self._id = result.inserted_id
            return True

    @classmethod
    def find_by_id(cls, review_id):
        """Find review by ID"""
        db = get_db()
        collection = db.reviews
        
        review_data = collection.find_one({'_id': ObjectId(review_id)})
        if review_data:
            return cls.from_dict(review_data)
        return None

    @classmethod
    def find_by_item(cls, item_id, item_type, status="published", limit=None):
        """Find all reviews for an item"""
        db = get_db()
        collection = db.reviews
        
        query = {
            'item_id': ObjectId(item_id),
            'item_type': item_type,
            'status': status
        }
        
        cursor = collection.find(query).sort('created_at', -1)
        if limit:
            cursor = cursor.limit(limit)
            
        return [cls.from_dict(data) for data in cursor]

    @classmethod
    def find_by_user(cls, user_id, status="published"):
        """Find all reviews by a user"""
        db = get_db()
        collection = db.reviews
        
        reviews_data = collection.find({
            'user_id': ObjectId(user_id),
            'status': status
        }).sort('created_at', -1)
        return [cls.from_dict(data) for data in reviews_data]

    @classmethod
    def get_average_rating(cls, item_id, item_type):
        """Get average rating for an item"""
        db = get_db()
        collection = db.reviews
        
        pipeline = [
            {
                '$match': {
                    'item_id': ObjectId(item_id),
                    'item_type': item_type,
                    'status': 'published'
                }
            },
            {
                '$group': {
                    '_id': None,
                    'average_rating': {'$avg': '$rating'},
                    'total_reviews': {'$sum': 1},
                    'rating_distribution': {
                        '$push': '$rating'
                    }
                }
            }
        ]
        
        result = list(collection.aggregate(pipeline))
        if result:
            data = result[0]
            # Calculate rating distribution
            distribution = {}
            for i in range(1, 6):
                distribution[str(i)] = data['rating_distribution'].count(i)
            
            return {
                'average_rating': round(data['average_rating'], 1),
                'total_reviews': data['total_reviews'],
                'rating_distribution': distribution
            }
        
        return {
            'average_rating': 0,
            'total_reviews': 0,
            'rating_distribution': {'1': 0, '2': 0, '3': 0, '4': 0, '5': 0}
        }

    @classmethod
    def user_has_reviewed(cls, user_id, item_id, item_type):
        """Check if user has already reviewed an item"""
        db = get_db()
        collection = db.reviews
        
        return collection.find_one({
            'user_id': ObjectId(user_id),
            'item_id': ObjectId(item_id),
            'item_type': item_type,
            'status': {'$in': ['published', 'pending']}
        }) is not None

    def mark_helpful(self, helpful=True):
        """Mark review as helpful or not helpful"""
        if helpful:
            self.helpful_votes += 1
        self.total_votes += 1
        return self.save()

    def add_business_response(self, response):
        """Add business response to review"""
        self.business_response = response
        self.business_response_date = datetime.utcnow()
        return self.save()

    def flag_review(self, reason=None):
        """Flag review for moderation"""
        self.flagged_count += 1
        if self.flagged_count >= 5:  # Auto-hide after 5 flags
            self.status = "pending"
        return self.save()

    def delete(self):
        """Delete review"""
        if hasattr(self, '_id'):
            db = get_db()
            collection = db.reviews
            result = collection.delete_one({'_id': self._id})
            return result.deleted_count > 0
        return False