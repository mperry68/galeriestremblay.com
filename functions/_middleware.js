/**
 * Cloudflare Pages Middleware
 * Handles language routing and fallback
 */

export async function onRequest(context) {
    const { request, next } = context;
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Skip middleware for static assets
    if (pathname.startsWith('/assets/') || pathname.startsWith('/shared/')) {
        return next();
    }

    // If accessing root, redirect to language-specific version
    if (pathname === '/' || pathname === '/index.html') {
        const acceptLanguage = request.headers.get('accept-language') || 'en';
        const preferredLang = acceptLanguage.startsWith('fr') ? 'fr' : 'en';
        return Response.redirect(new URL(`/${preferredLang}/`, url), 302);
    }

    // Check if French page exists, fallback to English with clear indication
    if (pathname.startsWith('/fr/')) {
        const englishPath = pathname.replace('/fr/', '/en/');
        const frenchPath = pathname;
        
        // Try to fetch French page
        const frenchResponse = await fetch(new URL(frenchPath, url.origin));
        
        // If French page doesn't exist (404), redirect to English with fallback parameter
        if (!frenchResponse.ok && frenchResponse.status === 404) {
            const englishUrl = new URL(englishPath, url.origin);
            englishUrl.searchParams.set('fallback', 'en');
            return Response.redirect(englishUrl, 302);
        }
    }

    return next();
}

