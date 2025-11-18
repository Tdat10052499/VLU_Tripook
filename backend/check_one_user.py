"""
Script to check a specific user's verification status
"""
import os
from pymongo import MongoClient

# Get MongoDB URI from environment
mongo_uri = 'mongodb://admin:tripook_admin_2024@mongodb:27017/tripook?authSource=admin'

# Connect to MongoDB
client = MongoClient(mongo_uri)
db = client['tripook']

email = 'test_verify_001@gmail.com'

print(f"\n🔍 Checking user: {email}")
print("=" * 60)

try:
    user = db.users.find_one({'email': email})
    
    if user:
        print(f"\n📧 Email: {user.get('email')}")
        print(f"👤 Name: {user.get('name')}")
        print(f"✅ is_verified: {user.get('is_verified')}")
        print(f"✅ isEmailVerified: {user.get('isEmailVerified')}")
        print(f"🎭 Role: {user.get('role')}")
        print(f"📅 Created: {user.get('created_at', user.get('createdAt'))}")
        print(f"🔑 verification_token: {user.get('verification_token')}")
        print(f"⏰ verification_token_expires: {user.get('verification_token_expires')}")
    else:
        print(f"\n❌ User not found!")
    
except Exception as e:
    print(f"\n❌ Error: {e}\n")
