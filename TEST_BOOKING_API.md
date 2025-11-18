# Test Booking API

## ✅ **IMPLEMENTATION COMPLETED!**

### **Backend Changes:**
1. ✅ Created `/api/bookings` endpoint (`backend/app/routes/bookings.py`)
2. ✅ Support both **guest** and **authenticated** bookings
3. ✅ Validation: email format, phone format (10 digits starting with 0)
4. ✅ Registered blueprint in `app/__init__.py`

### **Frontend Changes:**
1. ✅ Updated `BookingModal.tsx` logic
2. ✅ **Guest users**: Form inputs (fullName, email, phone) with validation
3. ✅ **Logged-in users**: Read-only display (auto-filled from profile)
4. ✅ Removed icons from button text
5. ✅ Real-time validation with error messages
6. ✅ API integration with `fetch()` call

---

## 📝 **Test Cases:**

### **Test 1: Guest Booking (Not Logged In)**

**Steps:**
1. Open any service detail page (accommodation/tour/transport)
2. Select dates and click "Đặt ngay"
3. BookingModal opens → You should see **3 input fields**:
   - Họ và tên *
   - Email *
   - Số điện thoại *
4. Try to click "Tiếp tục thanh toán" **WITHOUT** filling:
   - Button should show: "Vui lòng điền đầy đủ thông tin"
   - Button is disabled (gray)
5. Fill invalid data:
   - Name: "AB" (< 3 chars) → Error: "Họ và tên phải có ít nhất 3 ký tự"
   - Email: "invalidemail" → Error: "Email không hợp lệ"
   - Phone: "123456789" → Error: "Số điện thoại phải gồm 10 số và bắt đầu bằng 0"
6. Fill valid data:
   - Name: "Nguyễn Văn A"
   - Email: "test@example.com"
   - Phone: "0123456789"
7. Click "Tiếp tục thanh toán"
8. Should go to Step 2 (Payment)
9. Click "Thanh toán ngay"
10. Should show confirmation → Booking created in MongoDB

---

### **Test 2: Logged-In User Booking**

**Steps:**
1. Login first
2. Go to service detail, select dates, click "Đặt ngay"
3. BookingModal opens → You should see **READ-ONLY** display:
   - Shows your name from profile
   - Shows your email
   - Shows your phone (or "Chưa cập nhật")
4. If phone is missing:
   - Warning message: "Vui lòng cập nhật số điện thoại trong hồ sơ cá nhân..."
   - Button disabled
5. If phone exists:
   - Button enabled: "Tiếp tục thanh toán"
6. Click "Tiếp tục thanh toán" → Should go to Payment step
7. Complete payment → Booking created with `user_id`

---

### **Test 3: API Validation**

**Using Postman/curl:**

```bash
# Test Guest Booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "service_id": "YOUR_SERVICE_ID",
    "service_type": "accommodation",
    "check_in": "2025-11-20",
    "check_out": "2025-11-25",
    "guests": 2,
    "special_requests": "Early check-in please",
    "guest_info": {
      "fullName": "Nguyễn Văn A",
      "email": "test@example.com",
      "phone": "0123456789"
    }
  }'

# Expected Response:
{
  "message": "Booking created successfully",
  "booking": {
    "_id": "...",
    "booking_reference": "BK20251113...",
    "status": "pending",
    "payment_status": "pending",
    ...
  }
}
```

---

## 🔍 **Validation Rules:**

### **Full Name:**
- ❌ Empty
- ❌ < 3 characters
- ✅ ≥ 3 characters

### **Email:**
- ❌ Empty
- ❌ Invalid format (missing @, no domain)
- ✅ Valid format: `xxx@xxx.xxx`

### **Phone:**
- ❌ Empty
- ❌ Not exactly 10 digits
- ❌ Doesn't start with 0
- ✅ Valid: `0xxxxxxxxx` (10 digits, starts with 0)

### **Dates:**
- ❌ Empty
- ❌ check_out ≤ check_in
- ❌ check_in in the past
- ✅ Valid date range

### **Guests:**
- ❌ < 1 or > 20
- ✅ 1-20 guests

---

## 📊 **Database Structure:**

```javascript
{
  _id: ObjectId,
  user_id: ObjectId | null,  // null for guest bookings
  guest_info: {
    fullName: "Nguyễn Văn A",
    email: "test@example.com",
    phone: "0123456789"
  },
  service_id: ObjectId,
  service_type: "accommodation|tour|transport",
  service_name: "Hotel ABC",
  booking_reference: "BK20251113123456",
  check_in: ISODate("2025-11-20"),
  check_out: ISODate("2025-11-25"),
  nights: 5,
  guests: 2,
  special_requests: "Early check-in",
  total_amount: 2500000,
  currency: "VND",
  price_breakdown: {
    base_price: 500000,
    nights: 5,
    subtotal: 2500000,
    taxes: 0,
    fees: 0,
    total: 2500000
  },
  status: "pending",
  payment_status: "pending",
  payment_method: null,
  booking_date: ISODate,
  created_at: ISODate,
  updated_at: ISODate
}
```

---

## 🎯 **Key Features:**

1. **Flexible Booking**: Both guest and authenticated users can book
2. **Auto-fill**: Logged-in users see their profile info
3. **Validation**: Real-time + server-side validation
4. **No Icons**: Clean button text without emojis
5. **Error Handling**: Clear error messages for each field
6. **API Integration**: Real booking creation via POST /api/bookings

---

## 🚀 **Next Steps:**

After testing, you can:
1. Add payment gateway integration (VNPay/MOMO)
2. Email confirmation to guest_info.email
3. Booking management dashboard for users
4. Provider booking list view
5. Booking status tracking (pending → confirmed → completed)

---

## ⚠️ **Important Notes:**

- Backend restart: `docker-compose restart` (Already done ✅)
- Frontend auto-reloads on save
- MongoDB: Check `bookings` collection for created bookings
- API URL: `http://localhost:5000/api/bookings`
- CORS enabled for localhost:3000

---

**Implementation Status:** ✅ **100% COMPLETE**
