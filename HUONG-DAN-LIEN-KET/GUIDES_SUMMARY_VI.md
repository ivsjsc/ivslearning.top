# 📚 Tổng Hợp Tài Liệu - Backend Integration

**Danh Sách Toàn Bộ Hướng Dẫn Tích Hợp Backend**

---

## 🎯 Hướng Dẫn Chính

| Tài Liệu | Mục Đích | Link |
|----------|---------|------|
| **INTEGRATION_GUIDE_VI.md** | 📖 Hướng dẫn tích hợp chi tiết cho Web/App/Backend | [Đọc](./INTEGRATION_GUIDE_VI.md) |
| **AIVY_CHATBOT_GUIDE_VI.md** | 🤖 Hướng dẫn sử dụng Aivy chatbot với code ví dụ | [Đọc](./AIVY_CHATBOT_GUIDE_VI.md) |
| **DEPLOYMENT_GUIDE_VI.md** | 🚀 Hướng dẫn triển khai cho Web/Mobile/Backend | [Đọc](./DEPLOYMENT_GUIDE_VI.md) |

---

## 📋 Nội Dung Chi Tiết

### 1️⃣ INTEGRATION_GUIDE_VI.md
**Cho:** Lập trình viên Frontend/Backend & Mobile

Bao gồm:
- ✅ API Structure (3 endpoints chính)
- ✅ Firebase Authentication
- ✅ React/Next.js integration
- ✅ Flutter integration
- ✅ React Native integration
- ✅ Aivy chatbot basics
- ✅ Zalo OA integration
- ✅ Error handling

### 2️⃣ AIVY_CHATBOT_GUIDE_VI.md
**Cho:** Lập trình viên muốn tích hợp chatbot

Bao gồm:
- ✅ Aivy là gì?
- ✅ API structure
- ✅ Web component (React)
- ✅ Mobile widget (Flutter)
- ✅ CSS styling
- ✅ Advanced features
- ✅ Troubleshooting

### 3️⃣ DEPLOYMENT_GUIDE_VI.md
**Cho:** DevOps/Lập trình viên triển khai

Bao gồm:
- ✅ Frontend deployment (Vercel, Netlify, Firebase, AWS)
- ✅ Mobile deployment (Play Store, App Store)
- ✅ Backend deployment (Firebase App Hosting)
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ Monitoring & logging
- ✅ Pre-deployment checklist

---

## 🚀 Quick Start (5 phút)

### Bước 1: Clone & Setup
```bash
git clone https://github.com/ivsjsc/backend-studio-ivssever.git
cd backend-studio-ivssever
npm install
```

### Bước 2: Cấu Hình Firebase
```bash
# Tạo .env.local
cp .env.example .env.local

# Điền Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
```

### Bước 3: Test Backend
```bash
# Check health
curl https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/health

# Check models
curl https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/models
```

### Bước 4: Tích Hợp Frontend
```typescript
// Xem INTEGRATION_GUIDE_VI.md - Web Integration section
```

### Bước 5: Deploy
```bash
# Xem DEPLOYMENT_GUIDE_VI.md
```

---

## 🔗 API Endpoints

```
🟢 GET  /api/health              → Kiểm tra server
🟢 GET  /api/models              → Danh sách AI models
🟣 POST /api/ai-router           → Gọi AI services
🟣 POST /api/zalo/webhook        → Zalo webhook
```

---

## 🔐 Authentication

