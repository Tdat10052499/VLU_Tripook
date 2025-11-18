"""
Create indexes for bookings collection to optimize queries
Run this script once to create indexes
"""
from pymongo import MongoClient, ASCENDING, DESCENDING

def create_booking_indexes():
    """Create optimized indexes for bookings collection"""
    # Direct MongoDB connection
    client = MongoClient('mongodb+srv://dat:Tdat.100524@tripook-cluster.ht8st5x.mongodb.net/?appName=Tripook-Cluster')
    db = client['Tripook-Cluster']
    bookings_collection = db['bookings']
    
    print("Creating indexes for bookings collection...")
    
    # 1. Index for user's booking history (most common query)
    # Query: Get all bookings of a user, sorted by date
    bookings_collection.create_index([
        ('user_id', ASCENDING),
        ('created_at', DESCENDING)
    ], name='user_bookings_by_date')
    print("✓ Created index: user_bookings_by_date")
    
    # 2. Unique index for booking_reference (fast lookup)
    bookings_collection.create_index([
        ('booking_reference', ASCENDING)
    ], unique=True, name='booking_reference_unique')
    print("✓ Created index: booking_reference_unique")
    
    # 3. Index for status queries (filter by status)
    bookings_collection.create_index([
        ('user_id', ASCENDING),
        ('status', ASCENDING),
        ('created_at', DESCENDING)
    ], name='user_status_date')
    print("✓ Created index: user_status_date")
    
    # 4. Index for time-based analytics
    bookings_collection.create_index([
        ('created_at', DESCENDING)
    ], name='created_at_desc')
    print("✓ Created index: created_at_desc")
    
    # 5. Index for service bookings
    bookings_collection.create_index([
        ('service_id', ASCENDING),
        ('created_at', DESCENDING)
    ], name='service_bookings')
    print("✓ Created index: service_bookings")
    
    # 6. Index for guest bookings (by email)
    bookings_collection.create_index([
        ('guest_info.email', ASCENDING)
    ], name='guest_email', sparse=True)
    print("✓ Created index: guest_email")
    
    # 7. Compound index for pagination
    bookings_collection.create_index([
        ('user_id', ASCENDING),
        ('created_at', DESCENDING),
        ('_id', ASCENDING)
    ], name='user_pagination')
    print("✓ Created index: user_pagination")
    
    print("\n✅ All indexes created successfully!")
    
    # Show all indexes
    print("\nExisting indexes:")
    for index in bookings_collection.list_indexes():
        print(f"  - {index['name']}: {index['key']}")

if __name__ == '__main__':
    create_booking_indexes()
