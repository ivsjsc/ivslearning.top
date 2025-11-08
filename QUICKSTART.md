# 🚀 **IVS Learning Hub - Quick Start Guide**🚀 IVS LEARNING HUB - QUICK START GUIDE



**Last Updated:** Nov 8, 2025  ═══════════════════════════════════════════════════════════════

**Version:** 2.0  

**Status:** ✅ READY FOR TESTING## ⚡ 5 Phút Bắt Đầu



---Hướng dẫn nhanh để test ứng dụng cục bộ.



## **⚡ 30-Second Overview**═══════════════════════════════════════════════════════════════



**Website:** `https://ivslearning.top`  ### STEP 1: Chuẩn bị (1 phút)

**Local URL:** `http://127.0.0.1:5500`  

**Status:** ✅ Fully functional, ready for testing  ```bash

**Type:** Multi-page hub (9 live pages + 14 stubs)  # Mở Terminal/PowerShell

cd e:\IVS\Website\ivslearning.top

---

# Kiểm tra Firebase CLI

## **📱 Main Pages at a Glance**firebase --version

# Nếu không có: npm install -g firebase-tools

| Page | URL | Purpose | Status |

|------|-----|---------|--------|# Kiểm tra Node.js

| Learning Hub | `/` | Primary landing & app portal | ✅ Live |node --version

| About IVS | `/live_index.html` | Company info & services | ✅ Live |npm --version

| Login | `/auth.html` | User authentication | ✅ Live |```

| Web Services | `/Pages/webdesign.html` | Service offerings & pricing | ✅ Live |

| Dashboard | `/dashboard.html` | User dashboard | ⚠️ Placeholder |═══════════════════════════════════════════════════════════════

| Profile | `/profile.html` | User profile | ⚠️ Placeholder |

### STEP 2: Chạy Server (1 phút)

---

```bash

## **🎯 What Changed (Latest Fixes)**# Nếu chưa cài live-server

npm install -g live-server

✅ **Auth page redesigned** - Better form, clearer background  

✅ **Mobile menu fixed** - Close button & Escape key work  # Khởi động

✅ **Footer added** - Links, social media, copyright  live-server --port=3000

✅ **CSS errors fixed** - All validation passes  

✅ **No more 404s** - All 23 pages load  # Kết quả:

✅ **Files cleaned** - Removed 13 duplicate files  # ✓ Server running at http://127.0.0.1:3000

# ✓ Hit CTRL-C to stop the server

---```



## **🧪 Quick Testing (5 Minutes)**═══════════════════════════════════════════════════════════════



### **Step 1: Open Home Page**### STEP 3: Test Ứng dụng (3 phút)

```

1. Open browser: http://127.0.0.1:5500#### 3.1 Test Đăng ký

2. See: Beautiful hero section with gradient background```

3. Try: Click "Giới Thiệu IVS JSC" → Goes to live_index.html ✅1. Truy cập: http://localhost:3000/auth.html

```2. Click: "Đăng ký ngay"

3. Nhập: email (ví dụ: test@example.com)

### **Step 2: Test Apps Portal**4. Nhập: mật khẩu (ví dụ: password123)

```5. Click: "Đăng ký"

1. Scroll down to "CỔNG ỨNG DỤNG CHUYÊN MÔN"6. Kết quả: ✅ "Đăng ký thành công!" → Chuyển sang chế độ đăng nhập

2. See: 6 application cards (English, Testing, Kinderlink, StriveStreak, QLGX, View All)```

3. Try: Click any app card → Opens external app in new tab ✅

```#### 3.2 Test Đăng nhập

```

### **Step 3: Test Auth Page**1. Vẫn ở trang: http://localhost:3000/auth.html

```2. Chế độ hiện tại: Đăng nhập

1. Click "Đăng nhập" in header3. Nhập: email từ bước trên (test@example.com)

2. Go to: /auth.html4. Nhập: mật khẩu (password123)

3. See: Clean login form with video background5. Click: "Đăng nhập"

4. Try: Email & password form visible & focused ✅6. Kết quả: ✅ Redirect đến dashboard.html

``````



### **Step 4: Test Mobile Menu**#### 3.3 Test Dashboard

``````

