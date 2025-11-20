/**
 * auth-utils.js
 * Central helper functions for authentication flows: update user doc and signOut
 */
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';

export async function setUserDoc(user, fields = {}) {
    try {
        if (!user || !user.uid) return null;
        let db = window.firebaseDB;
        if (!db && window.firebaseApp) db = getFirestore(window.firebaseApp);
        if (!db) return null;
        const userDocRef = doc(db, 'users', user.uid);
        const payload = Object.assign({ email: user.email, fullName: user.displayName || '', lastLoginAt: new Date().toISOString() }, fields);
        await setDoc(userDocRef, payload, { merge: true });
        return payload;
    } catch (err) {
        console.warn('auth-utils: setUserDoc failed', err);
        return null;
    }
}

export async function safeSignOut(auth) {
    try {
        // prefer modular signOut
        const mod = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js');
        if (mod && mod.signOut && auth) {
            await mod.signOut(auth);
            try { if (window.BACKEND_URL) await fetch(`${window.BACKEND_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' }); } catch (e) { /* ignore */ }
            return true;
        }
    } catch (e) {
        try {
            if (auth && typeof auth.signOut === 'function') await auth.signOut();
            try { if (window.BACKEND_URL) await fetch(`${window.BACKEND_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' }); } catch (e) { /* ignore */ }
            return true;
        } catch (err) {
            console.error('auth-utils: safeSignOut failed', err);
            return false;
        }
    }
}

// Expose for non-module usage
window.authUtils = window.authUtils || {};
window.authUtils.setUserDoc = setUserDoc;
window.authUtils.safeSignOut = safeSignOut;

export default { setUserDoc, safeSignOut };
