/**
 * IVSLearning Authentication Flow
 * Handles OAuth login, token management, and API credential fetching
 */

const BACKEND_URL = 'https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app';

/**
 * Initiate Google login flow
 * Redirects user to backend OAuth endpoint
 */
async function initiateGoogleLogin() {
  try {
    console.log('[Auth] Initiating Google login...');
    
    const response = await fetch(`${BACKEND_URL}/auth/google`, {
      credentials: 'include', // Send cookies
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.authUrl) {
      throw new Error('No authUrl in response');
    }

    console.log('[Auth] Redirecting to Google OAuth');
    window.location.href = data.authUrl;
  } catch (error) {
    console.error('[Auth] Login failed:', error);
    showError('Failed to initiate login. Please try again.');
  }
}

/**
 * Handle OAuth callback after user approves
 * Stores token and fetches API credentials
 */
function handleOAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const userStr = params.get('user');
  const error = params.get('error');

  if (error) {
    console.error('[Auth] OAuth error:', error);
    showError(`Authentication failed: ${error}`);
    return;
  }

  if (token && userStr) {
    try {
      console.log('[Auth] Received OAuth token and user info');
      
      // Store credentials
      localStorage.setItem('apiToken', token);
      localStorage.setItem('user', userStr);
      
      // Fetch API credentials from backend
      fetchAPICredentials(token);
    } catch (error) {
      console.error('[Auth] Failed to handle callback:', error);
      showError('Failed to process login. Please try again.');
    }
  }
}

/**
 * Fetch API credentials from backend
 * These credentials are used to call the Learning API
 */
async function fetchAPICredentials(token) {
  try {
    console.log('[Auth] Fetching API credentials...');
    
    const response = await fetch(
      `${BACKEND_URL}/credentials/api-credentials`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch credentials: ${response.status}`);
    }

    const credentials = await response.json();

    // Validate credentials
    if (!credentials.apiKey || !credentials.bearerToken) {
      throw new Error('Invalid credentials response');
    }

    // Store in session (cleared on browser close)
    sessionStorage.setItem('apiKey', credentials.apiKey);
    sessionStorage.setItem('bearerToken', credentials.bearerToken);

    // Update global API config
    if (window.IVS_API_CONFIG) {
      window.IVS_API_CONFIG.API_KEY = credentials.apiKey;
      window.IVS_API_CONFIG.BEARER_TOKEN = credentials.bearerToken;
      if (credentials.apiBaseUrl) {
        window.IVS_API_CONFIG.BASE_URL = credentials.apiBaseUrl;
      }
    }

    console.log('[Auth] API credentials stored successfully');

    // Redirect to dashboard
    window.location.href = '/my-learning.html';
  } catch (error) {
    console.error('[Auth] Failed to fetch API credentials:', error);
    showError('Failed to fetch API credentials. Please try again.');
    
    // Clear stored token on error
    localStorage.removeItem('apiToken');
    localStorage.removeItem('user');
  }
}

/**
 * Logout user
 * Clears all stored credentials and redirects to auth page
 */
function logout() {
  try {
    console.log('[Auth] Logging out...');

    // Clear localStorage
    localStorage.removeItem('apiToken');
    localStorage.removeItem('user');

    // Clear sessionStorage
    sessionStorage.removeItem('apiKey');
    sessionStorage.removeItem('bearerToken');

    // Clear API config
    if (window.IVS_API_CONFIG) {
      window.IVS_API_CONFIG.API_KEY = '';
      window.IVS_API_CONFIG.BEARER_TOKEN = '';
    }

    // Notify backend (optional)
    fetch(`${BACKEND_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    }).catch(e => console.warn('[Auth] Logout notification failed:', e));

    console.log('[Auth] Logged out successfully');
    
    // Redirect to auth page
    window.location.href = '/auth.html';
  } catch (error) {
    console.error('[Auth] Logout error:', error);
    window.location.href = '/auth.html';
  }
}

/**
 * Check if user is logged in
 * @returns {boolean} True if API token exists
 */
function isLoggedIn() {
  const token = localStorage.getItem('apiToken');
  return !!token;
}

