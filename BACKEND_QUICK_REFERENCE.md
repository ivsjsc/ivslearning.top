# 🔗 Backend Integration - Quick Reference

## 🎯 Thông Tin Nhanh

| Item | Giá Trị |
|------|--------|
| **Backend URL** | `https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app` |
| **API Base** | `/api` |
| **Auth** | Firebase (Email, Google, Facebook, Phone) |
| **Status** | ✅ Production Ready |
| **Frontend** | `https://ivslearning.web.app` |

---

## 📡 Main Endpoints

```javascript
// 1. Health Check (không cần auth)
GET /api/health

// 2. AI Models (không cần auth)
GET /api/models

// 3. AI Tasks (cần Firebase token)
POST /api/ai-router
Headers: Authorization: Bearer {firebaseIdToken}
Body: { task: string, data: object }

// 4. Zalo Webhook
POST /api/zalo/webhook
```

---

## 💻 Code Template (React)

```javascript
// 1. Check Backend
async function testBackend() {
  const res = await fetch(
    'https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/health'
  );
  const data = await res.json();
  console.log(data);
}

// 2. Call AI Task
async function callAI(task, data) {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();
  
  const res = await fetch(
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
  
  return res.json();
}

// 3. Usage
const profile = await callAI('get_user_profile', {});
```

---

## 🛠️ Configuration Files

### `js/firebase-config.js`
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

### `js/api-config.js`
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

## 🚀 Common Tasks

### Get User Profile
```javascript
const profile = await callAI('get_user_profile', {});
```

### Get Posts
```javascript
const posts = await callAI('get_posts', { 
  limit: 10,
  orderBy: { field: 'createdAt', direction: 'desc' }
});
```

### Generate Content
```javascript
const content = await callAI('generate_content', {
  topic: 'Machine Learning',
  length: 'medium'
});
```

### Check Admin
```javascript
const isAdmin = await callAI('admin_override_check', {});
```

---

## ⚡ Test Commands

```bash
# 1. Health
curl https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/health

# 2. Models
curl https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/models

# 3. With Token (need to get from Firebase first)
curl -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"task":"get_user_profile","data":{}}' \
  https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/ai-router
```

---

## ❌ Troubleshooting

| Problem | Solution |
|---------|----------|
| 401 Unauthorized | Relogin Firebase |
| 403 Forbidden | Check user permissions |
| 500 Error | Check `/api/health` |
| CORS Error | Check domain whitelist |
| Timeout | Check network/VPN |

---

## 📚 Full Docs

- 📖 `HUONG-DAN-LIEN-KET/INTEGRATION_GUIDE_VI.md` - Complete guide
- 🤖 `HUONG-DAN-LIEN-KET/AIVY_CHATBOT_GUIDE_VI.md` - Chatbot guide
- 🚀 `HUONG-DAN-LIEN-KET/DEPLOYMENT_GUIDE_VI.md` - Deployment guide

---

**Last Updated:** November 9, 2025
