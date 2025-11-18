# 📧 Hướng dẫn Setup Email Service với Brevo

## ✅ Đã hoàn thành

Hệ thống email thông báo Provider approval/rejection đã được tích hợp thành công với Brevo API:

### 🎨 Template Email đã tạo:

1. **Email Phê duyệt Provider** (Approval)
   - Theme: "Hồn Việt" với màu Indigo-Bronze-Cream
   - Banner xanh lá gradient thành công
   - Danh sách tính năng Provider có thể sử dụng
   - Mẹo bắt đầu thành công
   - Link trực tiếp đến Provider Dashboard
   - Thông tin hỗ trợ

2. **Email Từ chối Provider** (Rejection)
   - Theme: "Hồn Việt" đồng nhất
   - Banner Indigo trang trọng
   - Hiển thị lý do từ chối (nếu có)
   - Các bước tiếp theo để cải thiện hồ sơ
   - Link liên hệ hỗ trợ
   - Thông tin liên lạc chi tiết

### 📂 Files đã cập nhật:

- `backend/app/services/email_service.py`
  - ✅ Cập nhật `send_provider_approval_email()` sử dụng Brevo API
  - ✅ Cập nhật `send_provider_rejection_email()` sử dụng Brevo API
  - ✅ Template HTML responsive và đẹp mắt
  - ✅ Mock mode khi API key chưa cấu hình

- `backend/app/routes/admin.py`
  - ✅ Đã có sẵn logic gọi email service khi approve/reject
  - ✅ Xử lý exception khi email fail (không ảnh hưởng approve process)

---

## 🔧 Cấu hình Brevo (Bạn cần làm)

### Bước 1: Lấy API Key từ Brevo

1. **Đăng nhập Brevo Dashboard:**
   - Truy cập: https://app.brevo.com/
   - Đăng nhập với tài khoản của bạn

2. **Tạo API Key:**
   - Menu: **Settings** → **SMTP & API** → **API Keys**
   - Click **Generate a new API key**
   - Đặt tên: `Tripook Provider Notifications`
   - Copy API key (chỉ hiển thị 1 lần!)

3. **Verify Sender Email:**
   - Menu: **Settings** → **Senders & IP**
   - Add sender email: `noreply@tripook.com` (hoặc domain của bạn)
   - Xác thực email qua link được gửi đến

### Bước 2: Cập nhật Environment Variables

Mở file `.env` trong thư mục `backend/` và thêm/cập nhật:

```env
# Brevo API Configuration
BREVO_API_KEY=your_brevo_api_key_here
FROM_EMAIL=noreply@tripook.com
FROM_NAME=Tripook
FRONTEND_URL=http://localhost
```

