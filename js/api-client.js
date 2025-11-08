/**
 * IVSLearning API Client
 * Handles all API requests with error handling, retry logic, and caching
 */

import { IVS_API_CONFIG, getApiUrl, getHeaders } from './api-config.js';

class APIClient {
    constructor() {
        this.cache = new Map();
        this.requestQueue = new Map();
        this.rateLimitTracker = new Map();
    }

    /**
     * Make HTTP request
     * @param {string} endpoint - API endpoint
     * @param {object} options - Request options (method, body, etc)
     * @returns {Promise} Response data
     */
    async request(endpoint, options = {}) {
        const {
            method = 'GET',
            body = null,
            cache = true,
            retry = true,
            timeout = IVS_API_CONFIG.TIMEOUT,
        } = options;

        const url = getApiUrl(endpoint);
        const cacheKey = `${method}:${url}`;

        // Check cache for GET requests
        if (method === 'GET' && cache && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < IVS_API_CONFIG.CACHE.TTL) {
                console.log('📦 Returning cached response:', endpoint);
                return cached.data;
            }
        }

        // Rate limiting check
        if (IVS_API_CONFIG.RATE_LIMIT.ENABLED) {
            await this.checkRateLimit();
        }

        try {
            const response = await fetch(url, {
                method,
                headers: getHeaders(),
                body: body ? JSON.stringify(body) : null,
                timeout,
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Cache successful GET responses
            if (method === 'GET' && cache) {
                this.cache.set(cacheKey, {
                    data,
                    timestamp: Date.now(),
                });
            }

            return data;
        } catch (error) {
            if (retry) {
                return this.retryRequest(endpoint, options);
            }
            throw error;
        }
    }

    /**
     * Retry failed request with exponential backoff
     */
    async retryRequest(endpoint, options, attempt = 1) {
        if (attempt > IVS_API_CONFIG.RETRY_ATTEMPTS) {
            throw new Error(`Failed after ${IVS_API_CONFIG.RETRY_ATTEMPTS} attempts`);
        }

        const delay = IVS_API_CONFIG.RETRY_DELAY * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));

        console.log(`🔄 Retry attempt ${attempt} for ${endpoint}`);
        return this.request(endpoint, { ...options, retry: false })
            .catch(() => this.retryRequest(endpoint, options, attempt + 1));
    }

    /**
     * Check rate limit
     */
    async checkRateLimit() {
        const now = Date.now();
        const windowStart = now - IVS_API_CONFIG.RATE_LIMIT.TIME_WINDOW;

        // Clean old entries
        for (const [timestamp] of this.rateLimitTracker) {
            if (timestamp < windowStart) {
                this.rateLimitTracker.delete(timestamp);
            }
        }

        if (this.rateLimitTracker.size >= IVS_API_CONFIG.RATE_LIMIT.MAX_REQUESTS) {
            const oldestTimestamp = Math.min(...this.rateLimitTracker.keys());
            const waitTime = oldestTimestamp + IVS_API_CONFIG.RATE_LIMIT.TIME_WINDOW - now;
            console.warn(`⏱️ Rate limited. Waiting ${waitTime}ms`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        this.rateLimitTracker.set(now, true);
    }

    /**
     * GET request
     */
    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    /**
     * POST request
     */
    async post(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', body });
    }

    /**
     * PUT request
     */
    async put(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PUT', body });
    }

    /**
     * DELETE request
     */
    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }

    /**
     * Clear cache
     */
    clearCache(endpoint = null) {
        if (endpoint) {
            this.cache.delete(`GET:${getApiUrl(endpoint)}`);
        } else {
            this.cache.clear();
        }
    }

    /**
     * Get cache stats
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            memory: new Blob(
                Array.from(this.cache.values()).map(item => JSON.stringify(item))
            ).size,
        };
    }
}

// Export singleton instance
export const apiClient = new APIClient();
export default apiClient;

// Export for global access
if (typeof window !== 'undefined') {
    window.apiClient = apiClient;
}
