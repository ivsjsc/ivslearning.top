/**
 * Dashboard Data Loader
 * Load posts, user profile, and analytics from backend
 */

class DashboardLoader {
  constructor() {
    this.userId = null;
    this.user = null;
    this.posts = [];
    this.loading = false;
    this.init();
  }

  init() {
    // Wait for API to be ready
    if (window.apiService) {
      this.setupAuthListener();
    } else {
      window.addEventListener('auth-login', () => this.setupAuthListener());
    }
  }

  setupAuthListener() {
    window.addEventListener('auth-login', (event) => {
      this.userId = event.detail.uid;
      this.loadUserProfile();
      this.loadPosts();
    });

    window.addEventListener('auth-logout', () => {
      this.userId = null;
      this.user = null;
      this.posts = [];
      this.renderLoginPrompt();
    });

    // Initial load if user already logged in
    if (window.firebaseUser) {
      this.userId = window.firebaseUser.uid;
      this.loadUserProfile();
      this.loadPosts();
    }
  }

  async loadUserProfile() {
    if (!this.userId) return;

    try {
      this.loading = true;
      const profile = await window.API.getUserProfile(this.userId);
      this.user = profile;
      this.renderUserProfile();
    } catch (error) {
      console.error('[Dashboard] Profile load error:', error);
      this.renderError('Không thể tải hồ sơ người dùng');
    } finally {
      this.loading = false;
    }
  }

  async loadPosts() {
    if (!this.userId) return;

    try {
      this.loading = true;
      this.posts = await window.API.getPosts({
        filters: [{ field: 'authorId', op: '==', value: this.userId }],
        orderBy: { field: 'createdAt', direction: 'desc' },
        limit: 50,
      });
      this.renderPosts();
    } catch (error) {
      console.error('[Dashboard] Posts load error:', error);
      this.renderError('Không thể tải bài viết');
    } finally {
      this.loading = false;
    }
  }

  renderUserProfile() {
    if (!this.user) return;

    const container = document.getElementById('dashboard-user-profile');
    if (!container) return;

    const stats = this.getStats();
    container.innerHTML = `
      <div class="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-2xl">
        <div class="flex items-center justify-between mb-8">
          <div class="flex-1">
            <h2 class="text-4xl font-bold mb-2">${this.user.displayName || 'Người dùng'}</h2>
            <p class="text-purple-100 text-lg">${this.user.email}</p>
          </div>
          <div class="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl">
            ${this.user.avatar ? `<img src="${this.user.avatar}" class="w-full h-full rounded-full"/>` : '<i class="fas fa-user"></i>'}
          </div>
        </div>
        
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white/10 backdrop-blur rounded-lg p-4">
            <div class="text-2xl font-bold">${stats.totalPosts}</div>
            <div class="text-purple-100">Bài viết</div>
          </div>
          <div class="bg-white/10 backdrop-blur rounded-lg p-4">
            <div class="text-2xl font-bold">${stats.totalViews}</div>
            <div class="text-purple-100">Lượt xem</div>
          </div>
          <div class="bg-white/10 backdrop-blur rounded-lg p-4">
            <div class="text-2xl font-bold">${stats.totalLikes}</div>
            <div class="text-purple-100">Lượt thích</div>
          </div>
        </div>
      </div>
    `;
  }

  renderPosts() {
    const container = document.getElementById('dashboard-posts');
    if (!container) return;

    if (this.posts.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12">
          <i class="fas fa-file-alt text-gray-400 text-4xl mb-4"></i>
          <p class="text-gray-500 text-lg">Chưa có bài viết nào</p>
          <button class="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Tạo bài viết
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="space-y-4">
        ${this.posts.map(post => `
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">${this.escapeHtml(post.title)}</h3>
              <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                ${post.status || 'draft'}
              </span>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-4">${this.escapeHtml(post.description || post.content.substring(0, 100))}</p>
            <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>
                <i class="far fa-calendar mr-2"></i>${this.formatDate(post.createdAt)}
              </span>
              <div class="space-x-4">
                <span><i class="far fa-eye mr-1"></i>${post.views || 0}</span>
                <span><i class="far fa-heart mr-1"></i>${post.likes || 0}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderLoginPrompt() {
    const container = document.getElementById('dashboard-content');
    if (!container) return;

    container.innerHTML = `
      <div class="text-center py-20">
        <i class="fas fa-sign-in-alt text-gray-400 text-6xl mb-6"></i>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Vui lòng đăng nhập</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8">Bạn cần đăng nhập để xem dashboard của mình</p>
        <button id="login-btn" class="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold">
          Đăng nhập
        </button>
      </div>
    `;

    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
      loginBtn.onclick = () => window.location.href = '/auth.html';
    }
  }

  renderError(message) {
    const container = document.getElementById('dashboard-content');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
        <i class="fas fa-exclamation-circle mr-2"></i>${message}
      </div>
    `;
  }

  getStats() {
    return {
      totalPosts: this.posts.length,
      totalViews: this.posts.reduce((sum, p) => sum + (p.views || 0), 0),
      totalLikes: this.posts.reduce((sum, p) => sum + (p.likes || 0), 0),
    };
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.dashboardLoader = new DashboardLoader();
  });
} else {
  window.dashboardLoader = new DashboardLoader();
}
