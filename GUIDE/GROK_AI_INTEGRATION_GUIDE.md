# 🚀 Grok AI Integration for Aivy - Complete Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Security Architecture](#security-architecture)
3. [Setup Steps](#setup-steps)
4. [Implementation Details](#implementation-details)
5. [Deployment](#deployment)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This guide explains how to integrate **Grok AI** as the backend for **Aivy** - the AI assistant in your English Learners Webapp. Aivy will now use Grok instead of OpenAI/Gemini/Claude for more intelligent, engaging responses.

### What's New
- ✅ **Grok 2** model for faster responses
- ✅ **Secure backend** - API key never exposed
- ✅ **Rate limiting** - Prevent abuse
- ✅ **Multi-language** - English & Vietnamese
- ✅ **Voice commands** - Control app via Aivy
- ✅ **Personality** - "Cheeky but helpful" Aivy

---

## 🔐 Security Architecture

### ⚠️ CRITICAL SECURITY PRINCIPLES

```
┌─────────────────┐
│   Browser       │
│  (Frontend)     │  ❌ NO API KEY HERE
│                 │  ✅ Calls backend via HTTPS
└────────┬────────┘
         │
         │ HTTPS POST /api/grok/chat
         │ {message, language, history}
         │
┌────────▼────────┐
│  Backend Server │
│  (Node.js/PHP)  │  ✅ API KEY HERE (in .env)
│                 │  ✅ Validates & sanitizes
│                 │  ✅ Rate limits requests
└────────┬────────┘
         │
         │ Bearer Token + JSON
         │
┌────────▼────────┐
│  Grok API       │
│  (api.x.ai)     │
│                 │
└─────────────────┘
```

### Never Do This ❌
```javascript
// ❌ WRONG - Exposes API key to frontend
const response = fetch('https://api.x.ai/v1/chat/completions', {
  headers: { 'Authorization': 'Bearer xai_xxxxx' }
});
```

### Always Do This ✅
```javascript
// ✅ CORRECT - Backend handles API key
const response = fetch('/api/grok/chat', {
  method: 'POST',
  body: JSON.stringify({ message, language })
});
```

---

## 🔧 Setup Steps

### Step 1: Get Your Grok API Key

1. Go to https://console.x.ai
2. Sign in with your xAI account (or create one)
3. Navigate to **API Keys** section
4. Click **"Create API Key"**
5. Name it: `ivs-learning-aivy`
6. Select permissions: `chat:write`
7. Copy the key: `xai_xxxxxxxxxxxxxxxxxxxxxx`

**⚠️ IMPORTANT**: Save this key IMMEDIATELY. You won't see it again.

### Step 2: Create Environment File

Create `.env` file in project root (DO NOT commit to Git):

```bash
# .env (Add to .gitignore immediately!)
GROK_API_KEY=xai_xxxxxxxxxxxxxxxxxxxxxx
GROK_MODEL=grok-2
GROK_API_ENDPOINT=https://api.x.ai/v1/chat/completions
VITE_BACKEND_URL=http://localhost:3000/api
ENABLE_GROK_LOGS=true
```

### Step 3: Add to .gitignore

```bash
# .gitignore
.env
.env.local
.env.*.local
```

**Never commit `.env`** - it contains your API key!

### Step 4: Install Dependencies

For Node.js backend:

```bash
npm install express cors helmet express-rate-limit bottleneck
```

Key packages:
- `express` - Web framework
- `cors` - Cross-origin requests
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `bottleneck` - Request throttling

### Step 5: Set Up Backend Routes

In your main server file (e.g., `functions/index.js`):

```javascript
const express = require('express');
const grokRouter = require('./grok-api');

const app = express();

// Mount Grok API routes
app.use('/api/grok', grokRouter);

// Start server
app.listen(3000, () => {
  console.log('✅ Backend running on port 3000');
});
```

### Step 6: Update Frontend Config

Create environment file for frontend:

```bash
# .env.local (Vite frontend)
VITE_BACKEND_URL=http://localhost:3000/api
VITE_ENV=development
```

---

## 🏗️ Implementation Details

### File Structure

```
e:\IVS\Website\ivslearning.top\
├── .env                          # API key (GITIGNORED)
├── .env.example                  # Template (committed)
├── .gitignore                    # Includes .env
├── functions/
│   ├── grok-service.js          # Grok API client
│   ├── grok-api.js              # Express routes
│   └── index.js                 # Main backend
├── js/
│   ├── aivy-grok-service.ts     # Frontend service
│   ├── auth.js                  # Authentication
│   └── app.js                   # App logic
├── components/
│   ├── AivyMessage.tsx          # Message component
│   ├── AivyFloatingBox.tsx      # Chat box
│   └── AiChatPage.tsx           # Chat page
└── css/
    └── aivy-styles.css          # Styling
```

### Backend Service: `grok-service.js`

**Key Methods**:

```javascript
// Initialize
const grokService = new GrokAiService();

// Send chat message
const response = await grokService.chat(
  "Hello Aivy!",     // user message
  "en",              // language
  []                 // history
);

// Handle voice command
const result = await grokService.handleVoiceCommand(
  "toggle_dark_mode", // command
  "en"                // language
);
```

**System Prompts** (Aivy's personality):

```javascript
systemPrompts: {
  en: "You are Aivy, a cheeky but helpful AI assistant...",
  vi: "Bạn là Aivy, một trợ lý AI hài hước nhưng hữu ích..."
}
```

### Frontend Service: `aivy-grok-service.ts`

**Key Methods**:

```typescript
import { aivyGrokService } from './aivy-grok-service';

// Send message
const response = await aivyGrokService.sendMessage(
  "What's the best way to learn English?",
  "en"
);

// Handle voice command
const result = await aivyGrokService.handleVoiceCommand(
  "toggle dark mode",
  "en"
);

// Clear history
aivyGrokService.clearHistory();

// Check health
const isHealthy = await aivyGrokService.checkHealth();
```

### API Endpoints

#### 1. Chat Endpoint
```http
POST /api/grok/chat
Content-Type: application/json

{
  "message": "Hello Aivy!",
  "language": "en",
  "history": []
}

Response:
{
  "status": "success",
  "response": "Hi there! I'm Aivy, your cheeky but helpful assistant...",
  "timestamp": "2025-11-08T10:30:00Z"
}
```

#### 2. Voice Command Endpoint
```http
POST /api/grok/command
Content-Type: application/json

{
  "command": "toggle_dark_mode",
  "language": "en"
}

Response:
{
  "status": "success",
  "data": {
    "status": "success",
    "action": "toggleDarkMode",
    "message": "✨ Dark mode toggled!",
  },
  "timestamp": "2025-11-08T10:30:00Z"
}
```

#### 3. Health Check Endpoint
```http
GET /api/grok/health

Response:
{
  "status": "ok",
  "service": "Grok AI Service",
  "timestamp": "2025-11-08T10:30:00Z"
}
```

---

## 🚀 Deployment

### Pre-Deployment Checklist

- [ ] `GROK_API_KEY` set in `.env`
- [ ] `.env` added to `.gitignore`
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend environment configured
- [ ] CORS origins configured for production domain
- [ ] Rate limiting appropriately set
- [ ] Error logging enabled
- [ ] Tested locally

### Local Testing

```bash
# Terminal 1: Start backend
cd functions
node index.js
# Output: ✅ Backend running on port 3000

# Terminal 2: Start frontend (if using Vite)
npm run dev
# Output: VITE v... Local: http://localhost:5173/
```

### Production Deployment

#### Option 1: Firebase Cloud Functions

1. Update `functions/package.json`:
```json
{
  "name": "ivs-learning-backend",
  "version": "1.0.0",
  "engines": {
    "node": "18"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.0.0"
  }
}
```

2. Deploy:
```bash
firebase deploy --only functions
```

#### Option 2: Traditional Server

1. Create `.env.production`:
```bash
GROK_API_KEY=xai_xxxxxxxxxxxxxxxxxxxxxx
NODE_ENV=production
VITE_BACKEND_URL=https://api.ivslearning.top
```

2. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start functions/index.js --name "aivy-backend"
pm2 save
pm2 startup
```

3. Set up reverse proxy (Nginx):
```nginx
server {
    listen 443 ssl;
    server_name api.ivslearning.top;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Authorization $http_authorization;
        proxy_pass_header Authorization;
    }
}
```

---

## 🧪 Testing

### Test 1: Local Chat

```bash
curl -X POST http://localhost:3000/api/grok/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello Aivy!",
    "language": "en",
    "history": []
  }'
```

Expected response: ✅ Aivy greets you

### Test 2: Voice Commands

```bash
curl -X POST http://localhost:3000/api/grok/command \
  -H "Content-Type: application/json" \
  -d '{
    "command": "toggle_dark_mode",
    "language": "en"
  }'
```

Expected: ✅ Command acknowledged

### Test 3: Health Check

```bash
curl http://localhost:3000/api/grok/health
```

Expected: ✅ Status OK

### Test 4: Rate Limiting

Send 25+ requests within 15 minutes:

```bash
for i in {1..25}; do
  curl -X POST http://localhost:3000/api/grok/chat \
    -H "Content-Type: application/json" \
    -d '{"message": "test", "language": "en"}'
  sleep 1
done
```

Expected: ✅ 429 Too Many Requests after 20 requests

### Test 5: Security (Verify API Key Not Exposed)

Open DevTools → Network tab → Check Chat request:

- ✅ Request body should NOT contain API key
- ✅ Only "message", "language", "history" in body
- ✅ No "Authorization" header in frontend request

---

## 🐛 Troubleshooting

### Issue 1: "GROK_API_KEY not found"

**Problem**: `console error: ERROR: GROK_API_KEY environment variable not set!`

**Solution**:
```bash
# 1. Check .env exists
ls -la .env

# 2. Verify API key is there
cat .env | grep GROK_API_KEY

# 3. Restart backend
node functions/index.js
```

### Issue 2: "401 Unauthorized from Grok API"

**Problem**: Response: `{"error": {"message": "Invalid API key"}}`

**Solution**:
```bash
# 1. Verify API key format (starts with "xai_")
echo $GROK_API_KEY

# 2. Check if key is valid at console.x.ai
# 3. If invalid, create new key and update .env
# 4. Restart backend
```

### Issue 3: "CORS Error"

**Problem**: Browser console: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
```javascript
// In grok-api.js, verify CORS config
const corsOptions = {
  origin: ['http://localhost:5173', 'https://ivslearning.top'],
  credentials: true
};
router.use(cors(corsOptions));

// Restart backend after updating
```

### Issue 4: "Rate Limit Exceeded"

**Problem**: Response: `429 Too Many Requests`

**Solution**:
```javascript
// Adjust rate limiting in grok-api.js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 50  // Change from 20 to 50 (or higher)
});
```

### Issue 5: "Timeout Error"

**Problem**: `Error: Request timeout`

**Solution**:
```javascript
// In grok-service.js, increase timeout
curl_setopt($ch, CURLOPT_TIMEOUT, 60);  // Increase from 30 to 60

