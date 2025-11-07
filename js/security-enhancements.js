// Security Enhancements for IVS Platform

class SecurityEnhancements {
  constructor() {
    this.initializeCSRFProtection();
    this.initializeXSSProtection();
    this.initializeSecurityHeaders();
  }
  
  // CSRF Token Protection
  initializeCSRFProtection() {
    const csrfToken = this.generateCSRFToken();
    sessionStorage.setItem('csrf_token', csrfToken);
    
    // Add CSRF token to all form submissions
    document.querySelectorAll('form').forEach(form => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'csrf_token';
      input.value = csrfToken;
      form.appendChild(input);
    });
  }
  
  // Generate CSRF Token
  generateCSRFToken() {
    return 'csrf_' + Math.random().toString(36).substr(2, 9);
  }
  
  // XSS Protection - Sanitize user input
  initializeXSSProtection() {
    document.addEventListener('submit', (e) => {
      if (e.target.tagName === 'FORM') {
        e.target.querySelectorAll('input, textarea').forEach(input => {
          input.value = this.sanitizeInput(input.value);
        });
      }
    });
  }
  
  sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }
  
  // Initialize security headers
  initializeSecurityHeaders() {
    // Set security-related meta tags
    const metaTags = [
      { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { 'http-equiv': 'Content-Security-Policy', content: "default-src 'self'; script-src 'self' https://www.gstatic.com https://unpkg.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://unpkg.com" }
    ];
    
    metaTags.forEach(tag => {
      if (!document.querySelector(`meta[${Object.keys(tag)[0]}]`)) {
        const meta = document.createElement('meta');
        Object.entries(tag).forEach(([key, value]) => {
          meta.setAttribute(key, value);
        });
        document.head.appendChild(meta);
      }
    });
  }
  
  // Validate forms before submission
  validateFormSecurity(form) {
    const csrfToken = sessionStorage.getItem('csrf_token');
    const formCSRFToken = form.querySelector('input[name="csrf_token"]')?.value;
    
    if (!csrfToken || csrfToken !== formCSRFToken) {
      console.error('CSRF token validation failed');
      return false;
    }
    return true;
  }
}

// Initialize security enhancements
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.securityEnhancements = new SecurityEnhancements();
  });
} else {
  window.securityEnhancements = new SecurityEnhancements();
}

export { SecurityEnhancements };
