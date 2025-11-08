/**
 * Local Development Server for Grok AI Backend
 * Run with: node server.js
 */

const express = require('express');
const grokRouter = require('./grok-api');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/grok', grokRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Grok AI Backend Server',
    status: 'running',
    endpoints: {
      chat: 'POST /api/grok/chat',
      command: 'POST /api/grok/command',
      health: 'GET /api/grok/health'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Grok AI Backend running on http://localhost:${PORT}`);
  console.log(`📍 Health check: GET http://localhost:${PORT}/api/grok/health`);
  console.log(`💬 Chat: POST http://localhost:${PORT}/api/grok/chat`);
});
