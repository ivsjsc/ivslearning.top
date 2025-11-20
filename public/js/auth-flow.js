/* auth-flow.js - High-level authentication helpers used by auth.html and other pages */
import { signInWithCustomToken } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

// Ensure BACKEND_URL exists
const BACKEND_URL = window.BACKEND_URL || 'https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app';

export async function initiateGoogleLogin() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/auth/google`, { credentials: 'include', headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error('Failed to get OAuth URL');
        const data = await res.json();
        if (data.authUrl) window.location.href = data.authUrl;
        else throw new Error('No authUrl returned');
    } catch (err) {
        console.error('initiateGoogleLogin error:', err);
        throw err;
    }
}

export async function handleOAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || params.get('sso_token') || params.get('auth_token');
    if (!token) return null;

    try {
        const auth = window.firebaseAuth;
        if (!auth) {
            // If firebaseAuth not ready, wait for 'firebase-ready' event
            await new Promise((resolve) => {
                function onReady() { resolve(); document.removeEventListener('firebase-ready', onReady); }
                document.addEventListener('firebase-ready', onReady);
            });
        }

        // Sign in with custom token via Firebase
        const { signInWithCustomToken: signInWithCustomTokenMod } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js');
        const uid = await signInWithCustomTokenMod(window.firebaseAuth, token);
        // Remove query params
        const url = new URL(window.location.href);
        url.searchParams.delete('token');
        window.history.replaceState({}, document.title, url.toString());
        return uid;
    } catch (err) {
        console.error('handleOAuthCallback error:', err);
        return null;
    }
}

export function isLoggedIn() {
    return !!(window.firebaseAuth && window.firebaseAuth.currentUser);
}

export function getCurrentUser() {
    return window.firebaseAuth && window.firebaseAuth.currentUser || null;
}

export default { initiateGoogleLogin, handleOAuthCallback, isLoggedIn, getCurrentUser };
