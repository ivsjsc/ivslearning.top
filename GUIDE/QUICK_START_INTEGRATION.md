# 🚀 Quick Start - Integrate IVS Backend vào Ứng dụng của bạn

## 📋 5 Bước Setup (5 phút)

### Bước 1: Copy API Client Files

Sao chép 4 files này vào project của bạn:

```
src/lib/
  ├── api-client.ts              (HTTP client base)
  ├── backend-service.ts         (Type-safe API wrapper)
  ├── advanced-backend-service.ts (With caching & rate limiting)
  ├── request-limiter.ts         (Cache + Rate limit logic)
  └── index.ts                   (Main exports)
```

### Bước 2: Setup Environment Variables

Tạo file `.env.local`:

```bash
# Backend URL
REACT_APP_BACKEND_URL=https://backend.ivs.com
# hoặc http://localhost:3000 cho development

# Firebase (optional, if using Firebase auth)
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
```

### Bước 3: Initialize API Service

**app.tsx / main.tsx:**

```typescript
import { initializeIVSBackend } from '@/lib';

// Initialize once at app startup
const api = initializeIVSBackend({
  baseUrl: process.env.REACT_APP_BACKEND_URL!,
  enableCaching: true,
  enableRateLimiting: true,
});

export { api };
```

### Bước 4: Setup Authentication

**services/auth.ts:**

```typescript
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { api } from '@/app';

const auth = getAuth();

// Listen for auth state changes
onAuthStateChanged(auth, async user => {
  if (user) {
    // Set token for authenticated requests
    const token = await user.getIdToken();
    api.setAuthToken(token);
  } else {
    // Clear token and cache on logout
    api.setAuthToken(null);
    api.clearCache();
  }
});
```

### Bước 5: Use in Components

**components/PostsList.tsx:**

```typescript
import { useEffect, useState } from 'react';
import { api } from '@/app';

export function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPosts()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.content}</li>
      ))}
    </ul>
  );
}
```

---

## 🎯 Common Use Cases

### Lấy danh sách bài đăng

```typescript
// Get all posts
const allPosts = await api.getPosts();

// Get posts from specific author
const myPosts = await api.getPostsByAuthor('user-123', 50);

// Get with custom filters
const filteredPosts = await api.getPosts({
  filters: [
    { field: 'authorId', op: '==', value: 'user-123' },
    { field: 'clientSource', op: '==', value: 'web' },
  ],
  limit: 20,
  orderBy: { field: 'createdAt', direction: 'desc' },
});
```

### Lấy thông tin user

```typescript
const user = await api.getUserProfile('user-123');
console.log(user.displayName);  // 'John Doe'
console.log(user.role);         // 'teacher'
console.log(user.email);        // 'john@example.com'
```

### Tạo content giáo dục

```typescript
const content = await api.generateContent({
  topic: 'Simple Past Tense',
  vocabulary: ['was', 'were', 'went', 'did'],
  grammar: 'Usage of Simple Past',
});

console.log(content.quiz);      // Quiz questions
console.log(content.dialogue);  // Dialogue scenario
```

### Xử lý lỗi

```typescript
import { ApiError } from '@/lib';

try {
  const user = await api.getUserProfile('user-123');
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      console.log('User not found');
    } else if (error.status === 401) {
      console.log('Not authenticated');
    } else {
      console.error(`API Error: ${error.message}`);
    }
  }
}
```

---

## 🔍 Debugging

### Xem status API

```typescript
// Rate limiter
const limiter = api.getRateLimiterStatus();
console.log('Requests remaining:', limiter.remaining);

// Cache
const cache = api.getCacheStats();
console.log('Cache entries:', cache.entries);

// Circuit breaker
const cb = api.getCircuitBreakerStatus();
console.log('Circuit state:', cb.state);
```

### Enable console logging

File `api-client.ts` có sẵn console.log. Thêm vào để debug:

```typescript
// In api-client.ts executeRequest method:
console.log(`[API] ${options.method || 'GET'} ${url}`);
console.log(`[API] Response:`, data);
```

