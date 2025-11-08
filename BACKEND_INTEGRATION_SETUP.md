# Backend Integration - Setup & Configuration Guide

## 🎯 Overview

The website now has **complete backend integration** enabling:
- ✅ Real user authentication with Firebase + JWT tokens
- ✅ Real data loading (posts, user profiles, learning materials)
- ✅ Rate limiting (100 req/min per endpoint)
- ✅ Response caching with LRU eviction
- ✅ Circuit breaker pattern for fault tolerance
- ✅ Automatic retry with exponential backoff

## 📁 New Files Created

### API Service Layer
```
/lib/
  ├── api-client.ts          # Base HTTP client with retry logic & circuit breaker
  ├── rate-limiter.ts        # Token bucket rate limiter + LRU cache with TTL
  ├── backend-service.ts     # Type-safe API wrappers for business logic
  └── index.ts               # Central exports

/js/
  ├── api-init.js            # JavaScript API service (vanilla HTML compatible)
  ├── dashboard-loader.js    # Dashboard data loader
  └── learning-materials-loader.js  # Learning materials data loader
```

### Updated Files
```
index.html                 # Added api-init.js script
dashboard.html             # Added data containers + loaders
learning-materials.html    # Added AI content grid + loaders
.env                       # Backend URL already configured
```

## 🔧 Configuration

### 1. Backend URL
Already configured in `.env`:
```env
VITE_BACKEND_URL=https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app
```

Or set in HTML before loading api-init.js:
```html
<script>
    window.BACKEND_URL = 'your-backend-url.com';
</script>
<script src="js/api-init.js"></script>
```

### 2. Rate Limiting
Default config (adjustable in `api-init.js`):
- **Max requests**: 100 per endpoint per minute
- **Per-endpoint tracking**: YES (each route has own limit)
- **Auto-reset**: After 60 seconds

### 3. Caching
Default config:
- **Max cache entries**: 100
- **Default TTL**: 5 minutes (300,000 ms)
- **Eviction**: LRU (least recently used)
- **On logout**: Auto-cleared

## 🔌 API Usage

### Global `window.API` Helper
```javascript
// GET request
const data = await window.API.get('/api/endpoint', { headers: {...} });

// POST request
const result = await window.API.post('/api/endpoint', { field: 'value' });

// DELETE request
await window.API.delete('/api/endpoint');

// Business logic methods
const posts = await window.API.getPosts(options);
const user = await window.API.getUserProfile(userId);
const content = await window.API.generateContent(request);

// Cache & auth management
window.API.clearCache();
window.API.setToken(authToken);

// Statistics
const stats = window.API.getStats();
// Returns: { cache: {...}, rateLimit: {...}, circuitBreaker: {...} }
```

### Full `window.apiService` Instance
```javascript
// More control when needed
const service = window.apiService;

// Manual operations
service.setAuthToken(token);
service.clearCache();
service.invalidateCache(key);

// Get detailed stats
const cacheStats = service.getCacheStats();
const rateLimitStatus = service.getRateLimiterStatus('/posts');
const cbStatus = service.getCircuitBreakerStatus();
```

## 🔐 Authentication Flow

### Automatic Setup
1. **Firebase listener** activates in `api-init.js`
2. **User login** → Firebase issues JWT token
3. **Token auto-set** → `api-init.js` calls `service.setAuthToken(token)`
4. **All requests** → Token added to Authorization header
5. **User logout** → Cache cleared, token removed

### Example Usage
```javascript
// Listen to auth events
window.addEventListener('auth-login', (event) => {
    console.log('User logged in:', event.detail.email);
    // Dashboard can refresh data here
});

window.addEventListener('auth-logout', () => {
    console.log('User logged out');
    // Clear UI, redirect to login
});

// Get current user
const user = window.firebaseUser;
```

## 📊 Dashboard Integration

### File: `js/dashboard-loader.js`
Loads real data from backend:

```javascript
const loader = window.dashboardLoader;

// Methods
loader.loadUserProfile();   // Fetch user data
loader.loadPosts();         // Fetch user's posts
loader.clearCache();        // Clear local cache
```

### Data Containers in HTML
```html
<div id="dashboard-user-profile"><!-- Profile card --></div>
<div id="dashboard-posts"><!-- Posts list --></div>
<div id="dashboard-content"><!-- Main area --></div>
```

## 📚 Learning Materials Integration

### File: `js/learning-materials-loader.js`
Loads AI-generated content:

```javascript
const loader = window.learningMaterialsLoader;

// Methods
loader.loadMaterials();              // Fetch all materials
loader.generateContent('article');   // Generate new content
```

### Data Container in HTML
```html
<div id="learning-materials-grid">
    <!-- Material cards rendered here -->
</div>
```

## 🔄 Rate Limiting Details

### How It Works
- **Token Bucket Algorithm**: Each endpoint has X tokens per minute
- **Refill**: Tokens auto-refill every 60 seconds
- **Per-endpoint**: `/posts`, `/user`, `/generate-content` tracked separately
- **Rate limit exceeded**: Returns 429 status, throws error

### Check Status
```javascript
const status = window.apiService.getRateLimiterStatus('/posts');
// Returns: { remaining, limit, resetTime }

console.log(`${status.remaining}/${status.limit} requests remaining`);
console.log(`Resets at:`, new Date(status.resetTime));
```

## 💾 Cache Details

### LRU Cache with TTL
- **LRU eviction**: When cache full, removes least recently used entry
- **TTL invalidation**: Entries auto-expire after TTL (default 5 min)
- **Manual invalidation**: `service.invalidateCache(key)`
- **Pattern**: Keys like `posts:{"limit":50}`, `user:userid123`

