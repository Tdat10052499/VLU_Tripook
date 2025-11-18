import requests
from pymongo import MongoClient
import os

BASE_URL = 'http://localhost:5000'

# Login
r = requests.post(f'{BASE_URL}/api/auth/simple-login', json={
    'login': 'tdat.100524@gmail.com',
    'password': 'dat'
})

if r.status_code == 200:
    token = r.json()['token']
    print('✅ Login OK')
    
    # Send verification
    r2 = requests.post(
        f'{BASE_URL}/api/auth/send-verification',
        headers={'Authorization': f'Bearer {token}'}
    )
    
    print(f'📧 Send email: {r2.status_code}')
    print(f'   Response: {r2.json()}')
    
    # Check DB
    client = MongoClient(os.getenv('MONGO_URI'))
    db = client[os.getenv('MONGO_DATABASE', 'tripook')]
    user = db.users.find_one({'email': 'tdat.100524@gmail.com'})
    
    vtoken = user.get('verification_token')
    if vtoken:
        print(f'\n🔑 Token in DB: {vtoken[:40]}...')
        print(f'⏰ Expires: {user.get("verification_token_expires")}')
        print(f'\n📬 Check email và click link!')
    else:
        print('\n❌ Token not saved!')
else:
    print(f'❌ Login failed: {r.status_code}')
    print(f'   {r.json()}')
