/**
 * API Client - Base HTTP client with retry, timeout, error handling
 */

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export interface CircuitBreakerStatus {
  state: 'closed' | 'open' | 'half-open';
  failures: number;
  lastFailureTime: number | null;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;
  private timeout: number = 30000;
  private circuitBreaker = {
    state: 'closed' as 'closed' | 'open' | 'half-open',
    failures: 0,
    threshold: 5,
    timeout: 60000,
    lastFailureTime: null as number | null,
  };

  constructor(baseUrl: string, timeout: number = 30000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Set auth token for API requests
   */
  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  /**
   * Get circuit breaker status
   */
  getCircuitBreakerStatus(): CircuitBreakerStatus {
    // Check if circuit should recover
    if (this.circuitBreaker.state === 'open') {
      const timeSinceFailure = Date.now() - (this.circuitBreaker.lastFailureTime || 0);
      if (timeSinceFailure > this.circuitBreaker.timeout) {
        this.circuitBreaker.state = 'half-open';
        this.circuitBreaker.failures = 0;
      }
    }

    return {
      state: this.circuitBreaker.state,
      failures: this.circuitBreaker.failures,
      lastFailureTime: this.circuitBreaker.lastFailureTime,
    };
  }

  /**
   * Execute HTTP request with retry logic
   */
  async request(path: string, options: RequestOptions = {}): Promise<any> {
    // Check circuit breaker
    if (this.circuitBreaker.state === 'open') {
      throw new ApiError(503, 'Service temporarily unavailable - circuit breaker is open');
    }

    const url = `${this.baseUrl}${path}`;
    const method = options.method || 'GET';
    const maxRetries = 3;

    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.executeRequest(url, method, options);
        
        // Reset circuit breaker on success
        this.circuitBreaker.failures = 0;
        this.circuitBreaker.state = 'closed';

        return response;
      } catch (error) {
        lastError = error;

        // Update circuit breaker on failure
        if (error instanceof ApiError && error.status >= 500) {
          this.circuitBreaker.failures++;
          this.circuitBreaker.lastFailureTime = Date.now();

          if (this.circuitBreaker.failures >= this.circuitBreaker.threshold) {
            this.circuitBreaker.state = 'open';
          }
        }

        // Don't retry on 4xx errors (except 429)
        if (error instanceof ApiError && error.status >= 400 && error.status !== 429) {
          throw error;
        }

        // Exponential backoff
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new ApiError(500, 'Failed after retries');
  }

  /**
   * Execute single HTTP request
   */
  private async executeRequest(
    url: string,
    method: string,
    options: RequestOptions
  ): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
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
        throw new ApiError(response.status, data.message || response.statusText, data);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof TypeError) {
        throw new ApiError(0, 'Network error: ' + error.message);
      }

      throw new ApiError(500, 'Unknown error: ' + String(error));
    }
  }
}
