/**
 * Layout Injector - Unified Header & Footer for all pages
 * Prevents duplication and ensures consistency across the site
 */

(async function initializeLayout() {
  try {
    // Inject Header
    const headerContainer = document.querySelector('body');
    if (headerContainer && !document.getElementById('app-header')) {
      const headerResponse = await fetch('/components/header.html');
      const headerHTML = await headerResponse.text();
      headerContainer.insertAdjacentHTML('afterbegin', headerHTML);
    }

    // Inject Footer
    const footerContainer = document.querySelector('body');
    if (footerContainer && !document.getElementById('app-footer')) {
      const footerResponse = await fetch('/components/footer.html');
      const footerHTML = await footerResponse.text();
      footerContainer.insertAdjacentHTML('beforeend', footerHTML);
    }

    // Ensure body uses flexbox for proper footer positioning
    document.documentElement.style.height = '100%';
    document.body.style.display = 'flex';
    document.body.style.flexDirection = 'column';
    document.body.style.minHeight = '100vh';
    
    // Main content should grow
    const mainContent = document.querySelector('main') || document.querySelector('.main-content');
    if (mainContent) {
      mainContent.style.flex = '1';
    }

  } catch (error) {
    console.error('Error loading layout components:', error);
  }
})();
