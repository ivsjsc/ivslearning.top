# 📍 **IVS Learning Hub - UX Flow & Navigation Guide**

## **🎯 Current Architecture Overview**

### **Main Landing Pages:**

#### **1. `index.html` - IVS Learning Hub (Trang Chủ Cổng Học Tập)**
**URL:** `https://ivslearning.top/`  
**Mục đích:** Cổng truy cập tập trung các ứng dụng học tập & dịch vụ tương tác  
**Nội dung chính:**
- ✅ Hero Section: "Chào mừng đến với IVS Learning Hub"
- ✅ Giới thiệu 3 thành phần hệ sinh thái: Giáo Dục, Công Nghệ, Tư Vấn
- ✅ Cổng ứng dụng: IVS English Learners, Testing & Placement, Kinderlink, StriveStreak, QLGX, Games & Apps
- ✅ CTA: "Yêu Cầu Phát Triển Tùy Chỉnh" → `/Pages/webdesign.html`
- ✅ Auth Status: Đăng nhập / Dashboard (Firebase)

**Thích hợp cho:** Học viên, giáo viên, người quản lý muốn truy cập nhanh các ứng dụng

---

#### **2. `live_index.html` - IVS JSC Official (Trang Giới Thiệu Công Ty)**
**URL:** `https://ivslearning.top/live_index.html`  
**Mục đích:** Trang About & Portfolio của IVS JSC  
**Nội dung chính:**
- ✅ Hero: Video nền + Giới thiệu tầm nhìn "Integrate Vision Synergy"
- ✅ Về IVS JSC: Triết lý, đội ngũ lãnh đạo
- ✅ Dịch vụ chính: Academy, Celestech, Consulting
- ✅ Các giải pháp tiêu biểu (R&D Curriculum, Teacher Training, STEAM, v.v.)
- ✅ Hệ thống trường & liên kết
- ✅ Liên hệ tuyển dụng & hợp tác

**Thích hợp cho:** Khách hàng, đối tác, nhà tuyển dụng muốn hiểu rõ về IVS JSC

---

### **Secondary Pages (Linked Pages):**

#### **3. Dashboard Pages:**
- **`auth.html`** - Login/Register (Firebase)
- **`dashboard.html`** - Bảng điều khiển cá nhân
- **`profile.html`** - Quản lý hồ sơ

#### **4. Content Pages:**
- **`learning-resources.html`** - Tài nguyên học tập
- **`learning-materials.html`** - Tài liệu & bài học
- **`analytics.html`** - Thống kê (Admin panel)

#### **5. Pages/ Subdirectory (Stub Pages - Đang Phát Triển):**
- **`Pages/webdesign.html`** - Dịch vụ thiết kế web (ACTIVE)
- **`Pages/tailieu.html`** - Tài liệu
- **`Pages/ivscelestech.html`** - Giới thiệu Celestech
- **`Pages/ivs-academy.html`** - Giới thiệu Academy
- Và 10+ pages khác (stubs)

---

## **🔄 Recommended User Journey**

### **Flow 1: Khách Hàng Đầu Tiên**
```
1. Truy cập ivslearning.top
   ↓
2. Xem index.html (Learning Hub overview)
   ↓
3. Quan tâm → Click "Yêu Cầu Phát Triển Tùy Chỉnh"
   ↓
4. Redirect → /Pages/webdesign.html (Webdesign services)
   ↓
5. Chọn gói → Contact form
```

### **Flow 2: Học Viên Đang Học**
```
1. Truy cập ivslearning.top/index.html
   ↓
2. Click "Đăng nhập" → auth.html
   ↓
3. Sau khi login → Dashboard hoặc truy cập ứng dụng trực tiếp
   ↓
4. Ứng dụng: English Learners, Testing, Kinderlink, etc.
```

