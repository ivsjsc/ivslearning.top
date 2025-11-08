# Guide: Tách & Sử Dụng Header/Footer Components

## 📖 Mục Tiêu
Hướng dẫn cách tách Header và Footer khỏi các HTML file và sử dụng chúng như components độc lập.

---

## ✅ Hiện Tại: Components Đã Tồn Tại

Các file component đã được tạo sẵn trong `components/`:

```
components/
├── header.html          # Header chính (với nav, hamburger)
├── header-auth.html     # Header tối giản cho auth pages
├── footer.html          # Footer chính (với links, social)
├── footer-auth.html     # Footer tối giản cho auth pages
└── bottom-nav.html      # Navigation bottom cho mobile
```

---

## 🔧 Cách Tích Hợp Components vào Pages

### Phương Pháp 1: Sử dụng JavaScript (Recommended)

#### HTML Structure
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>My Page</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <!-- Container cho Header -->
    <div id="header-container"></div>
    
    <!-- Main Content -->
    <main class="main-content">
        <!-- Your content here -->
    </main>
    
    <!-- Container cho Footer -->
    <div id="footer-container"></div>
    
    <script src="js/component-loader.js"></script>
</body>
</html>
```

#### JavaScript Component Loader
**File: `js/component-loader.js`**
```javascript
/**
 * Component Loader - Tải Header/Footer dynamically
 */

class ComponentLoader {
    constructor() {
        this.components = {
            header: 'components/header.html',
            headerAuth: 'components/header-auth.html',
            footer: 'components/footer.html',
            footerAuth: 'components/footer-auth.html',
            bottomNav: 'components/bottom-nav.html'
        };
    }

    /**
     * Load a component into a container
     * @param {string} componentType - Type of component to load
     * @param {string} containerId - ID of container element
     * @param {boolean} isAuth - Is this an auth page?
     */
    async load(componentType = 'header', containerId = 'header-container', isAuth = false) {
        try {
            const componentPath = this.getComponentPath(componentType, isAuth);
            const response = await fetch(componentPath);
            
            if (!response.ok) {
                throw new Error(`Failed to load ${componentPath}: ${response.status}`);
            }
            
            const html = await response.text();
            const container = document.getElementById(containerId);
            
            if (container) {
                container.innerHTML = html;
                console.log(`✅ Loaded: ${componentPath}`);
            } else {
                console.error(`Container not found: #${containerId}`);
            }
        } catch (error) {
            console.error(`Error loading component:`, error);
        }
    }

    /**
     * Get component path based on type and context
     */
    getComponentPath(type, isAuth = false) {
        if (type === 'header') {
            return isAuth ? this.components.headerAuth : this.components.header;
        }
        if (type === 'footer') {
            return isAuth ? this.components.footerAuth : this.components.footer;
        }
        return this.components[type] || this.components.header;
    }

    /**
     * Load all components at once
     */
    async loadAll(isAuth = false) {
        await Promise.all([
            this.load('header', 'header-container', isAuth),
            this.load('footer', 'footer-container', isAuth)
        ]);
    }
}

// Auto-load components on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
    const loader = new ComponentLoader();
    
    // Check if current page is auth page
    const isAuthPage = window.location.pathname.includes('auth');
    
    // Load components
    await loader.loadAll(isAuthPage);
});
```

---

### Phương Pháp 2: Server-Side Include (SSI)

Nếu sử dụng Apache Server với SSI enabled:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <!--#include virtual="components/header.html" -->
    
    <main>
        <!-- Content -->
    </main>
    
    <!--#include virtual="components/footer.html" -->
</body>
</html>
```

**File .htaccess**:
```apache
AddType text/html .html
AddOutputFilter INCLUDES .html
```

---

### Phương Pháp 3: Template Engine (Ví dụ EJS/Handlebars)

**Express.js Example**:
```javascript
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', {
        header: 'components/header',
        footer: 'components/footer'
    });
});
```

**index.ejs**:
```html
<!DOCTYPE html>
<html>
<head><title>Home</title></head>
<body>
    <%- include(header) %>
    
    <main>
        <!-- Content -->
    </main>
    
    <%- include(footer) %>
</body>
</html>
```

---

## 📱 Sử Dụng Components theo Tình Huống

### 1. Trang Chính (index.html)

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IVS Learning Hub - Home</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <!-- Load main header -->
    <div id="header-container"></div>
    
    <main>
        <h1>Welcome to IVS Learning Hub</h1>
        <!-- Main content -->
    </main>
    
    <!-- Load main footer -->
    <div id="footer-container"></div>
    
    <script src="js/component-loader.js"></script>
</body>
</html>
```

### 2. Trang Auth (auth.html)

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng Nhập - IVS Learning Hub</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <!-- Load minimal auth header -->
    <div id="header-container"></div>
    
    <main>
        <!-- Auth form -->
    </main>
    
    <!-- Load minimal auth footer -->
    <div id="footer-container"></div>
    
    <script>
        // Mark as auth page
        const loader = new ComponentLoader();
        loader.loadAll(true); // true = load auth versions
    </script>
</body>
</html>
```

