"""
Test registration with is_verified = False
"""
import requests
import json

url = 'http://localhost:5000/api/registration/register'

# Test data for new user
import time
timestamp = int(time.time())

data = {
    'userType': 'tourist',
    'email': f'test_verify_{timestamp}@gmail.com',
    'password': '123456',
    'confirmPassword': '123456',
    'fullName': 'Test Verify User',
    'phone': '0999999999'
}

print("\n📝 Registering new user...")
print(f"Email: {data['email']}")
print(f"Name: {data['fullName']}")

response = requests.post(url, json=data)

print(f"\n📊 Response Status: {response.status_code}")
print(f"📄 Response Body: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

if response.status_code == 201:
    print("\n✅ Registration successful!")
    print("\n🔍 Now checking database...")
    
    # Check in database
    import os
    import sys
    sys.path.append('/app')
    
    from pymongo import MongoClient
    
    mongo_uri = 'mongodb://admin:tripook_admin_2024@mongodb:27017/tripook?authSource=admin'
    client = MongoClient(mongo_uri)
    db = client['tripook']
    
    user = db.users.find_one({'email': data['email']})
    
    if user:
        print(f"\n📧 Email: {user.get('email')}")
        print(f"👤 Name: {user.get('name')}")
        print(f"✅ is_verified: {user.get('is_verified')}")
        print(f"✅ isEmailVerified: {user.get('isEmailVerified')}")
        
        if user.get('is_verified') == False:
            print("\n🎉 SUCCESS! is_verified = False (CORRECT)")
        else:
            print(f"\n❌ FAILED! is_verified = {user.get('is_verified')} (SHOULD BE False)")
    else:
        print("\n❌ User not found in database!")
else:
    print(f"\n❌ Registration failed: {response.text}")
