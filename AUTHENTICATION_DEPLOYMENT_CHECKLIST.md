# ✅ Authentication System Deployment Checklist

**Status**: READY TO DEPLOY  
**Date**: November 8, 2025  
**Estimated Time**: 1-2 hours

---

## 🔴 CRITICAL - Must Do First (30 mins)

### 1. Configure Firebase API Key
```
[ ] Get API Key from Firebase Console
    - URL: https://console.firebase.google.com/
    - Project: ivs-159a7
    - Settings → Project Settings
    - Copy "Web API Key"

[ ] Update js/firebase-config.js
    - Replace: apiKey: ""
    - With: apiKey: "YOUR_KEY_HERE"
    - Save file

[ ] Verify Firebase Initialization
    - Open browser console
    - Check for any Firebase errors
    - Test page load (no errors)
```

### 2. Enable Auth Methods in Firebase Console
```
[ ] Email/Password
    - Go to Authentication → Sign-in method
    - Enable "Email/Password"
    - Save

[ ] Google Sign-In
    - Authentication → Sign-in method
    - Enable "Google"
    - Add Web SDK configuration
    - Add authorized domains

[ ] Facebook Login
    - Authentication → Sign-in method
    - Enable "Facebook"
    - Add Facebook App ID
    - Add authorized domains
```

### 3. Test Basic Auth Flow
```
[ ] Go to auth.html
[ ] Test Email Registration
    - Enter test email: test@example.com
    - Enter password: Test123456
    - Click Đăng Ký
    - Check for success message
    - Verify email sent

[ ] Test Email Login
    - Enter test@example.com
    - Enter Test123456
    - Click Đăng Nhập
    - Verify redirects to dashboard.html

[ ] Test Google Login
    - Click "Google" button
    - Select test Google account
    - Verify redirects to dashboard.html
    - Check user info loads

[ ] Test Facebook Login
    - Click "Facebook" button
    - Select test Facebook account
    - Verify redirects to dashboard.html
    - Check user info loads
```

---

## 🟠 HIGH PRIORITY - Do Next (45 mins)

### 4. Configure OAuth Domains

#### Google OAuth
```
[ ] Go to Firebase Console
[ ] Authentication → Settings
[ ] Add Authorized Domains:
    - ivslearning.top (production)
    - localhost:8000 (development)
    - localhost:3000 (development)
    - Save

[ ] Test Google login again
    - Verify popup appears
    - Verify no domain errors
```

#### Facebook OAuth
```
[ ] Go to Facebook Developer Console
    - https://developers.facebook.com/
[ ] Get Facebook App ID
[ ] Go to Firebase Console
[ ] Authentication → Facebook
    - Enter Facebook App ID
    - Enter Facebook App Secret
    - Save

[ ] Configure Authorized Redirect URIs
    - Format: https://[PROJECT_ID].firebaseapp.com/__/auth/handler
    - Example: https://ivs-159a7.firebaseapp.com/__/auth/handler
    - Add to Facebook app settings
    - Save
```

### 5. Update Dashboard & Navigation

#### dashboard.html
```html
[ ] Add logout button in header

<!-- BEFORE: No logout -->

<!-- AFTER: Add this -->
<button id="logout-btn" class="btn btn-danger">
    <i class="fas fa-sign-out-alt"></i> Logout
</button>

[ ] Add profile link
<a href="profile.html" class="btn btn-secondary">
    <i class="fas fa-user"></i> Profile
</a>

[ ] Add auth check script
<!-- Check if user logged in, if not redirect to auth.html -->

[ ] Test logout button
    - User should go back to home page
```

#### index.html
```html
[ ] Add profile link to navigation
[ ] Add logout link to user menu
[ ] Add login button if not logged in
[ ] Test navigation flow
```

### 6. Update All Pages

```
[ ] Update header component
    - Add user profile link
    - Add logout link
    - Show user name when logged in

[ ] Update bottom navigation
    - Add profile icon
    - Link to profile.html

[ ] Protected page redirects
    - dashboard.html: Redirect to auth if not logged in
    - profile.html: Already has check
    - learning-resources.html: Add check if protected
```

