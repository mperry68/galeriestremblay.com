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
                return Promise.resolve();
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
            return Promise.resolve();
        } catch (error) {
            console.error(`Error loading ${filePath}:`, error);
            return Promise.resolve();
        }
    }

    // Track if mobile menu is initialized
    let mobileMenuInitialized = false;

    /**
     * Initialize mobile menu functionality
     */
    function initMobileMenu() {
        if (mobileMenuInitialized) {
            return;
        }
        
        // Wait a bit for DOM to be ready
        setTimeout(() => {
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            const mainNav = document.querySelector('.main-nav');
            const dropdowns = document.querySelectorAll('.dropdown');
            
            if (!menuToggle || !mainNav) {
                return;
            }
            
            mobileMenuInitialized = true;
            
            // Toggle main menu
            menuToggle.addEventListener('click', function() {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', !isExpanded);
                mainNav.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                if (!isExpanded) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
            
            // Handle dropdown menus on mobile
            dropdowns.forEach(dropdown => {
                const dropdownLink = dropdown.querySelector('a');
                if (dropdownLink) {
                    dropdownLink.addEventListener('click', function(e) {
                        // Only prevent default on mobile
                        if (window.innerWidth <= 768) {
                            e.preventDefault();
                            dropdown.classList.toggle('active');
                        }
                    });
                }
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (mainNav.classList.contains('active') && 
                    !mainNav.contains(e.target) && 
                    !menuToggle.contains(e.target)) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    mainNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
            
            // Close menu when clicking on a link (navigation)
            const navLinks = mainNav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    // Only close if it's not a dropdown parent
                    if (!this.parentElement.classList.contains('dropdown') || 
                        this.parentElement.classList.contains('active')) {
                        menuToggle.setAttribute('aria-expanded', 'false');
                        mainNav.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            });
            
            // Close menu on window resize if it becomes desktop view
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    mainNav.classList.remove('active');
                    document.body.style.overflow = '';
                    dropdowns.forEach(dropdown => {
                        dropdown.classList.remove('active');
                    });
                }
            });
        }, 100);
    }

    /**
     * Initialize page
     */
    async function init() {
        // Load header and footer
        await loadComponent('header-placeholder', '/shared/header.html');
        // Initialize mobile menu after header is loaded
        initMobileMenu();
        loadComponent('footer-placeholder', '/shared/footer.html');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