### **Flow 3: Người Tìm Kiếm Thông Tin Công Ty**
```
1. Truy cập live_index.html (hoặc từ search engine)
   ↓
2. Xem giới thiệu IVS JSC → Tầm nhìn & Sứ mệnh
   ↓
3. Khám phá dịch vụ: Academy, Celestech, Consulting
   ↓
4. Interest → Contact hoặc Pages/* (Kinh doanh, Tuyển dụng)
```

---

## **⚠️ Current Issues & Fixes**

### **Problem 1: Không rõ trang chủ nào là chính**
- ❌ 2 trang index: `index.html` vs `live_index.html`
- ✅ **FIX SUGGESTED:** Set `index.html` = Primary Hub, `live_index.html` = Secondary About Page

### **Problem 2: Navigation không clear**
- ❌ Header của `index.html` chỉ link tới `live_index.html` (Giới Thiệu IVS JSC)
- ✅ **RECOMMEND:** Thêm breadcrumb hoặc context label

### **Problem 3: Mobile Menu không visible**
- ❌ Menu toggle button nhỏ, text không rõ
- ✅ **FIXED:** Thêm close button, accessibility labels

### **Problem 4: 404 Pages**
- ❌ ~14 Pages/* links chỉ tới stub files
- ✅ **FIXED:** Tạo placeholders, tất cả link functional

### **Problem 5: Empty Scripts**
- ❌ `utils.js`, `language.js` còn trống, tải mà không làm gì
- ✅ **RECOMMEND:** Implement hoặc remove

---

## **📱 Page Visibility Matrix**

| Page | Type | Status | Visible From | Purpose |
|------|------|--------|--------------|---------|
| **index.html** | Hub | ✅ Live | Direct URL / Primary | Learning Hub Central |
| **live_index.html** | About | ✅ Live | Header Link | IVS JSC Profile |
| **auth.html** | Auth | ✅ Live | Header / CTA | Login/Register |
| **dashboard.html** | User | ✅ Live | After Login | User Dashboard |
| **learning-resources.html** | Content | ✅ Live | Header Link | Resources |
| **learning-materials.html** | Content | ✅ Live | Header Link | Materials & Games |
| **analytics.html** | Admin | ✅ Live | Header Link | Admin Stats |
| **Pages/webdesign.html** | Service | ✅ Live | CTA / Manual | Webdesign Services |
| **Pages/\*.html** | Stub | ⚠️ Stub | Internal Links | Under Development |

---

## **🎨 Design Recommendations**

### **1. Hero Section (index.html) - Make it POP**
```
Current: Gray gradient background
Suggest: 
  - Add animated gradient overlay
  - Include microinteraction on hero text
  - CTA button: Add pulsing glow effect (already has btn-glow)
  - Add scroll hint: "↓ Scroll to explore"
```

### **2. Cards & Spacing**
```
Current: Good card hover effects (translateY -8px)
Suggest:
  - Add subtle shadow expansion on hover
  - Increase padding consistency across all cards
  - Add 'new' badge to StriveStreak & QLGX cards
```

### **3. Navigation Bar**
```
Current: Fixed header + mobile toggle
Suggest:
  - Add active link indicator
  - Add dropdown menu for "Ứng Dụng Học Tập"
  - Mobile: Show breadcrumb on pages/*
```

### **4. Footer**
```
Current: Minimal footer placeholder
Suggest:
  - Add quick links (Learning, Services, About, Contact)
  - Add social media links
  - Add copyright & privacy links
```

---

## **🚀 Next Steps Priority**

1. ⚡ **HIGH**: Implement real footer + links structure
2. ⚡ **HIGH**: Fill empty Pages/* with actual content or better stubs
3. 🟡 **MEDIUM**: Add mobile-friendly card carousel for apps
4. 🟡 **MEDIUM**: Implement breadcrumb navigation
5. 🔵 **LOW**: Add animations to hero (AOS already loaded)

---

**Generated:** Nov 7, 2025  
**Status:** ✅ Website Functional & Accessible
