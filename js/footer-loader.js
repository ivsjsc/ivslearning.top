/**
 * IVSLearning Global Footer Loader
 * Automatically injects footer component into all pages
 */

class IVSFooterLoader {
    constructor() {
        this.footerPath = '/components/footer.html';
        this.footerContainerId = 'ivs-footer-container';
    }

    /**
     * Load and inject footer into the page
     */
    async load() {
        try {
            console.log('[Footer] Loading global footer...');

            // Check if footer container exists
            let container = document.getElementById(this.footerContainerId);
            
            if (!container) {
                // Create container at end of body
                container = document.createElement('div');
                container.id = this.footerContainerId;
                document.body.appendChild(container);
            }

            // Fetch footer HTML
            const response = await fetch(this.footerPath);
            if (!response.ok) throw new Error(`Failed to load footer: ${response.status}`);

            const footerHTML = await response.text();

            // Inject footer
            container.innerHTML = footerHTML;

            console.log('[Footer] Footer loaded successfully');

            // Execute any scripts in footer (if needed)
            this.executeScripts(container);

            return true;
        } catch (error) {
            console.error('[Footer] Failed to load footer:', error);
            return false;
        }
    }

    /**
     * Execute any script tags in the footer
     */
    executeScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            newScript.async = true;
            document.body.appendChild(newScript);
        });
    }

    /**
     * Scroll to top animation
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Initialize scroll-to-top button in footer
     */
    initScrollToTop() {
        const scrollBtn = document.querySelector('[data-scroll-to-top]');
        if (scrollBtn) {
            scrollBtn.addEventListener('click', () => this.scrollToTop());
        }
    }
}

// Auto-load footer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        const footerLoader = new IVSFooterLoader();
        await footerLoader.load();
    });
} else {
    // DOM already loaded
    const footerLoader = new IVSFooterLoader();
    footerLoader.load();
}

// Export for manual usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IVSFooterLoader;
}
