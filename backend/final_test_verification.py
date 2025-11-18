"""
Test tạo user mới và kiểm tra is_verified = False
"""
import requests
import json
import time

# Tạo email unique với timestamp
timestamp = int(time.time())
test_email = f'test_{timestamp}@example.com'

print("\n" + "="*60)
print("🧪 TEST: Tạo user mới với is_verified = False")
print("="*60)

# Data cho user mới
data = {
    'userType': 'tourist',
    'email': test_email,
    'password': '123456',
    'confirmPassword': '123456',
    'fullName': 'Test User Verify False',
    'phone': '0999888777'
}

print(f"\n📝 Đang đăng ký user mới...")
print(f"   Email: {data['email']}")
print(f"   Name: {data['fullName']}")

# Gọi API registration
url = 'http://localhost:5000/api/registration/register'
response = requests.post(url, json=data)

print(f"\n📊 Response Status: {response.status_code}")

if response.status_code == 201:
    print("✅ Đăng ký thành công!")
    
    # Đợi 2 giây để data được lưu
    print("\n⏳ Đợi 2 giây...")
    time.sleep(2)
    
    # Kiểm tra trong MongoDB Atlas bằng API
    print("\n🔍 Kiểm tra user trong database...")
    
    # Login để lấy token (skip recaptcha for testing)
    # Dùng trực tiếp response từ registration vì đã có token
    reg_data = response.json()
    token = reg_data.get('token')
    
    if not token:
        print("❌ Không lấy được token từ registration response")
        exit(1)
    
    if token:
        # Get profile
        profile_url = 'http://localhost:5000/api/auth/profile'
        profile_response = requests.get(
            profile_url,
            headers={'Authorization': f'Bearer {token}'}
        )
        
        if profile_response.status_code == 200:
            response_json = profile_response.json()
            user_data = response_json.get('data', {}).get('user', {})
            
            print(f"\n📧 Email: {user_data.get('email')}")
            print(f"👤 Name: {user_data.get('name')}")
            print(f"🔐 is_verified: {user_data.get('is_verified')}")
            print(f"📝 isEmailVerified: {user_data.get('isEmailVerified', 'KHÔNG TỒN TẠI')}")
            print(f"🎭 Role: {user_data.get('role')}")
            
            # Kiểm tra kết quả
            print("\n" + "="*60)
            if user_data.get('is_verified') == False:
                print("✅ PASS: is_verified = False (ĐÚNG!)")
            else:
                print(f"❌ FAIL: is_verified = {user_data.get('is_verified')} (PHẢI LÀ False)")
            
            if 'isEmailVerified' not in user_data or user_data.get('isEmailVerified') is None:
                print("✅ PASS: isEmailVerified không tồn tại (ĐÚNG!)")
            else:
                print(f"❌ FAIL: isEmailVerified = {user_data.get('isEmailVerified')} (KHÔNG NÊN TỒN TẠI)")
            print("="*60)
        else:
            print(f"❌ Lỗi get profile: {profile_response.text}")
else:
    print(f"❌ Đăng ký thất bại!")
    print(f"Response: {response.text}")
