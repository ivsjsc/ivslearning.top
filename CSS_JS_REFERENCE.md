## 📖 CSS & SCRIPT REFERENCE GUIDE

### Quick Access Map

```
ĐƯỜNG DẪN CSS:
├── css/tailwind.css       → Tailwind configuration & variables
├── css/styles.css         → Typography, forms, buttons, alerts
├── css/style.css          → Advanced utilities, modals, grids
└── css/animations.css     → Keyframe animations, transitions

ĐƯỜNG DẪN JAVASCRIPT:
├── CORE AUTH:
│   ├── js/firebase.js     → Firebase configuration
│   ├── js/auth.js         → Login/register/password reset
│   ├── js/app.js          → Global auth state listener
│   └── js/sso.js          → SSO token generation
├── PAGES:
│   ├── js/dashboard.js    → Dashboard initialization
│   └── js/profile.js      → Profile management
├── UTILITIES:
│   ├── js/utils.js        → Helper functions
│   ├── js/language.js     → Translation manager
│   ├── js/language-init.js→ Language initialization
│   └── js/scripts.js      → General scripts
├── FEATURES:
│   ├── js/analytics-dashboard.js    → Charts
│   ├── js/animations.js             → Page animations
│   ├── js/security-enhancements.js  → CSRF/XSS
│   ├── js/content-management.js     → CMS
│   └── js/accessibility-enhancements.js → A11y
└── LOADERS:
    └── /ai/js/loadComponents.js → Dynamic component loading

MEDIA ASSETS:
├── images/logo/logo.svg          → Main logo
├── images/team/default-avatar.png→ User avatar
└── videos/ivsblue.mp4             → Background video (UPLOAD NEEDED)
```

---

## 🎨 CSS Class Reference

### Color Utilities
```css
/* Background Colors */
.bg-ivs-blue          /* #1e3a8a */
.bg-ivs-light-blue    /* #3b82f6 */
.bg-ivs-green         /* #10b981 */
.bg-ivs-purple        /* #8b5cf6 */
.bg-ivs-orange        /* #f59e0b */
.bg-ivs-red           /* #ef4444 */
.bg-ivs-dark          /* #1f2937 */
.bg-ivs-light         /* #f3f4f6 */
.bg-ivs-card          /* #ffffff */

/* Text Colors */
.text-ivs-blue        /* #1e3a8a */
.text-ivs-light-blue  /* #3b82f6 */
.text-ivs-green       /* #10b981 */
.text-ivs-purple      /* #8b5cf6 */
.text-ivs-orange      /* #f59e0b */

/* Border Colors */
.border-ivs-blue      /* #1e3a8a */
.border-ivs-light-blue/* #3b82f6 */
.border-ivs-green     /* #10b981 */
.border-ivs-purple    /* #8b5cf6 */
.border-ivs-orange    /* #f59e0b */
.border-ivs-border    /* #e5e7eb */
```

### Component Classes
```css
/* Cards */
.card                 /* Card with shadow and border */
.card:hover           /* Hover effect */

/* Buttons */
.btn-primary          /* Blue button */
.btn-secondary        /* Gray button */
.btn-success          /* Green button */
.btn-danger           /* Red button */

/* Forms */
.input-field          /* Text input styling */

/* Navigation */
.nav-item             /* Navigation item */
.nav-item.active      /* Active navigation item */

/* Glass Effect */
.glass                /* Glass morphism effect */

/* Badges */
.badge                /* Badge styling */
.badge-primary        /* Blue badge */
.badge-success        /* Green badge */
.badge-warning        /* Yellow badge */
.badge-danger         /* Red badge */

/* Progress Bar */
.progress             /* Progress bar container */
.progress-bar         /* Animated progress fill */

/* Alerts */
.alert                /* Alert container */
.alert-info           /* Blue alert */
.alert-success        /* Green alert */
.alert-warning        /* Yellow alert */
.alert-danger         /* Red alert */

/* Modals */
.modal-overlay        /* Full-screen overlay */
.modal-content        /* Modal content box */

/* Tabs */
.tabs                 /* Tab container */
.tab-button           /* Tab button */
.tab-button.active    /* Active tab */
.tab-content          /* Tab content */
.tab-content.active   /* Active content */

/* Dropdowns */
.dropdown             /* Dropdown container */
.dropdown-content     /* Dropdown menu */

/* Grid */
.grid                 /* Grid container */
.grid-cols-1          /* Single column */
.grid-cols-2          /* Two columns */
.grid-cols-3          /* Three columns */

/* Flex */
.flex                 /* Flexbox container */
.flex-center          /* Center align */
.flex-between         /* Space between */
.flex-column          /* Column direction */
```

