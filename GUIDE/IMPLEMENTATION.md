# IVS Learning Hub - Tài liệu Triển khai Toàn diện

**Ngày cập nhật**: 7 tháng 11, 2025
**Phiên bản**: 1.0.0

---

## 📋 Tóm tắt các cải thiện

Tài liệu này mô tả các cải thiện toàn diện được thực hiện cho `ivslearning.top` nhằm biến nó thành một **Learning Hub tích hợp** thực sự với các chức năng SSO và quản lý người dùng.

### Các Thay đổi Chính

| Thành phần | Trạng thái | Mô tả |
|-----------|----------|--------|
| **Firebase Auth** | ✅ Hoàn tất | Nâng cấp v10.7.1 → v12.5.0, tích hợp toàn bộ hệ thống |
| **Dashboard Học viên** | ✅ Hoàn tất | Trang riêng biệt cho người dùng sau khi đăng nhập |
| **Trang Profile** | ✅ Hoàn tất | Quản lý thông tin cá nhân, đổi mật khẩu |
| **Global Auth State** | ✅ Hoàn tất | `onAuthStateChanged()` toàn cục với header/footer động |
| **Learning Hub** | ✅ Hoàn tất | Chuẩn hóa thông tin ứng dụng và UI |
| **Cloud Functions** | ✅ Hoàn tất | 4 functions hỗ trợ SSO và quản lý người dùng |
| **SSO Helper Module** | ✅ Hoàn tất | `sso.js` cho token exchange qua miền |

---

## 📁 Cấu trúc Dự án

```
ivslearning.top/
├── index.html                    # Trang chủ tổng hợp
├── live_index.html              # Trang chủ marketing (cũ)
├── auth.html                    # Đăng nhập/Đăng ký
├── dashboard.html               # Dashboard học viên (NEW)
├── profile.html                 # Trang hồ sơ cá nhân (NEW)
├── learning-materials.html      # Learning Hub
├── admin.html                   # CMS cho admin
├── analytics.html               # Dashboard thống kê
│
├── css/
│   ├── tailwind.css            # Tailwind CSS framework
│   ├── styles.css              # Custom styles
│   └── animations.css          # Animations
│
├── js/
│   ├── firebase.js             # Firebase config
│   ├── auth.js                 # Auth logic
│   ├── dashboard.js            # Dashboard logic (NEW)
│   ├── profile.js              # Profile logic (NEW)
│   ├── app.js                  # Global auth listener (NEW)
│   ├── sso.js                  # SSO helper module (NEW)
│   ├── utils.js               # Utilities
│   └── language.js            # Language support
│
├── functions/                  # Firebase Cloud Functions (NEW)
│   ├── package.json           # Dependencies
│   ├── index.js              # Cloud Functions code
│   └── README.md             # Deployment guide
│
├── package.json              # NPM dependencies
└── README.md                # Project documentation
```

---

## 🔐 Tích hợp Firebase

### 1. Phiên bản Firebase

- **Cũ**: v10.7.1
- **Mới**: v12.5.0
- **Nơi cập nhật**:
  - `auth.html` (CDN v12.5.0)
  - `dashboard.html` (CDN v12.5.0)
  - `profile.html` (CDN v12.5.0)
  - `learning-materials.html` (CDN v12.5.0)

