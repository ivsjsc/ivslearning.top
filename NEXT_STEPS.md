# 🎯 Hướng dẫn Tiếp tục - IVS Learning Hub

## 📌 Tình trạng hiện tại

Tất cả các component chính đã được tích hợp thành công:

✅ **Firebase Authentication** (v12.5.0)
✅ **Dashboard Học viên** - `/dashboard.html`
✅ **Trang Profile** - `/profile.html`  
✅ **Global Auth State** - `js/app.js`
✅ **Learning Hub** - `/learning-materials.html` (cập nhật)
✅ **Cloud Functions** - `/functions/` (sẵn sàng deploy)
✅ **SSO Helper** - `js/sso.js`
✅ **Local Testing** - `live-server` chạy tại `http://localhost:3000`

---

## 🔧 Các Bước Cần Thực Hiện

### 1️⃣ **Deploy Cloud Functions** (Ưu tiên cao)

```bash
cd functions
npm install
firebase deploy --only functions
```

**Kết quả kỳ vọng**: 
- 4 Cloud Functions được deploy
- URLs: `https://us-central1-ivs-159a7.cloudfunctions.net/createCustomToken` (và các hàm khác)

---

### 2️⃣ **Cấu hình Authorized Domains** (Firebase Console)

1. Vào https://console.firebase.google.com
2. Chọn project `ivs-159a7`
3. Vào **Authentication** → **Settings** → **Authorized Domains**
4. Thêm các domain:
   - ✅ `ivslearning.top`
   - ✅ `ivseng.web.app`
   - ✅ `testplacement.web.app`
   - ✅ `ivs-7221b.web.app`
   - ✅ `localhost:3000` (dev)

---

### 3️⃣ **Test Đăng nhập & Dashboard Cục bộ**

**Lệnh**:
```bash
# Đã chạy sẵn tại port 3000
http://localhost:3000/auth.html
```

**Các test case**:
- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập với tài khoản vừa tạo
- [ ] Kiểm tra redirect đến dashboard.html
- [ ] Xem thông tin người dùng trên dashboard
- [ ] Truy cập profile.html
- [ ] Test thay đổi mật khẩu
- [ ] Test đăng xuất

---

### 4️⃣ **Kiểm tra Learning Hub**

```
http://localhost:3000/learning-materials.html
```

**Các kiểm tra**:
- [ ] Header hiển thị đúng khi chưa đăng nhập (Đăng nhập / Đăng ký)
- [ ] Header hiển thị email khi đã đăng nhập
- [ ] Avatar dropdown menu hoạt động
- [ ] Button đăng xuất hoạt động
- [ ] Các ứng dụng (iframes) load đúng

---

### 5️⃣ **Cập nhật Sub-Applications** (Quan trọng)

Để SSO hoạt động, các sub-app cần nhận và xử lý SSO token:

**File cần cập nhật trên mỗi sub-app**:

`src/main.js` hoặc `src/App.js`:
```javascript
import { handleIncomingSSOToken, signInWithSSO } from './sso.js';

// On app initialization
const ssoData = handleIncomingSSOToken();
if (ssoData) {
    try {
        await signInWithSSO(auth, ssoData.token);
        console.log('Signed in via SSO:', ssoData.userData);
    } catch (error) {
        console.error('SSO sign-in failed:', error);
        // Fallback: redirect to main hub
        window.location.href = 'https://ivslearning.top/auth.html';
    }
} else {
    // No SSO token - check local auth or redirect
    if (!currentUser) {
        window.location.href = 'https://ivslearning.top/auth.html';
    }
}
```

---

### 6️⃣ **Tích hợp Dashboard Links**

Trong `dashboard.html`, cập nhật các button để sử dụng SSO:

