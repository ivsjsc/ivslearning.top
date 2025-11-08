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
            
            // Create header container
            const headerContainer = document.createElement('div');
            headerContainer.innerHTML = html;
            
            // Insert at the beginning of body
            document.body.insertBefore(headerContainer, document.body.firstChild);
            
            // Setup header auth if Firebase is available
            if (window.firebaseAuth) {
                this.setupHeaderAuth();
            }
        } catch (error) {
            console.error('Error loading header component:', error);
        }
    }

    static async loadFooter() {
        try {
            const response = await fetch('/components/footer.html');
            const html = await response.text();
            
            // Create footer container
            const footerContainer = document.createElement('div');
            footerContainer.innerHTML = html;
            
            // Insert before the last closing body tag
            document.body.appendChild(footerContainer);
        } catch (error) {
            console.error('Error loading footer component:', error);
        }
    }

    static setupHeaderAuth() {
        const auth = window.firebaseAuth;
        
        auth.onAuthStateChanged((user) => {
            const headerAuthContainer = document.getElementById('header-auth-container');
            const mobileAuthContainer = document.getElementById('mobile-auth-container');
            
            if (!headerAuthContainer || !mobileAuthContainer) return;

            if (user) {
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
                document.querySelectorAll('.logout-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        try {
                            await auth.signOut();
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