### 2. Firebase Configuration

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAOxCF0PhA6s3DtvETux-kXGTXRTlpL4vs",
  authDomain: "ivs-159a7.firebaseapp.com",
  projectId: "ivs-159a7",
  storageBucket: "ivs-159a7.firebasestorage.app",
  messagingSenderId: "452959273724",
  appId: "1:452959273724:web:17a23e383fb1807c040d79",
  measurementId: "G-L4KG7BCTJE"
};
```

### 3. Modules Firebase Được Sử dụng

- `firebase/app` - Khởi tạo ứng dụng
- `firebase/auth` - Xác thực người dùng
- `firebase/analytics` - Theo dõi sự kiện

---

## 👤 Quản lý Người dùng

### Luồng Đăng nhập/Đăng ký

```
1. User truy cập auth.html
2. Nhập email & mật khẩu
3. Hệ thống tạo tài khoản (hoặc đăng nhập nếu có)
4. Firebase Auth xác thực
5. Redirect → dashboard.html (người dùng) hoặc admin.html (admin)
```

### Trang Dashboard (dashboard.html)

**Chức năng**:
- ✅ Hiển thị thông tin người dùng
- ✅ Hiệu số khóa học đã đăng ký
- ✅ Tiến độ học tập trung bình
- ✅ Danh sách ứng dụng khả dụng
- ✅ Nút Đăng xuất
- ✅ Link đến Profile & Learning Hub

**Tính năng kỹ thuật**:
- Xử lý `onAuthStateChanged()` để bảo vệ trang
- Hiển thị dữ liệu học viên (hiện là dữ liệu mẫu)
- Tích hợp với sso.js để truy cập sub-apps

### Trang Profile (profile.html)

**Chức năng**:
- ✅ Xem/Chỉnh sửa thông tin cá nhân
- ✅ Thay đổi mật khẩu
- ✅ Cải đặt tùy chọn (Email notification, Dark mode, etc.)
- ✅ Xóa tài khoản
- ✅ Giao diện Tab-based

**Tính năng kỹ thuật**:
- Sử dụng `updatePassword()` từ Firebase Auth
- Lưu trữ tùy chọn trong localStorage
- Cảnh báo trước khi xóa tài khoản

---

## 🌐 Learning Hub (learning-materials.html)

### Cập nhật

1. **Tích hợp Firebase Auth Global**
   - Khởi tạo Firebase trong `<script type="module">`
   - Import `app.js` để set up `onAuthStateChanged()`

2. **Header/Footer Dynamic**
   - Hiển thị thông tin người dùng khi đã đăng nhập
   - Nút Đăng xuất
   - Avatar với dropdown menu (Profile, Dashboard, Logout)

3. **Mô tả Ứng dụng Chi tiết**
   - IVS English: Học tiếng Anh
   - Testing & Placement: Kiểm tra trình độ
   - IVS Kinderlink: Quản lý mầm non

4. **Các ứng dụng được nhúng qua Iframe**
   - `ivseng.web.app`
   - `testplacement.web.app`
   - `ivs-7221b.web.app`

---

## 🔑 Global Auth State Management (app.js)

### Chức năng chính

```javascript
import { onAuthStateChanged, signOut } from 'firebase/auth';

export function initializeGlobalAuthListener() {
    // Lắng nghe thay đổi trạng thái auth
    // Cập nhật UI header/footer
    // Lưu trạng thái vào localStorage
}

export function updateAuthUIGlobally(user) {
    // Hiển thị thông tin người dùng nếu đã đăng nhập
    // Hiển thị nút Đăng nhập/Đăng ký nếu chưa
    // Setup dropdown menu cho user menu
}
```

### Cách sử dụng

```javascript
// Trong mỗi trang cần tích hợp auth
import { initializeGlobalAuthListener } from './app.js';

// Khởi tạo sau khi Firebase sẵn sàng
initializeGlobalAuthListener();
```

---

## 🔗 Single Sign-On (SSO) - Custom Token Exchange

### Kiến trúc SSO

```
Main Hub (ivslearning.top)
    ↓ User clicks "Access IVS English"
    ↓ Gets user ID token
    ↓ Calls Cloud Function: createCustomToken()
    ↓ Receives custom token
    ↓ Redirects → https://ivseng.web.app?sso_token=<token>

Sub-App (ivseng.web.app)
    ↓ Receives SSO token from URL
    ↓ Parses token using handleIncomingSSOToken()
    ↓ Calls signInWithSSO(auth, ssoToken)
    ↓ User automatically signed in with same account
```

### Cloud Functions

Có 4 Cloud Functions hỗ trợ SSO:

1. **createCustomToken**
   - Tạo custom token cho user
   - Yêu cầu: `Authorization: Bearer <idToken>`
   - Trả về: `{ token, expires }`

2. **validateCustomToken**
   - Kiểm tra tính hợp lệ của token
   - Trả về: `{ uid, email, claims }`

3. **getUserProfile**
   - Lấy hồ sơ người dùng kèm custom claims
   - Trả về: `{ uid, email, displayName, customClaims }`

4. **updateUserClaims**
   - Cập nhật custom claims (admin only)
   - Yêu cầu: Admin token trong header Authorization

### SSO Helper Module (sso.js)

```javascript
// Trên Main Hub
import { redirectToApp } from './sso.js';

