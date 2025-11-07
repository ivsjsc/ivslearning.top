🚀 IVS LEARNING HUB - QUICK START GUIDE

═══════════════════════════════════════════════════════════════

## ⚡ 5 Phút Bắt Đầu

Hướng dẫn nhanh để test ứng dụng cục bộ.

═══════════════════════════════════════════════════════════════

### STEP 1: Chuẩn bị (1 phút)

```bash
# Mở Terminal/PowerShell
cd e:\IVS\Website\ivslearning.top

# Kiểm tra Firebase CLI
firebase --version
# Nếu không có: npm install -g firebase-tools

# Kiểm tra Node.js
node --version
npm --version
```

═══════════════════════════════════════════════════════════════

### STEP 2: Chạy Server (1 phút)

```bash
# Nếu chưa cài live-server
npm install -g live-server

# Khởi động
live-server --port=3000

# Kết quả:
# ✓ Server running at http://127.0.0.1:3000
# ✓ Hit CTRL-C to stop the server
```

═══════════════════════════════════════════════════════════════

### STEP 3: Test Ứng dụng (3 phút)

#### 3.1 Test Đăng ký
```
1. Truy cập: http://localhost:3000/auth.html
2. Click: "Đăng ký ngay"
3. Nhập: email (ví dụ: test@example.com)
4. Nhập: mật khẩu (ví dụ: password123)
5. Click: "Đăng ký"
6. Kết quả: ✅ "Đăng ký thành công!" → Chuyển sang chế độ đăng nhập
```

#### 3.2 Test Đăng nhập
```
1. Vẫn ở trang: http://localhost:3000/auth.html
2. Chế độ hiện tại: Đăng nhập
3. Nhập: email từ bước trên (test@example.com)
4. Nhập: mật khẩu (password123)
5. Click: "Đăng nhập"
6. Kết quả: ✅ Redirect đến dashboard.html
```

#### 3.3 Test Dashboard
```
Trang: http://localhost:3000/dashboard.html (tự động sau đăng nhập)

Kiểm tra:
✓ Hiển thị "Xin chào, test"
✓ Hiển thị 3 stats card (Khóa học, Tiến độ, Ứng dụng)
✓ Hiển thị danh sách khóa học mẫu
✓ Hiển thị 3 ứng dụng (English, Testing, Kinderlink)
✓ Nút "Đi đến Learning Hub"
✓ Nút "Đăng xuất"
```

#### 3.4 Test Profile
```
Từ Dashboard:
1. Click avatar ở góc phải
2. Chọn "Hồ sơ cá nhân"
3. Hoặc truy cập trực tiếp: http://localhost:3000/profile.html

Kiểm tra:
✓ Hiển thị email & avatar
✓ Tab "Thông tin cá nhân"
✓ Tab "Bảo mật" (đổi mật khẩu)
✓ Tab "Tùy chọn"
✓ Nút "Lưu thay đổi"
✓ Nút "Quay lại Dashboard"
```

#### 3.5 Test Learning Hub
```
Từ Dashboard:
1. Click "Đi đến Learning Hub"

Hoặc trực tiếp: http://localhost:3000/learning-materials.html

Kiểm tra:
✓ Header hiển thị thông tin user (email)
✓ Avatar dropdown menu
✓ Mô tả các ứng dụng
✓ Iframe app load (có thể slow)
✓ Links hoạt động
```

#### 3.6 Test Logout
```
Từ bất kỳ trang nào:
1. Click avatar/user icon
2. Chọn "Đăng xuất"
3. Kết quả: ✅ Redirect đến auth.html

Hoặc từ Dashboard:
1. Scroll xuống
2. Click nút "Đăng xuất"
```

═══════════════════════════════════════════════════════════════

## 🔍 Kiểm tra Browser Console

Mở DevTools: F12 → Tab "Console"

### Nên thấy:
```
✓ Firebase initialized
✓ Page components loaded successfully
✓ Auth state changed: user logged in
✓ No errors
```

### Không nên thấy:
```
✗ Firebase is not defined
✗ CORS error
✗ Cannot read property of undefined
✗ 404 errors
```

### Xem Network Tab:
- Các file .html, .css, .js load thành công (200 status)
- Có thể có 404 cho video/images (bình thường nếu files không tồn tại)

═══════════════════════════════════════════════════════════════

## 📝 Test Data

### Tài khoản Test
```
Email: test@example.com
Password: password123
```

### Dữ liệu Mẫu Dashboard
- Khóa học: 3 khóa học mẫu
- Tiến độ: 65%, 40%, 0%
- Ứng dụng: 5 ứng dụng sẵn

═══════════════════════════════════════════════════════════════

## 🐛 Troubleshooting Nhanh

| Vấn đề | Giải pháp |
|--------|---------|
| **"Firebase not initialized"** | Reload trang (F5) |
| **Không login được** | Kiểm tra Firebase console |
| **404 trên ứng dụng** | Các iframes có thể không tải được offline |
| **Mất session khi reload** | Bình thường - session local |

═══════════════════════════════════════════════════════════════

## 📱 View Trên Thiết bị Khác

```bash
# Tìm IP của máy tính
ipconfig (Windows)
ifconfig (Mac/Linux)

# Ví dụ: IP = 192.168.1.100
# Từ thiết bị khác truy cập:
http://192.168.1.100:3000

# Hoặc trực tiếp
http://localhost:3000
```

═══════════════════════════════════════════════════════════════

## 📚 Đọc Thêm

Để hiểu rõ hơn, đọc:

1. **NEXT_STEPS.md** - Bước tiếp theo & chi tiết
2. **IMPLEMENTATION.md** - Toàn bộ tài liệu
3. **ARCHITECTURE.md** - Kiến trúc hệ thống
4. **functions/README.md** - Cloud Functions

═══════════════════════════════════════════════════════════════

## ✅ Checklist Đã Hoàn tát

✓ Đăng ký & Đăng nhập
✓ Dashboard hiển thị
✓ Profile hoạt động
✓ Learning Hub load
✓ Logout thành công
✓ Console không có lỗi

═══════════════════════════════════════════════════════════════

## 🎉 Tiếp Theo?

Sau khi test thành công:

1. **Deploy Cloud Functions**
   ```bash
   cd functions
   firebase deploy --only functions
   ```

2. **Configure Firebase Console**
   - Add authorized domains
   - Setup email templates

3. **Deploy to Production**
   ```bash
   firebase deploy
   ```

4. **Invite Users**
   - Share ivslearning.top
   - Gather feedback

═══════════════════════════════════════════════════════════════

**Quick Links:**
- 📖 Docs: IMPLEMENTATION.md
- 🏗️ Architecture: ARCHITECTURE.md
- 📝 Next: NEXT_STEPS.md
- ✅ Checklist: CHECKLIST.md

---

**Bắt đầu: http://localhost:3000**
**Hỗ trợ: Xem NEXT_STEPS.md**

═══════════════════════════════════════════════════════════════
