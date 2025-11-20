const functions = require('firebase-functions');
const admin = require('firebase-admin');
// Configure CORS: allow explicit origins defined in env var or a safe default set
const cors = require('cors')({
    origin: function (origin, callback) {
        const allowed = (process.env.CORS_ORIGINS || 'https://ivslearning.top,https://www.ivslearning.top,http://localhost:3000,http://localhost:5173')
            .split(',')
            .map(u => u.trim());

        // Allow requests with no origin (e.g., curl, server-to-server) or from allowed list
        if (!origin || allowed.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
});
const express = require('express');

// Initialize Firebase Admin SDK
// Initialize Firebase Admin SDK (guard if already initialized during testing or emulators)
if (!admin.apps || !admin.apps.length) {
    admin.initializeApp();
}

/**
 * Cloud Function: createCustomToken
 * Purpose: Create a custom Firebase auth token for SSO across different domains
 * 
 * Request body:
 * {
 *   "uid": "user-unique-id",
 *   "email": "user@example.com",
 *   "customClaims": {
 *     "role": "student",
 *     "organizationId": "org-123"
 *   }
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ...",
 *   "expires": 3600
 * }
 */
// Helper: Extract token from Authorization header (supports case-insensitive Bearer)
function extractAuthToken(req) {
    const header = req.headers?.authorization || req.headers?.Authorization || '';
    return header.replace(/Bearer\s+/i, '').trim();
}

// Helper: Verify ID token and return decoded token or throw
async function verifyIdTokenOrThrow(idToken) {
    if (!idToken) throw new Error('No ID token provided');
    return await admin.auth().verifyIdToken(idToken);
}

// Create Custom Token - allows a user (or an admin creating for others) to generate
// a Firebase custom token which can be exchanged on the client for an ID token.
exports.createCustomToken = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            // Only allow POST requests
            if (req.method !== 'POST') {
                return res.status(405).json({ error: 'Method not allowed' });
            }

            // Validate the calling user (required)
            const token = extractAuthToken(req);
            if (!token) {
                return res.status(401).json({ error: 'Unauthorized: No token provided' });
            }

            // Verify the ID token (this is the requester's ID token)
            const decodedToken = await verifyIdTokenOrThrow(token);
            let targetUid = decodedToken.uid; // default: create custom token for the calling user

            // Get request body
            const { email, customClaims = {}, uid: requestedUid } = req.body;

            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }

            // If the requester is admin and provided a requestedUid, allow creating token for that user
            if (requestedUid && (decodedToken.admin || decodedToken.claims?.admin)) {
                targetUid = requestedUid;
            }

            // Create custom token with additional claims
            const customToken = await admin.auth().createCustomToken(targetUid, {
                ...customClaims,
                email: email
            });

            return res.json({
                success: true,
                token: customToken,
                expires: 3600 // Token valid for 1 hour
            });

        } catch (error) {
            console.error('Error creating custom token:', error?.message || error);
            return res.status(500).json({ 
                error: 'Failed to create custom token'
            });
        }
    });
});

/**
 * Cloud Function: validateCustomToken
 * Purpose: Validate and exchange custom token for ID token
 * Used by sub-applications to verify token authenticity
 * 
 * Request body:
 * {
 *   "customToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ..."
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "uid": "user-unique-id",
 *   "email": "user@example.com",
 *   "claims": { ... }
 * }
 */
// Validate ID Token (server-side verification of ID token issued after signInWithCustomToken)
// NOTE: Custom tokens are intended to be exchanged by the client for ID tokens. The server
// should validate ID tokens (not custom tokens) using verifyIdToken.
exports.validateIdToken = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            if (req.method !== 'POST') {
                return res.status(405).json({ error: 'Method not allowed' });
            }

            const { idToken } = req.body;
            if (!idToken) {
                return res.status(400).json({ error: 'idToken is required (an ID token issued by Firebase Auth)' });
            }

            // Verify the ID token using Firebase Auth
            const decodedToken = await verifyIdTokenOrThrow(idToken);

            return res.json({
                success: true,
                uid: decodedToken.uid,
                email: decodedToken.email,
                claims: decodedToken
            });

        } catch (error) {
            console.error('Error validating ID token:', error?.message || error);
            return res.status(401).json({ 
                error: 'Invalid or expired token'
            });
        }
    });
});

// Backwards compatibility: export a validateCustomToken wrapper (deprecated)
exports.validateCustomToken = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        console.warn('Deprecated endpoint validateCustomToken called: please use validateIdToken (ID token) instead.');
        // If client passes customToken mistakenly, return helpful guidance
        if (req.body?.customToken && !req.body?.idToken) {
            return res.status(400).json({
                error: 'customToken is not a valid ID token on the server. Exchange the custom token for an ID token on the client using signInWithCustomToken and then call validateIdToken with the idToken.'
            });
        }
        // Delegate to validateIdToken
        return exports.validateIdToken(req, res);
    });
});

/**
 * Cloud Function: getUserProfile
 * Purpose: Get user profile information with custom claims
 * 
 * Query: ?uid=user-unique-id
 * 
 * Response:
 * {
 *   "uid": "user-unique-id",
 *   "email": "user@example.com",
 *   "displayName": "User Name",
 *   "customClaims": { ... }
 * }
 */
exports.getUserProfile = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            const uid = req.query.uid || req.body.uid;
            if (!uid) {
                return res.status(400).json({ error: 'UID is required' });
            }

            // Verify the calling user
            const token = extractAuthToken(req);
            if (!token) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            await verifyIdTokenOrThrow(token);

            // Get user record
            const userRecord = await admin.auth().getUser(uid);

            return res.json({
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                photoURL: userRecord.photoURL,
                customClaims: userRecord.customClaims || {}
            });

        } catch (error) {
            console.error('Error getting user profile:', error?.message || error);
            return res.status(500).json({ 
                error: 'Failed to get user profile'
            });
        }
    });
});

