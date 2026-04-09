/**
 * seo.js — Central SEO utility for Holidays Planners
 * ─────────────────────────────────────────────────────
 * Single source of truth for all SEO data generation:
 *   - Unique meta titles (50-60 chars)
 *   - Unique meta descriptions (150-160 chars)
 *   - Keyword arrays
 *   - Canonical URLs
 *   - Descriptive image alt text
 *   - JSON-LD schema objects
 *
 * Consumed by: TripDetails, Landingpagerenderer, Destinations,
 *              CategoryPreview, Home, TripList, DestinationList,
 *              Blog, About, Contact
 */

const BASE_URL   = 'https://www.holidaysplanners.com';
const BRAND      = 'Holidays Planners';
const BRAND_LONG = 'Holidays Planners — Shimla, Himachal Pradesh';
const DEFAULT_OG = `${BASE_URL}/HolidaysPlanners-Logo-HP.png`;

// ─── Shared provider entity (re-used in every schema) ────────────────────────
export const PROVIDER = {
  '@type': 'TravelAgency',
  name: BRAND,
  url: BASE_URL,
  telephone: '+91-98162-59997',
  email: 'info@holidaysplanners.com',
  image: DEFAULT_OG,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kapil Niwas, Bye Pass Road, Chakkar',
    addressLocality: 'Shimla',
    addressRegion: 'Himachal Pradesh',
    postalCode: '171005',
    addressCountry: 'IN',
  },
  foundingDate: '2015',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Trim a string to `max` chars and add ellipsis if needed */
export function trim(str = '', max = 160) {
  if (!str) return '';
  const clean = str.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : `${clean.substring(0, max - 1)}…`;
}

/** Return absolute image URL (handles relative API paths) */
export function absImg(path) {
  if (!path) return DEFAULT_OG;
  if (path.startsWith('http')) return path;
  return `https://api.yaadigo.com/uploads/${path}`;
}

/** Format price in Indian style with ₹ */
export function fmt(price) {
  if (!price) return null;
  return `₹${Number(price).toLocaleString('en-IN')}`;
}

/** Derive duration label from days */
export function duration(days) {
  if (!days) return null;
  const nights = parseInt(days) - 1;
  return `${days}D/${nights}N`;
}

// ─── 1. TRIP DETAILS PAGE ─────────────────────────────────────────────────────

/**
 * Builds SEO payload for /trip-preview/:slug/:id
 * @param {object} tripData — raw API response from /trips/:id
 * @param {string} slug
 * @param {string|number} id
 */
export function buildTripSEO(tripData, slug, id) {
  if (!tripData) return null;

  const name      = tripData.title || tripData.name || 'Tour Package';
  const dest      = tripData.pickup_location || tripData.destination || tripData.destination_type || '';
  const days      = tripData.duration || tripData.total_days;
  const nights    = days ? parseInt(days) - 1 : null;
  const overview  = tripData.overview || tripData.description || '';
  const heroImg   = absImg(tripData.hero_image);
  const canonical = `${BASE_URL}/trip-preview/${slug}/${id}`;

  // Price extraction
  const price = tripData.pricing?.customized?.final_price
    || tripData.pricing?.fixed_departure?.[0]?.costingPackages?.[0]?.final_price
    || tripData.price
    || null;

  // Unique title: name + destination + duration
  const title = tripData.meta_title
    || (dest && days
      ? `${name} — ${days}D/${nights}N ${dest} | ${BRAND}`
      : `${name} | Tour Package | ${BRAND}`);

  // Unique description: lead with duration + price + CTA
  const desc = tripData.meta_description
    || (() => {
      const parts = [];
      if (days) parts.push(`${days} days ${nights} nights`);
      if (dest) parts.push(`in ${dest}`);
      if (price) parts.push(`from ${fmt(price)}`);
      const intro = parts.length ? `${name} — ${parts.join(' ')}.` : `${name}.`;
      const snippet = overview ? ` ${trim(overview, 80)}` : '';
      return trim(`${intro}${snippet} Book with ${BRAND}, trusted since 2015.`, 158);
    })();

  const keywords = [
    name,
    dest,
    `${dest} tour package`,
    `${dest} trip ${days} days`,
    days ? `${days} days ${nights} nights tour` : '',
    price ? `${dest} package ${fmt(price)}` : '',
    `India tour packages`,
    BRAND,
  ].filter(Boolean).join(', ');

  // Image alt
  const imageAlt = dest
    ? `${name} — ${days}D/${nights}N ${dest} tour package | ${BRAND}`
    : `${name} — India tour package | ${BRAND}`;

  // TouristTrip schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': canonical,
    name,
    description: overview || desc,
    url: canonical,
    image: heroImg ? { '@type': 'ImageObject', url: heroImg, description: imageAlt } : undefined,
    provider: PROVIDER,
    touristType: tripData.trip_type || ['Family', 'Couples', 'Adventure'],
    ...(days ? {
      itinerary: {
        '@type': 'ItemList',
        numberOfItems: parseInt(days),
        name: `${name} ${days}-Day Itinerary`,
      }
    } : {}),
    ...(price ? {
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'INR',
        lowPrice: String(price),
        offerCount: tripData.pricing?.fixed_departure?.length || 1,
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString().split('T')[0],
        seller: PROVIDER,
      }
    } : {}),
    ...(tripData.rating ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: String(tripData.rating),
        bestRating: '5',
        worstRating: '1',
        ratingCount: String(tripData.review_count || 10),
      }
    } : {}),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Tour Packages', item: `${BASE_URL}/triplist` },
      ...(dest ? [{ '@type': 'ListItem', position: 3, name: dest, item: `${BASE_URL}/triplist?destination=${encodeURIComponent(dest)}` }] : []),
      { '@type': 'ListItem', position: dest ? 4 : 3, name, item: canonical },
    ],
  };

  return { title, desc, keywords, canonical, heroImg, imageAlt, schema, breadcrumb };
}