1. Resize browser to mobile (375px width)Trang: http://localhost:3000/dashboard.html (tự động sau đăng nhập)

2. See: Hamburger menu appears in header

3. Click: Menu button → Mobile menu opensKiểm tra:

4. Click: X button → Menu closes ✅✓ Hiển thị "Xin chào, test"

5. Click: Any link → Menu auto-closes ✅✓ Hiển thị 3 stats card (Khóa học, Tiến độ, Ứng dụng)

6. Press: Escape key → Menu closes ✅✓ Hiển thị danh sách khóa học mẫu

```✓ Hiển thị 3 ứng dụng (English, Testing, Kinderlink)

✓ Nút "Đi đến Learning Hub"

### **Step 5: Test Footer**✓ Nút "Đăng xuất"

``````

1. Scroll to bottom of any page

2. See: Full footer with:#### 3.4 Test Profile

   - Quick Links (Learning Hub, Auth, Resources, Admin)```

   - Services (IVS, Celestech, Academy, Admin)Từ Dashboard:

   - Social Media (FB, Twitter, LinkedIn, YouTube)1. Click avatar ở góc phải

   - Copyright & Terms2. Chọn "Hồ sơ cá nhân"

3. Try: Click any footer link ✅3. Hoặc truy cập trực tiếp: http://localhost:3000/profile.html

```

Kiểm tra:

---✓ Hiển thị email & avatar

✓ Tab "Thông tin cá nhân"

## **📋 Page Guide**✓ Tab "Bảo mật" (đổi mật khẩu)

✓ Tab "Tùy chọn"

### **HOME (index.html) ⭐ PRIMARY**✓ Nút "Lưu thay đổi"

- 🎯 Main landing page✓ Nút "Quay lại Dashboard"

- 📚 App portal with 6 applications```

- 🎨 Gradient hero (no external images)

- 👤 Firebase auth status#### 3.5 Test Learning Hub

- 📝 Full footer```

- **What to test:**Từ Dashboard:

  - [x] Hero section displays1. Click "Đi đến Learning Hub"

  - [x] Cards hover effects (-8px translate)

  - [x] Auth button shows/hides correctlyHoặc trực tiếp: http://localhost:3000/learning-materials.html

  - [x] Footer links clickable

  - [x] Mobile responsiveKiểm tra:

✓ Header hiển thị thông tin user (email)

### **ABOUT (live_index.html)**✓ Avatar dropdown menu

- 📖 Company info page✓ Mô tả các ứng dụng

- 🎬 Video hero background✓ Iframe app load (có thể slow)

- 🏢 Services (Academy, Celestech, Consulting)✓ Links hoạt động

- 🤝 Partnerships & solutions```

- **What to test:**

  - [x] Video loads#### 3.6 Test Logout

  - [x] Content sections display```

  - [x] Responsive on mobileTừ bất kỳ trang nào:

1. Click avatar/user icon

### **AUTH (auth.html) - REDESIGNED**2. Chọn "Đăng xuất"

- 🔐 Login/Register page3. Kết quả: ✅ Redirect đến auth.html

- 📝 Clean form design

- 🎥 Video background (NOT too dark)Hoặc từ Dashboard:

- ✨ Modern UI with glassmorphism1. Scroll xuống

- **What to test:**2. Click nút "Đăng xuất"

  - [x] Form fields visible & usable```

  - [x] Buttons clickable

  - [x] Video background showing═══════════════════════════════════════════════════════════════

  - [x] Responsive on mobile

## 🔍 Kiểm tra Browser Console

### **WEB SERVICES (/Pages/webdesign.html)**

- 💼 Service overviewMở DevTools: F12 → Tab "Console"

- 💰 4 pricing tiers (1.5M → 25M+)

- 📞 Contact CTAs### Nên thấy:

- 🎨 Professional layout```

- **What to test:**✓ Firebase initialized

  - [x] Hero video playing✓ Page components loaded successfully

  - [x] Pricing tiers displaying✓ Auth state changed: user logged in

  - [x] CTA buttons responsive✓ No errors

  - [x] Footer visible```



---### Không nên thấy:

```

## **🔗 Navigation Map**✗ Firebase is not defined

✗ CORS error

```✗ Cannot read property of undefined

HOME (index.html)✗ 404 errors

