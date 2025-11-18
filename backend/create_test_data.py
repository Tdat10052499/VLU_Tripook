"""
Script to add test bookings and favorites for demo
"""
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

# Connect to MongoDB
client = MongoClient('mongodb+srv://dat:Tdat.100524@tripook-cluster.ht8st5x.mongodb.net/?appName=Tripook-Cluster')
db = client['Tripook-Cluster']

# Get a test user (replace with actual user_id from your database)
user = db.users.find_one({'email': 'teichimoi@example.com'})
if not user:
    print("❌ User not found. Please create a user account first.")
    print("   Login at http://localhost and create an account")
    exit()

user_id = user['_id']
print(f"✓ Found user: {user.get('name')} ({user.get('email')})")

# Create test bookings
print("\n📝 Creating test bookings...")
test_bookings = [
    {
        "booking_reference": f"BK{datetime.now().strftime('%Y%m%d')}001",
        "user_id": user_id,
        "service_id": ObjectId(),
        "service_type": "trip",
        "check_in": "2025-12-01",
        "check_out": "2025-12-05",
        "guests": 2,
        "status": "completed",
        "payment_status": "paid",
        "total_amount": 1500000,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "booking_reference": f"BK{datetime.now().strftime('%Y%m%d')}002",
        "user_id": user_id,
        "service_id": ObjectId(),
        "service_type": "accommodation",
        "check_in": "2025-11-20",
        "check_out": "2025-11-25",
        "guests": 3,
        "status": "confirmed",
        "payment_status": "paid",
        "total_amount": 2500000,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "booking_reference": f"BK{datetime.now().strftime('%Y%m%d')}003",
        "user_id": user_id,
        "service_id": ObjectId(),
        "service_type": "tour",
        "check_in": "2026-01-10",
        "check_out": "2026-01-15",
        "guests": 1,
        "status": "pending",
        "payment_status": "pending",
        "total_amount": 3200000,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
]

result = db.bookings.insert_many(test_bookings)
print(f"✓ Created {len(result.inserted_ids)} bookings")

# Create test favorites
print("\n❤️  Creating test favorites...")
test_favorites = [
    {
        "user_id": user_id,
        "service_id": ObjectId(),
        "service_type": "trip",
        "created_at": datetime.utcnow()
    },
    {
        "user_id": user_id,
        "service_id": ObjectId(),
        "service_type": "accommodation",
        "created_at": datetime.utcnow()
    },
    {
        "user_id": user_id,
        "service_id": ObjectId(),
        "service_type": "tour",
        "created_at": datetime.utcnow()
    },
    {
        "user_id": user_id,
        "service_id": ObjectId(),
        "service_type": "trip",
        "created_at": datetime.utcnow()
    },
    {
        "user_id": user_id,
        "service_id": ObjectId(),
        "service_type": "accommodation",
        "created_at": datetime.utcnow()
    }
]

result = db.favorites.insert_many(test_favorites)
print(f"✓ Created {len(result.inserted_ids)} favorites")

# Verify counts
bookings_count = db.bookings.count_documents({"user_id": user_id})
favorites_count = db.favorites.count_documents({"user_id": user_id})

print(f"\n✅ Test data created successfully!")
print(f"   📊 Total bookings: {bookings_count}")
print(f"   ❤️  Total favorites: {favorites_count}")
print(f"\n🔄 Now refresh your profile page at http://localhost/profile")
