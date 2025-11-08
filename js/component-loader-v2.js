/**
 * Component Loader v2 - Unified Header & Footer Injector
 * Loads clean, consistent components across all pages
 */

class ComponentLoaderV2 {
    static async load() {
        try {
            // Remove old/duplicate components first
            this.cleanupOldComponents();
            
            // Load unified components
            await this.loadHeader();
            await this.loadFooter();
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    static cleanupOldComponents() {
        // Hide old headers (but keep our new unified one)
        document.querySelectorAll('header').forEach(header => {
            if (!header.id || header.id !== 'app-header') {
                header.style.display = 'none';
            }
        });
        
        // Hide old footers (but keep our new unified one)
        document.querySelectorAll('footer').forEach(footer => {
            if (!footer.id || footer.id !== 'app-footer') {
                footer.style.display = 'none';
            }
        });
    }

    static async loadHeader() {
        try {
            // Skip if unified header already exists
            if (document.getElementById('app-header')) return;
            
            const response = await fetch('/components/header.html');
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
            // Skip if unified footer already exists
            if (document.getElementById('app-footer')) return;
            
            const response = await fetch('/components/footer.html');
            if (!response.ok) throw new Error('Failed to load footer');
            
            const content = await response.text();
            const footer = document.createElement('div');
            footer.innerHTML = content;
            
            // Insert at the end of body
            document.body.appendChild(footer.firstElementChild);
        } catch (error) {
            console.warn('Footer loading failed:', error);
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