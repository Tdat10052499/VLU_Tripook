# Profile Update Feature - Testing Guide

**Status**: ✅ Ready for Testing  
**Date**: 2024-01-13

---

## Prerequisites

1. ✅ All containers running:
   - tripook-backend (port 5000)
   - tripook-frontend (port 80)
   - tripook-mongodb (port 27017)

2. ✅ User account created and logged in

---

## Test Case 1: View Profile

**Steps**:
1. Open browser: http://localhost
2. Login with test account
3. Click user dropdown in header (top right)
4. Click "Hồ sơ" (Profile)
5. Verify profile page loads

**Expected Results**:
- ✅ Profile page displays
- ✅ User name shown in sidebar
- ✅ Avatar shows initial letter (if no avatar uploaded)
- ✅ Username, email, phone, address, bio displayed
- ✅ Email and username are read-only (gray background)

---

## Test Case 2: Update Profile Information

**Steps**:
1. Navigate to Profile page
2. Click "Chỉnh sửa" (Edit) button
3. Change name: Enter new name
4. Change phone: Enter new phone (10 digits, starts with 0)
5. Change address: Enter new address
6. Change bio: Enter new bio text
7. Click "Lưu" (Save) button

**Expected Results**:
- ✅ Alert: "Cập nhật thông tin thành công!"
- ✅ Fields become read-only again
- ✅ New data displayed in UI
- ✅ Header shows updated name

**Verify in MongoDB**:
```javascript
db.users.findOne({ email: "test@example.com" })
// Should show: name, phone, address, bio updated
// Should show: updated_at timestamp
```

---

## Test Case 3: Cancel Edit

**Steps**:
1. Navigate to Profile page
2. Click "Chỉnh sửa" (Edit) button
3. Change name to something else
4. Click "Hủy" (Cancel) button

**Expected Results**:
- ✅ Fields revert to original values
- ✅ No API call made (check Network tab)
- ✅ Edit mode disabled

---

## Test Case 4: Upload Avatar - Valid Image

**Steps**:
1. Navigate to Profile page
2. Click camera button (on avatar)
3. Select image file:
   - Type: PNG/JPG/JPEG/GIF/WEBP
   - Size: < 5MB
4. Wait for upload

**Expected Results**:
- ✅ Alert: "Cập nhật ảnh đại diện thành công!"
- ✅ Avatar displays uploaded image immediately
- ✅ Image is circular with border
- ✅ No page reload needed

**Verify in MongoDB**:
```javascript
db.users.findOne({ email: "test@example.com" })
// Should show:
// - avatar: "data:image/png;base64,iVBORw0KGgo..."
// - avatar_updated_at: ISODate("2024-01-13T...")
```

---

## Test Case 5: Upload Avatar - Invalid File Type

**Steps**:
1. Navigate to Profile page
2. Click camera button
3. Select non-image file (e.g., .txt, .pdf, .zip)

**Expected Results**:
- ✅ Alert: "Chỉ chấp nhận file ảnh (PNG, JPG, JPEG, GIF, WEBP)"
- ✅ No upload occurs
- ✅ Avatar unchanged

---

## Test Case 6: Upload Avatar - Large File

**Steps**:
1. Navigate to Profile page
2. Click camera button
3. Select image file > 5MB

**Expected Results**:
- ✅ Alert: "Kích thước ảnh không được vượt quá 5MB"
- ✅ No upload occurs
- ✅ Avatar unchanged

---

## Test Case 7: Update Without Token

**Steps**:
1. Open Profile page
2. Open DevTools → Application → Local Storage
3. Delete 'token' item
4. Click "Chỉnh sửa" then "Lưu"

**Expected Results**:
- ✅ Alert: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
- ✅ Redirected to /login page

---

## Test Case 8: Update Read-Only Fields

**Steps**:
1. Open Profile page
2. Try to click on username or email fields

**Expected Results**:
- ✅ Fields are not editable (gray background)
- ✅ No cursor change on hover
- ✅ Username and email remain unchanged

---

## API Testing (Postman/curl)

### Test GET /api/profile

**Request**:
```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "0123456789",
    "address": "123 Main St",
    "bio": "Travel lover",
    "role": "user",
    "is_verified": true
  },
  "message": "User profile retrieved successfully"
}
```

### Test PUT /api/profile

**Request**:
```bash
curl -X PUT http://localhost:5000/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "John Updated",
    "phone": "0987654321",
    "address": "New Address",
    "bio": "Updated bio"
  }'
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Updated",
    "phone": "0987654321",
    "address": "New Address",
    "bio": "Updated bio",
    "updated_at": "2024-01-13T10:30:00Z"
  },
  "message": "Profile updated successfully"
}
```

### Test POST /api/profile/avatar

**Request**:
```bash
curl -X POST http://localhost:5000/api/profile/avatar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }'
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "avatar": "data:image/png;base64,iVBORw0KGgo...",
  "message": "Avatar uploaded successfully"
}
```

### Test DELETE /api/profile/avatar

**Request**:
```bash
curl -X DELETE http://localhost:5000/api/profile/avatar \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Avatar deleted successfully"
}
```

---

## Error Testing

### Test 401 - No Token

**Request**:
```bash
curl -X GET http://localhost:5000/api/profile
```

