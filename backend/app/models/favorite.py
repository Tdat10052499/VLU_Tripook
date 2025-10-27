from datetime import datetime
from bson import ObjectId
from app.utils.database import get_db

class Favorite:
    def __init__(self, user_id, item_id, item_type="trip"):
        self.user_id = ObjectId(user_id) if isinstance(user_id, str) else user_id
        self.item_id = ObjectId(item_id) if isinstance(item_id, str) else item_id
        self.item_type = item_type  # 'trip', 'service', 'destination'
        
        # Metadata
        self.tags = []  # User-defined tags for organization
        self.notes = ""  # Personal notes about why they favorited it
        self.priority = 1  # 1-5 priority rating
        
        # Timestamps
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def to_dict(self):
        """Convert favorite to dictionary for MongoDB storage"""
        return {
            'user_id': self.user_id,
            'item_id': self.item_id,
            'item_type': self.item_type,
            'tags': self.tags,
            'notes': self.notes,
            'priority': self.priority,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    @classmethod
    def from_dict(cls, data):
        """Create favorite from dictionary"""
        favorite = cls(
            user_id=data['user_id'],
            item_id=data['item_id'],
            item_type=data.get('item_type', 'trip')
        )
        
        # Update all fields
        for key, value in data.items():
            if hasattr(favorite, key):
                setattr(favorite, key, value)
        
        return favorite

    def save(self):
        """Save favorite to database"""
        db = get_db()
        collection = db.favorites
        
        self.updated_at = datetime.utcnow()
        
        if hasattr(self, '_id'):
            # Update existing favorite
            result = collection.update_one(
                {'_id': self._id},
                {'$set': self.to_dict()}
            )
            return result.modified_count > 0
        else:
            # Create new favorite (check for duplicates first)
            existing = collection.find_one({
                'user_id': self.user_id,
                'item_id': self.item_id,
                'item_type': self.item_type
            })
            
            if existing:
                # Update existing
                self._id = existing['_id']
                return self.save()
            else:
                # Create new
                result = collection.insert_one(self.to_dict())
                self._id = result.inserted_id
                return True

    @classmethod
    def find_by_id(cls, favorite_id):
        """Find favorite by ID"""
        db = get_db()
        collection = db.favorites
        
        favorite_data = collection.find_one({'_id': ObjectId(favorite_id)})
        if favorite_data:
            return cls.from_dict(favorite_data)
        return None

    @classmethod
    def find_by_user(cls, user_id, item_type=None):
        """Find all favorites for a user"""
        db = get_db()
        collection = db.favorites
        
        query = {'user_id': ObjectId(user_id)}
        if item_type:
            query['item_type'] = item_type
            
        favorites_data = collection.find(query).sort('created_at', -1)
        return [cls.from_dict(data) for data in favorites_data]

    @classmethod
    def find_by_item(cls, item_id, item_type):
        """Find all users who favorited an item"""
        db = get_db()
        collection = db.favorites
        
        favorites_data = collection.find({
            'item_id': ObjectId(item_id),
            'item_type': item_type
        }).sort('created_at', -1)
        return [cls.from_dict(data) for data in favorites_data]

    @classmethod
    def is_favorited(cls, user_id, item_id, item_type):
        """Check if user has favorited an item"""
        db = get_db()
        collection = db.favorites
        
        return collection.find_one({
            'user_id': ObjectId(user_id),
            'item_id': ObjectId(item_id),
            'item_type': item_type
        }) is not None

    @classmethod
    def remove_favorite(cls, user_id, item_id, item_type):
        """Remove favorite"""
        db = get_db()
        collection = db.favorites
        
        result = collection.delete_one({
            'user_id': ObjectId(user_id),
            'item_id': ObjectId(item_id),
            'item_type': item_type
        })
        return result.deleted_count > 0

    def delete(self):
        """Delete this favorite"""
        if hasattr(self, '_id'):
            db = get_db()
            collection = db.favorites
            result = collection.delete_one({'_id': self._id})
            return result.deleted_count > 0
        return False