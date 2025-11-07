# 🎨 IVS Learning Hub - UI/UX & Component Specifications

**Version:** 1.0  
**Date:** 7 November 2025  
**Purpose:** Detailed design system & component specifications for development

---

## 📋 MỤC LỤC

1. [Design System](#design-system)
2. [Reusable Components](#reusable-components)
3. [Page Wireframes](#page-wireframes)
4. [Interactive Flows](#interactive-flows)
5. [Accessibility Guidelines](#accessibility-guidelines)

---

## 🎨 Design System {#design-system}

### 1. Color Palette

#### Primary Colors
```css
--ivs-blue: #4c5ef7;        /* Main CTA, primary actions */
--ivs-green: #10b981;       /* Success, completed, positive */
--ivs-purple: #8b5cf6;      /* Premium, highlights, features */
--ivs-orange: #f97316;      /* Call-to-action, emphasis */
--ivs-cyan: #22d3ee;        /* Information, links */
--ivs-red: #ef4444;         /* Errors, destructive */
```

#### Neutral Colors
```css
--ivs-bg: #1a1a1a;           /* Main background */
--ivs-bg-secondary: #111111;  /* Card backgrounds */
--ivs-border: #27272A;        /* Borders, dividers */
--ivs-text-primary: #f4f4f5;  /* Main text */
--ivs-text-secondary: #a1a1aa; /* Muted text */
--ivs-text-tertiary: #71717a;  /* Very muted text */
```

#### Semantic Colors
```css
--success: #10b981;
--warning: #f59e0b;
--danger: #ef4444;
--info: #4c5ef7;
--disabled: #52525b;
```

### 2. Typography System

```css
/* Font Stack */
--font-display: "Be Vietnam Pro", sans-serif;
--font-body: "Inter", sans-serif;
--font-mono: "JetBrains Mono", monospace;

/* Font Sizes & Hierarchy */
h1 { font-size: 2.5rem; line-height: 1.2; font-weight: 700; }
h2 { font-size: 2rem; line-height: 1.3; font-weight: 700; }
h3 { font-size: 1.5rem; line-height: 1.4; font-weight: 600; }
h4 { font-size: 1.25rem; line-height: 1.4; font-weight: 600; }
body { font-size: 1rem; line-height: 1.5; font-weight: 400; }
small { font-size: 0.875rem; line-height: 1.5; font-weight: 400; }
caption { font-size: 0.75rem; line-height: 1.4; font-weight: 500; }

/* Font Weights */
light: 300
regular: 400
medium: 500
semibold: 600
bold: 700
```

### 3. Spacing System (8px Grid)

```css
--space-0: 0px;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### 4. Border Radius

```css
--radius-sm: 4px;      /* Small corners (buttons) */
--radius-md: 8px;      /* Medium corners (cards) */
--radius-lg: 12px;     /* Large corners (modals) */
--radius-xl: 16px;     /* Extra large (hero sections) */
--radius-full: 9999px; /* Fully rounded */
```

### 5. Shadows & Elevation

```css
/* Box Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Elevation Levels */
Level 1 (Cards): --shadow-md
Level 2 (Modals): --shadow-lg
Level 3 (Dropdowns): --shadow-xl
Level 4 (Tooltips): --shadow-sm
```

### 6. Animations & Transitions

```css
/* Timing Functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Standard Durations */
--duration-150: 150ms;
--duration-200: 200ms;
--duration-300: 300ms;
--duration-500: 500ms;

/* Common Transitions */
transition: all 200ms ease-out;
transition: background-color 200ms, color 200ms;
transition: transform 200ms ease-out;
transition: opacity 200ms ease-out;
```

---

## ⚙️ Reusable Components {#reusable-components}

### 1. Button Component

```html
<!-- Primary Button -->
<button class="btn btn-primary">
  <i class="fas fa-arrow-right mr-2"></i>
  Get Started
</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">
  Learn More
</button>

<!-- Outline Button -->
<button class="btn btn-outline">
  Cancel
</button>

<!-- Ghost Button -->
<button class="btn btn-ghost">
  Help
</button>

<!-- Sizes -->
<button class="btn btn-sm">Small</button>
<button class="btn btn-md">Medium</button>
<button class="btn btn-lg">Large</button>

<!-- States -->
<button class="btn" disabled>Disabled</button>
<button class="btn is-loading">
  <span class="spinner"></span> Loading...
</button>
```

```css
.btn {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease-out;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.btn-primary {
  background-color: var(--ivs-blue);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(76, 94, 247, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background-color: #3d4bd1;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(76, 94, 247, 0.4);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-sm {
  padding: var(--space-2) var(--space-3);
  font-size: 0.875rem;
}

.btn-lg {
  padding: var(--space-4) var(--space-6);
  font-size: 1.125rem;
}
```

### 2. Card Component

```html
<!-- Basic Card -->
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Course Title</h3>
  </div>
  <div class="card-body">
    <p>Card content goes here</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Enroll</button>
  </div>
</div>

<!-- Hoverable Card -->
<div class="card card-hoverable">
  <img src="course.jpg" alt="Course" class="card-image" />
  <div class="card-content">
    <h3 class="card-title">Learn React</h3>
    <p class="card-subtitle">Intermediate • 3h 30m</p>
  </div>
</div>
```

```css
.card {
  background: var(--ivs-bg-secondary);
  border: 1px solid var(--ivs-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  transition: all 200ms ease-out;
}

.card-hoverable:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--ivs-blue);
}

.card-header {
  margin-bottom: var(--space-4);
  border-bottom: 1px solid var(--ivs-border);
  padding-bottom: var(--space-4);
}

.card-body {
  margin: var(--space-4) 0;
}

.card-footer {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  margin-top: var(--space-4);
  border-top: 1px solid var(--ivs-border);
  padding-top: var(--space-4);
}
```

### 3. Badge Component

```html
<!-- Status Badge -->
<span class="badge badge-success">Completed</span>
<span class="badge badge-warning">In Progress</span>
<span class="badge badge-danger">Failed</span>
<span class="badge badge-info">New</span>

<!-- Size Variants -->
<span class="badge badge-sm">Small</span>
<span class="badge badge-md">Medium</span>
<span class="badge badge-lg">Large</span>

<!-- With Icon -->
<span class="badge badge-success">
  <i class="fas fa-check mr-1"></i> Verified
</span>
```

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-success {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.badge-warning {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.badge-danger {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.badge-info {
  background-color: rgba(76, 94, 247, 0.1);
  color: var(--info);
}
```

### 4. Progress Bar Component

```html
<!-- Basic Progress Bar -->
<div class="progress">
  <div class="progress-bar" style="width: 65%"></div>
</div>

<!-- With Label -->
<div class="progress">
  <div class="progress-bar" style="width: 65%"></div>
  <span class="progress-label">65% Complete</span>
</div>

<!-- Color Variants -->
<div class="progress">
  <div class="progress-bar progress-bar-success" style="width: 100%"></div>
</div>

<div class="progress">
  <div class="progress-bar progress-bar-warning" style="width: 45%"></div>
</div>
```

```css
.progress {
  height: 8px;
  background-color: var(--ivs-border);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--ivs-blue), var(--ivs-cyan));
  border-radius: var(--radius-full);
  transition: width 300ms ease-out;
  position: relative;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-bar-success {
  background: var(--success);
}

.progress-bar-warning {
  background: var(--warning);
}

.progress-label {
  position: absolute;
  right: var(--space-2);
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ivs-text-secondary);
}
```

### 5. Modal/Dialog Component

```html
<!-- Modal -->
<div class="modal modal-open" id="app-modal">
  <div class="modal-overlay" onclick="closeModal()"></div>
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title">App Details</h2>
      <button class="modal-close" onclick="closeModal()">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="modal-body">
      <p>Modal content goes here</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

```css
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  align-items: center;
  justify-content: center;
}

.modal-open {
  display: flex;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  animation: fadeIn 200ms ease-out;
}

.modal-content {
  position: relative;
  background-color: var(--ivs-bg-secondary);
  border: 1px solid var(--ivs-border);
  border-radius: var(--radius-lg);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-2xl);
  animation: slideUp 300ms ease-out;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6);
  border-bottom: 1px solid var(--ivs-border);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--ivs-text-secondary);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: var(--space-6);
}

.modal-footer {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  padding: var(--space-6);
  border-top: 1px solid var(--ivs-border);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### 6. Toast Notification Component

```html
<!-- Toast Container -->
<div id="toast-container" class="toast-container">
  <!-- Toasts will be inserted here -->
</div>

<!-- Toast Notification -->
<div class="toast toast-success">
  <i class="fas fa-check-circle"></i>
  <span>Operation completed successfully!</span>
  <button class="toast-close" onclick="this.parentElement.remove()">
    <i class="fas fa-times"></i>
  </button>
</div>
```

```css
.toast-container {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  z-index: 1100;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background-color: var(--ivs-bg-secondary);
  border: 1px solid var(--ivs-border);
  box-shadow: var(--shadow-lg);
  animation: slideInRight 300ms ease-out;
}

.toast-success {
  border-left: 4px solid var(--success);
}

.toast-warning {
  border-left: 4px solid var(--warning);
}

.toast-danger {
  border-left: 4px solid var(--danger);
}

.toast-close {
  background: none;
  border: none;
  color: var(--ivs-text-secondary);
  cursor: pointer;
  padding: 0;
  margin-left: auto;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### 7. Avatar Component

```html
<!-- Avatar with Image -->
<img src="user.jpg" alt="User" class="avatar avatar-md" />

<!-- Avatar with Initials -->
<div class="avatar avatar-md">
  <span>JD</span>
</div>

<!-- Avatar with Icon -->
<div class="avatar avatar-md">
  <i class="fas fa-user"></i>
</div>

<!-- Sizes -->
<div class="avatar avatar-sm">JD</div>
<div class="avatar avatar-md">JD</div>
<div class="avatar avatar-lg">JD</div>

<!-- With Status Badge -->
<div class="avatar-group">
  <div class="avatar avatar-md">
    <img src="user.jpg" alt="User" />
  </div>
  <div class="avatar-status avatar-status-online"></div>
</div>
```

```css
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background-color: var(--ivs-border);
  color: var(--ivs-text-primary);
  font-weight: 600;
  object-fit: cover;
  flex-shrink: 0;
}

.avatar-sm { width: 32px; height: 32px; font-size: 0.75rem; }
.avatar-md { width: 40px; height: 40px; font-size: 0.875rem; }
.avatar-lg { width: 56px; height: 56px; font-size: 1rem; }

.avatar-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: var(--radius-full);
  border: 2px solid var(--ivs-bg-secondary);
}

.avatar-status-online { background-color: var(--success); }
.avatar-status-away { background-color: var(--warning); }
.avatar-status-offline { background-color: var(--ivs-text-tertiary); }
```

### 8. Input Component

```html
<!-- Text Input -->
<div class="form-group">
  <label for="email" class="label">Email Address</label>
  <input 
    type="email" 
    id="email" 
    class="input" 
    placeholder="you@example.com"
    required
  />
  <span class="helper-text">We'll never share your email.</span>
</div>

<!-- Input with Error -->
<div class="form-group">
  <label for="password" class="label">Password</label>
  <input 
    type="password" 
    id="password" 
    class="input is-invalid" 
    value=""
  />
  <span class="error-text">Password must be at least 8 characters.</span>
</div>

<!-- Input with Icon -->
<div class="form-group">
  <div class="input-group">
    <i class="fas fa-search input-icon"></i>
    <input 
      type="text" 
      class="input input-with-icon" 
      placeholder="Search courses..."
    />
  </div>
</div>

<!-- Textarea -->
<div class="form-group">
  <label for="bio" class="label">Bio</label>
  <textarea 
    id="bio" 
    class="input" 
    placeholder="Tell us about yourself..."
    rows="4"
  ></textarea>
</div>
```

```css
.form-group {
  margin-bottom: var(--space-6);
}

.label {
  display: block;
  margin-bottom: var(--space-2);
  font-weight: 600;
  color: var(--ivs-text-primary);
}

.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--ivs-border);
  border-radius: var(--radius-md);
  background-color: var(--ivs-bg-secondary);
  color: var(--ivs-text-primary);
  font-size: 1rem;
  font-family: var(--font-body);
  transition: all 200ms ease-out;
}