/**
 * Get current logged-in user
 * @returns {Object|null} User object or null if not logged in
 */
function getCurrentUser() {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('[Auth] Failed to parse user data:', error);
    return null;
  }
}

/**
 * Get API token
 * @returns {string|null} Bearer token or null if not logged in
 */
function getAPIToken() {
  return localStorage.getItem('apiToken');
}

/**
 * Get API credentials for Learning API calls
 * @returns {Object} Object with apiKey and bearerToken
 */
function getAPICredentials() {
  return {
    apiKey: sessionStorage.getItem('apiKey') || '',
    bearerToken: sessionStorage.getItem('bearerToken') || getAPIToken() || ''
  };
}

/**
 * Protect page - redirect to auth if not logged in
 * Call this at the beginning of protected pages
 */
function protectPage() {
  if (!isLoggedIn() && !window.location.pathname.includes('auth')) {
    console.log('[Auth] User not logged in, redirecting to auth page');
    window.location.href = '/auth.html';
  }
}

/**
 * Display error message to user
 * @param {string} message Error message to display
 */
function showError(message) {
  // Try to show in element if exists
  const errorEl = document.getElementById('error-message');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  } else {
    // Fallback to alert
    alert(message);
  }
}

/**
 * Display user profile in header/navbar
 * Looks for elements with id: user-name, user-email, user-avatar
 */
function displayUserProfile() {
  const user = getCurrentUser();
  
  if (!user) {
    console.log('[Auth] No user profile to display');
    return;
  }

  try {
    // Display name
    const nameEl = document.getElementById('user-name');
    if (nameEl) {
      nameEl.textContent = user.name || user.email;
    }

    // Display email
    const emailEl = document.getElementById('user-email');
    if (emailEl) {
      emailEl.textContent = user.email;
    }

    // Display avatar
    const avatarEl = document.getElementById('user-avatar');
    if (avatarEl && user.picture) {
      avatarEl.src = user.picture;
      avatarEl.style.display = 'block';
    }

    console.log('[Auth] User profile displayed:', user.email);
  } catch (error) {
    console.error('[Auth] Failed to display user profile:', error);
  }
}

/**
 * Refresh API credentials if expired
 * Should be called periodically or before making API calls
 */
async function refreshAPICredentials() {
  const token = getAPIToken();
  
  if (!token) {
    console.warn('[Auth] No token found for refresh');
    return false;
  }

  try {
    console.log('[Auth] Refreshing API credentials...');
    await fetchAPICredentials(token);
    return true;
  } catch (error) {
    console.error('[Auth] Failed to refresh credentials:', error);
    return false;
  }
}

/**
 * Auto-refresh credentials every 6 hours
 * Call this on page load
 */
function setupAutoRefresh() {
  const refreshInterval = 6 * 60 * 60 * 1000; // 6 hours
  
  setInterval(() => {
    if (isLoggedIn()) {
      refreshAPICredentials().catch(e => 
        console.error('[Auth] Auto-refresh failed:', e)
      );
    }
  }, refreshInterval);

  console.log('[Auth] Auto-refresh scheduled every 6 hours');
}

// ============================================
// AUTO-EXECUTION ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('[Auth] Page loaded, initializing auth flow...');

  // Handle OAuth callback if we have token in URL
  if (window.location.search.includes('token=')) {
    console.log('[Auth] OAuth callback detected');
    handleOAuthCallback();
  }

  // Handle logout redirect
  if (window.location.search.includes('logout=true')) {
    console.log('[Auth] Logout requested');
    logout();
  }

  // Display user profile if logged in
  if (isLoggedIn()) {
    displayUserProfile();
    setupAutoRefresh();
  }

  console.log('[Auth] Auth flow initialization complete');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initiateGoogleLogin,
    handleOAuthCallback,
    fetchAPICredentials,
    logout,
    isLoggedIn,
    getCurrentUser,
    getAPIToken,
    getAPICredentials,
    protectPage,
    displayUserProfile,
    refreshAPICredentials,
    setupAutoRefresh
  };
}
