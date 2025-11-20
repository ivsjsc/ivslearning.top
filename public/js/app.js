import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';
import { safeSignOut, setUserDoc } from '/js/auth-utils.js';

// Global auth state management
export function initializeGlobalAuthListener() {
    const auth = window.firebaseAuth;
    if (!auth) return;

    onAuthStateChanged(auth, async (user) => {
        updateAuthUIGlobally(user);
        localStorage.setItem('userAuthenticated', user ? 'true' : 'false');
        if (user) {
            localStorage.setItem('userEmail', user.email);
            try { await setUserDoc(user); } catch (err) { console.warn('app.js setUserDoc failed', err); }
        }
    });
}

function updateAuthUIGlobally(user) {
    const headerAuth = document.getElementById('header-auth');
    const footerAuth = document.getElementById('footer-auth');

    if (user) {
        // User is logged in
        const email = user.email.split('@')[0];
        const authHTML = `
            <div class="flex items-center gap-4">
                <span class="text-sm text-gray-300">Xin chào, <span class="font-semibold text-blue-400">${email}</span></span>
                <div class="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer" id="user-avatar">
                    ${email[0].toUpperCase()}
                </div>
                <div class="dropdown hidden absolute right-0 top-12 bg-gray-800 rounded-lg shadow-lg z-50" id="user-dropdown">
                    <a href="dashboard.html" class="block px-4 py-2 hover:bg-gray-700 text-sm">Dashboard</a>
                    <a href="profile.html" class="block px-4 py-2 hover:bg-gray-700 text-sm">Hồ sơ cá nhân</a>
                    <hr class="border-gray-700">
                    <button id="logout-btn-global" class="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm text-red-400">Đăng xuất</button>
                </div>
            </div>
        `;
        if (headerAuth) headerAuth.innerHTML = authHTML;
        if (footerAuth) footerAuth.innerHTML = authHTML;

        // Setup avatar click and logout
        setTimeout(() => {
            const avatar = document.getElementById('user-avatar');
            const dropdown = document.getElementById('user-dropdown');
            const logoutBtn = document.getElementById('logout-btn-global');

            if (avatar) {
                avatar.addEventListener('click', () => {
                    dropdown.classList.toggle('hidden');
                });
            }

            if (logoutBtn) {
                logoutBtn.addEventListener('click', async () => {
                    try {
                        await safeSignOut(auth);
                        window.location.href = 'auth.html';
                    } catch (error) {
                        console.error('Logout error:', error);
                    }
                });
            }

            document.addEventListener('click', (e) => {
                if (avatar && dropdown && !avatar.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.add('hidden');
                }
            });
        }, 0);
    } else {
        // User is not logged in
        const authHTML = `
            <div class="flex gap-4">
                <a href="auth.html" class="text-blue-400 hover:text-blue-300 font-semibold transition">Đăng nhập</a>
                <a href="auth.html" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition">Đăng ký</a>
            </div>
        `;
        if (headerAuth) headerAuth.innerHTML = authHTML;
        if (footerAuth) footerAuth.innerHTML = authHTML;
    }
}

export function getCurrentUser() {
    const auth = window.firebaseAuth;
    return auth.currentUser;
}

export function isUserAuthenticated() {
    return localStorage.getItem('userAuthenticated') === 'true';
}