### Animation Classes
```css
/* Fade */
.fade-in              /* Fade in animation */
.fade-out             /* Fade out animation */

/* Slide */
.slide-in-up          /* Slide in from bottom */
.slide-in-down        /* Slide in from top */
.slide-in-left        /* Slide in from right */
.slide-in-right       /* Slide in from left */
.slide-out-up         /* Slide out to top */
.slide-out-down       /* Slide out to bottom */
.slide-out-left       /* Slide out to left */
.slide-out-right      /* Slide out to right */

/* Scale */
.scale-in             /* Scale in animation */
.scale-out            /* Scale out animation */

/* Bounce */
.bounce               /* Bounce animation */
.bounce-in            /* Bounce in animation */

/* Rotate */
.rotate-in            /* Rotate in animation */
.rotate-out           /* Rotate out animation */
.spin                 /* Continuous spin */

/* Pulse */
.pulse                /* Pulse animation */
.pulse-scale          /* Pulse with scale */

/* Shake */
.shake                /* Shake animation */
.shake-horizontal     /* Horizontal shake */

/* Glow */
.glow                 /* Glow effect */

/* Flip */
.flip-in-x            /* Flip X animation */
.flip-in-y            /* Flip Y animation */

/* Gradient */
.gradient-shift       /* Gradient shift animation */

/* Hover Effects */
.hover-lift           /* Lift on hover */
.hover-glow           /* Glow on hover */
.hover-scale          /* Scale on hover */
.hover-rotate         /* Rotate on hover */

/* Gradient Backgrounds */
.gradient-blue        /* Blue gradient */
.gradient-green       /* Green gradient */
.gradient-purple      /* Purple gradient */
.gradient-orange      /* Orange gradient */
```

---

## 🔧 JavaScript API Reference

### Global Objects

#### `window.firebaseAuth`
```javascript
// Available after Firebase initialization
window.firebaseAuth.currentUser  // Current logged-in user
```

#### `window.languageManager`
```javascript
// Translation management
window.languageManager.t('key')              // Get translation
window.languageManager.setLanguage('en')     // Switch language
window.languageManager.getLanguage()         // Get current language
```

#### `window.analyticsDashboard`
```javascript
// Analytics charts
window.analyticsDashboard.updateChart('userGrowth', data)
```

#### `window.accessibilityEnhancements`
```javascript
// Accessibility features
window.accessibilityEnhancements.announce('message')
window.accessibilityEnhancements.setPageTitle('title')
```

### Utility Functions (from utils.js)
```javascript
Utils.debounce(func, delay)              // Debounce function
Utils.throttle(func, limit)              // Throttle function
Utils.formatDate(date)                   // Format to date string
Utils.formatTime(date)                   // Format to time string
Utils.formatBytes(bytes, decimals)       // Format bytes to human readable
Utils.generateId()                       // Generate random ID
Utils.deepClone(obj)                     // Deep clone object
Utils.isEmpty(obj)                       // Check if object is empty
Utils.getQueryParam(name)                // Get URL query parameter
Utils.getAllQueryParams()                // Get all URL parameters
Utils.validateEmail(email)               // Validate email format
Utils.validatePassword(password)         // Validate password strength
Utils.sanitizeHTML(html)                 // Sanitize HTML string
Utils.parseJSON(jsonString, default)     // Safely parse JSON
Utils.isInViewport(element)              // Check if in viewport
Utils.smoothScrollTo(element)            // Smooth scroll
Utils.getStorage(key, defaultValue)      // Get from localStorage
Utils.setStorage(key, value)             // Set to localStorage
Utils.removeStorage(key)                 // Remove from localStorage
Utils.clearStorage()                     // Clear all localStorage
Utils.showNotification(message, type, duration) // Show notification
Utils.capitalize(string)                 // Capitalize string
Utils.toSlug(string)                     // Convert to slug
```

### Language Manager (from language.js)
```javascript
new LanguageManager()

// Methods
t(key, language)                         // Get translation
setLanguage(language)                    // Switch language
getLanguage()                            // Get current language
updatePageTranslations()                 // Update page with new language
addTranslation(language, key, value)     // Add single translation
addTranslations(language, map)           // Add multiple translations
```

### Security (from security-enhancements.js)
```javascript
// CSRF Token
sessionStorage.getItem('csrf_token')     // Get CSRF token

// Validation
window.securityEnhancements.validateFormSecurity(form)
```

