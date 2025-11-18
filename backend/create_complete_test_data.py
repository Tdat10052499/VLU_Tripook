"""
Create a test user with bookings and favorites
"""
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from werkzeug.security import generate_password_hash

# Connect to MongoDB
client = MongoClient('mongodb+srv://dat:Tdat.100524@tripook-cluster.ht8st5x.mongodb.net/?appName=Tripook-Cluster')
db = client['Tripook-Cluster']

# Create test user
print("👤 Creating test user...")
test_user = {
    "username": "traveller",
    "email": "traveller@tripook.com",
    "password": generate_password_hash("123456"),
    "name": "Teichimoi",
    "phone": "0912345678",
    "role": "user",
    "is_verified": True,
    "created_at": datetime.utcnow(),
    "updated_at": datetime.utcnow()
}

# Check if user exists
existing_user = db.users.find_one({"email": test_user["email"]})
if existing_user:
    print(f"✓ User already exists: {existing_user.get('email')}")
    user_id = existing_user['_id']
else:
    result = db.users.insert_one(test_user)
    user_id = result.inserted_id
    print(f"✓ Created user: {test_user['email']}")
    print(f"  Username: {test_user['username']}")
    print(f"  Password: 123456")

# Create test bookings
print("\n📝 Creating test bookings...")
# Clear existing bookings for this user
db.bookings.delete_many({"user_id": user_id})

test_bookings = [
    {
        "booking_reference": f"BK20251117001",
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
        "booking_reference": f"BK20251117002",
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
        "booking_reference": f"BK20251117003",
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
    },
    {
        "booking_reference": f"BK20251117004",
        "user_id": user_id,
        "service_id": ObjectId(),
        "service_type": "trip",
        "check_in": "2025-12-15",
        "check_out": "2025-12-20",
        "guests": 4,
        "status": "completed",
        "payment_status": "paid",
        "total_amount": 4500000,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "booking_reference": f"BK20251117005",
        "user_id": user_id,
        "service_id": ObjectId(),
        "service_type": "accommodation",
        "check_in": "2026-02-01",
        "check_out": "2026-02-07",
        "guests": 2,
        "status": "confirmed",
        "payment_status": "paid",
        "total_amount": 3800000,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
]

result = db.bookings.insert_many(test_bookings)
print(f"✓ Created {len(result.inserted_ids)} bookings")

# Create test favorites
print("\n❤️  Creating test favorites...")
# Clear existing favorites for this user
db.favorites.delete_many({"user_id": user_id})

test_favorites = []
for i in range(7):  # Create 7 favorites
    test_favorites.append({
        "user_id": user_id,
        "service_id": ObjectId(),
        "service_type": ["trip", "accommodation", "tour"][i % 3],
        "created_at": datetime.utcnow()
    })

result = db.favorites.insert_many(test_favorites)
print(f"✓ Created {len(result.inserted_ids)} favorites")

# Verify counts
bookings_count = db.bookings.count_documents({"user_id": user_id})
favorites_count = db.favorites.count_documents({"user_id": user_id})

print(f"\n✅ Test data created successfully!")
print(f"\n📊 Stats for user: {test_user['email']}")
print(f"   🎫 Total bookings: {bookings_count}")
print(f"   ❤️  Total favorites: {favorites_count}")
print(f"\n🔐 Login credentials:")
print(f"   Email: {test_user['email']}")
print(f"   Password: 123456")
print(f"\n🔄 Now login and visit: http://localhost/profile")
