import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

document.addEventListener('DOMContentLoaded', function() {
    const auth = window.firebaseAuth;
    if (!auth) {
        console.error('Firebase Auth not initialized');
        window.location.href = 'auth.html';
        return;
    }

    let currentUser = null;

    // Listen to auth state changes
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            updateDashboardUI(user);
            loadUserData(user);
        } else {
            // Redirect to login if not authenticated
            window.location.href = 'auth.html';
        }
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', async () => {
        try {
            await signOut(auth);
            console.log('User logged out');
            window.location.href = 'auth.html';
        } catch (error) {
            console.error('Logout error:', error);
        }
    });

    function updateDashboardUI(user) {
        // Extract name from email or display name
        const displayName = user.displayName || user.email.split('@')[0];
        document.getElementById('user-name').textContent = displayName;
    }

    function loadUserData(user) {
        // Sample data - in real scenario, this would come from Firestore
        const sampleCourses = [
            { id: 1, name: 'Tiếng Anh Cơ bản', progress: 65, status: 'Đang học' },
            { id: 2, name: 'Tiếng Anh Nâng cao', progress: 40, status: 'Đang học' },
            { id: 3, name: 'Kiểm tra TOEIC', progress: 0, status: 'Chưa bắt đầu' }
        ];

        // Display sample courses
        const coursesContainer = document.getElementById('courses-container');
        if (sampleCourses.length > 0) {
            coursesContainer.innerHTML = sampleCourses.map(course => `
                <div class="course-card p-6 rounded-lg">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold mb-1">${course.name}</h3>
                            <p class="text-sm text-gray-400">Trạng thái: <span class="text-blue-400">${course.status}</span></p>
                        </div>
                        <span class="text-2xl font-bold text-blue-400">${course.progress}%</span>
                    </div>
                    <div class="mb-4">
                        <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="progress-bar" style="width: ${course.progress}%"></div>
                        </div>
                    </div>
                    <button class="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded transition">
                        Tiếp tục học
                    </button>
                </div>
            `).join('');
            
            // Update stats
            document.getElementById('total-courses').textContent = sampleCourses.length;
            const avgProgress = Math.round(sampleCourses.reduce((sum, c) => sum + c.progress, 0) / sampleCourses.length);
            document.getElementById('avg-progress').textContent = avgProgress + '%';
        }
    }
});