.input:focus {
  outline: none;
  border-color: var(--ivs-blue);
  box-shadow: 0 0 0 3px rgba(76, 94, 247, 0.1);
}

.input:disabled {
  background-color: var(--ivs-border);
  color: var(--ivs-text-tertiary);
  cursor: not-allowed;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: var(--space-3);
  color: var(--ivs-text-secondary);
  pointer-events: none;
}

.input-with-icon {
  padding-left: var(--space-10);
}

.input.is-invalid {
  border-color: var(--danger);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.helper-text {
  display: block;
  margin-top: var(--space-2);
  font-size: 0.875rem;
  color: var(--ivs-text-secondary);
}

.error-text {
  display: block;
  margin-top: var(--space-2);
  font-size: 0.875rem;
  color: var(--danger);
}
```

---

## 📐 Page Wireframes {#page-wireframes}

### Landing Page (index.html)

```
┌────────────────────────────────────────────────────┐
│ Header (h-16)                                      │
│ Logo │ Nav │ Auth Buttons                         │
├────────────────────────────────────────────────────┤
│                                                    │
│ ┌──── Hero Section (h-[600px]) ─────────────────┐│
│ │ Background: Gradient + Animated Elements      ││
│ │ Content:                                      ││
│ │   Title (h1)                                  ││
│ │   Subtitle (p)                                ││
│ │   CTA Buttons                                 ││
│ │ Floating Shapes (animated)                    ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ ┌──── Features Section ──────────────────────────┐│
│ │ 3 Columns (responsive)                        ││
│ │ ┌──────┐ ┌──────┐ ┌──────┐                    ││
│ │ │Icon  │ │Icon  │ │Icon  │                    ││
│ │ │Title │ │Title │ │Title │                    ││
│ │ │Text  │ │Text  │ │Text  │                    ││
│ │ └──────┘ └──────┘ └──────┘                    ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ ┌──── Apps Showcase Section ─────────────────────┐│
│ │ Title                                         ││
│ │ [App Card] [App Card] [App Card]              ││
│ │ Each Card:                                    ││
│ │   • Thumbnail                                 ││
│ │   • App Name                                  ││
│ │   • Description                               ││
│ │   • Rating                                    ││
│ │   • [Access] Button                           ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ ┌──── Learning Platforms Comparison ─────────────┐│
│ │ Title: "Best Practices from Leading Platforms"││
│ │ 3-Column Comparison                           ││
│ │ [Platform Card] [Platform Card] [Platform]    ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ ┌──── Stats Section ─────────────────────────────┐│
│ │ 1000+ Users │ 50+ Courses │ 5 Apps │ 4.8★    ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ ┌──── Footer CTA ────────────────────────────────┐│
│ │ [Sign Up Now] [Contact Sales]                 ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ Footer                                            │
│ Links │ Legal │ Social                           │
└────────────────────────────────────────────────────┘
```

### Dashboard Page (dashboard.html)

```
┌────────────────────────────────────────────────────┐
│ Header (sticky)                                    │
│ Logo │ Home │ Search │ User Dropdown              │
├────────────────────────────────────────────────────┤
│                                                    │
│ ┌──── Welcome Section ──────────────────────────┐ │
│ │ Xin chào, [User Name]! 👋                     │ │
│ │ Quick Stats (3 columns):                      │ │
│ │ [Stat Card] [Stat Card] [Stat Card]           │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ ┌──────────────────────────────────────────────┐  │
│ │ MY COURSES SECTION                           │  │
│ │ Title: "Khóa Học của Tôi"                   │  │
│ │                                              │  │
│ │ ┌─ Course Card ─────────────────────────┐   │  │
│ │ │ Thumbnail │ Title                     │   │  │
│ │ │           │ Instructor                │   │  │
│ │ │           │ Progress: 65% ██████░░░░  │   │  │
│ │ │           │ [Resume] [Details]        │   │  │
│ │ └───────────────────────────────────────┘   │  │
│ │                                              │  │
│ │ ┌─ Course Card ─────────────────────────┐   │  │
│ │ │ ...                                    │   │  │
│ │ └───────────────────────────────────────┘   │  │
│ │                                              │  │
│ │ [View All Courses] [Browse More]            │  │
│ └──────────────────────────────────────────────┘  │
│                                                    │
│ ┌──────────────────────────────────────────────┐  │
│ │ IVS APPS SECTION                             │  │
│ │ Title: "Ứng Dụng Khả Dụng"                   │  │
│ │                                              │  │
│ │ ┌─ App Card 1 (ELearners) ──────────────┐   │  │
│ │ │ Icon: 📚                              │   │  │
│ │ │ Title: "IVS English Learning"         │   │  │
│ │ │ Description: "Interactive English"   │   │  │
│ │ │ Rating: ★★★★★ 4.8 (250 reviews)     │   │  │
│ │ │ Status: Enroll Now                    │   │  │
│ │ │ [Access Now] [Details]                │   │  │
│ │ └───────────────────────────────────────┘   │  │
│ │                                              │  │
│ │ ┌─ App Card 2 (Testing & Placement) ────┐   │  │
│ │ │ Icon: 📝                              │   │  │
│ │ │ Title: "IVS Testing & Placement"      │   │  │
│ │ │ Description: "Placement exams"        │   │  │
│ │ │ Rating: ★★★★★ 4.6 (180 reviews)     │   │  │
│ │ │ Status: Take Test                     │   │  │
│ │ │ [Access Now] [Details]                │   │  │
│ │ └───────────────────────────────────────┘   │  │
│ │                                              │  │
│ │ ┌─ App Card 3 (Coming Soon) ────────────┐   │  │
│ │ │ Icon: 🚀                              │   │  │
│ │ │ Title: "Coming Soon..."               │   │  │
│ │ │ Description: "New features"           │   │  │
│ │ │ Status: Coming Soon                   │   │  │
│ │ │ [Notify Me]                           │   │  │
│ │ └───────────────────────────────────────┘   │  │
│ │                                              │  │
│ └──────────────────────────────────────────────┘  │
│                                                    │
│ ┌──────────────────────────────────────────────┐  │
│ │ QUICK LINKS                                  │  │
│ │ [Browse Learning Materials]                 │  │
│ │ [View Profile] [Settings] [Help]            │  │
│ └──────────────────────────────────────────────┘  │
│                                                    │
│ Footer                                            │
└────────────────────────────────────────────────────┘
```

### Learning Resources Page (learning-materials.html)

```
┌────────────────────────────────────────────────────┐
│ Header (sticky)                                    │
│ Logo │ Nav │ Search │ Auth                        │
├────────────────────────────────────────────────────┤
│                                                    │
│ ┌──── Hero Section ──────────────────────────────┐│
│ │ Title: "Learning Platforms Comparison"        ││
│ │ Subtitle: "Best practices from industry"      ││
│ │ Floating decorative elements                  ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ ┌──── Tab Navigation ────────────────────────────┐│
│ │ [Microsoft Learn] [LinkedIn Learning] [AWS]   ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ ┌──── Comparison Section ────────────────────────┐│
│ │ 3 Columns (Responsive to 1 on mobile)         ││
│ │                                                ││
│ │ ┌─ Platform Card 1 ──────────────────────┐   ││
│ │ │ Logo / Icon                            │   ││
│ │ │ Name: Microsoft Learn                  │   ││
│ │ │ Focus: Enterprise Tech                 │   ││
│ │ │ Learners: 5M+                          │   ││
│ │ │ Courses: 2000+                         │   ││
│ │ │                                        │   ││
│ │ │ Features:                              │   ││
│ │ │ ✅ Hands-on labs                       │   ││
│ │ │ ✅ Role-based paths                    │   ││
│ │ │ ✅ Certifications                      │   ││
│ │ │ ❌ Mobile app                          │   ││
│ │ │                                        │   ││
│ │ │ Price: Free                            │   ││
│ │ │ Rating: ★★★★★ 4.7 (5k reviews)       │   ││
│ │ │ [Learn More] [Visit Site]              │   ││
│ │ └────────────────────────────────────────┘   ││
│ │                                                ││
│ │ ┌─ Platform Card 2 ──────────────────────┐   ││
│ │ │ ... (LinkedIn)                         │   ││
│ │ └────────────────────────────────────────┘   ││
│ │                                                ││
│ │ ┌─ Platform Card 3 ──────────────────────┐   ││
│ │ │ ... (AWS)                              │   ││
│ │ └────────────────────────────────────────┘   ││
│ │                                                ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ ┌──── Features Comparison Table ─────────────────┐│
│ │ Feature    │ Microsoft │ LinkedIn │ AWS       ││
│ │ ───────────┼───────────┼──────────┼──────     ││
│ │ Paths      │ ✅ Yes    │ ✅ Yes   │ ✅ Yes   ││
│ │ Hands-on   │ ✅ Yes    │ ❌ No    │ ✅ Yes   ││
│ │ Videos     │ ✅        │ ✅       │ ✅      ││
│ │ Certs      │ ✅        │ ✅       │ ✅      ││
│ │ Mobile     │ ❌        │ ✅       │ ❌      ││
│ │ Price      │ Free      │ Paid     │ Free/Paid││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ ┌──── Design Best Practices ─────────────────────┐│
│ │ Accordion Sections (Expandable)               ││
│ │ ▼ Role-Based Navigation                       ││
│ │   Content...                                  ││
│ │ ▶ Learning Paths                              ││
│ │ ▶ Progress Tracking                           ││
│ │ ▶ Gamification                                ││
│ │ ▶ Video Experience                            ││
│ │ ▶ Community Features                          ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ ┌──── Tech Stack Recommendations ────────────────┐│
│ │ Frontend: React + Tailwind                    ││
│ │ Backend: Node.js + PostgreSQL                 ││
│ │ ... (Code blocks with syntax highlighting)   ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ Footer                                            │
└────────────────────────────────────────────────────┘
```

---

## 🔄 Interactive Flows {#interactive-flows}

### Auth Flow (Login/Register)

```
User clicks "Đăng Nhập / Đăng Ký"
    ↓
Redirect: auth.html
    ↓
Firebase Auth UI loads
    ├─ Email/Password Tab
    ├─ Google OAuth Option
    └─ Reset Password Link
    ↓
User submits credentials
    ↓
Firebase processes auth
    ├─ If Error: Show error message, allow retry
    └─ If Success:
        ├─ Create user profile (if new)
        ├─ Generate ID token
        ├─ Store in localStorage
        └─ Redirect: /dashboard
```

### SSO Flow (App Access)

```
User on Dashboard
    ↓
Click "Truy Cập [App Name]"
    ↓
Frontend calls: POST /createCustomToken
Headers: {Authorization: Bearer {idToken}}
    ↓
Backend validates token
    ├─ If Invalid: Return 401
    └─ If Valid:
        ├─ Extract user info
        ├─ Create custom token (1hr expiry)
        └─ Return: {token, redirectUrl}
    ↓
Frontend receives response
    ↓
Redirect to: {redirectUrl}
    ↓
App receives token (URL param)
    ↓
App validates token
    ├─ If Invalid: Redirect to login
    └─ If Valid:
        ├─ Call signInWithCustomToken()
        ├─ Auto-login user
        ├─ Set session cookie
        └─ Redirect to dashboard
    ↓
User logged in to app ✓
```

### Course Enrollment Flow

```
User on Dashboard / Learning Materials
    ↓
Click "Enroll in Course" / "Start Learning"
    ↓
Check user auth status
    ├─ If Not Auth: Redirect to login
    └─ If Auth:
        ├─ Show course details modal
        ├─ Display prerequisites (if any)
        ├─ Show estimated time
        └─ [Confirm Enrollment] Button
        ↓
        User clicks "Confirm"
        ↓
        Frontend calls: POST /enrollCourse
        Body: {userId, courseId}
        ↓
        Backend:
        ├─ Check prerequisites
        ├─ Create enrollment record
        ├─ Update user progress
        └─ Return success
        ↓
        Frontend:
        ├─ Show success toast
        ├─ Update UI
        └─ Redirect to course player
        ↓
        User can now access course ✓
```

---

## ♿ Accessibility Guidelines {#accessibility-guidelines}

### Color Contrast
- Text on background: Minimum 4.5:1 contrast ratio
- UI components: Minimum 3:1 contrast ratio
- Test with tools: WebAIM Contrast Checker

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order must be logical
- Focus indicators must be visible
- Escape key closes modals

### Screen Readers
- Use semantic HTML (`<button>`, `<a>`, `<form>`)
- Add `aria-label` for icon-only buttons
- Add `aria-live` for dynamic content
- Use `role` attribute where needed

### Focus Management
```html
<!-- Visible focus indicator -->
<style>
  button:focus {
    outline: 2px solid var(--ivs-blue);
    outline-offset: 2px;
  }
</style>

<!-- Modal focus trap -->
<script>
  function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  }
</script>
```

### Text Alternatives
- All images have descriptive `alt` text
- Icons have `aria-label` or accompanying text
- Videos have captions (CC) and transcripts

### Responsive Design
- Mobile-first approach
- Test on multiple viewport sizes
- Touch targets minimum 44x44 pixels
- No horizontal scroll required (width ≤ 100vw)

---

**Document Status:** ✅ Ready for Frontend Development  
**Last Updated:** 7 November 2025  
**Next Review:** Upon component library completion
