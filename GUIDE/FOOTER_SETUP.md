# IVSLearning Global Footer Setup

## 📋 Overview

Footer global component untuk semua halaman di IVSLearning. Mencakup:
- Company branding & stats
- Navigation links (Products, Company, Legal)
- Social media links
- Copyright & version info
- Responsive design

## 🚀 Quick Setup

### Step 1: Add Footer Loader Script

Tambahkan ke **SEMUA HTML pages** sebelum closing `</body>` tag:

```html
<!-- Global Footer -->
<script src="/js/footer-loader.js"></script>
```

### Step 2: Add Footer Container

Tambahkan div container untuk footer (opsional, script akan auto-create):

```html
<div id="ivs-footer-container"></div>
```

### Contoh Implementasi Lengkap

```html
<!DOCTYPE html>
<html>
<head>
    <title>Halaman Ku</title>
</head>
<body>
    <!-- Your Page Content -->
    <main>
        <h1>Hello World</h1>
    </main>

    <!-- Global Footer (auto-loads) -->
    <script src="/js/footer-loader.js"></script>
</body>
</html>
```

## 📂 File Structure

```
/components/
├── footer.html          # Footer component (HTML + CSS)

/js/
├── footer-loader.js     # Auto-load footer into pages
```

## 🎨 Component Features

### Sections

1. **Logo Section**
   - IVS Logo
   - Brand title & subtitle
   - Description
   - Stats (50K+ Users, 100+ Courses, 10+ Apps)

2. **Products**
   - Trang Chủ
   - Dashboard
   - Tài Liệu Học Tập
   - Tài Nguyên EdTech

3. **Company**
   - Về IVS JSC
   - Thương Mại
   - Liên Hệ
   - Tuyển Dụng

4. **Legal**
   - Điều Khoản Dịch Vụ
   - Chính Sách Bảo Mật
   - Cookie
   - Giấy Phép

5. **Social Links**
   - Facebook
   - Twitter
   - LinkedIn
   - GitHub
   - YouTube

6. **Footer Bottom**
   - Copyright © 2025
   - Credit (Built with ❤️)
   - Version (v2.0.0 — November 2025)

## 🎯 Responsive Design

| Screen Size | Layout |
|------------|--------|
| Desktop (>1024px) | 5 columns grid |
| Tablet (640-1024px) | 2 columns grid |
| Mobile (<640px) | 1 column stack |

## 🔧 Customization

### Change Links

Edit `/components/footer.html` - tìm section yang ingin diubah:

```html
<!-- Products Section -->
<div class="footer-section">
    <h4 class="footer-section-title">Sản Phẩm</h4>
    <ul class="footer-links">
        <li><a href="/YOUR-PAGE.html" class="footer-link">Your Link</a></li>
    </ul>
</div>
```

### Change Colors

Footer menggunakan CSS variables. Update di `design-system.css`:

```css
--color-primary: #4c5ef7;      /* Logo color */
--color-secondary: #22d3ee;    /* Hover color */
--color-text: #ffffff;
--color-text-secondary: #9ca3af;
```

### Change Stats

Edit stats numbers dalam `/components/footer.html`:

```html
<div class="footer-stat">
    <span class="footer-stat-value">50K+</span>  <!-- Change here -->
    <span class="footer-stat-label">Người Dùng</span>
</div>
```

### Add/Remove Social Links

```html
<div class="footer-socials">
    <!-- Add new social link -->
    <a href="#instagram" class="footer-social-link" title="Instagram">
        <i class="fab fa-instagram"></i>
    </a>
</div>
```

## 📱 Usage Examples

### Example 1: index-new.html
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>IVS Learning - Home</title>
    <link href="css/tailwind.css" rel="stylesheet"/>
    <link href="css/design-system.css" rel="stylesheet"/>
</head>
<body>
    <!-- Header -->
    <header>...</header>
    
    <!-- Main Content -->
    <main>...</main>

    <!-- Footer Auto-Loads -->
    <script src="/js/footer-loader.js"></script>
</body>
</html>
```

### Example 2: courses.html
```html
<!-- Same structure as above -->
<script src="/js/footer-loader.js"></script>
```

## 🐛 Troubleshooting

### Footer not appearing

1. **Check console for errors** (F12 > Console)
2. **Verify path**: `/components/footer.html` exists
3. **Check file permissions**: Can server read the file?
4. **Browser cache**: Hard refresh (Ctrl+Shift+R)

### Footer CSS not working

1. Ensure `design-system.css` is loaded
2. Check for CSS conflicts
3. Verify color variables defined
4. Check for missing Font Awesome icons

### Links not working

1. Verify href paths are correct
2. Check file exists at that path
3. Test in incognito window (clear cache)

## 📊 Performance

- **Footer HTML**: ~8KB (compressed ~2KB)
- **Footer JS**: ~3KB (compressed ~1KB)
- **Load time**: <50ms average
- **Caching**: Can be cached by browser

## 🔒 Security

- ✅ No sensitive data exposed
- ✅ All links are public
- ✅ No tracking pixels
- ✅ GDPR compliant (no cookies by default)

## 📝 Implementation Checklist

Add script to these pages:

- [ ] index-new.html (Homepage)
- [ ] courses.html (Courses)
- [ ] applications.html (Applications)
- [ ] course-detail.html (Course Detail)
- [ ] learning-paths.html (Learning Paths)
- [ ] my-learning.html (Dashboard)
- [ ] auth.html (Authentication)
- [ ] profile.html (User Profile)
- [ ] learning-materials.html (Learning Materials)

## 🚀 Deployment

1. **Local Testing**
   ```bash
   # Make sure footer.html exists
   ls components/footer.html
   
   # Test in browser
   http://localhost:8000/index-new.html
   ```

2. **Firebase Deployment**
   ```bash
   firebase deploy --only hosting
   ```

3. **Verify Live**
   ```
   https://ivslearning.web.app
   ```

## 📞 Support

If footer not working:
1. Check browser console for errors
2. Verify all files are deployed
3. Check file paths are correct
4. Clear browser cache and reload

## 🔗 Related Files

- `components/footer.html` - Footer component
- `js/footer-loader.js` - Auto-loader script
- `css/design-system.css` - CSS variables
- `css/modern-ui.css` - UI styles