**Lưu ý:**
- `BREVO_API_KEY`: API key vừa copy từ Brevo
- `FROM_EMAIL`: Email sender đã verify trên Brevo
- `FROM_NAME`: Tên hiển thị khi gửi email
- `FRONTEND_URL`: URL frontend của bạn (production: https://yourdomain.com)

### Bước 3: Restart Backend Container

```bash
docker-compose restart backend
```

Hoặc rebuild nếu cần:

```bash
docker-compose up -d --build backend
```

---

## ✉️ Test Email Service

### Test thủ công:

1. **Đăng nhập Admin:**
   - Truy cập: http://localhost/admin/providers
   - Đăng nhập với tài khoản admin

2. **Approve/Reject Provider:**
   - Chọn 1 Provider pending
   - Click **Phê duyệt** hoặc **Từ chối**
   - Nhập lý do (nếu từ chối)
   - Confirm

3. **Kiểm tra Email:**
   - Check inbox của Provider email
   - Email sẽ đến từ `noreply@tripook.com` (hoặc FROM_EMAIL bạn cấu hình)
   - Subject:
     * Approval: "🎉 Tài khoản Provider đã được phê duyệt - Tripook"
     * Rejection: "📋 Thông báo về đăng ký tài khoản Provider - Tripook"

### Check Backend Logs:

```bash
docker logs tripook-backend
```

**Success logs:**
```
✅ Provider approval email sent to: provider@example.com
📬 Brevo Message ID: <message_id>
```

**Mock mode (API key chưa cấu hình):**
```
⚠️ Brevo API not configured. Mock mode.
📧 Would send provider approval email to: provider@example.com
```

---

## 🎨 Email Template Features

### Design System:
- **Colors:** Indigo Blue (#0A2342), Bronze Gold (#AE8E5B), Cream (#FAF3E0)
- **Fonts:** Merriweather (headings), Be Vietnam Pro (body)
- **Layout:** Responsive, 600px width, mobile-friendly
- **Icons:** Emoji + descriptive text

### Approval Email includes:
- ✅ Success banner với animation
- 🏢 Quick access button to Provider Dashboard
- 🌟 Danh sách tính năng (Tạo dịch vụ, Thống kê, Tương tác KH, Marketing)
- 💡 5 mẹo để bắt đầu thành công
- 📞 Thông tin hỗ trợ (Email, Hotline, Giờ làm việc)
- 🎉 Welcome message

### Rejection Email includes:
- ⚠️ Professional rejection notice
- 📝 Lý do từ chối (nếu Admin cung cấp)
- 🔄 4 bước tiếp theo (Liên hệ, Cập nhật, Chuẩn bị GT, Đăng ký lại)
- 📞 Button liên hệ hỗ trợ
- 📧 Thông tin contact đầy đủ
- 💪 Encouragement message

---

## 🔍 Troubleshooting

### Lỗi: "Brevo API not configured. Mock mode"
**Nguyên nhân:** BREVO_API_KEY chưa được set trong .env

**Giải pháp:**
1. Check file `backend/.env` có BREVO_API_KEY chưa
2. Restart backend container sau khi thêm key
3. Verify API key còn valid trên Brevo dashboard

### Lỗi: "Brevo API error: 401 Unauthorized"
**Nguyên nhân:** API key không hợp lệ hoặc đã bị revoke

**Giải pháp:**
1. Tạo API key mới trên Brevo
2. Cập nhật lại BREVO_API_KEY trong .env
3. Restart backend

### Lỗi: "Sender email not verified"
**Nguyên nhân:** Email gửi chưa được verify trên Brevo

**Giải pháp:**
1. Vào Brevo Dashboard → Settings → Senders
2. Verify email sender
3. Đảm bảo FROM_EMAIL trong .env khớp với email đã verify

### Email vào Spam
**Giải pháp:**
1. Setup SPF, DKIM records cho domain (Brevo có hướng dẫn)
2. Warm-up email sender (gửi ít email lúc đầu, tăng dần)
3. Avoid spam trigger words trong subject/content
4. Đảm bảo recipient đã opt-in nhận email

---

## 📊 Brevo Dashboard Monitoring

### Xem thống kê email:

1. **Truy cập Dashboard:**
   - https://app.brevo.com/statistics/email

2. **Metrics quan trọng:**
   - **Delivered:** Email đã gửi thành công
   - **Opened:** Email đã được mở
   - **Clicked:** Link trong email đã được click
   - **Bounced:** Email bị bounce (sai địa chỉ, mailbox full)
   - **Spam:** Email bị đánh dấu spam

3. **View individual emails:**
   - Menu: **Campaigns** → **Transactional emails**
   - Filter by date, status, recipient

---

## 💰 Brevo Free Tier Limits

- **300 emails/day** (free plan)
- Unlimited contacts
- Email templates
- Transactional emails
- SMS (paid addon)

**Nếu cần nhiều hơn:**
- Upgrade to Lite plan: $25/month (20,000 emails)
- Business plan: Custom pricing

---

## 🚀 Production Checklist

Trước khi deploy production:

- [ ] ✅ Verify API key production trên Brevo
- [ ] ✅ Setup SPF/DKIM records cho domain
- [ ] ✅ Verify sender email production
- [ ] ✅ Update FRONTEND_URL to production domain
- [ ] ✅ Test email delivery to các email providers khác (Gmail, Outlook, Yahoo)
- [ ] ✅ Setup email monitoring alerts trên Brevo
- [ ] ✅ Document email sending policy (frequency, triggers)
- [ ] ✅ Prepare email templates for different languages (nếu cần)

---

## 📚 Resources

- **Brevo Documentation:** https://developers.brevo.com/
- **Brevo API Reference:** https://developers.brevo.com/reference
- **Brevo Support:** https://help.brevo.com/
- **Email Design Best Practices:** https://www.campaignmonitor.com/resources/

---

## 🎯 Next Steps (Optional Improvements)

1. **Email Templates trên Brevo:**
   - Tạo templates trên Brevo dashboard
   - Sử dụng template ID thay vì HTML inline
   - Dễ update template không cần deploy code

2. **Email Tracking:**
   - Track open rate, click rate
   - Log email events vào database
   - Analytics dashboard

3. **Email Preferences:**
   - Cho phép user opt-out notification emails
   - Manage email preferences trong profile

4. **Multi-language Support:**
   - Detect user language
   - Send email theo ngôn ngữ tương ứng

5. **Email Queue:**
   - Sử dụng Celery/RQ để queue emails
   - Retry mechanism khi fail
   - Bulk sending optimization

---

## ❓ Cần hỗ trợ?

Nếu gặp vấn đề hoặc cần thêm thông tin:

1. Check backend logs: `docker logs tripook-backend`
2. Check Brevo dashboard cho email delivery status
3. Contact Brevo support nếu issue từ phía Brevo
4. Raise issue trong repository này

---

**Status:** ✅ READY TO USE (sau khi cấu hình API key)

**Last Updated:** 2025-11-19
