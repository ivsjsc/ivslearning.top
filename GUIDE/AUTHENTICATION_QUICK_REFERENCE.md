# ⚡ Authentication Quick Reference

**Purpose**: Fast lookup guide for developers  
**Format**: Code snippets + short descriptions  
**Language**: Vietnamese & English

---

## 🔑 Firebase Configuration

### Template
```javascript
// js/firebase-config.js
export const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",                 // ← Get from Firebase Console
    authDomain: "ivs-159a7.firebaseapp.com",
    projectId: "ivs-159a7",
    storageBucket: "ivs-159a7.appspot.com",
    messagingSenderId: "503895668514",
    appId: "1:503895668514:web:16ccacd60f9a420becd77b"
};
```

### Where to Get API Key
1. Go to: https://console.firebase.google.com/
2. Select project: `ivs-159a7`
3. Settings (gear icon) → Project Settings
4. Copy "Web API Key" (looks like: AIzaSyB...)
5. Paste in `firebase-config.js`

---

## 🔐 Authentication Methods

### Email/Password
**File**: `auth.html`
**HTML**:
```html
<form id="auth-form">
    <input type="email" id="email" placeholder="Email">
    <input type="password" id="password" placeholder="Password">
    <button type="submit">Đăng Nhập</button>
</form>
```

**Result**: User logged in → Redirects to dashboard.html

### Google OAuth
**File**: `auth.html`
**HTML**:
```html
<button id="google-signin">
    <i class="fab fa-google"></i> Google
</button>
```

**JavaScript**: Already implemented in auth.html

**Result**: User profile auto-loaded → Redirects to dashboard.html

### Facebook OAuth
**File**: `auth.html`
**HTML**:
```html
<button id="facebook-signin">
    <i class="fab fa-facebook-f"></i> Facebook
</button>
```

**JavaScript**: Already implemented in auth.html

**Result**: User profile auto-loaded → Redirects to dashboard.html

---

## 👤 User Profile Functions

### Get Current User
```javascript
import { onAuthStateChanged } from 'firebase-auth.js';

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User email:', user.email);
        console.log('User name:', user.displayName);
        console.log('User photo:', user.photoURL);
        console.log('Email verified:', user.emailVerified);
    }
});
```

### Update User Profile
```javascript
import { updateProfile } from 'firebase-auth.js';

await updateProfile(auth.currentUser, {
    displayName: "Nguyễn Văn A",
    photoURL: "https://example.com/photo.jpg"
});
```

### Change Password
```javascript
import { updatePassword } from 'firebase-auth.js';

try {
    await updatePassword(auth.currentUser, "NewPassword123");
    console.log("✅ Password updated!");
} catch (error) {
    console.error("❌ Error:", error.message);
}
```

### Send Password Reset Email
```javascript
import { sendPasswordResetEmail } from 'firebase-auth.js';

try {
    await sendPasswordResetEmail(auth, "user@example.com");
    console.log("✅ Reset email sent!");
} catch (error) {
    console.error("❌ Error:", error.message);
}
```

---

## 🚪 Logout & Session

### Logout User
```javascript
import { signOut } from 'firebase-auth.js';

const handleLogout = async () => {
    try {
        await signOut(auth);
        localStorage.clear();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
};
```

### Auto-Login on Refresh
```javascript
import { onAuthStateChanged } from 'firebase-auth.js';

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User already logged in
        console.log('Already logged in:', user.email);
    } else {
        // User not logged in
        window.location.href = 'auth.html';
    }
});
```

### Check if User Logged In
```javascript
if (auth.currentUser) {
    console.log('✅ User logged in:', auth.currentUser.email);
} else {
    console.log('❌ User not logged in');
}
```

---

## 📧 Email Verification

### Send Verification Email
```javascript
import { sendEmailVerification } from 'firebase-auth.js';

try {
    await sendEmailVerification(auth.currentUser);
    console.log("✅ Verification email sent!");
} catch (error) {
    console.error("❌ Error:", error.message);
}
```

### Check if Email Verified
```javascript
console.log("Email verified:", auth.currentUser.emailVerified);

if (!auth.currentUser.emailVerified) {
    console.log("⚠️ Please verify your email");
}
```

---

## 🎨 HTML Elements Reference

