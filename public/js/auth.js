import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';
import { setUserDoc } from '/js/auth-utils.js';

document.addEventListener('DOMContentLoaded', function() {
    const auth = window.firebaseAuth;
    if (!auth) {
        console.error('Firebase Auth not initialized');
        return;
    }

    const authForm = document.getElementById('auth-form');
    // support older and newer DOM IDs (backwards compatible)
    const submitBtn = document.getElementById('submit-btn') || document.getElementById('auth-submit') || (authForm ? authForm.querySelector('button[type="submit"]') : null);
    const defaultSubmitHtml = submitBtn ? submitBtn.innerHTML : '';
    const authMessage = document.getElementById('auth-message');
    const toggleAuthMode = document.getElementById('toggle-auth-mode') || document.getElementById('toggle-form');
    const forgotPasswordBtn = document.getElementById('forgot-password-btn') || document.getElementById('forgot-password-link');
    const authTitle = document.getElementById('auth-title') || document.querySelector('.auth-title h1');
    const forgotPasswordArea = document.getElementById('forgot-password-area') || document.querySelector('.forgot-password');

    let isLoginMode = true; // true for login, false for register
    const registerForm = document.getElementById('register-form');

    // Toggle between login and register
    if (toggleAuthMode) toggleAuthMode.addEventListener('click', function(e) {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        updateUI();
    });

    // Forgot password
    if (forgotPasswordBtn) forgotPasswordBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        if (!email) {
            showMessage('Vui lòng nhập email để đặt lại mật khẩu', 'error');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            showMessage('Email đặt lại mật khẩu đã được gửi!', 'success');
        } catch (error) {
            showMessage('Lỗi: ' + error.message, 'error');
        }
    });

    // Form submit
    authForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            showMessage('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }

        setLoading(true);

        try {
            if (isLoginMode) {
                // Login
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                showMessage('Đăng nhập thành công!', 'success');
                try { if (userCredential && userCredential.user) await setUserDoc(userCredential.user); } catch (err) { console.warn('Auth: failed to update user profile after login', err); }
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                // Register
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                showMessage('Đăng ký thành công!', 'success');
                try { if (userCredential && userCredential.user) await setUserDoc(userCredential.user, { role: 'student', createdAt: new Date().toISOString() }); } catch (err) { console.warn('Auth: failed to create user profile after signup', err); }
                // Switch to login mode
                isLoginMode = true;
                updateUI();
            }
        } catch (error) {
            let errorMessage = 'Đã xảy ra lỗi';
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'Email chưa được đăng ký';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Mật khẩu không đúng';
                    break;
                case 'auth/email-already-in-use':
                    errorMessage = 'Email đã được sử dụng';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Mật khẩu quá yếu';
                    break;
                default:
                    errorMessage = error.message;
            }
            showMessage(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    });

    function updateUI() {
        if (isLoginMode) {
            if (authTitle) authTitle.textContent = 'Đăng nhập';
            if (submitBtn) submitBtn.innerHTML = defaultSubmitHtml || 'Đăng nhập';
            if (toggleAuthMode) toggleAuthMode.textContent = 'Đăng ký ngay';
            if (forgotPasswordArea) forgotPasswordArea.style.display = 'block';
            if (authForm) authForm.style.display = 'block';
            if (registerForm) registerForm.style.display = 'none';
        } else {
            if (authTitle) authTitle.textContent = 'Đăng ký';
            if (submitBtn) submitBtn.innerHTML = defaultSubmitHtml || 'Đăng ký';
            if (toggleAuthMode) toggleAuthMode.textContent = 'Đăng nhập';
            if (forgotPasswordArea) forgotPasswordArea.style.display = 'none';
            if (authForm) authForm.style.display = 'none';
            if (registerForm) registerForm.style.display = 'block';
        }
        if (authMessage) authMessage.classList.remove('hidden');
    }

    function setLoading(loading) {
        if (!submitBtn) return;
        submitBtn.disabled = loading;
        if (loading) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
        } else {
            submitBtn.innerHTML = defaultSubmitHtml || 'Gửi';
        }
    }

    function showMessage(message, type) {
        authMessage.textContent = message;
        authMessage.className = `mt-4 p-3 text-center text-sm rounded-md ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`;
        authMessage.classList.remove('hidden');
    }

    // Initialize UI
    updateUI();
});