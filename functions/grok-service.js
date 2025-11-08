/**
 * Grok AI Service for Aivy
 * Secure backend service that calls Grok API
 * Frontend never exposes API key - all requests go through this service
 * 
 * ⚠️ SECURITY MEASURES:
 * - API key stored in .env (server-side only)
 * - Rate limiting implemented
 * - Input validation & sanitization
 * - Error handling without exposing sensitive info
 */

const https = require('https');
const { RateLimiter } = require('bottleneck');

class GrokAiService {
  constructor() {
    // Initialize rate limiter: 10 requests per 60 seconds
    this.limiter = new RateLimiter({
      maxConcurrent: 1,
      minTime: 100, // 100ms between requests
      reservoir: 10, // 10 requests
      reservoirRefreshAmount: 10,
      reservoirRefreshInterval: 60 * 1000 // per 60 seconds
    });

    this.apiKey = process.env.GROK_API_KEY;
    this.apiEndpoint = 'https://api.x.ai/v1/chat/completions';
    this.model = process.env.GROK_MODEL || 'grok-2';
    this.maxTokens = 1024;
    this.temperature = 0.7;

    // System prompts for Aivy personality
    this.systemPrompts = {
      en: `You are Aivy, a cheeky but helpful AI assistant for English learners. 
Your personality:
- Friendly and engaging, with subtle humor
- Patient and encouraging
- Expert in English grammar, vocabulary, and learning techniques
- Can provide science & tech guidance based on IVS Celestech
- Always provide responses in clear, structured format

When helping with English:
1. Explain clearly with examples
2. Provide practical tips
3. Encourage the learner
4. Use emojis sparingly but effectively

Available commands: language, dark_mode, volume, help
Respond naturally to chat while being helpful for English learning.`,
      
      vi: `Bạn là Aivy, một trợ lý AI hài hước nhưng hữu ích cho những người học tiếng Anh.
Tính cách của bạn:
- Thân thiện và hấp dẫn, với những lời hài hước tinh tế
- Kiên nhẫn và khuyến khích
- Chuyên gia về ngữ pháp, từ vựng và kỹ thuật học tiếng Anh
- Có thể cung cấp hướng dẫn khoa học và công nghệ dựa trên IVS Celestech
- Luôn cung cấp phản hồi ở định dạng rõ ràng, có cấu trúc

Khi giúp với tiếng Anh:
1. Giải thích rõ ràng với ví dụ
2. Cung cấp mẹo thực tiễn
3. Khuyến khích người học
4. Sử dụng emoji một cách phù hợp

Các lệnh có sẵn: ngôn ngữ, chế độ tối, âm lượng, giúp
Trả lời tự nhiên với cuộc trò chuyện đồng thời hữu ích cho việc học tiếng Anh.`
    };

    if (!this.apiKey) {
      console.error('⚠️ ERROR: GROK_API_KEY environment variable not set!');
    }
  }

  /**
   * Main method to chat with Grok
   * @param {string} userMessage - User's message
   * @param {string} language - 'en' or 'vi'
   * @param {Array} conversationHistory - Previous messages for context
   * @returns {Promise<string>} - Grok's response
   */
  async chat(userMessage, language = 'en', conversationHistory = []) {
    try {
      // Input validation
      if (!userMessage || typeof userMessage !== 'string') {
        throw new Error('Invalid message format');
      }

      userMessage = userMessage.trim().substring(0, 5000); // Prevent abuse

      // Rate limiting
      await this.limiter.schedule(() => Promise.resolve());

      // Build conversation context
      const messages = [
        {
          role: 'system',
          content: this.systemPrompts[language] || this.systemPrompts.en
        },
        ...conversationHistory.slice(-10), // Keep last 10 messages for context
        {
          role: 'user',
          content: userMessage
        }
      ];

      console.log(`[Grok] Sending request: "${userMessage.substring(0, 50)}..."`);

      // Call Grok API
      const response = await this._callGrokApi(messages);
      
      console.log(`[Grok] Received response successfully`);
      
      return response;
    } catch (error) {
      console.error('[Grok Error]', error.message);
      return this._getErrorMessage(language);
    }
  }

  /**
   * Handle voice commands separately
   * @param {string} command - Voice command (e.g., "toggle_dark_mode")
   * @param {string} language - 'en' or 'vi'
   * @returns {Promise<Object>} - {status, message, action}
   */
  async handleVoiceCommand(command, language = 'en') {
    const commands = {
      'toggle_dark_mode': {
        status: 'success',
        action: 'toggleDarkMode',
        message: {
          en: '✨ Dark mode toggled! Enjoy the new view.',
          vi: '✨ Chế độ tối đã được bật/tắt! Thích thích với giao diện mới.'
        }
      },
      'change_language_en': {
        status: 'success',
        action: 'changeLanguage',
        params: { language: 'en' },
        message: {
          en: '🌐 Language changed to English!',
          vi: '🌐 Ngôn ngữ đã được đổi sang Tiếng Anh!'
        }
      },
      'change_language_vi': {
        status: 'success',
        action: 'changeLanguage',
        params: { language: 'vi' },
        message: {
          en: '🌐 Language changed to Vietnamese!',
          vi: '🌐 Ngôn ngữ đã được đổi sang Tiếng Việt!'
        }
      },
      'toggle_sound': {
        status: 'success',
        action: 'toggleSound',
        message: {
          en: '🔊 Sound toggled! Your preference is saved.',
          vi: '🔊 Âm thanh đã được bật/tắt! Tùy chọn của bạn đã được lưu.'
        }
      },
      'help': {
        status: 'success',
        action: 'showHelp',
        message: {
          en: `📖 Here's what I can help with:
• English grammar, vocabulary, pronunciation
• Learning techniques and study tips
• Science & tech guidance
• Control settings: "toggle dark mode", "change language", "toggle sound"`,
          vi: `📖 Đây là những gì tôi có thể giúp bạn:
• Ngữ pháp, từ vựng, phát âm tiếng Anh
• Kỹ thuật học tập và mẹo học
• Hướng dẫn khoa học và công nghệ
• Điều khiển cài đặt: "bật chế độ tối", "đổi ngôn ngữ", "tắt âm thanh"`
        }
      }
    };

    const result = commands[command];
    
    if (result) {
      return {
        ...result,
        message: result.message[language] || result.message.en
      };
    }

    return {
      status: 'unknown',
      message: {
        en: '❓ I didn\'t catch that command. Say "help" for options!',
        vi: '❓ Tôi không hiểu lệnh đó. Hãy nói "giúp" để xem các tùy chọn!'
      }[language]
    };
  }

  /**
   * Private: Call Grok API
   */
  async _callGrokApi(messages) {
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify({
        model: this.model,
        messages: messages,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        stream: false
      });

      const options = {
        hostname: 'api.x.ai',
        port: 443,
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          'Authorization': `Bearer ${this.apiKey}`
        },
        timeout: 30000
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0].message.content;
              resolve(content);
            } else {
              reject(new Error(`API returned status ${res.statusCode}`));
            }
          } catch (e) {
            reject(new Error('Failed to parse Grok response'));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Network error: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.write(payload);
      req.end();
    });
  }

  /**
   * Get error message based on language
   */
  _getErrorMessage(language) {
    const messages = {
      en: '😅 Oops! I ran into a small issue. Please try again in a moment!',
      vi: '😅 Ôi! Tôi gặp một vấn đề nhỏ. Vui lòng thử lại sau một lúc!'
    };
    return messages[language] || messages.en;
  }
}

module.exports = GrokAiService;
