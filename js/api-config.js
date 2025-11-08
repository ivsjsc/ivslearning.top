/**
 * IVSLearning API Configuration
 * Centralized API endpoints, keys, and credentials for the learning platform
 */

export const IVS_API_CONFIG = {
    // ========== API Base Configuration ==========
    BASE_URL: process.env.VITE_IVS_API_URL || "https://api.ivslearning.top",
    VERSION: "v1",
    
    // ========== Authentication ==========
    AUTH: {
        API_KEY: process.env.VITE_IVS_API_KEY || "",
        SECRET_KEY: process.env.VITE_IVS_SECRET_KEY || "",
        BEARER_TOKEN: process.env.VITE_IVS_BEARER_TOKEN || "",
    },
    
    // ========== Endpoints ==========
    ENDPOINTS: {
        // Courses
        COURSES: "/courses",
        COURSE_DETAIL: (id) => `/courses/${id}`,
        COURSE_MODULES: (id) => `/courses/${id}/modules`,
        COURSE_LESSONS: (id, moduleId) => `/courses/${id}/modules/${moduleId}/lessons`,
        
        // Learning Paths
        LEARNING_PATHS: "/learning-paths",
        LEARNING_PATH_DETAIL: (id) => `/learning-paths/${id}`,
        
        // User Progress
        USER_PROGRESS: "/user/progress",
        COURSE_PROGRESS: (courseId) => `/user/progress/courses/${courseId}`,
        
        // Applications
        APPLICATIONS: "/applications",
        APP_DETAIL: (id) => `/applications/${id}`,
        
        // Analytics
        ANALYTICS: "/analytics",
        USER_STATS: "/analytics/user-stats",
        
        // Search
        SEARCH: "/search",
        
        // Authentication
        LOGIN: "/auth/login",
        LOGOUT: "/auth/logout",
        REGISTER: "/auth/register",
        REFRESH_TOKEN: "/auth/refresh",
        
        // User Profile
        PROFILE: "/user/profile",
        PROFILE_UPDATE: "/user/profile/update",
        
        // Certificates
        CERTIFICATES: "/certificates",
        CERTIFICATE_DOWNLOAD: (id) => `/certificates/${id}/download`,
    },
    
    // ========== Request Headers ==========
    DEFAULT_HEADERS: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    
    // ========== Timeouts & Retries ==========
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
    
    // ========== Cache Configuration ==========
    CACHE: {
        ENABLED: true,
        TTL: 5 * 60 * 1000, // 5 minutes
        MAX_SIZE: 50, // MB
    },
    
    // ========== Rate Limiting ==========
    RATE_LIMIT: {
        ENABLED: true,
        MAX_REQUESTS: 100,
        TIME_WINDOW: 60000, // 1 minute
    },
};

/**
 * Get full API URL
 * @param {string} endpoint - API endpoint path
 * @returns {string} Full URL
 */
export function getApiUrl(endpoint) {
    return `${IVS_API_CONFIG.BASE_URL}/${IVS_API_CONFIG.VERSION}${endpoint}`;
}

/**
 * Get authorization header
 * @returns {object} Authorization header
 */
export function getAuthHeader() {
    return {
        "Authorization": `Bearer ${IVS_API_CONFIG.AUTH.BEARER_TOKEN}`,
        "X-API-Key": IVS_API_CONFIG.AUTH.API_KEY,
    };
}

/**
 * Merge headers with authorization
 * @returns {object} Merged headers
 */
export function getHeaders() {
    return {
        ...IVS_API_CONFIG.DEFAULT_HEADERS,
        ...getAuthHeader(),
    };
}

/**
 * Export as global for non-module contexts
 */
if (typeof window !== 'undefined') {
    window.IVS_API_CONFIG = IVS_API_CONFIG;
    window.getApiUrl = getApiUrl;
    window.getHeaders = getHeaders;
}
