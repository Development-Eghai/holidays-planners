/**
 * Hybrid SSR + SPA Server for Holidays Planners
 * ─────────────────────────────────────────────
 * - Detects crawlers (Google, Bing, AI bots) and serves prerendered HTML
 * - Serves SPA for browsers
 * - Falls back to SPA if prerender unavailable
 *
 * Deploy alongside your Vite build
 * Usage:
 *   npm run serve:ssr
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, 'dist');

// Crawlers/bots that need server-rendered HTML
const CRAWLER_USER_AGENTS = [
  // Google
  'Googlebot',
  'Googlebot-mobile',
  'Googlebot-Image',
  'Google-Inspectiontool',
  'Googlebot-News',
  'Googlebot-Video',
  'Google-Favicon',
  'Google-Extended',
  'AdsBot-Google',

  // Bing
  'Bingbot',
  'Mobile Bing',
  'BingPreview',
  'Slurp',

  // Yandex
  'YandexBot',
  'YandexMobileBot',

  // DuckDuckGo
  'DuckDuckBot',

  // AI/LLM Crawlers
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'PerplexityBot',
  'Bytespider',
  'CCBot',
  'Applebot',
  'Applebot-Extended',

  // SEO Tools
  'SemrushBot',
  'AhrefsBot',
  'MJ12Bot',
  'SEMrushBot',
  'Screaming Frog',
];

const isCrawler = (userAgent) => {
  if (!userAgent) return false;
  return CRAWLER_USER_AGENTS.some(bot => userAgent.includes(bot));
};

const app = express();

/**
 * ─────────────────────────────────────────────────────────
 * SECURITY MIDDLEWARE: Essential Headers for Production SEO
 * ─────────────────────────────────────────────────────────
 * These headers protect against XSS, clickjacking, MIME sniffing,
 * and ensure HTTPS-only communication. Critical for search ranking.
 */
app.use((req, res, next) => {
  // 1. STRICT TRANSPORT SECURITY (HSTS)
  // Forces HTTPS for 1 year; includeSubDomains applies to all subdomains
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // 2. CONTENT SECURITY POLICY (CSP)
  // Prevents XSS attacks by restricting resource sources
  // Adjust script-src if using external analytics (Googlebot, GA4, etc.)
  res.setHeader(
    'Content-Security-Policy',
    `default-src 'self' https:; 
     script-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:;
     style-src 'self' 'unsafe-inline' https:;
     img-src 'self' https: data:;
     font-src 'self' https: data:;
     connect-src 'self' https:;
     frame-ancestors 'self';
     base-uri 'self';
     form-action 'self'`.replace(/\s+/g, ' ')
  );

  // 3. X-FRAME-OPTIONS (Clickjacking Protection)
  // SAMEORIGIN: allows framing only from same origin
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // 4. X-CONTENT-TYPE-OPTIONS (MIME Sniffing Protection)
  // Prevents browser from guessing file types (e.g., execute JS as CSS)
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // 5. REFERRER-POLICY (Privacy & Security)
  // strict-origin-when-cross-origin: full URL on same site, only origin on cross-site
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 6. PERMISSIONS-POLICY (Feature Control)
  // Disable camera, microphone, geolocation unless explicitly needed
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=()'
  );

  next();
});

// Serve static files (CSS, JS, images)
app.use(express.static(DIST_DIR, {
  maxAge: '1y',
  etag: false,
  setHeaders: (res, path) => {
    // Don't cache HTML files to ensure fresh content + meta tags
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
    // Cache CSS/JS for 1 year (fingerprinted by Vite)
    if (path.endsWith('.css') || path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // Cache images for 1 month
    if (/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(path)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000');
    }
  },
}));

/**
 * Render page metadata server-side for crawlers
 * Fetches initial data from API, generates meta tags using SEO utility
 */
async function renderPageForCrawler(pathname) {
  try {
    // For now, serve the SPA index which has react-helmet configured
    // In production, you'd pre-render or fetch data here
    const indexPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      return fs.readFileSync(indexPath, 'utf-8');
    }
  } catch (err) {
    console.error('Error rendering page:', err.message);
  }
  return null;
}

/**
 * Route Handler
 * - Crawlers: serve HTML with INJECTED meta tags (server-side)
 * - Browsers: serve SPA with Helmet (client-side)
 */
