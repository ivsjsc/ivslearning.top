// Content Management System functionality

class ContentManagement {
  constructor() {
    this.initializeContentEditing();
    this.initializeContentPreview();
  }
  
  initializeContentEditing() {
    // Initialize content editor for editable elements
    document.querySelectorAll('[contenteditable="true"]').forEach(element => {
      element.addEventListener('blur', () => {
        this.saveContent(element);
      });
      
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
          this.saveContent(element);
        }
      });
    });
  }
  
  initializeContentPreview() {
    // Preview functionality for content
    document.querySelectorAll('[data-preview]').forEach(button => {
      button.addEventListener('click', () => {
        const contentId = button.getAttribute('data-preview');
        const content = document.querySelector(`#${contentId}`);
        if (content) {
          this.showPreview(content);
        }
      });
    });
  }
  
  saveContent(element) {
    const contentId = element.id || element.getAttribute('data-content-id');
    const content = element.innerHTML;
    
    // Save to localStorage for persistence
    localStorage.setItem(`content_${contentId}`, content);
    
    console.log('Content saved:', contentId);
  }
  
  loadContent(contentId) {
    const saved = localStorage.getItem(`content_${contentId}`);
    return saved || null;
  }
  
  showPreview(content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="flex-between">
          <h2>Content Preview</h2>
          <button class="close-btn">&times;</button>
        </div>
        <div class="preview-content">
          ${content.innerHTML}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-btn').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
  
  deleteContent(contentId) {
    localStorage.removeItem(`content_${contentId}`);
    console.log('Content deleted:', contentId);
  }
}

// Initialize content management
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.contentManagement = new ContentManagement();
  });
} else {
  window.contentManagement = new ContentManagement();
}

export { ContentManagement };