// ─── 2. LANDING PAGE ─────────────────────────────────────────────────────────

/**
 * Builds SEO payload for /tours/:slug
 * @param {object} pageData — raw API response from /landing-pages/:id
 * @param {string} slug
 */
export function buildLandingPageSEO(pageData, slug) {
  if (!pageData) return null;

  const name      = pageData.title || slug;
  const canonical = `${BASE_URL}/tours/${slug}`;
  const heroImg   = absImg(pageData.hero_image);
  const rawDesc   = pageData.description || pageData.about || '';

  const price     = pageData.discount_price || pageData.price || pageData.base_price;
  const basePrice = pageData.base_price || pageData.price;

  // Admin-set fields take priority, then computed fallbacks
  const title = pageData.meta_title
    || `${name} — Best Deals ${price ? `from ${fmt(price)}` : '2025'} | ${BRAND}`;

  const desc = pageData.meta_description
    || trim(
      `${name}. ${rawDesc ? trim(rawDesc, 80) + ' ' : ''}${price ? `Starting from ${fmt(price)}. ` : ''}Customised & fixed departures. Book with ${BRAND}, trusted since 2015.`,
      158
    );

  const keywords = pageData.meta_keywords
    || [
      name,
      `${name} tour package`,
      `${name} holiday`,
      `${name} ${price ? fmt(price) : ''}`,
      'India tour packages 2025',
      BRAND,
    ].filter(Boolean).join(', ');

  const imageAlt = `${name} — Tour Package ${price ? `from ${fmt(price)}` : '2025'} | ${BRAND}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': canonical,
    name,
    description: rawDesc || desc,
    url: canonical,
    image: heroImg
      ? { '@type': 'ImageObject', url: heroImg, description: imageAlt }
      : undefined,
    provider: PROVIDER,
    ...(price ? {
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'INR',
        lowPrice: String(price),
        ...(basePrice && basePrice > price ? { highPrice: String(basePrice) } : {}),
        offerCount: 1,
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString().split('T')[0],
        priceValidUntil: `${new Date().getFullYear()}-12-31`,
        seller: PROVIDER,
      }
    } : {}),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Tour Packages', item: `${BASE_URL}/triplist` },
      { '@type': 'ListItem', position: 3, name, item: canonical },
    ],
  };

  return { title, desc, keywords, canonical, heroImg, imageAlt, schema, breadcrumb };
}

// ─── 3. DESTINATION DETAIL PAGE ───────────────────────────────────────────────

/**
 * Builds SEO payload for /destination/:slug/:id
 * @param {object} destinationData — raw API response
 * @param {string} slug
 * @param {string|number} id
 */
export function buildDestinationSEO(destinationData, slug, id) {
  if (!destinationData) return null;

  const name      = destinationData.name || destinationData.title || 'India';
  const canonical = `${BASE_URL}/destination/${slug || destinationData.slug || id}/${id}`;
  const overview  = destinationData.overview || destinationData.description || '';
  const heroImg   = absImg(
    Array.isArray(destinationData.images) ? destinationData.images[0] : destinationData.image
  );

  const title = destinationData.meta_title
    || `${name} Travel Guide & Tour Packages 2025 | ${BRAND}`;

  const desc = destinationData.meta_description
    || trim(
      `Explore ${name} — ${overview ? trim(overview, 90) + ' ' : ''}Best tour packages, travel tips & curated itineraries. Plan your ${name} trip with ${BRAND}.`,
      158
    );

  const keywords = [
    `${name} tour packages`,
    `${name} travel guide`,
    `${name} holiday packages`,
    `${name} trip itinerary`,
    `best places in ${name}`,
    `${name} tourism`,
    BRAND,
  ].join(', ');

  const imageAlt = `${name} — Top Travel Destination | Tour Packages by ${BRAND}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': canonical,
    name,
    description: overview || desc,
    url: canonical,
    image: heroImg
      ? { '@type': 'ImageObject', url: heroImg, description: imageAlt }
      : undefined,
    touristType: ['Family', 'Couples', 'Adventure Seekers', 'Backpackers'],
    ...(destinationData.latitude && destinationData.longitude ? {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: String(destinationData.latitude),
        longitude: String(destinationData.longitude),
      }
    } : {}),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Destinations', item: `${BASE_URL}/destinations` },
      { '@type': 'ListItem', position: 3, name, item: canonical },
    ],
  };

  return { title, desc, keywords, canonical, heroImg, imageAlt, schema, breadcrumb };
}