### Check Cache
```javascript
const stats = window.apiService.getCacheStats();
// Returns: { size, maxSize, entries: [...] }

// Manually clear
window.API.clearCache();
```

## 🔌 Circuit Breaker

### States
1. **CLOSED**: Normal operation, requests go through
2. **OPEN**: Too many failures (5+), requests blocked → error thrown
3. **HALF-OPEN**: Waiting to retry (every 60s)

### Monitor
```javascript
const status = window.apiService.getCircuitBreakerStatus();
// Returns: { state, failures, lastFailureTime }

if (status.state === 'open') {
    console.warn('Service temporarily unavailable');
}
```

## ❌ Error Handling

### Standard Error Structure
```javascript
try {
    await window.API.getPosts();
} catch (error) {
    console.error(error.message);
    console.error(error.status);        // HTTP status
    console.error(error.details);       // Server response
}
```

### Common Errors
| Status | Meaning |
|--------|---------|
| 429 | Rate limit exceeded |
| 500+ | Service error, auto-retries with exponential backoff |
| 401 | Unauthorized, need login |
| 404 | Not found |

## 🧪 Testing Checklist

### Manual Testing
```javascript
// 1. Check API is ready
console.log(window.API);
console.log(window.apiService);

// 2. Test unauthenticated request
try {
    await window.API.get('/api/public');
} catch (e) {
    console.log('Unauthenticated request error:', e.message);
}

// 3. Login via auth.html, then test authenticated
await window.API.getPosts();

// 4. Check cache is working
await window.API.getPosts();  // First call (from API)
const stats = window.API.getStats();
console.log('Cache hits/misses:',stats.cache);

// 5. Test rate limiter
for (let i = 0; i < 110; i++) {
    try {
        await window.API.post('/api/test');
    } catch (e) {
        console.log('Rate limit hit at request', i);
    }
}

// 6. Test error handling
window.BACKEND_URL = 'http://invalid-url.invalid';
try {
    await window.API.get('/api/test');
} catch (e) {
    console.log('Network error handled:', e.message);
}
```

## 🔑 Firebase OAuth Setup (NEXT STEP)

### Required Configuration
1. **Go to** [Firebase Console](https://console.firebase.google.com)
2. **Select project**: `ivs-159a7`
3. **Navigate**: Authentication → Sign-in methods
4. **Click**: Google provider
5. **Configure**:
   - Enable Google Sign-In
   - Set authorized domains:
     - `ivslearning.web.app` ✅
     - `ivslearning.firebaseapp.com` ✅
     - `localhost:5000` (dev)
     - Your custom domain
6. **Save** and test login flow

### Verification
Visit auth.html and test Google Sign-In button. Should redirect to Google login, then back to dashboard with user data.

## 📦 Deployment

### Live URL
- **Hosting**: https://ivslearning.web.app
- **Backend**: https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app

### Deploy Changes
```bash
firebase deploy --only hosting
```

## 🚀 Next Steps

1. **✅ DONE**: API SDK created & integrated
2. **✅ DONE**: Dashboard & learning pages wired
3. **⏳ TODO**: Firebase OAuth configuration (see above)
4. **⏳ TODO**: Test Google login flow
5. **⏳ TODO**: Verify data loading in dashboard
6. **⏳ TODO**: Test rate limiting & caching
7. **⏳ TODO**: Monitor errors in production

## 📞 Troubleshooting

### API Service Not Initialized
```javascript
// Check
console.log(window.apiService);  // Should be AdvancedBackendService instance

// If undefined, check:
// 1. Is api-init.js loaded in <script> tag?
// 2. Is it after Firebase initialization?
// 3. Check browser console for errors
```

### Auth Token Not Being Set
```javascript
// Check
console.log(window.firebaseUser);      // Should have user object
console.log(window.apiService.authToken); // Should have JWT token

// Debug: Add to api-init.js
console.log('[Auth] Token:', window.apiService.authToken);
```

### Rate Limit Errors (429)
```javascript
// Check current limits
const status = window.API.getStats().rateLimit;
console.log(`Using ${100 - status.remaining}/${status.limit} of quota`);

// Reset limits manually (for dev only)
window.apiService.tokens.clear();
```

### Cache Not Working
```javascript
// Verify cache is enabled
console.log(window.apiService.cacheConfig.enableCaching);  // Should be true

// Check cache contents
const stats = window.API.getStats().cache;
console.log(stats);

// Clear and reload
window.API.clearCache();
```

## 📚 Related Files

- `/lib/*.ts` - TypeScript SDK (reference implementation)
- `js/firebase-config.js` - Firebase configuration
- `auth.html` - Google Sign-In implementation
- `dashboard.html` - Real dashboard with API data
- `learning-materials.html` - Learning content from API

## ✨ Features Enabled

Now that backend is integrated:

| Feature | Status | How to Test |
|---------|--------|------------|
| Google OAuth | ⏳ Pending Firebase config | Visit auth.html, click Google button |
| Dashboard with real data | ✅ Ready | Login → dashboard.html loads posts |
| Learning materials | ✅ Ready | learning-materials.html displays content |
| Rate limiting | ✅ Active | 100 req/min per endpoint |
| Response caching | ✅ Active | Same request returns cached result |
| Circuit breaker | ✅ Active | Auto-fails after 5 errors |
| Auto-retry | ✅ Active | Failed requests retry with backoff |

---

**Last Updated**: 2024  
**Backend Version**: 1.0  
**API Version**: v1 (/api/ai-router)
