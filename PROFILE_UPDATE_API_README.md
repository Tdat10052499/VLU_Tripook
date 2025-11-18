# Profile Update API Documentation

## Overview
Complete profile management system allowing users to update personal information and upload avatar images (Base64 format) directly to MongoDB.

**Status**: ✅ Fully Implemented (Backend + Frontend)
**Date**: 2024-01-13

---

## Backend API Endpoints

### 1. GET /api/profile
Retrieve user profile information.

**Method**: `GET`  
**Authentication**: Required (Bearer token)  
**CORS**: Enabled

**Request Headers**:
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "0123456789",
    "address": "123 Main St, City",
    "dateOfBirth": "1990-01-01",
    "bio": "Travel enthusiast",
    "avatar": "data:image/png;base64,iVBORw0KGgo...",
    "role": "user",
    "is_verified": true
  },
  "message": "User profile retrieved successfully"
}
```

**Errors**:
- `401`: Token is missing
- `404`: User not found
- `500`: Internal server error

---

### 2. PUT /api/profile
Update user profile information.

**Method**: `PUT`  
**Authentication**: Required (Bearer token)  
**CORS**: Enabled

**Request Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <jwt_token>"
}
```

**Request Body**:
```json
{
  "name": "John Doe",
  "phone": "0987654321",
  "address": "456 New Street",
  "dateOfBirth": "1990-05-15",
  "bio": "Updated bio text",
  "gender": "male"
}
```

**Allowed Fields**:
- `name` (string)
- `phone` (string)
- `address` (string)
- `dateOfBirth` (string, ISO format)
- `bio` (string)
- `gender` (string)

**Read-only Fields** (cannot be updated):
- `username`
- `email`
- `role`
- `is_verified`

**Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "phone": "0987654321",
    "address": "456 New Street",
    "dateOfBirth": "1990-05-15",
    "bio": "Updated bio text",
    "updated_at": "2024-01-13T10:30:00Z"
    // ... other fields
  },
  "message": "Profile updated successfully"
}
```

**Errors**:
- `400`: No valid fields to update
- `401`: Token is missing
- `404`: User not found
- `500`: Internal server error

---

### 3. POST /api/profile/avatar
Upload user avatar (Base64 encoded image).

**Method**: `POST`  
**Authentication**: Required (Bearer token)  
**CORS**: Enabled

**Request Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <jwt_token>"
}
```

**Request Body**:
```json
{
  "avatar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

**Validation Rules**:
1. **Format**: Must be Data URI format (`data:image/<type>;base64,<encoded_data>`)
2. **Allowed Types**: png, jpg, jpeg, gif, webp
3. **Size Limit**: 5MB (max)
   - Base64 encoding increases size by ~33%
   - Backend validates encoded string length (~6.7MB max)
4. **Storage**: Stored as Base64 string in MongoDB

**Response (200 OK)**:
```json
{
  "success": true,
  "avatar": "data:image/png;base64,iVBORw0KGgo...",
  "message": "Avatar uploaded successfully"
}
```

**Errors**:
- `400`: No avatar data provided
- `400`: Invalid image format (must be data URI)
- `400`: Invalid Base64 format
- `400`: Invalid image type (only png/jpg/jpeg/gif/webp allowed)
- `400`: Image too large (max 5MB)
- `401`: Token is missing
- `404`: User not found
- `500`: Internal server error

**MongoDB Update**:
```javascript
{
  $set: {
    avatar: "data:image/png;base64,...",
    avatar_updated_at: ISODate("2024-01-13T10:30:00Z")
  }
}
```

---

### 4. DELETE /api/profile/avatar
Remove user avatar.

**Method**: `DELETE`  
**Authentication**: Required (Bearer token)  
**CORS**: Enabled

**Request Headers**:
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Avatar deleted successfully"
}
```

**MongoDB Update**:
```javascript
{
  $unset: {
    avatar: "",
    avatar_updated_at: ""
  }
}
```

**Errors**:
- `401`: Token is missing
- `500`: Internal server error

