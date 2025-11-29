/**
 * Language Detection and Fallback System
 * Handles language routing and fallback to English if French page is not available
 */

(function() {
    'use strict';

    // Get current path and language
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(part => part);
    const urlParams = new URLSearchParams(window.location.search);
    const isFallback = urlParams.get('fallback') === 'en';
    
    // Determine current language (if fallback, we're showing English)
    let currentLang = 'en';
    if (pathParts[0] === 'fr' && !isFallback) {
        currentLang = 'fr';
    }
    
    // Get path without language prefix
    const pathWithoutLang = pathParts[0] === 'fr' || pathParts[0] === 'en' 
        ? '/' + pathParts.slice(1).join('/')
        : currentPath;
    
    /**
     * Check if a page exists
     */
    async function checkPageExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Check if French page exists and show English version with notice if not
     */
    async function handleLanguageFallback() {
        // Check if we're accessing a French URL
        const urlParams = new URLSearchParams(window.location.search);
        const isFallback = urlParams.get('fallback') === 'en';
        
        // If we're on a French URL, check if the page exists
        if (currentLang === 'fr' && !isFallback) {
            const englishPath = pathWithoutLang === '/' 
                ? '/en/index.html'
                : `/en${pathWithoutLang}.html`;
            
            // Check if French page exists
            const frenchPath = pathWithoutLang === '/'
                ? '/fr/index.html'
                : `/fr${pathWithoutLang}.html`;
            
            const frenchExists = await checkPageExists(frenchPath);
            
            if (!frenchExists) {
                // Redirect to English version with fallback parameter
                const separator = englishPath.includes('?') ? '&' : '?';
                window.location.href = englishPath + separator + 'fallback=en';
                return;
            }
        }
        
        // Show fallback notice if we're displaying English as fallback
        if (isFallback) {
            showFallbackNotice();
        }
    }
    
    /**
     * Display a notice banner indicating English version is shown
     */
    function showFallbackNotice() {
        const notice = document.createElement('div');
        notice.className = 'language-fallback-notice';
        notice.setAttribute('data-i18n-notice', 'fallback.notice');
        notice.innerHTML = '<span data-i18n="fallback.message">This page is not available in French. Showing English version.</span> <button class="close-notice" onclick="this.parentElement.remove()" aria-label="Close">×</button>';
        
        // Insert after header
        const header = document.querySelector('header');
        if (header) {
            header.insertAdjacentElement('afterend', notice);
        } else {
            document.body.insertBefore(notice, document.body.firstChild);
        }
        
        // Update language switcher to show we're on English (even though URL was /fr/)
        const langLinks = document.querySelectorAll('.language-switcher a');
        langLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-lang') === 'en') {
                link.classList.add('active');
            }
        });
    }
    
    /**
     * Initialize language system
     */
    function init() {
        // Set active language in switcher
        const langLinks = document.querySelectorAll('.language-switcher a');
        langLinks.forEach(link => {
            if (link.getAttribute('data-lang') === currentLang) {
                link.classList.add('active');
            }
        });
        
        // Handle language fallback on page load
        handleLanguageFallback();
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export for use in other scripts
    window.LanguageSystem = {
        currentLang: currentLang,
        switchLanguage: function(lang) {
            const newPath = lang === 'en' 
                ? `/en${pathWithoutLang === '/' ? '' : pathWithoutLang}.html`
                : `/fr${pathWithoutLang === '/' ? '' : pathWithoutLang}.html`;
            window.location.href = newPath;
        }
    };
})();

