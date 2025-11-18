# 📋 PROFILE PAGE - TRAVELLER

## 🎯 Tổng quan

Trang **Profile** được thiết kế dành riêng cho **Traveller (người dùng thường)** - không phải Provider hay Admin. Trang này cho phép người dùng:
- Xem và chỉnh sửa thông tin cá nhân
- Quản lý lịch sử đặt chỗ (đang phát triển)
- Xem danh sách yêu thích (đang phát triển)
- Cài đặt bảo mật (đang phát triển)

---

## 🎨 Thiết kế UI

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│                     Header                               │
├──────────────┬──────────────────────────────────────────┤
│              │        Page Title & Description          │
│              ├──────────────────────────────────────────┤
│   Sidebar    │                                          │
│   ────────   │         Tab Navigation                    │
│   - Avatar   │  [Info] [Bookings] [Favorites] [Security]│
│   - Stats    │                                          │
│              │         Tab Content Area                  │
│              │  ┌────────────────────────────────────┐  │
│              │  │  Form fields / Empty states        │  │
│              │  │                                    │  │
│              │  └────────────────────────────────────┘  │
├──────────────┴──────────────────────────────────────────┤
│                     Footer                               │
└─────────────────────────────────────────────────────────┘
```

### Color Scheme (Design System)
- **Primary Background**: `var(--color-bg-main)` (#FAF8F1) - Cream/Beige
- **Card Background**: `#FFFFFF` - White
- **Primary Text**: `var(--color-deep-indigo)` (#2C3E50) - Deep Blue
- **Accent Color**: `var(--color-bronze)` (#CD7F32) - Bronze
- **Success Color**: `#27AE60` - Green
- **Error/Alert**: `var(--color-vermilion)` (#D9411E) - Red

---

## 🔧 Features

### 1. **Left Sidebar - User Info Card**
#### Avatar Section
- Circular avatar with user initial (120×120px)
- Bronze background với border cream
- Camera icon button để upload ảnh (future feature)
- Hover effect: scale(1.1) + color change

#### User Details
- Display name (h2 - font-heading)
- Username với @ prefix
- Border separator màu bronze-light

#### Quick Stats
- **Chuyến đi**: 12 (với icon FaSuitcase)
- **Yêu thích**: 28 (với icon FaHeart)
- Flex layout: label + icon → number

### 2. **Tabs Navigation**
4 tabs chính:
1. **Thông tin cá nhân** (FaUser) - Active by default
2. **Lịch sử đặt chỗ** (FaHistory) - Coming soon
3. **Yêu thích** (FaHeart) - Coming soon
4. **Bảo mật** (FaShieldAlt) - Coming soon

**Active Tab Styling**:
- Background: `var(--color-cream)`
- Border: `2px solid var(--color-bronze)`
- Font weight: bold
- Color: `var(--color-deep-indigo)`

**Hover Effect (inactive tabs)**:
- Background: `var(--color-cream)`
- Border: `var(--color-bronze-light)`

### 3. **Tab Content - Thông tin cá nhân**

#### Section Header
- Title: "Thông tin cá nhân" (font-heading, 2xl)
- Edit/Save/Cancel buttons với icons
- Border bottom: `2px solid var(--color-bronze-light)`

#### Form Fields (2-column grid)

**Row 1:**
- **Họ và tên** (editable)
  - Icon: FaUser
  - Input type: text
  - Focus: bronze border + shadow
- **Tên người dùng** (read-only)
  - Icon: FaUser
  - Background: cream (disabled)

**Row 2:**
- **Email** (read-only)
  - Icon: FaEnvelope
  - Background: cream (disabled)
- **Số điện thoại** (editable)
  - Icon: FaPhone
  - Placeholder: "0xxxxxxxxx"
  - Focus: bronze border + shadow

**Row 3 (full width):**
- **Địa chỉ** (editable)
  - Icon: FaMapMarkerAlt
  - Placeholder: "Nhập địa chỉ của bạn"

**Row 4:**
- **Ngày sinh** (editable)
  - Icon: FaCalendar
  - Input type: date

**Row 5 (full width):**
- **Giới thiệu bản thân** (editable)
  - Textarea (4 rows)
  - Placeholder: "Viết vài dòng về bạn..."
  - Resize: vertical

#### Edit Mode Logic
```typescript
const [isEditing, setIsEditing] = useState(false);

// Khi bấm "Chỉnh sửa"
setIsEditing(true); // Show input fields

// Khi bấm "Lưu"
handleSave(); // Call API, update state
setIsEditing(false);

// Khi bấm "Hủy"
setProfileData(originalData); // Restore original
setIsEditing(false);
```

#### Button States
**Edit Button (bronze)**:
- Background: `var(--color-bronze)`
- Hover: `var(--color-deep-indigo)` + translateY(-2px)
- Icon: FaEdit

**Save Button (green)**:
- Background: `#27AE60`
- Hover: `#229954` + translateY(-2px)
- Icon: FaSave

**Cancel Button (outline gray)**:
- Background: transparent
- Border: `2px solid var(--color-text-secondary)`
- Hover: fill with gray + white text
- Icon: FaTimes

### 4. **Empty States (Other Tabs)**

#### Lịch sử đặt chỗ
- Icon: FaHistory (64px, bronze-light)
- Title: "Lịch sử đặt chỗ"
- Text: "Chức năng đang được phát triển"

#### Yêu thích
- Icon: FaHeart (64px, vermilion)
- Title: "Danh sách yêu thích"
- Text: "Chức năng đang được phát triển"

#### Bảo mật
- Icon: FaShieldAlt (64px, green)
- Title: "Bảo mật tài khoản"
- Text: "Chức năng đang được phát triển"

---

## 💾 State Management

### Profile Data State
```typescript
const [profileData, setProfileData] = useState({
  name: '',
  username: '',
  email: '',
  phone: '',
  address: '',
  dateOfBirth: '',
  bio: ''
});
```

### Original Data (for cancel)
```typescript
const [originalData, setOriginalData] = useState(profileData);
```

### UI States
```typescript
const [isEditing, setIsEditing] = useState(false);
const [activeTab, setActiveTab] = useState<'info' | 'bookings' | 'favorites' | 'security'>('info');
```

---

## 🔐 Authentication Check

```typescript
useEffect(() => {
  if (!isAuthenticated) {
    navigate('/login');
    return;
  }

  if (user) {
    // Load user data from AuthContext
    const data = {
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      dateOfBirth: user.dateOfBirth || '',
      bio: user.bio || ''
    };
    setProfileData(data);
    setOriginalData(data);
  }
}, [user, isAuthenticated, navigate]);
```

---

## 🎭 Responsive Design

### Desktop (> 992px)
- Sidebar: 280px fixed width
- Content: flex-grow
- Grid: 2 columns for form fields

### Tablet (768px - 992px)
- Sidebar: full width on top
- Content: full width below
- Grid: 2 columns

### Mobile (< 768px)
- Stack layout
- Grid: 1 column for form fields
- Tabs: horizontal scroll

**Note**: Responsive CSS được xử lý bằng inline styles + Tailwind utilities

---

## 🚀 API Integration (TODO)

### Get User Profile
```typescript
GET /api/users/profile
Authorization: Bearer {token}

Response:
{
  "user": {
    "id": "...",
    "name": "...",
    "username": "...",
    "email": "...",
    "phone": "...",
    "address": "...",
    "dateOfBirth": "...",
    "bio": "...",
    "avatar": "..."
  }
}
```

### Update User Profile
```typescript
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "name": "...",
  "phone": "...",
  "address": "...",
  "dateOfBirth": "...",
  "bio": "..."
}

Response:
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

### Upload Avatar (Future)
```typescript
POST /api/users/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
{
  "avatar": File
}
```

---

## 📝 Validation Rules

### Phone Number
- Format: `0xxxxxxxxx` (10 digits, start with 0)
- Pattern: `/^0[0-9]{9}$/`

### Date of Birth
- Must be in past
- Min age: 18 years old (optional)

### Bio
- Max length: 500 characters (optional)

---

## 🎨 Design Tokens Used

### Spacing
- `var(--spacing-2)` - 8px
- `var(--spacing-3)` - 12px
- `var(--spacing-4)` - 16px
- `var(--spacing-6)` - 24px
- `var(--spacing-8)` - 32px
- `var(--spacing-10)` - 40px
- `var(--spacing-12)` - 48px
- `var(--spacing-20)` - 80px

### Border Radius
- `var(--radius-lg)` - 12px (inputs, buttons)
- `var(--radius-xl)` - 16px (tabs)
- `var(--radius-2xl)` - 24px (cards)

### Shadows
- `var(--shadow-md)` - Medium shadow for tabs
- `var(--shadow-lg)` - Large shadow for cards

### Typography
- **Heading Font**: `var(--font-heading)` - Playfair Display
- **Body Font**: `var(--font-body)` - Be Vietnam Pro
- **Font Sizes**: xs, sm, base, lg, xl, 2xl, 4xl

---

## 🔄 Next Steps (Phase K Continued)

### For Traveller Profile:
1. ✅ **DONE**: Layout + UI với design system
2. ✅ **DONE**: Tab navigation (Info, Bookings, Favorites, Security)
3. ✅ **DONE**: Edit mode với save/cancel
4. ⏳ **TODO**: API integration
5. ⏳ **TODO**: Avatar upload
6. ⏳ **TODO**: Bookings history tab
7. ⏳ **TODO**: Favorites tab
8. ⏳ **TODO**: Security tab (change password)

### For Provider Dashboard:
- Analytics charts (bookings, revenue)
- Recent bookings table
- Service performance metrics
- Quick actions

### For Admin Dashboard:
- User statistics
- Provider approval queue
- System health metrics
- Recent activities

---

## 📸 Component Preview

```
Profile Page Structure:
┌──────────────────────────────────────────────┐
│ [Header with Navbar]                         │
├─────────────┬────────────────────────────────┤
│   Avatar    │  Hồ Sơ Của Tôi                 │
│   ────      │  Quản lý thông tin cá nhân...  │
│   [T]       │                                │
│   Tân Đạt   │  ┌──────────────────────────┐ │
│   @tdat     │  │ [Info] [Bookings] [❤] [🛡]│ │
│   ──────    │  └──────────────────────────┘ │
│   🧳 12     │  ┌──────────────────────────┐ │
│   ❤ 28     │  │ Thông tin cá nhân   [✏️] │ │
│             │  ├──────────────────────────┤ │
│             │  │ [Họ tên]  [Username]    │ │
│             │  │ [Email]   [Phone]       │ │
│             │  │ [Address]               │ │
│             │  │ [DOB]                   │ │
│             │  │ [Bio]                   │ │
│             │  └──────────────────────────┘ │
└─────────────┴────────────────────────────────┘
│ [Footer]                                     │
└──────────────────────────────────────────────┘
```

---

## ✅ Testing Checklist

- [ ] Authentication redirect works (không login → /login)
- [ ] User data loads from AuthContext
- [ ] Edit mode toggles correctly
- [ ] Form inputs có validation
- [ ] Save button calls API (mock)
- [ ] Cancel restores original data
- [ ] Tab navigation works
- [ ] Responsive trên mobile/tablet
- [ ] Icons hiển thị đúng
- [ ] Colors match design system
- [ ] Hover effects smooth
- [ ] Focus states visible

---

**Status**: ✅ Phase K - Part 1 (Traveller Profile) COMPLETED
**Next**: Provider Dashboard + Admin Dashboard updates
