/**
 * 🎯 Complete Example - Integrating Backend Service vào React App
 * 
 * Sử dụng: Copy đoạn code này vào project React/Next.js của bạn
 */

import React, { useEffect, useState, useCallback } from 'react';
import { AdvancedBackendService, ApiError } from '@/lib';
import type { Post } from '@/lib/types';

// 1️⃣ Initialize API service
const api = new AdvancedBackendService({
  baseUrl: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000',
  rateLimitConfig: {
    maxRequests: 100,
    windowMs: 60000,
  },
  cacheConfig: {
    enableCaching: true,
    defaultTtl: 5 * 60 * 1000,
  },
});

// 2️⃣ Custom Hook - Fetch Posts
export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to load posts (${err.status}): ${err.message}`);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}

// 3️⃣ Custom Hook - Fetch User Profile
export function useUserProfile(userId: string | null) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      return;
    }

    setLoading(true);
    setError(null);

    api.getUserProfile(userId)
      .then(profile => {
        setUser(profile);
      })
      .catch(err => {
        const message = err instanceof Error ? err.message : 'Failed to load profile';
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  return { user, loading, error };
}

// 4️⃣ Set Auth Token after Login
export function setupAuth(token: string | null) {
  if (token) {
    console.log('[Auth] Setting token...');
    api.setAuthToken(token);
  } else {
    console.log('[Auth] Clearing token...');
    api.setAuthToken(null);
    api.clearCache(); // Clear cached data when logging out
  }
}

// 5️⃣ React Component Example - Posts List
export function PostsList() {
  const { posts, loading, error, refetch } = usePosts();
  const [limiterStatus, setLimiterStatus] = useState<any>(null);

  useEffect(() => {
    // Show rate limiter status
    const status = api.getRateLimiterStatus('/posts');
    setLimiterStatus(status);
  }, [posts]);

  if (loading) {
    return <div className="p-4">Loading posts...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>Error: {error}</p>
        <button onClick={refetch} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Posts ({posts.length})</h2>
        <div className="text-sm text-gray-600">
          Rate limit: {limiterStatus?.remaining ?? '?'}/100 remaining
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet</p>
      ) : (
        <ul className="space-y-4">
          {posts.map(post => (
            <li key={post.id} className="p-4 border rounded">
              <div className="flex items-center gap-3 mb-2">
                <img src={post.authorAvatarUrl} alt="" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold">{post.authorName}</p>
                  <p className="text-sm text-gray-500">{post.clientSource}</p>
                </div>
              </div>
              <p className="text-gray-700">{post.content}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(post.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}

      <button onClick={refetch} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Refresh
      </button>
    </div>
  );
}

// 6️⃣ React Component Example - User Profile
export function UserProfile({ userId }: { userId: string | null }) {
  const { user, loading, error } = useUserProfile(userId);

  if (!userId) {
    return <div className="p-4">No user selected</div>;
  }

  if (loading) {
    return <div className="p-4">Loading user...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  if (!user) {
    return <div className="p-4 text-gray-500">User not found</div>;
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="text-xl font-bold mb-4">{user.displayName || 'Unknown User'}</h3>
      <div className="space-y-2">
        <p>
          <strong>Email:</strong> {user.email || 'N/A'}
        </p>
        <p>
          <strong>Role:</strong> {user.role || 'N/A'}
        </p>
        <p>
          <strong>Created:</strong> {new Date(user.metadata.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Last Login:</strong> {new Date(user.metadata.lastSignInAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

// 7️⃣ Monitor API Health & Stats
export function ApiMonitor() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        circuitBreaker: api.getCircuitBreakerStatus(),
        cache: api.getCacheStats(),
        rateLimiter: api.getRateLimiterStatus(),
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  return (
    <div className="p-4 bg-gray-100 rounded text-sm">
      <h4 className="font-bold mb-2">🔧 API Monitor</h4>
      <div>
        <p>🔌 Circuit Breaker: {stats.circuitBreaker.state}</p>
        <p>💾 Cache: {stats.cache.size}/{stats.cache.maxSize} entries</p>
        <p>⏱️ Rate Limiter: {stats.rateLimiter.remaining} tokens</p>
      </div>
    </div>
  );
}

// 8️⃣ Main App Component
export function App() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Example: Firebase auth listener
    // firebase.auth().onAuthStateChanged(async user => {
    //   if (user) {
    //     const token = await user.getIdToken();
    //     setupAuth(token);
    //     setUserId(user.uid);
    //   } else {
    //     setupAuth(null);
    //     setUserId(null);
    //   }
    // });

    // For demo purposes
    setupAuth('demo-token-123');
    setUserId('user-123');
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">📚 IVS Backend Integration Demo</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2">
          <PostsList />
        </div>
        <div>
          <UserProfile userId={userId} />
        </div>
      </div>

      <ApiMonitor />
    </div>
  );
}

export default App;
