# 🚀 Backend Integration - Quick Start

## What Just Changed?

Your website now has **real backend integration** with:
- ✅ Real user data loading
- ✅ API rate limiting (100 req/min)
- ✅ Automatic caching with LRU eviction
- ✅ Circuit breaker for fault tolerance
- ✅ Automatic retry with exponential backoff

## 📋 Files Changed/Created

### New JavaScript Files
```
js/api-init.js                    - API service initialization
js/dashboard-loader.js            - Dashboard data loader  
js/learning-materials-loader.js   - Learning materials loader
js/api-test-suite.js              - Testing & debugging tools
```

### New TypeScript SDK (Reference)
```
lib/api-client.ts                 - HTTP client with retry logic
lib/rate-limiter.ts               - Rate limiting + caching
lib/backend-service.ts            - Type-safe API wrappers
lib/index.ts                       - SDK exports
```

### Updated HTML Files
```
index.html                        - Added api-init.js script
dashboard.html                    - Added data containers + loader
learning-materials.html           - Added AI content section + loader
```

### New Guides
```
BACKEND_INTEGRATION_SETUP.md      - Complete setup guide
BACKEND_INTEGRATION_QUICKSTART.md - This file
```

## 🔧 How It Works

### 1. Automatic Setup
When you visit the website:
1. `api-init.js` initializes `window.apiService`
2. Firebase listener auto-activates
3. When user logs in → token auto-set
4. Dashboard/materials pages auto-load data

### 2. Making API Calls
```javascript
// Simple way
const posts = await window.API.getPosts();
const user = await window.API.getUserProfile(userId);

// Or direct HTTP
const data = await window.API.get('/api/endpoint');
```

### 3. What Happens Behind the Scenes
- ✅ Request is rate-limited (counts toward 100/min)
- ✅ Cache checked first (returns instant if cached)
- ✅ Token added to request (if user logged in)
- ✅ Request sent with timeout & retry logic
- ✅ Response cached for 5 minutes
- ✅ Circuit breaker monitors failures

## 🧪 Test It Now

### In Browser DevTools Console
```javascript
// Load the test suite
const script = document.createElement('script');
script.src = '/js/api-test-suite.js';
document.head.appendChild(script);

// Then run tests
runAllTests();
```

Or copy/paste in console:
```javascript
// Check if API is ready
console.log(window.apiService);
console.log(window.API);

// Check auth status
console.log(window.firebaseUser);

// Test API call
await window.API.getPosts().then(posts => console.log(posts));
```

## 🔑 Firebase OAuth Setup (REQUIRED)

The **most important next step**:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `ivs-159a7`
3. Go to **Authentication** → **Sign-in method**
4. **Enable Google** provider
5. Add authorized domains:
   - `ivslearning.web.app`
   - `ivslearning.firebaseapp.com`
6. Save and test!

**Without this step**, Google login button won't work.

## 📊 Dashboard Features (Now Live)

Visit `/dashboard.html` to see:

- **User Profile Card**: Name, email, avatar, stats
- **Posts List**: Shows user's posts with:
  - Title, content preview
  - Creation date
  - View & like counts
  - Status badge
- **Quick Stats**: Total posts, views, likes
- **Loading State**: Shows spinner while fetching

## 📚 Learning Materials Features (Now Live)

Visit `/learning-materials.html` to see:

- **AI-Generated Content**: Materials from backend
- **Material Cards**: With gradients based on type:
  - 📄 Articles
  - 🎥 Videos
  - ✏️ Quizzes
  - 🎮 Interactive
  - 🤖 AI-generated
  - 📚 General materials
- **Search & Filter**: (Will be implemented)
- **Login Required**: Redirects if not authenticated

## 🔄 Rate Limiting (Active)

Default: **100 requests per minute per endpoint**

When you hit the limit:
```javascript
try {
    await window.API.getPosts();
} catch (error) {
    console.error(error); // "Rate limit exceeded"
}
```

Check remaining:
```javascript
const status = window.API.getStats().rateLimit;
console.log(`${status.remaining}/${status.limit} left`);
```

## 💾 Caching (Active)

Default: **Cache up to 100 entries, 5 min TTL**

