# 🔐 Grok AI Security Checklist for Aivy

## ⚠️ CRITICAL: API Key Security

### ✅ Pre-Deployment Security Review

**Level: CRITICAL** 🔴

- [ ] **API Key Protection**
  - [ ] `GROK_API_KEY` NEVER hardcoded in any file
  - [ ] `GROK_API_KEY` stored ONLY in `.env` (server-side)
  - [ ] `.env` added to `.gitignore`
  - [ ] `.env` NEVER committed to Git repository
  - [ ] `.env.example` created WITHOUT real key values
  - [ ] API key never logged to console (in production)

- [ ] **Frontend Security**
  - [ ] No `fetch` calls to `api.x.ai` directly from browser
  - [ ] All Grok API calls go through backend only
  - [ ] Frontend `aivy-grok-service.ts` only calls `/api/grok/chat`
  - [ ] No Authorization headers in frontend requests
  - [ ] Network requests don't expose API key in DevTools

- [ ] **Backend Security**
  - [ ] Express `cors` properly configured (whitelist domains)
  - [ ] `helmet` middleware enabled for security headers
  - [ ] Rate limiting implemented (20 requests/15 minutes)
  - [ ] Input validation on all endpoints
  - [ ] Error messages don't leak sensitive info
  - [ ] API key validation before each Grok call

- [ ] **CORS Configuration**
  - [ ] Allowed origins: `['https://ivslearning.top', 'https://www.ivslearning.top']`
  - [ ] NO wildcards (`*`) in production
  - [ ] `credentials: true` only if needed
  - [ ] Methods: `['GET', 'POST']`
  - [ ] Headers whitelisted: `['Content-Type']`

---

## 🛡️ Deployment Security

### ✅ Production Readiness

**Level: HIGH** 🟠

- [ ] **Environment Management**
  - [ ] Separate `.env` files per environment (dev, staging, prod)
  - [ ] Use environment variables, NOT config files
  - [ ] Rotate API keys every 90 days
  - [ ] Keep old keys disabled (not deleted) for rollback
  - [ ] Document key rotation process

- [ ] **Server Security**
  - [ ] HTTPS/SSL enabled (required for production)
  - [ ] Node.js behind reverse proxy (Nginx/Apache)
  - [ ] Firewall: only port 443 (HTTPS) exposed
  - [ ] DDoS protection configured
  - [ ] Rate limiting aggressive enough (10-20 req/min)

- [ ] **Monitoring & Logging**
  - [ ] Failed requests logged (but NOT with credentials)
  - [ ] Alert on suspicious activity (too many 401s)
  - [ ] Monitor Grok API quota usage
  - [ ] Log all commands for audit trail
  - [ ] Separate logs for production

- [ ] **API Endpoint Protection**
  - [ ] `POST /api/grok/chat` requires auth token
  - [ ] `POST /api/grok/command` requires auth token
  - [ ] `GET /api/grok/health` is public (no auth needed)
  - [ ] Request body size limited (max 1MB)
  - [ ] Message length limited (max 5000 chars)

---

## 🚨 Common Security Mistakes (DO NOT DO)

### ❌ WRONG - Never Do These

```javascript
// ❌ WRONG 1: Expose API key in frontend
const API_KEY = 'xai_xxxxx'; // DO NOT DO THIS
fetch('https://api.x.ai/...', {
  headers: { 'Authorization': `Bearer ${API_KEY}` }
});

// ❌ WRONG 2: Commit .env to Git
git add .env  // DO NOT DO THIS
git commit -m "Add API key"

// ❌ WRONG 3: Log API key to console
console.log('API Key:', process.env.GROK_API_KEY); // DO NOT DO THIS

// ❌ WRONG 4: Use wildcard CORS
cors({ origin: '*' }); // DO NOT DO THIS

// ❌ WRONG 5: Expose error details to client
res.json({ error: `Grok API failed: ${error.message}` }); // DO NOT DO THIS

// ❌ WRONG 6: No rate limiting
app.use('/api/grok/chat', (req, res) => { // DO NOT DO THIS
  // Anyone can spam unlimited requests
});

// ❌ WRONG 7: Store key in code
const grokKey = 'xai_xxxxx'; // DO NOT DO THIS
module.exports = grokKey;

// ❌ WRONG 8: Share key in repositories
// Pushing to public GitHub with API key inside // DO NOT DO THIS
```

### ✅ CORRECT - Always Do These

```javascript
// ✅ CORRECT 1: Use backend for API calls
const response = await fetch('/api/grok/chat', {
  method: 'POST',
  body: JSON.stringify({ message, language })
  // No API key in frontend!
});

// ✅ CORRECT 2: Add .env to .gitignore
echo ".env" >> .gitignore

// ✅ CORRECT 3: Never log sensitive data
if (process.env.NODE_ENV === 'development') {
  // Only log in dev, never in production
  console.log('[Grok] Request sent');
}

// ✅ CORRECT 4: Whitelist CORS origins
cors({
  origin: ['https://ivslearning.top'],
  credentials: true
});

// ✅ CORRECT 5: Hide error details from client
try {
  // ...
} catch (error) {
  console.error('[Server]', error); // Log server-side
  res.status(500).json({ 
    message: 'Internal error' // Generic message to client
  });
}

// ✅ CORRECT 6: Implement rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20
});
app.use('/api/grok/chat', limiter, handler);

// ✅ CORRECT 7: Load key from environment
const grokKey = process.env.GROK_API_KEY;
if (!grokKey) throw new Error('API key not configured');

// ✅ CORRECT 8: Never commit secrets
git status  // Verify .env is not listed
// Only commit code, never secrets
```

