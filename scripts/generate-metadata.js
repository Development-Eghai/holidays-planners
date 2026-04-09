/**
 * CRITICAL FIX: Server-Side Meta Tag Injection
 * 
 * The issue: React Helmet Async only works client-side (after JS executes).
 * Crawlers may not execute JS fully, so they see only DEFAULT meta tags.
 * 
 * Solution: Server injects per-page meta tags before serving HTML to crawlers.
 * 
 * This requires creating a metadata mapping file that server.js uses.
 */

// FILE: scripts/generate-metadata.js
// RUN: npm run generate-metadata (before build)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const METADATA_FILE = path.join(__dirname, '..', 'public', 'metadata.json');

const BASE_URL = 'https://www.holidaysplanners.com';

// Metadata templates for each page/route
const METADATA = {
  '/': {
    title: 'India Tour Packages 2025 | Himachal, Kashmir, Goa, Kerala & More | Holidays Planners',
    description: 'Explore handpicked India tour packages — Himachal Pradesh, Kashmir, Leh Ladakh, Goa, Kerala, Uttarakhand & more. Fixed & customised departures for families, couples & adventurers. Trusted since 2015.',
    keywords: 'India tour packages 2025, Himachal Pradesh tours, Kashmir packages, Leh Ladakh trips, Goa holiday packages, Kerala tour, travel agency Shimla',
    canonical: `${BASE_URL}/`,
    ogTitle: 'India Tour Packages 2025 | Holidays Planners',
    ogDescription: 'Himachal Pradesh, Kashmir, Leh Ladakh, Goa, Kerala & more. Fixed & customised departures. 15,000+ happy travellers since 2015.',
    ogImage: `${BASE_URL}/HolidaysPlanners-Logo-HP.png`,
  },
  '/triplist': {
    title: 'All India Tour Packages 2025 — Himachal, Kashmir, Goa, Ladakh | Holidays Planners',
    description: 'Browse 80+ India tour packages — Shimla Manali, Spiti Valley, Kashmir honeymoon, Leh Ladakh, Goa & Kerala. Filter by destination, duration or budget. Fixed & customised departures.',
    keywords: 'tour packages India 2025, Shimla Manali package, Spiti Valley itinerary, Kashmir tour, Leh Ladakh trip, budget tour India, family holiday packages',
    canonical: `${BASE_URL}/triplist`,
  },
  '/destinations': {
    title: 'Top Travel Destinations in India 2025 — Himachal, Kashmir, Goa & More | Holidays Planners',
    description: 'Discover India\'s most beautiful travel destinations — Shimla, Manali, Srinagar, Spiti Valley, Munnar, Andaman & more. Explore curated tour packages for every traveller type.',
    keywords: 'travel destinations India, Himachal Pradesh tourism, Kashmir destinations, Manali tourism, Spiti Valley, Goa beaches, Kerala backwaters',
    canonical: `${BASE_URL}/destinations`,
  },
  '/blog': {
    title: 'India Travel Blog — Guides, Tips & Itineraries | Holidays Planners',
    description: 'Read expert India travel guides, destination tips, budget itineraries & hidden gem stories. Himachal Pradesh, Kashmir, Leh Ladakh, Goa & more — all from India\'s travel experts since 2015.',
    keywords: 'India travel blog, Himachal Pradesh travel guide, Kashmir travel tips, Spiti Valley blog, Leh Ladakh itinerary, Goa travel guide',
    canonical: `${BASE_URL}/blog`,
  },
  '/about': {
    title: 'About Holidays Planners | Shimla\'s Trusted Travel Agency Since 2015',
    description: 'Meet the team behind Holidays Planners — 10+ years, 15,000+ happy travellers, 250+ destinations. Founded by Poonam Sharma in Shimla, H.P. Your expert travel partner for customised India tours.',
    keywords: 'about Holidays Planners, travel agency Shimla, Poonam Sharma travel agency, Himachal Pradesh tour operator, trusted travel company India',
    canonical: `${BASE_URL}/about`,
  },
  '/contact': {
    title: 'Contact Holidays Planners | Call +91-98162-59997 | Shimla, Himachal Pradesh',
    description: 'Plan your dream India holiday with Holidays Planners. Call +91-98162-59997 or email info@holidaysplanners.com. Office in Shimla, H.P. Mon–Fri 9am–6pm. Free consultation, quick quotes.',
    keywords: 'contact Holidays Planners, travel agency Shimla phone, tour operator Himachal Pradesh, book India tour, travel agent Shimla contact',
    canonical: `${BASE_URL}/contact`,
  },
  '/destinfo/honeymoon': {
    title: 'Honeymoon Tour Packages India 2025 — Kashmir, Himachal & Goa | Holidays Planners',
    description: 'Romantic honeymoon packages across India — Kashmir, Shimla Manali, Goa, Kerala & Andaman. Handpicked resorts, private transfers, couple activities. Plan your dream honeymoon with Holidays Planners.',
    keywords: 'honeymoon packages India, Kashmir honeymoon, Shimla Manali honeymoon, Goa honeymoon, Kerala honeymoon, romantic tour packages',
    canonical: `${BASE_URL}/destinfo/honeymoon`,
  },
  '/destinfo/family': {
    title: 'Family Holiday Packages India 2025 — Himachal, Goa & Kashmir | Holidays Planners',
    description: 'Fun-filled family holiday packages across India — Himachal Pradesh, Goa, Kashmir, Uttarakhand & more. Kid-friendly itineraries, comfortable stays, guided activities for all ages.',
    keywords: 'family holiday packages India, Himachal Pradesh family tour, Goa family package, Kashmir family trip, family trip India 2025',
    canonical: `${BASE_URL}/destinfo/family`,
  },
  '/destinfo/office': {
    title: 'Corporate Group Tours & MICE Travel India 2025 | Holidays Planners',
    description: 'Corporate retreats, team outings & MICE travel across India — Himachal Pradesh, Goa, Kashmir & more. Customised group packages, logistics & activities.',
    keywords: 'corporate tour India, MICE travel, group tour packages India, office trip Himachal Pradesh, corporate retreat Goa, team outing',
    canonical: `${BASE_URL}/destinfo/office`,
  },
};

// Write metadata.json
fs.writeFileSync(METADATA_FILE, JSON.stringify(METADATA, null, 2), 'utf-8');
console.log('✅ Metadata file generated:', METADATA_FILE);