// ─── 4. CATEGORY PAGE ────────────────────────────────────────────────────────

/**
 * Builds SEO payload for /category/:slug/:id
 * @param {object} categoryData — raw API response
 * @param {Array}  trips — list of trip objects in the category
 * @param {string|number} id
 */
export function buildCategorySEO(categoryData, trips = [], id) {
  if (!categoryData) return null;

  const name      = categoryData.name || 'Tour Packages';
  const slug      = categoryData.slug || id;
  const canonical = `${BASE_URL}/category/${slug}/${id}`;
  const catDesc   = categoryData.description || '';
  const heroImg   = absImg(
    Array.isArray(categoryData.image) ? categoryData.image[0] : categoryData.image
  );

  const title = `${name} Tour Packages 2025 | Best ${name} Trips | ${BRAND}`;

  const desc = trim(
    `Explore the best ${name} tour packages across India. ${catDesc ? trim(catDesc, 80) + ' ' : ''}${trips.length ? `${trips.length}+ handpicked trips. ` : ''}Fixed & customised departures from ${BRAND}.`,
    158
  );

  const keywords = [
    `${name} tour packages`,
    `${name} holiday packages India`,
    `best ${name} trips`,
    `${name} tour 2025`,
    `${name} travel packages`,
    BRAND,
  ].join(', ');

  const imageAlt = `${name} Tour Packages — ${BRAND}`;

  const itemListSchema = trips.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': canonical,
    name: `${name} Tour Packages`,
    description: desc,
    url: canonical,
    numberOfItems: trips.length,
    itemListElement: trips.slice(0, 10).map((trip, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: trip.title || trip.name,
      url: `${BASE_URL}/trip-preview/${trip.slug || id}/${trip.id || trip._id}`,
    })),
  } : null;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Tour Packages', item: `${BASE_URL}/triplist` },
      { '@type': 'ListItem', position: 3, name, item: canonical },
    ],
  };

  return { title, desc, keywords, canonical, heroImg, imageAlt, itemListSchema, breadcrumb };
}

// ─── 5. STATIC PAGE CONFIGS ──────────────────────────────────────────────────

