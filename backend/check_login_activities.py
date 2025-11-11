#!/usr/bin/env python3
"""
Script to check login_activities collection in MongoDB
"""
from pymongo import MongoClient
from datetime import datetime, timedelta

# MongoDB connection
MONGO_URI = "mongodb+srv://dat:Tdat.100524@tripook-cluster.ht8st5x.mongodb.net/tripook"

def check_login_activities():
    try:
        client = MongoClient(MONGO_URI)
        db = client.tripook
        
        # Count total login activities
        total = db.login_activities.count_documents({})
        print(f"\n📊 Total login activities: {total}")
        
        if total == 0:
            print("\n⚠️  No login activities found!")
            print("This is normal if nobody has logged in since login tracking was implemented.")
            print("\nTo populate data:")
            print("1. Login with admin account: admin@tripook.com / Admin@123456")
            print("2. Logout and login again a few times")
            print("3. Check admin dashboard statistics")
            return
        
        # Get recent activities
        print("\n📋 Recent login activities:")
        activities = db.login_activities.find().sort('login_timestamp', -1).limit(5)
        
        for activity in activities:
            user_id = activity.get('user_id')
            timestamp = activity.get('login_timestamp', activity.get('login_time'))
            ip = activity.get('ip_address', 'N/A')
            
            # Get user info
            user = db.users.find_one({'_id': user_id})
            user_email = user.get('email', 'Unknown') if user else 'Unknown'
            
            print(f"\n  User: {user_email}")
            print(f"  Time: {timestamp}")
            print(f"  IP: {ip}")
        
        # Get statistics for last 30 days
        since = datetime.utcnow() - timedelta(days=30)
        recent_count = db.login_activities.count_documents({
            'login_timestamp': {'$gte': since}
        })
        
        print(f"\n📈 Logins in last 30 days: {recent_count}")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
    finally:
        client.close()

if __name__ == '__main__':
    check_login_activities()