**Type:** Firebase Auth  
**Method:** Bearer Token

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/ai-router
```

---

## 🤖 AI Models Có Sẵn

| Model | Provider | Status | Pricing |
|-------|----------|--------|---------|
| **Gemini** | Google | ✅ | Free tier |
| **OpenAI** | OpenAI | ✅ | Pay-per-use |
| **Claude** | Anthropic | ✅ | Pay-per-use |
| **Grok** | xAI | ✅ | Early access |
| **DeepSeek** | DeepSeek | ✅ | Cheap |
| **Ollama** | Local | ✅ | Free (self-hosted) |

---

## 📱 Supported Platforms

| Platform | Status | Guide |
|----------|--------|-------|
| **Web (React)** | ✅ | INTEGRATION_GUIDE_VI.md |
| **Web (Next.js)** | ✅ | INTEGRATION_GUIDE_VI.md |
| **Web (Vue)** | ✅ | Use same API approach |
| **Mobile (Flutter)** | ✅ | INTEGRATION_GUIDE_VI.md |
| **Mobile (React Native)** | ✅ | INTEGRATION_GUIDE_VI.md |
| **Mobile (Native iOS)** | ✅ | Same API, different language |
| **Mobile (Native Android)** | ✅ | Same API, different language |
| **Zalo OA** | ✅ | INTEGRATION_GUIDE_VI.md |
| **Desktop (Electron)** | ✅ | Use Web approach |

---

## 🎯 Common Tasks

### I want to...

#### Chat với Aivy
→ Xem **AIVY_CHATBOT_GUIDE_VI.md** - Web Integration section

#### Tích hợp vào React app
→ Xem **INTEGRATION_GUIDE_VI.md** - Web Integration section

#### Tích hợp vào Flutter app
→ Xem **INTEGRATION_GUIDE_VI.md** - Mobile App Integration section

#### Deploy lên Vercel
→ Xem **DEPLOYMENT_GUIDE_VI.md** - Frontend Deployment section

#### Deploy lên Play Store
→ Xem **DEPLOYMENT_GUIDE_VI.md** - Mobile App Deployment section

#### Thiết lập Zalo OA
→ Xem **INTEGRATION_GUIDE_VI.md** - Zalo Official Account section

#### Debug lỗi API
→ Xem **INTEGRATION_GUIDE_VI.md** - Lỗi & Xử Lý section

#### Setup CI/CD
→ Xem **DEPLOYMENT_GUIDE_VI.md** - CI/CD Pipeline section

---

## 📞 API Documentation

### POST /api/ai-router

**Tasks:**
- `get_user_profile` - Lấy info user
- `get_posts` - Lấy danh sách bài viết
- `admin_override_check` - Check permission
- `generate_content` - Tạo nội dung giáo dục

**Models:**
- `gemini` (default)
- `openai`
- `claude`
- `grok`
- `deepseek`
- `ollama`

---

## 🛠️ Required Configurations

- [ ] Firebase project setup
- [ ] Firebase service account key
- [ ] AI API keys (ít nhất 1 trong 6 models)
- [ ] Zalo OA keys (nếu dùng Zalo)
- [ ] Domain CORS setup
- [ ] Environment variables

---

## 📈 Performance Tips

✅ **Frontend:**
- Use lazy loading
- Optimize images
- Cache API responses
- Minimize bundle size

✅ **Backend:**
- Use AI model fallback
- Add request retry logic
- Implement rate limiting
- Cache Firestore queries

✅ **Mobile:**
- Implement background sync
- Use local storage
- Optimize network calls
- Minimize battery usage

---

## 🔐 Security Best Practices

✅ **Frontend:**
- Không commit .env files
- Validate user input
- Use HTTPS only
- Enable CORS properly

✅ **Backend:**
- Verify Firebase tokens
- Implement rate limiting
- Validate request body
- Use security rules

✅ **Mobile:**
- Secure local storage
- Use certificate pinning
- Implement app signing
- Obfuscate code

---

## 📊 Monitoring

**Kiểm tra server:**
```bash
curl https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/health
```

**Xem logs:**
```bash
firebase functions:log --follow
```

**Firebase Console:**
https://console.firebase.google.com/

---

## 🆘 Troubleshooting Matrix

| Problem | Solution |
|---------|----------|
| **"Unauthorized" error** | Refresh Firebase token |
| **API timeout** | Tăng timeout, try another model |
| **Model not configured** | Check /api/models endpoint |
| **Firebase errors** | Verify FIREBASE_SERVICE_ACCOUNT_KEY |
| **Network issues** | Check CORS, firewall, API endpoint |

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Gemini AI Docs](https://ai.google.dev/docs)
- [OpenAI API Docs](https://platform.openai.com/docs/api-reference)
- [Flutter Firebase Guide](https://firebase.flutter.dev/)
- [React Firebase Guide](https://firebase.google.com/docs/web/setup)

---

## 📞 Support & Contact

**Issues?**
1. Check relevant guide: INTEGRATION_GUIDE_VI.md, AIVY_CHATBOT_GUIDE_VI.md, or DEPLOYMENT_GUIDE_VI.md
2. Review error handling section
3. Check Firebase logs
4. Report on GitHub

**Want to contribute?**
- Fork repo
- Create feature branch
- Submit PR

---

## 📝 Document History

| Date | Version | Changes |
|------|---------|---------|
| 2025-11-09 | 1.0 | Initial guides created |

---

**Last Updated:** 2025-11-09  
**Status:** ✅ Complete  
**Maintainer:** IVS Studio

---

**Happy Coding! 🎉🚀**
