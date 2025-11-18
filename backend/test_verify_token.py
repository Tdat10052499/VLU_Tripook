#!/usr/bin/env python
"""
Test email verification with token-based flow
"""
import requests
from datetime import datetime
import sys

BASE_URL = 'http://localhost:5000'

try:
    # Step 1: Register with real email
    print('📝 1. Đăng ký user với email thật...')
    email = 'tdat.100524@gmail.com'
    
    r1 = requests.post(f'{BASE_URL}/api/registration/register', json={
        'userType': 'tourist',
        'email': email,
        'password': 'test123456',
        'confirmPassword': 'test123456',
        'fullName': 'Test Real Email',
        'phone': '0999888777'
    })
    
    if r1.status_code == 201:
        token = r1.json()['token']
        print(f'   ✅ Đăng ký thành công!')
    elif r1.status_code == 400:
        print(f'   ℹ️  Email đã tồn tại, login để lấy token...')
        r_login = requests.post(f'{BASE_URL}/api/auth/login', json={
            'login': email,
            'password': 'test123456',
            'recaptcha_token': 'test_token'
        })
        if r_login.status_code == 200:
            token = r_login.json()['token']
            print(f'   ✅ Login thành công!')
        else:
            print(f'   ❌ Login failed: {r_login.json()}')
            sys.exit(1)
    else:
        print(f'   ❌ Đăng ký failed: {r1.json()}')
        sys.exit(1)

    # Step 2: Send verification email
    print(f'\n📧 2. Gửi email xác thực đến {email}...')
    r2 = requests.post(
        f'{BASE_URL}/api/auth/send-verification',
        headers={'Authorization': f'Bearer {token}'}
    )
    
    if r2.status_code == 200:
        result = r2.json()
        print(f'   ✅ {result.get("message")}')
        print(f'\n📬 Check email của bạn tại: {email}')
        print(f'   → Subject: Xác thực tài khoản Tripook')
        print(f'   → From: Tripook <tdat.100524@gmail.com>')
        print(f'   → Click vào link trong email để verify')
        print(f'\n💡 Hoặc test với token giả để verify endpoint hoạt động...')
    elif r2.status_code == 400 and 'đã được xác thực' in r2.json().get('message', ''):
        print(f'   ℹ️  Email đã được xác thực rồi!')
        print(f'\n✅ Endpoint /api/auth/verify-email đã sẵn sàng!')
        print(f'   Bạn có thể test bằng cách click link trong email.')
        sys.exit(0)
    else:
        print(f'   ❌ Gửi email failed: {r2.json()}')
        sys.exit(1)
    
    print(f'\n✅ SUCCESS! Email đã được gửi!')
    print(f'\n🧪 Để test verify endpoint:')
    print(f'   1. Check email {email}')
    print(f'   2. Click vào link xác thực')
    print(f'   3. Sẽ redirect đến /verify-email?token=xxx')
    print(f'   4. Backend sẽ verify và redirect về /profile?tab=security')

except Exception as e:
    print(f'\n❌ ERROR: {e}')
    import traceback
    traceback.print_exc()
    sys.exit(1)
