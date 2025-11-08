/**
 * 🔐 Complete Authentication System
 * Supports: Email/Password, Google OAuth, Facebook OAuth, GitHub OAuth
 * Features: Login, Register, Logout, Session Management, Password Reset
 */

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile,
    sendEmailVerification,
    setPersistence,
    browserLocalPersistence,
    GoogleAuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider
} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

// ============================================================
// CONFIGURATION & PROVIDERS
// ============================================================

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

// Configure providers with required scopes
googleProvider.addScope('profile');
googleProvider.addScope('email');
facebookProvider.addScope('email');
githubProvider.addScope('user:email');

// ============================================================
// GLOBAL AUTH STATE
// ============================================================

let currentUser = null;
let isLoginMode = true;

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const auth = window.firebaseAuth;
    if (!auth) {
        console.error('❌ Firebase Auth not initialized');
        return;
    }

    // Set session persistence
    setPersistence(auth, browserLocalPersistence).catch(error => {
        console.warn('⚠️ Session persistence error:', error);
    });

    // Initialize authentication UI
    initializeAuthUI(auth);
    
    // Listen for auth state changes
    setupAuthStateListener(auth);
});

// ============================================================
// AUTH STATE LISTENER
// ============================================================

function setupAuthStateListener(auth) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is logged in
            currentUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                isAnonymous: user.isAnonymous,
                metadata: {
                    creationTime: user.metadata.creationTime,
                    lastSignInTime: user.metadata.lastSignInTime
                }
            };
            
            console.log('✅ User logged in:', currentUser.email);
            handleUserLoggedIn(auth, user);
        } else {
            // User is logged out
            currentUser = null;
            console.log('👋 User logged out');
            handleUserLoggedOut();
        }
    });
}

// ============================================================
// AUTH UI INITIALIZATION
// ============================================================

function initializeAuthUI(auth) {
    // Get all form elements
    const authForm = document.getElementById('auth-form');
    const submitBtn = document.getElementById('submit-btn');
    const toggleAuthMode = document.getElementById('toggle-auth-mode');
    const forgotPasswordBtn = document.getElementById('forgot-password-btn');
    
    // OAuth buttons
    const googleBtn = document.getElementById('google-login-btn');
    const facebookBtn = document.getElementById('facebook-login-btn');
    const githubBtn = document.getElementById('github-login-btn');

    if (!authForm) {
        console.warn('⚠️ Auth form not found in DOM');
        return;
    }

    // Email/Password form submit
    authForm.addEventListener('submit', (e) => handleFormSubmit(e, auth));

    // Toggle login/register
    if (toggleAuthMode) {
        toggleAuthMode.addEventListener('click', (e) => toggleAuthModeHandler(e));
    }

    // Forgot password
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', (e) => handleForgotPassword(e, auth));
    }

    // OAuth buttons
    if (googleBtn) {
        googleBtn.addEventListener('click', () => handleGoogleSignIn(auth));
    }
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => handleFacebookSignIn(auth));
    }
    if (githubBtn) {
        githubBtn.addEventListener('click', () => handleGithubSignIn(auth));
    }
}

// ============================================================
// LOGIN/REGISTER FORM HANDLING
// ============================================================

