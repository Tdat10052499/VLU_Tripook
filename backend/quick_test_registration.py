#!/usr/bin/env python3
"""
Quick test provider registration
"""
import requests
import json

provider_data = {
    "userType": "provider",
    "email": "newest.provider@example.com",
    "password": "Test@123456",
    "confirmPassword": "Test@123456",
    "fullName": "Newest Provider Test",
    "phone": "0901234567",
    "companyName": "Brand New Travel Co",
    "businessType": "hotel",
    "businessAddress": "456 New Street, Hanoi",
    "businessLicense": "NEW-LICENSE-2025",
    "businessDescription": "Premium hotel services"
}

print("📝 Registering provider:", provider_data['email'])

response = requests.post(
    'http://localhost:5000/api/registration/register',
    json=provider_data
)

print(f"Status: {response.status_code}")
print(json.dumps(response.json(), indent=2, ensure_ascii=False))
