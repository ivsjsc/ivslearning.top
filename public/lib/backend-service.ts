/**
 * Backend Service - Type-safe API wrapper with rate limiting & caching
 * Simple interface cho application
 */

import { ApiClient, ApiError } from './api-client';
import { RateLimiter, LRUCache, RateLimitConfig, CacheConfig } from './rate-limiter';

export interface BackendServiceConfig {
  baseUrl: string;
  rateLimitConfig?: RateLimitConfig;
  cacheConfig?: CacheConfig;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  content: string;
  clientSource: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: string;
  avatarUrl?: string;
  metadata: {
    createdAt: string;
    lastSignInAt: string;
  };
}

export interface GenerateContentRequest {
  topic: string;
  vocabulary?: string[];
  grammar?: string;
}

export interface GenerateContentResponse {
  quiz: any;
  dialogue: string;
  modelUsed: string;
}

export class AdvancedBackendService {
  private client: ApiClient;
  private limiter: RateLimiter;
  private cache: LRUCache;

  constructor(config: BackendServiceConfig) {
    this.client = new ApiClient(config.baseUrl);
    this.limiter = new RateLimiter(config.rateLimitConfig);
    this.cache = new LRUCache(config.cacheConfig);
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string | null) {
    this.client.setAuthToken(token);
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    const cacheKey = `user:${userId}`;

    // Try cache first
    const cached = this.cache.get<UserProfile>(cacheKey);
    if (cached) return cached;

    // Check rate limiter
    if (!this.limiter.isAllowed('/user')) {
      throw new ApiError(429, 'Rate limit exceeded');
    }

    // Fetch from backend
    const response = await this.client.request('/api/ai-router', {
      method: 'POST',
      body: {
        task: 'get_user_profile',
        data: { userId },
      },
    });

    // Cache result
    this.cache.set(cacheKey, response.user, 10 * 60 * 1000); // 10 min

    return response.user as UserProfile;
  }

  /**
   * Get all posts
   */
  async getPosts(options: {
    filters?: any[];
    limit?: number;
    orderBy?: { field: string; direction: 'asc' | 'desc' };
  } = {}): Promise<Post[]> {
    const cacheKey = `posts:${JSON.stringify(options)}`;

    // Try cache first
    const cached = this.cache.get<Post[]>(cacheKey);
    if (cached) return cached;

    // Check rate limiter
    if (!this.limiter.isAllowed('/posts')) {
      throw new ApiError(429, 'Rate limit exceeded');
    }

    // Fetch from backend
    const response = await this.client.request('/api/ai-router', {
      method: 'POST',
      body: {
        task: 'get_posts',
        data: options,
      },
    });

    const posts = response.posts || [];

    // Cache result (5 min)
    this.cache.set(cacheKey, posts, 5 * 60 * 1000);

    return posts as Post[];
  }

  /**
   * Get posts by author
   */
  async getPostsByAuthor(userId: string, limit: number = 50): Promise<Post[]> {
    return this.getPosts({
      filters: [{ field: 'authorId', op: '==', value: userId }],
      limit,
      orderBy: { field: 'createdAt', direction: 'desc' },
    });
  }

  /**
   * Generate educational content
   */
  async generateContent(
    request: GenerateContentRequest
  ): Promise<GenerateContentResponse> {
    // Check rate limiter (strict limit for AI)
    if (!this.limiter.isAllowed('/generate-content')) {
      throw new ApiError(429, 'Rate limit exceeded for content generation');
    }

    // No caching for generated content (always fresh)
    const response = await this.client.request('/api/ai-router', {
      method: 'POST',
      body: {
        task: 'generate_content',
        data: request,
      },
    });

    return response as GenerateContentResponse;
  }

  /**
   * Check admin override
   */
  async checkAdminOverride(userId: string, permission: string): Promise<{ canOverride: boolean }> {
    if (!this.limiter.isAllowed('/admin-check')) {
      throw new ApiError(429, 'Rate limit exceeded');
    }

    const response = await this.client.request('/api/ai-router', {
      method: 'POST',
      body: {
        task: 'admin_override_check',
        data: { userId, permission },
      },
    });

    return response;
  }

  /**
   * Get rate limiter status
   */
  getRateLimiterStatus(endpoint: string = 'global') {
    return this.limiter.getStatus(endpoint);
  }

  /**
   * Get cache stats
   */
  getCacheStats() {
    return this.cache.getStats();
  }

  /**
   * Get circuit breaker status
   */
  getCircuitBreakerStatus() {
    return this.client.getCircuitBreakerStatus();
  }

  /**
   * Invalidate cache for endpoint
   */
  invalidateCache(key: string) {
    this.cache.invalidate(key);
  }

  /**
   * Clear all cache
   */
  clearCache() {
    this.cache.clear();
  }
}
