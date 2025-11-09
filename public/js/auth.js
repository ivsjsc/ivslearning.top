// Import the functions you need from the SDKs you need
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const auth = window.firebaseAuth;

// Redirect if user is already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is already logged in. Redirecting to dashboard.");
        window.location.href = '/dashboard.html';
    }
});

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toggleLink = document.getElementById('toggle-form');
const messageContainer = document.getElementById('message-container');

// Toggle between login and registration forms
toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        toggleLink.textContent = 'Chưa có tài khoản? Đăng ký ngay';
        document.querySelector('h1').textContent = 'Chào mừng trở lại';
        document.querySelector('p').textContent = 'Đăng nhập để tiếp tục học tập';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        toggleLink.textContent = 'Đã có tài khoản? Đăng nhập';
        document.querySelector('h1').textContent = 'Tạo tài khoản mới';
        document.querySelector('p').textContent = 'Bắt đầu hành trình học tập của bạn';
    }
});

// Handle login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('User logged in:', user);
            window.location.href = '/dashboard.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Login error:', errorMessage);
            displayMessage('error', 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
        });
});

// Handle registration
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('User registered:', user);
            window.location.href = '/dashboard.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Registration error:', errorMessage);
            displayMessage('error', 'Đăng ký thất bại. Vui lòng thử lại.');
        });
});

function displayMessage(type, text) {
    messageContainer.innerHTML = `<div class="message ${type}">${text}</div>`;
    setTimeout(() => {
        messageContainer.innerHTML = '';
    }, 5000);
}
