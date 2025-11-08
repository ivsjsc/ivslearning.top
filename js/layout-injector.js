/**
 * Layout Injector - Unified Header & Footer for all pages
 * Prevents duplication and ensures consistency across the site
 * 
 * Features:
 * - Detects and avoids duplicate headers/footers
 * - Removes old-style inline headers/footers
 * - Injects unified components from /components/
 * - Ensures proper page layout (flex column)
 */

(async function initializeLayout() {
  try {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initLayout);
    } else {
      initLayout();
    }

    async function initLayout() {
      // Remove old inline header if exists
      const oldHeaders = document.querySelectorAll('header:not(#app-header)');
      oldHeaders.forEach(header => {
        // Check if it's not the unified one
        if (!header.querySelector('#app-header')) {
          header.style.display = 'none';
        }
      });

      // Remove old inline footer if exists
      const oldFooters = document.querySelectorAll('footer:not(#app-footer)');
      oldFooters.forEach(footer => {
        if (!footer.querySelector('#app-footer')) {
          footer.style.display = 'none';
        }
      });

      // Inject unified Header (if not already present)
      if (!document.getElementById('app-header')) {
        const headerResponse = await fetch('/components/header.html');
        const headerHTML = await headerResponse.text();
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
      }

      // Inject unified Footer (if not already present)
      if (!document.getElementById('app-footer')) {
        const footerResponse = await fetch('/components/footer.html');
        const footerHTML = await footerResponse.text();
        document.body.insertAdjacentHTML('beforeend', footerHTML);
      }

      // Ensure proper layout structure
      document.documentElement.style.height = '100%';
      document.body.style.display = 'flex';
      document.body.style.flexDirection = 'column';
      document.body.style.minHeight = '100vh';

      // Make main content expandable
      const mainContent = document.querySelector('main') || 
                         document.querySelector('.main-content') ||
                         document.querySelector('.dashboard-container') ||
                         document.querySelector('[class*="container"]');
      
      if (mainContent) {
        mainContent.style.flex = '1';
      } else {
        // Fallback: wrap all non-header/footer content
        const allChildren = Array.from(document.body.children);
        const contentElements = allChildren.filter(el => 
          el.id !== 'app-header' && 
          el.id !== 'app-footer' &&
          el.tagName !== 'SCRIPT' &&
          el.tagName !== 'STYLE'
        );
        
        if (contentElements.length > 0) {
          const wrapper = document.createElement('main');
          wrapper.style.flex = '1';
          contentElements.forEach(el => wrapper.appendChild(el));
          const body = document.body;
          const footer = document.getElementById('app-footer');
          if (footer) {
            body.insertBefore(wrapper, footer);
          } else {
            body.appendChild(wrapper);
          }
        }
      }
    }

  } catch (error) {
    console.error('Error loading layout components:', error);
  }
})();
