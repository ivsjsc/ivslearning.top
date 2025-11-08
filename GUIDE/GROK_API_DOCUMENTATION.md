# 🔌 Grok AI API Reference for Aivy

Complete API documentation for backend endpoints.

---

## Base URL

```
Development: http://localhost:3000/api/grok
Production: https://api.ivslearning.top/api/grok
```

---

## Endpoints

### 1. POST /api/grok/chat

Send a message to Grok and get response.

#### Request

```http
POST /api/grok/chat HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "message": "What's the best way to learn English?",
  "language": "en",
  "history": [
    {"role": "user", "content": "Hello Aivy"},
    {"role": "assistant", "content": "Hi there!"}
  ]
}
```

#### Request Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `message` | string | Yes | User message (max 5000 chars) | "Hello!" |
| `language` | string | Yes | 'en' or 'vi' | "en" |
| `history` | array | No | Previous messages (max 10) | [] |

#### Response

**Success (200 OK)**:
```json
{
  "status": "success",
  "response": "Hi there! I'm Aivy, your cheeky but helpful assistant. How can I help you with English today?",
  "timestamp": "2025-11-08T10:30:00Z"
}
```

**Error (400 Bad Request)**:
```json
{
  "status": "error",
  "message": "Message is required and must be a string"
}
```

**Error (429 Too Many Requests)**:
```json
{
  "status": "error",
  "message": "Too many requests from this IP, please try again later."
}
```

#### Examples

**JavaScript/TypeScript**:
```javascript
const response = await fetch('/api/grok/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "Explain present perfect",
    language: "en",
    history: []
  })
});
const data = await response.json();
console.log(data.response);
```

**cURL**:
```bash
curl -X POST http://localhost:3000/api/grok/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello Aivy!",
    "language": "en"
  }'
```

**Python**:
```python
import requests
import json

url = "http://localhost:3000/api/grok/chat"
payload = {
    "message": "Hello Aivy!",
    "language": "en",
    "history": []
}

response = requests.post(url, json=payload)
data = response.json()
print(data['response'])
```

---

### 2. POST /api/grok/command

Handle voice commands for app control.

#### Request

```http
POST /api/grok/command HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "command": "toggle_dark_mode",
  "language": "en"
}
```

#### Request Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `command` | string | Yes | Command name | "toggle_dark_mode" |
| `language` | string | Yes | 'en' or 'vi' | "en" |

#### Supported Commands

| Command | Description | Triggers |
|---------|-------------|----------|
| `toggle_dark_mode` | Toggle dark/light theme | "toggle dark mode", "dark mode" |
| `change_language_en` | Switch to English | "change to english", "english" |
| `change_language_vi` | Switch to Vietnamese | "change to vietnamese", "tiếng việt" |
| `toggle_sound` | Toggle sound on/off | "toggle sound", "mute", "unmute" |
| `help` | Show help menu | "help", "giúp" |

#### Response

**Success (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "status": "success",
    "action": "toggleDarkMode",
    "message": "✨ Dark mode toggled! Enjoy the new view."
  },
  "timestamp": "2025-11-08T10:30:00Z"
}
```

**Unknown Command (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "status": "unknown",
    "message": "❓ I didn't catch that command. Say 'help' for options!"
  },
  "timestamp": "2025-11-08T10:30:00Z"
}
```

#### Examples

**JavaScript**:
```javascript
const executeCommand = async (cmd, lang = 'en') => {
  const response = await fetch('/api/grok/command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      command: cmd,
      language: lang
    })
  });
  const data = await response.json();
  console.log(data.data.message);
  
  // Execute action if present
  if (data.data.action === 'toggleDarkMode') {
    document.body.classList.toggle('dark-mode');
  }
};

// Usage
executeCommand('toggle_dark_mode', 'en');
```

**cURL**:
```bash
curl -X POST http://localhost:3000/api/grok/command \
  -H "Content-Type: application/json" \
  -d '{"command": "toggle_dark_mode", "language": "en"}'
```

---

### 3. GET /api/grok/health

Health check endpoint to verify service is running.

#### Request

```http
GET /api/grok/health HTTP/1.1
Host: localhost:3000
```

#### Response

**Success (200 OK)**:
```json
{
  "status": "ok",
  "service": "Grok AI Service",
  "timestamp": "2025-11-08T10:30:00Z"
}
```

#### Examples

**JavaScript**:
```javascript
const checkHealth = async () => {
  const response = await fetch('/api/grok/health');
  const data = await response.json();
  return data.status === 'ok';
};

if (await checkHealth()) {
  console.log('✅ Grok service is running');
}
```

**cURL**:
```bash
curl http://localhost:3000/api/grok/health
```

---

## Error Handling

### Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Chat message sent |
| 400 | Bad Request | Invalid message format |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Backend error (see logs) |

### Error Response Format