### Button Classes
```html
<!-- Primary Button -->
<button class="btn btn-primary">Action</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">Secondary</button>

<!-- Success Button -->
<button class="btn btn-success">Success</button>

<!-- Danger Button -->
<button class="btn btn-danger">Delete</button>

<!-- Icon Button -->
<button class="btn btn-icon">
    <i class="fas fa-heart"></i>
</button>

<!-- Full Width -->
<button class="btn btn-full">Full Width</button>
```

### Form Classes
```html
<div class="form-group">
    <label class="form-label">Label</label>
    <input type="text" class="form-input" placeholder="Enter text">
</div>

<textarea class="form-textarea"></textarea>

<select class="form-select">
    <option>Option 1</option>
</select>
```

### Message/Alert Classes
```html
<!-- Success Message -->
<div class="message success">✅ Success!</div>

<!-- Error Message -->
<div class="message error">❌ Error!</div>

<!-- Warning Message -->
<div class="message warning">⚠️ Warning!</div>

<!-- Info Message -->
<div class="message info">ℹ️ Information</div>
```

---

## 🔄 Common Flows

### Complete Login Flow
```
1. User enters email + password
2. Click "Đăng Nhập"
3. Firebase validates
4. ✅ Success → localStorage saved → Redirect to dashboard
   ❌ Error → Show error message → Stay on login page
```

### Complete Registration Flow
```
1. User enters email + password + confirm password
2. Click "Đăng Ký"
3. Firebase creates account
4. Email verification sent
5. ✅ Show success message → Clear form → Switch to login
   ❌ Error → Show error message → Stay on registration
```

### OAuth Login Flow
```
1. User clicks "Google" or "Facebook"
2. Popup appears
3. User selects account
4. ✅ Profile auto-loaded → Redirect to dashboard
   ❌ Error or user cancels → Show message → Stay on page
```

### Logout Flow
```
1. User clicks "Đăng Xuất"
2. Firebase signs out
3. localStorage cleared
4. Redirect to home page
5. User sees login screen
```

---

## ⚠️ Error Messages Reference

### Common Errors & Fixes

| Error | Vietnamese | Cause | Fix |
|-------|-----------|-------|-----|
| `auth/user-not-found` | "Email chưa được đăng ký" | Email not registered | Register first |
| `auth/wrong-password` | "Mật khẩu không đúng" | Wrong password | Check password |
| `auth/email-already-in-use` | "Email đã được sử dụng" | Email exists | Use different email |
| `auth/weak-password` | "Mật khẩu quá yếu" | Password < 6 chars | Use longer password |
| `auth/invalid-email` | "Email không hợp lệ" | Invalid email format | Check email format |
| `auth/popup-blocked` | "Cửa sổ bị chặn" | Popup blocker | Allow popups |
| `auth/popup-closed-by-user` | "Đã đóng cửa sổ" | User closed popup | Try again |
| `auth/unauthorized-domain` | "Tên miền chưa ủy quyền" | Domain not authorized | Add to Firebase |
| `auth/too-many-requests` | "Quá nhiều yêu cầu" | Rate limited | Wait and retry |
| `auth/network-request-failed` | "Lỗi kết nối mạng" | No internet | Check connection |

---

## 🧪 Testing Commands

### Test in Browser Console
```javascript
// Check if user logged in
console.log(auth.currentUser);

// Get user email
console.log(auth.currentUser?.email);

// Check localStorage
console.log(localStorage.getItem('userProfile'));

// Manually logout
firebase.auth().signOut();

// Test Firebase connection
fetch('https://ivs-159a7.firebaseapp.com/__/auth/handler')
    .then(r => console.log('✅ Firebase OK'))
    .catch(e => console.error('❌ Firebase Error:', e));
```

### Test Auth Flow
```javascript
// 1. Register
await firebase.auth().createUserWithEmailAndPassword('test@example.com', 'Test123456');

// 2. Login
const result = await firebase.auth().signInWithEmailAndPassword('test@example.com', 'Test123456');
console.log('✅ Logged in:', result.user.email);

// 3. Check profile
console.log('User:', auth.currentUser);

// 4. Logout
await firebase.auth().signOut();
console.log('✅ Logged out');
```

---

## 🎯 Performance Tips

### Optimize Auth Loading
```javascript
// ✅ Good: Lazy load OAuth providers
const googleProvider = new GoogleAuthProvider();

// ❌ Bad: Load all at once
import * as firebase from 'firebase/app';
```

### Cache User Profile
```javascript
// ✅ Good: Cache in localStorage
const userProfile = JSON.parse(localStorage.getItem('userProfile'));

// ❌ Bad: Fetch every time
auth.currentUser.reload(); // Expensive!
```

