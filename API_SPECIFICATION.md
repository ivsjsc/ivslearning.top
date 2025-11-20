# API Specification - IVS Learning Hub (Auth Endpoints)

Tài liệu tóm tắt các API liên quan tới Authentication / Account. Dưới đây là phần tóm tắt nhanh (chi tiết phía dưới từng endpoint):

Base path: `/api/auth` (ví dụ backend: `https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/auth`)

---

## POST /signup

Mục đích: Tạo tài khoản mới.

Request Body (JSON):
```
{ "email": string, "password": string, "displayName": string, "phoneNumber": string? }
```

Response (200 Success):
```
{ "success": true, "data": { "user": {"uid","email","displayName","phoneNumber"}, "tokens": {"accessToken","refreshToken","expiresIn" } } }
```

Errors: `409 email already in use`, `400 invalid payload`, `422 weak password`.

Notes: Stores a `users/{uid}` profile in Firestore/DB and may send a verification email if configured.

---

## POST /login

Mục đích: Đăng nhập với email + password.

Request Body (JSON):
```
{ "email": string, "password": string }
```

Response: giống `/signup` (returns `user` + tokens). Error codes: `401 unauthorized`, `404 user-not-found`, `403 account disabled`.

Security: On success server may set HttpOnly cookie for refresh token and return `accessToken` in JSON.

---

## POST /refresh

Mục đích: Lấy accessToken mới từ refreshToken

Request Body (JSON):
```
{ "refreshToken": string }
```

Response (200):
```
{ "success": true, "data": { "accessToken": string, "expiresIn": number } }
```

Errors: `401 invalid refresh token`, `403 refresh token expired`.

---

## GET /google/login

Mục đích: Backend trả về `authUrl` để redirect user tới Google OAuth (server-side constructs OAuth flow)

Response:
```
{ "authUrl": "https://accounts.google.com/..." }
```

Flow: client redirects user to `authUrl`. Google will redirect back to server callback which issues a custom token or finalizes the session.

---

## POST /google

Mục đích: Server accepts `authCode` (from client or callback) to exchange for tokens & sign-in user.

Request Body:
```
{ "authCode": string }
```

Response: same as `/signup` or `/login` with `user` & `tokens`.

---

## POST /phone-otp, POST /verify-phone

OTP phone login flow:

- `POST /phone-otp` (or `/phone/send-otp`):
  - Body: `{phoneNumber: string}`
  - Response: `{ success: true }` and backend usually stores OTP and/or initiates SMS provider.

- `POST /verify-phone`:
  - Body: `{ phoneNumber: string, otp: string }`
  - Response: `{ success: true, data: { user, token } }` (server creates or finds user and returns tokens or sets cookie)

Errors: invalid phone format, OTP expired, OTP mismatch.

---

## POST /send-reset-password, /confirm-reset-password

Reset password flow:

1. `POST /send-reset-password` body `{ contact: string }` (email or phone)
   - For email: server sends password reset link using Firebase or custom email flow.
   - For phone: server sends OTP for verification.

2. `POST /confirm-reset-password` body `{ tokenOrOtp, newPassword }` or `{ otp, newPassword, phone }`
   - Response: `{ success: true }`.

Errors: `400 invalid token`, `401 unauthorized`, `422 weak password`.

---

## POST /send-signin-link, /verify-email-link

Passwordless email sign-in flow:

1. `POST /send-signin-link`: body `{ email }`, server sends a magic link with token.
2. `POST /verify-email-link`: verifies the token and returns session tokens like in login/signup.

---

## POST /anonymous

Create guest/anonymous user token; returns `{ success: true, data: { user, tokens } }`.

---

## POST /find-account

Lookup by email for account recovery (e.g., find associated providers, has account, is teacher/admin):

Request: `{ email }` Response: `{ success: true, data: { exists: bool, providers: [], hint: '' } }`.

---

## POST /logout

Invalidate refresh token on server, clear cookie (if set), invalidate session if necessary.

Body: `{ refreshToken? }` or rely on cookies

Response: `{ success: true }`.

---

## GET /me

Get current user profile from token.

Headers: `Authorization: Bearer <accessToken>` or rely on session cookie.

Response: `{ success: true, data: { user } }`.

---

## PUT /profile

Update user profile.

Request Body: `{ displayName?, phoneNumber?, preferences?, avatarUrl? }`
Response: `{ success: true, data: { user } }`.

---

## POST /verify (verify token)

Used by backendAuthService for verifying tokens provided by SSO flows or third parties.

Request Body: `{ token }`
Response: `{ success: true, data: { valid: true, uid, claims, expiresIn } }` or `401`.

---

# Security Considerations
- All endpoints should use HTTPS.
- Return short-lived `accessToken` (JWT) and long-lived `refreshToken` (HttpOnly cookie recommended) — to reduce CSRF/XSS risk.
- Rate-limit sensitive endpoints (login, signup, send-otp, send-reset-password) using per-IP/ per-account granularity.
- Use recaptcha and anti-abuse measures for phone OTP and sign-up endpoints.
- Validate and sanitize all inputs and use strong password policies.

# SSO / OAuth Tips
- For `GET /google/login`, the server should include the proper callback in `authUrl` and preserve `state` (CSRF mitigations).
- The backend should exchange `authCode` securely server-side and return a custom token or standard session.
- For SSO to sub-apps (ELearners), the `sso` token can be a Firebase Custom Token or a JWT with claims; subapps verify it using `/api/auth/verify` or their own Firebase Admin verification.

# Error Format (recommendation)
```
{ "success": false, "error": { "code": "string", "message": "Human readable", "details": {} } }
```

# Response Example: Register & Login
```
{ "success": true, "data": {
    "user": { "uid": "abc123", "email": "x@y.z", "displayName": "User A" },
    "tokens": {
        "accessToken": "ey..",
        "refreshToken": "rt..",
        "expiresIn": 3600
    }
} }
```

---

If you'd like, I can expand each section with full JSON schemas for requests/responses, and add example curl commands + security headers and cookie usage for each endpoint.
