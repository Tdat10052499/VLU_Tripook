# 🔧 FIX: Auto-redirect to /admin/dashboard Issue

## 🐛 Vấn đề
Frontend tự động redirect đến `/admin/dashboard` ngay khi mở `http://localhost`, ngay cả khi chưa đăng nhập.

## 🔍 Nguyên nhân
1. **Home.tsx** có useEffect tự động redirect users dựa trên role
2. Nếu có **admin token còn hiệu lực** trong cookie (từ lần login trước), AuthContext sẽ:
   - Tự động call `checkAuth()` khi mount
   - Set `isAuthenticated = true` và `user.role = 'admin'`
   - Home component thấy admin đã login → Redirect ngay

## ✅ Đã sửa

### 1. Home.tsx - Removed Auto-redirect
**Trước đây:**
```tsx
useEffect(() => {
  if (isAuthenticated && user) {
    if (user.role === 'provider') {
      navigate('/provider/dashboard', { replace: true });
    } else if (user.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }
}, [isAuthenticated, user, navigate]);
```

**Bây giờ:**
```tsx
// Don't auto-redirect on home page
// Users should be able to visit home page even when logged in
// Redirect logic is handled in Login component after successful login
```

**Lý do:**
- Home page nên accessible cho tất cả users (logged in hay không)
- Redirect chỉ nên xảy ra **sau khi login thành công**, không phải khi visit home page

### 2. Login.tsx - Fixed Admin Redirect
**Trước đây:**
```tsx
if (loggedInUser.role === 'admin') {
  window.location.href = '/admin/provider-approval';
}
```

**Bây giờ:**
```tsx
if (loggedInUser.role === 'admin') {
  window.location.href = '/admin';  // Redirect to admin dashboard
}
```

## 🧪 Testing Steps

### 1. Clear Cookies (Quan trọng!)
Trước khi test, **BẮT BUỘC** xóa cookies cũ:

**Chrome/Edge:**
1. Press `F12` để mở DevTools
2. Tab **Application**
3. Sidebar → **Cookies** → `http://localhost`
4. Right-click → **Clear** hoặc delete `auth_token`
5. Refresh page (`F5`)

**Manual Cookie Check:**
```javascript
// Run in browser console
document.cookie
// Should not contain auth_token
```

### 2. Test Home Page (Unauthenticated)
1. Open: `http://localhost`
2. **Expected**: Home page hiển thị bình thường
3. **Expected**: KHÔNG redirect đến admin dashboard
4. **Expected**: Header có buttons "Login" và "Register"

### 3. Test Admin Login Flow
1. Click "Login" button
2. Login với admin account:
   - Email: `admin@tripook.com`
   - Password: `Admin@123456`
3. Complete reCAPTCHA
4. Click "Sign In"
5. **Expected**: Redirect đến `/admin` (Admin Dashboard)
6. **Expected**: Thấy sidebar với navigation menu

### 4. Test Logout và Revisit Home
1. Trong Admin Dashboard, click "Logout"
2. **Expected**: Redirect về home page hoặc login page
3. Manually visit: `http://localhost`
4. **Expected**: Home page hiển thị bình thường
5. **Expected**: KHÔNG auto-redirect

### 5. Test Regular User
1. Logout admin (nếu đang login)
2. Login với regular user account
3. **Expected**: Redirect đến `/dashboard` (User dashboard)
4. Visit home page: `http://localhost`
5. **Expected**: Home page accessible, có thể browse services

### 6. Test Provider
1. Logout current user
2. Login với provider account
3. **Expected**: 
   - If approved: Redirect đến `/provider/dashboard`
   - If pending: Redirect đến `/provider/pending`

## 🎯 Expected Behavior Summary

| User State | Visit http://localhost | After Login |
|-----------|----------------------|-------------|
| **Not logged in** | ✅ Show home page | Redirect by role |
| **Admin logged in** | ✅ Show home page | Already logged in |
| **Provider logged in** | ✅ Show home page | Already logged in |
| **User logged in** | ✅ Show home page | Already logged in |

## 🔐 Cookie Management

### Auth Token Lifecycle
1. **Login**: Token saved in cookie (1 day or 30 days)
2. **Page Load**: AuthContext calls `checkAuth()` to verify token
3. **Valid Token**: Set `isAuthenticated = true`, fetch user data
4. **Invalid Token**: Remove cookie, set `isAuthenticated = false`
5. **Logout**: Remove cookie, clear user state

### Why Auto-redirect Happened
```
1. User logged in as admin before
2. Token still valid in cookie
3. Visit http://localhost
4. AuthContext.checkAuth() runs
5. Token valid → isAuthenticated = true, user.role = 'admin'
6. Home.tsx useEffect sees admin logged in
7. Auto-redirect to /admin/dashboard ❌
```

### After Fix
```
1. User logged in as admin before
2. Token still valid in cookie
3. Visit http://localhost
4. AuthContext.checkAuth() runs
5. Token valid → isAuthenticated = true, user.role = 'admin'
6. Home.tsx NO auto-redirect ✅
7. User sees home page normally
8. Can navigate to /admin manually or via menu
```

## 🚨 Common Issues

### Issue 1: Still redirecting after fix
**Cause**: Old cookies still present
**Solution**: 
```bash
# Clear browser cache and cookies
Ctrl + Shift + Delete → Clear browsing data
# Or use Incognito mode
Ctrl + Shift + N
```

### Issue 2: Can't access admin dashboard
**Cause**: Logout removed auth token
**Solution**: Login again with admin credentials

### Issue 3: 404 on /admin route
**Cause**: Frontend routes not updated
**Solution**: Check App.tsx has admin routes configured

## 📝 Related Files Changed

1. ✅ `frontend/src/components/Home.tsx` - Removed auto-redirect logic
2. ✅ `frontend/src/components/auth/Login.tsx` - Fixed admin redirect path
3. ✅ Frontend container restarted

## 🎉 Result

Bây giờ bạn có thể:
- ✅ Visit home page bình thường (không auto-redirect)
- ✅ Browse services khi chưa login
- ✅ Login và được redirect đúng theo role
- ✅ Logout và quay lại home page
- ✅ Manually navigate đến `/admin` nếu là admin

---

**Fixed**: November 11, 2025  
**Status**: ✅ RESOLVED  
**Action Required**: Clear cookies và test lại
