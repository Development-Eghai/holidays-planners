/**
 * Prerender Script for SEO Optimization
 * ────────────────────────────────────
 * Pre-renders key pages at build time for crawlers.
 * This ensures Google & AI bots see fully-rendered HTML without JS.
 *
 * Run: npm run prerender
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '..', 'dist');
const PRERENDER_DIR = path.join(DIST_DIR, 'prerender');

// URLs to prerender — focus on high-traffic, low-change pages
const PAGES_TO_PRERENDER = [
  '/',
  '/triplist',
  '/destinations',
  '/blog',
  '/about',
  '/contact',
  '/destinfo/honeymoon',
  '/destinfo/family',
  '/destinfo/office',
];

// Additional dynamic pages can be added by the API, for now we use top static routes

async function prerender() {
  console.log('🚀 Starting prerender...\n');

  // Create prerender directory
  if (!fs.existsSync(PRERENDER_DIR)) {
    fs.mkdirSync(PRERENDER_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const page of PAGES_TO_PRERENDER) {
      try {
        console.log(`  📄 Prerendering: ${page}`);

        const pageInstance = await browser.newPage();
        const url = `http://localhost:5173${page}`;

        // Wait for all network requests to settle (waits for data loads)
        await pageInstance.goto(url, {
          waitUntil: 'networkidle2',
          timeout: 30000,
        });

        // Wait for React to finish rendering (optional: wait for specific elements)
        await pageInstance.waitForTimeout(2000);

        // Get the fully-rendered HTML
        const html = await pageInstance.content();

        // Save to static file structure
        const fileName = page === '/' ? 'index.html' : `${page.replace(/^\//, '').replace(/\/$/, '')}.html`;
        const filePath = path.join(PRERENDER_DIR, fileName);

        // Create subdirectories if needed
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filePath, html, 'utf-8');
        console.log(`    ✓ Saved to: ${filePath}\n`);

        await pageInstance.close();
      } catch (err) {
        console.warn(`    ⚠ Failed to prerender ${page}:`, err.message);
      }
    }
  } finally {
    await browser.close();
  }

  console.log('✅ Prerendering complete!\n');
  console.log('📍 Prerendered files are in:', PRERENDER_DIR);
  console.log('   Deploy with: cp -r dist/prerender/* dist/\n');
}

// Run prerender
prerender().catch(err => {
  console.error('❌ Prerender failed:', err);
  process.exit(1);
});
