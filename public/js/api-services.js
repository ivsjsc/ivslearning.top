/**
 * IVSLearning API Services
 * High-level API operations for courses, users, analytics, etc.
 */

import { apiClient } from './api-client.js';
import { IVS_API_CONFIG } from './api-config.js';

/**
 * Courses API Service
 */
export const coursesService = {
    /**
     * Get all courses with filters
     */
    async getAllCourses(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        const endpoint = `${IVS_API_CONFIG.ENDPOINTS.COURSES}${params ? '?' + params : ''}`;
        return apiClient.get(endpoint);
    },

    /**
     * Get course details
     */
    async getCourseDetail(courseId) {
        return apiClient.get(IVS_API_CONFIG.ENDPOINTS.COURSE_DETAIL(courseId));
    },

    /**
     * Get course modules
     */
    async getCourseModules(courseId) {
        return apiClient.get(IVS_API_CONFIG.ENDPOINTS.COURSE_MODULES(courseId));
    },

    /**
     * Get course lessons
     */
    async getCourseLessons(courseId, moduleId) {
        return apiClient.get(IVS_API_CONFIG.ENDPOINTS.COURSE_LESSONS(courseId, moduleId));
    },

    /**
     * Enroll in course
     */
    async enrollCourse(courseId) {
        return apiClient.post(`${IVS_API_CONFIG.ENDPOINTS.COURSES}/${courseId}/enroll`, {});
    },

    /**
     * Search courses
     */
    async searchCourses(query, filters = {}) {
        return apiClient.get(IVS_API_CONFIG.ENDPOINTS.SEARCH, {
            body: { query, ...filters },
        });
    },
};

/**
 * Learning Paths API Service
 */
export const learningPathsService = {
    /**
     * Get all learning paths
     */
    async getAllPaths() {
        return apiClient.get(IVS_API_CONFIG.ENDPOINTS.LEARNING_PATHS);
    },

    /**
     * Get learning path details
     */
    async getPathDetail(pathId) {
        return apiClient.get(IVS_API_CONFIG.ENDPOINTS.LEARNING_PATH_DETAIL(pathId));
    },

    /**
     * Start learning path
     */
    async startPath(pathId) {
        return apiClient.post(`${IVS_API_CONFIG.ENDPOINTS.LEARNING_PATHS}/${pathId}/start`, {});
    },
};

/**
 * User Progress API Service
 */
export const progressService = {
    /**
     * Get user progress overview
     */
    async getUserProgress() {
        return apiClient.get(IVS_API_CONFIG.ENDPOINTS.USER_PROGRESS);
    },

    /**
     * Get progress for specific course
     */
    async getCourseProgress(courseId) {
        return apiClient.get(IVS_API_CONFIG.ENDPOINTS.COURSE_PROGRESS(courseId));
    },

    /**
     * Update lesson progress
     */
    async updateLessonProgress(courseId, moduleId, lessonId, data) {
        return apiClient.put(
            `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/progress`,
            data
        );
    },

    /**
     * Mark lesson as complete
     */
    async completeLesson(courseId, moduleId, lessonId) {
        return apiClient.post(
            `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/complete`,
            {}
        );
    },
};

/**
 * Analytics API Service
 */
export const analyticsService = {
    /**
     * Get user statistics
     */
    async getUserStats() {
        return apiClient.get(IVS_API_CONFIG.ENDPOINTS.USER_STATS);
    },

    /**
     * Get learning analytics
     */
    async getLearningAnalytics(timeRange = 'month') {
        return apiClient.get(`${IVS_API_CONFIG.ENDPOINTS.ANALYTICS}?range=${timeRange}`);
    },

    /**
     * Track event
     */
    async trackEvent(eventName, eventData) {
        return apiClient.post('/analytics/events', {
            event: eventName,
            data: eventData,
            timestamp: new Date().toISOString(),
        });
    },
};

/**
 * Applications API Service
 */
export const applicationsService = {
    /**
     * Get all applications
     */
    async getAllApplications() {
        return apiClient.get(IVS_API_CONFIG.ENDPOINTS.APPLICATIONS);
    },

    /**
     * Get application details
     */
    async getAppDetail(appId) {
        return apiClient.get(IVS_API_CONFIG.ENDPOINTS.APP_DETAIL(appId));
    },

    /**
     * Get AIVY (AI Assistant) status
     */
    async getAIVYStatus() {
        return apiClient.get('/applications/aivy/status');
    },

    /**
     * Query AIVY (AI Assistant)
     */
    async queryAIVY(question, context = {}) {
        return apiClient.post('/applications/aivy/query', {
            question,
            context,
        });
    },
};

/**
 * User Profile API Service
 */
export const userService = {
    /**
     * Get user profile
     */
    async getProfile() {
        return apiClient.get(IVS_API_CONFIG.ENDPOINTS.PROFILE);
    },

    /**
     * Update user profile
     */
    async updateProfile(data) {
        return apiClient.put(IVS_API_CONFIG.ENDPOINTS.PROFILE_UPDATE, data);
    },

    /**
     * Get user certificates
     */
    async getCertificates() {
        return apiClient.get(IVS_API_CONFIG.ENDPOINTS.CERTIFICATES);
    },

    /**
     * Download certificate
     */
    async downloadCertificate(certificateId) {
        return apiClient.get(
            IVS_API_CONFIG.ENDPOINTS.CERTIFICATE_DOWNLOAD(certificateId),
            { cache: false }
        );
    },
};

/**
 * Authentication API Service
 */
export const authService = {
    /**
     * Login
     */
    async login(email, password) {
        return apiClient.post(IVS_API_CONFIG.ENDPOINTS.LOGIN, {
            email,
            password,
        });
    },

    /**
     * Register
     */
    async register(data) {
        return apiClient.post(IVS_API_CONFIG.ENDPOINTS.REGISTER, data);
    },

    /**
     * Logout
     */
    async logout() {
        return apiClient.post(IVS_API_CONFIG.ENDPOINTS.LOGOUT, {});
    },

    /**
     * Refresh token
     */
    async refreshToken() {
        return apiClient.post(IVS_API_CONFIG.ENDPOINTS.REFRESH_TOKEN, {});
    },
};

/**
 * Export all services as namespace
 */
export const apiServices = {
    courses: coursesService,
    learningPaths: learningPathsService,
    progress: progressService,
    analytics: analyticsService,
    applications: applicationsService,
    user: userService,
    auth: authService,
};

export default apiServices;

// Export to global for non-module contexts
if (typeof window !== 'undefined') {
    window.apiServices = apiServices;
}
