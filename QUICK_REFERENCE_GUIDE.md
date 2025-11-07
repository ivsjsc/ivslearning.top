# ⚡ IVS Learning Hub - Quick Reference Guide for Developers

**Version:** 1.0  
**Date:** 7 November 2025  
**Purpose:** Quick lookup guide for common tasks & solutions

---

## 🚀 Quick Start (5 Minutes)

### Local Development
```bash
# 1. Clone & install
git clone <repo-url>
cd ivslearning.top
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# http://localhost:5000

# 4. Happy coding! 🎉
```

### Deploy to Production
```bash
# 1. Commit changes
git add .
git commit -m "feat: add feature"

# 2. Push to main
git push origin main

# 3. GitHub Actions deploys automatically
# Check: https://github.com/ivsjsc/ivslearning.top/actions
```

---

## 📚 Documentation Map

```
Read THIS if you want to...

├─ Understand overall architecture
│  └─> PORTAL_ARCHITECTURE_STRATEGY.md
│
├─ Know what to build each week
│  └─> IMPLEMENTATION_ROADMAP.md
│
├─ Design UI components
│  └─> UI_UX_COMPONENT_SPECS.md
│
├─ Understand the business case
│  └─> EXECUTIVE_SUMMARY.md
│
├─ Compare learning platforms
│  └─> RESEARCH_LEARNING_PLATFORMS.md
│
└─ Look up a specific API
   └─> API Documentation (Generated from code)
```

---

## 🎯 Key Concepts (Cheatsheet)

### The 3 Pages

| Page | URL | Auth | Purpose |
|------|-----|------|---------|
| **Landing** | `/` | No | Convert visitors → users |
| **Dashboard** | `/dashboard.html` | Yes | User hub, app access |
| **Learning** | `/learning-materials.html` | No | Educate, build authority |

### User Roles

```
┌─ Student
│  ├─ Can: enroll, watch, submit quiz, download cert
│  └─ Cannot: create courses, manage users
│
├─ Instructor
│  ├─ Can: create courses, view student progress
│  └─ Cannot: manage system, view other courses
│
└─ Admin
   ├─ Can: do everything
   └─ Cannot: (limitations enforced by policy)
```

### Main Sub-Apps

| App | URL | Purpose |
|-----|-----|---------|
| **ELearners** | ivseng.web.app | Learn English |
| **Testing** | testplacement.web.app | Placement exams |

---

## 💻 Common Development Tasks

### Add a New Page

```html
<!-- 1. Create: public/new-page.html -->
<!DOCTYPE html>
<html class="dark scroll-smooth" lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Page - IVS Learning Hub</title>
    
    <!-- Include styles -->
    <link rel="stylesheet" href="css/tailwind.css">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body class="bg-ivs-bg text-ivs-text-primary">
    <!-- Your content here -->
</body>
</html>

<!-- 2. Add navigation link (in header) -->
<a href="new-page.html" class="btn btn-ghost">New Page</a>

<!-- 3. Test locally -->
npm run dev
# Visit: http://localhost:5000/new-page.html

<!-- 4. Commit & push -->
git add public/new-page.html
git commit -m "feat: add new page"
git push origin feature/new-page
```

### Add a Button Component

```html
<!-- Basic button -->
<button class="btn btn-primary">Click Me</button>

<!-- With icon -->
<button class="btn btn-primary">
  <i class="fas fa-arrow-right mr-2"></i>
  Get Started
</button>

<!-- Different variants -->
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-ghost">Ghost</button>

<!-- Different sizes -->
<button class="btn btn-sm">Small</button>
<button class="btn btn-md">Medium (default)</button>
<button class="btn btn-lg">Large</button>

<!-- States -->
<button class="btn" disabled>Disabled</button>
<button class="btn is-loading">
  <span class="spinner"></span> Loading...
</button>
```

### Add a Card Component

