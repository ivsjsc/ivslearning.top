# 🚀 Hướng Dẫn Liên Kết Backend Server IVS

**Cập nhật:** 9 tháng 11, 2025  
**Trạng thái:** ✅ Production Ready

---

## 📌 Thông Tin Backend

### 🔗 URL Backend (Production)
```
https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app
```

### 🔗 Base API
```
https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api
```

### ✅ Status Check
```bash
# Test kết nối backend
curl https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/health
```

---

## 📋 API Endpoints Chính

| Endpoint | Phương Thức | Mô Tả |
|----------|-----------|-------|
| `/api/health` | GET | Kiểm tra trạng thái server |
| `/api/models` | GET | Danh sách AI models có sẵn |
| `/api/ai-router` | POST | Gọi các tác vụ AI |
| `/api/zalo/webhook` | POST | Webhook cho Zalo Official Account |

---

## 🔑 API Keys & Configuration

### Frontend Configuration

**File:** `js/firebase-config.js` (đã có sẵn)

```javascript
export const firebaseConfig = {
  apiKey: "AIzaSyCpvQT....",
  authDomain: "ivs-159a7.firebaseapp.com",
  projectId: "ivs-159a7",
  storageBucket: "ivs-159a7.appspot.com",
  messagingSenderId: "896...",
  appId: "1:896....:web:ab2d..."
};
```

### Backend URL

**File:** `js/api-config.js` (đã có sẵn)

```javascript
export const API_CONFIG = {
  BASE_URL: 'https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app',
  API_ENDPOINTS: {
    HEALTH: '/api/health',
    MODELS: '/api/models',
    AI_ROUTER: '/api/ai-router',
    ZALO_WEBHOOK: '/api/zalo/webhook'
  }
};
```

---

## 🔐 Authentication Setup

### 1. Firebase Authentication (Đã Cấu Hình)

Backend sử dụng Firebase Authentication với các phương thức:
- ✅ Email/Password
- ✅ Google Login
- ✅ Facebook Login
- ✅ Phone Number

### 2. Frontend Login Example

```javascript
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const user = await signInWithEmailAndPassword(auth, email, password);

// Lấy Firebase token
const idToken = await user.user.getIdToken();

// Gửi request đến backend
const response = await fetch('https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/ai-router', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${idToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    task: 'get_user_profile',
    data: {}
  })
});
```

---

## 📡 Cách Gọi API từ Frontend

### Example 1: Kiểm Tra Health Status

```javascript
// Fetch API không cần authentication
async function checkBackendHealth() {
  try {
    const response = await fetch(
      'https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/health'
    );
    const data = await response.json();
    console.log('Backend Status:', data);
    return data;
  } catch (error) {
    console.error('Backend Error:', error);
  }
}
```

### Example 2: Lấy Danh Sách AI Models

```javascript
async function getAvailableModels() {
  try {
    const response = await fetch(
      'https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/models'
    );
    const data = await response.json();
    console.log('Available Models:', data.models);
    return data.models;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Example 3: Gọi AI Task (Cần Xác Thực)

```javascript
import { getAuth } from 'firebase/auth';

async function callAITask(task, data) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('Người dùng chưa đăng nhập');
    }
    
    // Lấy Firebase token
    const idToken = await user.getIdToken();
    
    // Gọi Backend API
    const response = await fetch(
      'https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/ai-router',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          task: task,
          data: data
        })
      }
    );
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('AI Router Error:', error);
  }
}

// Sử dụng
const userProfile = await callAITask('get_user_profile', {});
console.log('User:', userProfile);
```

---

## 🤖 Tác Vụ AI Có Sẵn

| Task | Mô Tả | Input | Output |
|------|-------|-------|--------|
| `get_user_profile` | Lấy thông tin user | `{}` | User object |
| `get_posts` | Lấy danh sách bài viết | `{ limit: 10 }` | Array of posts |
| `admin_override_check` | Kiểm tra quyền admin | `{}` | Boolean |
| `generate_content` | Tạo nội dung AI | `{ topic, length }` | String |

---

## 🧪 Test Backend

### Using curl (Command Line)

```bash
# Test Health
curl https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/health

# Get Models
curl https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/models
```

### Using Browser Console

```javascript
// Test health
fetch('https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/health')
  .then(r => r.json())
  .then(d => console.log(d));

// Test models  
fetch('https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/models')
  .then(r => r.json())
  .then(d => console.log(d));
```

---

## ⚠️ Lỗi Thường Gặp & Xử Lý

### 1. CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy
```

**Giải pháp:** Backend đã cấu hình CORS. Đảm bảo request từ domain được phép.

### 2. 401 Unauthorized
```
Error: {"status": "error", "message": "Unauthorized"}
```

**Giải pháp:** 
- Kiểm tra Firebase token có hợp lệ
- Đăng nhập lại: `signOut()` rồi `signIn()` lại

### 3. 403 Forbidden
```
Error: {"status": "error", "message": "Forbidden"}
```

**Giải pháp:** Người dùng không có quyền thực hiện task này

### 4. 500 Internal Server Error
```
Error: {"status": "error", "message": "Internal Server Error"}
```

**Giải pháp:**
- Check health status: `/api/health`
- Xem logs backend
- Liên hệ DevOps team

---

## 🔄 Integration Flow

```
┌─────────────────┐
│   Frontend      │
│  (ivslearning   │
│   .web.app)     │
└────────┬────────┘
         │
         │ Firebase Auth
         ▼
┌─────────────────┐
│   Firebase      │
│   (Auth)        │
└────────┬────────┘
         │
         │ IdToken
         ▼
┌─────────────────────────────────────┐
│   Backend Server (Production)       │
│   backend-studio-ivssever...        │
│   /api/health, /api/ai-router, ..   │
└─────────────────────────────────────┘
         │
         ▼
    ┌────────────┐
    │ AI Models  │
    │ (Gemini,   │
    │ OpenAI, ..)│
    └────────────┘
```

---

## 📚 Tài Liệu Chi Tiết

Chi tiết đầy đủ xem tại thư mục: `HUONG-DAN-LIEN-KET/`

- 📖 **INTEGRATION_GUIDE_VI.md** - Hướng dẫn tích hợp chi tiết
- 🤖 **AIVY_CHATBOT_GUIDE_VI.md** - Hướng dẫn AIVY chatbot
- 🚀 **DEPLOYMENT_GUIDE_VI.md** - Hướng dẫn deploy
- 📋 **GUIDES_SUMMARY_VI.md** - Tóm tắt nhanh

---

## ✅ Quick Checklist

- [ ] Firebase config đã setup
- [ ] Backend URL có sẵn
- [ ] Test health endpoint thành công
- [ ] Login Firebase thành công
- [ ] Gọi API task thành công
- [ ] AIVY chatbot hiển thị
- [ ] Deploy frontend thành công

---

## 📞 Support

Nếu có vấn đề:
1. Check health: `/api/health`
2. Check logs frontend (F12 → Console)
3. Check logs backend (Firebase Console)
4. Liên hệ IVS Team

**Backend URL:** https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app  
**Frontend:** https://ivslearning.web.app

---

**✅ Backend Integration Guide - November 9, 2025**
