#!/usr/bin/env python3
"""
Check pending providers in database
"""
from pymongo import MongoClient

MONGO_URI = "mongodb+srv://dat:Tdat.100524@tripook-cluster.ht8st5x.mongodb.net/tripook"

def check_pending_providers():
    try:
        client = MongoClient(MONGO_URI)
        db = client.tripook
        
        # Find pending providers
        pending = list(db.users.find(
            {'role': 'provider', 'accountStatus': 'pending'},
            {'email': 1, 'fullName': 1, 'companyName': 1, 'accountStatus': 1}
        ))
        
        print(f"\n📋 Pending providers: {len(pending)}")
        
        if pending:
            for p in pending:
                print(f"\n  👤 {p.get('fullName', 'N/A')}")
                print(f"     Email: {p.get('email', 'N/A')}")
                print(f"     Company: {p.get('companyName', 'N/A')}")
                print(f"     Status: {p.get('accountStatus', 'N/A')}")
                print(f"     ID: {p['_id']}")
        else:
            print("\n⚠️  No pending providers found!")
            print("\nShowing all providers:")
            all_providers = list(db.users.find(
                {'role': 'provider'},
                {'email': 1, 'fullName': 1, 'accountStatus': 1}
            ))
            for p in all_providers:
                print(f"  - {p.get('fullName', 'N/A')} ({p.get('email')}) - Status: {p.get('accountStatus', 'N/A')}")
        
        client.close()
        
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == '__main__':
    check_pending_providers()
