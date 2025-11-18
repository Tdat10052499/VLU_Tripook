# Booking History Architecture - Khuyến Nghị & Best Practices

## 🎯 Quyết Định Kiến Trúc

### ✅ KHÔNG CẦN collection riêng `booking_history`

**Lý do:**
- Collection `bookings` hiện tại ĐÃ ĐỦ làm immutable log
- Mỗi booking là 1 transaction record với timestamps đầy đủ
- MongoDB phù hợp cho event sourcing pattern
- Tránh duplicate data và complexity

---

## 📊 Schema Tối Ưu

### Collection: `bookings` (Single Source of Truth)

```javascript
{
  _id: ObjectId("673a1b2c3d4e5f6a7b8c9d0e"),
  
  // === Identity ===
  booking_reference: "BK20251117123456",  // Unique, human-readable
  user_id: ObjectId("..."),               // null cho guest bookings
  
  // === Guest Info (cho user chưa đăng ký) ===
  guest_info: {
    fullName: "Nguyễn Văn A",
    email: "nguyen@example.com",
    phone: "0912345678"
  },
  
  // === Service Details ===
  service_id: ObjectId("..."),
  service_type: "trip",                   // trip, accommodation, tour
  
  // === Booking Details ===
  check_in: ISODate("2025-12-01"),
  check_out: ISODate("2025-12-05"),
  guests: 2,
  special_requests: "Late check-in",
  
  // === Financial ===
  total_amount: 1500000,
  currency: "VND",
  payment_method: "vnpay",
  
  // === Status Tracking (Core cho history) ===
  status: "completed",                    // pending -> confirmed -> completed / cancelled
  payment_status: "paid",                 // pending, paid, refunded
  
  // === Timestamps (Critical cho log/audit) ===
  created_at: ISODate("2025-11-17T10:00:00Z"),     // Khi tạo booking
  updated_at: ISODate("2025-11-17T10:30:00Z"),     // Lần cập nhật cuối
  confirmed_at: ISODate("2025-11-17T11:00:00Z"),   // Khi provider xác nhận
  completed_at: ISODate("2025-12-05T12:00:00Z"),   // Khi hoàn thành
  cancelled_at: null,                              // Nếu bị huỷ
  
  // === Audit Trail (Optional - cho compliance) ===
  status_history: [
    {
      status: "pending",
      timestamp: ISODate("2025-11-17T10:00:00Z"),
      changed_by: "system",
      note: "Booking created"
    },
    {
      status: "confirmed",
      timestamp: ISODate("2025-11-17T11:00:00Z"),
      changed_by: ObjectId("provider_id"),
      note: "Confirmed by provider"
    },
    {
      status: "completed",
      timestamp: ISODate("2025-12-05T12:00:00Z"),
      changed_by: "system",
      note: "Auto-completed after check-out"
    }
  ],
  
  // === Metadata (cho analytics/debugging) ===
  metadata: {
    ip_address: "123.45.67.89",
    user_agent: "Mozilla/5.0...",
    booking_source: "web",                // web, mobile, api, admin
    referrer: "google.com",
    device_type: "desktop"
  },
  
  // === Soft Delete (thay vì xoá thật) ===
  deleted_at: null,                       // Nếu cần "xoá" booking
  deleted_by: null
}
```

---

## 🔍 Indexes Strategy

### 1. Query By User (Most Common)
```javascript
db.bookings.createIndex({ 
  user_id: 1, 
  created_at: -1 
})
```
**Use case:** Lấy lịch sử booking của 1 user, sắp xếp mới nhất

### 2. Unique Booking Reference
```javascript
db.bookings.createIndex({ 
  booking_reference: 1 
}, { unique: true })
```
**Use case:** Tra cứu booking nhanh bằng reference

### 3. Status Filtering
```javascript
db.bookings.createIndex({ 
  user_id: 1, 
  status: 1, 
  created_at: -1 
})
```
**Use case:** Lọc booking theo trạng thái (pending, completed...)

### 4. Pagination Optimization
```javascript
db.bookings.createIndex({ 
  user_id: 1, 
  created_at: -1,
  _id: 1 
})
```
**Use case:** Phân trang hiệu quả (skip + limit)

