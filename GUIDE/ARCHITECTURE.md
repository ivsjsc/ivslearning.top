# 🏗️ Architecture - IVS Learning Hub

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         END USERS                              │
│                                                                 │
│  👨‍🎓 Students  │  👨‍🏫 Teachers  │  👨‍💼 Admins  │  👥 General Public  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼──────────┐
                    │  FRONTEND LAYER   │
                    └────────┬──────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
   ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐
   │  auth.html  │  │ dashboard.   │  │learning-         │
   │             │  │ html         │  │materials.html    │
   │ • Login     │  │             │  │                  │
   │ • Register  │  │ • Courses   │  │ • IVS English    │
   │ • Reset PWD │  │ • Progress  │  │ • Testing & Plc. │
   │             │  │ • Apps      │  │ • Kinderlink     │
   └─────┬───────┘  └──┬──────────┘  └────────┬─────────┘
         │             │                      │
         │      ┌──────┼─ profile.html ───┐   │
         │      │      │                  │   │
         │      │      ▼                  ▼   │
         │      │  ┌────────────────────┐    │
         │      │  │ • Personal Info    │    │
         │      │  │ • Change PWD       │    │
         │      │  │ • Preferences      │    │
         │      │  └────────────────────┘    │
         │      └──────────────────────────────┘
         │
         └─────────────────────┬────────────────────┐
                               │                    │
                               ▼                    ▼
                        ┌──────────────────────────────────┐
                        │    FIREBASE LAYER               │
                        │                                  │
                        │  • Authentication (Web SDK 12.5) │
                        │  • Realtime Database             │
                        │  • Firestore (Future)            │
                        │  • Cloud Storage                 │
                        │  • Analytics                     │
                        └──────────────┬───────────────────┘
                                       │
                                       ▼
                        ┌──────────────────────────────────┐
                        │   BACKEND SERVICES               │
                        │                                  │
                        │  • Cloud Functions (Deployed)    │
                        │    - createCustomToken()         │
                        │    - validateCustomToken()       │
                        │    - getUserProfile()            │
                        │    - updateUserClaims()          │
                        │                                  │
                        │  • Firebase Admin SDK            │
                        └──────────────┬───────────────────┘
                                       │
                                       ▼
                        ┌──────────────────────────────────┐
                        │   EXTERNAL INTEGRATIONS          │
                        │                                  │
                        │  Sub-Applications (SSO):         │
                        │  ├─ ivseng.web.app              │
                        │  ├─ testplacement.web.app       │
                        │  └─ ivs-7221b.web.app           │
                        │                                  │
                        │  Third-party:                    │
                        │  ├─ Google Analytics             │
                        │  ├─ SendGrid (Email)             │
                        │  └─ Stripe (Payment)             │
                        └──────────────────────────────────┘
```

---

## Authentication Flow

```
User
  │
  ├─► auth.html
  │   • Input: email, password
  │   • Action: signInWithEmailAndPassword()
  │   │
  │   ├─ Success ──► Firebase Auth
  │   │              │
  │   │              ├─ Token generated
  │   │              ├─ onAuthStateChanged()
  │   │              └─ Redirect: dashboard.html
  │   │
  │   └─ Failure ──► Show Error Message
  │
  ├─► dashboard.html
  │   • Check: onAuthStateChanged()
  │   • Protected: If no user → Redirect auth.html
  │   • Display: User's courses, apps
  │   │
  │   └─► Access Sub-App
  │       • Generate SSO Token via Cloud Function
  │       • Redirect with token URL param
  │       └─► Sub-App receives token
  │           • signInWithCustomToken()
  │           • Auto-login user
  │
  └─► profile.html
      • View/Edit personal info
      • updatePassword()
      • updateUserProfile()

Logout
  └─► signOut(auth)
      • Clear session
      • Redirect: auth.html
```

---

## SSO (Single Sign-On) Architecture

```
Main Hub (ivslearning.top)              Sub-App (ivseng.web.app)
──────────────────────────────          ──────────────────────────

User logged in                          
   │
   ├─ Clicks "Access English"
   │
   ├─► Call Cloud Function
   │   GET user ID Token
   │   CALL createCustomToken()
   │
   │   Cloud Function                   
   │   ├─ Verify ID Token (security)
   │   ├─ Extract user info
   │   ├─ Create custom token
   │   └─ Return token
   │
   ├─ Generate URL:                     
   │  https://ivseng.web.app
   │    ?sso_token=<customToken>
   │
   └─► Redirect ──────────────────────► Receive SSO Token
                                        │
                                        ├─ Parse token
                                        ├─ Extract userData
                                        │
                                        ├─ Call signInWithCustomToken()
                                        │
                                        ├─ Receive FirebaseAuthResult
                                        │
                                        └─ User automatically logged in
                                           Access protected resources
```

---

## Data Model

### Firebase Auth User

```javascript
{
  uid: "unique-user-id",
  email: "user@example.com",
  emailVerified: false,
  displayName: "User Name",
  photoURL: "...",
  customClaims: {
    role: "student",              // or "teacher", "admin"
    organizationId: "org-123",
    enrolledCourses: ["course1", "course2"],
    issuedAt: 1699356000000
  }
}
```

### Firestore Collections (Planned)

```javascript
/users/{uid}
  ├─ email: string
  ├─ displayName: string
  ├─ role: string
  ├─ organization: string
  └─ createdAt: timestamp

/courses/{courseId}
  ├─ title: string
  ├─ description: string
  ├─ instructor: reference
  ├─ modules: array
  └─ createdAt: timestamp

