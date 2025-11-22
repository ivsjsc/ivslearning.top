/**
 * Component Loader - Dynamically loads header, footer and other components
 * Usage: Add <script src="/js/component-loader.js"></script> to your HTML file
 */

class ComponentLoader {
    static async load() {
        await this.loadHeader();
        await this.loadFooter();
        this.setupGlobalListeners();
    }

    static async loadHeader() {
        try {
            const response = await fetch('/components/header.html');
            const html = await response.text();
            
            // If a placeholder exists, render header into it, otherwise insert at the beginning of body
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = html;
            } else {
                const headerContainer = document.createElement('div');
                headerContainer.innerHTML = html;
                document.body.insertBefore(headerContainer, document.body.firstChild);
            }
            
            // Setup header auth if Firebase is available; otherwise fall back to a default
            if (window.firebaseAuth) {
                this.setupHeaderAuth();
            } else {
                // If auth not ready yet, listen for firebase-ready event dispatched by firebase-init
                const onFirebaseReady = () => {
                    this.setupHeaderAuth();
                    document.removeEventListener('firebase-ready', onFirebaseReady);
                };
                document.addEventListener('firebase-ready', onFirebaseReady);

                // Also provide a safe fallback: after short timeout, render login buttons to avoid stuck spinner UI
                setTimeout(() => {
                    const headerAuthContainer = document.getElementById('header-auth-container');
                    const mobileAuthContainer = document.getElementById('mobile-auth-container');
                    if (headerAuthContainer && mobileAuthContainer && (!window.firebaseAuth)) {
                        headerAuthContainer.innerHTML = `\n                            <a href="/auth.html" class="header-auth-button header-auth-login">\n                                <i class="fas fa-sign-in-alt"></i> Đăng nhập\n                            </a>\n                            <a href="/auth.html" class="header-auth-button header-auth-signup">\n                                <i class="fas fa-user-plus"></i> Đăng ký\n                            </a>\n                        `;
                        mobileAuthContainer.innerHTML = `\n                            <a href="/auth.html" class="mobile-auth-button" style="background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light)); color: white;">\n                                <i class="fas fa-sign-in-alt"></i> Đăng nhập / Đăng ký\n                            </a>\n                        `;
                    }
                }, 900);
            }
        } catch (error) {
            console.error('Error loading header component:', error);
        }
    }

    static async loadFooter() {
        try {
            const response = await fetch('/components/footer.html');
            const html = await response.text();
            
            // Render footer into placeholder if present, otherwise append to body
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = html;
            } else {
                const footerContainer = document.createElement('div');
                footerContainer.innerHTML = html;
                document.body.appendChild(footerContainer);
            }
        } catch (error) {
            console.error('Error loading footer component:', error);
        }
    }

    static setupHeaderAuth() {
        const auth = window.firebaseAuth;
        if (!auth) return;

        // Use modular onAuthStateChanged; import dynamically if not available as a global
        const runSetup = async () => {
            let onAuthStateChangedFn = window.onAuthStateChanged || null;
            if (!onAuthStateChangedFn) {
                try {
                    const mod = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js');
                    onAuthStateChangedFn = mod.onAuthStateChanged;
                } catch (err) {
                    console.error('Failed to import onAuthStateChanged from CDN', err);
                    return;
                }
            }

            onAuthStateChangedFn(auth, async (user) => {
            const headerAuthContainer = document.getElementById('header-auth-container');
            const mobileAuthContainer = document.getElementById('mobile-auth-container');
            
            if (!headerAuthContainer || !mobileAuthContainer) return;

                if (user) {
                    try { const mui = await import('/js/auth-utils.js'); if (mui && mui.setUserDoc) await mui.setUserDoc(user); } catch (e) { console.warn('component-loader setUserDoc failed', e); }
                // User is logged in
                const emailPart = user.email.split('@')[0];
                const userHTML = `
                    <a href="/dashboard.html" class="header-auth-button header-auth-user">
                        <i class="fas fa-user-circle"></i> ${emailPart}
                    </a>
                    <button class="header-auth-button header-auth-logout logout-btn" style="gap: 8px;">
                        <i class="fas fa-sign-out-alt"></i> Đăng xuất
                    </button>
                `;
                headerAuthContainer.innerHTML = userHTML;

                const mobileUserHTML = `
                    <a href="/dashboard.html" class="mobile-auth-button" style="background: linear-gradient(135deg, var(--color-success), #059669); color: white;">
                        <i class="fas fa-user-circle"></i> Xem Dashboard
                    </a>
                    <button class="mobile-auth-button logout-btn" style="background: linear-gradient(135deg, var(--color-error), #dc2626); color: white;">
                        <i class="fas fa-sign-out-alt"></i> Đăng Xuất
                    </button>
                `;
                mobileAuthContainer.innerHTML = mobileUserHTML;

                // Attach logout listeners
                // Use centralized safeSignOut to avoid duplicate logic
                document.querySelectorAll('.logout-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        try {
                            const { safeSignOut } = await import('/js/auth-utils.js');
                            await safeSignOut(auth);
                            window.location.reload();
                        } catch (error) {
                            console.error('Logout error:', error);
                        }
                    });
                });
            } else {
                // User is not logged in
                const loginHTML = `
                    <a href="/auth.html" class="header-auth-button header-auth-login">
                        <i class="fas fa-sign-in-alt"></i> Đăng nhập
                    </a>
                    <a href="/auth.html" class="header-auth-button header-auth-signup">
                        <i class="fas fa-user-plus"></i> Đăng ký
                    </a>
                `;
                headerAuthContainer.innerHTML = loginHTML;

                const mobileLoginHTML = `
                    <a href="/auth.html" class="mobile-auth-button" style="background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light)); color: white;">
                        <i class="fas fa-sign-in-alt"></i> Đăng nhập / Đăng ký
                    </a>
                `;
                mobileAuthContainer.innerHTML = mobileLoginHTML;
            }

            // Close mobile menu when auth changes
            const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
            if (mobileMenuOverlay && mobileMenuOverlay.classList.contains('active')) {
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            // Ensure app links (data-app) are set correctly
            function setDynamicAppLinks() {
                try {
                    const elUrl = window.ELearnersUrl || (window.AppDomains && window.AppDomains.english) || null;
                    if (elUrl) {
                        document.querySelectorAll('[data-app="el"]').forEach(a => { a.href = elUrl; a.target = '_blank'; });
                        document.querySelectorAll('[data-app="el-iframe"]').forEach(i => { i.src = elUrl });
                    }
                } catch (err) {
                    console.warn('Error setting dynamic app links:', err);
                }
            }

            setDynamicAppLinks();
            // Also run on firebase-ready if global settings may change later
            document.addEventListener('firebase-ready', setDynamicAppLinks);
        };

        runSetup().catch(err => console.error('Error initializing header auth setup:', err));
        });
    }

    static setupGlobalListeners() {
        // Add any global event listeners here if needed
        document.addEventListener('DOMContentLoaded', () => {
            // Re-initialize any scripts that depend on DOM structure
            if (window.AOS) {
                AOS.init();
            }
        });
    }
}

// Auto-load components when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ComponentLoader.load());
} else {
    ComponentLoader.load();
}