### Minimize Firebase Bundle
```javascript
// ✅ Good: Import only what you need
import { signInWithEmailAndPassword } from 'firebase/auth';

// ❌ Bad: Import everything
import * as firebase from 'firebase';
```

---

## 📱 Mobile Tips

### Touch-Friendly Buttons
```html
<!-- ✅ Good: 44px minimum -->
<button style="min-width: 44px; min-height: 44px;">OK</button>

<!-- ❌ Bad: Too small -->
<button style="width: 30px; height: 30px;">OK</button>
```

### Responsive Forms
```html
<!-- ✅ Good: Full width on mobile -->
<input style="width: 100%;" type="email">

<!-- ❌ Bad: Fixed width -->
<input style="width: 300px;" type="email">
```

### Password Visibility Toggle
```html
<input type="password" id="password">
<button onclick="this.previousElementSibling.type = 
    this.previousElementSibling.type === 'password' ? 'text' : 'password'">
    Show/Hide
</button>
```

---

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| Firebase Console | https://console.firebase.google.com/ |
| Project Settings | https://console.firebase.google.com/u/0/project/ivs-159a7/settings/general |
| Authentication | https://console.firebase.google.com/u/0/project/ivs-159a7/authentication/users |
| Sign-in Methods | https://console.firebase.google.com/u/0/project/ivs-159a7/authentication/providers |
| Authorized Domains | https://console.firebase.google.com/u/0/project/ivs-159a7/authentication/settings |
| Email Templates | https://console.firebase.google.com/u/0/project/ivs-159a7/authentication/emails |
| Firebase Docs | https://firebase.google.com/docs/auth |
| Google Sign-In | https://firebase.google.com/docs/auth/web/google-signin |
| Facebook Login | https://firebase.google.com/docs/auth/web/facebook-login |

---

## 📝 File Locations

```
Quick Access:
├── 📄 auth.html                    ← Login/Register page
├── 👤 profile.html                 ← User profile page
├── 🏠 dashboard.html               ← Main app
├── 🔧 js/firebase-config.js        ← Configuration (needs API key)
├── 🔐 js/auth-complete.js          ← Complete auth system
├── 📚 AUTHENTICATION_COMPLETE_GUIDE.md
├── ✅ AUTHENTICATION_DEPLOYMENT_CHECKLIST.md
└── 📖 AUTHENTICATION_QUICK_REFERENCE.md (this file)
```

---

## ⚡ One-Liners

```javascript
// Login
await signInWithEmailAndPassword(auth, 'user@example.com', 'password123');

// Register
await createUserWithEmailAndPassword(auth, 'user@example.com', 'password123');

// Google Login
await signInWithPopup(auth, googleProvider);

// Facebook Login
await signInWithPopup(auth, facebookProvider);

// Logout
await signOut(auth);

// Reset Password
await sendPasswordResetEmail(auth, 'user@example.com');

// Update Profile
await updateProfile(auth.currentUser, { displayName: 'John Doe' });

// Change Password
await updatePassword(auth.currentUser, 'newPassword123');

// Send Email Verification
await sendEmailVerification(auth.currentUser);

// Check Auth State
onAuthStateChanged(auth, (user) => { /* handle user */ });

// Get Current User
auth.currentUser

// Get User Email
auth.currentUser?.email

// Get User Name
auth.currentUser?.displayName

// Get User Photo
auth.currentUser?.photoURL

// Is Email Verified
auth.currentUser?.emailVerified
```

---

## 🚀 Deployment Quick Steps

```
1. Add API key to firebase-config.js
2. Enable auth methods in Firebase Console
3. Add authorized domains
4. Test locally
5. Deploy files to server
6. Update Firebase authorized domains to production URL
7. Test on live site
```

---

## 💡 Helpful Patterns

### Protected Page Pattern
```javascript
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'auth.html';
    } else {
        loadPageContent(user);
    }
});
```

### User Menu Pattern
```javascript
if (auth.currentUser) {
    showUserMenu(auth.currentUser.displayName);
    showLogoutButton();
} else {
    showLoginButton();
}
```

### Form Validation Pattern
```javascript
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

if (!email || !password) {
    showError('All fields required');
    return;
}

if (password.length < 6) {
    showError('Password too short');
    return;
}

// Proceed with authentication
```

---

**Last Updated**: November 8, 2025  
**Version**: 1.0  
**Status**: ✅ Complete