/enrollments/{enrollmentId}
  ├─ userId: reference
  ├─ courseId: reference
  ├─ progress: number (0-100)
  ├─ lastAccessed: timestamp
  └─ enrolledAt: timestamp
```

---

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   app.js (Global)                           │
│  • initializeGlobalAuthListener()                           │
│  • updateAuthUIGlobally(user)                              │
│  • getCurrentUser()                                         │
│  • isUserAuthenticated()                                    │
└────────┬─────────────────────────────────────────────────┬──┘
         │ Watches auth state                              │
         │                                                  │
    ┌────▼─────────────┐                        ┌──────────▼────┐
    │  auth.js          │                        │  dashboard.js  │
    │                   │                        │                │
    │ • Form handlers   │                        │ • Load courses │
    │ • Auth logic      │                        │ • Show stats   │
    │ • Redirect        │                        │ • List apps    │
    └─────────────────┘                        └────────────────┘
                 │                                        │
         ┌───────┴─────────┐                    ┌────────┴────────┐
         │                 │                    │                 │
    ┌────▼────────┐   ┌───▼──────────┐  ┌─────▼────┐      ┌─────▼──────┐
    │ Firebase    │   │ profile.js   │  │ sso.js   │      │ app.js     │
    │ Authentication   │              │  │ (SSO)    │      │ (Auth UI)  │
    │               │   │ • Edit info │  │ • Token  │      │ • Header   │
    └────────────┘   │ • Change PWD │  │ • Redirect  │      │ • Dropdown │
                     └──────────────┘  │   │ • Verify │      └────────────┘
                                        └──▼────────┘
                                             │
                            ┌────────────────┼────────────────┐
                            │                │                │
                      ┌─────▼──────┐   ┌────▼──────┐   ┌──────▼───┐
                      │Cloud Function │   │Sub-App 1   │   │Sub-App 2  │
                      │(createToken)  │   │(English)   │   │(Testing)  │
                      └──────────────┘   └────────────┘   └───────────┘
```

---

## Security & Auth Flow

```
Client Side Security:
├─ Local: Auth tokens stored in sessionStorage
├─ Validation: onAuthStateChanged() guards
├─ CORS: Only authorized domains
└─ Transport: HTTPS only in production

Server Side Security:
├─ Firebase Admin SDK: Server-side token verification
├─ Custom Claims: Role-based access control
├─ Cloud Functions: API authentication
├─ CORS Middleware: Cross-origin protection
└─ Audit: Firebase Analytics logging

Token Security:
├─ ID Token: Short-lived (1 hour), auto-refresh
├─ Custom Token: 1 hour expiration
├─ Refresh Token: For maintaining long sessions
└─ Key Rotation: Handled by Firebase
```

---

## Development Stages

```
Phase 1: ✅ COMPLETE (Nov 2025)
├─ Firebase Auth Integration
├─ Dashboard & Profile
├─ Cloud Functions (4 functions)
└─ SSO Infrastructure

Phase 2: Planned (Next)
├─ Firestore Data Models
├─ Real Course Data
├─ Learning Progress Tracking
└─ Analytics Integration

Phase 3: Planned (Future)
├─ Mobile App (React Native)
├─ Video Streaming
├─ Social Learning
└─ AI Recommendations

Phase 4: Planned (Long-term)
├─ Marketplace
├─ API for 3rd-party
└─ Enterprise Features
```

---

## Deployment Architecture

```
Development (Local)
├─ live-server: http://localhost:3000
├─ Firebase Emulator: Functions
└─ Hot reload: npm packages

Staging (Firebase Hosting Preview)
├─ URL: https://<projectId>--<channel>.web.app
├─ Domain: Separate from production
└─ Approval: Before promoting

Production (Firebase Hosting)
├─ Domain: https://ivslearning.top
├─ CDN: Google Cloud CDN
├─ SSL: Automatic HTTPS
├─ Analytics: Google Analytics
└─ Monitoring: Cloud Logging

Sub-apps (Separate Hosting)
├─ ivseng.web.app (Firebase Hosting)
├─ testplacement.web.app (Firebase Hosting)
└─ ivs-7221b.web.app (Firebase Hosting)

Cloud Functions (Serverless Backend)
├─ Region: us-central1
├─ Triggers: HTTP (REST API)
├─ Scaling: Auto (0-3000 instances)
└─ Pricing: Pay per execution
```

---

## Technology Stack

```
Frontend
├─ HTML5
├─ CSS3 (Tailwind CSS)
├─ JavaScript (ES6+)
├─ Firebase Web SDK v12.5.0
└─ FontAwesome Icons

Backend Services
├─ Firebase Authentication
├─ Firebase Cloud Functions (Node.js)
├─ Firebase Admin SDK
└─ CORS Middleware

Infrastructure
├─ Firebase Hosting
├─ Firebase Cloud Functions
├─ Google Cloud Platform
└─ CDN (Google Cloud CDN)

Development Tools
├─ live-server (local testing)
├─ Firebase CLI
├─ npm / Node.js
└─ VS Code
```

---

## Future Expansion Points

```
Integrations (Ready for)
├─ Firestore (Data storage)
├─ Cloud Storage (File uploads)
├─ Realtime Database (Live features)
├─ Cloud Messaging (Push notifications)
├─ Cloud Tasks (Scheduled jobs)
└─ Pub/Sub (Event streaming)

External Integrations
├─ Google Analytics
├─ SendGrid / Mailgun
├─ Stripe / PayPal
├─ Twilio
├─ Auth0 (if needed)
└─ Custom APIs
```

---

**Last Updated**: 7 Nov 2025
**Architect**: GitHub Copilot
**Status**: Production Ready ✅