/**
 * Cloud Function: updateUserClaims
 * Purpose: Update custom claims for a user (admin only)
 * 
 * Request body:
 * {
 *   "uid": "user-unique-id",
 *   "claims": {
 *     "role": "teacher",
 *     "organizationId": "org-123"
 *   }
 * }
 */
exports.updateUserClaims = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            if (req.method !== 'POST') {
                return res.status(405).json({ error: 'Method not allowed' });
            }

            // Verify the calling user is admin
            const token = extractAuthToken(req);
            if (!token) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const decodedToken = await verifyIdTokenOrThrow(token);
            if (!(decodedToken.admin || decodedToken.claims?.admin)) {
                return res.status(403).json({ error: 'Only admins can update user claims' });
            }

            const { uid, claims } = req.body;
            if (!uid || !claims) {
                return res.status(400).json({ error: 'UID and claims are required' });
            }

            // Update custom claims
            await admin.auth().setCustomUserClaims(uid, claims);

            return res.json({
                success: true,
                message: 'User claims updated successfully'
            });

        } catch (error) {
            console.error('Error updating user claims:', error?.message || error);
            return res.status(500).json({ 
                error: 'Failed to update user claims'
            });
        }
    });
});

/**
 * Cloud Function: grokApi
 * Purpose: Secure backend for Grok AI integration with Aivy
 */
const grokApiRouter = require('./grok-api');
exports.grokApi = functions.https.onRequest((req, res) => {
    const app = express();
    app.use('/api/grok', grokApiRouter);
    return app(req, res);
});

// ---- Basic API router for compatibility and local testing ----
const apiRouter = express.Router();

// Health check - returns environment info and firebase status (if available)
apiRouter.get('/health', async (req, res) => {
    try {
        // A simple DB check: list collections (if Firestore access is available)
        const checks = { api: 'ok' };
        try {
            await admin.firestore().listCollections();
            checks.firebase = 'ok';
        } catch (e) {
            checks.firebase = 'unavailable';
        }

        return res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            checks,
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (error) {
        console.error('Health check error', error);
        return res.status(500).json({ status: 'error', error: String(error) });
    }
});

// Models - return configured model list and which ones appear configured via env
apiRouter.get('/models', (req, res) => {
    const models = [
        { name: 'Gemini', provider: 'Google', status: process.env.GEMINI_API_KEY ? 'configured' : 'unconfigured' },
        { name: 'OpenAI', provider: 'OpenAI', status: process.env.OPENAI_API_KEY ? 'configured' : 'unconfigured' },
        { name: 'Claude', provider: 'Anthropic', status: process.env.CLAUDE_API_KEY ? 'configured' : 'unconfigured' },
        { name: 'Grok', provider: 'Grok', status: process.env.GROK_API_KEY ? 'configured' : 'unconfigured' },
        { name: 'DeepSeek', provider: 'DeepSeek', status: process.env.DEEPSEEK_API_KEY ? 'configured' : 'unconfigured' }
    ];
    res.json({ status: 'ok', configured_models: models.filter(m => m.status === 'configured').length, total_models: models.length, models });
});

// AI Router - lightweight router for a few tasks used by the frontend
apiRouter.post('/ai-router', express.json(), async (req, res) => {
    try {
        const { task, data } = req.body || {};

        if (!task) return res.status(400).json({ error: 'task is required' });

        switch (task) {
            case 'get_user_profile': {
                // use admin to fetch user if uid provided
                const uid = data?.userId || data?.uid;
                if (!uid) return res.status(400).json({ error: 'userId is required' });
                try {
                    const user = await admin.auth().getUser(uid);
                    return res.json({ status: 'ok', user: { uid: user.uid, email: user.email, displayName: user.displayName, customClaims: user.customClaims || {} } });
                } catch (e) {
                    return res.status(404).json({ error: 'User not found', details: e.message });
                }
            }
            case 'get_posts': {
                // Return a stubbed posts array for frontend tests
                return res.json({ status: 'ok', posts: [ { id: 'post-1', authorId: 'u1', authorName: 'IVS Admin', content: 'Test post', createdAt: new Date().toISOString() } ] });
            }
            case 'generate_content': {
                // Basic stub — in production this would call Gemini/OpenAI/Grok
                return res.json({ status: 'ok', quiz: [], dialogue: 'This is a generated sample response', modelUsed: 'stub' });
            }
            default:
                return res.status(501).json({ error: 'Task not implemented', task });
        }

    } catch (error) {
        console.error('AI router error', error);
        return res.status(500).json({ status: 'error', error: String(error) });
    }
});

// Minimal auth endpoints for the frontend; these do basic operations or proxy to Firebase Auth where appropriate.
apiRouter.post('/auth/login', express.json(), async (req, res) => {
    // NOTE: Email/password auth should be handled client-side with Firebase Client SDK.
    // Provide a dev fallback to create a custom token for a provided uid
    const { uid } = req.body || {};
    if (!uid) return res.status(400).json({ error: 'uid is required for dev login fallback' });
    try {
        const token = await admin.auth().createCustomToken(uid);
        return res.json({ status: 'ok', token });
    } catch (e) {
        console.error('dev login error', e);
        return res.status(500).json({ error: e.message });
    }
});

apiRouter.post('/auth/logout', (req, res) => {
    // Non-stateful logout placeholder (client should remove local token/cookies)
    return res.json({ status: 'ok', message: 'logged out' });
});

// Mount the API router so it can be used in functions
exports.api = functions.https.onRequest((req, res) => {
    const app = express();
    app.use('/api', apiRouter);
    return app(req, res);
});
