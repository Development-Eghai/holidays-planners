/**
 * Dynamic Sitemap Generator for Holidays Planners
 * ------------------------------------------------
 * Fetches all dynamic content from the API (trips, destinations, 
 * landing pages, blog posts, categories) and writes public/sitemap.xml
 *
 * Run:  node scripts/generate-sitemap.js
 * Hook: runs automatically via "prebuild" in package.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

const BASE_URL   = 'https://www.holidaysplanners.com';
const API_BASE   = 'https://api.yaadigo.com/secure/api';
const API_KEY    = 'x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ';
const TODAY      = new Date().toISOString().split('T')[0];

const headers = { 'x-api-key': API_KEY, 'Content-Type': 'application/json' };

// ─── Helpers ────────────────────────────────────────────────────────────────

function slugify(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function safeFetch(url) {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json;
  } catch (e) {
    console.warn(`  ⚠ Could not fetch ${url}: ${e.message}`);
    return null;
  }
}

function urlEntry(loc, { changefreq = 'weekly', priority = '0.5', lastmod = TODAY } = {}) {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

// ─── Static pages ───────────────────────────────────────────────────────────

const STATIC_PAGES = [
  { path: '/',             changefreq: 'daily',   priority: '1.0' },
  { path: '/triplist',     changefreq: 'daily',   priority: '0.9' },
  { path: '/destinations', changefreq: 'weekly',  priority: '0.85' },
  { path: '/blog',         changefreq: 'weekly',  priority: '0.75' },
  { path: '/about',        changefreq: 'monthly', priority: '0.6' },
  { path: '/contact',      changefreq: 'monthly', priority: '0.6' },
  { path: '/destinfo/honeymoon', changefreq: 'weekly', priority: '0.8' },
  { path: '/destinfo/family',    changefreq: 'weekly', priority: '0.8' },
  { path: '/destinfo/office',    changefreq: 'weekly', priority: '0.75' },
  { path: '/terms',        changefreq: 'yearly',  priority: '0.3' },
  { path: '/privacy',      changefreq: 'yearly',  priority: '0.3' },
];

// ─── Dynamic page fetchers ───────────────────────────────────────────────────

async function getTripUrls() {
  const urls = [];
  try {
    // Try paginated fetch
    let page = 1, totalPages = 1;
    while (page <= totalPages) {
      const data = await safeFetch(`${API_BASE}/trips/?page=${page}&per_page=100`);
      if (!data) break;
      const trips = data.trips || data.data || (Array.isArray(data) ? data : []);
      totalPages = data.total_pages || data.pagination?.total_pages || 1;

      for (const trip of trips) {
        if (!trip.is_active && trip.is_active !== undefined) continue;
        const slug = trip.slug || slugify(trip.title || trip.name || '');
        const id   = trip.id || trip._id;
        if (!slug || !id) continue;
        const lastmod = trip.updated_at
          ? new Date(trip.updated_at).toISOString().split('T')[0]
          : TODAY;
        urls.push(urlEntry(`${BASE_URL}/trip-preview/${slug}/${id}`, {
          changefreq: 'weekly', priority: '0.85', lastmod
        }));
      }
      page++;
    }
  } catch (e) {
    console.warn('  ⚠ Trip fetch failed:', e.message);
  }
  console.log(`  ✓ Trips: ${urls.length} URLs`);
  return urls;
}

async function getDestinationUrls() {
  const urls = [];
  try {
    const data = await safeFetch(`${API_BASE}/destinations/?per_page=200`);
    const destinations = data?.data || data?.destinations || (Array.isArray(data) ? data : []);

    for (const dest of destinations) {
      const slug = dest.slug || slugify(dest.name || '');
      const id   = dest.id || dest._id;
      if (!slug || !id) continue;
      const lastmod = dest.updated_at
        ? new Date(dest.updated_at).toISOString().split('T')[0]
        : TODAY;
      urls.push(urlEntry(`${BASE_URL}/destination/${slug}/${id}`, {
        changefreq: 'weekly', priority: '0.8', lastmod
      }));
    }
  } catch (e) {
    console.warn('  ⚠ Destination fetch failed:', e.message);
  }
  console.log(`  ✓ Destinations: ${urls.length} URLs`);
  return urls;
}

async function getLandingPageUrls() {
  const urls = [];
  try {
    // Try the same endpoint params that Landingpagerenderer.jsx uses
    const data = await safeFetch(`${API_BASE}/landing-pages?per_page=100`)
              || await safeFetch(`${API_BASE}/landing-pages/?page=1&per_page=100`)
              || await safeFetch(`${API_BASE}/landing-pages`);
    if (!data) return urls;
    const pages = data?.pages || data?.data || (Array.isArray(data) ? data : []);

    for (const page of pages) {
      if (page.is_active === false) continue;
      const slug = page.slug;
      if (!slug) continue;
      const lastmod = page.updated_at
        ? new Date(page.updated_at).toISOString().split('T')[0]
        : TODAY;
      // Canonical = /tours/ (SEO-clean), not /landing/
      urls.push(urlEntry(`${BASE_URL}/tours/${slug}`, {
        changefreq: 'weekly', priority: '0.9', lastmod
      }));
    }
  } catch (e) {
    console.warn('  ⚠ Landing page fetch failed:', e.message);
  }
  console.log(`  ✓ Landing pages: ${urls.length} URLs`);
  return urls;
}

async function getBlogUrls() {
  const urls = [];
  try {
    const data = await safeFetch(`${API_BASE}/blog-posts?per_page=500`);
    const posts = data?.posts || data?.data || (Array.isArray(data) ? data : []);

    for (const post of posts) {
      if (!post.is_published && post.is_published !== undefined) continue;
      const id = post.id || post._id;
      if (!id) continue;
      const slug = post.slug || slugify(post.title || '');
      const lastmod = post.updated_at
        ? new Date(post.updated_at).toISOString().split('T')[0]
        : TODAY;
      // Blog uses query-based routing currently  
      urls.push(urlEntry(`${BASE_URL}/blog?blogId=${id}`, {
        changefreq: 'monthly', priority: '0.65', lastmod
      }));
    }
  } catch (e) {
    console.warn('  ⚠ Blog fetch failed:', e.message);
  }
  console.log(`  ✓ Blog posts: ${urls.length} URLs`);
  return urls;
}

async function getCategoryUrls() {
  const urls = [];
  try {
    const data = await safeFetch(`${API_BASE}/categories/?per_page=100`);
    const categories = data?.data || data?.categories || (Array.isArray(data) ? data : []);

    for (const cat of categories) {
      const slug = cat.slug || slugify(cat.name || '');
      const id   = cat.id || cat._id;
      if (!slug || !id) continue;
      urls.push(urlEntry(`${BASE_URL}/category/${slug}/${id}`, {
        changefreq: 'weekly', priority: '0.75'
      }));
    }
  } catch (e) {
    console.warn('  ⚠ Category fetch failed:', e.message);
  }
  console.log(`  ✓ Categories: ${urls.length} URLs`);
  return urls;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function generateSitemap() {
  console.log('\n🗺  Generating sitemap.xml...');

  const staticEntries = STATIC_PAGES.map(p =>
    urlEntry(`${BASE_URL}${p.path}`, { changefreq: p.changefreq, priority: p.priority })
  );

  // Fetch all dynamic content in parallel
  const [tripUrls, destUrls, landingUrls, blogUrls, catUrls] = await Promise.all([
    getTripUrls(),
    getDestinationUrls(),
    getLandingPageUrls(),
    getBlogUrls(),
    getCategoryUrls(),
  ]);

  const allEntries = [
    ...staticEntries,
    ...landingUrls,   // Highest value — destination landing pages
    ...tripUrls,
    ...destUrls,
    ...catUrls,
    ...blogUrls,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  Dynamic Sitemap for Holidays Planners
  Generated: ${new Date().toISOString()}
  Total URLs: ${allEntries.length}
  
  This file is auto-generated on every build.
  Run manually: node scripts/generate-sitemap.js
-->
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${allEntries.join('\n')}
</urlset>
`;

  fs.writeFileSync(OUTPUT_PATH, xml, 'utf8');
  console.log(`\n✅ sitemap.xml written → public/sitemap.xml`);
  console.log(`   Total URLs: ${allEntries.length}`);
  console.log(`   Static: ${staticEntries.length} | Dynamic: ${allEntries.length - staticEntries.length}`);
  console.log(`\n📌 Submit to Google Search Console:`);
  console.log(`   https://www.holidaysplanners.com/sitemap.xml\n`);
}

generateSitemap().catch(err => {
  console.error('❌ Sitemap generation failed:', err);
  process.exit(1);
});
