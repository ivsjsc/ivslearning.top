const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const express = require('express');

// Initialize Firebase Admin SDK
admin.initializeApp();

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
exports.createCustomToken = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            // Only allow POST requests
            if (req.method !== 'POST') {
                return res.status(405).json({ error: 'Method not allowed' });
            }

            // Validate the calling user (optional but recommended for security)
            const token = req.headers.authorization?.split('Bearer ')[1];
            if (!token) {
                return res.status(401).json({ error: 'Unauthorized: No token provided' });
            }

            // Verify the ID token
            const decodedToken = await admin.auth().verifyIdToken(token);
            const uid = decodedToken.uid;

            // Get request body
            const { email, customClaims = {} } = req.body;

            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }

            // Create custom token with additional claims
            const customToken = await admin.auth().createCustomToken(uid, {
                ...customClaims,
                email: email,
                issuedAt: new Date().getTime()
            });

            return res.json({
                success: true,
                token: customToken,
                expires: 3600 // Token valid for 1 hour
            });

        } catch (error) {
            console.error('Error creating custom token:', error);
            return res.status(500).json({ 
                error: 'Failed to create custom token',
                message: error.message 
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
exports.validateCustomToken = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            if (req.method !== 'POST') {
                return res.status(405).json({ error: 'Method not allowed' });
            }

            const { customToken } = req.body;
            if (!customToken) {
                return res.status(400).json({ error: 'Custom token is required' });
            }

            // Verify the custom token using Firebase Auth
            const decodedToken = await admin.auth().verifyIdToken(customToken);

            return res.json({
                success: true,
                uid: decodedToken.uid,
                email: decodedToken.email,
                claims: decodedToken
            });

        } catch (error) {
            console.error('Error validating custom token:', error);
            return res.status(401).json({ 
                error: 'Invalid or expired token',
                message: error.message 
            });
        }
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
            const token = req.headers.authorization?.split('Bearer ')[1];
            if (!token) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            await admin.auth().verifyIdToken(token);

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
            console.error('Error getting user profile:', error);
            return res.status(500).json({ 
                error: 'Failed to get user profile',
                message: error.message 
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
            const token = req.headers.authorization?.split('Bearer ')[1];
            if (!token) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const decodedToken = await admin.auth().verifyIdToken(token);
            if (!decodedToken.admin) {
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
            console.error('Error updating user claims:', error);
            return res.status(500).json({ 
                error: 'Failed to update user claims',
                message: error.message 
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
