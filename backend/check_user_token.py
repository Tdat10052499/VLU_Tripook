from pymongo import MongoClient
import os
from datetime import datetime

client = MongoClient(os.getenv('MONGO_URI'))
db = client[os.getenv('MONGO_DATABASE', 'tripook')]

user = db.users.find_one({'email': 'tdat.100524@gmail.com'})

if user:
    print(f'Email: {user.get("email")}')
    print(f'is_verified: {user.get("is_verified")}')
    print(f'verification_token: {user.get("verification_token")}')
    
    # Check expiry field name
    expiry = user.get("verification_token_expiry") or user.get("verification_token_expires")
    print(f'verification_token_expiry: {expiry}')
    
    if expiry:
        # Check if expired
        if isinstance(expiry, (int, float)):
            # Timestamp
            expiry_dt = datetime.fromtimestamp(expiry)
            print(f'Expiry datetime: {expiry_dt}')
            print(f'Is expired: {datetime.now() > expiry_dt}')
        else:
            # Already datetime
            print(f'Expiry datetime: {expiry}')
            print(f'Is expired: {datetime.utcnow() > expiry}')
else:
    print('User not found!')
