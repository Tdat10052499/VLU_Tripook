#!/usr/bin/env python3
"""
Test admin users endpoint
"""
import sys
sys.path.insert(0, 'c:/Users/tdat1/VLU_Tripook-1/backend')

from pymongo import MongoClient
from app.utils.jwt_auth import generate_token
from bson import ObjectId
import requests

# MongoDB connection
MONGO_URI = "mongodb+srv://dat:Tdat.100524@tripook-cluster.ht8st5x.mongodb.net/tripook"

def test_admin_users_endpoint():
    try:
        # Get admin user and generate token
        client = MongoClient(MONGO_URI)
        db = client.tripook
        admin = db.users.find_one({'role': 'admin'})
        
        if not admin:
            print("❌ No admin user found!")
            return
        
        print(f"✅ Admin user: {admin['email']}")
        
        # Generate token
        token = generate_token(admin['_id'], False)
        print(f"✅ Token generated: {token[:50]}...")
        
        # Test API endpoint
        headers = {'Authorization': f'Bearer {token}'}
        
        # Test 1: Get all users
        print("\n📊 Testing GET /api/admin/users")
        r = requests.get('http://localhost:5000/api/admin/users?page=1&limit=5', headers=headers)
        print(f"Status: {r.status_code}")
        
        if r.status_code == 200:
            data = r.json()
            print(f"✅ Success: {data.get('success')}")
            print(f"📋 Total users: {data.get('pagination', {}).get('total', 0)}")
            print(f"📋 Users returned: {len(data.get('users', []))}")
            
            if data.get('users'):
                print("\n👥 First user:")
                user = data['users'][0]
                for key, value in user.items():
                    print(f"  {key}: {value}")
        else:
            print(f"❌ Error: {r.text}")
        
        # Test 2: Filter by role
        print("\n\n📊 Testing GET /api/admin/users?role=provider")
        r = requests.get('http://localhost:5000/api/admin/users?role=provider&limit=3', headers=headers)
        print(f"Status: {r.status_code}")
        
        if r.status_code == 200:
            data = r.json()
            print(f"✅ Providers found: {len(data.get('users', []))}")
        
        # Test 3: Database direct count
        print("\n\n📊 Database counts:")
        print(f"Total users: {db.users.count_documents({})}")
        print(f"Users by role:")
        for role in ['user', 'provider', 'admin']:
            count = db.users.count_documents({'role': role})
            print(f"  {role}: {count}")
        
        client.close()
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_admin_users_endpoint()