### 5. Time-Range Queries
```javascript
db.bookings.createIndex({ 
  created_at: -1 
})
```
**Use case:** Analytics, reports theo thời gian

### 6. Service Provider View
```javascript
db.bookings.createIndex({ 
  service_id: 1, 
  created_at: -1 
})
```
**Use case:** Provider xem bookings cho dịch vụ của mình

### 7. Guest Bookings
```javascript
db.bookings.createIndex({ 
  "guest_info.email": 1 
}, { sparse: true })
```
**Use case:** Guest lookup bookings bằng email

---

## 🚀 Query Patterns & Performance

### Pattern 1: User Booking History (Pagination)
```javascript
// Frontend request: GET /api/bookings/user?page=1&limit=20&status=completed

db.bookings.find({ 
  user_id: ObjectId("user_id"),
  status: "completed"
})
  .sort({ created_at: -1 })
  .skip(0)
  .limit(20)

// Performance: ~10-50ms với index (dưới 1M bookings)
```

### Pattern 2: Count Statistics
```javascript
// Đếm tổng bookings (cho profile stats)
db.bookings.countDocuments({ 
  user_id: ObjectId("user_id") 
})

// Performance: ~5-20ms với index
```

### Pattern 3: Aggregation Analytics
```javascript
// Thống kê theo tháng
db.bookings.aggregate([
  { 
    $match: { 
      user_id: ObjectId("user_id"),
      created_at: { 
        $gte: ISODate("2025-01-01"),
        $lte: ISODate("2025-12-31")
      }
    }
  },
  {
    $group: {
      _id: { 
        $dateToString: { format: "%Y-%m", date: "$created_at" }
      },
      count: { $sum: 1 },
      total_amount: { $sum: "$total_amount" }
    }
  },
  { $sort: { _id: 1 } }
])
```

### Pattern 4: Full-Text Search
```javascript
// Tìm kiếm booking
db.bookings.createIndex({ 
  booking_reference: "text",
  "guest_info.fullName": "text" 
})

db.bookings.find({ 
  $text: { $search: "Nguyen" }
})
```

---

## 📈 Scaling Strategy

### Phase 1: 0 - 100K bookings
**Current State ✅**
- Single collection `bookings`
- Compound indexes đủ dùng
- Query performance < 100ms
- **Action:** KHÔNG CẦN thay đổi gì

### Phase 2: 100K - 1M bookings
**Optimization**
```javascript
// 1. Add TTL index để archive old bookings
db.bookings.createIndex(
  { created_at: 1 },
  { 
    expireAfterSeconds: 31536000,  // 1 năm
    partialFilterExpression: { 
      status: { $in: ["completed", "cancelled"] }
    }
  }
)

// 2. Separate collection cho archived bookings
db.bookings_archive.insertMany(
  db.bookings.find({ 
    created_at: { $lt: ISODate("2024-01-01") }
  })
)
```

### Phase 3: 1M - 10M bookings
**Sharding**
```javascript
// Shard bằng user_id (hashed)
sh.shardCollection("Tripook-Cluster.bookings", { 
  user_id: "hashed" 
})

// Hoặc compound shard key
sh.shardCollection("Tripook-Cluster.bookings", { 
  user_id: 1,
  created_at: 1 
})
```

### Phase 4: 10M+ bookings
**Multi-Region + Read Replicas**
```javascript
// MongoDB Atlas: Auto-scaling + Region distribution
// Read from nearest replica
db.bookings.find({ ... }).readPref("nearest")
```

---

## ⚡ Performance Benchmarks

| Operation | No Index | With Index | Sharded |
|-----------|----------|------------|---------|
| User history (20 items) | 500-1000ms | 10-50ms | 5-20ms |
| Count total bookings | 300-800ms | 5-20ms | 3-10ms |
| Filter by status | 800-2000ms | 20-100ms | 10-50ms |
| Search by reference | 500-1500ms | 5-15ms | 3-10ms |

**Target:** < 100ms cho mọi query (đạt được với indexes)

---

## 🔐 Security & Privacy

