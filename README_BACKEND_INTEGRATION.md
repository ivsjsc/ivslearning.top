# 📖 Tổng Hợp - Hướng Dẫn Liên Kết Backend Server IVS

**Ngày:** 9 tháng 11, 2025  
**Trạng thái:** ✅ Hoàn thành & Deploy sẵn sàng

---

## 📌 Overview

### Backend Server (Production)
```
URL: https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app
```

### Frontend Website
```
URL: https://ivslearning.web.app
```

---

## 🚀 Bắt Đầu Nhanh (5 Phút)

### 1️⃣ Test Backend Connection

```bash
# Kiểm tra backend có hoạt động
curl https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/health
```

### 2️⃣ Xem Danh Sách AI Models

```bash
curl https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/models
```

### 3️⃣ Integration Code (React)

```javascript
import { getAuth } from 'firebase/auth';

// Hàm gọi API
async function callBackend(task, data) {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();
  
  const response = await fetch(
    'https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/ai-router',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task, data })
    }
  );
  
  return response.json();
}

// Sử dụng
const userProfile = await callBackend('get_user_profile', {});
console.log(userProfile);
```

---

## 📡 API Endpoints

| Endpoint | Method | Auth | Mô Tả |
|----------|--------|------|-------|
| `/api/health` | GET | ❌ | Kiểm tra trạng thái server |
| `/api/models` | GET | ❌ | Danh sách AI models |
| `/api/ai-router` | POST | ✅ | Gọi tác vụ AI |
| `/api/zalo/webhook` | POST | ✅ | Webhook Zalo OA |

---

## 🔑 Configuration

### Firebase Config (Đã Có)

**File:** `js/firebase-config.js`

```javascript
export const firebaseConfig = {
  apiKey: "AIzaSyCpvQT...",
  authDomain: "ivs-159a7.firebaseapp.com",
  projectId: "ivs-159a7",
  storageBucket: "ivs-159a7.appspot.com",
  messagingSenderId: "896...",
  appId: "1:896....:web:ab2d..."
};
```

### API Config (Đã Có)

**File:** `js/api-config.js`

```javascript
export const API_CONFIG = {
  BASE_URL: 'https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app',
  ENDPOINTS: {
    HEALTH: '/api/health',
    MODELS: '/api/models',
    AI_ROUTER: '/api/ai-router',
    ZALO_WEBHOOK: '/api/zalo/webhook'
  }
};
```

---

## 🎯 AI Tasks Có Sẵn

```javascript
// 1. Lấy Profile User
await callBackend('get_user_profile', {})

// 2. Lấy Danh Sách Posts
await callBackend('get_posts', { 
  limit: 10,
  orderBy: { field: 'createdAt', direction: 'desc' }
})

// 3. Kiểm Tra Quyền Admin
await callBackend('admin_override_check', {})

// 4. Tạo Nội Dung (Generative AI)
await callBackend('generate_content', {
  topic: 'Machine Learning',
  length: 'medium'
})
```

---

## 🤖 AI Models Có Sẵn

Backend hỗ trợ 5+ AI models với fallback tự động:

1. **Gemini (Google)** - Fast, free tier available
2. **OpenAI** - Industry standard, pay-per-use
3. **Claude (Anthropic)** - Advanced reasoning
4. **DeepSeek** - Cost-effective
5. **Grok (xAI)** - Latest tech

---

## 📂 Tài Liệu Chi Tiết

### 1. `BACKEND_INTEGRATION_GUIDE.md` ⭐ (Mới)
   - Hướng dẫn liên kết toàn diện
   - Code examples chi tiết
   - Troubleshooting guide
   - Status check & testing

### 2. `BACKEND_QUICK_REFERENCE.md` ⭐ (Mới)
   - Quick lookup reference
   - Code snippets sẵn dùng
   - Common tasks
   - Troubleshooting table

### 3. `HUONG-DAN-LIEN-KET/INTEGRATION_GUIDE_VI.md`
   - Chi tiết API structure
   - Firebase authentication
   - React/Next.js integration
   - Flutter integration
   - React Native integration
   - Error handling

### 4. `HUONG-DAN-LIEN-KET/AIVY_CHATBOT_GUIDE_VI.md`
   - AIVY chatbot setup
   - Web component integration
   - Mobile widget integration
   - CSS styling
   - Advanced features

### 5. `HUONG-DAN-LIEN-KET/DEPLOYMENT_GUIDE_VI.md`
   - Frontend deployment (Vercel, Netlify, Firebase)
   - Mobile deployment (Play Store, App Store)
   - Backend deployment
   - CI/CD pipeline
   - Monitoring & logging