---

## Frontend Integration

### Profile.tsx Component

**Location**: `frontend/src/pages/Profile.tsx`

**Key Features**:
1. **Edit Mode Toggle**: Switch between view and edit modes
2. **Profile Update**: Call PUT /api/profile on save
3. **Avatar Upload**: File picker → Base64 conversion → POST to API
4. **Real-time Preview**: Display uploaded avatar immediately

**State Management**:
```tsx
const [profileData, setProfileData] = useState({
  name: '', username: '', email: '', phone: '',
  address: '', dateOfBirth: '', bio: ''
});
const [originalData, setOriginalData] = useState(profileData);
const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
const [isEditing, setIsEditing] = useState(false);
```

**Update Profile Function**:
```tsx
const handleSave = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: profileData.name,
      phone: profileData.phone,
      address: profileData.address,
      dateOfBirth: profileData.dateOfBirth,
      bio: profileData.bio
    })
  });
  
  // Update local state and AuthContext
  // Show success message
};
```

**Avatar Upload Function**:
```tsx
const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file type and size
  const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    alert('Chỉ chấp nhận file ảnh (PNG, JPG, JPEG, GIF, WEBP)');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('Kích thước ảnh không được vượt quá 5MB');
    return;
  }

  // Convert to Base64
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64String = reader.result as string;
    
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/profile/avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ avatar: base64String })
    });
    
    // Update UI with new avatar
    if (response.ok) {
      setAvatarUrl(base64String);
      if (user) user.avatar = base64String;
    }
  };
  
  reader.readAsDataURL(file);
};
```

**Avatar Display**:
```tsx
<div style={{ position: 'relative', width: '120px', height: '120px' }}>
  {avatarUrl || user?.avatar ? (
    <img 
      src={avatarUrl || user?.avatar || ''}
      alt="Avatar"
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover'
      }}
    />
  ) : (
    <div style={{
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      backgroundColor: 'var(--color-bronze)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'var(--font-size-4xl)',
      color: '#FFFFFF'
    }}>
      {profileData.name?.charAt(0) || 'U'}
    </div>
  )}
  
  <input
    type="file"
    ref={fileInputRef}
    accept="image/png,image/jpg,image/jpeg,image/gif,image/webp"
    onChange={handleAvatarUpload}
    style={{ display: 'none' }}
  />
  
  <button onClick={handleAvatarClick}>
    <FaCamera />
  </button>
</div>
```

---

## AuthContext Updates

**Location**: `frontend/src/contexts/AuthContext.tsx`

**User Interface**:
```tsx
interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  bio?: string;
  avatar?: string;  // ← NEW: Base64 image data
  role: 'user' | 'provider' | 'admin';
  is_verified: boolean;
  // ... other fields
}
```

---

## Database Schema

**Collection**: `users`