### Content Management (from content-management.js)
```javascript
window.contentManagement.saveContent(element)
window.contentManagement.loadContent(contentId)
window.contentManagement.showPreview(content)
window.contentManagement.deleteContent(contentId)
```

---

## 📱 Responsive Breakpoints

```css
/* Default: Mobile First */
/* Small screens (default) */

/* Medium screens (768px+) */
@media (min-width: 768px) {
  /* Tablet styles */
}

/* Large screens (1024px+) */
@media (min-width: 1024px) {
  /* Desktop styles */
}

/* Extra large screens (1280px+) */
@media (min-width: 1280px) {
  /* Wide desktop styles */
}
```

---

## 🎯 Data Attributes for HTML

### Animation Triggers
```html
<!-- Data attributes for animations -->
<div data-animation="slide-in-up">...</div>
<div data-animate>...</div>

<!-- Animation delays -->
<div class="delay-100">...</div>
<div class="delay-200">...</div>
<div class="delay-300">...</div>
<div class="delay-500">...</div>

<!-- Animation durations -->
<div class="duration-100">...</div>
<div class="duration-300">...</div>
<div class="duration-500">...</div>
<div class="duration-1000">...</div>
```

### Content Management
```html
<!-- Editable content -->
<div contenteditable="true" id="content-id">...</div>

<!-- Content preview trigger -->
<button data-preview="content-id">Preview</button>
```

### Language Support
```html
<!-- Translatable elements -->
<h1 data-i18n="welcome">Welcome</h1>
<button data-i18n="submit">Submit</button>
```

### Accessibility
```html
<!-- Keyboard navigation -->
<body>Keyboard nav enabled</body>

<!-- Screen reader region -->
<div id="aria-live-region" aria-live="polite"></div>

<!-- Skip to main content -->
<a href="#main-content" class="sr-only">Skip to main content</a>
```

---

## 🔌 Integration Checklist

### Page Load Order
1. HTML document loads
2. CSS files load (inline: tailwind, styles, style, animations)
3. Meta tags & fonts load (Google Fonts via CDN)
4. JavaScript modules defer load
5. Firebase initialization
6. Global auth listener activates
7. Page-specific JS initializes

### Module Dependencies
```
firebase.js
    ↓
app.js (global auth)
    ↓
auth.js / dashboard.js / profile.js (page-specific)
    ↓
utils.js, language.js, sso.js (utilities)
```

### Firebase Initialization Flow
1. Firebase CDN loads
2. `firebase.js` initializes app, auth, analytics
3. `js/app.js` sets up global auth listener
4. `onAuthStateChanged()` callback updates UI
5. Unauth users redirected to `auth.html`
6. Auth users see dashboard

---

## ⚙️ Configuration Files

### CSS Variables (in tailwind.css)
```css
--color-ivs-blue: #1e3a8a
--color-ivs-light-blue: #3b82f6
--color-ivs-green: #10b981
--color-ivs-purple: #8b5cf6
--color-ivs-orange: #f59e0b
--color-ivs-red: #ef4444
--color-ivs-dark: #1f2937
--color-ivs-light: #f3f4f6
--color-ivs-border: #e5e7eb
--color-ivs-card: #ffffff
```

### Language Keys (in language.js)
```javascript
// Navigation
'home', 'dashboard', 'profile', 'settings', 'logout', 'login', 'register'

// Forms
'email', 'password', 'confirmPassword', 'firstName', 'lastName'
'submit', 'cancel', 'save', 'delete', 'edit'

// Messages
'welcome', 'success', 'error', 'loading', 'noResults', 'tryAgain'
```

---

## 📞 Support & Troubleshooting

### CSS Not Loading?
- Check file paths are correct relative to HTML location
- Verify CSS files exist in `/css` folder
- Check browser console for 404 errors
- Clear browser cache (Ctrl+Shift+Delete)

### JavaScript Not Working?
- Check console (F12) for errors
- Verify script file paths
- Ensure Firebase config is correct
- Check all dependencies are loaded

### Images Not Showing?
- Verify image files exist in correct folders
- Check relative paths (use ../css for subdirectories)
- Ensure file extensions match HTML references
- Replace placeholder SVG/PNG with actual images

### Styles Not Applying?
- Check CSS class names match HTML
- Verify Tailwind CSS loads before custom CSS
- Check for CSS conflicts
- Use browser DevTools to inspect styles

---

Last Updated: 7 November 2025
Framework Version: CSS 22.14 KB | JavaScript 70+ KB
Firebase: v12.5.0 | Tailwind: via CDN