### 3. Trang Dashboard (dashboard.html)

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - IVS Learning Hub</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <!-- Load main header -->
    <div id="header-container"></div>
    
    <main>
        <!-- Dashboard content -->
    </main>
    
    <!-- Load main footer -->
    <div id="footer-container"></div>
    
    <script src="js/component-loader.js"></script>
</body>
</html>
```

---

## 🎯 Component Details

### Header Component (`components/header.html`)

**Struktur**:
- Logo (left) - IVS icon + "IVS Learning Hub" text
- Navigation (center) - 4 main links
- Auth section (right) - Login/Logout buttons
- Hamburger (right on mobile) - Navigation toggle

**CSS Classes**:
- `.header-logo` - Logo container
- `.header-nav` - Desktop navigation
- `.header-auth` - Auth buttons container
- `.header-menu-toggle` - Hamburger button
- `.mobile-menu-overlay` - Mobile menu overlay

**JavaScript Hooks**:
- `#header-auth-container` - Where auth buttons are injected
- `#mobile-menu-toggle` - Hamburger toggle button
- `#mobile-menu-overlay` - Mobile menu overlay

---

### Footer Component (`components/footer.html`)

**Struktur**:
- Brand section (left) - Logo, title, description, social
- Product links (center-left)
- Company links (center-right)
- Legal links (right)
- Bottom section - Copyright, stats

**CSS Classes**:
- `.footer` - Footer container
- `.footer-section` - Individual sections
- `.footer-links` - Link lists
- `.social-links` - Social media icons

---

## 🔌 JavaScript Integration

### Example: Custom Event Handling

```javascript
// After components are loaded, you can add event listeners
document.addEventListener('DOMContentLoaded', async () => {
    const loader = new ComponentLoader();
    await loader.loadAll();
    
    // Now access header elements
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            console.log('Hamburger clicked!');
        });
    }
    
    // Access footer elements
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log('Footer link clicked:', e.target.href);
        });
    });
});
```

---

## 🎨 Styling Components

### CSS Variables (Global)

**Define in `css/vars.css`**:
```css
:root {
    --color-primary: #4C5EF7;
    --color-secondary: #22D3EE;
    --color-bg-primary: #0a0a0a;
    --color-bg-secondary: #1a1a2e;
    --color-text: #ffffff;
    --color-text-secondary: #a0aec0;
    --color-border: rgba(255, 255, 255, 0.1);
    
    --header-height: 70px;
    --footer-height: auto;
}
```

### Component Styles

**`css/header-styles.css`**:
```css
header {
    height: var(--header-height);
    background: linear-gradient(135deg, rgba(76, 94, 247, 0.1), rgba(34, 211, 238, 0.1));
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 1.5rem;
}

/* ... more styles ... */
```

---

## 📋 Troubleshooting

### Issue 1: Components not loading
**Solution**: 
- Check file paths are correct
- Ensure CORS is not blocking (for fetch)
- Check browser console for errors

### Issue 2: Styles not applying
**Solution**:
- Ensure CSS files are linked before component load
- Check class names match CSS definitions
- Use browser DevTools to inspect elements

### Issue 3: JavaScript events not firing
**Solution**:
- Wrap event listeners in `DOMContentLoaded`
- Use event delegation for dynamically loaded elements
- Check IDs match in HTML and JavaScript

---

## 🚀 Best Practices

1. **Always check if element exists before adding listeners**
   ```javascript
   const element = document.getElementById('some-id');
   if (element) {
       element.addEventListener('click', handler);
   }
   ```

2. **Use event delegation for dynamic content**
   ```javascript
   document.addEventListener('click', (e) => {
       if (e.target.classList.contains('nav-item')) {
           // Handle click
       }
   });
   ```

3. **Load components in correct order**
   ```javascript
   // Load header first, then footer
   await loader.load('header', 'header-container');
   await loader.load('footer', 'footer-container');
   ```

4. **Cache components in production**
   ```javascript
   // Add cache headers on server
   app.use(express.static('public', {
       maxAge: '1d' // Cache for 1 day
   }));
   ```

---

## 📚 Summary

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| JavaScript Fetch | Flexible, dynamic | Network request | Modern SPAs |
| Server-Side Include | Simple, cached | Limited support | Static sites |
| Template Engine | Powerful, reusable | Setup required | Full-stack apps |
| Direct HTML | Fastest, simple | Not reusable | Single-page |

---

## ✅ Checklist

- [x] Header component created
- [x] Footer component created
- [x] Component loader script available
- [x] Auth versions available
- [x] Mobile responsive design
- [x] Google Auth integration
- [x] Documentation complete

Ready to integrate components into all pages!
