# Galerie Tremblay Website

A bilingual (English/French) website for Galerie Tremblay, hosted on Cloudflare Pages.

## Structure

```
/
├── assets/              # Static assets
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   └── images/         # Image files (to be added)
├── shared/             # Shared components
│   ├── header.html     # Standardized header
│   └── footer.html     # Standardized footer
├── en/                 # English pages
│   └── index.html      # English homepage
├── fr/                 # French pages
│   └── index.html      # French homepage
├── functions/          # Cloudflare Functions
│   └── _middleware.js  # Language routing middleware
├── index.html          # Root redirect page
├── _redirects          # Cloudflare Pages redirects
└── wrangler.toml       # Cloudflare configuration
```

## Features

- **Bilingual Support**: English and French language versions
- **Language Fallback**: Automatically displays English version with a clear notice banner if French page is not available
- **Standardized Components**: Shared header and footer across all pages
- **Responsive Design**: Mobile-friendly layout
- **Cloudflare Pages Ready**: Configured for Cloudflare Pages deployment
- **Visual Fallback Indicator**: Yellow notice banner appears when English version is shown due to missing French page

## Adding New Pages

1. Create the English version in `/en/` directory (e.g., `/en/gallery.html`)
2. Create the French version in `/fr/` directory (e.g., `/fr/gallery.html`)
3. If French version is missing, users will automatically be redirected to English version

## Adding Assets

- Place images in `/assets/images/`
- Place additional CSS in `/assets/css/`
- Place additional JavaScript in `/assets/js/`

## Deployment

This site is configured for Cloudflare Pages. Simply connect your repository to Cloudflare Pages and deploy.

## Language System

The site uses:
- `language.js` for language detection and fallback
- `i18n.js` for text translation
- Cloudflare middleware for server-side language routing

### Fallback Behavior

When a French page is not available:
1. User is automatically redirected to the English version
2. A yellow notice banner appears at the top indicating "This page is not available in French. Showing English version."
3. The URL includes a `?fallback=en` parameter to track the fallback state
4. The language switcher correctly shows English as the active language

