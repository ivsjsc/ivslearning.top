// Scripts for common functionality
// General animations and interactions

class ScriptManager {
  constructor() {
    this.initializeThemeToggle();
    this.initializeAnimations();
    this.initializeInteractions();
  }
  
  initializeThemeToggle() {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    
    // Listen for theme toggle
    document.addEventListener('theme-toggle', (e) => {
      const newTheme = e.detail.theme;
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      document.body.classList.toggle('dark-mode', newTheme === 'dark');
    });
  }
  
  initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe all elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });
  }
  
  initializeInteractions() {
    // Add click handlers for interactive elements
    document.querySelectorAll('[data-toggle]').forEach(element => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSelector = element.getAttribute('data-toggle');
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
          targetElement.classList.toggle('hidden');
        }
      });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href !== '#') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.scriptManager = new ScriptManager();
  });
} else {
  window.scriptManager = new ScriptManager();
}

export { ScriptManager };
