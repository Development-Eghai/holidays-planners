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

// Serve static files (CSS, JS, images)
app.use(express.static(DIST_DIR, {
  maxAge: '1y',
  etag: false,
  setHeaders: (res, path) => {
    // Don't cache HTML files
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=3600');
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
 * - Crawlers: serve HTML with meta tags (from prerender or dynamically)
 * - Browsers: serve SPA (index.html)
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
    // Converts /trip-preview/slug/123 → /prerender/trip-preview-slug-123.html (or similar)
    let prerenderedPath = null;
    if (isBotRequest) {
      // Try to find prerendered file
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
      const html = fs.readFileSync(indexPath, 'utf-8');
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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✅ SSR Server running on port ${PORT}`);
  console.log(`   - Crawlers get prerendered HTML or SPA`);
  console.log(`   - Browsers get SPA (lighter)\n`);
});