redirectToApp('english', currentUserIdToken, {
    email: user.email,
    role: 'student',
    organizationId: 'org-123'
});

// Trên Sub-App
import { handleIncomingSSOToken, signInWithSSO } from './sso.js';

const ssoData = handleIncomingSSOToken();
if (ssoData) {
    await signInWithSSO(auth, ssoData.token);
}
```

---

## 🚀 Deployment & Setup

### 1. Chuẩn bị Firebase Project

```bash
# Login Firebase CLI
firebase login

# Link project
firebase init
```

### 2. Deploy Cloud Functions

```bash
cd functions
npm install
firebase deploy --only functions
```

### 3. Cấu hình Authorized Domains

Trong Firebase Console → Authentication → Settings:
- ✅ `ivslearning.top`
- ✅ `ivseng.web.app`
- ✅ `testplacement.web.app`
- ✅ `ivs-7221b.web.app`
- ✅ `localhost:3000` (development)

### 4. Thiết lập CORS

Cloud Functions đã bao gồm CORS middleware. Đảm bảo:
```javascript
const cors = require('cors')({ origin: true });
```

---

## 🧪 Testing

### Test Đăng nhập Cục bộ

```bash
# Start live-server
live-server --port=3000

# Truy cập http://localhost:3000/auth.html
# Test đăng ký: email@test.com / password123
# Test đăng nhập: dùng email vừa đăng ký
```

### Test SSO Locally

```bash
# Setup emulator
firebase emulators:start --only functions

# Test createCustomToken
curl -X POST http://localhost:5001/ivs-159a7/us-central1/createCustomToken \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <yourIdToken>" \
  -d '{
    "email": "test@example.com",
    "customClaims": {"role": "student"}
  }'
```

---

## 📊 Roadmap Tiếp theo

### Phase 2 (Upcoming)

- [ ] Integrate Firestore cho lưu trữ dữ liệu người dùng
- [ ] Tạo Learning Path & Course Management
- [ ] Xây dựng Backend API cho quiz/assessment
- [ ] Mobile app (React Native)
- [ ] Notification system (Email/Push)

### Phase 3 (Future)

- [ ] AI-powered Learning Recommendations
- [ ] Video streaming integration
- [ ] Social learning features
- [ ] Advanced analytics dashboard
- [ ] API marketplace

---

## 📞 Support & Troubleshooting

### Lỗi thường gặp

**1. "Firebase not initialized"**
```
Nguyên nhân: Firebase script chưa load
Giải pháp: Đặt <script type="module"> trước content
```

**2. "CORS error on custom token endpoint"**
```
Nguyên nhân: Domain chưa authorize
Giải pháp: Thêm domain vào Authorized Domains trong Firebase Console
```

**3. "User logged in but dashboard not showing"**
```
Nguyên nhân: onAuthStateChanged chưa sẵn sàng
Giải pháp: Đợi Firebase khởi tạo xong trước khi check user state
```

**4. "SSO token not working across domains"**
```
Nguyên nhân: Domain CORS chưa configure
Giải pháp: Ensure both domains in authorized domains list
```

---

## 📚 Tài liệu Tham khảo

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
- [Firebase Custom Claims](https://firebase.google.com/docs/auth/admin-sdk-claims)
- [Web SDK Guide](https://firebase.google.com/docs/web/setup)

---

## ✅ Checklist Đã Hoàn tất

- [x] Nâng cấp Firebase v12.5.0
- [x] Tạo dashboard.html cho học viên
- [x] Tạo profile.html cho quản lý tài khoản
- [x] Implement global auth listener (app.js)
- [x] Cải thiện Learning Hub
- [x] Tạo Cloud Functions cho SSO
- [x] Tạo SSO helper module (sso.js)
- [x] Viết documentation đầy đủ
- [x] Setup local testing environment

---

**Cập nhật lần cuối**: 7 tháng 11, 2025
**Người thực hiện**: GitHub Copilot
**Status**: ✅ Ready for Production
