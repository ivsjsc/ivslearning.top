# 🚀 HƯỚNG DẪN TÍCH HỢP BACKEND - Web/App/Chatbot

**Ngôn ngữ:** Tiếng Việt  
**Tác giả:** IVS Studio  
**Ngày:** 2025-11-09  
**Trạng thái:** ✅ Hoàn thành

---

## 📋 MỤC LỤC

1. [Tổng Quan](#tổng-quan)
2. [Cấu Trúc API](#cấu-trúc-api)
3. [Xác Thực & Phân Quyền](#xác-thực--phân-quyền)
4. [Web Integration](#web-integration)
5. [Mobile App Integration](#mobile-app-integration)
6. [Aivy Chatbot Integration](#aivy-chatbot-integration)
7. [Zalo Official Account](#zalo-official-account)
8. [Lỗi & Xử Lý](#lỗi--xử-lý)

---

## 🎯 Tổng Quan

### Backend URL (Production)
```
https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app
```

### API Base
```
https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api
```

### Các Endpoints Chính
| Endpoint | Phương Thức | Mô Tả |
|----------|-----------|-------|
| `/api/health` | GET | Kiểm tra trạng thái server |
| `/api/models` | GET | Danh sách AI models |
| `/api/ai-router` | POST | Gọi các tác vụ AI |
| `/api/zalo/webhook` | POST | Webhook cho Zalo OA |

---

## 🏗️ Cấu Trúc API

### 1️⃣ GET `/api/health` - Kiểm Tra Server

**Yêu cầu:**
```bash
curl https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/health
```

**Phản hồi thành công (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-11-09T10:30:00.000Z",
  "responseTime": "15ms",
  "checks": {
    "api": "ok",
    "environment": "ok",
    "firebase": "ok",
    "ai_services": "ok",
    "errors": []
  },
  "version": "1.0.0",
  "environment": "production"
}
```

### 2️⃣ GET `/api/models` - Danh Sách AI Models

**Yêu cầu:**
```bash
curl https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/models
```

**Phản hồi (200):**
```json
{
  "status": "ok",
  "message": "5 models configured and ready.",
  "configured_models": 5,
  "total_models": 6,
  "models": [
    {
      "name": "Gemini",
      "provider": "Google",
      "status": "configured",
      "configured": true,
      "description": "Fast, free tier available",
      "docs": "https://ai.google.dev/",
      "pricing": "Free tier: 60 req/min"
    },
    {
      "name": "OpenAI",
      "provider": "OpenAI",
      "status": "configured",
      "configured": true,
      "description": "Industry standard",
      "pricing": "Pay-per-use"
    }
    // ... thêm models khác
  ],
  "fallback_order": ["Gemini", "OpenAI", "Claude", "DeepSeek", "Grok"]
}
```

### 3️⃣ POST `/api/ai-router` - Gọi AI Services

**Tác vụ có sẵn:**
- `get_user_profile` - Lấy thông tin user
- `get_posts` - Lấy danh sách bài viết
- `admin_override_check` - Kiểm tra quyền admin
- `generate_content` - Tạo nội dung giáo dục

---

## 🔐 Xác Thực & Phân Quyền

### Firebase Authentication

Backend sử dụng **Firebase Authentication** cho xác thực người dùng.

#### Các bước thiết lập:

**1. Web/React App:**
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Khởi tạo Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // ... cấu hình khác
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login
const userCredential = await signInWithEmailAndPassword(
  auth, 
  "user@example.com", 
  "password123"
);

// Lấy ID Token để gửi cho backend
const token = await userCredential.user.getIdToken();
```

**2. Mobile App (Flutter/React Native):**
```dart
// Flutter example
import 'package:firebase_auth/firebase_auth.dart';

final auth = FirebaseAuth.instance;
final credential = await auth.signInWithEmailAndPassword(
  email: 'user@example.com',
  password: 'password123',
);

final token = await credential.user?.getIdToken();
```

**3. Gửi Token với Request:**
```bash
curl -X POST https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/ai-router \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -d '{"task": "get_user_profile", "data": {"userId": "user123"}}'
```

### Roles & Quyền

| Role | Quyền |
|------|-------|
| **user** | Đọc bài viết, chat với Aivy, xem profile |
| **teacher** | Tạo bài viết, quản lý học sinh, phê duyệt nội dung |
| **admin** | Quản lý toàn bộ hệ thống, xóa dữ liệu |
| **superadmin** | Toàn quyền hệ thống |

---

## 💻 Web Integration

### React/Next.js Example

#### 1. Cài đặt Dependencies
```bash
npm install firebase axios zod
```

#### 2. Khởi Tạo Firebase & API Client
```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

#### 3. Tạo API Client
```typescript
// src/lib/api-client.ts
import axios from 'axios';
import { auth } from './firebase';

const API_BASE = 'https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

// Thêm token vào mỗi request
apiClient.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Failed to get token:', error);
  }
  return config;
});
```

#### 4. Tạo Service Hooks
```typescript
// src/hooks/useBackendService.ts
import { apiClient } from '@/lib/api-client';

export const useBackendService = () => {
  // Lấy thông tin user
  const getUserProfile = async (userId: string) => {
    const response = await apiClient.post('/ai-router', {
      task: 'get_user_profile',
      data: { userId },
    });
    return response.data;
  };

  // Lấy danh sách bài viết
  const getPosts = async (filters = [], limit = 20) => {
    const response = await apiClient.post('/ai-router', {
      task: 'get_posts',
      data: { filters, limit },
    });
    return response.data.posts;
  };

  return { getUserProfile, getPosts };
};
```

#### 5. Sử dụng trong Component
```typescript
// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useBackendService } from '@/hooks/useBackendService';

export default function Dashboard() {
  const { user } = useAuth();
  const { getUserProfile, getPosts } = useBackendService();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        const postsData = await getPosts();
        setPosts(postsData);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
```

#### 6. Environment Variables (.env.local)
```bash
REACT_APP_FIREBASE_API_KEY=AIzaSyClxGvAQLxX0ZIHIstEeHM8GzONkFcw9RM
REACT_APP_FIREBASE_AUTH_DOMAIN=ivs-159a7.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=ivs-159a7
REACT_APP_FIREBASE_STORAGE_BUCKET=ivs-159a7.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123def456
REACT_APP_API_BASE=https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api
```

---

## 📱 Mobile App Integration

### Flutter Example

#### 1. Cài Dependencies (pubspec.yaml)
```yaml
dependencies:
  flutter:
    sdk: flutter
  firebase_core: ^3.0.0
  firebase_auth: ^5.0.0
  http: ^1.1.0
  dio: ^5.3.0

dev_dependencies:
  flutter_test:
    sdk: flutter
```

#### 2. Firebase Initialization
```dart
// lib/main.dart
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}
```

#### 3. API Client Service
```dart
// lib/services/api_service.dart
import 'package:firebase_auth/firebase_auth.dart';
import 'package:dio/dio.dart';

class ApiService {
  static const String baseUrl = 
    'https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api';

  final Dio _dio = Dio();
  final FirebaseAuth _auth = FirebaseAuth.instance;

  ApiService() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          try {
            User? user = _auth.currentUser;
            if (user != null) {
              String? token = await user.getIdToken();
              options.headers['Authorization'] = 'Bearer $token';
            }
          } catch (e) {
            print('Failed to get token: $e');
          }
          return handler.next(options);
        },
      ),
    );
  }

  // Lấy user profile
  Future<Map<String, dynamic>> getUserProfile(String userId) async {
    try {
      final response = await _dio.post(
        '$baseUrl/ai-router',
        data: {
          'task': 'get_user_profile',
          'data': {'userId': userId},
        },
      );
      return response.data;
    } catch (e) {
      print('Error: $e');
      rethrow;
    }
  }

  // Lấy danh sách bài viết
  Future<List<dynamic>> getPosts({List? filters, int? limit}) async {
    try {
      final response = await _dio.post(
        '$baseUrl/ai-router',
        data: {
          'task': 'get_posts',
          'data': {
            'filters': filters ?? [],
            'limit': limit ?? 20,
          },
        },
      );
      return response.data['posts'] ?? [];
    } catch (e) {
      print('Error: $e');
      rethrow;
    }
  }
}
```

#### 4. Sử Dụng Service trong Widget
```dart
// lib/screens/posts_screen.dart
import 'package:flutter/material.dart';
import '../services/api_service.dart';

class PostsScreen extends StatefulWidget {
  @override
  State<PostsScreen> createState() => _PostsScreenState();
}

class _PostsScreenState extends State<PostsScreen> {
  final ApiService _apiService = ApiService();
  late Future<List<dynamic>> _postsFuture;

  @override
  void initState() {
    super.initState();
    _postsFuture = _apiService.getPosts();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Posts')),
      body: FutureBuilder<List<dynamic>>(
        future: _postsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final posts = snapshot.data ?? [];

          return ListView.builder(
            itemCount: posts.length,
            itemBuilder: (context, index) {
              final post = posts[index];
              return Card(
                margin: EdgeInsets.all(8),
                child: ListTile(
                  title: Text(post['title'] ?? 'No title'),
                  subtitle: Text(post['content'] ?? 'No content'),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
```

### React Native Example
```javascript
// lib/api/client.js
import axios from 'axios';
import { auth } from './firebase';

const API_BASE = 'https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

apiClient.interceptors.request.use(async (config) => {
  try {
    const user = auth().currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Token error:', error);
  }
  return config;
});
```

---

## 🤖 Aivy Chatbot Integration

### Aivy là gì?

**Aivy** là AI chatbot hỗ trợ học tiếng Anh, tích hợp vào ứng dụng để:
- ✅ Giải thích ngữ pháp & từ vựng
- ✅ Hỗ trợ luyện tập phát âm
- ✅ Tạo bài tập & kiểm tra
- ✅ Trả lời câu hỏi học tập

### 1. Gọi Aivy Chatbot

**Endpoint:**
```
POST /api/ai-router
```

**Request:**
```bash
curl -X POST https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/ai-router \
  -H "Content-Type: application/json" \
  -d '{
    "task": "admin_override_check",
    "data": {
      "userId": "user-123",
      "action": "chat_with_aivy"
    },
    "model_preference": "gemini"
  }'
```

**Phản hồi (200):**
```json
{
  "canOverride": true,
  "modelUsed": "gemini"
}
```

### 2. Tạo Content Giáo Dục

**Request:**
```bash
curl -X POST https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/ai-router \
  -H "Content-Type: application/json" \
  -d '{
    "task": "generate_content",
    "data": {
      "topic": "Present Simple Tense",
      "vocabulary": ["always", "usually", "sometimes", "never"],
      "grammar": "Present Simple + Adverbs of Frequency"
    },
    "model_preference": "gemini"
  }'
```

**Phản hồi (200):**
```json
{
  "quiz": {
    "questions": [
      {
        "id": "q1",
        "type": "multiple_choice",
        "question": "I ___ to school every day.",
        "options": ["go", "goes", "going", "gone"],
        "correctAnswer": "go"
      }
    ]
  },
  "dialogue": {
    "title": "Daily Routine Conversation",
    "lines": [
      "A: What do you do every morning?",
      "B: I usually wake up at 7 AM..."
    ]
  },
  "modelUsed": "gemini"
}
```

### 3. React Component cho Chatbot

```typescript
// src/components/AivyChatbot.tsx
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AivyChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Thêm message từ user
    const userMessage: Message = {
      role: 'user',
      content: input,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Gọi AI Router
      const response = await apiClient.post('/ai-router', {
        task: 'admin_override_check',
        data: {
          userId: 'current-user-id',
          action: `chat: ${input}`,
        },
        model_preference: 'gemini',
      });

      // Thêm response từ Aivy
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response || 'Xin lỗi, tôi không hiểu.',
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Có lỗi xảy ra. Vui lòng thử lại.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aivy-chatbot">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="message assistant">Aivy đang suy nghĩ...</div>}
      </div>

      <div className="input-group">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Hỏi Aivy..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          Gửi
        </button>
      </div>
    </div>
  );
};
```

---

## 📲 Zalo Official Account

### Webhook Setup

Backend tích hợp với Zalo OA để nhận messages từ người dùng.

#### 1. Cấu Hình Zalo OA

**Tại Zalo Business:**
1. Vào **Zalo Official Account → Settings**
2. Tìm **Webhook URL**
3. Nhập: `https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/zalo/webhook`
4. Lấy **Webhook Secret** (dùng để xác thực)

#### 2. Environment Variables
```bash
ZALO_ACCESS_TOKEN=your_access_token
ZALO_SECRET_KEY=your_secret_key
ZALO_OA_ID=your_oa_id
ZALO_WEBHOOK_URL=https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/zalo/webhook
ZALO_WEBHOOK_SECRET=your_webhook_secret
ZALO_API_BASE_URL=https://openapi.zalo.me/v3.0
ZALO_API_TIMEOUT=30000
ZALO_RETRY_ATTEMPTS=3
```

#### 3. Events Được Xử Lý

| Event | Mô Tả |
|-------|-------|
| `user_follow_oa` | Người dùng follow OA |
| `user_unfollow_oa` | Người dùng unfollow OA |
| `user_send_text` | Nhận tin nhắn text |
| `user_send_image` | Nhận hình ảnh |
| `user_send_video` | Nhận video |
| `user_send_audio` | Nhận audio |
| `user_send_file` | Nhận file |

#### 4. Xử Lý Message

```typescript
// src/lib/zalo-handler.ts
import { adminFirestore } from './firebase-admin';

export async function handleZaloMessage(userId: string, message: string) {
  // Lưu message vào Firestore
  const db = adminFirestore();
  await db.collection('zalo_messages').add({
    userId,
    message,
    timestamp: new Date(),
  });

  // Gọi Aivy để trả lời
  const aiResponse = await callAivy(message);
  
  // Gửi lại cho user
  return sendZaloMessage(userId, aiResponse);
}
```

---

## ❌ Lỗi & Xử Lý

### Các Lỗi Thường Gặp

#### 1. 401 Unauthorized
**Nguyên nhân:** Token không hợp lệ hoặc hết hạn

**Giải pháp:**
```javascript
// Refresh token
const newToken = await user.getIdToken(true);
apiClient.defaults.headers.Authorization = `Bearer ${newToken}`;
```

#### 2. 503 Service Unavailable
**Nguyên nhân:** Firebase không được cấu hình

**Giải pháp:** Kiểm tra `FIREBASE_SERVICE_ACCOUNT_KEY` trong environment variables

#### 3. 500 Internal Server Error
**Nguyên nhân:** Lỗi trong xử lý request

**Giải pháp:**
```bash
# Kiểm tra logs
firebase functions:log --follow

# Hoặc trong App Hosting
# Firebase Console → App Hosting → Details → Logs
```

#### 4. Network Timeout
**Nguyên nhân:** Request quá lâu hoặc mất kết nối

**Giải pháp:**
```javascript
// Tăng timeout
apiClient.defaults.timeout = 60000; // 60 seconds

// Thêm retry logic
const maxRetries = 3;
let retries = 0;
while (retries < maxRetries) {
  try {
    return await apiClient.post('/ai-router', data);
  } catch (error) {
    retries++;
    if (retries >= maxRetries) throw error;
    await delay(1000);
  }
}
```

### Error Response Format

Tất cả lỗi trả về format:
```json
{
  "error": "Mô tả lỗi",
  "details": "Chi tiết lỗi nếu có"
}
```

---

## 🧪 Testing & Debug

### Postman Collection

**GET /api/health**
```
GET https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/health
```

**GET /api/models**
```
GET https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/models
```

**POST /api/ai-router (Get Posts)**
```
POST https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/ai-router
Content-Type: application/json

{
  "task": "get_posts",
  "data": {
    "filters": [],
    "limit": 10
  }
}
```

### cURL Commands

```bash
# Test health
curl -X GET https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/health

# Test models
curl -X GET https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/models

# Test AI Router (cần token Firebase)
curl -X POST https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/ai-router \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"task": "get_posts", "data": {}}'
```

---

## 📞 Support & Liên Hệ

- **API Status:** [Firebase Console](https://console.firebase.google.com/)
- **Documentation:** Xem `FIREBASE_FIX_COMPLETE.md` và `FIREBASE_CONFIG_FIX.md`
- **Issues:** Báo cáo lỗi tại GitHub issues

---

## ✅ Checklist Trước Deployment

- [ ] Firebase initialized đúng
- [ ] API keys configured
- [ ] Webhook setup cho Zalo
- [ ] Environment variables set
- [ ] CORS configured nếu cần
- [ ] Database migrations done
- [ ] Security rules deployed
- [ ] Health check passing
- [ ] Models endpoint returning data
- [ ] Error handling tested

---

**Happy Coding! 🎉**
