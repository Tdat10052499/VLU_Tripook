"""
Script to check is_verified status of all users
"""
import os
from pymongo import MongoClient

# Get MongoDB URI from environment
mongo_uri = os.getenv('MONGO_URI', 'mongodb://mongodb:27017/')

# Connect to MongoDB
client = MongoClient(mongo_uri)
db = client[os.getenv('MONGO_DATABASE', 'tripook')]

print("\n🔍 Checking All Users' is_verified Status...")
print("=" * 60)

try:
    total_users = db.users.count_documents({})
    print(f"\n📊 Total users: {total_users}\n")
    
    users = db.users.find()
    
    for i, user in enumerate(users, 1):
        print(f"{i}. Email: {user.get('email')}")
        print(f"   Name: {user.get('name')}")
        print(f"   is_verified: {user.get('is_verified')}")
        print(f"   isEmailVerified: {user.get('isEmailVerified')}")
        print(f"   Role: {user.get('role')}")
        print(f"   Created: {user.get('created_at', user.get('createdAt'))}")
        print("-" * 60)
    
    print("\n✅ Done!\n")
    
except Exception as e:
    print(f"\n❌ Error: {e}\n")
    print(f"MongoDB URI: {mongo_uri}")
    print(f"Database: {os.getenv('MONGO_DATABASE', 'tripook')}")
