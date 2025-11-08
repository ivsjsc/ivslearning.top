/**
 * API Service Initialization
 * Initialize backend service and auth listener
 */

// ============================================
// 1. Initialize Backend Service
// ============================================

class AdvancedBackendService {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'http://localhost:3000';
    this.authToken = null;
    this.timeout = 30000;
    
    // Circuit breaker
    this.circuitBreaker = {
      state: 'closed',
      failures: 0,
      threshold: 5,
      timeout: 60000,
      lastFailureTime: null,
    };
    
    // Rate limiter
    this.rateLimitConfig = config.rateLimitConfig || {
      maxRequests: 100,
      windowMs: 60000,
      perEndpoint: true,
    };
    this.tokens = new Map();
    this.lastRefillTime = new Map();
    
    // Cache (LRU)
    this.cacheConfig = config.cacheConfig || {
      maxSize: 100,
      defaultTtl: 5 * 60 * 1000,
      enableCaching: true,
    };
    this.cache = new Map();
  }

  setAuthToken(token) {
    this.authToken = token;
  }

  // ========== Rate Limiting ==========
  isAllowed(endpoint = 'global') {
    const key = this.rateLimitConfig.perEndpoint ? endpoint : 'global';
    const now = Date.now();
    const lastRefill = this.lastRefillTime.get(key) || now;

    if (now - lastRefill >= this.rateLimitConfig.windowMs) {
      this.tokens.set(key, this.rateLimitConfig.maxRequests);
      this.lastRefillTime.set(key, now);
    }

    const currentTokens = this.tokens.get(key) || this.rateLimitConfig.maxRequests;

    if (currentTokens > 0) {
      this.tokens.set(key, currentTokens - 1);
      return true;
    }

    return false;
  }

  getRateLimiterStatus(endpoint = 'global') {
    const key = this.rateLimitConfig.perEndpoint ? endpoint : 'global';
    return {
      remaining: this.tokens.get(key) || this.rateLimitConfig.maxRequests,
      limit: this.rateLimitConfig.maxRequests,
      resetTime: (this.lastRefillTime.get(key) || 0) + this.rateLimitConfig.windowMs,
    };
  }

  // ========== Caching ==========
  getFromCache(key) {
    if (!this.cacheConfig.enableCaching) return null;

    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Move to end (LRU)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.data;
  }

  setInCache(key, data, ttl = this.cacheConfig.defaultTtl) {
    if (!this.cacheConfig.enableCaching) return;

    if (this.cache.size >= this.cacheConfig.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  invalidateCache(key) {
    this.cache.delete(key);
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.cacheConfig.maxSize,
      entries: Array.from(this.cache.keys()),
    };
  }

  // ========== HTTP Requests ==========
  async request(path, options = {}) {
    // Check circuit breaker
    if (this.circuitBreaker.state === 'open') {
      throw new Error('Service unavailable - circuit breaker open');
    }

    const url = `${this.baseUrl}${path}`;
    const method = options.method || 'GET';
    const maxRetries = 3;

    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.executeRequest(url, method, options);
        this.circuitBreaker.failures = 0;
        this.circuitBreaker.state = 'closed';
        return response;
      } catch (error) {
        lastError = error;

        if (error.status >= 500) {
          this.circuitBreaker.failures++;
          this.circuitBreaker.lastFailureTime = Date.now();
          if (this.circuitBreaker.failures >= this.circuitBreaker.threshold) {
            this.circuitBreaker.state = 'open';
          }
        }

        if (error.status >= 400 && error.status !== 429) {
          throw error;
        }

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  async executeRequest(url, method, options) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        const error = new Error(data.message || response.statusText);
        error.status = response.status;
        error.details = data;
        throw error;
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // ========== API Methods ==========
  async getPosts(options = {}) {
    const cacheKey = `posts:${JSON.stringify(options)}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    if (!this.isAllowed('/posts')) {
      throw new Error('Rate limit exceeded');
    }

    const response = await this.request('/api/ai-router', {
      method: 'POST',
      body: {
        task: 'get_posts',
        data: options,
      },
    });

    const posts = response.posts || [];
    this.setInCache(cacheKey, posts, 5 * 60 * 1000);
    return posts;
  }

  async getPostsByAuthor(userId, limit = 50) {
    return this.getPosts({
      filters: [{ field: 'authorId', op: '==', value: userId }],
      limit,
      orderBy: { field: 'createdAt', direction: 'desc' },
    });
  }

  async getUserProfile(userId) {
    const cacheKey = `user:${userId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    if (!this.isAllowed('/user')) {
      throw new Error('Rate limit exceeded');
    }

    const response = await this.request('/api/ai-router', {
      method: 'POST',
      body: {
        task: 'get_user_profile',
        data: { userId },
      },
    });

    this.setInCache(cacheKey, response.user, 10 * 60 * 1000);
    return response.user;
  }

  async generateContent(request) {
    if (!this.isAllowed('/generate-content')) {
      throw new Error('Rate limit exceeded');
    }

    return this.request('/api/ai-router', {
      method: 'POST',
      body: {
        task: 'generate_content',
        data: request,
      },
    });
  }

  getCircuitBreakerStatus() {
    return {
      state: this.circuitBreaker.state,
      failures: this.circuitBreaker.failures,
      lastFailureTime: this.circuitBreaker.lastFailureTime,
    };
  }
}

// ============================================
// 2. Global API Instance
// ============================================

window.apiService = new AdvancedBackendService({
  baseUrl: window.BACKEND_URL || 'http://localhost:3000',
  rateLimitConfig: {
    maxRequests: 100,
    windowMs: 60000,
    perEndpoint: true,
  },
  cacheConfig: {
    maxSize: 100,
    defaultTtl: 5 * 60 * 1000,
    enableCaching: true,
  },
});

// ============================================
// 3. Setup Firebase Auth Listener
// ============================================

function setupAuthListener() {
  if (typeof firebase === 'undefined') {
    console.warn('[Auth] Firebase not loaded');
    return;
  }

  firebase.auth().onAuthStateChanged(async user => {
    if (user) {
      console.log('[Auth] User logged in:', user.email);
      try {
        const token = await user.getIdToken();
        window.apiService.setAuthToken(token);
        window.firebaseUser = user;
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('auth-login', { detail: user }));
      } catch (error) {
        console.error('[Auth] Token error:', error);
      }
    } else {
      console.log('[Auth] User logged out');
      window.apiService.setAuthToken(null);
      window.apiService.clearCache();
      window.firebaseUser = null;
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('auth-logout'));
    }
  });
}

// Auto-setup when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupAuthListener);
} else {
  setupAuthListener();
}

// ============================================
// 4. API Helper Functions
// ============================================

window.API = {
  get: async (path, options) => window.apiService.request(path, { ...options, method: 'GET' }),
  post: async (path, body, options) => window.apiService.request(path, { ...options, method: 'POST', body }),
  put: async (path, body, options) => window.apiService.request(path, { ...options, method: 'PUT', body }),
  delete: async (path, options) => window.apiService.request(path, { ...options, method: 'DELETE' }),
  
  getPosts: async (options) => window.apiService.getPosts(options),
  getUserProfile: async (userId) => window.apiService.getUserProfile(userId),
  generateContent: async (request) => window.apiService.generateContent(request),
  
  setToken: (token) => window.apiService.setAuthToken(token),
  clearCache: () => window.apiService.clearCache(),
  getStats: () => ({
    cache: window.apiService.getCacheStats(),
    rateLimit: window.apiService.getRateLimiterStatus(),
    circuitBreaker: window.apiService.getCircuitBreakerStatus(),
  }),
};

console.log('[API] Service initialized. Use window.API or window.apiService to make requests.');
