#!/usr/bin/env python
"""
Complete test: Register → Send verification → Check DB → Verify
"""
import requests
from pymongo import MongoClient
from datetime import datetime
import os
import time

BASE_URL = 'http://localhost:5000'

# Step 1: Register new user
email = f'test_{int(time.time())}@example.com'
print(f'📝 1. Đăng ký user: {email}')

r1 = requests.post(f'{BASE_URL}/api/registration/register', json={
    'userType': 'tourist',
    'email': email,
    'password': '123456',
    'confirmPassword': '123456',
    'fullName': 'Test User',
    'phone': '0999888777'
})

if r1.status_code != 201:
    print(f'❌ Register failed: {r1.json()}')
    exit(1)

token = r1.json()['token']
print(f'   ✅ Register OK')

# Step 2: Send verification email
print(f'\n📧 2. Gửi email xác thực...')
r2 = requests.post(
    f'{BASE_URL}/api/auth/send-verification',
    headers={'Authorization': f'Bearer {token}'}
)

print(f'   Status: {r2.status_code}')
print(f'   Response: {r2.json()}')

if r2.status_code != 200:
    print(f'   ❌ Send failed!')
    exit(1)

print(f'   ✅ Email sent!')

# Step 3: Check DB
print(f'\n🔍 3. Check database...')
client = MongoClient(os.getenv('MONGO_URI'))
db = client[os.getenv('MONGO_DATABASE', 'tripook')]

# Try both original and lowercase
user = db.users.find_one({'email': email})
if not user:
    user = db.users.find_one({'email': email.lower()})

if not user:
    print(f'   ❌ User not found in DB!')
    print(f'   Trying to find any user with similar email...')
    all_users = list(db.users.find({}, {'email': 1}).limit(5))
    print(f'   Recent emails: {[u.get("email") for u in all_users]}')
    exit(1)

vtoken = user.get('verification_token')
vexpires = user.get('verification_token_expires')

if not vtoken:
    print(f'   ❌ Token NOT in database!')
    print(f'   User fields: {list(user.keys())}')
    exit(1)

print(f'   ✅ Token: {vtoken[:40]}...')
print(f'   ✅ Expires: {vexpires}')

if vexpires:
    if isinstance(vexpires, (int, float)):
        expiry_dt = datetime.fromtimestamp(vexpires)
        diff = (expiry_dt - datetime.now()).total_seconds()
        print(f'   ✅ Valid for: {diff/3600:.1f} hours')

# Step 4: Verify email
print(f'\n✅ 4. Verify email...')
r3 = requests.get(f'{BASE_URL}/api/auth/verify-email?token={vtoken}')

print(f'   Status: {r3.status_code}')
print(f'   Response: {r3.json()}')

if r3.status_code == 200:
    # Check DB again
    user_after = db.users.find_one({'email': email})
    print(f'\n🎉 5. User verified: {user_after.get("is_verified")}')
    
    if user_after.get('is_verified'):
        print(f'\n✅✅✅ SUCCESS! Email verification hoạt động hoàn hảo!')
    else:
        print(f'\n❌ Verify API OK nhưng is_verified vẫn False')
else:
    print(f'\n❌ Verify failed!')
    exit(1)