---

## 🟡 MEDIUM PRIORITY - Polish (30 mins)

### 7. Test All Auth Flows

#### Email/Password
```
[ ] Happy path (success)
    - Register → Email verify → Login → Dashboard
[ ] Error handling
    - Invalid email
    - Weak password
    - Email already in use
    - Wrong password
[ ] Forgot password
    - Click "Quên mật khẩu?"
    - Enter email
    - Check email received
    - Click reset link
    - Set new password
    - Login with new password
```

#### OAuth
```
[ ] Google
    - Fresh login
    - Already logged in
    - Popup blocked (error message)
    - Link existing account
[ ] Facebook
    - Fresh login
    - Already logged in
    - Popup blocked
```

#### Session
```
[ ] Auto-login on refresh
    - Login
    - Refresh page
    - Should stay logged in
[ ] Remember me
    - Login
    - Close browser
    - Open browser
    - Should auto-login
[ ] Logout
    - Logout
    - Refresh page
    - Should redirect to auth
```

### 8. Mobile Testing

```
[ ] iOS Safari
    - Google login works
    - Facebook login works
    - Form inputs responsive
    - Buttons clickable
    - No layout issues

[ ] Android Chrome
    - All features work
    - No layout issues
    - Touch targets correct size

[ ] Tablet
    - Layout responsive
    - All buttons visible
    - Form readable
```

### 9. Fix UI/UX Issues

```
[ ] Button sizing
    - Use new design-system.css
    - All buttons consistent

[ ] Icon sizing
    - Icons in buttons: 20px
    - Icons standalone: 24px
    - Social icons: 18px

[ ] Spacing
    - Use 8px grid
    - Consistent padding
    - Proper gaps

[ ] Colors
    - Primary: #4c5ef7
    - Secondary: #22d3ee
    - Success: #10b981
    - Error: #ef4444
```

---

## 🟢 LOW PRIORITY - Enhancements (Optional)

### 10. Email Templates

```
[ ] Customize Email Verification
    - Firebase Console → Templates
    - Subject: "Xác thực Email IVS Learning"
    - Body: Include verification link

[ ] Customize Password Reset
    - Subject: "Đặt lại mật khẩu IVS Learning"
    - Body: Include reset link

[ ] Test emails
    - Register new account
    - Check email template
    - Verify link works
```

### 11. Add 2FA (Two-Factor Authentication)

```
[ ] Profile page has 2FA button ready
[ ] Implement phone verification
[ ] Send OTP via SMS
[ ] Verify OTP on login
[ ] Test 2FA flow
```

### 12. Security Hardening

```
[ ] HTTPS enforced
[ ] Security headers set
[ ] CSRF protection enabled
[ ] Rate limiting configured
[ ] Input validation on all forms
[ ] SQL injection prevention (use prepared statements)
[ ] XSS protection enabled
[ ] CORS configured properly
```

---

## 📋 File Checklist

### Created Files
```
[✅] js/auth-complete.js             - Complete auth system (400 lines)
[✅] AUTHENTICATION_COMPLETE_GUIDE.md - Full documentation
[✅] AUTH_SYSTEM_AUDIT.md            - Audit report
[✅] profile.html                    - User profile (already existed)
```

### Updated Files
```
[✅] auth.html                       - Google & Facebook login
[✅] firebase-config.js              - Ready for API key
[✅] firebase-init.js                - Init script
```

### Files to Update
```
[ ] dashboard.html                   - Add logout button
[ ] index.html                       - Add navigation links
[ ] components/header.html           - Add user menu
[ ] components/footer.html           - Add links
```

---

## 🧪 Testing Commands

### Test Email Login
```bash
# In browser console:
1. Go to auth.html
2. Enter: email = "test@example.com"
3. Enter: password = "Test123456"
4. Click Đăng Ký
5. Check success message
6. Click Đăng Nhập
7. Verify dashboard loads
```

