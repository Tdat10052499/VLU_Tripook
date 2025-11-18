import requests
from pymongo import MongoClient
import os
import time

BASE_URL = 'http://localhost:5000'

# Register new user
email = f'quicktest_{int(time.time())}@example.com'
print(f'📝 Register: {email}')
r_reg = requests.post(f'{BASE_URL}/api/registration/register', json={
    'userType': 'tourist',
    'email': email,
    'password': '123456',
    'confirmPassword': '123456',
    'fullName': 'Quick Test',
    'phone': '0999888777'
})

if r_reg.status_code != 201:
    print(f'❌ Register failed: {r_reg.json()}')
    exit(1)

print('✅ Register OK')
token = r_reg.json()['token']

# Send verification
print(f'\n📧 Sending verification email...')
r2 = requests.post(
    f'{BASE_URL}/api/auth/send-verification',
    headers={'Authorization': f'Bearer {token}'}
)

print(f'Status: {r2.status_code}')
print(f'Response: {r2.json()}')

if r2.status_code != 200:
    print(f'❌ Send failed!')
    exit(1)

# Check DB (use Atlas URI directly like Flask app does)
print(f'\n🔍 Checking database...')
ATLAS_URI = 'mongodb+srv://dat:Tdat.100524@tripook-cluster.ht8st5x.mongodb.net/?appName=Tripook-Cluster'
client = MongoClient(ATLAS_URI)
db = client['tripook']
user = db.users.find_one({'email': email})

if not user:
    print(f'❌ User not found in DB!')
    exit(1)

vtoken = user.get('verification_token')
if not vtoken:
    print(f'❌ Token NOT in DB!')
    print(f'User fields: {list(user.keys())}')
    exit(1)

print(f'✅ Token in DB: {vtoken[:40]}...')
print(f'✅ Expires: {user.get("verification_token_expires")}')

# Verify
print(f'\n🔓 Verifying...')
r3 = requests.get(f'{BASE_URL}/api/auth/verify-email?token={vtoken}')
print(f'Status: {r3.status_code}')
print(f'Response: {r3.json()}')

if r3.status_code == 200:
    print(f'\n🎉 SUCCESS!')
else:
    print(f'\n❌ FAILED!')
