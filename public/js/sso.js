/**
 * SSO Helper Module for IVS Learning Hub
 * 
 * This module handles Single Sign-On (SSO) token exchange between
 * ivslearning.top (main hub) and sub-applications (ivseng.web.app, etc.)
 */

const SSO_CONFIG = {
    // Cloud Functions URL
    functionsUrl: 'https://us-central1-ivs-159a7.cloudfunctions.net',
    
    // Sub-applications configuration
    subApps: {
        'english': {
            name: 'IVS English',
            // Support multiple domains: main site and optional alias like ivslearning.io.vn
            domains: ['https://ivseng.web.app', 'https://ivslearning.io.vn'],
            tokenParam: 'sso_token'
        },
        'testing': {
            name: 'Testing & Placement',
            domain: 'https://testplacement.web.app',
            tokenParam: 'sso_token'
        },
        'kinderlink': {
            name: 'IVS Kinderlink',
            domain: 'https://ivs-7221b.web.app',
            tokenParam: 'sso_token'
        }
    }
};

/**
 * Generate SSO token for a user to access sub-applications
 * 
 * @param {string} currentUserToken - Current user's Firebase ID token
 * @param {Object} userData - User data { uid, email, role, organizationId }
 * @returns {Promise<string>} Custom token for SSO
 */
export async function generateSSOToken(currentUserToken, userData) {
    try {
        const response = await fetch(`${SSO_CONFIG.functionsUrl}/createCustomToken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUserToken}`
            },
            body: JSON.stringify({
                email: userData.email,
                customClaims: {
                    role: userData.role || 'student',
                    organizationId: userData.organizationId,
                    sourceApp: 'ivslearning.top',
                    issuedAt: new Date().getTime()
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to generate SSO token: ${response.statusText}`);
        }

        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error('Error generating SSO token:', error);
        throw error;
    }
}

/**
 * Get SSO redirect URL for a sub-application
 * 
 * @param {string} appId - Application ID (e.g., 'english', 'testing')
 * @param {string} ssoToken - SSO token
 * @returns {string} Redirect URL with token
 */
export function getSSORedirectUrl(appId, ssoToken) {
    const app = SSO_CONFIG.subApps[appId];
    if (!app) {
        throw new Error(`Unknown app: ${appId}`);
    }
    // Allow runtime override for domain mapping (useful when ELearners moves to a new hostname)
    const overrideDomain = (window.AppDomains && window.AppDomains[appId]) || (appId === 'english' && window.ELearnersUrl) || null;
    const domain = overrideDomain || (Array.isArray(app.domains) ? app.domains[0] : app.domain);
    const url = new URL(domain);
    url.searchParams.append(app.tokenParam, ssoToken);
    return url.toString();
}

/**
 * Redirect user to sub-application with SSO token
 * 
 * @param {string} appId - Application ID
 * @param {string} currentUserToken - Current user's Firebase ID token
 * @param {Object} userData - User data
 */
export async function redirectToApp(appId, currentUserToken, userData) {
    try {
        const ssoToken = await generateSSOToken(currentUserToken, userData);
        const redirectUrl = getSSORedirectUrl(appId, ssoToken);
        window.location.href = redirectUrl;
    } catch (error) {
        console.error('Error redirecting to app:', error);
        // Fallback: redirect without SSO token
        const app = SSO_CONFIG.subApps[appId];
        if (app) {
            window.location.href = app.domain;
        }
    }
}

/**
 * Handle SSO token from URL parameter (for sub-applications)
 * 
 * @returns {Object} { token: string, userData: Object }
 */
export function handleIncomingSSOToken() {
    const params = new URLSearchParams(window.location.search);
    const ssoToken = params.get('sso_token');

    if (!ssoToken) {
        return null;
    }

    try {
        // Decode token to extract user data
        const parts = ssoToken.split('.');
        const payload = JSON.parse(atob(parts[1]));

        return {
            token: ssoToken,
            userData: {
                uid: payload.uid,
                email: payload.email,
                role: payload.role,
                organizationId: payload.organizationId,
                sourceApp: payload.sourceApp
            }
        };
    } catch (error) {
        console.error('Error parsing SSO token:', error);
        return null;
    }
}

/**
 * Sign in user with SSO token (for sub-applications)
 * 
 * @param {Object} auth - Firebase Auth instance
 * @param {string} ssoToken - SSO token
 * @returns {Promise<Object>} User credential
 */
export async function signInWithSSO(auth, ssoToken) {
    try {
        // In Firebase v9+, use signInWithCustomToken
        const { signInWithCustomToken } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js');
        const userCredential = await signInWithCustomToken(auth, ssoToken);
        return userCredential;
    } catch (error) {
        console.error('Error signing in with SSO:', error);
        throw error;
    }
}

export default {
    generateSSOToken,
    getSSORedirectUrl,
    redirectToApp,
    handleIncomingSSOToken,
    signInWithSSO,
    config: SSO_CONFIG
};