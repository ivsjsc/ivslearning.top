# 📋 **IVS Learning Hub - Comprehensive Testing Checklist**

**Date:** Nov 8, 2025  
**Test Scope:** All 9 live pages + 14 stub pages  
**Test Environment:** Desktop & Mobile

---

## **🖥️ DESKTOP TESTING (Chrome/Firefox/Edge)**

### **Page 1: index.html (Primary Hub)**
```
URL: http://127.0.0.1:5500/index.html
Status: [  ] Pass  [  ] Fail  [  ] Partial

CHECKLIST:
[  ] Header loads correctly (fixed position)
[  ] Logo visible & clickable
[  ] Navigation menu visible (Gioi Thieu, Ung Dung, Tai Nguyen, Admin, Auth)
[  ] Mobile toggle button hidden on desktop
[  ] Hero section displays correctly
  [  ] Title text centered
  [  ] CTA button visible (Bat dau hoc tap ngay)
  [  ] Gradient background showing
[  ] Ecosystem section (3 cards) displaying
  [  ] Green card (Academy)
  [  ] Cyan card (Celestech) 
  [  ] Blue card (Consulting)
[  ] Applications portal section (6 cards)
  [  ] English Learners card
  [  ] Testing & Placement card
  [  ] Kinderlink card
  [  ] StriveStreak card
  [  ] QLGX card
  [  ] "View All Apps" card
[  ] Card hover effects working (translateY -8px)
[  ] CTA section "Yeu Cau Phat Trien" visible
  [  ] Button clickable -> /Pages/webdesign.html
[  ] Footer loaded with links & social icons
  [  ] Quick Links section
  [  ] Services section  
  [  ] Social media icons (FB, Twitter, LinkedIn, YouTube)
  [  ] Privacy/Terms links
[  ] Auth status container loading (Firebase)
  [  ] Show "Dang nhap / Dang ky" when logged out
  [  ] Show Dashboard button when logged in

ISSUES FOUND:
1. _______________________________
2. _______________________________
3. _______________________________
```

### **Page 2: live_index.html (IVS JSC About)**
```
URL: http://127.0.0.1:5500/live_index.html
Status: [  ] Pass  [  ] Fail  [  ] Partial

CHECKLIST:
[  ] Header fixed, navigation working
[  ] Hero section with video background
[  ] Ecosystem 3-column layout
[  ] Services section displaying
[  ] Team/Leadership section
[  ] Partnerships section visible
[  ] Color scheme consistent
[  ] AOS animations triggering on scroll
[  ] Footer present

ISSUES FOUND:
1. _______________________________
```

### **Page 3: auth.html (Login/Register)**
```
URL: http://127.0.0.1:5500/auth.html
Status: [  ] Pass  [  ] Fail  [  ] Partial

CHECKLIST:
[  ] Header present (IVS Auth)
[  ] Back to home link visible
[  ] Video background loading (NOT too dark)
[  ] Auth card visible & readable
  [  ] White text on dark background
  [  ] Card has glow effect (blue border)
[  ] Form fields clearly visible
  [  ] Email input with placeholder
  [  ] Password input with placeholder
[  ] "Forgot password?" link clickable
[  ] Submit button (Dang nhap)
  [  ] Hover effect working
  [  ] Text centered
[  ] Toggle auth mode link (Dang ky ngay)
  [  ] Text readable
[  ] Error/Success messages can display
[  ] Footer present

ISSUES FOUND:
1. _______________________________
```

### **Page 4: dashboard.html**
```
URL: http://127.0.0.1:5500/dashboard.html
Status: [  ] Pass  [  ] Fail  [  ] Partial

CHECKLIST:
[  ] Page loads without 404
[  ] Header visible
[  ] Content displays
[  ] Responsive layout
[  ] No CSS errors

ISSUES FOUND:
1. _______________________________
```

### **Page 5: profile.html**
```
URL: http://127.0.0.1:5500/profile.html
Status: [  ] Pass  [  ] Fail  [  ] Partial

CHECKLIST:
[  ] Page loads without 404
[  ] Header visible
[  ] Content displays
[  ] Responsive layout

ISSUES FOUND:
1. _______________________________
```

### **Page 6: learning-resources.html**
```
URL: http://127.0.0.1:5500/learning-resources.html
Status: [  ] Pass  [  ] Fail  [  ] Partial

CHECKLIST:
[  ] Page loads without 404
[  ] Header has active link highlight
[  ] Content displays correctly
[  ] Cards responsive
[  ] Links working

ISSUES FOUND:
1. _______________________________
```

### **Page 7: learning-materials.html**
```
URL: http://127.0.0.1:5500/learning-materials.html
Status: [  ] Pass  [  ] Fail  [  ] Partial

CHECKLIST:
[  ] Page loads without 404
[  ] Materials/Games cards visible
[  ] Category filters working
[  ] Cards clickable
[  ] Responsive design

ISSUES FOUND:
1. _______________________________
```

