import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Connect to MongoDB
mongo_uri = os.getenv('MONGO_URI')
client = MongoClient(mongo_uri)
db = client['tripook']

# Find all users with provider-related fields
print("\n=== Searching for all provider accounts ===")
providers = db.users.find({
    '$or': [
        {'companyName': {'$exists': True}},
        {'businessType': {'$exists': True}},
        {'accountStatus': 'pending'},
        {'accountStatus': 'active', 'role': 'provider'}
    ]
})

count = 0
for provider in providers:
    count += 1
    print(f"\n--- Provider #{count} ---")
    print(f"Email: {provider.get('email', 'N/A')}")
    print(f"Name: {provider.get('name', 'N/A')}")
    print(f"Full Name: {provider.get('fullName', 'N/A')}")
    print(f"Role: {provider.get('role', 'NOT SET')}")
    print(f"Account Status: {provider.get('accountStatus', 'N/A')}")
    print(f"Status: {provider.get('status', 'N/A')}")
    print(f"Company Name: {provider.get('companyName', 'N/A')}")
    print(f"Business Type: {provider.get('businessType', 'N/A')}")
    
    # Check if role needs to be updated
    if provider.get('role') != 'provider':
        print(f"⚠️ WARNING: Role is '{provider.get('role')}', should be 'provider'")
        print("Updating role to 'provider'...")
        result = db.users.update_one(
            {'_id': provider['_id']},
            {'$set': {'role': 'provider'}}
        )
        if result.modified_count > 0:
            print("✅ Role updated successfully!")
        else:
            print("❌ Failed to update role")

if count == 0:
    print("\nNo provider accounts found.")

client.close()