app.use('*', async (req, res) => {
  try {
    const userAgent = req.headers['user-agent'] || '';
    const isBotRequest = isCrawler(userAgent);

    // For debugging: log crawler visits
    if (isBotRequest) {
      console.log(`🤖 Bot visit: ${userAgent.substring(0, 50)}... → ${req.path}`);
    }

    // Prevent rendering admin routes
    if (req.path.startsWith('/admin/') || req.path.startsWith('/api/')) {
      res.status(404).send('Not Found');
      return;
    }

    // Check if we have a prerendered version from build
    let prerenderedPath = null;
    if (isBotRequest) {
      const normalized = req.path === '/' ? 'index' : req.path.replace(/^\//, '').replace(/\//g, '-');
      prerenderedPath = path.join(DIST_DIR, 'prerender', `${normalized}.html`);

      if (fs.existsSync(prerenderedPath)) {
        console.log(`  ✓ Serving prerendered: ${prerenderedPath}`);
        const html = fs.readFileSync(prerenderedPath, 'utf-8');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.end(html);
        return;
      }
    }

    // Fallback: serve SPA (index.html)
    const indexPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      let html = fs.readFileSync(indexPath, 'utf-8');

      // FOR CRAWLERS: Inject server-side meta tags
      if (isBotRequest) {
        html = injectMetaTags(html, req.path);
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', isBotRequest ? 'public, max-age=3600' : 'private, max-age=0');
      res.end(html);
      return;
    }

    // If no index.html, 404
    res.status(404).send('Not Found');
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * Inject per-page meta tags server-side for crawler visibility
 * Reads metadata.json and replaces default tags in template
 */
function injectMetaTags(html, pathname) {
  try {
    // Try to load metadata.json (generated by scripts/generate-metadata.js)
    const metadataPath = path.join(DIST_DIR, '..', 'public', 'metadata.json');
    if (!fs.existsSync(metadataPath)) {
      console.warn('⚠ metadata.json not found, using default tags');
      return html;
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    const pageMetadata = metadata[pathname] || metadata['/'];

    if (!pageMetadata) {
      return html;
    }

    // Replace title
    html = html.replace(
      /<title>[^<]*<\/title>/i,
      `<title>${escapeHtml(pageMetadata.title)}</title>`
    );

    // Replace or add description meta tag
    const descriptionTag = `<meta name="description" content="${escapeHtml(pageMetadata.description)}" />`;
    if (html.includes('<meta name="description"')) {
      html = html.replace(
        /<meta name="description"[^>]*>/i,
        descriptionTag
      );
    } else {
      html = html.replace(/<\/head>/i, `${descriptionTag}\n</head>`);
    }

    // Replace or add keywords meta tag
    if (pageMetadata.keywords) {
      const keywordsTag = `<meta name="keywords" content="${escapeHtml(pageMetadata.keywords)}" />`;
      if (html.includes('<meta name="keywords"')) {
        html = html.replace(
          /<meta name="keywords"[^>]*>/i,
          keywordsTag
        );
      } else {
        html = html.replace(/<\/head>/i, `${keywordsTag}\n</head>`);
      }
    }

    // Replace canonical
    if (pageMetadata.canonical) {
      html = html.replace(
        /<link rel="canonical"[^>]*>/i,
        `<link rel="canonical" href="${pageMetadata.canonical}" />`
      );
    }

    // Replace OG tags
    if (pageMetadata.ogTitle) {
      const ogTitleTag = `<meta property="og:title" content="${escapeHtml(pageMetadata.ogTitle)}" />`;
      html = html.replace(
        /<meta property="og:title"[^>]*>/i,
        ogTitleTag
      );
    }

    if (pageMetadata.ogDescription) {
      const ogDescTag = `<meta property="og:description" content="${escapeHtml(pageMetadata.ogDescription)}" />`;
      html = html.replace(
        /<meta property="og:description"[^>]*>/i,
        ogDescTag
      );
    }

    if (pageMetadata.ogImage) {
      const ogImageTag = `<meta property="og:image" content="${pageMetadata.ogImage}" />`;
      html = html.replace(
        /<meta property="og:image"[^>]*>/i,
        ogImageTag
      );
    }

    console.log(`  ✓ Injected meta tags for ${pathname}`);
    return html;
  } catch (err) {
    console.error('Error injecting meta tags:', err.message);
    return html; // Return unmodified HTML on error
  }
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✅ SSR Server running on port ${PORT}`);
  console.log(`   - Crawlers get prerendered HTML or SPA`);
  console.log(`   - Browsers get SPA (lighter)\n`);
});
