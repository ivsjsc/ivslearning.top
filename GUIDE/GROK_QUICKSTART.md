# 🚀 Grok AI for Aivy - Quick Start (30 Minutes)

## 📋 What You'll Do

1. ✅ Get Grok API key (5 min)
2. ✅ Set up environment file (5 min)
3. ✅ Install dependencies (5 min)
4. ✅ Test locally (10 min)
5. ✅ Deploy (Optional, 5 min)

---

## 🔑 Step 1: Get Your API Key (5 minutes)

### Go to Grok Console

1. Open: https://console.x.ai
2. Sign in or create account
3. Click **API Keys** (left menu)
4. Click **Create API Key**
5. Name: `ivs-learning-aivy`
6. Select: `chat:write`
7. **COPY** the key → `xai_xxxxxx...`
8. **SAVE IT IMMEDIATELY** (won't show again!)

---

## 📝 Step 2: Create .env File (5 minutes)

In project root: `e:\IVS\Website\ivslearning.top\`

Create file `.env`:

```
GROK_API_KEY=xai_t1vwzqWMlJcu5ZdF5hIbmKH0L8lFrMN3jGulYfXEt5ahP6mRYVagcxGdHvaPHylQZp9cNIsDAev8BNOW
GROK_MODEL=grok-2
GROK_API_ENDPOINT=https://api.x.ai/v1/chat/completions
NODE_ENV=development
```

**⚠️ NEVER commit this file!**

Update `.gitignore`:

```
.env
.env.local
*.key
```

---

## 📦 Step 3: Install Dependencies (5 minutes)

```bash
cd e:\IVS\Website\ivslearning.top\functions

npm install express cors helmet express-rate-limit bottleneck
```

Wait for install to complete...

---

## 🧪 Step 4: Test Locally (10 minutes)

### Terminal 1: Start Backend

```bash
cd e:\IVS\Website\ivslearning.top\functions
node index.js
```

Expected output:
```
✅ Backend running on port 3000
```

### Terminal 2: Test with curl

```bash
curl -X POST http://localhost:3000/api/grok/chat `
  -H "Content-Type: application/json" `
  -d '{\"message\": \"Hello Aivy!\", \"language\": \"en\"}'
```

Expected response:
```json
{
  "status": "success",
  "response": "Hi there! I'm Aivy, your cheeky but helpful assistant..."
}
```

### Test Voice Command

```bash
curl -X POST http://localhost:3000/api/grok/command `
  -H "Content-Type: application/json" `
  -d '{\"command\": \"toggle_dark_mode\", \"language\": \"en\"}'
```

Expected response:
```json
{
  "status": "success",
  "data": {
    "status": "success",
    "action": "toggleDarkMode",
    "message": "✨ Dark mode toggled!"
  }
}
```

### ✅ All Working?

Go to Step 5!

---

## 🌐 Step 5: Deploy (Optional, 5 minutes)

### Option A: Firebase Cloud Functions

```bash
firebase deploy --only functions
```

### Option B: Traditional Server

1. Upload files to server
2. Install dependencies on server
3. Start with PM2:
```bash
pm2 start functions/index.js --name aivy-backend
```

4. Verify:
```bash
curl https://api.ivslearning.top/api/grok/health
```

Expected: `{"status": "ok"}`

---

## ✨ What's Working Now

- ✅ Aivy can chat with Grok
- ✅ English & Vietnamese languages
- ✅ Voice commands (toggle dark mode, etc.)
- ✅ Secure (API key protected)
- ✅ Rate limited (20 requests/15 min)
- ✅ Error handling in place

---

## 📚 Documentation

- **Full Guide**: `GROK_AI_INTEGRATION_GUIDE.md`
- **Security**: `GROK_SECURITY_CHECKLIST.md`
- **Troubleshooting**: See Full Guide

---

## 🆘 Troubleshooting

### ❌ Error: "Cannot find module 'express'"

Solution:
```bash
npm install express cors helmet express-rate-limit bottleneck
```

### ❌ Error: "GROK_API_KEY not found"

Solution:
```bash
# 1. Check .env exists
ls -la .env

# 2. Verify content
cat .env

# 3. Restart backend
```

### ❌ Error: "401 Unauthorized"

Solution:
```bash
# 1. Verify API key starts with "xai_"
# 2. Check if key is still valid (not deleted)
# 3. Create new key if needed
```

### ❌ No Response

Solution:
```bash
# 1. Check backend is running
# 2. Verify port 3000 is open
# 3. Check firewall settings
```

---

## 🎯 Next Steps

1. ✅ Test all Aivy features in app
2. ✅ Monitor logs for errors
3. ✅ Test with real users
4. ✅ Rotate API key every 90 days
5. ✅ Set up monitoring/alerts

---

## 📞 Need Help?

1. Check **Troubleshooting** above
2. Review **GROK_AI_INTEGRATION_GUIDE.md**
3. Check backend logs: `pm2 logs`
4. Verify Grok API status: https://status.x.ai

---

**🎉 Aivy is now powered by Grok AI!**
