#!/usr/bin/env python3
from pymongo import MongoClient
from werkzeug.security import check_password_hash

c = MongoClient('mongodb+srv://dat:Tdat.100524@tripook-cluster.ht8st5x.mongodb.net/tripook')
p = c.tripook.users.find_one({'email': 'final.test.provider@example.com'})

print('\n✅ Provider found!')
print(f'\nEmail: {p.get("email")}')
print(f'Password hash: {p.get("password_hash")[:50] if p.get("password_hash") else "NONE"}...')
print(f'Hash length: {len(p.get("password_hash", ""))}')

# Test password verification
test_password = 'Test@123'
try:
    is_valid = check_password_hash(p.get('password_hash'), test_password)
    print(f'\n✅ Password check works: {is_valid}')
except Exception as e:
    print(f'\n❌ Password check error: {e}')

c.close()
