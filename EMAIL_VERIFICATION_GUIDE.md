# Email Verification System - Setup Guide

## 📧 Hướng Dẫn Cấu Hình SMTP Gmail

### 1. Tạo App Password cho Gmail

**Bước 1: Kích hoạt 2-Step Verification**
1. Truy cập [Google Account Security](https://myaccount.google.com/security)
2. Tìm mục **"2-Step Verification"**
3. Click **"Get started"** và làm theo hướng dẫn
4. Xác thực bằng số điện thoại hoặc app

**Bước 2: Tạo App Password**
1. Sau khi bật 2FA, truy cập [App Passwords](https://myaccount.google.com/apppasswords)
2. Trong dropdown "Select app", chọn **"Mail"**
3. Trong dropdown "Select device", chọn **"Other"** và nhập "Tripook"
4. Click **"Generate"**
5. Copy password 16 ký tự (dạng: `xxxx xxxx xxxx xxxx`)

---

### 2. Cấu Hình Backend

**File: `backend/.env`**

Tạo file `.env` trong thư mục `backend/` (nếu chưa có):

```bash
# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # App Password từ bước 1
FROM_EMAIL=noreply@tripook.com     # Hiển thị tên gửi
FRONTEND_URL=http://localhost      # URL frontend cho link xác thực
```

**Thay thế:**
- `your-email@gmail.com`: Email Gmail của bạn
- `xxxx xxxx xxxx xxxx`: App Password vừa tạo (bỏ spaces hoặc giữ nguyên đều được)
- `FROM_EMAIL`: Email hiển thị khi gửi (có thể để giống SMTP_USERNAME)

---

### 3. Test Gửi Email

#### 3.1. Test trong Backend Container

```powershell
# Chạy script test
docker exec -it tripook-backend python -c "
from app.services.email_service import email_service
result = email_service.send_verification_email(
    'your-test-email@gmail.com',
    'test-token-123',
    'Test User'
)
print('✅ Email sent!' if result else '❌ Failed to send')
"
```

#### 3.2. Kiểm Tra Email

Sau khi chạy command trên:
1. Kiểm tra hộp thư inbox của `your-test-email@gmail.com`
2. Nếu không thấy, check **Spam/Junk** folder
3. Email subject: **"Xác thực tài khoản Tripook - Verify your Tripook account"**

---

### 4. Troubleshooting

#### 🔴 Lỗi: "Username and Password not accepted"
**Nguyên nhân:** App Password sai hoặc 2FA chưa bật

**Giải pháp:**
1. Kiểm tra lại App Password (không có spaces nếu copy vào .env)
2. Đảm bảo 2-Step Verification đã được bật
3. Tạo lại App Password mới

#### 🔴 Lỗi: "SMTPAuthenticationError"
**Nguyên nhân:** Gmail chặn ứng dụng kém an toàn

**Giải pháp:**
1. Sử dụng App Password (KHÔNG dùng mật khẩu Gmail thật)
2. Kiểm tra [Less secure app access](https://myaccount.google.com/lesssecureapps) - NÊN TẮT và dùng App Password thay thế

#### 🔴 Lỗi: "Connection timeout"
**Nguyên nhân:** Port 587 bị chặn bởi firewall

**Giải pháp:**
1. Thử port 465 (SSL) thay vì 587 (TLS):
   ```
   SMTP_PORT=465
   ```
2. Hoặc sử dụng port 25 (ít khuyến khích)

#### 🔴 Email đi vào Spam
**Nguyên nhân:** Gmail không tin tưởng sender

**Giải pháp:**
1. Thêm email vào whitelist trong Gmail
2. Đặt `FROM_EMAIL` giống `SMTP_USERNAME`
3. Trong production, cần cấu hình SPF/DKIM/DMARC

---

### 5. Alternative: Sử Dụng SendGrid (Khuyến nghị Production)

#### 5.1. Đăng ký SendGrid
1. Truy cập [SendGrid](https://sendgrid.com/)
2. Tạo tài khoản miễn phí (100 emails/day)
3. Verify email sender
4. Tạo API Key

#### 5.2. Cấu Hình
```bash
# Thay vì Gmail SMTP
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@tripook.com
```

#### 5.3. Update Code (Optional)
File: `backend/app/services/email_service.py`

Thêm SendGrid integration (nếu cần).

---

## 🧪 Testing Email Verification Flow

### Test Case 1: Normal User Registration
```powershell
# 1. Đăng ký user bình thường
curl -X POST http://localhost:5000/api/registration/register ^
-H "Content-Type: application/json" ^
-d "{\"email\":\"test@example.com\",\"password\":\"123456\",\"fullName\":\"Test User\",\"userType\":\"user\"}"

# 2. Login -> user.is_verified = False (user thường không bắt buộc verify)
# 3. Vào Profile -> Tab Security -> Click "Gửi email xác thực"
# 4. Check email và click link
```

### Test Case 2: Provider Registration
```powershell
# 1. Đăng ký provider
curl -X POST http://localhost:5000/api/registration/register ^
-H "Content-Type: application/json" ^
-d "{\"email\":\"provider@example.com\",\"password\":\"123456\",\"fullName\":\"Provider\",\"userType\":\"provider\",\"companyName\":\"Test Company\",\"businessType\":\"tour\",\"businessAddress\":\"123 Street\"}"

# 2. Email xác thực tự động được gửi
# 3. Check email và verify
```

### Test Case 3: Resend Email (Rate Limiting)
```powershell
# 1. Click "Gửi email xác thực" 3 lần liên tục
# 2. Lần thứ 4 sẽ bị block với message: "Bạn đã gửi quá nhiều yêu cầu"
# 3. Phải đợi 1 giờ hoặc 60s giữa mỗi lần gửi
```

---

## 📋 Database Schema

### User Document với Email Verification
```json
{
  "_id": ObjectId("..."),
  "email": "user@example.com",
  "is_verified": false,
  "verification_token": "abc123...",
  "verification_token_expires": 1700000000.0,
  "verification_sent_count": 2,
  "last_verification_sent": 1699999000.0,
  "role": "provider",
  "created_at": "2025-11-17T10:00:00Z"
}
```

---

## 🔐 Security Best Practices

1. **KHÔNG commit .env file** - Thêm vào .gitignore
2. **Sử dụng App Password** - KHÔNG dùng mật khẩu Gmail thật
3. **Rate Limiting** - 3 emails/hour, 60s cooldown
4. **Token Expiry** - 24 giờ cho verification link
5. **HTTPS Only** - Trong production, bắt buộc HTTPS
6. **Email Validation** - Validate email format trước khi gửi

---

## 📊 Monitoring & Logs

### Backend Logs
```powershell
# Xem logs email service
docker logs tripook-backend | grep "Verification email"

# Expected output:
# ✅ Verification email sent to: user@example.com
# ⚠️ SMTP credentials not configured. Email not sent.
```

### Database Queries
```javascript
// Check verification status
db.users.find({ is_verified: false }).count()

// Check users with pending verification
db.users.find({
  is_verified: false,
  verification_token: { $ne: null }
})

// Check rate limiting
db.users.find({
  verification_sent_count: { $gte: 3 },
  last_verification_sent: { $gte: Date.now() / 1000 - 3600 }
})
```

---

## ✅ Verification Complete Checklist

- [ ] SMTP credentials configured in .env
- [ ] Test email sent successfully
- [ ] Frontend banner shows for unverified users
- [ ] Verify email page working
- [ ] Rate limiting tested (3 emails/hour)
- [ ] Countdown timer working (60 seconds)
- [ ] Provider auto-send email on registration
- [ ] Token expiry tested (24 hours)
- [ ] Email template renders correctly
- [ ] Security tab UI complete

---

## 🎉 Kết Quả Mong Đợi

### 1. User Flow
```
User đăng ký → Không bắt buộc verify ngay
              ↓
User login → Thấy banner warning ở top
            ↓
Click "Xác thực ngay" → Profile → Security Tab
                        ↓
Click "Gửi email xác thực" → Check inbox
                              ↓
Click link trong email → Redirect to /verify-email
                         ↓
                    ✅ Verified! → Login
```

### 2. Provider Flow
```
Provider đăng ký → Email tự động gửi ngay
                  ↓
Check inbox → Click link xác thực
             ↓
        ✅ Verified! → Chờ admin approve
```

---

## 📞 Support

Nếu gặp vấn đề:
1. Check logs: `docker logs tripook-backend`
2. Verify .env configuration
3. Test SMTP connection: `telnet smtp.gmail.com 587`
4. Check Gmail security settings
5. Liên hệ: support@tripook.com

---

**Last Updated:** 2025-11-17  
**Version:** 1.0.0