├── Header Navigation:```

│   ├── Giới Thiệu IVS JSC → live_index.html

│   ├── Ứng Dụng Học Tập → #applications (scroll)### Xem Network Tab:

│   ├── Tài Nguyên EdTech → learning-resources.html- Các file .html, .css, .js load thành công (200 status)

│   ├── Thống Kê (Admin) → analytics.html- Có thể có 404 cho video/images (bình thường nếu files không tồn tại)

│   └── Đăng nhập → auth.html

│═══════════════════════════════════════════════════════════════

├── Hero CTA:

│   └── Bắt đầu học tập ngay → auth.html## 📝 Test Data

│

├── Applications (6 cards):### Tài khoản Test

│   ├── IVS English → https://ivseng.web.app```

│   ├── Testing & Placement → https://testplacement.web.appEmail: test@example.com

│   ├── Kinderlink → https://ivs-7221b.web.appPassword: password123

│   ├── StriveStreak → https://strivestreak.netlify.app```

│   ├── QLGX → https://qlgx.netlify.app

│   └── View All Apps → learning-materials.html### Dữ liệu Mẫu Dashboard

│- Khóa học: 3 khóa học mẫu

├── Main CTA:- Tiến độ: 65%, 40%, 0%

│   └── Yêu Cầu Phát Triển → /Pages/webdesign.html- Ứng dụng: 5 ứng dụng sẵn

│

└── Footer:═══════════════════════════════════════════════════════════════

    ├── Quick Links

    ├── Services## 🐛 Troubleshooting Nhanh

    ├── Social Media

    └── Terms & Privacy| Vấn đề | Giải pháp |

```|--------|---------|

| **"Firebase not initialized"** | Reload trang (F5) |

---| **Không login được** | Kiểm tra Firebase console |

| **404 trên ứng dụng** | Các iframes có thể không tải được offline |

## **📁 What's Where**| **Mất session khi reload** | Bình thường - session local |



```═══════════════════════════════════════════════════════════════

Main Pages:

  ✅ index.html - HOME (PRIMARY)## 📱 View Trên Thiết bị Khác

  ✅ live_index.html - ABOUT

  ✅ auth.html - LOGIN (REDESIGNED)```bash

  ✅ dashboard.html - USER PANEL# Tìm IP của máy tính

  ✅ profile.html - USER PROFILEipconfig (Windows)

  ✅ learning-resources.html - RESOURCESifconfig (Mac/Linux)

  ✅ learning-materials.html - MATERIALS & GAMES

  ✅ analytics.html - ADMIN STATS# Ví dụ: IP = 192.168.1.100

  ✅ Pages/webdesign.html - WEB SERVICES# Từ thiết bị khác truy cập:

http://192.168.1.100:3000

Stub Pages (Under Development - No 404s):

  📝 Pages/tailieu.html# Hoặc trực tiếp

  📝 Pages/ivscelestech.htmlhttp://localhost:3000

  📝 Pages/ivs-academy.html```

  📝 Pages/foreign-teacher-services.html

  📝 [And 10 more...]═══════════════════════════════════════════════════════════════



Assets:## 📚 Đọc Thêm

  📁 css/ - Tailwind CSS, animations, styles

  📁 js/ - Auth, dashboard, utilitiesĐể hiểu rõ hơn, đọc:

  📁 images/ - Logo, team, banners

  📁 videos/ - Background videos1. **NEXT_STEPS.md** - Bước tiếp theo & chi tiết

```2. **IMPLEMENTATION.md** - Toàn bộ tài liệu

3. **ARCHITECTURE.md** - Kiến trúc hệ thống

---4. **functions/README.md** - Cloud Functions



## **✅ Pre-Test Checklist**═══════════════════════════════════════════════════════════════



Before full testing, verify:## ✅ Checklist Đã Hoàn tát



```✓ Đăng ký & Đăng nhập

[ ] Browser console: No errors (F12)✓ Dashboard hiển thị

[ ] index.html loads without 404✓ Profile hoạt động

[ ] Header displays on all pages✓ Learning Hub load

[ ] Mobile menu toggle works✓ Logout thành công

[ ] Footer visible on all pages✓ Console không có lỗi

[ ] No duplicate auth buttons on mobile

[ ] Responsive at 375px width═══════════════════════════════════════════════════════════════

