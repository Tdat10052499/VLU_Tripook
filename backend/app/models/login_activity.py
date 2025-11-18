"""
Login Activity Model - Track user login sessions
"""
from datetime import datetime, timedelta
from bson import ObjectId
from app.utils.database import get_db


class LoginActivity:
    """Model to track user login activities for analytics"""
    
    def __init__(self, user_id, ip_address=None, user_agent=None):
        self.user_id = user_id
        self.login_timestamp = datetime.utcnow()
        self.ip_address = ip_address
        self.user_agent = user_agent
    
    def record_login(self):
        """Save login activity to database"""
        db = get_db()
        # Store user_id as ObjectId (not string) to enable joins with users collection
        user_id = self.user_id if isinstance(self.user_id, ObjectId) else ObjectId(self.user_id)
        activity_data = {
            'user_id': user_id,
            'login_timestamp': self.login_timestamp,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent
        }
        result = db.login_activities.insert_one(activity_data)
        return str(result.inserted_id)
    
    @staticmethod
    def get_login_stats(start_date=None, end_date=None):
        """Get login statistics for a date range"""
        db = get_db()
        match_query = {}
        
        if start_date and end_date:
            match_query['login_timestamp'] = {
                '$gte': start_date,
                '$lte': end_date
            }
        elif start_date:
            match_query['login_timestamp'] = {'$gte': start_date}
        
        pipeline = [
            {'$match': match_query},
            {'$group': {
                '_id': {
                    'year': {'$year': '$login_timestamp'},
                    'month': {'$month': '$login_timestamp'},
                    'day': {'$dayOfMonth': '$login_timestamp'}
                },
                'login_count': {'$sum': 1},
                'unique_users': {'$addToSet': '$user_id'}
            }},
            {'$project': {
                'date': '$_id',
                'login_count': 1,
                'unique_user_count': {'$size': '$unique_users'},
                '_id': 0
            }},
            {'$sort': {'date.year': 1, 'date.month': 1, 'date.day': 1}}
        ]
        
        return list(db.login_activities.aggregate(pipeline))
    
    @staticmethod
    def get_total_logins_today():
        """Get total login count for today"""
        db = get_db()
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        return db.login_activities.count_documents({
            'login_timestamp': {'$gte': today_start}
        })
    
    @staticmethod
    def get_user_activity(user_id, limit=10):
        """Get recent login activity for a specific user"""
        db = get_db()
        activities = db.login_activities.find(
            {'user_id': user_id}
        ).sort('login_timestamp', -1).limit(limit)
        
        result = []
        for activity in activities:
            result.append({
                'timestamp': activity.get('login_timestamp').isoformat() if activity.get('login_timestamp') else None,
                'ipAddress': activity.get('ip_address', ''),
                'userAgent': activity.get('user_agent', '')
            })
        
        return result
    
    @staticmethod
    def get_activity_stats(days=30):
        """
        Get login activity statistics for specified number of days
        Returns data grouped by date with login counts
        """
        db = get_db()
        since = datetime.utcnow() - timedelta(days=days)
        
        pipeline = [
            {
                '$match': {
                    'login_timestamp': {'$gte': since}
                }
            },
            {
                '$group': {
                    '_id': {
                        '$dateToString': {
                            'format': '%Y-%m-%d',
                            'date': '$login_timestamp'
                        }
                    },
                    'count': {'$sum': 1},
                    'unique_users': {'$addToSet': '$user_id'}
                }
            },
            {
                '$project': {
                    'date': '$_id',
                    'count': 1,
                    'unique_users': {'$size': '$unique_users'},
                    '_id': 0
                }
            },
            {
                '$sort': {'date': 1}
            }
        ]
        
        results = list(db.login_activities.aggregate(pipeline))
        
        # Fill in missing dates with zero counts
        result_dict = {item['date']: item for item in results}
        
        filled_results = []
        current_date = since.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        
        while current_date <= end_date:
            date_str = current_date.strftime('%Y-%m-%d')
            if date_str in result_dict:
                filled_results.append(result_dict[date_str])
            else:
                filled_results.append({
                    'date': date_str,
                    'count': 0,
                    'unique_users': 0
                })
            current_date += timedelta(days=1)
        
        return filled_results
