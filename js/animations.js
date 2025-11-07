// Page animations and transitions

class Animations {
  constructor() {
    this.initializePageTransitions();
    this.initializeScrollAnimations();
    this.initializeHoverEffects();
  }
  
  initializePageTransitions() {
    // Add fade-in animation to page
    document.body.style.animation = 'fadeIn 0.5s ease';
    
    // Handle link clicks with fade-out animation
    document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="http"])').forEach(link => {
      link.addEventListener('click', (e) => {
        if (!e.defaultPrevented) {
          e.preventDefault();
          document.body.style.animation = 'fadeOut 0.3s ease';
          setTimeout(() => {
            window.location.href = link.href;
          }, 300);
        }
      });
    });
  }
  
  initializeScrollAnimations() {
    // Observe elements for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animationClass = entry.target.getAttribute('data-animation');
          if (animationClass) {
            entry.target.classList.add(animationClass);
          }
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('[data-animation]').forEach(el => {
      observer.observe(el);
    });
  }
  
  initializeHoverEffects() {
    // Add hover lift effect to cards
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      });
    });
  }
}

// Initialize animations
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.animations = new Animations();
  });
} else {
  window.animations = new Animations();
}

export { Animations };
