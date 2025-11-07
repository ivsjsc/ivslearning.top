# 🚀 IVS Learning Hub Portal - Chiến Lược Phát Triển Chi Tiết

**Version:** 2.0 (Portal-Centric Architecture)  
**Date:** 7 November 2025  
**Status:** Ready for Implementation  

---

## 📖 MỤC LỤC

1. [Tổng Quan Kiến Trúc](#tổng-quan-kiến-trúc)
2. [3 Trang Chính](#3-trang-chính)
3. [Hệ Thống SSO & Tài Khoản](#hệ-thống-sso--tài-khoản)
4. [Chi Tiết Thiết Kế Giao Diện](#chi-tiết-thiết-kế-giao-diện)
5. [Bộ Ứng Dụng Con Hiện Tại](#bộ-ứng-dụng-con-hiện-tại)
6. [Kế Hoạch Phát Triển](#kế-hoạch-phát-triển)

---

## 🏗️ Tổng Quan Kiến Trúc {#tổng-quan-kiến-trúc}

### Mô Hình Hub-and-Spoke

```
┌─────────────────────────────────────────────────────────────┐
│                   IVS LEARNING HUB                          │
│                  (ivslearning.top)                          │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Portal Trung Tâm (Central Hub)                         │ │
│  │ • Xác thực người dùng (Firebase Auth)                  │ │
│  │ • Quản lý tài khoản chính                              │ │
│  │ • Hiển thị tài nguyên & ứng dụng                       │ │
│  │ • SSO Token Management                                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
           │                    │                    │
      ┌────▼────┐         ┌────▼────┐         ┌────▼────┐
      │ App 1   │         │ App 2   │         │ App N   │
      │ELearners│         │Testing& │         │Future   │
      │ivseng   │         │Placement│         │Apps     │
      └─────────┘         └─────────┘         └─────────┘
   (ivseng.web.app)  (testplacement.web.app)   (...)

┌─────────────────────────────────────────────────────────────┐
│              BACKEND SERVICES (Cloud Functions)             │
│ • SSO Token Generation                                      │
│ • User Profile Management                                   │
│ • App Access Control                                        │
│ • Analytics & Logging                                       │
└─────────────────────────────────────────────────────────────┘
```

### User Journey

```
1. User Access ivslearning.top
   ├─ If Not Authenticated
   │  └─► Landing Page (Nội dung về học tập)
   │      └─► Click "Đăng Ký / Đăng Nhập"
   │          └─► Firebase Auth Page (auth.html)
   │              └─► Post-Login Redirect: Dashboard
   │
   └─ If Authenticated
      └─► Auto-Redirect: Dashboard
          ├─ View My Courses
          ├─ View Available Apps
          │  └─► Click "Truy cập ELearners"
          │      └─► Generate SSO Token
          │          └─► Redirect: ivseng.web.app?sso_token=xxx
          │              └─ ivseng receives token
          │                 └─ Auto-login user
          │
          ├─ View Learning Resources
          └─ Manage Profile & Settings
```

---

## 📄 3 Trang Chính {#3-trang-chính}

### Trang 1: Landing Page (Index)
**URL:** `ivslearning.top/index.html` hoặc `/`  
**Khán giả:** Tất cả người dùng (authenticated & unauthenticated)  
**Mục đích:** Giới thiệu, kiếm credibility, CTA đăng ký

#### 📱 Bố Cục:

```
┌─────────────────────────────────────────────────────┐
│ HEADER (Fixed)                                      │
│ Logo │ Nav │ Auth Button                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌──── HERO SECTION ────────────────────────────┐  │
│ │ Title: "IVS Learning Hub"                    │  │
│ │ Subtitle: "Cổng vào hệ sinh thái giáo dục"  │  │
│ │ Background: Gradient + Animated shapes       │  │
│ │ CTA: [Bắt đầu miễn phí] [Khám phá ứng dụng] │  │
│ └──────────────────────────────────────────────┘  │
│                                                     │
│ ┌──── FEATURES SECTION ────────────────────────┐  │
│ │ Icon + Title + Description (3 columns)       │  │
│ │ 1. 🎓 Ứng Dụng Học Tập Tương Tác            │  │
│ │    Các ứng dụng được phát triển bởi IVS      │  │
│ │                                               │  │
│ │ 2. 🔗 Đồng Bộ Tài Khoản Thống Nhất           │  │
│ │    1 tài khoản sử dụng tất cả ứng dụng       │  │
│ │                                               │  │
│ │ 3. 📊 Thông Tin Nền Tảng Học Tập Hiệu Quả   │  │
│ │    Chia sẻ kiến thức từ Microsoft/LinkedIn   │  │
│ └──────────────────────────────────────────────┘  │
│                                                     │
│ ┌──── APPS SHOWCASE ───────────────────────────┐  │
│ │ "Các Ứng Dụng IVS"                           │  │
│ │ [App Card 1] [App Card 2] [App Card 3]       │  │
│ │ • ELearners (ivseng.web.app)                │  │
│ │ • Testing & Placement (testplacement...)     │  │
│ │ • Coming Soon: App 3, App 4, ...             │  │
│ └──────────────────────────────────────────────┘  │
│                                                     │
│ ┌──── LEARNING INFO ───────────────────────────┐  │
│ │ "Nền Tảng Học Tập Hàng Đầu"                  │  │
│ │ Infographic: Microsoft Learn | LinkedIn ... │  │
│ │ Các đặc điểm tốt nhất                        │  │
│ └──────────────────────────────────────────────┘  │
│                                                     │
│ ┌──── STATS SECTION ───────────────────────────┐  │
│ │ 1000+ Users │ 50+ Courses │ 5 Apps │ 4.8★    │  │
│ └──────────────────────────────────────────────┘  │
│                                                     │
│ ┌──── CTA SECTION ─────────────────────────────┐  │
│ │ "Sẵn sàng bắt đầu?"                          │  │
│ │ [Đăng Ký Ngay] [Liên Hệ Sales]              │  │
│ └──────────────────────────────────────────────┘  │
│                                                     │
│ FOOTER                                             │
│ Links │ Legal │ Social                            │
└─────────────────────────────────────────────────────┘
```

#### 🎯 Tính Năng:
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Auth listener: Redirect authenticated users to dashboard
- ✅ Call-to-action buttons (prominent placement)
- ✅ Testimonials section (from users)
- ✅ FAQ section (common questions)
- ✅ Newsletter signup
- ✅ Social proof (user counts, ratings)
- ✅ SEO optimized (meta tags, schema markup)

#### 💻 Kỹ Thuật:
```javascript
// index.html logic
- Firebase Auth listener
  ├─ If authenticated → Redirect /dashboard
  └─ If not → Show landing page
  
- Dynamic content loading
  ├─ Featured apps from CMS
  ├─ Stats from analytics
  └─ News/updates feed

- Animations
  ├─ AOS (Animate on Scroll)
  ├─ Scroll-triggered counters
  └─ Smooth parallax effects
```

---

### Trang 2: Quản Lý Tài Khoản & Ứng Dụng
**URL:** `ivslearning.top/dashboard.html`  
**Khán giả:** Authenticated users only  
**Mục đích:** Hub trung tâm - quản lý tài khoản, access apps

#### 📱 Bố Cục:

```
┌─────────────────────────────────────────────────────┐
│ HEADER (Fixed)                                      │
│ Logo │ Home │ Search │ User Dropdown │ Notifications│
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌──── GREETING + STATS ──────────────────────────┐ │
│ │ Xin chào, [User Name]! 👋                      │ │
│ │ ┌────────────┐ ┌────────────┐ ┌────────────┐  │ │
│ │ │ Khóa Học   │ │ Ứng Dụng    │ │ Hồ Sơ      │  │ │
│ │ │ 0 Enrolled │ │ 5 Available │ │ Hoàn Thành │  │ │
│ │ └────────────┘ └────────────┘ └────────────┘  │ │
│ └──────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ MY LEARNING SECTION                            │ │
│ │ ┌──────────────────────────────────────────┐   │ │
│ │ │ "Continue Learning"                      │   │ │
│ │ │ [Course Card - Resume Button]            │   │ │
│ │ │ [Course Card]                            │   │ │
│ │ └──────────────────────────────────────────┘   │ │
│ │ ┌──────────────────────────────────────────┐   │ │
│ │ │ "Completed Courses"                      │   │ │
│ │ │ [Certificate Badge] [Certificate Badge] │   │ │
│ │ │ [Certificate Badge]                      │   │ │
│ │ └──────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ IVS APPS SECTION                               │ │
│ │ "Ứng Dụng Khả Dụng"                             │ │
│ │                                                  │ │
│ │ ┌──────────────────────────────────────────┐   │ │
│ │ │ 📚 ELearners                             │   │ │
│ │ │ Học Tiếng Anh Tương Tác                 │   │ │
│ │ │ ivseng.web.app                          │   │ │
│ │ │ ★★★★★ 4.8 (250 reviews)                │   │ │
│ │ │ [Truy Cập Ngay] [Xem Chi Tiết]          │   │ │
│ │ └──────────────────────────────────────────┘   │ │
│ │                                                  │ │
│ │ ┌──────────────────────────────────────────┐   │ │
│ │ │ 📝 Testing & Placement                   │   │ │
│ │ │ Kiểm Tra Năng Lực & Xếp Lớp              │   │ │
│ │ │ testplacement.web.app                   │   │ │
│ │ │ ★★★★★ 4.6 (180 reviews)                │   │ │
│ │ │ [Truy Cập Ngay] [Xem Chi Tiết]          │   │ │
│ │ └──────────────────────────────────────────┘   │ │
│ │                                                  │ │
│ │ ┌──────────────────────────────────────────┐   │ │
│ │ │ 🚀 Coming Soon...                        │   │ │
│ │ │ [Notify Me]                              │   │ │
│ │ └──────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ QUICK LINKS                                    │ │
│ │ [Browse Learning Materials]                   │ │
│ │ [View Profile & Settings]                     │ │
│ │ [Need Help? Contact Support]                  │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ FOOTER                                             │
└─────────────────────────────────────────────────────┘
```

#### 🎯 Tính Năng:
- ✅ Welcome message (personalized)
- ✅ Quick statistics (courses, apps, progress)
- ✅ "Continue Learning" section
- ✅ "Completed Courses" with certificates
- ✅ **IVS Apps Showcase** (Main Feature)
  - App cards with metadata
  - Ratings & reviews
  - "Access Now" button (SSO redirect)
  - "View Details" link
- ✅ Course enrollment history
- ✅ Quick access to profile settings
- ✅ Help/support section
- ✅ Notifications/announcements

#### 💻 Kỹ Thuật:
```javascript
// dashboard.html logic
Firebase Auth:
├─ Redirect if not authenticated
├─ Load user profile
├─ Display user name, avatar
└─ Session management

App Integration:
├─ Fetch available apps from backend
├─ Display app cards with ratings
├─ Handle SSO redirect
│  └─ Generate token via Cloud Function
│     └─ Redirect: app.com?sso_token=xxx

Learning Progress:
├─ Query user's enrollments
├─ Calculate progress percentage
├─ Show completed certificates
└─ Load course thumbnails

Profile Management:
└─ Quick link to profile page
```

---

### Trang 3: Learning Resources & Platform Info
**URL:** `ivslearning.top/learning-materials.html`  
**Khán giả:** Tất cả người dùng (authenticated & unauthenticated)  
**Mục đích:** Chia sẻ kiến thức về nền tảng học tập hiệu quả (Microsoft Learn, LinkedIn Learning, AWS)

#### 📱 Bố Cục:

```
┌─────────────────────────────────────────────────────┐
│ HEADER (Fixed)                                      │
│ Logo │ Nav │ Search │ Auth Button                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌──── HERO SECTION ────────────────────────────┐  │
│ │ Title: "Nền Tảng Học Tập Hiệu Quả"          │  │
│ │ Subtitle: "Khám phá các best practices từ   │  │
│ │           Microsoft, LinkedIn, AWS"         │  │
│ │ CTA: [Khám Phá Kiến Thức] [Xem So Sánh]    │  │
│ └──────────────────────────────────────────────┘  │
│                                                     │
│ ┌──── 3-COLUMN COMPARISON ──────────────────────┐ │
│ │                                               │ │
│ │ MICROSOFT LEARN          LINKEDIN LEARNING     │ │
│ │ ┌──────────────────┐ ┌──────────────────┐   │ │
│ │ │ 📊 For: Techs    │ │ 👔 For: Careers  │   │ │
│ │ │ 🔧 Skills: Tech  │ │ 🎯 Skills: Pro   │   │ │
│ │ │ 💰 Price: Free   │ │ 💰 Price: $39.99 │   │ │
│ │ │ ⭐ Rating: 4.7   │ │ ⭐ Rating: 4.6   │   │ │
│ │ │ 📈 Paths: 50+    │ │ 📈 Courses: 17k  │   │ │
│ │ │ 🏅 Cert: Yes     │ │ 🏅 Cert: Yes     │   │ │
│ │ │ 🎮 Lab: Yes      │ │ 🎮 Lab: Limited  │   │ │
│ │ │ 📺 Video: ~2h    │ │ 📺 Video: ~3h    │   │ │
│ │ │                  │ │                  │   │ │
│ │ │ Best For: Azure  │ │ Best For: Career │   │ │
│ │ │ [Explore] [Link] │ │ [Explore] [Link] │   │ │
│ │ └──────────────────┘ └──────────────────┘   │ │
│ │                                               │ │
│ │          AWS LEARNING                         │ │
│ │       ┌────────────────────┐                  │ │
│ │       │ ☁️ For: Cloud      │                  │ │
│ │       │ 🚀 Skills: AWS     │                  │ │
│ │       │ 💰 Price: Free+Paid│                  │ │
│ │       │ ⭐ Rating: 4.5     │                  │ │
│ │       │ 📈 Paths: 25+      │                  │ │
│ │       │ 🏅 Cert: Yes       │                  │ │
│ │       │ 🎮 Lab: Yes        │                  │ │
│ │       │ 📺 Video: ~4h      │                  │ │
│ │       │                    │                  │ │
│ │       │ Best For: AWS Cert │                  │ │
│ │       │ [Explore] [Link]   │                  │ │
│ │       └────────────────────┘                  │ │
│ └──────────────────────────────────────────────┘ │
│                                                     │
│ ┌──── KEY FEATURES COMPARISON ──────────────────┐ │
│ │ Feature │ Microsoft │ LinkedIn │ AWS          │ │
│ │ ────────┼───────────┼──────────┼──────         │ │
│ │ Paths   │ ✅ Yes    │ ✅ Yes   │ ✅ Yes       │ │
│ │ Labs    │ ✅ Hands  │ ❌ No    │ ✅ Hands    │ │
│ │ Videos  │ ✅        │ ✅       │ ✅          │ │
│ │ Quiz    │ ✅        │ ✅       │ ✅          │ │
│ │ Certs   │ ✅        │ ✅       │ ✅          │ │
│ │ Mobile  │ ❌        │ ✅       │ ❌          │ │
│ │ Price   │ Free      │ Paid     │ Free/Paid   │ │
│ └──────────────────────────────────────────────┘ │
│                                                     │
│ ┌──── DESIGN BEST PRACTICES ────────────────────┐ │
│ │ "Đặc Điểm Thiết Kế Tốt Nhất"                  │ │
│ │                                                │ │
│ │ 1. 🎯 Role-Based Navigation                   │ │
│ │    Filter courses by job role                 │ │
│ │    Example: "Solutions Architect"             │ │
│ │                                                │ │
│ │ 2. 📊 Clear Progress Tracking                 │ │
│ │    Visualize completion percentage            │ │
│ │    Show estimated time remaining              │ │
│ │                                                │ │
│ │ 3. 🎓 Structured Learning Paths               │ │
│ │    Modules grouped logically                  │ │
│ │    Prerequisites clearly marked               │ │
│ │                                                │ │
│ │ 4. 🔍 Powerful Search & Filtering              │ │
│ │    Filter by level, duration, language        │ │
│ │    Full-text search across all content        │ │
│ │                                                │ │
│ │ 5. 🎬 Quality Video Experience                │ │
│ │    Adjustable playback speed                  │ │
│ │    Full transcripts provided                  │ │
│ │    Downloadable captions                      │ │
│ │                                                │ │
│ │ 6. 🏆 Gamification & Rewards                  │ │
│ │    Badges for milestones                      │ │
│ │    Leaderboards (optional)                    │ │
│ │    Certificate of completion                  │ │
│ │                                                │ │
│ └──────────────────────────────────────────────┘ │
│                                                     │
│ ┌──── RECOMMENDED TECH STACK ───────────────────┐ │
│ │ Frontend: React/Next.js                       │ │
│ │ Backend: Node.js + PostgreSQL                 │ │
│ │ Video: Video.js or Plyr                       │ │
│ │ Search: Algolia or Elasticsearch              │ │
│ │ UI: Tailwind CSS + Shadcn/UI                  │ │
│ │ Deploy: Vercel/Netlify (Frontend)             │ │
│ │         Railway/Render (Backend)              │ │
│ └──────────────────────────────────────────────┘ │
│                                                     │
│ ┌──── IMPLEMENTATION ROADMAP ───────────────────┐ │
│ │ Phase 1: MVP (Week 1-2)                       │ │
│ │ ├─ Course management system                   │ │
│ │ ├─ Video player                               │ │
│ │ └─ Progress tracking                          │ │
│ │                                                │ │
│ │ Phase 2: Enhancement (Week 3-4)               │ │
│ │ ├─ Search & filtering                         │ │
│ │ ├─ Recommendations                            │ │
│ │ └─ Discussion forums                          │ │
│ │                                                │ │
│ │ Phase 3: Advanced (Week 5+)                   │ │
│ │ ├─ Live classes                               │ │
│ │ ├─ AI-powered features                        │ │
│ │ └─ Analytics dashboard                        │ │
│ └──────────────────────────────────────────────┘ │
│                                                     │
│ FOOTER                                             │
└─────────────────────────────────────────────────────┘
```

#### 🎯 Tính Năng:
- ✅ Platform comparison (3 columns: Microsoft, LinkedIn, AWS)
- ✅ Interactive comparison table
- ✅ Design best practices showcase
- ✅ Tech stack recommendations
- ✅ Implementation roadmap
- ✅ Links to external resources
- ✅ Case studies / testimonials
- ✅ FAQ section
- ✅ Newsletter signup for updates

#### 💻 Kỹ Thuật:
```javascript
// learning-materials.html logic
Content Organization:
├─ Tabbed interface (Platform selection)
├─ Expandable sections (Features)
├─ Comparison tables
└─ Code examples & snippets

Interactive Elements:
├─ Filter by feature
├─ Side-by-side comparison toggle
├─ Copy code button
└─ External links (tracked analytics)

Performance:
├─ Lazy-load images
├─ Code highlighting (Prism.js)
├─ Smooth scroll navigation
└─ Mobile-optimized tables
```

---

## 🔐 Hệ Thống SSO & Tài Khoản {#hệ-thống-sso--tài-khoản}

### Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│            IVS LEARNING HUB (ivslearning.top)            │
│                   MAIN IDENTITY PROVIDER                 │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Firebase Authentication                            │ │
│  │ ├─ Email/Password                                 │ │
│  │ ├─ Google OAuth                                   │ │
│  │ ├─ Facebook OAuth (optional)                      │ │
│  │ └─ Custom Token Generation                        │ │
│  └────────────────────────────────────────────────────┘ │
│                      ↓                                   │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Cloud Functions (Backend)                          │ │
│  │ ├─ createCustomToken()                            │ │
│  │ ├─ validateCustomToken()                          │ │
│  │ ├─ getUserProfile()                               │ │
│  │ └─ updateUserClaims()                             │ │
│  └────────────────────────────────────────────────────┘ │
│                      ↓                                   │
│  ┌────────────────────────────────────────────────────┐ │
│  │ User Profile Database                              │ │
│  │ (Firestore / PostgreSQL)                           │ │
│  │ ├─ Basic Info (name, email, avatar)               │ │
│  │ ├─ Enrollments (courses, apps)                    │ │
│  │ ├─ Progress (completion %)                        │ │
│  │ ├─ Preferences (language, theme)                  │ │
│  │ └─ Roles (student, instructor, admin)             │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
   │ App 1        │  │ App 2        │  │ App N        │
   │ELearners     │  │Testing&Place │  │Future Apps   │
   │              │  │              │  │              │
   │ Receives SSO │  │ Receives SSO │  │ Receives SSO │
   │ Token → Auth │  │ Token → Auth │  │ Token → Auth │
   └──────────────┘  └──────────────┘  └──────────────┘
```

### User Authentication Flow

```
User Visit ivslearning.top
    ↓
Check Firebase Auth State
    ├─ If Logged In
    │  ├─ Load Dashboard
    │  ├─ Display Available Apps
    │  └─ Ready for SSO Access
    │
    └─ If Not Logged In
       ├─ Redirect to auth.html
       ├─ Show Login / Register Form
       ├─ User Submits Credentials
       ├─ Firebase Auth (Email/Password or OAuth)
       ├─ Create User Profile in Database
       └─ Redirect back to Dashboard
```

### App Access with SSO

```
User on Dashboard
    ↓
Click "Truy Cập ELearners"
    ↓
Frontend calls Cloud Function:
POST /createCustomToken
Headers: Authorization: Bearer {idToken}
    ↓
Cloud Function:
1. Verify ID Token (check if user is authenticated)
2. Extract user info from Firebase Auth
3. Create custom token (JWT format)
4. Return token + app redirect URL
    ↓
Frontend receives token
    ↓
Generate redirect URL:
https://ivseng.web.app/auth/sso?token={customToken}
    ↓
Redirect to ELearners app
    ↓
ELearners receives token
    ↓
ELearners:
1. Parse SSO token
2. Validate token signature (using shared secret)
3. Call signInWithCustomToken()
4. Auto-login user
5. Set session cookie
    ↓
User is logged in and can use ELearners
```

### Backend Implementation (Cloud Functions)

```javascript
// functions/index.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

// Function 1: Create SSO Token
exports.createCustomToken = functions.https.onRequest(
  (req, res) => {
    cors(req, res, async () => {
      try {
        // Get ID token from header
        const idToken = req.headers.authorization.split(' ')[1];
        
        // Verify ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        
        // Get user profile
        const userDoc = await admin.firestore()
          .collection('users')
          .doc(uid)
          .get();
        
        const userData = userDoc.data();
        
        // Create custom token (valid for 1 hour)
        const customToken = await admin.auth().createCustomToken(uid, {
          role: userData.role,
          email: userData.email,
          name: userData.name,
          subscriptionLevel: userData.subscriptionLevel
        });
        
        res.json({
          token: customToken,
          expiresIn: 3600,
          redirectUrl: `https://ivseng.web.app/auth/sso?token=${customToken}`
        });
      } catch (error) {
        console.error('Error creating custom token:', error);
        res.status(401).json({ error: 'Unauthorized' });
      }
    });
  }
);

// Function 2: Validate SSO Token
exports.validateCustomToken = functions.https.onRequest(
  (req, res) => {
    cors(req, res, async () => {
      try {
        const token = req.body.token;
        
        // Verify custom token
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        res.json({
          valid: true,
          uid: decodedToken.uid,
          email: decodedToken.email
        });
      } catch (error) {
        res.status(401).json({ valid: false, error: error.message });
      }
    });
  }
);

// Function 3: Get User Profile
exports.getUserProfile = functions.https.onRequest(
  (req, res) => {
    cors(req, res, async () => {
      try {
        const idToken = req.headers.authorization.split(' ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        
        const userDoc = await admin.firestore()
          .collection('users')
          .doc(uid)
          .get();
        
        res.json({
          uid,
          ...userDoc.data()
        });
      } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
      }
    });
  }
);

// Function 4: Update User Claims (Admin only)
exports.updateUserClaims = functions.https.onRequest(
  (req, res) => {
    cors(req, res, async () => {
      try {
        const idToken = req.headers.authorization.split(' ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        
        // Check if user is admin
        if (decodedToken.role !== 'admin') {
          return res.status(403).json({ error: 'Forbidden' });
        }
        
        const { uid, claims } = req.body;
        
        // Update custom claims
        await admin.auth().setCustomUserClaims(uid, claims);
        
        // Update user profile
        await admin.firestore()
          .collection('users')
          .doc(uid)
          .update(claims);
        
        res.json({ success: true });
      } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
      }
    });
  }
);
```

### Database Schema (Firestore)

```
Collection: users
├─ Document: {uid}
   ├─ email: string
   ├─ name: string
   ├─ avatar: string (URL)
   ├─ role: enum ['student', 'instructor', 'admin']
   ├─ subscriptionLevel: enum ['free', 'premium', 'enterprise']
   ├─ enrollments: {
   │  ├─ courseId: {
   │  │  ├─ enrolledAt: timestamp
   │  │  ├─ completedAt: timestamp (optional)
   │  │  ├─ progress: number (0-100)
   │  │  └─ lastAccessedAt: timestamp
   │  └─ ...
   ├─ preferences: {
   │  ├─ language: string
   │  ├─ theme: enum ['light', 'dark']
   │  ├─ notifications: boolean
   │  └─ emailUpdates: boolean
   ├─ createdAt: timestamp
   └─ updatedAt: timestamp

Collection: apps
├─ Document: {appId}
   ├─ name: string
   ├─ description: string
   ├─ icon: string (URL)
   ├─ ssoRedirectUrl: string
   ├─ category: string
   ├─ rating: number
   ├─ reviews: number
   ├─ status: enum ['active', 'beta', 'coming_soon']
   ├─ accessLevels: enum ['public', 'subscribers', 'premium']
   ├─ requiredRole: enum ['student', 'instructor', 'admin']
   ├─ createdAt: timestamp
   └─ updatedAt: timestamp
```

---

## 🎨 Chi Tiết Thiết Kế Giao Diện {#chi-tiết-thiết-kế-giao-diện}

### Color Palette

```
Primary Colors:
├─ IVS Blue: #4c5ef7 (Primary action)
├─ IVS Green: #10b981 (Success, positive)
├─ IVS Purple: #8b5cf6 (Premium, highlight)
└─ IVS Orange: #f97316 (CTAs, emphasis)

Backgrounds:
├─ Dark BG: #1a1a1a (Main background)
├─ Card BG: #111111 (Cards, modals)
├─ Hover BG: #27272A (Interactive elements)
└─ Border: #27272A (Borders)

Text:
├─ Primary: #f4f4f5 (Main text)
├─ Secondary: #a1a1aa (Muted text)
└─ Accent: #4c5ef7 (Links, emphasis)

Semantic:
├─ Success: #10b981 (Green)
├─ Warning: #f59e0b (Amber)
├─ Error: #ef4444 (Red)
└─ Info: #4c5ef7 (Blue)
```

### Typography

```
Font Families:
├─ Primary: 'Be Vietnam Pro' (Headings, titles)
├─ Secondary: 'Inter' (Body text)
└─ Code: 'JetBrains Mono' (Code snippets)

Font Sizes:
├─ H1: 2.5rem (40px)
├─ H2: 2rem (32px)
├─ H3: 1.5rem (24px)
├─ H4: 1.25rem (20px)
├─ Body: 1rem (16px)
├─ Small: 0.875rem (14px)
└─ Tiny: 0.75rem (12px)

Font Weights:
├─ Regular: 400
├─ Medium: 500
├─ Semibold: 600
└─ Bold: 700
```

### Component Library (Shadcn/UI Recommended)

```
✅ Button (variants: primary, secondary, outline, ghost)
✅ Card (content container)
✅ Dialog / Modal
✅ Dropdown Menu
✅ Tabs
✅ Progress Bar
✅ Badge
✅ Avatar
✅ Input / Textarea
✅ Select / Combobox
✅ Checkbox / Radio
✅ Toast Notifications
✅ Loading Spinner
✅ Skeleton Loader
```

---

## 📱 Bộ Ứng Dụng Con Hiện Tại {#bộ-ứng-dụng-con-hiện-tại}

### App 1: ELearners (ivseng.web.app)

```
┌────────────────────────────────────┐
│ IVS English Learning Platform      │
├────────────────────────────────────┤
│ • Interactive English courses      │
│ • Video lessons with subtitles     │
│ • Grammar exercises & quizzes      │
│ • Speaking practice (if AI)        │
│ • Progress tracking                │
│ • Certificates of completion       │
│                                    │
│ SSO Integration:                   │
│ ├─ Receives SSO token              │
│ ├─ Auto-login user                 │
│ ├─ Sync user profile               │
│ └─ Track progress back to hub      │
└────────────────────────────────────┘

Data Sync:
Hub → App:
├─ User ID
├─ Email
├─ Name
└─ Subscription Level

App → Hub (optional):
├─ Completion %
├─ Certificates earned
└─ Achievements
```

### App 2: Testing & Placement (testplacement.web.app)

```
┌────────────────────────────────────┐
│ IVS Assessment & Placement System  │
├────────────────────────────────────┤
│ • English proficiency tests        │
│ • Placement quizzes                │
│ • Real-time scoring                │
│ • Level determination              │
│ • Report generation                │
│ • Certificate of proficiency       │
│                                    │
│ SSO Integration:                   │
│ ├─ Receives SSO token              │
│ ├─ Auto-login user                 │
│ ├─ Pre-fill user data              │
│ └─ Store test results              │
└────────────────────────────────────┘

Data Sync:
Hub → App:
├─ User ID
├─ Email
├─ Previous test results (if any)
└─ Target level

App → Hub (optional):
├─ Test score
├─ Determined level
└─ Recommendations
```

### Future Apps (Roadmap)

```
App 3: IVS Live Classes
├─ Live streaming platform
├─ Teacher-student interaction
├─ Real-time chat
└─ Recording & playback

App 4: IVS Content Management
├─ Course creation tool
├─ Video upload & editing
├─ Quiz builder
└─ Analytics dashboard

App 5: IVS Community Forum
├─ Discussion boards
├─ Q&A sections
├─ Knowledge base
└─ User reputation system

App 6: IVS Mobile App
├─ iOS / Android
├─ Offline learning
├─ Push notifications
└─ Sync with web
```

---

## 📊 Kế Hoạch Phát Triển {#kế-hoạch-phát-triển}

### Phase 1: Foundation (Week 1-2)
**Objective:** Consolidate existing code + Set up proper structure

```
Week 1:
├─ [ ] Audit current codebase
├─ [ ] Create Git branches for each component
├─ [ ] Set up Firebase project (if not done)
├─ [ ] Standardize Firebase versions (v12.5.0)
├─ [ ] Create shared component library
└─ [ ] Set up CI/CD pipeline (GitHub Actions)

Week 2:
├─ [ ] Deploy landing page (index.html)
├─ [ ] Deploy dashboard (dashboard.html)
├─ [ ] Deploy learning resources page (learning-materials.html)
├─ [ ] Test authentication flow
├─ [ ] Test SSO redirect
└─ [ ] Deploy to production (Firebase Hosting)

Deliverables:
✅ index.html - Landing page
✅ dashboard.html - User hub
✅ learning-materials.html - Learning info
✅ Firebase Auth working
✅ SSO token generation working
✅ All 3 pages mobile-responsive
```

### Phase 2: Enhancement (Week 3-4)
**Objective:** Add features & improve UX

```
Week 3:
├─ [ ] Add app marketplace (with ratings/reviews)
├─ [ ] Implement app access management
├─ [ ] Add user profile page (profile.html)
├─ [ ] Add email verification
├─ [ ] Add password reset flow
└─ [ ] Add user preference settings

Week 4:
├─ [ ] Implement real-time notifications
├─ [ ] Add progress tracking visualization
├─ [ ] Create admin dashboard
├─ [ ] Add analytics tracking
├─ [ ] Optimize performance
└─ [ ] Security audit

Deliverables:
✅ profile.html - User settings
✅ App marketplace UI
✅ Email notifications working
✅ Admin dashboard functional
✅ All pages optimized
```

### Phase 3: Advanced (Week 5-6)
**Objective:** Add sophisticated features

```
Week 5:
├─ [ ] Implement learning paths system
├─ [ ] Add course catalog
├─ [ ] Build video player (with HLS streaming)
├─ [ ] Create quiz system
├─ [ ] Add course progress tracking
└─ [ ] Certificate generation

Week 6:
├─ [ ] Implement recommendation engine
├─ [ ] Add discussion forums
├─ [ ] Create instructor dashboard
├─ [ ] Build reporting system
├─ [ ] Add API documentation
└─ [ ] Performance optimization

Deliverables:
✅ Full learning platform
✅ Video streaming working
✅ Quizzes functional
✅ Certificates generated
✅ Recommendations working
```

### Phase 4: Scaling & Polish (Week 7-8)
**Objective:** Scale infrastructure + Final polish

```
Week 7:
├─ [ ] Load testing
├─ [ ] Database optimization
├─ [ ] CDN integration
├─ [ ] Search implementation (Algolia/Elasticsearch)
├─ [ ] Multi-language support
└─ [ ] SEO optimization

Week 8:
├─ [ ] User acceptance testing
├─ [ ] Bug fixes & polishing
├─ [ ] Documentation
├─ [ ] Team training
├─ [ ] Go-live preparation
└─ [ ] Post-launch monitoring

Deliverables:
✅ Production-ready platform
✅ Fully documented
✅ Team trained
✅ Monitoring & alerts set up
```

### Development Team & Roles

```
Frontend Developer:
├─ Build responsive UI (React/Vue/HTML)
├─ Implement Firebase Auth UI
├─ SSO redirect flow
└─ Performance optimization

Backend Developer:
├─ Cloud Functions
├─ Database schema
├─ API endpoints
├─ Admin dashboard
└─ Analytics tracking

DevOps/Infrastructure:
├─ Firebase setup & management
├─ CI/CD pipelines
├─ Monitoring & logging
├─ Backup & recovery
└─ Performance optimization

QA/Testing:
├─ Feature testing
├─ Cross-browser testing
├─ Security testing
├─ Performance testing
└─ UAT coordination
```

### Success Metrics

```
User Acquisition:
├─ Monthly Active Users (MAU)
├─ New user registration rate
├─ User retention rate
└─ Churn rate

Engagement:
├─ Course completion rate
├─ App usage frequency
├─ Time spent per session
├─ Return user %
└─ Support ticket volume

Technical:
├─ Page load time (<2s)
├─ Uptime (>99.9%)
├─ Error rate (<0.5%)
├─ API response time (<200ms)
└─ Mobile conversion rate

Business:
├─ User satisfaction (NPS)
├─ Premium conversion rate
├─ Revenue per user
├─ Marketing ROI
└─ Customer acquisition cost
```

---

## 🎯 Quick Implementation Checklist

### Before Development:
- [ ] Finalize design mockups
- [ ] Get stakeholder approval
- [ ] Set up development environment
- [ ] Create Git repository & branches
- [ ] Set up Firebase project
- [ ] Configure CI/CD pipeline

### During Development:
- [ ] Follow code standards
- [ ] Write unit tests (>80% coverage)
- [ ] Perform code reviews
- [ ] Conduct security audits
- [ ] Optimize performance
- [ ] Update documentation

### Before Launch:
- [ ] QA testing (manual + automated)
- [ ] Load testing (simulating user traffic)
- [ ] Security vulnerability scan
- [ ] User acceptance testing
- [ ] Prepare runbooks
- [ ] Set up monitoring & alerts

### After Launch:
- [ ] Monitor system performance
- [ ] Collect user feedback
- [ ] Plan improvements (iteration)
- [ ] Create post-mortem (if issues)
- [ ] Celebrate success! 🎉

---

**Document Status:** ✅ Ready for Development  
**Last Updated:** 7 November 2025  
**Next Review:** Upon Phase 1 Completion
