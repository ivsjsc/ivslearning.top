/**
 * Universal Loader v1.0
 * Loads Header, Footer, and AIVY Chatbot in one go
 * Usage: <script defer src="/js/universal-loader.js"></script>
 */

class UniversalLoader {
    static async init() {
        try {
            console.log('🚀 UniversalLoader: Starting initialization');
            
            // Load all components in parallel for better performance
            await Promise.all([
                this.loadHeader(),
                this.loadFooter(),
                this.loadAivy()
            ]);
            
            console.log('✅ UniversalLoader: All components loaded successfully');
        } catch (error) {
            console.error('❌ UniversalLoader Error:', error);
        }
    }

    /**
     * Load Header Component
     */
    static async loadHeader() {
        try {
            if (document.getElementById('app-header')) return;
            
            const response = await fetch('/components/header.html');
            if (!response.ok) throw new Error('Header fetch failed');
            
            const content = await response.text();
            const header = document.createElement('div');
            header.innerHTML = content;
            document.body.insertBefore(header.firstElementChild, document.body.firstChild);
            
            console.log('✓ Header loaded');
        } catch (error) {
            console.warn('⚠ Header loading failed:', error);
        }
    }

    /**
     * Load Footer Component
     */
    static async loadFooter() {
        try {
            if (document.getElementById('app-footer')) return;
            
            const response = await fetch('/components/footer.html');
            if (!response.ok) throw new Error('Footer fetch failed');
            
            const content = await response.text();
            const footer = document.createElement('div');
            footer.innerHTML = content;
            document.body.appendChild(footer.firstElementChild);
            
            console.log('✓ Footer loaded');
        } catch (error) {
            console.warn('⚠ Footer loading failed:', error);
        }
    }

    /**
     * Load AIVY Chatbot Component
     */
    static async loadAivy() {
        try {
            // Check if already loaded (multiple protection)
            if (document.getElementById('aivy-root') || 
                document.getElementById('aivy-chat-window') || 
                document.querySelector('[data-aivy-loaded]')) {
                return;
            }
            
            const response = await fetch('/components/aivy-chatbot.html');
            if (!response.ok) throw new Error('AIVY fetch failed');
            
            const content = await response.text();
            const aivy = document.createElement('div');
            aivy.setAttribute('data-aivy-loaded', 'true');
            aivy.innerHTML = content;
            document.body.appendChild(aivy.firstElementChild);
            
            console.log('✓ AIVY Chatbot loaded');
        } catch (error) {
            console.warn('⚠ AIVY loading failed:', error);
        }
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        UniversalLoader.init();
    });
} else {
    UniversalLoader.init();
}