```javascript
// Trong js/dashboard.js, thêm:
import { redirectToApp } from './sso.js';

document.querySelectorAll('[data-app]').forEach(btn => {
    btn.addEventListener('click', async () => {
        const appId = btn.getAttribute('data-app');
        try {
            const token = await auth.currentUser.getIdToken();
            await redirectToApp(appId, token, {
                email: auth.currentUser.email,
                role: 'student'
            });
        } catch (error) {
            console.error('Error accessing app:', error);
        }
    });
});
```

---

### 7️⃣ **Triển khai Production** (Khi sẵn sàng)

```bash
# Build & deploy main site
firebase deploy

# Deploy các trang tĩnh
firebase hosting:channel:deploy main

# Verify
firebase hosting:channel:list
```

---

## 🧪 Checklist Test Toàn diện

### Authentication Flow
- [ ] Đăng ký → Tạo tài khoản thành công
- [ ] Đăng nhập → Redirect dashboard.html
- [ ] Đăng xuất → Redirect auth.html
- [ ] Forgot password → Email gửi đi

### Dashboard
- [ ] Hiển thị tên người dùng đúng
- [ ] Hiển thị số khóa học
- [ ] Hiển thị tiến độ trung bình
- [ ] Nút "Đi đến Learning Hub" hoạt động
- [ ] Dropdown menu user hoạt động

### Profile
- [ ] Tab Info hiển thị thông tin
- [ ] Edit mode hoạt động
- [ ] Save profile hoạt động
- [ ] Change password hoạt động
- [ ] Preferences lưu được

### Learning Hub
- [ ] Auth UI hiển thị đúng (logged in/out)
- [ ] User menu dropdown hoạt động
- [ ] Iframes load (có thể slow do origin khác)

### SSO (khi sub-apps cập nhật)
- [ ] Click app link → SSO token generated
- [ ] Redirect → Sub-app with token
- [ ] Sub-app signs in user tự động
- [ ] User có thể truy cập sub-app resources

---

## 📊 Các File Mới/Đã Cập nhật

| File | Loại | Mục đích |
|------|------|---------|
| `dashboard.html` | NEW | Dashboard cho học viên |
| `profile.html` | NEW | Quản lý hồ sơ cá nhân |
| `js/dashboard.js` | NEW | Logic dashboard |
| `js/profile.js` | NEW | Logic profile |
| `js/app.js` | NEW | Global auth listener |
| `js/sso.js` | NEW | SSO helper module |
| `functions/` | NEW | Cloud Functions |
| `auth.html` | UPDATED | Nâng cấp Firebase v12.5.0 |
| `js/auth.js` | UPDATED | Redirect → dashboard |
| `learning-materials.html` | UPDATED | Tích hợp Firebase & auth UI |

---

## 🚨 Các Vấn đề Cần Lưu Ý

1. **CORS Domain**
   - Sub-apps phải ở domain khác hoặc subdomain
   - Cần authorize tất cả domains trong Firebase

2. **Token Expiration**
   - SSO tokens hết hạn sau 1 giờ
   - Cần refresh logic nếu session dài

3. **Firestore Integration** (Chưa làm)
   - Hiện dùng dữ liệu mẫu cho courses
   - Cần tích hợp Firestore để lưu dữ liệu thực

4. **Environment Variables**
   - Firebase config đang hard-code (public key OK)
   - Cloud Functions sensitive data nên dùng environment variables

---

## 📞 Hỗ Trợ & Liên hệ

Nếu có vấn đề:

1. Kiểm tra **console browser** (F12 → Console)
2. Xem **Firebase logs**: `firebase functions:log`
3. Kiểm tra **Network tab** cho CORS errors
4. Verify **Authorized Domains** trong Firebase Console

---

## 🎓 Tài liệu Tham khảo

- **IMPLEMENTATION.md** - Tài liệu triển khai chi tiết
- **functions/README.md** - Hướng dẫn Cloud Functions
- **Firebase Docs** - https://firebase.google.com/docs

---

**Last Updated**: 7 Nov 2025
**Status**: Ready for Testing & Deployment
