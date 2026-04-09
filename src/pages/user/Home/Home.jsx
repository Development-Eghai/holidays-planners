import React from 'react';
import { Helmet } from 'react-helmet-async';
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
  return (
    <div>
      <Helmet>
        <title>India Tour Packages 2025 | Himachal, Kashmir, Goa, Kerala &amp; More | Holidays Planners</title>
        <meta name="description" content="Explore handpicked India tour packages — Himachal Pradesh, Kashmir, Leh Ladakh, Goa, Kerala, Uttarakhand &amp; more. Fixed & customised departures for families, couples & adventurers. Trusted since 2015." />
        <meta name="keywords" content="India tour packages 2025, Himachal Pradesh tours, Kashmir packages, Leh Ladakh trips, Goa holiday packages, Kerala tour, travel agency Shimla" />
        <link rel="canonical" href="https://www.holidaysplanners.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.holidaysplanners.com/" />
        <meta property="og:title" content="India Tour Packages 2025 | Holidays Planners" />
        <meta property="og:description" content="Himachal Pradesh, Kashmir, Leh Ladakh, Goa, Kerala &amp; more. Fixed &amp; customised departures. 15,000+ happy travellers since 2015." />
        <meta property="og:image" content="https://www.holidaysplanners.com/HolidaysPlanners-Logo-HP.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="India Tour Packages 2025 | Holidays Planners" />
        <meta name="twitter:description" content="Himachal Pradesh, Kashmir, Leh Ladakh, Goa, Kerala &amp; more. Best prices, free customisation." />
        <meta name="twitter:image" content="https://www.holidaysplanners.com/HolidaysPlanners-Logo-HP.png" />
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