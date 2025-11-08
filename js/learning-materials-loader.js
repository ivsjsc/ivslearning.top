/**
 * Learning Materials Loader
 * Load AI-generated content and materials from backend
 */

class LearningMaterialsLoader {
  constructor() {
    this.materials = [];
    this.loading = false;
    this.userProfile = null;
    this.init();
  }

  init() {
    // Check if user is logged in
    if (window.firebaseUser) {
      this.loadUserProfile();
      this.loadMaterials();
    } else {
      this.renderLoginPrompt();
      window.addEventListener('auth-login', () => {
        this.loadUserProfile();
        this.loadMaterials();
      });
    }
  }

  async loadUserProfile() {
    try {
      const userId = window.firebaseUser.uid;
      this.userProfile = await window.API.getUserProfile(userId);
    } catch (error) {
      console.warn('[Learning] Profile load failed:', error);
    }
  }

  async loadMaterials() {
    try {
      this.loading = true;
      
      // Try to fetch all posts (materials)
      const allPosts = await window.API.getPosts({
        orderBy: { field: 'createdAt', direction: 'desc' },
        limit: 100,
      });
      
      this.materials = allPosts.filter(post => 
        post.type === 'material' || post.category === 'learning'
      );
      
      this.renderMaterials();
    } catch (error) {
      console.error('[Learning] Materials load error:', error);
      this.renderError('Không thể tải tài liệu học tập');
    } finally {
      this.loading = false;
    }
  }

  async generateContent(contentType) {
    try {
      this.loading = true;
      
      const response = await window.API.generateContent({
        type: contentType,
        level: 'beginner',
        language: 'vi',
        topic: 'Technology',
      });
      
      // Add to materials
      if (response.content) {
        this.materials.unshift({
          id: `gen_${Date.now()}`,
          title: response.title || 'Nội dung được tạo',
          content: response.content,
          type: 'generated',
          category: 'learning',
          createdAt: new Date().toISOString(),
          views: 0,
          likes: 0,
        });
        
        this.renderMaterials();
      }
    } catch (error) {
      console.error('[Learning] Content generation error:', error);
      alert('Không thể tạo nội dung. Vui lòng thử lại.');
    } finally {
      this.loading = false;
    }
  }

  renderMaterials() {
    const container = document.getElementById('learning-materials-grid');
    if (!container) return;

    if (this.materials.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-20">
          <i class="fas fa-book-open text-gray-400 text-6xl mb-6"></i>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Chưa có tài liệu nào</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-8">Hãy tạo nội dung học tập hoặc quay lại sau</p>
          <button class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold">
            Tạo nội dung
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = this.materials.map(material => `
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition overflow-hidden h-full">
        <!-- Material Header -->
        <div class="bg-gradient-to-r ${this.getGradient(material.type)} p-6 text-white">
          <div class="flex justify-between items-start mb-4">
            <span class="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
              ${this.getTypeLabel(material.type)}
            </span>
            <span class="text-xs opacity-75">${this.formatDate(material.createdAt)}</span>
          </div>
          <h3 class="text-xl font-bold line-clamp-2">${this.escapeHtml(material.title)}</h3>
        </div>

        <!-- Material Content -->
        <div class="p-6">
          <p class="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
            ${this.escapeHtml(material.description || this.extractPreview(material.content))}
          </p>

          <!-- Stats -->
          <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span><i class="far fa-eye mr-2"></i>${material.views || 0}</span>
            <span><i class="far fa-heart mr-2"></i>${material.likes || 0}</span>
            <span><i class="far fa-star mr-2"></i>${material.difficulty || 'Cơ bản'}</span>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium text-sm">
              <i class="fas fa-book-reader mr-2"></i>Đọc
            </button>
            <button class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm">
              <i class="far fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderLoginPrompt() {
    const container = document.getElementById('learning-materials-grid');
    if (!container) return;

    container.innerHTML = `
      <div class="col-span-full text-center py-20">
        <i class="fas fa-sign-in-alt text-gray-400 text-6xl mb-6"></i>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Vui lòng đăng nhập</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8">Bạn cần đăng nhập để truy cập tài liệu học tập</p>
        <button onclick="window.location.href='/auth.html'" class="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold">
          Đăng nhập
        </button>
      </div>
    `;
  }

  renderError(message) {
    const container = document.getElementById('learning-materials-grid');
    if (!container) return;

    container.innerHTML = `
      <div class="col-span-full bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
        <i class="fas fa-exclamation-circle mr-2"></i>${message}
      </div>
    `;
  }

  getGradient(type) {
    const gradients = {
      'article': 'from-blue-500 to-cyan-500',
      'video': 'from-purple-500 to-pink-500',
      'quiz': 'from-orange-500 to-red-500',
      'interactive': 'from-green-500 to-emerald-500',
      'generated': 'from-indigo-500 to-blue-500',
      'material': 'from-teal-500 to-cyan-500',
    };
    return gradients[type] || 'from-gray-500 to-slate-500';
  }

  getTypeLabel(type) {
    const labels = {
      'article': '📄 Bài viết',
      'video': '🎥 Video',
      'quiz': '✏️ Quiz',
      'interactive': '🎮 Tương tác',
      'generated': '🤖 AI tạo',
      'material': '📚 Tài liệu',
    };
    return labels[type] || type;
  }

  extractPreview(content) {
    if (!content) return '';
    const text = typeof content === 'string' ? content : JSON.stringify(content);
    return text.substring(0, 150).replace(/<[^>]*>/g, '');
  }

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.learningMaterialsLoader = new LearningMaterialsLoader();
  });
} else {
  window.learningMaterialsLoader = new LearningMaterialsLoader();
}
