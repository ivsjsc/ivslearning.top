/**
 * AIVY Chatbot Loader
 * Auto-injects AIVY chatbot into pages
 */

class AIVYChatbotLoader {
    constructor() {
        this.chatbotPath = '/components/aivy-chatbot.html';
        this.chatbotContainerId = 'aivy-chatbot-loader';
    }

    async load() {
        try {
            console.log('[AIVY] Loading chatbot...');

            // Check if already loaded
            if (document.getElementById('aivy-chatbot-container')) {
                console.log('[AIVY] Chatbot already loaded');
                return true;
            }

            // Create container
            let container = document.getElementById(this.chatbotContainerId);
            if (!container) {
                container = document.createElement('div');
                container.id = this.chatbotContainerId;
                document.body.appendChild(container);
            }

            // Fetch and inject
            const response = await fetch(this.chatbotPath);
            if (!response.ok) throw new Error(`Failed to load chatbot: ${response.status}`);

            const chatbotHTML = await response.text();
            container.innerHTML = chatbotHTML;

            console.log('[AIVY] Chatbot loaded successfully');
            return true;
        } catch (error) {
            console.error('[AIVY] Failed to load chatbot:', error);
            return false;
        }
    }
}

// Auto-load chatbot
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        const loader = new AIVYChatbotLoader();
        await loader.load();
    });
} else {
    const loader = new AIVYChatbotLoader();
    loader.load();
}
