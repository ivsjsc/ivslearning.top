# Backend App Hosting Setup Guide

## 📋 Overview

Your Backend App Hosting serves as:
1. **OAuth Provider** - Handles OAuth2 authentication flows
2. **Credential Manager** - Securely stores and distributes API keys
3. **Session Manager** - Manages user sessions and tokens
4. **API Gateway** - Routes requests to IVSLearning API with proper authentication

## 🏗️ Architecture

```
Frontend (Static)
    ↓ Login Request
Backend App (OAuth Handler)
    ↓ OAuth Flow
OAuth Provider (Google/Facebook)
    ↓ Callback + Token
Backend App (Store Session + Return API Key)
    ↓ API Credentials
Frontend (Store in localStorage/sessionStorage)
    ↓ API Calls with Bearer Token
IVSLearning API
```

## 🔐 OAuth Implementation

### 1. Google OAuth Setup

```javascript
// backend/routes/auth.js
const express = require('express');
const { google } = require('googleapis');
const session = require('express-session');

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.OAUTH_CALLBACK_URL // e.g., https://your-backend.com/auth/google/callback
);

// Step 1: Generate OAuth URL
router.get('/google', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: req.session.id
  });

  res.json({ authUrl: url });
});

// Step 2: OAuth Callback Handler
router.get('/google/callback', async (req, res) => {
  const { code, state } = req.query;

  try {
    // Verify state
    if (state !== req.session.id) {
      return res.status(400).json({ error: 'Invalid state parameter' });
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const google_oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await google_oauth2.userinfo.get();

    // Create or update user session
    const user = {
      id: userInfo.data.id,
      email: userInfo.data.email,
      name: userInfo.data.name,
      picture: userInfo.data.picture
    };

    // Generate IVS Bearer Token
    const apiToken = generateAPIToken(user);

    // Store in session
    req.session.user = user;
    req.session.apiToken = apiToken;

    // Redirect to frontend with token
    res.redirect(`http://localhost:8000/index-new.html?token=${apiToken}&user=${encodeURIComponent(JSON.stringify(user))}`);
  } catch (error) {
    console.error('OAuth error:', error);
    res.redirect(`http://localhost:8000/auth.html?error=oauth_failed`);
  }
});

module.exports = router;
```

### 2. Environment Variables

```bash
# backend/.env
NODE_ENV=development
PORT=3000

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
OAUTH_CALLBACK_URL=http://localhost:3000/auth/google/callback

# IVSLearning API
IVS_API_BASE_URL=https://api.ivslearning.top/v1
IVS_API_KEY=your-api-key
IVS_SECRET_KEY=your-secret-key

# Session & Token
SESSION_SECRET=your-session-secret-key
JWT_SECRET=your-jwt-secret-key
TOKEN_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:8000,https://ivslearning.web.app
```

## 🔑 API Key Management

### 1. Secure Key Storage

```javascript
// backend/services/keyManager.js
const crypto = require('crypto');

class KeyManager {
  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY;
  }

  // Encrypt API keys before storing
  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.encryptionKey),
      iv
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  // Decrypt API keys when needed
  decrypt(text) {
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.encryptionKey),
      iv
    );
    let decrypted = decipher.update(parts[1], 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  // Generate bearer token for user
  generateBearerToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    };

    const token = crypto
      .createHmac('sha256', process.env.JWT_SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');

    return token;
  }
}

module.exports = new KeyManager();
```

### 2. Distribution Endpoint

```javascript
// backend/routes/credentials.js
const express = require('express');
const router = express.Router();
const keyManager = require('../services/keyManager');

// Get API credentials (protected - requires user session)
router.get('/api-credentials', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const apiKey = keyManager.decrypt(process.env.IVS_API_KEY_ENCRYPTED);
  const bearerToken = req.session.apiToken;

  res.json({
    apiKey: apiKey,
    bearerToken: bearerToken,
    apiBaseUrl: process.env.IVS_API_BASE_URL,
    expiresIn: '7d'
  });
});

module.exports = router;
```

## 📱 Frontend Integration

### 1. Login Flow

```javascript
// frontend/js/auth-flow.js
async function initiateGoogleLogin() {
  try {
    // Step 1: Get OAuth URL from backend
    const response = await fetch('https://your-backend.com/auth/google');
    const { authUrl } = await response.json();
    
    // Step 2: Redirect to Google login
    window.location.href = authUrl;
  } catch (error) {
    console.error('Login failed:', error);
  }
}