### Network debugging (Browser DevTools)

1. Mở **DevTools** > **Network** tab
2. Gọi API
3. Xem request/response headers
4. Kiểm tra token trong **Authorization** header

---

## ⚙️ Advanced Configuration

### Tùy chỉnh Rate Limiting

```typescript
const api = initializeIVSBackend({
  baseUrl: process.env.REACT_APP_BACKEND_URL!,
  rateLimitConfig: {
    maxRequests: 200,      // Thay từ 100
    windowMs: 60000,       // 1 minute
    perEndpoint: true,     // Per-endpoint limiting
  },
});
```

### Tùy chỉnh Caching

```typescript
const api = initializeIVSBackend({
  baseUrl: process.env.REACT_APP_BACKEND_URL!,
  cacheConfig: {
    maxSize: 200,          // Max 200 entries (default 100)
    defaultTtl: 10 * 60 * 1000, // 10 minutes (default 5)
    enableCaching: true,
  },
});
```

### Disable Caching (Dev Mode)

```typescript
const api = initializeIVSBackend({
  baseUrl: process.env.REACT_APP_BACKEND_URL!,
  enableCaching: false, // Always fetch fresh data
});
```

---

## 🧪 Testing

### Unit Test Example

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AdvancedBackendService } from '@/lib/advanced-backend-service';

describe('API Service', () => {
  let api: AdvancedBackendService;

  beforeEach(() => {
    api = new AdvancedBackendService({
      baseUrl: 'http://localhost:3000',
    });
  });

  it('should fetch posts', async () => {
    const posts = await api.getPosts();
    expect(Array.isArray(posts)).toBe(true);
  });

  it('should cache responses', async () => {
    const posts1 = await api.getPosts();
    const cache1 = api.getCacheStats();
    const posts2 = await api.getPosts();
    const cache2 = api.getCacheStats();

    expect(posts1).toEqual(posts2);
    expect(cache2.size).toBeGreaterThan(cache1.size);
  });

  it('should handle errors', async () => {
    expect(() => api.getUserProfile('invalid-id')).rejects.toThrow();
  });
});
```

---

## 📦 TypeScript Types

Tất cả requests/responses đều typed:

```typescript
import type {
  GetUserProfileResponse,
  GetPostsRequest,
  GenerateContentRequest,
  GenerateContentResponse,
} from '@/lib';

// Auto-complete & type safety
const request: GetPostsRequest = {
  filters: [
    { field: 'authorId', op: '==', value: 'user-123' }, // ✓ Typed
  ],
  limit: 50,
};

const posts = await api.getPosts(request); // posts is Post[]
```

---

## ❓ FAQ

**Q: Làm sao để logout?**  
A: `api.setAuthToken(null); api.clearCache();`

**Q: Cache bao lâu?**  
A: 5 phút default. Tùy chỉnh trong config hoặc manual invalidate: `api.invalidateCache('/posts');`

**Q: Rate limit hết?**  
A: Client auto-retry. Check `getRateLimiterStatus()` để biết còn bao nhiêu request.

**Q: Cách handle 401 token expired?**  
A: Redirect to login hoặc refresh token (see SECURITY_GUIDE.md)

**Q: Production URL là gì?**  
A: Set trong `REACT_APP_BACKEND_URL` env var

---

## 📚 More Resources

- [Full Integration Guide](./INTEGRATION_GUIDE.md)
- [Security & Auth Guide](./SECURITY_GUIDE.md)
- [API Documentation](./PRODUCTION_README.md)
- [React Example](./EXAMPLE_REACT_INTEGRATION.tsx)

---

## 🆘 Support

Nếu gặp vấn đề:

1. **Check network**: Network tab in DevTools
2. **Check auth**: Verify token là valid
3. **Check logs**: Console logs cho debugging
4. **Check endpoint**: Verify endpoint URL đúng
5. **Check environment**: `.env.local` variables set đúng