### Test Google Login
```bash
# In browser console:
1. Click "Google" button
2. Select test account
3. Allow permissions
4. Should redirect to dashboard
```

### Test Session
```bash
# In browser console:
1. Login
2. Press F5 (refresh)
3. Should stay logged in
4. localStorage should have userProfile
```

### Check Firebase Connection
```javascript
// In browser console:
fetch('https://ivs-159a7.firebaseapp.com/__/auth/handler')
  .then(r => console.log('✅ Firebase accessible'))
  .catch(e => console.error('❌ Firebase error:', e));
```

---

## 🚀 Deployment Steps

### Step 1: Pre-Deployment (30 mins)
```
[ ] Add API key to firebase-config.js
[ ] Test all auth flows locally
[ ] Fix any console errors
[ ] Test on mobile
[ ] Run all checklist items above
```

### Step 2: Deploy to Production (30 mins)
```
[ ] Update firebase-config.js
[ ] Upload all files to production server
[ ] Update production domain in Firebase Console
[ ] Test login on live site
[ ] Monitor Firebase error logs
```

### Step 3: Post-Deployment (15 mins)
```
[ ] Test all auth flows on live site
[ ] Check email verification works
[ ] Check password reset works
[ ] Monitor for errors
[ ] Get feedback from users
```

---

## ⚠️ Common Issues & Solutions

### Issue: "apiKey is empty"
**Solution**: Add API key to firebase-config.js first!

### Issue: Google popup doesn't appear
**Solution**: 
1. Check domain is in authorized list
2. Check popups aren't blocked in browser
3. Clear browser cache
4. Try incognito mode

### Issue: Facebook login not working
**Solution**:
1. Verify Facebook App ID in Firebase Console
2. Check redirect URIs in Facebook app settings
3. Make sure Facebook app is in development/live
4. Check app permissions include email

### Issue: Auto-login not working
**Solution**:
1. Check localStorage is enabled
2. Verify onAuthStateChanged listener is set up
3. Check browser privacy mode isn't blocking storage
4. Try different browser

### Issue: User data not syncing
**Solution**:
1. Check Firestore permissions
2. Verify user document structure
3. Check updateProfile function is called
4. Monitor Firebase error logs

---

## 📊 Success Metrics

After deployment, you should see:

```
✅ New users can register via email
✅ Users can login via Google
✅ Users can login via Facebook
✅ Auto-login works on refresh
✅ Logout clears session
✅ Password reset works
✅ Profile page loads user data
✅ No console errors
✅ Mobile is responsive
✅ Email verification works
```

---

## 📞 Firebase Console References

### Links Needed
1. **Firebase Console**: https://console.firebase.google.com/
2. **Project**: ivs-159a7
3. **Authentication**: https://console.firebase.google.com/u/0/project/ivs-159a7/authentication
4. **Google OAuth Setup**: https://console.firebase.google.com/u/0/project/ivs-159a7/authentication/providers
5. **Authorized Domains**: https://console.firebase.google.com/u/0/project/ivs-159a7/authentication/settings

---

## ✅ Final Verification

Before going live, verify:

```
[ ] All auth methods enabled in Firebase
[ ] API key filled in
[ ] Authorized domains configured
[ ] Email templates customized
[ ] All test cases pass
[ ] No console errors
[ ] Mobile responsive
[ ] Logout works
[ ] Auto-login works
[ ] Profile page works
[ ] Error messages are clear
[ ] UI uses new design system
```

---

## 📝 Deployment Checklist Status

| Item | Status | Time | Notes |
|------|--------|------|-------|
| Critical Phase | 🔴 PENDING | 30 mins | API key needed |
| High Priority | 🟠 PENDING | 45 mins | OAuth domains |
| Medium Priority | 🟡 PENDING | 30 mins | Testing |
| Low Priority | 🟢 OPTIONAL | - | Enhancements |
| **TOTAL** | **READY** | **2 hrs** | All files created |

---

**Start with RED items first!**  
**Then move to ORANGE, then YELLOW**  
**GREEN items are optional enhancements**

*Good luck with deployment! 🚀*
