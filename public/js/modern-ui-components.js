/**
 * Modern UI Components Controller
 * Handles interactive components: modals, dropdowns, accordions, tabs
 * Mobile-first, accessibility-focused implementation
 */

"use strict";

class ModernUIComponents {
  constructor() {
    this.initModals();
    this.initDropdowns();
    this.initAccordions();
    this.initTabs();
    this.setupA11y();
  }

  // ========== MODAL MANAGEMENT ==========
  initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
    
    modalTriggers.forEach(trigger => {
      const modalId = trigger.dataset.modalTrigger;
      const modal = document.getElementById(modalId);
      
      if (!modal) return;
      
      // Open modal
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal(modal);
      });
      
      // Close buttons
      const closeBtn = modal.querySelector('[data-modal-close]');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeModal(modal));
      }
      
      // Close on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal(modal);
      });
      
      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          this.closeModal(modal);
        }
      });
    });
  }

  openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]');
    if (focusable) focusable.focus();
    
    // Announce to screen readers
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
  }

  closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ========== DROPDOWN MANAGEMENT ==========
  initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      const menu = dropdown.querySelector('.dropdown-menu');
      const items = dropdown.querySelectorAll('.dropdown-item');
      
      if (!toggle || !menu) return;
      
      // Toggle menu
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
        toggle.setAttribute('aria-expanded', menu.classList.contains('active'));
      });
      
      // Close on item click
      items.forEach(item => {
        item.addEventListener('click', () => {
          menu.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
      
      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          menu.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Keyboard navigation
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle.click();
        }
      });
      
      items.forEach((item, index) => {
        item.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = items[index + 1];
            if (next) next.focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = items[index - 1];
            if (prev) prev.focus();
          } else if (e.key === 'Escape') {
            menu.classList.remove('active');
            toggle.focus();
          }
        });
      });
    });
  }

  // ========== ACCORDION MANAGEMENT ==========
  initAccordions() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
      const headers = accordion.querySelectorAll('.accordion-header');
      
      headers.forEach((header, index) => {
        const content = header.nextElementSibling;
        
        if (!content) return;
        
        // Set up IDs for a11y
        if (!header.id) header.id = `accordion-header-${Date.now()}-${index}`;
        if (!content.id) content.id = `accordion-content-${Date.now()}-${index}`;
        
        // Set up aria attributes
        header.setAttribute('aria-controls', content.id);
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        content.setAttribute('aria-labelledby', header.id);
        
        // Toggle on click
        header.addEventListener('click', () => {
          this.toggleAccordion(accordion, header, content);
        });
        
        // Keyboard navigation
        header.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            header.click();
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextHeader = header.closest('.accordion-item')?.nextElementSibling?.querySelector('.accordion-header');
            if (nextHeader) nextHeader.focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevHeader = header.closest('.accordion-item')?.previousElementSibling?.querySelector('.accordion-header');
            if (prevHeader) prevHeader.focus();
          }
        });
      });
    });
  }

  toggleAccordion(accordion, header, content) {
    const isOpen = header.classList.contains('active');
    
    // Close all items in this accordion
    accordion.querySelectorAll('.accordion-header').forEach(h => {
      h.classList.remove('active');
      h.setAttribute('aria-expanded', 'false');
    });
    
    accordion.querySelectorAll('.accordion-content').forEach(c => {
      c.classList.remove('active');
    });
    
    // Open clicked item if it was closed
    if (!isOpen) {
      header.classList.add('active');
      header.setAttribute('aria-expanded', 'true');
      content.classList.add('active');
    }
  }

  // ========== TABS MANAGEMENT ==========
  initTabs() {
    const tabContainers = document.querySelectorAll('[data-tabs]');
    
    tabContainers.forEach(container => {
      const tabs = container.querySelectorAll('.tab-btn');
      const contents = container.querySelectorAll('.tab-content');
      
      tabs.forEach((tab, index) => {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        
        const content = contents[index];
        if (content) {
          content.setAttribute('role', 'tabpanel');
          if (index === 0) {
            tab.classList.add('active');
            content.classList.add('active');
          }
        }
        
        tab.addEventListener('click', () => {
          // Deactivate all tabs/contents
          tabs.forEach((t, i) => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
            if (contents[i]) contents[i].classList.remove('active');
          });
          
          // Activate clicked tab/content
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
          if (content) content.classList.add('active');
        });
        
        // Keyboard navigation
        tab.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const next = tabs[index + 1] || tabs[0];
            next.click();
            next.focus();
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = tabs[index - 1] || tabs[tabs.length - 1];
            prev.click();
            prev.focus();
          }
        });
      });
    });
  }

  // ========== ACCESSIBILITY SETUP ==========
  setupA11y() {
    // Skip to main content
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.setAttribute('tabindex', '0');
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add skip-link CSS
    const style = document.createElement('style');
    style.textContent = `
      .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--color-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 100;
      }
      .skip-link:focus {
        top: 0;
      }
    `;
    document.head.appendChild(style);
    
    // Focus visible for keyboard navigation
    const focusStyle = document.createElement('style');
    focusStyle.textContent = `
      *:focus-visible {
        outline: 2px solid var(--color-secondary);
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(focusStyle);
    
    // Color contrast verification (log to console)
    console.log('✅ Accessibility features initialized');
  }

  // ========== TOAST NOTIFICATIONS ==========
  static showToast(title, message, type = 'info', duration = 3000) {
    let container = document.querySelector('.toast-container');
    
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'warning',
      info: 'info-circle'
    };
    
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fas fa-${icons[type]}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close notification">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    container.appendChild(toast);
    
    const closeBtn = toast.querySelector('.toast-close');
    const remove = () => {
      toast.style.animation = 'fadeOut 0.3s ease-in-out';
      setTimeout(() => toast.remove(), 300);
    };
    
    closeBtn.addEventListener('click', remove);
    
    if (duration > 0) {
      setTimeout(remove, duration);
    }
  }

  // ========== LOADING SPINNER ==========
  static showLoadingSpinner(message = 'Loading...') {
    const modal = document.createElement('div');
    modal.id = 'loading-spinner-modal';
    modal.className = 'modal active';
    modal.setAttribute('aria-label', message);
    
    modal.innerHTML = `
      <div style="text-align: center;">
        <div class="spinner spinner-lg" style="margin-bottom: 16px;"></div>
        <p style="color: var(--color-text-secondary);">${message}</p>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  static hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner-modal');
    if (spinner) spinner.remove();
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ModernUIComponents();
  });
} else {
  new ModernUIComponents();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModernUIComponents;
}
