/**
 * Centralized Firebase Configuration
 * This file serves as the single source of truth for Firebase configuration
 * Used by all HTML pages to avoid duplication and maintain consistency
 */

export const firebaseConfig = {
    apiKey: "AIzaSyAOxCF0PhA6s3DtvETux-kXGTXRTlpL4vs",
    authDomain: "ivs-159a7.firebaseapp.com",
    projectId: "ivs-159a7",
    storageBucket: "ivs-159a7.firebasestorage.app",
    messagingSenderId: "452959273724",
    appId: "1:452959273724:web:17a23e383fb1807c040d79",
    measurementId: "G-L4KG7BCTJE"
};

/**
 * Export as global for non-module script contexts
 * This ensures backward compatibility with existing scripts
 */
window.firebaseConfig = firebaseConfig;