**Updated Fields**:
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  username: "john_doe",
  email: "john@example.com",
  password: "<hashed>",
  name: "John Doe",
  phone: "0987654321",
  address: "456 New Street",
  dateOfBirth: "1990-05-15",
  bio: "Updated bio text",
  gender: "male",
  avatar: "data:image/png;base64,iVBORw0KGgo...",  // ← NEW
  avatar_updated_at: ISODate("2024-01-13T10:30:00Z"),  // ← NEW
  updated_at: ISODate("2024-01-13T10:30:00Z"),
  role: "user",
  is_verified: true,
  created_at: ISODate("2023-01-01T00:00:00Z")
}
```

---

## Testing Checklist

### Backend API Testing

- [ ] **GET /api/profile**
  - [ ] Returns user data with token
  - [ ] Returns 401 without token
  - [ ] Excludes password field
  - [ ] Includes avatar if exists

- [ ] **PUT /api/profile**
  - [ ] Updates allowed fields (name, phone, address, dateOfBirth, bio)
  - [ ] Ignores read-only fields (username, email, role)
  - [ ] Adds updated_at timestamp
  - [ ] Returns updated user object
  - [ ] Returns 400 if no valid fields

- [ ] **POST /api/profile/avatar**
  - [ ] Accepts valid Base64 image
  - [ ] Validates format (data URI)
  - [ ] Validates type (png/jpg/jpeg/gif/webp)
  - [ ] Validates size (max 5MB)
  - [ ] Stores in user.avatar field
  - [ ] Returns 400 for invalid format
  - [ ] Returns 400 for oversized image

- [ ] **DELETE /api/profile/avatar**
  - [ ] Removes avatar field
  - [ ] Removes avatar_updated_at field
  - [ ] Returns success message

### Frontend Testing

- [ ] **Profile Page**
  - [ ] Loads user data on mount
  - [ ] Displays avatar if exists
  - [ ] Shows initial letter if no avatar
  - [ ] Edit mode enables input fields
  - [ ] Cancel restores original data
  - [ ] Save calls API and updates UI
  - [ ] Shows success/error messages

- [ ] **Avatar Upload**
  - [ ] File picker opens on camera button click
  - [ ] Validates file type (image only)
  - [ ] Validates file size (max 5MB)
  - [ ] Converts to Base64 correctly
  - [ ] Displays preview after upload
  - [ ] Shows success/error messages
  - [ ] Updates AuthContext

---

## Known Limitations

1. **Avatar Size**: 5MB limit to prevent MongoDB document size issues
2. **Storage**: Base64 increases file size by ~33% vs binary
3. **Performance**: Large avatars slow down queries (future: use CDN)
4. **Browser Support**: FileReader API required (all modern browsers)

---

## Future Enhancements

1. **Image Optimization**: Compress images before upload
2. **CDN Migration**: Move from Base64 to AWS S3/CloudFront
3. **Thumbnail Generation**: Create smaller versions for lists
4. **Rate Limiting**: Prevent abuse of avatar upload endpoint
5. **Audit Log**: Track profile changes for security
6. **Validation**: Add phone format validation (Vietnamese numbers)

---

## Error Handling

### Backend Errors
All endpoints return consistent error format:
```json
{
  "success": false,
  "message": "Error description"
}
```

### Frontend Errors
- Network errors: Show generic "Có lỗi xảy ra" alert
- Validation errors: Show specific error message
- Auth errors: Redirect to login page

---

## Security Considerations

1. **JWT Authentication**: All endpoints require valid token
2. **CORS**: Restricted to localhost origins
3. **Field Validation**: Only allowed fields can be updated
4. **Password Excluded**: Never returned in API responses
5. **Size Limit**: Prevents DoS via large uploads
6. **Type Validation**: Only safe image types accepted

---

## Performance Notes

### Backend
- MongoDB direct queries (no ORM overhead)
- ObjectId conversion for JSON serialization
- Efficient field projection (exclude password)

### Frontend
- FileReader API for async conversion
- Real-time preview without re-fetch
- Local state update before API confirmation

---

## Blueprint Registration

**File**: `backend/app/__init__.py`

```python
from app.routes.profile import profile_bp
app.register_blueprint(profile_bp, url_prefix='/api')
```

**Routes Created**:
- `GET /api/profile`
- `PUT /api/profile`
- `POST /api/profile/avatar`
- `DELETE /api/profile/avatar`

---

## Dependencies

### Backend
- Flask
- PyMongo
- flask-cors
- JWT (from utils.jwt_auth)

### Frontend
- React
- TypeScript
- React Icons (FaCamera, FaUser, etc.)
- AuthContext

---

## Deployment Notes

1. **Environment Variables**: Ensure JWT_SECRET_KEY is set
2. **MongoDB**: Ensure users collection has indexes
3. **CORS**: Update allowed origins for production
4. **Storage**: Monitor MongoDB document sizes
5. **Backup**: Regular backups due to Base64 storage

---

## Support

For issues or questions, contact the development team or refer to:
- Backend code: `backend/app/routes/profile.py`
- Frontend code: `frontend/src/pages/Profile.tsx`
- AuthContext: `frontend/src/contexts/AuthContext.tsx`