```html
<!-- Basic card -->
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
  </div>
  <div class="card-body">
    <p>Card content goes here</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>

<!-- Hoverable card -->
<div class="card card-hoverable">
  <img src="image.jpg" alt="Image" class="card-image" />
  <div class="card-content">
    <h3 class="card-title">Title</h3>
    <p class="card-subtitle">Subtitle</p>
  </div>
</div>
```

### Handle Authentication

```javascript
// Check if user is logged in
import { getCurrentUser, isUserAuthenticated } from './app.js';

const user = getCurrentUser();
if (user) {
  console.log('User logged in:', user.email);
} else {
  console.log('User not logged in');
}

// Listen to auth changes
import { initializeGlobalAuthListener } from './app.js';
initializeGlobalAuthListener(); // Call once on page load

// Redirect if not authenticated
if (!isUserAuthenticated()) {
  window.location.href = 'auth.html';
}
```

### Make an API Call to Cloud Functions

```javascript
// Call Cloud Function
async function accessApp(appId) {
  try {
    const idToken = await window.firebaseAuth.currentUser.getIdToken();
    
    const response = await fetch(
      'https://us-central1-ivs-159a7.cloudfunctions.net/createCustomToken',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ appId })
      }
    );
    
    const data = await response.json();
    
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl; // SSO redirect
    }
  } catch (error) {
    console.error('Error:', error);
    showError('Failed to access app');
  }
}
```

### Add Analytics Event

```javascript
// Track custom event
import { logEvent } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js';

logEvent(window.firebaseAnalytics, 'user_enrolled_course', {
  course_id: '12345',
  course_name: 'Learn React',
  enrollment_date: new Date().toISOString()
});
```

### Show Notification

```javascript
// Show success toast
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  const container = document.getElementById('toast-container') || 
    document.body.appendChild(Object.assign(document.createElement('div'), {
      id: 'toast-container',
      className: 'toast-container'
    }));
  
  container.appendChild(toast);
  
  // Auto-remove after 3 seconds
  setTimeout(() => toast.remove(), 3000);
}

// Usage
showToast('Operation successful!', 'success');
showToast('Something went wrong', 'error');
showToast('Please be patient', 'warning');
```

---

## 🐛 Troubleshooting

### Problem: "Firebase not initialized"
```javascript
// Solution: Make sure Firebase is initialized before using it
// Check that this code runs FIRST on page load:
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
  
  const firebaseConfig = { /* your config */ };
  const app = initializeApp(firebaseConfig);
  
  window.firebaseApp = app; // Make available globally
</script>
```

### Problem: "CSS not loading"
```html
<!-- Make sure paths are correct -->
<!-- ❌ Wrong (relative path) -->
<link rel="stylesheet" href="styles.css">

<!-- ✅ Correct (from root) -->
<link rel="stylesheet" href="css/styles.css">
```

### Problem: "SSO token invalid"
```javascript
// Solution: Check token expiry (1 hour)
// If token expired, request new one:
const newToken = await fetch('/createCustomToken', {
  headers: {
    'Authorization': `Bearer ${newIdToken}`
  }
});
```

### Problem: "Mobile layout broken"
```css
/* Check for missing viewport meta tag */
<meta name="viewport" content="width=device-width, initial-scale=1.0">

/* Check for responsive classes */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

### Problem: "Build fails in GitHub Actions"
```bash
# Check logs in GitHub Actions
# Common issues:
# 1. Node version mismatch
# 2. Missing environment variables
# 3. Outdated dependencies

# Solution:
npm install  # Fresh install
npm run build # Test locally first
```

---

## 📊 File Organization

```
public/
├─ index.html ................. Landing page
├─ dashboard.html ............. User dashboard
├─ learning-materials.html .... Learning resources
├─ auth.html .................. Authentication page
├─ profile.html ............... User profile
│
├─ css/
│  ├─ tailwind.css ............ Tailwind base
│  ├─ styles.css .............. Custom styles
│  ├─ animations.css .......... Animation effects
│  ├─ page-specific.css ....... Page-specific styles
│  └─ responsive-enhancements.css ... Media queries
│
├─ js/
│  ├─ app.js .................. Main app logic
│  ├─ auth.js ................. Authentication
│  ├─ dashboard.js ............ Dashboard logic
│  ├─ profile.js .............. Profile management
│  ├─ sso.js .................. SSO handling
│  ├─ utils.js ................ Utility functions
│  ├─ firebase-init.js ........ Firebase setup
│  └─ analytics-tracking.js ... Analytics
│
└─ images/
   ├─ logo/
   ├─ team/
   └─ banners/

