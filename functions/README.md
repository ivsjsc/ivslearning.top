# IVS Learning Hub - Cloud Functions Deployment Guide

## Overview

This folder contains Firebase Cloud Functions for supporting Single Sign-On (SSO) functionality across IVS Learning Hub and its sub-applications.

## Functions Included

### 1. `createCustomToken`
- **Purpose**: Create a custom Firebase auth token for SSO
- **Method**: POST
- **Headers**: `Authorization: Bearer <idToken>`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "customClaims": {
      "role": "student",
      "organizationId": "org-123"
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ...",
    "expires": 3600
  }
  ```

### 2. `validateIdToken` (preferred)
- **Purpose**: Validate and decode a Firebase ID token (issued by Firebase after signing in).
- **Method**: POST
- **Request Body**:
  ```json
  {
    "idToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ..."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "uid": "user-unique-id",
    "email": "user@example.com",
    "claims": { ... }
  }
  ```

> Note: Because custom tokens must be exchanged client-side using `signInWithCustomToken` which returns an ID token, we recommend using `validateIdToken` for server-side token verification. `validateCustomToken` continues to exist as a deprecated wrapper and will return a helpful error telling the caller to exchange the custom token for an ID token instead.

### 3. `getUserProfile`
- **Purpose**: Get user profile with custom claims
- **Method**: GET/POST
- **Query Parameter**: `uid=user-unique-id`
- **Headers**: `Authorization: Bearer <idToken>`
- **Response**:
  ```json
  {
    "uid": "user-unique-id",
    "email": "user@example.com",
    "displayName": "User Name",
    "customClaims": { ... }
  }
  ```

### 4. `updateUserClaims`
- **Purpose**: Update custom claims (admin only)
- **Method**: POST
- **Headers**: `Authorization: Bearer <adminIdToken>`
- **Request Body**:
  ```json
  {
    "uid": "user-unique-id",
    "claims": {
      "role": "teacher",
      "organizationId": "org-123"
    }
  }
  ```

## Setup Instructions

### 1. Install Dependencies

```bash
cd functions
npm install
```

### 2. Deploy to Firebase

```bash
# Deploy all functions
firebase deploy --only functions

# Or specific function
firebase deploy --only functions:createCustomToken
```

### 3. Test Locally

```bash
# Start Firebase emulator
firebase emulators:start --only functions

# Test endpoint
curl -X POST http://localhost:5001/ivs-159a7/us-central1/createCustomToken \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <idToken>" \
  -d '{
    "email": "test@example.com",
    "customClaims": {"role": "student"}
  }'
```

## Integration with Sub-Applications

### For Main Hub (ivslearning.top)

1. Import SSO helper:
```javascript
import { redirectToApp } from './sso.js';

// When user clicks to access a sub-app
redirectToApp('english', currentUserIdToken, {
    email: user.email,
    role: 'student',
    organizationId: 'org-123'
});
```

### For Sub-Applications (ivseng.web.app, etc.)

1. Import SSO helper:
```javascript
import { handleIncomingSSOToken, signInWithSSO } from './sso.js';

// On app initialization
const ssoData = handleIncomingSSOToken();
if (ssoData) {
    await signInWithSSO(auth, ssoData.token);
    // User is now signed in
} else {
    // Redirect to main hub if no SSO token
    window.location.href = 'https://ivslearning.top';
}
```

## Security Considerations

1. **Token Validation**: Always verify tokens server-side
2. **CORS**: Configured to allow cross-domain requests
3. **Admin Claims**: Only admins can update user claims
4. **Token Expiration**: Tokens expire after 1 hour
5. **Environment Variables**: Store sensitive data in Firebase config

## Troubleshooting

### Tokens not being generated
- Check Firebase Auth credentials
- Verify user exists in Firebase Authentication
- Check Cloud Function logs: `firebase functions:log`

### CORS errors
- Ensure domain is added to Firebase Authentication authorized domains
- Check CORS configuration in Cloud Functions

### Custom claims not working
- Verify admin status of the calling user
- Check Firebase Auth custom claims format
- Refresh ID token after updating claims

## Related Files

- `js/sso.js` - Client-side SSO helper module
- `dashboard.html` - User dashboard with app access
- `learning-materials.html` - Learning hub with SSO integration

## References

- [Firebase Custom Claims Documentation](https://firebase.google.com/docs/auth/admin-sdk-claims)
- [Firebase Cloud Functions Guide](https://firebase.google.com/docs/functions)
- [CORS in Cloud Functions](https://firebase.google.com/docs/functions/http-events#cors_and_security_headers)