### 1. Data Access Control
```javascript
// User chỉ được xem bookings của mình
query = { user_id: ObjectId(authenticated_user_id) }

// Admin/Provider có permission khác
if (user.role === 'admin') {
  query = {} // Xem tất cả
} else if (user.role === 'provider') {
  query = { service_id: { $in: provider_service_ids } }
}
```

### 2. Sensitive Data Protection
```javascript
// Không log sensitive data
metadata: {
  ip_address: "123.45.67.89",  // OK
  user_agent: "...",            // OK
  payment_token: "...",         // ❌ NEVER log payment tokens
  password: "...",              // ❌ NEVER log passwords
}
```

### 3. GDPR Compliance
```javascript
// Soft delete thay vì hard delete
{
  deleted_at: ISODate("2025-11-17T..."),
  deleted_by: ObjectId("user_id"),
  deletion_reason: "User requested data deletion"
}

// Anonymize data sau 30 ngày
{
  guest_info: {
    fullName: "[DELETED]",
    email: "[DELETED]",
    phone: "[DELETED]"
  },
  anonymized_at: ISODate("...")
}
```

---

## 🛠️ Implementation Checklist

### Backend (Đã implement ✅)
- [x] Collection `bookings` với full schema
- [x] API: POST `/api/bookings` (create)
- [x] API: GET `/api/bookings/:id` (get one)
- [x] API: GET `/api/bookings/user` (với pagination) ✅ Mới cập nhật
- [x] Indexes script: `create_booking_indexes.py`

### Cần thêm (Optional)
- [ ] API: PATCH `/api/bookings/:id/status` (update status)
- [ ] API: POST `/api/bookings/:id/cancel` (cancel booking)
- [ ] API: GET `/api/bookings/stats` (user statistics)
- [ ] Webhook: Payment confirmation
- [ ] Cron job: Auto-complete bookings sau check-out
- [ ] Email: Booking confirmation, reminders

### Frontend (Cần implement)
- [ ] Booking history page với pagination
- [ ] Filter by status (All, Pending, Confirmed, Completed, Cancelled)
- [ ] Sort by date/amount
- [ ] Search by reference
- [ ] Booking detail modal
- [ ] Cancel booking flow

---

## 📝 API Documentation

### GET /api/bookings/user
Lấy danh sách bookings của user với pagination

**Query Parameters:**
```
page=1          // Trang số (default: 1)
limit=20        // Số items per page (default: 20, max: 100)
status=pending  // Filter theo status (optional)
sort=-created_at // Sort field (default: -created_at)
```

**Response:**
```json
{
  "bookings": [
    {
      "_id": "673a1b2c3d4e5f6a7b8c9d0e",
      "booking_reference": "BK20251117123456",
      "service_type": "trip",
      "status": "completed",
      "total_amount": 1500000,
      "created_at": "2025-11-17T10:00:00Z",
      "check_in": "2025-12-01",
      "check_out": "2025-12-05"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

---

## 🎓 Kết Luận

### ✅ Khuyến nghị cuối cùng:

1. **KHÔNG TẠO** collection `booking_history` riêng
2. **SỬ DỤNG** collection `bookings` hiện tại như immutable log
3. **THÊM** indexes để optimize query (chạy script `create_booking_indexes.py`)
4. **BỔ SUNG** status_history array vào schema (nếu cần audit trail chi tiết)
5. **IMPLEMENT** pagination khi query user bookings
6. **MONITOR** performance và scale khi cần (sharding ở Phase 3)

### 💡 Lợi ích:
- ✅ Simple architecture - dễ maintain
- ✅ Fast queries với indexes
- ✅ Flexible schema - dễ mở rộng
- ✅ Cost-effective - không duplicate data
- ✅ Scalable - MongoDB sharding support tốt

### 🚫 Tránh:
- ❌ Tạo nhiều collections cho cùng entity
- ❌ Hard delete bookings (dùng soft delete)
- ❌ Query không có index
- ❌ Load all bookings không pagination

---

**Run indexes script:**
```bash
docker exec -it tripook-backend python create_booking_indexes.py
```

**Restart services:**
```bash
docker-compose restart backend
```