// Or in Node.js
req.setTimeout(60000); // 60 seconds
```

### Issue 6: "Empty Response"

**Problem**: Response: `{"status": "success", "response": ""}`

**Solution**:
```bash
# 1. Verify Grok API is responding
curl https://api.x.ai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "grok-2", "messages": [{"role": "user", "content": "hi"}]}'

# 2. Check backend logs for errors
npm run logs

# 3. Verify model name is correct
# Use "grok-2" not "grok-beta"
```

---

## 📊 Monitoring & Logging

### Enable Logging

In `.env`:
```bash
ENABLE_GROK_LOGS=true
GROK_LOG_LEVEL=info
```

### View Logs

```bash
# Local development
npm run dev

# Production (PM2)
pm2 logs aivy-backend

# Production (Docker)
docker logs aivy-backend
```

### Key Logs to Monitor

```
[Grok] Sending request: "Hello Aivy!..."
[Grok] Received response successfully
[API] Chat request: language=en, messageLength=12
[API] Command: toggle_dark_mode, language=en
```

---

## 📈 Performance Optimization

### Reduce Latency

```javascript
// 1. Decrease max_tokens if responses are too long
this.maxTokens = 512; // from 1024

// 2. Lower temperature for more consistent responses
this.temperature = 0.5; // from 0.7

// 3. Use conversation history cache
const history = conversationHistory.slice(-5); // keep only last 5
```

### Handle Rate Limits

```javascript
// Implement exponential backoff
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
```

---

## ✅ Success Indicators

You'll know everything is working when:

- ✅ Chat messages appear in 1-2 seconds
- ✅ Voice commands execute instantly
- ✅ No errors in browser console
- ✅ API key never appears in Network tab
- ✅ Rate limiting kicks in after 20 requests
- ✅ Messages maintain context across chat
- ✅ Both English & Vietnamese work
- ✅ Dark mode toggle works
- ✅ Health check returns 200 OK

---

## 🎯 Next Steps

1. ✅ Get API key from console.x.ai
2. ✅ Create `.env` with API key
3. ✅ Install backend dependencies
4. ✅ Test locally with curl
5. ✅ Test in browser
6. ✅ Deploy to production
7. ✅ Monitor logs

---

## 📞 Support

For issues:
1. Check [Troubleshooting](#troubleshooting) section
2. Review logs: `pm2 logs aivy-backend`
3. Test endpoint: `GET /api/grok/health`
4. Verify `.env` file has correct API key
5. Check Grok API status: https://status.x.ai

---

**🎉 You're all set! Aivy is now powered by Grok AI.**
