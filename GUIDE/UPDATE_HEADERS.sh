#!/bin/bash
# Update all remaining pages with new professional header

PAGES=(
  "learning-materials.html"
  "learning-resources.html"
  "profile.html"
  "analytics.html"
  "admin.html"
  "live_index.html"
)

HEADER_HTML='
    <!-- PROFESSIONAL HEADER -->
    <header>
        <div class="header-inner">
            <!-- Logo Section -->
            <a href="/" class="header-logo">
                <img alt="IVS Logo" class="header-logo-img" src="/images/logo/logo.svg" onerror="this.onerror=null;this.src='\'https://placehold.co/40x40/4c5ef7/ffffff?text=IVS'\'';"/>
                <div class="header-logo-text">
                    <span class="header-logo-text-main">IVS Learning Hub</span>
                    <span class="header-logo-text-sub">Cổng học tập & ứng dụng</span>
                </div>
            </a>
            
            <!-- Desktop Navigation -->
            <nav class="header-nav">
                <a href="live_index.html" class="header-nav-item">Giới Thiệu IVS JSC</a>
                <a href="index.html#applications" class="header-nav-item">Ứng Dụng Học Tập</a>
                <a href="learning-resources.html" class="header-nav-item">Tài Nguyên EdTech</a>
                <a href="analytics.html" class="header-nav-item">Thống Kê (Admin)</a>
            </nav>
            
            <!-- Auth Section (Desktop & Mobile) -->
            <div class="header-auth" id="header-auth-container">
                <a href="auth.html" class="header-auth-button header-auth-login">
                    <i class="fas fa-sign-in-alt"></i> Đăng nhập
                </a>
                <a href="auth.html" class="header-auth-button header-auth-signup">
                    <i class="fas fa-user-plus"></i> Đăng ký
                </a>
            </div>
            
            <!-- Mobile Menu Toggle -->
            <button class="header-menu-toggle" id="mobile-menu-toggle" aria-label="Mở menu">
                <i class="fas fa-bars"></i>
            </button>
        </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <div class="mobile-menu-overlay" id="mobile-menu-overlay" role="navigation" aria-label="Mobile Menu">
        <nav class="mobile-nav">
            <a href="live_index.html" class="mobile-nav-item">Giới Thiệu IVS JSC</a>
            <a href="index.html#applications" class="mobile-nav-item">Ứng Dụng Học Tập</a>
            <a href="learning-resources.html" class="mobile-nav-item">Tài Nguyên EdTech</a>
            <a href="analytics.html" class="mobile-nav-item">Thống Kê (Admin)</a>
            <div class="mobile-auth">
                <a href="auth.html" class="mobile-auth-button" style="background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light)); color: white;">
                    <i class="fas fa-sign-in-alt"></i> Đăng nhập / Đăng ký
                </a>
            </div>
        </nav>
    </div>
    
    <script>
        // Mobile Menu Toggle
        const mobileMenuToggle = document.getElementById('"'"'mobile-menu-toggle'"'"');
        const mobileMenuOverlay = document.getElementById('"'"'mobile-menu-overlay'"'"');
        
        if (mobileMenuToggle && mobileMenuOverlay) {
            mobileMenuToggle.addEventListener('"'"'click'"'"', () => {
                mobileMenuOverlay.classList.add('"'"'active'"'"');
                document.body.style.overflow = '"'"'hidden'"'"';
            });
            
            mobileMenuOverlay.querySelectorAll('"'"'a'"'"').forEach(link => {
                link.addEventListener('"'"'click'"'"', () => {
                    mobileMenuOverlay.classList.remove('"'"'active'"'"');
                    document.body.style.overflow = '"'"'auto'"'"';
                });
            });
            
            document.addEventListener('"'"'keydown'"'"', (e) => {
                if (e.key === '"'"'Escape'"'"' && mobileMenuOverlay.classList.contains('"'"'active'"'"')) {
                    mobileMenuOverlay.classList.remove('"'"'active'"'"');
                    document.body.style.overflow = '"'"'auto'"'"';
                }
            });
        }
    </script>
'

echo "Header HTML prepared. Manual update required for each page."