### **Page 8: analytics.html (Admin)**
```
URL: http://127.0.0.1:5500/analytics.html
Status: [  ] Pass  [  ] Fail  [  ] Partial

CHECKLIST:
[  ] Page loads without 404
[  ] Admin layout visible
[  ] Charts/stats displaying
[  ] Auth check working

ISSUES FOUND:
1. _______________________________
```

### **Page 9: Pages/webdesign.html (Services)**
```
URL: http://127.0.0.1:5500/Pages/webdesign.html
Status: [  ] Pass  [  ] Fail  [  ] Partial

CHECKLIST:
[  ] Page loads without 404
[  ] Hero section with video visible
[  ] Features section (3 cards) displaying
[  ] Pricing section shows 4 tiers
  [  ] Tier 0: Mini - 1.5M
  [  ] Tier 1: Starter - 10-15M
  [  ] Tier 2: Standard - 15-25M
  [  ] Tier 4: Premium - 25M+
[  ] CTA buttons working
[  ] Contact form fields visible
[  ] Footer with links
[  ] CSS error fixed (background-clip)
[  ] AOS animations working

ISSUES FOUND:
1. _______________________________
```

### **Page 10-23: Stub Pages (/Pages/*.html)**
```
Sample URLs:
- /Pages/tailieu.html
- /Pages/ivscelestech.html
- /Pages/games/ivsgames.html
- /Pages/apps/ivsapps.html

Status: [  ] All Load  [  ] Some 404  [  ] Partial

CHECKLIST:
[  ] All stub pages return 200 (not 404)
[  ] Back to home link present
[  ] Message "Under development" showing
[  ] Responsive on desktop

ISSUES FOUND:
1. _______________________________
```

---

## **📱 MOBILE TESTING (iPhone/Android)**

### **Critical Mobile Tests:**
```
VIEWPORT: 375px (iPhone SE)

[  ] index.html - Mobile menu toggle working
  [  ] Menu opens/closes
  [  ] Close button (X) present
  [  ] Links navigable
  [  ] Hero text visible
  [  ] Cards stack vertically
  [  ] Footer readable

[  ] auth.html - Form fields accessible
  [  ] Input fields full width
  [  ] Buttons easy to tap
  [  ] Video background not too dark
  [  ] No horizontal scroll

[  ] Dashboard pages responsive
  [  ] Layout adapts to 375px
  [  ] Touch interactions working
  [  ] No overflow issues

[  ] All pages:
  [  ] No console errors
  [  ] Fast load time (<3s)
  [  ] Touch-friendly buttons (min 44px)
  [  ] No auto-zoom on focus
```

---

## **🔗 LINK VERIFICATION**

### **Navigation Links to Test:**
```
index.html -> live_index.html [  ]
index.html -> /Pages/webdesign.html [  ]
auth.html -> / [  ]
live_index.html -> index.html [  ]
/Pages/webdesign.html -> / [  ]

All app cards should be clickable:
- IVS English -> https://ivseng.web.app [  ]
- Testing & Placement -> https://testplacement.web.app [  ]
- Kinderlink -> https://ivs-7221b.web.app [  ]
- StriveStreak -> https://strivestreak.netlify.app [  ]
- QLGX -> https://qlgx.netlify.app [  ]
```

---

## **🎨 Visual Consistency Checks**

```
[  ] All pages use correct color scheme
    - Background: #1a1a1a
    - Card: #111111
    - Blue: #4c5ef7
    - Green: #10b981
    - Cyan: #22d3ee

[  ] Consistent typography across pages
    - Primary: Be Vietnam Pro
    - Sizes: 14px (small) -> 48px (hero)

[  ] Spacing consistent
    - Padding: 16px-32px
    - Margins: 8px-64px
    - Gap between cards: 32px

[  ] Button styling uniform
    - All buttons have hover effect
    - All buttons have rounded corners
    - All primary buttons are blue

[  ] Hover effects consistent
    - Cards: translateY(-8px)
    - Links: color change to cyan
    - Buttons: scale + shadow
```

---

## **⚡ Performance Checks**

```
Desktop (Chrome DevTools):
[  ] Lighthouse score > 70
[  ] First Contentful Paint < 1.5s
[  ] Largest Contentful Paint < 2.5s
[  ] Cumulative Layout Shift < 0.1
[  ] Time to Interactive < 3s

Mobile:
[  ] First Contentful Paint < 2s
[  ] Time to Interactive < 4s
[  ] No janky animations
```

---

## **🔒 Security & Auth Tests**

```
[  ] Firebase config loaded correctly
[  ] Auth redirects to dashboard when logged in
[  ] Dashboard page protected (redirects if not logged in)
[  ] Logout button works
[  ] No credentials exposed in HTML
[  ] No console errors related to Firebase
```

---

## **📊 SUMMARY**

**Pages Fully Passing:** _____ / 9  
**Pages Partially Working:** _____ / 9  
**Pages Failed:** _____ / 9  
**Critical Issues:** _____  
**Minor Issues:** _____  

---

## **✅ Sign Off**

**Date Tested:** ___________  
**Tester:** ___________  
**Overall Status:** [ ] PASS [ ] FAIL [ ] PARTIAL  

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

**Generated:** Nov 8, 2025  
**Version:** 1.0
