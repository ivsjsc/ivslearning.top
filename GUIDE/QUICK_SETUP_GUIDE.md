# 🚀 IVSLearning Quick Setup Guide

## 📍 System URLs

| Component | URL |
|-----------|-----|
| **Frontend** | https://ivslearning.web.app |
| **Backend** | https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app |
| **Learning API** | https://api.ivslearning.top/v1 |

## 🔄 Integration Flow

### 1️⃣ User Login (Frontend → Backend)

```javascript
// frontend/auth.html - User clicks "Login with Google"
async function initiateGoogleLogin() {
  // Call backend to get OAuth URL
  const response = await fetch(
    'https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/auth/google'
  );
  const { authUrl } = await response.json();
  window.location.href = authUrl; // Redirect to Google
}
```

### 2️⃣ OAuth Callback (Google → Backend)

```
Google redirects to:
https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/auth/google/callback?code=...&state=...
```

### 3️⃣ Backend Redirects with Token (Backend → Frontend)

```
Backend redirects to:
https://ivslearning.web.app/index-new.html?token=...&user=...
```

### 4️⃣ Frontend Fetches API Credentials (Frontend → Backend)

```javascript
// frontend/js/auth-flow.js
const response = await fetch(
  'https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/credentials/api-credentials',
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
const { apiKey, bearerToken, apiBaseUrl } = await response.json();
```

### 5️⃣ Frontend Calls Learning API (Frontend → API)

```javascript
// frontend/js/api-services.js
const courses = await apiClient.get(
  'https://api.ivslearning.top/v1/courses',
  {
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'X-API-Key': apiKey
    }
  }
);
```

## 🛠️ Quick Checklist

### Backend Requirements
- [ ] OAuth Google credentials configured
- [ ] CORS enabled for `https://ivslearning.web.app`
- [ ] Routes implemented:
  - `GET /auth/google` - Return OAuth URL
  - `GET /auth/google/callback` - Handle callback
  - `GET /credentials/api-credentials` - Return API key + bearer token
- [ ] Environment variables set:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `OAUTH_CALLBACK_URL`
  - `IVS_API_KEY`
  - `IVS_SECRET_KEY`

### Frontend Requirements
- [ ] Update `js/api-config.js` with actual backend URL
- [ ] Update `auth.html` with backend OAuth endpoint
- [ ] Create `js/auth-flow.js` with login logic
- [ ] Store API credentials in localStorage/sessionStorage
- [ ] All pages authenticated (redirect to auth.html if no token)

## 📝 File Updates Needed

### 1. Update `js/api-config.js`

```javascript
// Replace placeholder URLs
const IVS_API_CONFIG = {
  BASE_URL: process.env.VITE_IVS_API_URL || 'https://api.ivslearning.top/v1',
  BACKEND_URL: 'https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app',
  
  // ... rest of config
};
```

### 2. Create `js/auth-flow.js`

```javascript
const BACKEND_URL = 'https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app';

// Initiate Google login
async function initiateGoogleLogin() {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/google`);
    const { authUrl } = await response.json();
    window.location.href = authUrl;
  } catch (error) {
    console.error('Login failed:', error);
    alert('Failed to initiate login. Please try again.');
  }
}

// Handle OAuth callback
function handleOAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const userStr = params.get('user');

  if (token && userStr) {
    localStorage.setItem('apiToken', token);
    localStorage.setItem('user', userStr);
    
    fetchAPICredentials(token);
    window.location.href = '/my-learning.html';
  }
}

// Fetch API credentials from backend
async function fetchAPICredentials(token) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/credentials/api-credentials`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (!response.ok) throw new Error('Failed to fetch credentials');
    
    const credentials = await response.json();
    
    // Store credentials
    sessionStorage.setItem('apiKey', credentials.apiKey);
    sessionStorage.setItem('bearerToken', credentials.bearerToken);
    
    // Update API config
    if (window.IVS_API_CONFIG) {
      window.IVS_API_CONFIG.API_KEY = credentials.apiKey;
      window.IVS_API_CONFIG.BEARER_TOKEN = credentials.bearerToken;
      window.IVS_API_CONFIG.BASE_URL = credentials.apiBaseUrl;
    }
  } catch (error) {
    console.error('Failed to fetch API credentials:', error);
    // Redirect to login on failure
    window.location.href = '/auth.html?error=credentials_failed';
  }
}

// Logout
function logout() {
  localStorage.removeItem('apiToken');
  localStorage.removeItem('user');
  sessionStorage.removeItem('apiKey');
  sessionStorage.removeItem('bearerToken');
  window.location.href = '/auth.html';
}

// Check if user is logged in
function isLoggedIn() {
  return !!localStorage.getItem('apiToken');
}

// Get current user
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Handle callback on page load
if (window.location.search.includes('token=')) {
  handleOAuthCallback();
}
```

### 3. Update `auth.html`