Same request twice:
```javascript
// Request 1: Hits API, takes ~500ms
await window.API.getPosts();

// Request 2: Returns from cache instantly
await window.API.getPosts();
```

Check cache:
```javascript
const stats = window.API.getStats().cache;
console.log(`${stats.size}/${stats.maxSize} cached`);
console.log(stats.entries); // List of cache keys
```

Clear cache:
```javascript
window.API.clearCache();
```

## 🔐 Authentication

Automatic - no code needed!

```javascript
// Listen to login
window.addEventListener('auth-login', (event) => {
    console.log('Logged in:', event.detail.email);
    // Reload dashboard data here if needed
});

// Listen to logout
window.addEventListener('auth-logout', () => {
    console.log('Logged out');
});

// Check current user
console.log(window.firebaseUser); // Or null if not logged in
```

## 🎯 Testing Workflow

### Step 1: Verify API is Ready
```javascript
console.log(window.apiService);  // Should be AdvancedBackendService
console.log(window.API);         // Should be object with methods
```

### Step 2: Check Backend URL
```javascript
console.log(window.BACKEND_URL);
// Should be: https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app
```

### Step 3: Test Public Endpoint (No Auth Required)
```javascript
try {
    const data = await window.API.get('/api/health');
    console.log('Backend is reachable:', data);
} catch (error) {
    console.log('Backend offline:', error.message);
}
```

### Step 4: Login & Test Protected Endpoint
1. Visit `/auth.html`
2. Click "Sign in with Google"
3. After login, go to `/dashboard.html`
4. Check console - should see posts loading

### Step 5: Run Full Test Suite
```javascript
// Load test suite
const s = document.createElement('script');
s.src = '/js/api-test-suite.js';
document.head.appendChild(s);

// After it loads (2 seconds)
runAllTests();
```

## 🆘 Troubleshooting

### API Service Not Loaded
```javascript
// Check if script is loaded
if (!window.apiService) {
    console.log('api-init.js not loaded!');
    // Solution: Refresh page, check browser console for errors
}
```

### Backend Not Reachable
```javascript
// Check URL
console.log(window.BACKEND_URL);

// Try direct fetch
fetch(window.BACKEND_URL + '/api/health')
    .then(r => r.json())
    .then(console.log)
    .catch(e => console.error('Backend offline:', e));
```

### No User Logged In
```javascript
console.log(window.firebaseUser); // null?
// Solution: Visit auth.html and click Google Sign-In
```

### Rate Limited (429 Error)
```javascript
const remaining = window.API.getStats().rateLimit.remaining;
console.log(`Requests remaining: ${remaining}`);
// Solution: Wait 60 seconds for rate limit to reset
```

### Cache Not Working
```javascript
// Check if enabled
console.log(window.apiService.cacheConfig.enableCaching);

// Force clear
window.API.clearCache();

// Verify it cleared
const stats = window.API.getStats().cache;
console.log(stats); // Should show size: 0
```

## 📞 Support

For issues with:
- **Firebase Auth**: Check [Firebase Docs](https://firebase.google.com/docs/auth)
- **API Endpoints**: Check backend documentation
- **Rate Limiting**: Adjust config in `js/api-init.js`
- **Caching**: Use `window.API.clearCache()`

## ✨ What's Next

1. **Firebase OAuth** ← DO THIS FIRST
2. Test Google login at `/auth.html`
3. Verify dashboard loads data
4. Monitor performance & errors
5. Adjust rate limits/cache TTL if needed
6. Add error tracking (Sentry, etc)
7. Scale backend if needed

## 📈 Production Checklist

- [ ] Firebase OAuth configured & tested
- [ ] Backend URL verified production-ready
- [ ] Dashboard loads posts without errors
- [ ] Learning materials page displays content
- [ ] Google login flow works end-to-end
- [ ] Rate limiting doesn't block legitimate users
- [ ] Cache improving performance (measure with DevTools)
- [ ] Error handling shows user-friendly messages
- [ ] Mobile responsive works on auth & dashboard
- [ ] Analytics tracking working

---

**Questions?** Check `BACKEND_INTEGRATION_SETUP.md` for detailed documentation.

**Status**: ✅ Backend integration complete, awaiting Firebase OAuth configuration.

**Live Site**: https://ivslearning.web.app
