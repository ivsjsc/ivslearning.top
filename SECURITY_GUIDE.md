# 🔐 API Security & Authentication Guide

## Mục lục
1. [Authentication Methods](#authentication-methods)
2. [Token Management](#token-management)
3. [Security Best Practices](#security-best-practices)
4. [CORS Configuration](#cors-configuration)
5. [API Keys & Credentials](#api-keys--credentials)
6. [Rate Limiting & DDoS Protection](#rate-limiting--ddos-protection)

---

## Authentication Methods

### 1. Firebase Authentication (Recommended)

#### Setup
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, getIdToken } from 'firebase/auth';
import { AdvancedBackendService } from '@/lib/advanced-backend-service';

const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // ...
});

const auth = getAuth(app);
const api = new AdvancedBackendService({
  baseUrl: process.env.REACT_APP_BACKEND_URL,
});

// Setup auth listener
onAuthStateChanged(auth, async user => {
  if (user) {
    const token = await user.getIdToken();
    api.setAuthToken(token);
    console.log('✓ Authenticated');
  } else {
    api.setAuthToken(null);
    console.log('✗ Not authenticated');
  }
});
```

#### Backend Verification
```typescript
// src/app/api/ai-router/route.ts
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Missing authorization token' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);

  try {
    const decodedToken = await adminAuth().verifyIdToken(token);
    const userId = decodedToken.uid;
    
    // Token verified, proceed with request
    console.log(`Authenticated user: ${userId}`);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // ... rest of API logic
}
```

---

### 2. API Keys (cho server-to-server communication)

```typescript
// Server-side only - NEVER expose in frontend
const API_KEY = process.env.IVS_BACKEND_API_KEY;

const response = await fetch('https://backend.ivs.com/api/ai-router', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY, // Custom header
    'Authorization': `Bearer ${API_KEY}`,
  },
  body: JSON.stringify({
    task: 'get_posts',
    data: {},
  }),
});
```

---

### 3. JWT Tokens (Custom Implementation)

```typescript
// Generate JWT
import jwt from 'jsonwebtoken';

function generateToken(userId: string): string {
  return jwt.sign(
    {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    },
    process.env.JWT_SECRET!
  );
}

// Verify JWT
function verifyToken(token: string): any {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return null;
  }
}
```

---

## Token Management

### Token Refresh Pattern

```typescript
class TokenManager {
  private authToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  /**
   * Set tokens from login response
   */
  setTokens(authToken: string, refreshToken: string, expiresIn: number) {
    this.authToken = authToken;
    this.refreshToken = refreshToken;
    this.tokenExpiresAt = Date.now() + expiresIn * 1000;
  }

  /**
   * Get valid auth token (refresh if needed)
   */
  async getValidToken(): Promise<string | null> {
    if (!this.authToken) return null;

    // Check if token will expire in next 5 minutes
    if (this.tokenExpiresAt && Date.now() + 5 * 60 * 1000 > this.tokenExpiresAt) {
      await this.refreshAuthToken();
    }

    return this.authToken;
  }

  /**
   * Refresh token using refresh token
   */
  private async refreshAuthToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: this.refreshToken }),
    });

    if (!response.ok) {
      // Refresh failed - redirect to login
      window.location.href = '/login';
      return;
    }

    const data = await response.json();
    this.setTokens(data.access_token, data.refresh_token, data.expires_in);
  }

  /**
   * Clear tokens (logout)
   */
  clearTokens() {
    this.authToken = null;
    this.refreshToken = null;
    this.tokenExpiresAt = null;
  }
}
```

---

## Security Best Practices

### ✅ DO's

```typescript
// ✓ Store tokens securely
// In browser: Use httpOnly cookies (set by server)
// In Electron/RN: Use secure storage (react-native-secure-store, electron-store)

// ✓ Use HTTPS/TLS for all requests
const baseUrl = process.env.REACT_APP_BACKEND_URL;
console.assert(baseUrl?.startsWith('https://'), 'API must use HTTPS');

// ✓ Validate SSL certificates
const api = new AdvancedBackendService({
  baseUrl, // Will use https by default
});

