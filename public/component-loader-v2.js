/**
 * Component Loader v2 - Inject header, footer, bottom nav vào tất cả pages
 * Tách từ auth.html style - minimal & clean
 */

class ComponentLoaderV2 {
    static async load() {
        try {
            await this.loadHeader();
            await this.loadFooter();
            await this.loadBottomNav();
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    static async loadHeader() {
        try {
            const response = await fetch('/components/header-auth.html');
            if (!response.ok) throw new Error('Failed to load header');
            
            const content = await response.text();
            const header = document.createElement('div');
            header.innerHTML = content;
            
            // Insert at the very beginning of body
            document.body.insertBefore(header.firstElementChild, document.body.firstChild);
        } catch (error) {
            console.warn('Header loading failed:', error);
        }
    }

    static async loadFooter() {
        try {
            const response = await fetch('/components/footer-auth.html');
            if (!response.ok) throw new Error('Failed to load footer');
            
            const content = await response.text();
            const footer = document.createElement('div');
            footer.innerHTML = content;
            
            // Insert before body close
            document.body.appendChild(footer.firstElementChild);
        } catch (error) {
            console.warn('Footer loading failed:', error);
        }
    }

    static async loadBottomNav() {
        try {
            const response = await fetch('/components/bottom-nav.html');
            if (!response.ok) throw new Error('Failed to load bottom nav');
            
            const content = await response.text();
            const nav = document.createElement('div');
            nav.innerHTML = content;
            
            // Insert before body close
            document.body.appendChild(nav.firstElementChild);
        } catch (error) {
            console.warn('Bottom nav loading failed:', error);
        }
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ComponentLoaderV2.load();
    });
} else {
    ComponentLoaderV2.load();
}