```json
{
  "status": "error",
  "message": "User-friendly error message",
  "timestamp": "2025-11-08T10:30:00Z"
}
```

### Error Message Examples

**Invalid Message**:
```json
{
  "status": "error",
  "message": "Message is required and must be a string"
}
```

**Invalid Language**:
```json
{
  "status": "error",
  "message": "Language must be 'en' or 'vi'"
}
```

**Rate Limit**:
```json
{
  "status": "error",
  "message": "Too many requests from this IP, please try again later."
}
```

**Server Error**:
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

## Rate Limiting

### Limits

- **20 requests** per **15 minutes** per IP address
- Returns **HTTP 429** when exceeded
- **Resets** after 15 minutes

### Rate Limit Headers

Response includes:
```
RateLimit-Limit: 20
RateLimit-Remaining: 15
RateLimit-Reset: 1699441800
```

### Handling Rate Limits

```javascript
const makeRequest = async (url, options) => {
  const response = await fetch(url, options);
  
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    console.log(`Rate limited. Wait ${retryAfter}s before retry`);
    await new Promise(r => setTimeout(r, retryAfter * 1000));
    return makeRequest(url, options); // Retry
  }
  
  return response;
};
```

---

## Authentication

**Current**: No authentication required (IP-based rate limiting)

**Future**: May require API token or auth header

---

## Message Limits

| Limit | Value |
|-------|-------|
| Max message length | 5,000 characters |
| Max history items | 10 messages |
| Max total request | 1 MB |
| Request timeout | 30 seconds |

---

## Language Codes

| Code | Language |
|------|----------|
| `en` | English |
| `vi` | Vietnamese |

---

## Response Time

| Operation | Typical Time |
|-----------|-------------|
| Chat response | 0.8-1.5 seconds |
| Command execution | < 0.1 seconds |
| Health check | < 0.05 seconds |

---

## CORS Configuration

**Allowed Origins**:
- `http://localhost:5173` (Vite dev)
- `http://localhost:3000` (Backend dev)
- `https://ivslearning.top` (Production)
- `https://www.ivslearning.top` (Production)

**Allowed Methods**: GET, POST, OPTIONS
**Allowed Headers**: Content-Type
**Credentials**: true (if needed)

---

## Testing the API

### Using cURL

```bash
# Test chat
curl -X POST http://localhost:3000/api/grok/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "language": "en"}'

# Test command
curl -X POST http://localhost:3000/api/grok/command \
  -H "Content-Type: application/json" \
  -d '{"command": "toggle_dark_mode", "language": "en"}'

# Test health
curl http://localhost:3000/api/grok/health
```

### Using Postman

1. Create new request
2. Set method to POST
3. Set URL: `http://localhost:3000/api/grok/chat`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "message": "Hello Aivy!",
  "language": "en"
}
```
6. Click Send

### Using Node.js

```javascript
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/grok/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log(JSON.parse(data)); });
});

req.write(JSON.stringify({
  message: "Hello Aivy!",
  language: "en"
}));
req.end();
```

---

## Best Practices

### ✅ DO

- ✅ Include error handling for all requests
- ✅ Respect rate limits
- ✅ Send valid JSON
- ✅ Use correct language codes ('en', 'vi')
- ✅ Keep messages under 5000 chars
- ✅ Check health before making requests
- ✅ Implement retry logic for timeouts
- ✅ Log all API interactions (server-side)

### ❌ DON'T

- ❌ Make repeated requests in quick succession
- ❌ Send non-UTF8 characters
- ❌ Store API key in frontend code
- ❌ Commit API key to Git
- ❌ Expose API key in error messages
- ❌ Make requests without error handling
- ❌ Use production API key in development
- ❌ Share API documentation publicly (contains endpoints)

---

## Webhook (Future)

Coming soon: Webhook support for asynchronous responses

```json
{
  "method": "POST",
  "url": "https://your-domain.com/webhooks/aivy",
  "events": ["chat.response", "command.executed"]
}
```

---

## SDK (Future)

JavaScript SDK for easier integration:

```bash
npm install @ivs/aivy-grok-sdk
```

```javascript
import { AivyClient } from '@ivs/aivy-grok-sdk';

const aivy = new AivyClient({
  baseURL: 'https://api.ivslearning.top',
  timeout: 30000
});

const response = await aivy.chat('Hello!', 'en');
console.log(response.text);
```

---

## Changelog

### v1.0.0 (November 8, 2025)

- ✅ Initial release
- ✅ Chat endpoint
- ✅ Command endpoint
- ✅ Health check
- ✅ Rate limiting
- ✅ Error handling
- ✅ CORS support

---

## Support

For API issues:
1. Check [Troubleshooting](#troubleshooting)
2. Review backend logs
3. Test health endpoint
4. Verify request format
5. Check rate limiting

---

**Last Updated**: November 8, 2025
**Version**: 1.0.0
**Status**: Production Ready
