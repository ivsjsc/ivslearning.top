import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

document.addEventListener('DOMContentLoaded', function() {
    const auth = window.firebaseAuth;
    if (!auth) {
        console.error('Firebase Auth not initialized');
        return;
    }

    const authForm = document.getElementById('auth-form');
    const submitBtn = document.getElementById('submit-btn');
    const buttonText = submitBtn.querySelector('.button-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    const authMessage = document.getElementById('auth-message');
    const toggleAuthMode = document.getElementById('toggle-auth-mode');
    const forgotPasswordBtn = document.getElementById('forgot-password-btn');
    const authTitle = document.getElementById('auth-title');
    const forgotPasswordArea = document.getElementById('forgot-password-area');

    let isLoginMode = true; // true for login, false for register

    // Toggle between login and register
    toggleAuthMode.addEventListener('click', function(e) {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        updateUI();
    });

    // Forgot password
    forgotPasswordBtn.addEventListener('click', async function(e) {
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
                await signInWithEmailAndPassword(auth, email, password);
                showMessage('Đăng nhập thành công!', 'success');
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                // Register
                await createUserWithEmailAndPassword(auth, email, password);
                showMessage('Đăng ký thành công!', 'success');
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
            authTitle.textContent = 'Đăng nhập';
            buttonText.textContent = 'Đăng nhập';
            toggleAuthMode.textContent = 'Đăng ký ngay';
            forgotPasswordArea.style.display = 'block';
        } else {
            authTitle.textContent = 'Đăng ký';
            buttonText.textContent = 'Đăng ký';
            toggleAuthMode.textContent = 'Đăng nhập';
            forgotPasswordArea.style.display = 'none';
        }
        authMessage.classList.add('hidden');
    }

    function setLoading(loading) {
        submitBtn.disabled = loading;
        if (loading) {
            buttonText.style.display = 'none';
            loadingSpinner.classList.remove('hidden');
        } else {
            buttonText.style.display = 'inline';
            loadingSpinner.classList.add('hidden');
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