async function handleFormSubmit(e, auth) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password')?.value;

    // Validation
    if (!email || !password) {
        showMessage('❌ Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('❌ Email không hợp lệ', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('❌ Mật khẩu phải ít nhất 6 ký tự', 'error');
        return;
    }

    setLoading(true);

    try {
        if (isLoginMode) {
            // LOGIN
            await signInWithEmailAndPassword(auth, email, password);
            showMessage('✅ Đăng nhập thành công!', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            // REGISTER
            if (password !== confirmPassword) {
                showMessage('❌ Mật khẩu không trùng khớp', 'error');
                setLoading(false);
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Send email verification
            await sendEmailVerification(userCredential.user);
            
            showMessage('✅ Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.', 'success');
            
            // Switch to login mode
            isLoginMode = true;
            updateUI();
            
            // Clear form
            document.getElementById('auth-form').reset();
        }
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        showMessage(errorMessage, 'error');
    } finally {
        setLoading(false);
    }
}

// ============================================================
// OAUTH HANDLERS
// ============================================================

async function handleGoogleSignIn(auth) {
    setLoading(true);
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Save user profile
        await updateUserProfile(user);
        
        showMessage('✅ Đăng nhập Google thành công!', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } catch (error) {
        if (error.code === 'auth/popup-closed-by-user') {
            showMessage('⚠️ Bạn đã đóng cửa sổ đăng nhập', 'warning');
        } else {
            const errorMessage = getErrorMessage(error);
            showMessage(errorMessage, 'error');
        }
    } finally {
        setLoading(false);
    }
}

async function handleFacebookSignIn(auth) {
    setLoading(true);
    try {
        const result = await signInWithPopup(auth, facebookProvider);
        const user = result.user;
        
        await updateUserProfile(user);
        
        showMessage('✅ Đăng nhập Facebook thành công!', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } catch (error) {
        if (error.code === 'auth/popup-closed-by-user') {
            showMessage('⚠️ Bạn đã đóng cửa sổ đăng nhập', 'warning');
        } else {
            const errorMessage = getErrorMessage(error);
            showMessage(errorMessage, 'error');
        }
    } finally {
        setLoading(false);
    }
}

async function handleGithubSignIn(auth) {
    setLoading(true);
    try {
        const result = await signInWithPopup(auth, githubProvider);
        const user = result.user;
        
        await updateUserProfile(user);
        
        showMessage('✅ Đăng nhập GitHub thành công!', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } catch (error) {
        if (error.code === 'auth/popup-closed-by-user') {
            showMessage('⚠️ Bạn đã đóng cửa sổ đăng nhập', 'warning');
        } else {
            const errorMessage = getErrorMessage(error);
            showMessage(errorMessage, 'error');
        }
    } finally {
        setLoading(false);
    }
}

// ============================================================
// LOGOUT HANDLER
// ============================================================

export async function handleLogout(auth) {
    try {
        setLoading(true);
        await signOut(auth);
        
        // Clear user data
        currentUser = null;
        localStorage.removeItem('userProfile');
        
        showMessage('✅ Đã đăng xuất thành công', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } catch (error) {
        console.error('❌ Logout error:', error);
        showMessage('❌ Lỗi đăng xuất: ' + error.message, 'error');
    } finally {
        setLoading(false);
    }
}

// ============================================================
// FORGOT PASSWORD HANDLER
// ============================================================

async function handleForgotPassword(e, auth) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    
    if (!email) {
        showMessage('❌ Vui lòng nhập email để đặt lại mật khẩu', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('❌ Email không hợp lệ', 'error');
        return;
    }

    setLoading(true);
    
    try {
        await sendPasswordResetEmail(auth, email);
        showMessage('✅ Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư.', 'success');
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            showMessage('❌ Email này chưa được đăng ký', 'error');
        } else {
            showMessage('❌ Lỗi: ' + error.message, 'error');
        }
    } finally {
        setLoading(false);
    }
}

// ============================================================
// USER PROFILE UPDATE
// ============================================================

async function updateUserProfile(user) {
    try {
        // Update Firebase profile
        if (user.displayName) {
            await updateProfile(user, {
                displayName: user.displayName,
                photoURL: user.photoURL
            });
        }
        
        // Save to localStorage
        const userProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        console.log('✅ User profile updated:', userProfile);
    } catch (error) {
        console.error('❌ Profile update error:', error);
    }
}

// ============================================================
// UI STATE HANDLERS
// ============================================================

function toggleAuthModeHandler(e) {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    updateUI();
}

function updateUI() {
    const authTitle = document.getElementById('auth-title');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
    const submitBtn = document.getElementById('submit-btn');
    const buttonText = submitBtn?.querySelector('.button-text');
    const toggleAuthMode = document.getElementById('toggle-auth-mode');

    if (isLoginMode) {
        authTitle.textContent = '🔐 Đăng Nhập';
        if (confirmPasswordGroup) confirmPasswordGroup.style.display = 'none';
        if (buttonText) buttonText.textContent = 'Đăng Nhập';
        if (toggleAuthMode) toggleAuthMode.innerHTML = 'Chưa có tài khoản? <a href="#">Đăng ký ngay</a>';
    } else {
        authTitle.textContent = '📝 Đăng Ký';
        if (confirmPasswordGroup) confirmPasswordGroup.style.display = 'block';
        if (buttonText) buttonText.textContent = 'Đăng Ký';
        if (toggleAuthMode) toggleAuthMode.innerHTML = 'Đã có tài khoản? <a href="#">Đăng nhập</a>';
    }
}

function handleUserLoggedIn(auth, user) {
    // Hide auth page if on auth page
    const authContainer = document.getElementById('auth-container');
    if (authContainer) {
        authContainer.style.display = 'none';
    }
    
    // Update user menu if exists
    updateUserMenu(user);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
}

function handleUserLoggedOut() {
    // Show auth page if on auth page
    const authContainer = document.getElementById('auth-container');
    if (authContainer) {
        authContainer.style.display = 'flex';
    }
    
    // Clear user menu if exists
    clearUserMenu();
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
}

function updateUserMenu(user) {
    const userNameEl = document.getElementById('user-name');
    const userEmailEl = document.getElementById('user-email');
    const userAvatarEl = document.getElementById('user-avatar');
    
    if (userNameEl) userNameEl.textContent = user.displayName || user.email;
    if (userEmailEl) userEmailEl.textContent = user.email;
    if (userAvatarEl && user.photoURL) {
        userAvatarEl.src = user.photoURL;
    }
}

function clearUserMenu() {
    const userNameEl = document.getElementById('user-name');
    const userEmailEl = document.getElementById('user-email');
    
    if (userNameEl) userNameEl.textContent = '';
    if (userEmailEl) userEmailEl.textContent = '';
}

// ============================================================
// UI FEEDBACK FUNCTIONS
// ============================================================

function setLoading(isLoading) {
    const submitBtn = document.getElementById('submit-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const buttonText = submitBtn?.querySelector('.button-text');

    if (isLoading) {
        if (submitBtn) submitBtn.disabled = true;
        if (loadingSpinner) loadingSpinner.style.display = 'inline-block';
        if (buttonText) buttonText.style.display = 'none';
    } else {
        if (submitBtn) submitBtn.disabled = false;
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (buttonText) buttonText.style.display = 'inline';
    }
}

function showMessage(message, type = 'info') {
    const authMessage = document.getElementById('auth-message');
    if (!authMessage) return;

    authMessage.textContent = message;
    authMessage.className = `auth-message auth-message-${type}`;
    authMessage.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        authMessage.style.display = 'none';
    }, 5000);
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getErrorMessage(error) {
    const errorMap = {
        'auth/user-not-found': '❌ Email chưa được đăng ký',
        'auth/wrong-password': '❌ Mật khẩu không đúng',
        'auth/email-already-in-use': '❌ Email đã được sử dụng',
        'auth/weak-password': '❌ Mật khẩu quá yếu (ít nhất 6 ký tự)',
        'auth/invalid-email': '❌ Email không hợp lệ',
        'auth/operation-not-allowed': '❌ Chế độ này chưa được bật',
        'auth/too-many-requests': '❌ Quá nhiều yêu cầu. Vui lòng thử lại sau',
        'auth/network-request-failed': '❌ Lỗi kết nối mạng',
        'auth/popup-blocked': '❌ Cửa sổ đăng nhập đã bị chặn',
        'auth/cancelled-popup-request': '❌ Yêu cầu đăng nhập bị hủy'
    };

    return errorMap[error.code] || `❌ Lỗi: ${error.message}`;
}

// ============================================================
// EXPORTS
// ============================================================

export {
    handleLogout,
    currentUser,
    updateUserProfile
};
