/**
 * Grok AI API Backend
 * Secure Express endpoints for Aivy to chat with Grok
 * 
 * ⚠️ SECURITY:
 * - API key NEVER exposed to frontend
 * - Rate limiting per user
 * - Input sanitization
 * - CORS properly configured
 * - Helmet for security headers
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const GrokAiService = require('./grok-service');

const router = express.Router();

// Initialize Grok service
const grokService = new GrokAiService();

// Security middleware
router.use(helmet());
router.use(express.json({ limit: '1mb' }));

// CORS configuration - adjust for your domain
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite dev
    'http://localhost:3000', // Backend dev
    'https://ivslearning.top',
    'https://www.ivslearning.top'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
router.use(cors(corsOptions));

// Rate limiting: 20 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(limiter);

/**
 * POST /api/grok/chat
 * Send a message to Grok and get response
 * 
 * Request body:
 * {
 *   "message": "Hello Aivy!",
 *   "language": "en",
 *   "history": []
 * }
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, language = 'en', history = [] } = req.body;

    // Validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Message is required and must be a string'
      });
    }

    if (!['en', 'vi'].includes(language)) {
      return res.status(400).json({
        status: 'error',
        message: 'Language must be "en" or "vi"'
      });
    }

    console.log(`[API] Chat request: language=${language}, messageLength=${message.length}`);

    // Call Grok service
    const response = await grokService.chat(message, language, history);

    res.json({
      status: 'success',
      response: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[API Error]', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      // ⚠️ IMPORTANT: Never expose internal error details to client
    });
  }
});

/**
 * POST /api/grok/command
 * Handle voice commands
 * 
 * Request body:
 * {
 *   "command": "toggle_dark_mode",
 *   "language": "en"
 * }
 */
router.post('/command', async (req, res) => {
  try {
    const { command, language = 'en' } = req.body;

    if (!command || typeof command !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Command is required'
      });
    }

    console.log(`[API] Command: ${command}, language=${language}`);

    const result = await grokService.handleVoiceCommand(command, language);

    res.json({
      status: 'success',
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[API Error]', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/grok/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Grok AI Service',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
