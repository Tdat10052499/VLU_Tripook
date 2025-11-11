#!/usr/bin/env python3
"""
Test provider registration flow
"""
import requests
import json

def test_provider_registration():
    """Test creating a new provider and verify it appears in pending list"""
    
    # Registration data
    provider_data = {
        "userType": "provider",
        "email": "test.provider.new@example.com",
        "password": "Test@123456",
        "confirmPassword": "Test@123456",
        "fullName": "Test Provider New",
        "phone": "0987654321",
        "companyName": "Test Travel Agency",
        "businessType": "tour_operator",
        "businessAddress": "123 Test Street, Ho Chi Minh City",
        "businessLicense": "LICENSE123",
        "businessDescription": "We provide amazing tours",
        "taxId": "TAX123",
        "website": "https://test-travel.com"
    }
    
    print("=" * 80)
    print("🧪 Testing Provider Registration Flow")
    print("=" * 80)
    
    # Step 1: Register new provider
    print("\n📝 Step 1: Registering new provider...")
    print(f"Email: {provider_data['email']}")
    print(f"Company: {provider_data['companyName']}")
    
    try:
        response = requests.post(
            'http://localhost:5000/api/registration/register',
            json=provider_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2, ensure_ascii=False)}")
        
        if response.status_code == 201 and result.get('success'):
            print("✅ Registration successful!")
            user = result.get('user', {})
            print(f"\n👤 Created User:")
            print(f"   ID: {user.get('id')}")
            print(f"   Email: {user.get('email')}")
            print(f"   Role: {user.get('role')}")
            print(f"   Account Status: {user.get('accountStatus')}")
            
            # Step 2: Verify provider appears in pending list
            print("\n\n📋 Step 2: Checking if provider appears in pending list...")
            
            # We need admin token - get from database
            from pymongo import MongoClient
            from app.utils.jwt_auth import generate_token
            
            client = MongoClient('mongodb+srv://dat:Tdat.100524@tripook-cluster.ht8st5x.mongodb.net/tripook')
            db = client.tripook
            admin = db.users.find_one({'role': 'admin'})
            
            if admin:
                import sys
                sys.path.insert(0, 'c:/Users/tdat1/VLU_Tripook-1/backend')
                token = generate_token(admin['_id'], False)
                
                headers = {'Authorization': f'Bearer {token}'}
                pending_response = requests.get(
                    'http://localhost:5000/api/admin/pending-providers',
                    headers=headers
                )
                
                print(f"Status: {pending_response.status_code}")
                pending_result = pending_response.json()
                
                if pending_result.get('success'):
                    providers = pending_result.get('providers', [])
                    print(f"✅ Found {len(providers)} pending providers")
                    
                    # Check if our new provider is in the list
                    new_provider = next((p for p in providers if p['email'] == provider_data['email']), None)
                    
                    if new_provider:
                        print(f"\n✅ NEW PROVIDER FOUND IN PENDING LIST!")
                        print(f"   Name: {new_provider['fullName']}")
                        print(f"   Company: {new_provider['companyName']}")
                        print(f"   Status: {new_provider['accountStatus']}")
                        print(f"   Created: {new_provider['createdAt']}")
                    else:
                        print(f"\n❌ NEW PROVIDER NOT FOUND in pending list!")
                        print(f"\nAll pending providers:")
                        for p in providers:
                            print(f"   - {p['fullName']} ({p['email']})")
                else:
                    print(f"❌ Failed to get pending providers: {pending_result}")
            
            client.close()
            
        else:
            print(f"❌ Registration failed: {result.get('message')}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "=" * 80)

if __name__ == '__main__':
    test_provider_registration()
