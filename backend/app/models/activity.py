from datetime import datetime
from bson import ObjectId
from app.utils.database import get_db

class Activity:
    def __init__(self, trip_id, title, description, location, date, cost=None):
        self.trip_id = trip_id
        self.title = title
        self.description = description
        self.location = location
        self.date = date
        self.cost = cost
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def to_dict(self):
        return {
            '_id': getattr(self, '_id', None),
            'trip_id': self.trip_id,
            'title': self.title,
            'description': self.description,
            'location': self.location,
            'date': self.date,
            'cost': self.cost,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    @staticmethod
    def from_dict(data):
        activity = Activity(
            trip_id=data['trip_id'],
            title=data['title'],
            description=data['description'],
            location=data['location'],
            date=data['date'],
            cost=data.get('cost')
        )
        activity._id = data.get('_id')
        activity.created_at = data.get('created_at', datetime.utcnow())
        activity.updated_at = data.get('updated_at', datetime.utcnow())
        return activity

    def save(self):
        """Save activity to database"""
        db = get_db()
        collection = db.activities
        
        self.updated_at = datetime.utcnow()
        activity_data = self.to_dict()
        
        if hasattr(self, '_id') and self._id:
            # Update existing activity
            collection.update_one(
                {'_id': self._id},
                {'$set': activity_data}
            )
        else:
            # Create new activity
            result = collection.insert_one(activity_data)
            self._id = result.inserted_id
        
        return self

    @staticmethod
    def find_by_id(activity_id):
        """Find activity by ID"""
        db = get_db()
        collection = db.activities
        
        try:
            activity_data = collection.find_one({'_id': ObjectId(activity_id)})
            if activity_data:
                return Activity.from_dict(activity_data)
        except:
            pass
        return None

    @staticmethod
    def find_by_trip(trip_id):
        """Find all activities for a trip"""
        db = get_db()
        collection = db.activities
        
        activities = []
        for activity_data in collection.find({'trip_id': trip_id}).sort('date', 1):
            activities.append(Activity.from_dict(activity_data))
        
        return activities

    def delete(self):
        """Delete activity from database"""
        db = get_db()
        collection = db.activities
        
        if hasattr(self, '_id') and self._id:
            collection.delete_one({'_id': self._id})
            return True
        
        return False