```html
<!-- Add to auth.html body -->
<script src="js/auth-flow.js"></script>

<!-- Add login buttons -->
<div class="auth-buttons">
  <button onclick="initiateGoogleLogin()" class="btn-primary">
    🔐 Login with Google
  </button>
</div>

<!-- Handle logout redirect -->
<script>
  if (window.location.search.includes('logout')) {
    logout();
  }
</script>
```

### 4. Protect All Pages

```javascript
// Add to beginning of each page (index-new.html, courses.html, etc.)
<script src="js/auth-flow.js"></script>
<script>
  // Redirect to auth if not logged in
  if (!isLoggedIn() && !window.location.pathname.includes('auth.html')) {
    window.location.href = '/auth.html';
  }
  
  // Display user profile
  const user = getCurrentUser();
  if (user && document.getElementById('user-name')) {
    document.getElementById('user-name').textContent = user.name;
    if (document.getElementById('user-avatar')) {
      document.getElementById('user-avatar').src = user.picture;
    }
  }
</script>
```

## 🔒 Security Considerations

### ✅ Do's
- ✅ Store API keys in secure httpOnly cookies (backend)
- ✅ Send Bearer token in Authorization header (not in URL)
- ✅ Use HTTPS for all communications
- ✅ Validate tokens on backend before returning credentials
- ✅ Set CORS origin to specific domains only
- ✅ Implement CSRF protection
- ✅ Rotate API keys periodically
- ✅ Log all authentication events

### ❌ Don'ts
- ❌ Store API keys in localStorage (use sessionStorage if needed)
- ❌ Expose API keys in frontend code
- ❌ Send credentials in URL parameters
- ❌ Allow wildcard CORS (*) in production
- ❌ Log sensitive data (tokens, passwords)
- ❌ Use HTTP in production

## 🧪 Testing

### Test OAuth Flow
```bash
# 1. Go to frontend
https://ivslearning.web.app/auth.html

# 2. Click "Login with Google"
# 3. Should redirect to Google login
# 4. After approval, should redirect back to frontend with token
# 5. Should display user profile
```

### Test API Calls
```javascript
// Open browser console on authenticated page
const courses = await apiServices.courses.getAllCourses();
console.log(courses); // Should return course data
```

### Test Logout
```javascript
logout(); // Should clear all credentials and redirect to auth
```

## 🐛 Troubleshooting

### "OAuth URL not returning"
- Check backend is running at correct URL
- Check CORS headers on backend
- Check network tab in browser console
- Verify backend route `/auth/google` exists

### "Invalid state parameter"
- Ensure session is properly maintained
- Check if cookies are enabled
- Verify backend is stateful

### "Failed to fetch API credentials"
- Check bearer token is valid
- Verify backend `/credentials/api-credentials` route
- Check if API key is properly encrypted/stored
- Check backend logs for errors

### "CORS error from Learning API"
- Verify frontend URL is whitelisted in Learning API CORS config
- Check if bearer token is valid
- Ensure proper headers are sent

### "Still can't login after fixing above"
1. Clear localStorage/sessionStorage
2. Clear browser cookies
3. Hard refresh (Ctrl+Shift+R)
4. Try in incognito/private window
5. Check browser console for detailed errors

## 📊 Environment Variables

### Frontend (.env)
```bash
VITE_IVS_API_URL=https://api.ivslearning.top/v1
VITE_BACKEND_URL=https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app
NODE_ENV=production
```

### Backend (.env)
```bash
NODE_ENV=production
PORT=3000

GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
OAUTH_CALLBACK_URL=https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/auth/google/callback

IVS_API_URL=https://api.ivslearning.top/v1
IVS_API_KEY=your-api-key
IVS_SECRET_KEY=your-secret-key

CORS_ORIGIN=https://ivslearning.web.app
SESSION_SECRET=your-session-secret
JWT_SECRET=your-jwt-secret
```

## 🚀 Deployment Checklist

- [ ] Backend environment variables configured
- [ ] Frontend environment variables configured
- [ ] CORS properly configured on backend
- [ ] SSL/HTTPS certificates valid
- [ ] OAuth credentials registered with Google
- [ ] Callback URL whitelisted in Google Console
- [ ] Database connections working
- [ ] All API endpoints tested
- [ ] Logging configured
- [ ] Error monitoring setup (Sentry, etc.)
- [ ] Rate limiting configured
- [ ] Security headers set (HSTS, CSP, X-Frame-Options)

## 📚 Related Documentation

- **API Docs**: `API_DOCUMENTATION.md`
- **Backend Setup**: `BACKEND_SETUP.md`
- **Architecture**: `ARCHITECTURE.md`

## 🆘 Support

- **Backend Issues**: Check backend logs at `https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/logs`
- **API Issues**: Check `API_DOCUMENTATION.md`
- **Frontend Issues**: Check browser console (F12)