export const STATIC_SEO = {
  home: {
    title: `India Tour Packages 2025 | Himachal, Kashmir, Goa, Kerala & More | ${BRAND}`,
    desc:  `Explore 80+ handpicked India tour packages — Himachal Pradesh, Kashmir, Leh Ladakh, Goa & Kerala. Fixed & customised departures for families, couples & adventurers. Book with ${BRAND}, trusted since 2015.`,
    keywords: 'India tour packages 2025, Himachal Pradesh tours, Kashmir tour packages, Leh Ladakh trips, Goa holiday, Kerala tour, travel agency Shimla, customised tour India',
    canonical: `${BASE_URL}/`,
    imageAlt: `Holidays Planners — India Tour Packages 2025 | Trusted Since 2015`,
  },
  tripList: {
    title: `All India Tour Packages 2025 — Himachal, Kashmir, Goa, Ladakh | ${BRAND}`,
    desc:  `Browse 80+ India tour packages — Shimla Manali, Spiti Valley, Kashmir honeymoon, Leh Ladakh, Goa & Kerala. Filter by destination, duration or budget. Fixed & customised departures.`,
    keywords: 'tour packages India 2025, Shimla Manali package, Spiti Valley itinerary, Kashmir tour, Leh Ladakh trip, budget tour India, family holiday packages, honeymoon packages India',
    canonical: `${BASE_URL}/triplist`,
    imageAlt: `All India Tour Packages 2025 | Browse & Book | ${BRAND}`,
  },
  destinationList: {
    title: `Top Travel Destinations in India 2025 — Himachal, Kashmir, Goa & More | ${BRAND}`,
    desc:  `Discover India's most beautiful travel destinations — Shimla, Manali, Srinagar, Spiti Valley, Munnar, Andaman & more. Explore curated tour packages for every traveller type with ${BRAND}.`,
    keywords: 'travel destinations India, Himachal Pradesh tourism, Kashmir destinations, Manali tourism, Spiti Valley, Goa beaches, Kerala backwaters, best places India 2025',
    canonical: `${BASE_URL}/destinations`,
    imageAlt: `Top Travel Destinations in India 2025 | ${BRAND}`,
  },
  blog: {
    title: `India Travel Blog — Guides, Tips & Itineraries | ${BRAND}`,
    desc:  `Read expert India travel guides, destination tips, budget itineraries & hidden gem stories. Himachal Pradesh, Kashmir, Leh Ladakh, Goa & more — all from India's travel experts since 2015.`,
    keywords: 'India travel blog, Himachal Pradesh travel guide, Kashmir travel tips, Spiti Valley blog, Leh Ladakh itinerary, Goa travel guide, India trip planning',
    canonical: `${BASE_URL}/blog`,
    imageAlt: `India Travel Blog — Tips & Destination Guides | ${BRAND}`,
  },
  about: {
    title: `About ${BRAND} | Shimla's Trusted Travel Agency Since 2015`,
    desc:  `Meet the team behind ${BRAND} — 10+ years, 15,000+ happy travellers, 250+ destinations. Founded by Poonam Sharma in Shimla, H.P. Your expert travel partner for customised India tours.`,
    keywords: 'about Holidays Planners, travel agency Shimla, Poonam Sharma travel agency, Himachal Pradesh tour operator, trusted travel company India since 2015',
    canonical: `${BASE_URL}/about`,
    imageAlt: `About ${BRAND} — Trusted Travel Agency Since 2015, Shimla`,
  },
  contact: {
    title: `Contact ${BRAND} | Call +91-98162-59997 | Shimla, Himachal Pradesh`,
    desc:  `Plan your dream India holiday with ${BRAND}. Call +91-98162-59997 or email info@holidaysplanners.com. Office in Shimla, H.P. Mon–Fri 9am–6pm. Free consultation, quick quotes.`,
    keywords: 'contact Holidays Planners, travel agency Shimla phone, tour operator Himachal Pradesh, book India tour, travel agent Shimla contact, customised tour inquiry',
    canonical: `${BASE_URL}/contact`,
    imageAlt: `Contact ${BRAND} | Shimla, Himachal Pradesh`,
  },
  honeymoon: {
    title: `Honeymoon Tour Packages India 2025 — Kashmir, Himachal & Goa | ${BRAND}`,
    desc:  `Romantic honeymoon packages across India — Kashmir, Shimla Manali, Goa, Kerala & Andaman. Handpicked resorts, private transfers, couple activities. Plan your dream honeymoon with ${BRAND}.`,
    keywords: 'honeymoon packages India, Kashmir honeymoon, Shimla Manali honeymoon, Goa honeymoon, Kerala honeymoon, romantic tour packages India, couple tour packages',
    canonical: `${BASE_URL}/destinfo/honeymoon`,
    imageAlt: `Honeymoon Tour Packages India 2025 — Kashmir, Himachal & Goa | ${BRAND}`,
  },
  family: {
    title: `Family Holiday Packages India 2025 — Himachal, Goa & Kashmir | ${BRAND}`,
    desc:  `Fun-filled family holiday packages across India — Himachal Pradesh, Goa, Kashmir, Uttarakhand & more. Kid-friendly itineraries, comfortable stays, guided activities for all ages. Book with ${BRAND}.`,
    keywords: 'family holiday packages India, Himachal Pradesh family tour, Goa family package, Kashmir family trip, family trip India 2025, group family holidays',
    canonical: `${BASE_URL}/destinfo/family`,
    imageAlt: `Family Holiday Packages India 2025 | ${BRAND}`,
  },
  office: {
    title: `Corporate Group Tours & MICE Travel India 2025 | ${BRAND}`,
    desc:  `Corporate retreats, team outings & MICE travel across India — Himachal Pradesh, Goa, Kashmir & more. Customised group packages, logistics & activities. Plan with ${BRAND}'s corporate travel experts.`,
    keywords: 'corporate tour India, MICE travel, group tour packages India, office trip Himachal Pradesh, corporate retreat Goa, team outing India, corporate travel agency',
    canonical: `${BASE_URL}/destinfo/office`,
    imageAlt: `Corporate Group Tours & MICE Travel India | ${BRAND}`,
  },
};