// Step 3: Backend redirects here with token
function handleOAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const userStr = params.get('user');

  if (token && userStr) {
    // Store credentials
    localStorage.setItem('apiToken', token);
    localStorage.setItem('user', userStr);

    // Fetch and store API credentials
    fetchAPICredentials(token);

    // Redirect to dashboard
    window.location.href = '/my-learning.html';
  }
}

async function fetchAPICredentials(token) {
  try {
    const response = await fetch('https://your-backend.com/credentials/api-credentials', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const credentials = await response.json();
    
    // Store in session
    sessionStorage.setItem('apiKey', credentials.apiKey);
    sessionStorage.setItem('bearerToken', credentials.bearerToken);
    
    // Update API config
    window.IVS_API_CONFIG.API_KEY = credentials.apiKey;
    window.IVS_API_CONFIG.BEARER_TOKEN = credentials.bearerToken;
  } catch (error) {
    console.error('Failed to fetch API credentials:', error);
  }
}
```

### 2. Update auth.html

```html
<!-- Add OAuth button -->
<button onclick="initiateGoogleLogin()" class="btn-google">
  🔐 Login with Google
</button>

<!-- Handle callback if redirect here -->
<script>
  if (window.location.search.includes('token=')) {
    handleOAuthCallback();
  }
</script>
```

## 🚀 Deployment

### 1. Backend Deployment Options

#### Option A: Firebase Cloud Functions
```
functions/
├── index.js (Express app)
├── routes/
│   ├── auth.js
│   └── credentials.js
├── services/
│   └── keyManager.js
└── package.json
```

#### Option B: Heroku
```bash
# backend/Procfile
web: node server.js

# backend/server.js
const express = require('express');
const app = require('./app');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
```

#### Option C: VPS (AWS EC2, DigitalOcean)
```bash
# Install dependencies
npm install

# Start with PM2
npm install -g pm2
pm2 start server.js --name "ivs-backend"
pm2 startup
pm2 save
```

### 2. Security Checklist

- ✅ Use HTTPS/TLS for all endpoints
- ✅ Implement CORS properly (whitelist domains)
- ✅ Use secure session cookies (httpOnly, secure, sameSite)
- ✅ Encrypt stored API keys
- ✅ Validate all input (OWASP)
- ✅ Rate limiting on OAuth endpoints
- ✅ CSRF protection
- ✅ Log all auth events
- ✅ Regular security audits
- ✅ Keep dependencies updated

## 🔗 Flow Diagram

```
User clicks "Login with Google"
    ↓
Frontend calls GET /auth/google
    ↓
Backend returns Google OAuth URL
    ↓
User redirects to Google (Google login)
    ↓
User approves permissions
    ↓
Google redirects to /auth/google/callback with code
    ↓
Backend exchanges code for tokens
    ↓
Backend creates user session
    ↓
Backend generates IVS API Bearer Token
    ↓
Backend redirects to frontend with token
    ↓
Frontend stores token & API credentials
    ↓
Frontend can now call IVSLearning API with Bearer Token
```

## 📊 API Key Rotation

```javascript
// backend/routes/admin.js
router.post('/rotate-keys', adminOnly, async (req, res) => {
  try {
    // Generate new API key
    const newApiKey = crypto.randomBytes(32).toString('hex');
    
    // Encrypt and store
    const encrypted = keyManager.encrypt(newApiKey);
    await updateEnvVariable('IVS_API_KEY_ENCRYPTED', encrypted);
    
    // Notify users to refresh
    await notifyUsersOfKeyRotation();
    
    res.json({ 
      success: true, 
      message: 'API keys rotated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🆘 Troubleshooting

### OAuth Redirect URI Mismatch
- Ensure `OAUTH_CALLBACK_URL` matches Google Console settings exactly
- Check for `http://` vs `https://` differences

### CORS Issues
- Add your frontend URL to `CORS_ORIGIN` in .env
- Check browser console for specific CORS error

### API Key Not Working
- Verify API key is not expired
- Check if key is encrypted/decrypted properly
- Validate with IVSLearning API support

### Session Lost
- Check if cookies are enabled
- Verify `SESSION_SECRET` is set
- Check session store (memory/Redis/database)

## 📚 Next Steps

1. Setup Google OAuth credentials in Google Cloud Console
2. Deploy backend to your hosting
3. Update frontend with backend URLs
4. Test OAuth flow end-to-end
5. Monitor authentication logs
6. Setup monitoring/alerting

## 🔗 Related Files

- Frontend: `js/api-config.js`, `js/api-client.js`, `js/api-services.js`
- Authentication: `auth.html`, `js/auth-flow.js`
- API Docs: `API_DOCUMENTATION.md`