// ✓ Add security headers
const headers = {
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

// ✓ Clear sensitive data on logout
function logout() {
  api.setAuthToken(null);
  api.clearCache();
  tokenManager.clearTokens();
}

// ✓ Log security events
console.log('[Security] User logged in at', new Date().toISOString());

// ✓ Implement timeout for sensitive operations
const sensitiveApi = new AdvancedBackendService({
  baseUrl,
  rateLimitConfig: {
    maxRequests: 10,
    windowMs: 60000, // 10 requests per minute for sensitive endpoints
  },
});
```

### ❌ DON'Ts

```typescript
// ✗ Never expose tokens in URLs
// BAD: https://api.example.com/posts?token=xyz
// GOOD: Use Authorization header

// ✗ Never log sensitive data
console.log('Token:', token); // ❌

// ✗ Never commit credentials to git
// .env.example (OK)
// .env (NEVER)
// Don't commit API keys, passwords, service account keys

// ✗ Never use non-HTTPS
const api = new AdvancedBackendService({
  baseUrl: 'http://example.com', // ❌ Security risk
});

// ✗ Never trust client-side security
// Always validate on backend
if (user.role === 'admin') { // ❌ Can be forged
  // ...
}

// ✗ Never store sensitive data in localStorage
localStorage.setItem('token', token); // ❌ Vulnerable to XSS

// ✓ Use httpOnly cookies instead (set by server)
// Set-Cookie: token=xyz; HttpOnly; Secure; SameSite=Strict
```

---

## CORS Configuration

### Backend Setup (Next.js)

```typescript
// src/app/api/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  const allowedOrigins = [
    'https://app.ivs.com',
    'https://web.ivs.com',
    'https://localhost:3000', // Development
  ];

  if (allowedOrigins.includes(origin || '')) {
    const response = NextResponse.next();
    
    response.headers.set('Access-Control-Allow-Origin', origin!);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '3600');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

### Handle Preflight Requests

```typescript
// src/app/api/ai-router/route.ts
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Or specific origin
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

---

## API Keys & Credentials

### Environment Variables

```bash
# .env (server-side only, NEVER commit)
# ============================================

# Firebase
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
FIREBASE_PROJECT_ID=my-project

# AI Services
GEMINI_API_KEY=xyz...
OPENAI_API_KEY=sk-...
GROK_API_KEY=grok-...

# Authentication
JWT_SECRET=your-secret-key-change-this
API_KEY_IVS_BACKEND=sk-ivs-...

# Application
NODE_ENV=production
NEXT_PUBLIC_BACKEND_URL=https://backend.ivs.com

# Database
DATABASE_URL=postgresql://user:pass@host/db
```

### .env.example (Safe to commit)

```bash
# .env.example
# ============================================
# Copy this file to .env and fill in your values

# Firebase
FIREBASE_SERVICE_ACCOUNT_KEY=
FIREBASE_PROJECT_ID=

# AI Services
GEMINI_API_KEY=
OPENAI_API_KEY=
GROK_API_KEY=

# Authentication
JWT_SECRET=change-this-to-a-strong-secret

# Public (can be exposed)
NEXT_PUBLIC_BACKEND_URL=https://backend.ivs.com
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
```

### Secure Credential Rotation

```bash
# When credentials are compromised:

# 1. Generate new credentials
# 2. Update .env file
# 3. Restart application
# 4. Monitor for suspicious activity
# 5. Invalidate old tokens

# In code:
const old_tokens = await firestore
  .collection('tokens')
  .where('createdBefore', '<', yesterday)
  .get();

old_tokens.docs.forEach(doc => doc.ref.delete());
```

---

## Rate Limiting & DDoS Protection

### Client-side Rate Limiting

```typescript
const api = new AdvancedBackendService({
  baseUrl: 'https://backend.ivs.com',
  rateLimitConfig: {
    maxRequests: 100,
    windowMs: 60000, // 1 minute
    perEndpoint: true,
  },
});

// Each endpoint has separate limits
// This prevents one endpoint from exhausting all quota
```

### Server-side Rate Limiting (Recommended)

```typescript
// npm install express-rate-limit

import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// Apply to all API requests
app.use('/api/', limiter);

// Custom limit for sensitive endpoints
const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
});

app.post('/api/auth/login', strictLimiter, (req, res) => {
  // Login logic
});
```

### Monitor & Alert

```typescript
// Log suspicious activity
function logSecurityEvent(event: {
  type: 'rate_limit_exceeded' | 'failed_auth' | 'invalid_token';
  ip: string;
  timestamp: Date;
  details: any;
}) {
  console.warn('[SECURITY]', event);
  
  // Send alert if critical
  if (event.type === 'rate_limit_exceeded') {
    sendAlert(`High request rate from ${event.ip}`);
  }
}
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check token is valid and not expired |
| 403 Forbidden | Check user has required permissions/role |
| 429 Too Many Requests | Wait before retrying (client auto-retries) |
| CORS error | Check origin is in allowlist |
| Token expired | Refresh token or re-authenticate |
| Network error | Check internet connection, HTTPS/SSL |

