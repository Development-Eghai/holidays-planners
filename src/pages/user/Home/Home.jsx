import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PROVIDER } from '../../../utils/seo';
import HeroSection from '../../../components/home/HeroSection';
import TravelStyle from '../../../components/home/TravelStyle';
import TrendingDestination from '../../../components/home/TrendingDestination';
import PromoBanner from '../../../components/charts/PromotionalBanner';
import FeaturedTrips from '../../../components/home/FeaturedTrips';
import FixedDeparture from '../../../components/home/FixedDeparture';
import CustomizedDeparture from '../../../components/home/CustomizedDeparture';
import LeadGeneration from '../../../components/forms/LeadGeneration';
import AboutUs from '../../../components/charts/AboutUs';
import ComanyHighlights from '../../../components/charts/ComanyHighlights';
import Testimonials from '../../../components/charts/Testimonials';

const Home = () => {
  // TravelAgency Schema with AggregateRating
  const travelAgencySchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Holidays Planners',
    url: 'https://www.holidaysplanners.com',
    telephone: '+91-98162-59997',
    email: 'info@holidaysplanners.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kapil Niwas, Bye Pass Road, Chakkar',
      addressLocality: 'Shimla',
      addressRegion: 'Himachal Pradesh',
      postalCode: '171005',
      addressCountry: 'IN',
    },
    image: 'https://www.holidaysplanners.com/HolidaysPlanners-Logo-HP.png',
    foundingDate: '2015',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '850',
      reviewCount: '850',
    },
    sameAs: [
      'https://www.facebook.com/holidaysplanners',
      'https://www.instagram.com/holidaysplanners',
      'https://www.youtube.com/@holidaysplanners',
      'https://twitter.com/holidayplanners',
    ],
  };

  // Organization Schema (alternative/complementary)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Holidays Planners',
    url: 'https://www.holidaysplanners.com',
    logo: 'https://www.holidaysplanners.com/HolidaysPlanners-Logo-HP.png',
    contactPoint: {
      '@type': 'ContactPoint',
      name: 'Customer Service',
      telephone: '+91-98162-59997',
      email: 'info@holidaysplanners.com',
      contactType: 'Customer Service',
      availableLanguage: ['en', 'hi'],
    },
  };

  // WebSite Schema (enables sitelinks search box in SERP)
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://www.holidaysplanners.com',
    name: 'Holidays Planners',
    description:
      'Tour packages across India. Himachal Pradesh, Kashmir, Leh Ladakh, Goa, Kerala & more.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          'https://www.holidaysplanners.com/triplist?q={search_term_string}',
      },
      query_input: 'required name=search_term_string',
    },
  };

  return (
    <div>
      <Helmet>
        {/* ── Primary Meta Tags ────────────────────── */}
        <title>India Tour Packages 2025 | Himachal, Kashmir, Goa, Kerala &amp; More | Holidays Planners</title>
        <meta
          name="description"
          content="Explore handpicked India tour packages — Himachal Pradesh, Kashmir, Leh Ladakh, Goa, Kerala, Uttarakhand &amp; more. Fixed & customised departures for families, couples & adventurers. Trusted since 2015."
        />
        <meta
          name="keywords"
          content="India tour packages 2025, Himachal Pradesh tours, Kashmir packages, Leh Ladakh trips, Goa holiday packages, Kerala tour, travel agency Shimla"
        />
        <link rel="canonical" href="https://www.holidaysplanners.com/" />

        {/* ── Open Graph ─────────────────────────── */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.holidaysplanners.com/" />
        <meta
          property="og:title"
          content="India Tour Packages 2025 | Holidays Planners"
        />
        <meta
          property="og:description"
          content="Himachal Pradesh, Kashmir, Leh Ladakh, Goa, Kerala &amp; more. Fixed &amp; customised departures. 15,000+ happy travellers since 2015."
        />
        <meta
          property="og:image"
          content="https://www.holidaysplanners.com/HolidaysPlanners-Logo-HP.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />

        {/* ── Twitter Card ──────────────────────── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="India Tour Packages 2025 | Holidays Planners" />
        <meta
          name="twitter:description"
          content="Himachal Pradesh, Kashmir, Leh Ladakh, Goa, Kerala &amp; more. Best prices, free customisation."
        />
        <meta
          name="twitter:image"
          content="https://www.holidaysplanners.com/HolidaysPlanners-Logo-HP.png"
        />

        {/* ── JSON-LD Schema ────────────────────── */}
        {/* TravelAgency schema with ratings */}
        <script type="application/ld+json">
          {JSON.stringify(travelAgencySchema)}
        </script>

        {/* Organization schema */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>

        {/* WebSite schema (enables search box in SERP) */}
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
      </Helmet>

      <HeroSection />
      <TravelStyle />
      <TrendingDestination />
      <PromoBanner />
      <FeaturedTrips />
      <FixedDeparture />
      <CustomizedDeparture />
      <LeadGeneration />
      <AboutUs />
      <ComanyHighlights />
      <Testimonials />
    </div>
  );
};

export default Home;
