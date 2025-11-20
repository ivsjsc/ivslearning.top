/**
 * Rate Limiter & Cache - Token bucket algorithm with LRU cache
 */

export interface RateLimitConfig {
  maxRequests?: number;
  windowMs?: number;
  perEndpoint?: boolean;
}

export interface CacheConfig {
  maxSize?: number;
  defaultTtl?: number;
  enableCaching?: boolean;
}

export class RateLimiter {
  private tokens: Map<string, number> = new Map();
  private maxRequests: number;
  private windowMs: number;
  private perEndpoint: boolean;
  private lastRefillTime: Map<string, number> = new Map();

  constructor(config: RateLimitConfig = {}) {
    this.maxRequests = config.maxRequests || 100;
    this.windowMs = config.windowMs || 60000;
    this.perEndpoint = config.perEndpoint !== false;
  }

  /**
   * Check if request is allowed
   */
  isAllowed(endpoint: string = 'global'): boolean {
    const key = this.perEndpoint ? endpoint : 'global';
    const now = Date.now();
    const lastRefill = this.lastRefillTime.get(key) || now;

    // Refill tokens based on time passed
    if (now - lastRefill >= this.windowMs) {
      this.tokens.set(key, this.maxRequests);
      this.lastRefillTime.set(key, now);
    }

    const currentTokens = this.tokens.get(key) || this.maxRequests;

    if (currentTokens > 0) {
      this.tokens.set(key, currentTokens - 1);
      return true;
    }

    return false;
  }

  /**
   * Get remaining tokens
   */
  getRemainingTokens(endpoint: string = 'global'): number {
    const key = this.perEndpoint ? endpoint : 'global';
    return this.tokens.get(key) || this.maxRequests;
  }

  /**
   * Get status
   */
  getStatus(endpoint: string = 'global') {
    const key = this.perEndpoint ? endpoint : 'global';
    return {
      remaining: this.getRemainingTokens(key),
      limit: this.maxRequests,
      resetTime: (this.lastRefillTime.get(key) || 0) + this.windowMs,
    };
  }
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class LRUCache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxSize: number;
  private defaultTtl: number;
  private enableCaching: boolean;

  constructor(config: CacheConfig = {}) {
    this.maxSize = config.maxSize || 100;
    this.defaultTtl = config.defaultTtl || 5 * 60 * 1000;
    this.enableCaching = config.enableCaching !== false;
  }

  /**
   * Get value from cache
   */
  get<T = any>(key: string): T | null {
    if (!this.enableCaching) return null;

    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Move to end (LRU)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.data as T;
  }

  /**
   * Set value in cache
   */
  set(key: string, data: any, ttl: number = this.defaultTtl): void {
    if (!this.enableCaching) return;

    // Remove oldest entry if at max size
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Invalidate cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.cache.keys()),
    };
  }
}
