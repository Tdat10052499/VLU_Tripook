#!/usr/bin/env python3
"""
Check specific provider in database
"""
from pymongo import MongoClient
from bson import ObjectId

MONGO_URI = "mongodb+srv://dat:Tdat.100524@tripook-cluster.ht8st5x.mongodb.net/tripook"

def check_provider(email):
    try:
        client = MongoClient(MONGO_URI)
        db = client.tripook
        
        provider = db.users.find_one({'email': email})
        
        if provider:
            print(f"\n✅ Found provider: {email}")
            print(f"\n📋 Provider Details:")
            for key, value in provider.items():
                if key != 'password_hash':
                    print(f"  {key}: {value}")
        else:
            print(f"\n❌ Provider not found: {email}")
        
        client.close()
        
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == '__main__':
    check_provider('test.provider.new@example.com')
