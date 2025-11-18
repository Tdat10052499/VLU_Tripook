"""
Test Email Verification System
Run: docker exec -it tripook-backend python test_email_verification.py
"""

from app.utils.database import get_db
from pymongo import MongoClient
from datetime import datetime

# Connect to MongoDB
client = MongoClient('mongodb+srv://dat:Tdat.100524@tripook-cluster.ht8st5x.mongodb.net/?appName=Tripook-Cluster')
db = client['Tripook-Cluster']

print("🔍 Checking Email Verification Status...")
print("=" * 60)

# 1. Count total users
total_users = db.users.count_documents({})
print(f"📊 Total users: {total_users}")

# 2. Count verified vs unverified
verified_count = db.users.count_documents({'is_verified': True})
unverified_count = db.users.count_documents({'is_verified': False})

print(f"✅ Verified users: {verified_count}")
print(f"⚠️  Unverified users: {unverified_count}")

# 3. Update traveller@tripook.com to unverified for testing
test_user_email = 'traveller@tripook.com'
result = db.users.update_one(
    {'email': test_user_email},
    {'$set': {
        'is_verified': False,
        'verification_token': None,
        'verification_token_expires': None,
        'verification_sent_count': 0,
        'last_verification_sent': None
    }}
)

if result.modified_count > 0:
    print(f"\n✅ Updated {test_user_email} to unverified status for testing")
else:
    print(f"\n⚠️  User {test_user_email} not found or already unverified")

# 4. Show test user details
test_user = db.users.find_one({'email': test_user_email})
if test_user:
    print(f"\n📧 Test User Details:")
    print(f"   Email: {test_user.get('email')}")
    print(f"   Name: {test_user.get('name')}")
    print(f"   Verified: {test_user.get('is_verified', False)}")
    print(f"   Role: {test_user.get('role', 'user')}")
    print(f"   Sent Count: {test_user.get('verification_sent_count', 0)}")

# 5. List all unverified users
print(f"\n📋 Unverified Users List:")
print("-" * 60)
unverified_users = db.users.find(
    {'is_verified': False},
    {'email': 1, 'name': 1, 'role': 1, '_id': 0}
).limit(10)

count = 0
for user in unverified_users:
    count += 1
    print(f"{count}. {user.get('email')} - {user.get('name')} [{user.get('role', 'user')}]")

if count == 0:
    print("   (No unverified users found)")

print("\n" + "=" * 60)
print("🧪 Test Instructions:")
print("1. Login with: traveller@tripook.com / 123456")
print("2. You should see yellow warning banner at top")
print("3. Click 'Xác thực ngay' or go to Profile → Security tab")
print("4. Click 'Gửi email xác thực' button")
print("5. Check console logs for email mock (SMTP not configured)")
print("6. To test real email, configure SMTP in .env file")
print("=" * 60)
