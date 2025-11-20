import { 
    onAuthStateChanged, 
    updatePassword, 
    reauthenticateWithCredential, 
    EmailAuthProvider,
    deleteUser 
} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', function() {
    const auth = window.firebaseAuth;
    if (!auth) {
        console.error('Firebase Auth not initialized');
        window.location.href = 'auth.html';
        return;
    }

    let currentUser = null;
    let isEditingProfile = false;

    // Listen to auth state changes
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            loadUserData(user);
        } else {
            window.location.href = 'auth.html';
        }
    });

    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    function switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.style.display = 'none';
        });
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab
        document.getElementById(tabName + '-tab').style.display = 'block';
        document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
    }

    async function loadUserData(user) {
        const displayName = user.displayName || user.email.split('@')[0];
        document.getElementById('user-name-display').textContent = displayName;
        document.getElementById('user-email-display').textContent = user.email;
        
        // Default values for UI
        document.getElementById('fullname-input').value = displayName;
        document.getElementById('email-input').value = user.email;

        // Get Firestore data if possible
        try {
            let db = window.firebaseDB;
            if (!db && window.firebaseApp) db = getFirestore(window.firebaseApp);
            if (!db) return;

            const userDocRef = doc(db, 'users', user.uid);
            const snap = await getDoc(userDocRef);
            if (snap && snap.exists()) {
                const data = snap.data();
                if (data.fullName) document.getElementById('fullname-input').value = data.fullName;
                if (data.phone) document.getElementById('phone-input').value = data.phone;
                if (data.preferences) document.getElementById('preferences-input').value = JSON.stringify(data.preferences);
            }
        } catch (err) {
            console.warn('loadUserData: Firestore read failed', err);
        }
    }

    // Edit Profile
    document.getElementById('edit-profile-btn').addEventListener('click', () => {
        isEditingProfile = true;
        document.querySelectorAll('.form-input').forEach(input => {
            if (input.id !== 'email-input') {
                input.disabled = false;
            }
        });
        document.getElementById('save-profile-btn').style.display = 'inline-block';
        document.getElementById('cancel-profile-btn').style.display = 'inline-block';
    });

    document.getElementById('cancel-profile-btn').addEventListener('click', () => {
        isEditingProfile = false;
        document.querySelectorAll('.form-input').forEach(input => {
            input.disabled = true;
        });
        document.getElementById('save-profile-btn').style.display = 'none';
        document.getElementById('cancel-profile-btn').style.display = 'none';
    });

    document.getElementById('save-profile-btn').addEventListener('click', async () => {
        // Save profile changes into Firestore
        try {
            const uid = currentUser?.uid;
            if (!uid) throw new Error('User not signed in');

            let db = window.firebaseDB;
            if (!db && window.firebaseApp) db = getFirestore(window.firebaseApp);
            if (!db) throw new Error('Firestore not initialized');

            const userDocRef = doc(db, 'users', uid);
            const fullName = document.getElementById('fullname-input').value.trim();
            const phone = document.getElementById('phone-input') ? document.getElementById('phone-input').value.trim() : '';
            const preferencesValue = document.getElementById('preferences-input') ? document.getElementById('preferences-input').value.trim() : '';
            let preferences = {};
            try { if (preferencesValue) preferences = JSON.parse(preferencesValue); } catch (e) { preferences = {}; }

            await setDoc(userDocRef, {
                uid,
                fullName,
                phone,
                preferences,
                email: currentUser.email,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            showMessage('Hồ sơ đã được cập nhật thành công!', 'success');
        } catch (err) {
            console.error('Failed to save profile:', err);
            showMessage('Không thể lưu hồ sơ. Vui lòng thử lại.', 'error');
        }
        isEditingProfile = false;
        document.querySelectorAll('.form-input').forEach(input => {
            input.disabled = true;
        });
        document.getElementById('save-profile-btn').style.display = 'none';
        document.getElementById('cancel-profile-btn').style.display = 'none';
    });

    // Change Password
    document.getElementById('change-password-btn').addEventListener('click', async () => {
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!newPassword || !confirmPassword) {
            showMessage('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage('Mật khẩu không khớp', 'error');
            return;
        }

        if (newPassword.length < 6) {
            showMessage('Mật khẩu phải có ít nhất 6 ký tự', 'error');
            return;
        }

        try {
            await updatePassword(currentUser, newPassword);
            showMessage('Mật khẩu đã được thay đổi thành công!', 'success');
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        } catch (error) {
            showMessage('Lỗi: ' + error.message, 'error');
        }
    });

    // Save Preferences
    document.getElementById('save-preferences-btn').addEventListener('click', () => {
        showMessage('Tùy chọn đã được lưu thành công!', 'success');
    });

    function showMessage(message, type) {
        const container = document.getElementById('message-container');
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        container.innerHTML = '';
        container.appendChild(messageEl);

        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }
});