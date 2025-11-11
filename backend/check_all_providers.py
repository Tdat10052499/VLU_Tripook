#!/usr/bin/env python3
from pymongo import MongoClient
from werkzeug.security import check_password_hash

c = MongoClient('mongodb+srv://dat:Tdat.100524@tripook-cluster.ht8st5x.mongodb.net/tripook')

# Check all recent providers
providers = list(c.tripook.users.find({'role': 'provider'}).sort('created_at', -1).limit(5))

print(f'\n📋 Found {len(providers)} providers\n')

for p in providers:
    email = p.get('email')
    pwd_hash = p.get('password_hash', '')
    
    print(f'Email: {email}')
    print(f'  Has password_hash: {bool(pwd_hash)}')
    print(f'  Hash length: {len(pwd_hash)}')
    print(f'  Hash starts with: {pwd_hash[:20] if pwd_hash else "NONE"}')
    
    # Try to verify password
    if email in ['final.test.provider@example.com', 'newest.provider@example.com', 'test.provider.new@example.com']:
        try:
            is_valid = check_password_hash(pwd_hash, 'Test@123456')
            print(f'  ✅ Can verify password (Test@123456): {is_valid}')
        except Exception as e:
            print(f'  ❌ Password check error: {e}')
    
    if email == 'final.test.provider@example.com':
        try:
            is_valid = check_password_hash(pwd_hash, 'Test@123')
            print(f'  ✅ Can verify password (Test@123): {is_valid}')
        except Exception as e:
            print(f'  ❌ Password check error: {e}')
    
    print()

c.close()