---

## 🔄 API Key Rotation Procedure

### When to Rotate
- Every 90 days (recommended)
- Suspected compromise
- Staff member leaving
- Security audit requires it

### How to Rotate

1. **Create New Key**
   ```bash
   # 1. Go to https://console.x.ai/api/keys
   # 2. Click "Create API Key"
   # 3. Name: "ivslearning-aivy-v2"
   # 4. Copy new key
   ```

2. **Update Backend**
   ```bash
   # 1. Update .env with new key
   GROK_API_KEY=xai_new_key_here
   
   # 2. Restart backend
   pm2 restart aivy-backend
   
   # 3. Verify health check
   curl https://api.ivslearning.top/api/grok/health
   ```

3. **Disable Old Key**
   ```bash
   # DO NOT DELETE - just disable
   # Go to console.x.ai/api/keys
   # Find old key, click "Disable"
   # Keep disabled for 7 days for rollback
   ```

4. **Delete Old Key** (after 7 days)
   ```bash
   # Only delete after confirming new key works
   # Go to console.x.ai/api/keys
   # Find old key, click "Delete"
   ```

---

## 🧪 Security Testing

### Test 1: Verify No API Key Exposure

```bash
# Check DevTools Network tab
# Send message to Aivy
# Inspect POST request to /api/grok/chat

# ✅ Request body should have:
# {"message": "test", "language": "en"}

# ❌ Should NOT have:
# - "Authorization: Bearer xai_..."
# - "GROK_API_KEY"
# - Any API key

# Verify with curl
curl -i http://localhost:3000/api/grok/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "language": "en"}' \
  | grep -i "authorization"

# Should return nothing (no Authorization header)
```

### Test 2: Verify Rate Limiting

```bash
# Send 25 requests rapidly
for i in {1..25}; do
  curl -s http://localhost:3000/api/grok/chat \
    -H "Content-Type: application/json" \
    -d '{"message": "test", "language": "en"}' \
    -o /dev/null -w "%{http_code}\n"
done

# Expected output:
# 200 (requests 1-20)
# 200 (requests 1-20)
# ...
# 429 (requests 21-25) - Too Many Requests
```

### Test 3: Verify CORS Protection

```bash
# Test from different origin
curl -X POST http://localhost:3000/api/grok/chat \
  -H "Origin: https://evil.com" \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "language": "en"}'

# Should either:
# ✅ Return CORS error (403/405)
# ✅ Return valid response only for whitelisted origins
```

### Test 4: Verify Input Validation

```bash
# Test with malicious input
curl -X POST http://localhost:3000/api/grok/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "<script>alert(1)</script>", "language": "en"}'

# Should safely handle without XSS risk

# Test with oversized message
curl -X POST http://localhost:3000/api/grok/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"$(python3 -c 'print(\"a\"*10000)')\", \"language\": \"en\"}"

# Should return 400 Bad Request (message too long)
```

### Test 5: Verify Error Handling

```bash
# Test with invalid API key (change GROK_API_KEY in .env to gibberish)
curl -X POST http://localhost:3000/api/grok/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "language": "en"}'

# Should return:
# {"status": "error", "message": "Internal server error"}

# Should NOT return:
# - Actual error from Grok API
# - API key in error
# - Stack trace
```

---

## 📋 Security Incident Response

### If API Key is Compromised

1. **Immediate**
   ```bash
   # 1. Stop backend
   pm2 stop aivy-backend
   
   # 2. Go to console.x.ai
   # 3. Disable the compromised key immediately
   ```

2. **Within 1 Hour**
   ```bash
   # 4. Create new API key
   # 5. Update .env with new key
   # 6. Restart backend
   pm2 start aivy-backend
   
   # 7. Verify health check
   curl https://api.ivslearning.top/api/grok/health
   ```

3. **Within 24 Hours**
   ```bash
   # 8. Delete compromised key
   # 9. Review API usage logs for abuse
   # 10. Notify users if needed
   # 11. Document incident
   ```

---

## 📖 References

- [Grok API Security Docs](https://docs.x.ai/api)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Checklist](https://nodejs.org/en/docs/guides/security/)

---

## ✅ Final Checklist

Before going live:

- [ ] API key never appears in code
- [ ] `.env` added to `.gitignore`
- [ ] All requests go through backend
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] HTTPS enabled
- [ ] Helmet middleware added
- [ ] Error messages generic
- [ ] Logs configured (no sensitive data)
- [ ] Security tests pass
- [ ] Team trained on security

**🔐 If ANY checkbox is unchecked, DO NOT DEPLOY**

---

Last Updated: November 8, 2025
