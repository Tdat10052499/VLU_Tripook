# 🚀 Enhanced Registration System - VLU Tripook

## 📋 Tổng quan hệ thống đăng ký mới

### 🎯 Mục tiêu
Tạo hệ thống đăng ký tích hợp cho phép người dùng chọn loại tài khoản ngay từ đầu:
- **Khách du lịch**: Tài khoản thông thường để đặt tour, dịch vụ
- **Nhà cung cấp dịch vụ**: Tài khoản doanh nghiệp để cung cấp tour, dịch vụ

### 🏗️ Kiến trúc hệ thống

#### Phase 2: Enhanced Registration System
```
Registration Flow:
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ UserTypeSelection│ -> │ Enhanced Register│ -> │ Email Verification│
│                 │    │                  │    │                 │
│ 1. Khách du lịch│    │ Dynamic Forms    │    │ Code Verification│
│ 2. Nhà cung cấp │    │ Role-based Fields│    │ Account Activation│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔧 Cấu trúc File mới

### Frontend Components
```
src/
├── components/auth/
│   ├── UserTypeSelection.tsx      # Chọn loại tài khoản
│   ├── EnhancedRegister.tsx      # Form đăng ký tích hợp
│   ├── EmailVerification.tsx     # Xác thực email
│   └── RegistrationWizard.tsx    # Wizard đăng ký từng bước
├── types/
│   └── registration.ts           # Types cho hệ thống đăng ký
└── services/
    └── registrationApi.ts        # API services cho đăng ký
```

### Backend Routes
```
backend/app/routes/
├── registration.py               # Routes đăng ký mới
└── email_verification.py        # Routes xác thực email
```

## 📝 Chi tiết Implementation

### 1. UserTypeSelection Component
**Mục đích**: Màn hình đầu tiên cho phép user chọn loại tài khoản

**Features**:
- Giao diện đẹp với 2 lựa chọn rõ ràng
- Icon và mô tả cho mỗi loại tài khoản
- Animation và hover effects
- Responsive design

### 2. EnhancedRegister Component  
**Mục đích**: Form đăng ký động dựa trên loại user

**Features**:
- **Khách du lịch**: Email, password, tên, số điện thoại
- **Nhà cung cấp**: Thêm tên công ty, loại hình kinh doanh, địa chỉ, giấy phép
- Validation real-time
- Progress indicator
- File upload cho documents (provider)

### 3. EmailVerification System
**Mục đích**: Xác thực email với mã code

**Features**:
- Gửi mã 6 số qua email
- Input OTP với countdown timer
- Resend functionality
- Auto-complete khi nhập đúng mã

## 🔄 User Flow mới

### Khách du lịch:
1. Chọn "Tôi là khách du lịch"
2. Điền form cơ bản (email, password, tên, SĐT)
3. Xác thực email với mã code
4. Đăng nhập thành công -> Dashboard

### Nhà cung cấp dịch vụ:
1. Chọn "Tôi là nhà cung cấp dịch vụ"
2. Điền form mở rộng:
   - Thông tin cá nhân
   - Thông tin doanh nghiệp
   - Upload giấy tờ (optional)
3. Xác thực email với mã code
4. Tài khoản pending -> Chờ admin duyệt
5. Sau khi duyệt -> Provider Dashboard

## 🗄️ Database Schema Updates

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String,
  fullName: String,
  phone: String,
  role: String, // 'user', 'provider', 'admin'
  isEmailVerified: Boolean,
  emailVerificationCode: String,
  emailVerificationExpires: Date,
  accountStatus: String, // 'active', 'pending', 'suspended'
  
  // Provider specific fields
  companyName: String,
  businessType: String,
  businessAddress: String,
  businessLicense: String,
  documents: [String], // Array of file URLs
  
  createdAt: Date,
  updatedAt: Date
}
```

### EmailVerification Collection
```javascript
{
  _id: ObjectId,
  email: String,
  code: String,
  expiresAt: Date,
  attempts: Number,
  isUsed: Boolean,
  createdAt: Date
}
```

## 🔧 API Endpoints mới

### Registration APIs
```
POST /api/auth/register
- Body: { userType, email, password, ...otherFields }
- Response: { success, message, userId, verificationSent }

POST /api/auth/verify-email
- Body: { email, code }
- Response: { success, message, token, user }

POST /api/auth/resend-verification
- Body: { email }
- Response: { success, message }
```

## 🚀 Implementation Plan

### Phase 2.1: Core Components (Hiện tại)
- [x] UserTypeSelection component
- [x] EnhancedRegister component
- [x] Basic email verification
- [x] API integration

### Phase 2.2: Advanced Features
- [ ] File upload system
- [ ] Admin approval workflow
- [ ] Enhanced validation
- [ ] Error handling

### Phase 2.3: UX Improvements
- [ ] Progress indicators
- [ ] Loading states
- [ ] Success animations
- [ ] Mobile optimization

## 🔍 Testing Strategy

### Test Accounts
```
Khách du lịch test:
- email: tourist@test.com
- password: 123456

Nhà cung cấp test:
- email: provider@test.com  
- password: 123456
```

### Test Cases
1. ✅ User type selection
2. ✅ Tourist registration flow
3. ✅ Provider registration flow  
4. ✅ Email verification
5. ✅ Error handling
6. ✅ Mobile responsiveness

## 📚 Resources & Documentation

### Dependencies
- React Router (navigation)
- Tailwind CSS (styling)
- React Hook Form (form handling)
- Axios (API calls)
- React Hot Toast (notifications)

### Environment Variables
```
# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000/api

# Backend (.env)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## 🎯 Next Steps

1. **Phase 2**: Implement enhanced registration system
2. **Phase 3**: Add email verification with codes
3. **Phase 4**: Update navigation and UX
4. **Testing**: Comprehensive testing all flows
5. **Documentation**: API docs and user guides

---

*Tài liệu này sẽ được cập nhật theo tiến độ development.*