functions/
├─ index.js ................... Main Cloud Functions
├─ package.json ............... Dependencies
└─ .env.example ............... Environment template

docs/
├─ ARCHITECTURE.md ............ System design
├─ PORTAL_ARCHITECTURE_STRATEGY.md
├─ UI_UX_COMPONENT_SPECS.md ... Component library
├─ IMPLEMENTATION_ROADMAP.md .. Development plan
├─ EXECUTIVE_SUMMARY.md ....... Business case
└─ RESEARCH_LEARNING_PLATFORMS.md
```

---

## 🔐 Environment Variables

### `.env` Template
```
# Firebase
FIREBASE_API_KEY=xxx
FIREBASE_AUTH_DOMAIN=xxx
FIREBASE_PROJECT_ID=xxx
FIREBASE_STORAGE_BUCKET=xxx
FIREBASE_MESSAGING_SENDER_ID=xxx
FIREBASE_APP_ID=xxx
FIREBASE_MEASUREMENT_ID=xxx

# Cloud Functions
FUNCTIONS_REGION=us-central1
FUNCTIONS_MEMORY=256MB

# Analytics
ANALYTICS_MEASUREMENT_ID=xxx

# Feature Flags
ENABLE_SSO=true
ENABLE_MARKETPLACE=true
ENABLE_ADMIN_DASHBOARD=true
```

### Access in Code
```javascript
// For frontend:
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

// For Cloud Functions:
const projectId = process.env.FIREBASE_PROJECT_ID;
```

---

## 🔗 Useful Links

### Internal
- [GitHub Repository](https://github.com/ivsjsc/ivslearning.top)
- [Firebase Console](https://console.firebase.google.com/project/ivs-159a7)
- [Google Analytics](https://analytics.google.com/analytics/web/)
- [Figma Designs](https://figma.com/...) ← [Need Link]

### External Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org)
- [Accessibility (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)

### Learning Platforms
- [Microsoft Learn](https://learn.microsoft.com)
- [LinkedIn Learning](https://www.linkedin.com/learning)
- [AWS Training](https://aws.amazon.com/training)

---

## ✅ Pre-Commit Checklist

Before pushing code:

```bash
# 1. Check code style
npm run lint

# 2. Run tests
npm run test

# 3. Check accessibility
npm run accessibility-check

# 4. Verify mobile responsive
# Manually test on phone/tablet

# 5. Check performance
npm run lighthouse

# 6. Review your changes
git diff

# 7. Create good commit message
git commit -m "feat: describe what you did

Optional longer description here.

Fixes #123 (if applicable)
"

# 8. Push
git push origin feature/your-feature
```

---

## 📞 Team Communication

### Slack Channels
- `#ivs-learning-hub` - Main channel
- `#dev-alerts` - Deployment alerts
- `#design-reviews` - Design feedback
- `#qa-testing` - QA coordination

### Daily Standup
- **Time:** 10:00 AM Vietnam Time
- **Duration:** 15 minutes
- **What to share:**
  - What you did yesterday
  - What you're doing today
  - Any blockers

### Code Review
- **Minimum reviewers:** 1
- **Approval required:** Yes
- **Tests required:** Yes (>80% coverage)
- **Response time:** <4 hours

---

## 🎯 Performance Targets

