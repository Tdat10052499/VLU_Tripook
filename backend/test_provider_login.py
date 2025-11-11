#!/usr/bin/env python3
"""
Test login for providers with different password hash formats
"""
import requests
import json

print("=" * 80)
print("🧪 Testing Provider Login")
print("=" * 80)

# Test 1: Try login with bcrypt provider
print("\n📝 Test 1: Login with bcrypt password hash")
print("Email: newest.provider@example.com")
print("Password: Test@123456")

response = requests.post(
    'http://localhost:5000/api/auth/simple-login',
    json={
        'login': 'newest.provider@example.com',
        'password': 'Test@123456',
        'remember_me': False
    }
)

print(f"Status: {response.status_code}")
result = response.json()
print(f"Success: {result.get('success')}")
if result.get('success'):
    print(f"✅ Login successful!")
    print(f"   User: {result.get('user', {}).get('name')}")
    print(f"   Role: {result.get('user', {}).get('role')}")
else:
    print(f"❌ Login failed: {result.get('message')}")

# Test 2: Create new provider with werkzeug hash
print("\n\n📝 Test 2: Register new provider (werkzeug hash)")
provider_data = {
    "userType": "provider",
    "email": "werkzeug.provider@example.com",
    "password": "Werkzeug@123",
    "confirmPassword": "Werkzeug@123",
    "fullName": "Werkzeug Provider",
    "phone": "0987654999",
    "companyName": "Werkzeug Travel",
    "businessType": "tour_operator",
    "businessAddress": "999 Werkzeug Street"
}

reg_response = requests.post(
    'http://localhost:5000/api/registration/register',
    json=provider_data
)

print(f"Registration Status: {reg_response.status_code}")
reg_result = reg_response.json()
if reg_result.get('success'):
    print(f"✅ Registration successful!")
    
    # Test 3: Login with new provider
    print("\n\n📝 Test 3: Login with new provider (werkzeug hash)")
    print("Email: werkzeug.provider@example.com")
    print("Password: Werkzeug@123")
    
    login_response = requests.post(
        'http://localhost:5000/api/auth/simple-login',
        json={
            'login': 'werkzeug.provider@example.com',
            'password': 'Werkzeug@123',
            'remember_me': False
        }
    )
    
    print(f"Status: {login_response.status_code}")
    login_result = login_response.json()
    print(f"Success: {login_result.get('success')}")
    if login_result.get('success'):
        print(f"✅ Login successful!")
        print(f"   User: {login_result.get('user', {}).get('name')}")
        print(f"   Role: {login_result.get('user', {}).get('role')}")
        print(f"   Account Status: {login_result.get('user', {}).get('accountStatus')}")
    else:
        print(f"❌ Login failed: {login_result.get('message')}")
else:
    print(f"❌ Registration failed: {reg_result.get('message')}")

print("\n" + "=" * 80)