---

## ✅ Danh Sách Kiểm Tra

### Backend Ready?
- [ ] Kiểm tra `/api/health` → `status: "ok"`
- [ ] Kiểm tra `/api/models` → danh sách models
- [ ] Firebase config có sẵn
- [ ] Backend URL cấu hình đúng

### Frontend Integration?
- [ ] Import Firebase config
- [ ] Import API config  
- [ ] Setup Firebase auth
- [ ] Test callBackend() function
- [ ] Handle responses & errors

### Chatbot Ready?
- [ ] AIVY component hiển thị
- [ ] Chat button clickable
- [ ] Messages send/receive
- [ ] Styling OK

### Deployment?
- [ ] Frontend tests pass
- [ ] No console errors
- [ ] Backend connected
- [ ] Ready to deploy

---

## 🧪 Test Backend

### Browser Console
```javascript
// Test 1: Health
fetch('https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ Health:', d))
  .catch(e => console.error('❌ Error:', e));

// Test 2: Models
fetch('https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/models')
  .then(r => r.json())
  .then(d => console.log('✅ Models:', d.models.length, 'available'))
  .catch(e => console.error('❌ Error:', e));
```

### Postman / API Client
```
GET https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/health
GET https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/models
```

---

## ⚠️ Lỗi Thường Gặp

### 1. "Unable to reach backend"
**Nguyên nhân:** Network/VPN issue  
**Giải pháp:** Check internet, try VPN, check firewall

### 2. "401 Unauthorized"
**Nguyên nhân:** Firebase token invalid  
**Giải pháp:** Logout & login lại

### 3. "403 Forbidden"
**Nguyên nhân:** Không có quyền task  
**Giải pháp:** Check user role, contact admin

### 4. "500 Internal Server Error"
**Nguyên nhân:** Backend error  
**Giải pháp:** Check health `/api/health`, wait & retry

### 5. "CORS Error"
**Nguyên nhân:** Domain không được phép  
**Giải pháp:** Check backend CORS config

---

## 🔄 Integration Architecture

```
┌─────────────────────────────────────┐
│   Frontend (ivslearning.web.app)    │
│   - React/HTML/JavaScript            │
│   - Firebase Authentication          │
│   - AIVY Chatbot                     │
└──────────────┬──────────────────────┘
               │
               │ HTTP/REST
               │ (Firebase IdToken)
               ▼
┌─────────────────────────────────────────────────────┐
│   Backend Server (Production)                       │
│   backend-studio-ivssever--ivs-159a7.us-east4...   │
│   - API Router (/api/ai-router)                     │
│   - AI Models (Gemini, OpenAI, Claude, ...)         │
│   - Firebase Auth Verification                      │
│   - Database & Storage                              │
└──────────────┬────────────────────────────────────┘
               │
               ├─────────────────┐
               ▼                 ▼
          AI Models         Firebase
          (Gemini,         (Realtime DB,
           OpenAI,         Storage,
           Claude,         Auth)
           ...)
```

---

## 📞 Liên Hệ & Support

### Thông Tin Backend
- **URL:** https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app
- **API Base:** `/api`
- **Auth:** Firebase
- **Status:** ✅ Production Ready

### Frontend
- **URL:** https://ivslearning.web.app
- **Status:** ✅ Live

### Cần Giúp?
1. Xem `BACKEND_INTEGRATION_GUIDE.md`
2. Xem `BACKEND_QUICK_REFERENCE.md`
3. Check `/api/health` status
4. Xem browser console (F12)
5. Liên hệ IVS Team

---

## 📚 Tài Liệu Liên Quan

- 📖 Hướng dẫn tích hợp: `BACKEND_INTEGRATION_GUIDE.md`
- ⚡ Quick Reference: `BACKEND_QUICK_REFERENCE.md`
- 🤖 AIVY Chatbot: `HUONG-DAN-LIEN-KET/AIVY_CHATBOT_GUIDE_VI.md`
- 🚀 Deployment: `HUONG-DAN-LIEN-KET/DEPLOYMENT_GUIDE_VI.md`
- 📋 Integration: `HUONG-DAN-LIEN-KET/INTEGRATION_GUIDE_VI.md`

---

**✅ Backend Integration Complete - November 9, 2025**

*Tất cả tài liệu đã sẵn sàng. Frontend và Backend đều ở trạng thái Production Ready.*
