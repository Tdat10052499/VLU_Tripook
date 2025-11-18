"""
Test Brevo email sending
"""
import requests
import json
import time

print("\n" + "="*60)
print("🧪 TEST: Brevo Email Verification")
print("="*60)

# Tạo user mới để test
timestamp = int(time.time())
test_email = f'test_brevo_{timestamp}@example.com'

data = {
    'userType': 'tourist',
    'email': test_email,
    'password': '123456',
    'confirmPassword': '123456',
    'fullName': 'Test Brevo User',
    'phone': '0999888777'
}

print(f"\n📝 Step 1: Đăng ký user mới...")
print(f"   Email: {test_email}")

# Register
reg_url = 'http://localhost:5000/api/registration/register'
reg_response = requests.post(reg_url, json=data)

if reg_response.status_code != 201:
    print(f"❌ Đăng ký thất bại: {reg_response.text}")
    exit(1)

print("✅ Đăng ký thành công!")

# Get token
token = reg_response.json().get('token')

# Wait a bit
time.sleep(2)

# Send verification email
print(f"\n📧 Step 2: Gửi email xác thực qua Brevo...")

send_url = 'http://localhost:5000/api/auth/send-verification'
headers = {'Authorization': f'Bearer {token}'}

send_response = requests.post(send_url, headers=headers)

print(f"\n📊 Response Status: {send_response.status_code}")
print(f"📄 Response: {json.dumps(send_response.json(), indent=2, ensure_ascii=False)}")

if send_response.status_code == 200:
    print("\n" + "="*60)
    print("✅ SUCCESS! Email đã được gửi qua Brevo!")
    print("="*60)
    print("\n📬 Hãy check email của bạn:")
    print(f"   → Inbox: tdat.100524@gmail.com")
    print(f"   → Subject: Xác thực tài khoản Tripook")
    print(f"   → From: Tripook <tdat.100524@gmail.com>")
    print("\n💡 Tips:")
    print("   - Check cả Spam folder nếu không thấy")
    print("   - Brevo dashboard: https://app.brevo.com/logs")
    print("   - Xem Message ID trong backend logs")
else:
    print("\n❌ FAILED! Lỗi gửi email:")
    print(f"   {send_response.text}")
    print("\n🔍 Check backend logs:")
    print("   docker logs tripook-backend --tail 50")