**Expected Response** (401):
```json
{
  "success": false,
  "message": "Token is missing"
}
```

### Test 400 - Invalid Avatar Format

**Request**:
```bash
curl -X POST http://localhost:5000/api/profile/avatar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "avatar": "not-a-valid-data-uri"
  }'
```

**Expected Response** (400):
```json
{
  "success": false,
  "message": "Invalid image format. Must be data URI"
}
```

### Test 400 - Avatar Too Large

**Request**:
```bash
# Create a Base64 string > 6.7MB (encoded)
curl -X POST http://localhost:5000/api/profile/avatar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "avatar": "data:image/png;base64,[VERY_LONG_STRING_HERE]"
  }'
```

**Expected Response** (400):
```json
{
  "success": false,
  "message": "Image too large. Maximum size is 5MB"
}
```

---

## Browser DevTools Testing

### Network Tab

**Profile Update**:
1. Open DevTools → Network tab
2. Click "Chỉnh sửa" → change data → "Lưu"
3. Look for: PUT request to http://localhost:5000/api/profile

**Check**:
- ✅ Method: PUT
- ✅ Status: 200
- ✅ Headers: Authorization: Bearer ...
- ✅ Request Body: { name, phone, address, ... }
- ✅ Response: { success: true, user: {...} }

**Avatar Upload**:
1. Open DevTools → Network tab
2. Click camera button → select image
3. Look for: POST request to http://localhost:5000/api/profile/avatar

**Check**:
- ✅ Method: POST
- ✅ Status: 200
- ✅ Headers: Authorization: Bearer ...
- ✅ Request Body: { avatar: "data:image/png;base64,..." }
- ✅ Response: { success: true, avatar: "..." }

### Console Tab

**Check for Errors**:
- ✅ No CORS errors
- ✅ No 401 errors
- ✅ No TypeScript errors
- ✅ No network errors

**Expected Logs**:
```
Saving profile: {name: "...", phone: "...", ...}
```

---

## MongoDB Verification

### Before Profile Update

```javascript
use Tripook-Cluster
db.users.findOne({ email: "test@example.com" })
```

**Note**: name, phone, address, bio values

### After Profile Update

```javascript
db.users.findOne({ email: "test@example.com" })
```

**Verify**:
- ✅ name changed
- ✅ phone changed
- ✅ address changed
- ✅ bio changed
- ✅ updated_at timestamp present
- ✅ password still hashed (not exposed)
- ✅ username and email unchanged

### After Avatar Upload

```javascript
db.users.findOne({ email: "test@example.com" })
```

**Verify**:
- ✅ avatar field exists
- ✅ avatar starts with "data:image/"
- ✅ avatar contains "base64,"
- ✅ avatar_updated_at timestamp present

---

## Performance Testing

### Avatar Upload Speed

**Test with different file sizes**:
- 100 KB → Should complete in < 1 second
- 500 KB → Should complete in < 2 seconds
- 1 MB → Should complete in < 3 seconds
- 5 MB → Should complete in < 10 seconds

**Note**: Times depend on network and server speed

---

## Security Testing

### Test SQL Injection (N/A for MongoDB)

MongoDB doesn't use SQL, but test for injection:

**Request**:
```bash
curl -X PUT http://localhost:5000/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Robert\"; DROP TABLE users;--"
  }'
```

**Expected**:
- ✅ Name stored as literal string (no SQL injection)
- ✅ No errors in backend

### Test XSS

**Request**:
```bash
curl -X PUT http://localhost:5000/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "bio": "<script>alert(\"XSS\")</script>"
  }'
```

**Expected**:
- ✅ Bio stored as plain text
- ✅ Frontend displays escaped HTML (no script execution)

---

## Known Issues

1. **Frontend shows "unhealthy"**: Normal during startup, wait 30-60 seconds
2. **CORS errors**: Ensure backend is running on port 5000
3. **Token expired**: Login again to get new token

---

## Troubleshooting

### Issue: "Token is missing" error

**Solution**:
1. Check localStorage has 'token' key
2. Login again if token expired
3. Verify Authorization header format: `Bearer <token>`

### Issue: Avatar not displaying

**Solution**:
1. Check Network tab for POST response
2. Verify avatar field in MongoDB
3. Refresh page to reload user data
4. Check console for image loading errors

### Issue: "Có lỗi xảy ra" alert

**Solution**:
1. Check browser console for errors
2. Check backend logs: `docker logs tripook-backend`
3. Verify MongoDB connection
4. Check CORS settings

---

## Test Results Template

```
✅ Test Case 1: View Profile - PASSED
✅ Test Case 2: Update Profile - PASSED
✅ Test Case 3: Cancel Edit - PASSED
✅ Test Case 4: Upload Avatar (Valid) - PASSED
✅ Test Case 5: Upload Avatar (Invalid Type) - PASSED
✅ Test Case 6: Upload Avatar (Large File) - PASSED
✅ Test Case 7: Update Without Token - PASSED
✅ Test Case 8: Read-Only Fields - PASSED

Notes:
- All features working as expected
- No errors in console
- MongoDB updates correctly
- Performance acceptable
```

---

**Ready to test!** 🚀

Follow the test cases above to verify all functionality works correctly.