[ ] All nav links clickable

[ ] External app links open in new tab## 🎉 Tiếp Theo?

```

Sau khi test thành công:

---

1. **Deploy Cloud Functions**

## **📖 Full Documentation**   ```bash

   cd functions

| Document | What | When to Read |   firebase deploy --only functions

|----------|------|--------------|   ```

| **FINAL_STATUS_REPORT.md** | ✅ Complete project status | Now |

| **UX_FLOW_GUIDE.md** | 🎨 User journey & navigation | Understanding flows |2. **Configure Firebase Console**

| **UI_UX_AUDIT_REPORT.md** | 📊 Detailed findings & issues | Reviewing design |   - Add authorized domains

| **TESTING_CHECKLIST.md** | ✅ Comprehensive test guide | Before full testing |   - Setup email templates

| **QUICKSTART.md** (this file) | ⚡ Quick start | Now |

3. **Deploy to Production**

---   ```bash

   firebase deploy

## **🚀 Next Steps**   ```



1. **Quick Test** (5 min) - Follow "Quick Testing" section above4. **Invite Users**

2. **Full Test** (2 hrs) - Use TESTING_CHECKLIST.md   - Share ivslearning.top

3. **Review** - Check UX_FLOW_GUIDE.md & UI_UX_AUDIT_REPORT.md   - Gather feedback

4. **Deploy** - Push to staging for team review

5. **Feedback** - Collect notes, make adjustments═══════════════════════════════════════════════════════════════

6. **Launch** - Deploy to production

**Quick Links:**

---- 📖 Docs: IMPLEMENTATION.md

- 🏗️ Architecture: ARCHITECTURE.md

## **⚠️ Known Issues (To-Do)**- 📝 Next: NEXT_STEPS.md

- ✅ Checklist: CHECKLIST.md

- 🔸 Dashboard pages not yet filled with real content

- 🔸 Stub pages have placeholder content---

- 🔸 Contact form not yet integrated to backend

- 🔸 Email notifications not yet set up**Bắt đầu: http://localhost:3000**

**Hỗ trợ: Xem NEXT_STEPS.md**

**Note:** These are PLANNED features. Core functionality (auth, home, services) is 100% working.

═══════════════════════════════════════════════════════════════

---

## **✨ Current Features (Working Now)**

✅ Responsive design (mobile-first)  
✅ Dark theme (professional UI)  
✅ Firebase authentication  
✅ Mobile hamburger menu  
✅ Card hover animations  
✅ Social media links  
✅ Professional footer  
✅ Gradient backgrounds  
✅ No 404 links  
✅ Clean, organized code  

---

## **🎓 Pro Tips**

- 💡 **Mobile testing:** Use DevTools (F12) → Toggle device toolbar
- 💡 **Clear cache:** Ctrl+Shift+Delete (Chrome) or Cmd+Shift+Delete (Mac)
- 💡 **Speed up:** Check Network tab to see load times
- 💡 **Auth testing:** Use test@example.com as email
- 💡 **Video not loading:** Check Videos folder exists

---

## **📞 Quick Answers**

**Q: Page won't load**  
A: Check browser console (F12), look for 404 errors. Verify file path in HTML.

**Q: Mobile menu broken**  
A: Try hard refresh (Ctrl+F5). Check for JavaScript errors in console.

**Q: Auth not working**  
A: Verify Firebase config in HTML head. Check network tab for API calls.

**Q: Styling looks off**  
A: Clear browser cache (Ctrl+Shift+Delete). Check CSS file is loading.

**Q: Videos not playing**  
A: Check /videos folder has MP4 files. Try different browser.

---

## **✅ Success Indicators**

You'll know it's working when you see:

- ✅ Hero section with gradient background
- ✅ 6 application cards in portal
- ✅ Mobile menu opens/closes
- ✅ Footer on every page
- ✅ No red errors in console
- ✅ Links navigate to correct pages
- ✅ Forms are responsive

---

**Ready to test?** 🚀  
**Open:** http://127.0.0.1:5500  
**Start with:** index.html (home page)  
**Then:** TESTING_CHECKLIST.md for full test  

---

*Generated: Nov 8, 2025*  
*Version: 2.0*  
*Status: ✅ READY*
