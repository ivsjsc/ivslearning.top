// Language initialization script
// This file sets up the default language preference

(function() {
  const LANGUAGE_KEY = 'ivs_language_preference';
  const DEFAULT_LANGUAGE = 'vi';
  
  // Get user's preferred language or use Vietnamese by default
  function initializeLanguage() {
    let language = localStorage.getItem(LANGUAGE_KEY);
    
    if (!language) {
      // Try to use browser language, fallback to Vietnamese
      const browserLang = navigator.language || navigator.userLanguage;
      language = browserLang.startsWith('en') ? 'en' : DEFAULT_LANGUAGE;
      localStorage.setItem(LANGUAGE_KEY, language);
    }
    
    // Set document language
    document.documentElement.lang = language;
    
    // Store in global object
    window.currentLanguage = language;
    
    return language;
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanguage);
  } else {
    initializeLanguage();
  }
})();
