/**
 * Main JavaScript file
 * Handles common functionality and includes header/footer
 */

(function() {
    'use strict';

    /**
     * Get current language from URL
     */
    function getCurrentLanguage() {
        const path = window.location.pathname;
        if (path.startsWith('/fr/')) {
            return 'fr';
        }
        return 'en';
    }

    /**
     * Update navigation links to match current language
     */
    function updateNavigationLinks() {
        const currentLang = getCurrentLanguage();
        const langPrefix = currentLang === 'fr' ? '/fr' : '/en';
        
        // Update all navigation links (header and footer)
        const allLinks = document.querySelectorAll('nav a[href^="/en/"], nav a[href^="/fr/"], footer a[href^="/en/"], footer a[href^="/fr/"]');
        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                // Replace /en/ or /fr/ with current language prefix
                const newHref = href.replace(/^\/(en|fr)\//, langPrefix + '/');
                link.setAttribute('href', newHref);
            }
        });
        
        // Update logo link
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.setAttribute('href', langPrefix === '/fr' ? '/fr/' : '/en/');
        }
        
        // Update language switcher links
        const langSwitcherLinks = document.querySelectorAll('.language-switcher a');
        langSwitcherLinks.forEach(link => {
            const lang = link.getAttribute('data-lang');
            if (lang) {
                const currentPath = window.location.pathname;
                const pathParts = currentPath.split('/').filter(part => part);
                const pathWithoutLang = pathParts[0] === 'fr' || pathParts[0] === 'en' 
                    ? '/' + pathParts.slice(1).join('/')
                    : currentPath;
                
                // Handle index pages
                if (pathWithoutLang === '/' || pathWithoutLang === '') {
                    const newPath = lang === 'en' ? '/en/' : '/fr/';
                    link.setAttribute('href', newPath);
                } else {
                    // Remove .html extension if present, then add language prefix
                    const cleanPath = pathWithoutLang.replace(/\.html$/, '');
                    const newPath = lang === 'en' 
                        ? `/en${cleanPath}.html`
                        : `/fr${cleanPath}.html`;
                    link.setAttribute('href', newPath);
                }
            }
        });
    }

    /**
     * Load HTML component (header/footer)
     */
    async function loadComponent(elementId, filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                console.warn(`Could not load ${filePath}`);
                return;
            }
            const html = await response.text();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
                
                // Update navigation links to match current language (for both header and footer)
                updateNavigationLinks();
                
                // Re-initialize scripts after loading
                if (window.i18n) {
                    window.i18n.translate();
                }
                if (window.LanguageSystem) {
                    // Language system will auto-initialize
                }
            }
        } catch (error) {
            console.error(`Error loading ${filePath}:`, error);
        }
    }

    /**
     * Initialize page
     */
    function init() {
        // Load header and footer
        loadComponent('header-placeholder', '/shared/header.html');
        loadComponent('footer-placeholder', '/shared/footer.html');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

