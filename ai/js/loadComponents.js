// Component Loader - Dynamically load components from AI system
// This file loads shared components like header, footer, navigation

class ComponentLoader {
  constructor() {
    this.componentsLoaded = false;
    this.init();
  }
  
  async init() {
    try {
      // Load shared components if needed
      await this.loadComponents();
    } catch (error) {
      console.error('Error loading components:', error);
    }
  }
  
  async loadComponents() {
    // Try to load from AI components directory
    const components = [
      { id: 'header-container', src: '/ai/components/header.html' },
      { id: 'footer-container', src: '/ai/components/footer.html' },
      { id: 'sidebar-container', src: '/ai/components/sidebar.html' }
    ];
    
    for (const component of components) {
      const container = document.getElementById(component.id);
      if (container) {
        try {
          const response = await fetch(component.src);
          if (response.ok) {
            container.innerHTML = await response.text();
          }
        } catch (error) {
          console.warn(`Could not load component: ${component.id}`, error);
        }
      }
    }
    
    this.componentsLoaded = true;
  }
  
  // Dynamically load a component
  async loadComponent(containerId, componentPath) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID ${containerId} not found`);
      return false;
    }
    
    try {
      const response = await fetch(componentPath);
      if (response.ok) {
        container.innerHTML = await response.text();
        return true;
      }
    } catch (error) {
      console.error(`Error loading component: ${componentPath}`, error);
    }
    
    return false;
  }
}

// Initialize component loader
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.componentLoader = new ComponentLoader();
  });
} else {
  window.componentLoader = new ComponentLoader();
}
