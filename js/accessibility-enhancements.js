// Accessibility Enhancements

class AccessibilityEnhancements {
  constructor() {
    this.initializeKeyboardNavigation();
    this.initializeARIA();
    this.initializeScreenReaderSupport();
  }
  
  initializeKeyboardNavigation() {
    // Tab key navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });
    
    // Remove keyboard nav styles on mouse move
    document.addEventListener('mousemove', () => {
      document.body.classList.remove('keyboard-nav');
    });
    
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'sr-only';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: #000;
      color: white;
      padding: 8px;
      z-index: 100;
    `;
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0';
    });
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
  
  initializeARIA() {
    // Add ARIA labels to interactive elements without labels
    document.querySelectorAll('button:not([aria-label])').forEach(button => {
      if (!button.textContent.trim()) {
        const icon = button.querySelector('i, svg');
        if (icon) {
          button.setAttribute('aria-label', icon.className || icon.title || 'Button');
        }
      }
    });
    
    // Add ARIA labels to input fields
    document.querySelectorAll('input:not([aria-label])').forEach(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) {
        input.setAttribute('aria-label', label.textContent);
      }
    });
    
    // Add ARIA live regions for dynamic content
    const liveRegion = document.createElement('div');
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.id = 'aria-live-region';
    document.body.appendChild(liveRegion);
  }
  
  initializeScreenReaderSupport() {
    // Announce navigation changes
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link && link.getAttribute('href') !== '#') {
        const targetId = link.getAttribute('href').substring(1);
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
          liveRegion.textContent = `Navigated to ${targetId}`;
        }
      }
    });
  }
  
  // Set page title for screen readers
  setPageTitle(title) {
    document.title = title;
    const h1 = document.querySelector('h1');
    if (h1) {
      h1.id = h1.id || 'page-title';
      document.querySelector('body').setAttribute('aria-labelledby', 'page-title');
    }
  }
  
  // Announce message to screen reader
  announce(message) {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }
}

// Initialize accessibility enhancements
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityEnhancements = new AccessibilityEnhancements();
  });
} else {
  window.accessibilityEnhancements = new AccessibilityEnhancements();
}

export { AccessibilityEnhancements };
