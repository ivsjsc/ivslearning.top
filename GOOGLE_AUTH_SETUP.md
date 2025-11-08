# Hướng Dẫn Cấu Hình Google Authentication

## 📋 Tổng Quan
File `auth.html` đã được cập nhật với Google Sign-In và Facebook Sign-In. Để hoạt động đầy đủ, bạn cần cấu hình Firebase Console.

---

## 🔧 Các Bước Cấu Hình

### 1. **Kích Hoạt Google Sign-In trong Firebase Console**

#### Bước 1: Truy cập Firebase Console
- Đi đến: https://console.firebase.google.com
- Chọn dự án: **ivs-159a7**
- Vào mục **Authentication** (Xác thực)

#### Bước 2: Kích Hoạt Google Provider
1. Click tab **Sign-in method** (Phương thức đăng nhập)
2. Tìm **Google** trong danh sách
3. Click **Enable** (Bật)
4. Chọn email hỗ trợ (mặc định là email dự án)
5. Click **Save** (Lưu)

#### Bước 3: Cấu Hình Authorized Domains
1. Vẫn ở trang Authentication
2. Tìm **Authorized domains** (Tên miền được phép)
3. Thêm các domain:
   - `ivslearning.top`
   - `localhost` (để test cục bộ)
   - `127.0.0.1`

---

### 2. **Kích Hoạt Facebook Sign-In**

#### Bước 1: Tạo Facebook App (nếu chưa có)
- Truy cập: https://developers.facebook.com/apps
- Click **My Apps** → **Create App**
- Chọn loại: **Consumer**
- Điền tên app và email

#### Bước 2: Lấy Facebook App ID & Secret
- Vào Settings → Basic
- Copy **App ID** và **App Secret**

#### Bước 3: Kích Hoạt Facebook trong Firebase
1. Firebase Console → **Authentication** → **Sign-in method**
2. Tìm **Facebook**
3. Click **Enable** (Bật)
4. Dán **App ID** và **App Secret** từ Facebook App
5. Copy **OAuth Redirect URI** từ Firebase
6. Trong Facebook App → Settings → Basic, thêm Platform:
   - Platform: **Website**
   - Site URL: `https://ivslearning.top`

---

### 3. **Xác Minh Cấu Hình Firebase**

Firebase Config hiện tại (`js/firebase-config.js`):
```javascript
export const firebaseConfig = {
    apiKey: "AIzaSyAOxCF0PhA6s3DtvETux-kXGTXRTlpL4vs",
    authDomain: "ivs-159a7.firebaseapp.com",
    projectId: "ivs-159a7",
    storageBucket: "ivs-159a7.firebasestorage.app",
    messagingSenderId: "452959273724",
    appId: "1:452959273724:web:17a23e383fb1807c040d79",
    measurementId: "G-L4KG7BCTJE"
};
```

**Kiểm tra:**
- ✅ `apiKey`: Khóa API Web
- ✅ `authDomain`: Miền Firebase (ivs-159a7.firebaseapp.com)
- ✅ `projectId`: ID dự án (ivs-159a7)

---

## 🔐 Tính Năng Google Auth đã Thêm

### UI Components
- ✅ **Google Sign-In Button** - Nút đăng nhập bằng Google
- ✅ **Facebook Sign-In Button** - Nút đăng nhập bằng Facebook
- ✅ **Divider** - Ngăn cách giữa OAuth và Email/Password
- ✅ **Responsive Design** - Tối ưu mobile & desktop

### JavaScript Handlers
- ✅ **Google Pop-up Authentication** - Popup đăng nhập Google
- ✅ **Facebook Pop-up Authentication** - Popup đăng nhập Facebook
- ✅ **Error Handling** - Xử lý lỗi popup, domain, unauthorized
- ✅ **Auto Redirect** - Tự động chuyển hướng sau đăng nhập thành công

### Styling
- ✅ **Modern UI** - Thiết kế hiện đại theo tham khảo Facebook/LinkedIn
- ✅ **Hover Effects** - Hiệu ứng hover trên nút
- ✅ **Loading States** - Spinner khi đang xử lý
- ✅ **Error Messages** - Hiển thị lỗi chi tiết

---

## 🧪 Test Cục Bộ

### 1. Test với Email/Password
```
Email: test@example.com
Password: Test@1234 (tối thiểu 6 ký tự)
```

### 2. Test Google Sign-In
- Click nút "Google"
- Popup sẽ xuất hiện
- Chọn tài khoản Google
- Sẽ chuyển hướng đến dashboard.html

### 3. Test Facebook Sign-In
- Click nút "Facebook"
- Popup sẽ xuất hiện
- Chọn tài khoản Facebook
- Sẽ chuyển hướng đến dashboard.html

---

## ⚠️ Xử Lý Lỗi Thường Gặp

### Lỗi 1: "Unauthorized domain"
**Nguyên nhân**: Domain không được phép trong Firebase
**Giải pháp**: 
- Thêm domain vào **Authorized domains** trong Firebase Console
- Thêm cả `localhost` và `127.0.0.1` để test cục bộ

### Lỗi 2: "Popup blocked"
**Nguyên nhân**: Trình duyệt chặn popup
**Giải pháp**: 
- Cho phép popup cho domain này
- Dùng event click trực tiếp (không dùng async delay trước khi mở popup)

### Lỗi 3: "The OAuth client was not found"
**Nguyên nhân**: Facebook App chưa được cấu hình đúng
**Giải pháp**: 
- Kiểm tra App ID, Secret đúng
- Kiểm tra OAuth Redirect URI đúng trong Facebook App Settings

---

## 📱 Responsive Design

### Header & Footer
- ✅ Các component header/footer đã tách riêng
- ✅ Hamburger menu hoạt động trên mobile
- ✅ Logo + "Learning Hub" hiển thị đúng

### Auth Form
- ✅ Google/Facebook buttons responsive
- ✅ Email/Password form responsive
- ✅ Bottom navigation fixed trên mobile

---

## 🚀 Tệp Đã Cập Nhật

1. **`auth.html`** - Thêm Google/Facebook buttons + styling + JavaScript
2. **`firebase-config.js`** - Không cần thay đổi (đã có đủ config)

---

## ✅ Checklist Triển Khai

- [ ] Kích hoạt Google Provider trong Firebase Console
- [ ] Thêm authorized domains
- [ ] Kích hoạt Facebook Provider (nếu cần)
- [ ] Lấy Facebook App ID & Secret
- [ ] Test Google Sign-In trên localhost
- [ ] Test Google Sign-In trên domain thực
- [ ] Test Facebook Sign-In (nếu enabled)
- [ ] Kiểm tra redirect đến dashboard.html
- [ ] Kiểm tra lỗi handling

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra Console (F12 → Console tab)
2. Xem error message chi tiết
3. Kiểm tra Firebase Console settings
4. Xác nhận authorized domains