### Frontend Metrics
```
Lighthouse:
├─ Performance: >90
├─ Accessibility: >95
├─ Best Practices: >90
└─ SEO: >90

Core Web Vitals:
├─ LCP (Largest Contentful Paint): <2.5s
├─ FID (First Input Delay): <100ms
└─ CLS (Cumulative Layout Shift): <0.1

Mobile:
├─ Page load: <3s
├─ Interactive: <5s
└─ Load time score: >60
```

### Backend Metrics
```
API Response Time:
├─ p50: <100ms
├─ p95: <500ms
└─ p99: <1s

Database Queries:
├─ Average: <50ms
├─ Slow query: >1s (should not happen)
└─ Index usage: >95%

Uptime:
├─ Target: 99.9%
└─ Downtime budget: ~43 minutes/month
```

---

## 🚨 Emergency Procedures

### If Production Is Down

```bash
# 1. Check status page
https://status.firebase.google.com

# 2. Check GitHub Actions
https://github.com/ivsjsc/ivslearning.top/actions

# 3. Check Firebase logs
firebase functions:log

# 4. Immediate actions:
# a) Notify team in Slack (#dev-alerts)
# b) Check recent deployments
# c) Consider rollback:
firebase deploy --only hosting:live --force

# 5. Post-incident:
# a) Create incident report
# b) Schedule post-mortem
# c) Update runbook
```

### If Database Is Corrupted

```javascript
// Backup exists (automatic daily)
// Restore procedure:
// 1. Notify Firebase Support
// 2. Request point-in-time recovery
// 3. Specify recovery time
// 4. Verify data integrity after restore
```

---

## 🎓 Learning Resources

### For This Project
- [x] Read: PORTAL_ARCHITECTURE_STRATEGY.md
- [x] Read: UI_UX_COMPONENT_SPECS.md
- [ ] Review: Component library examples
- [ ] Understand: Firebase best practices
- [ ] Practice: Build a sample feature

### General Web Development
- [x] HTML5 Semantics
- [x] CSS (Flexbox, Grid, Tailwind)
- [x] JavaScript (ES6+, async/await)
- [x] Firebase fundamentals
- [x] SEO & Accessibility

---

## 📝 Quick Notes

### Code Style
```javascript
// Use const by default
const name = 'IVS';

// Use descriptive names
const isUserAuthenticated = true; // Good
const u = true; // Bad

// Use async/await (not .then())
const user = await getCurrentUser();

// Comment complex logic
// Validate email before sending
if (isValidEmail(email)) {
  await sendVerificationEmail(email);
}

// Use functions with single responsibility
function sendEmail(email) { /* ... */ }
function validateEmail(email) { /* ... */ }
```

### CSS Classes
```html
<!-- Use semantic class names -->
<button class="btn btn-primary">Good</button>
<button class="primary-button">Also OK</button>
<button class="blue-rounded-box">Avoid this</button>

<!-- BEM naming for custom components -->
<div class="course-card">
  <div class="course-card__header">
    <h3 class="course-card__title">Title</h3>
  </div>
  <div class="course-card__body">
    Content
  </div>
</div>
```

### HTML Best Practices
```html
<!-- Use semantic HTML -->
<nav>...</nav>
<main>...</main>
<article>...</article>
<aside>...</aside>
<footer>...</footer>

<!-- Use aria-labels for icons -->
<button aria-label="Close menu">
  <i class="fas fa-times"></i>
</button>

<!-- Use alt text for images -->
<img src="logo.svg" alt="IVS Learning Hub Logo" />
```

---

## ⏱️ Time Estimates

### Common Tasks

| Task | Estimate | Notes |
|------|----------|-------|
| Create new page | 2-4 hours | Includes design + code |
| Add component | 1-2 hours | If design exists |
| Fix bug | 1-3 hours | Depends on complexity |
| Implement feature | 4-16 hours | Depends on scope |
| Code review | 30 min - 1 hr | Depends on PR size |
| Deploy to prod | 15-30 min | Mostly waiting for CI/CD |

---

**Last Updated:** 7 November 2025  
**Maintained By:** Development Team  
**Next Update:** When process changes

---

**Got stuck?** Ask in Slack or check the full docs! 💪
