/**
 * Aivy Grok Integration Service
 * Frontend service that communicates with Grok via secure backend
 * 
 * ✅ SECURITY BEST PRACTICES:
 * - API key NEVER stored in frontend code
 * - All requests go through backend
 * - Error messages don't expose sensitive info
 * - Rate limiting handled server-side
 */

export interface GrokChatRequest {
  message: string;
  language: 'en' | 'vi';
  history?: Array<{ role: string; content: string }>;
}

export interface GrokChatResponse {
  status: 'success' | 'error';
  response?: string;
  message?: string;
  timestamp?: string;
}

export interface VoiceCommandResult {
  status: 'success' | 'error' | 'unknown';
  action?: string;
  message: string;
  params?: Record<string, any>;
}

class AivyGrokService {
  private backendUrl: string;
  private conversationHistory: Array<{ role: string; content: string }> = [];
  private maxHistoryLength = 10;

  constructor(backendUrl: string = process.env.VITE_BACKEND_URL || 'http://localhost:3000/api') {
    this.backendUrl = backendUrl;
    console.log('[Aivy] Grok service initialized', { backendUrl });
  }

  /**
   * Send message to Grok via backend
   */
  async sendMessage(
    userMessage: string,
    language: 'en' | 'vi' = 'en',
    includeHistory: boolean = true
  ): Promise<string> {
    try {
      // Validate input
      if (!userMessage || typeof userMessage !== 'string') {
        throw new Error('Invalid message');
      }

      userMessage = userMessage.trim();
      if (userMessage.length === 0) {
        throw new Error('Message cannot be empty');
      }

      if (userMessage.length > 5000) {
        throw new Error('Message too long (max 5000 characters)');
      }

      // Prepare request
      const request: GrokChatRequest = {
        message: userMessage,
        language,
        history: includeHistory ? this.conversationHistory : []
      };

      console.log('[Aivy] Sending to Grok:', {
        messageLength: userMessage.length,
        language,
        historyLength: request.history?.length || 0
      });

      // Call backend API
      const response = await fetch(`${this.backendUrl}/grok/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `API error: ${response.status}`);
      }

      const data: GrokChatResponse = await response.json();

      if (data.status === 'success' && data.response) {
        // Update conversation history
        this.conversationHistory.push(
          { role: 'user', content: userMessage },
          { role: 'assistant', content: data.response }
        );

        // Keep history manageable
        if (this.conversationHistory.length > this.maxHistoryLength * 2) {
          this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength * 2);
        }

        console.log('[Aivy] Received response from Grok');
        return data.response;
      } else {
        throw new Error(data.message || 'No response from Grok');
      }
    } catch (error) {
      console.error('[Aivy] Error sending message:', error);
      throw error;
    }
  }

  /**
   * Handle voice commands
   */
  async handleVoiceCommand(
    command: string,
    language: 'en' | 'vi' = 'en'
  ): Promise<VoiceCommandResult> {
    try {
      // Map voice input to command
      const commandMap: Record<string, string> = {
        // English
        'toggle dark mode': 'toggle_dark_mode',
        'dark mode': 'toggle_dark_mode',
        'change to english': 'change_language_en',
        'english': 'change_language_en',
        'toggle sound': 'toggle_sound',
        'mute': 'toggle_sound',
        'unmute': 'toggle_sound',
        'help': 'help',
        
        // Vietnamese
        'bật chế độ tối': 'toggle_dark_mode',
        'chế độ tối': 'toggle_dark_mode',
        'đổi sang tiếng anh': 'change_language_en',
        'tiếng anh': 'change_language_en',
        'đổi sang tiếng việt': 'change_language_vi',
        'tiếng việt': 'change_language_vi',
        'tắt âm thanh': 'toggle_sound',
        'bật âm thanh': 'toggle_sound',
        'giúp': 'help'
      };

      const normalizedCommand = command.toLowerCase().trim();
      const mappedCommand = commandMap[normalizedCommand];

      if (!mappedCommand) {
        return {
          status: 'unknown',
          message: language === 'en'
            ? '❓ I didn\'t catch that command. Say "help" for options!'
            : '❓ Tôi không hiểu lệnh đó. Hãy nói "giúp" để xem các tùy chọn!'
        };
      }

      console.log('[Aivy] Executing voice command:', mappedCommand);

      // Call backend command endpoint
      const response = await fetch(`${this.backendUrl}/grok/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          command: mappedCommand,
          language
        })
      });

      if (!response.ok) {
        throw new Error(`Command failed: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('[Aivy] Error handling voice command:', error);
      return {
        status: 'error',
        message: language === 'en'
          ? '😅 Something went wrong with that command'
          : '😅 Lệnh đó gặp sự cố'
      };
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
    console.log('[Aivy] Conversation history cleared');
  }

  /**
   * Get conversation history for debugging
   */
  getHistory(): Array<{ role: string; content: string }> {
    return [...this.conversationHistory];
  }

  /**
   * Check service health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.backendUrl}/grok/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Parse Grok response for formatting
   * Can detect response types: question, tip, explanation, list
   */
  parseResponse(text: string): {
    type: 'question' | 'tip' | 'explanation' | 'list' | 'general';
    content: string;
    formatted: boolean;
  } {
    const lowerText = text.toLowerCase();

    // Detect type
    let type: 'question' | 'tip' | 'explanation' | 'list' | 'general' = 'general';
    
    if (lowerText.includes('tip') || lowerText.includes('trick') || lowerText.includes('mẹo')) {
      type = 'tip';
    } else if (lowerText.includes('here\'s') || lowerText.includes('explain') || lowerText.includes('giải thích')) {
      type = 'explanation';
    } else if (lowerText.includes('list') || lowerText.includes('here are') || lowerText.includes('danh sách')) {
      type = 'list';
    }

    return {
      type,
      content: text,
      formatted: true
    };
  }
}

// Export singleton instance
export const aivyGrokService = new AivyGrokService();

export default AivyGrokService;
