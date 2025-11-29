/**
 * Internationalization (i18n) System
 * Handles translation of text content
 */

(function() {
    'use strict';

    const translations = {
        en: {
            'nav.home': 'Home',
            'nav.artists': 'Artists',
            'nav.exhibitions': 'Exhibitions',
            'nav.about': 'About',
            'nav.contact': 'Contact',
            'footer.about': 'About',
            'footer.description': 'Galerie Tremblay - A premier art gallery showcasing exceptional works from contemporary artists.',
            'footer.quickLinks': 'Quick Links',
            'footer.contact': 'Contact',
            'footer.address': '186 Pl. Sutton<br>Beaconsfield, QC H9W 5S3<br>Canada',
            'footer.rights': 'All rights reserved.',
            'fallback.message': 'This page is not available in French. Showing English version.',
            'fallback.notice': 'Language Notice'
        },
        fr: {
            'nav.home': 'Accueil',
            'nav.artists': 'Artistes',
            'nav.exhibitions': 'Expositions',
            'nav.about': 'À propos',
            'nav.contact': 'Contact',
            'footer.about': 'À propos',
            'footer.description': 'Galerie Tremblay - Une galerie d\'art de premier plan présentant des œuvres exceptionnelles d\'artistes contemporains.',
            'footer.quickLinks': 'Liens rapides',
            'footer.contact': 'Contact',
            'footer.address': '186 Pl. Sutton<br>Beaconsfield, QC H9W 5S3<br>Canada',
            'footer.rights': 'Tous droits réservés.',
            'fallback.message': 'Cette page n\'est pas disponible en français. Affichage de la version anglaise.',
            'fallback.notice': 'Avis de langue'
        }
    };

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
     * Translate all elements with data-i18n attribute
     */
    function translatePage() {
        const lang = getCurrentLanguage();
        const langTranslations = translations[lang] || translations.en;
        
        // Check if we're showing English as fallback (should use English translations)
        const urlParams = new URLSearchParams(window.location.search);
        const isFallback = urlParams.get('fallback') === 'en';
        const effectiveLang = isFallback ? 'en' : lang;
        const effectiveTranslations = translations[effectiveLang] || translations.en;
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = effectiveTranslations[key];
            
            if (translation) {
                if (element.tagName === 'INPUT' && element.type === 'submit') {
                    element.value = translation;
                } else if (element.hasAttribute('placeholder')) {
                    element.placeholder = translation;
                } else {
                    element.innerHTML = translation;
                }
            }
        });
        
        // Translate fallback notice if it exists
        const fallbackNotice = document.querySelector('.language-fallback-notice');
        if (fallbackNotice) {
            const noticeText = fallbackNotice.querySelector('[data-i18n="fallback.message"]');
            if (noticeText) {
                noticeText.textContent = effectiveTranslations['fallback.message'];
            }
        }
    }

    /**
     * Initialize i18n system
     */
    function init() {
        translatePage();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for use in other scripts
    window.i18n = {
        translate: translatePage,
        getLanguage: getCurrentLanguage
    };
})();

