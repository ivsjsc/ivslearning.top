const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const GrokAiService = require('../grok-service');

describe('GrokAiService', () => {
  let service;
  let callGrokApiStub;

  beforeEach(() => {
    // Set a dummy API key for the tests
    process.env.GROK_API_KEY = 'test-key';
    service = new GrokAiService();
    // Stub the private method before each test
    callGrokApiStub = sinon.stub(service, '_callGrokApi').resolves('Mocked Grok Response');
  });

  afterEach(() => {
    // Restore the stub after each test
    sinon.restore();
    delete process.env.GROK_API_KEY;
  });

  describe('Constructor', () => {
    it('should throw an error if GROK_API_KEY is not set', () => {
      delete process.env.GROK_API_KEY;
      expect(() => new GrokAiService()).to.throw('GROK_API_KEY environment variable is required');
    });

    it('should create an instance with default values', () => {
      expect(service).to.be.instanceOf(GrokAiService);
      expect(service.apiKey).to.equal('test-key');
      expect(service.model).to.equal('grok-2');
    });
  });

  describe('chat', () => {
    it('should call the Grok API with the correct parameters', async () => {
      const userMessage = 'Hello, Aivy!';
      const language = 'en';
      const conversationHistory = [{ role: 'user', content: 'Previous message' }];

      await service.chat(userMessage, language, conversationHistory);

      expect(callGrokApiStub.calledOnce).to.be.true;
      const messages = callGrokApiStub.firstCall.args[0];
      expect(messages[0].role).to.equal('system');
      expect(messages[1].role).to.equal('user');
      expect(messages[1].content).to.equal('Previous message');
      expect(messages[2].role).to.equal('user');
      expect(messages[2].content).to.equal(userMessage);
    });

    it('should return the response from the Grok API', async () => {
      const response = await service.chat('test');
      expect(response).to.equal('Mocked Grok Response');
    });

    it('should handle errors gracefully', async () => {
      callGrokApiStub.rejects(new Error('API Error'));
      const response = await service.chat('test');
      expect(response).to.equal('😅 Oops! I ran into a small issue. Please try again in a moment!');
    });
  });

  describe('handleVoiceCommand', () => {
    it('should handle the "toggle_dark_mode" command', async () => {
      const response = await service.handleVoiceCommand('toggle_dark_mode', 'en');
      expect(response.action).to.equal('toggleDarkMode');
      expect(response.message).to.equal('✨ Dark mode toggled! Enjoy the new view.');
    });

    it('should handle the "change_language_vi" command', async () => {
      const response = await service.handleVoiceCommand('change_language_vi', 'vi');
      expect(response.action).to.equal('changeLanguage');
      expect(response.params.language).to.equal('vi');
      expect(response.message).to.equal('🌐 Ngôn ngữ đã được đổi sang Tiếng Việt!');
    });

    it('should return an "unknown" status for invalid commands', async () => {
      const response = await service.handleVoiceCommand('invalid_command', 'en');
      expect(response.status).to.equal('unknown');
    });
  });
});
