/**
 * Main JavaScript file
 * Handles common functionality and includes header/footer
 */

(function() {
    'use strict';

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

