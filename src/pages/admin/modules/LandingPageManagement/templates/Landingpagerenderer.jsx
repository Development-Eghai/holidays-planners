import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';

// Template Imports
import ModernTemplate from './ModernTemplate/ModernTemplate';
import MinimalTemplate from './MinimalTemplate/MinimalTemplate'; // 1. IMPORT MINIMAL TEMPLATE

const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const API_KEY = 'x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ';

export default function LandingPageRenderer() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        const listResponse = await fetch(`${API_BASE_URL}/landing-pages?per_page=100`, {
          headers: { 'x-api-key': API_KEY }
        });

        if (!listResponse.ok) throw new Error('Failed to connect to server');

        const listData = await listResponse.json();
        const pages = listData.pages || listData.data || (Array.isArray(listData) ? listData : []);
        const pageSummary = pages.find(p => p.slug === slug);

        if (!pageSummary) {
          setError('Page not found');
          setLoading(false);
          return;
        }

        const detailResponse = await fetch(`${API_BASE_URL}/landing-pages/${pageSummary.id}`, {
            headers: { 'x-api-key': API_KEY }
        });

        if (!detailResponse.ok) throw new Error('Failed to load page details');

        const fullPageData = await detailResponse.json();
        const finalData = fullPageData.data || fullPageData;

        if (!finalData.is_active) {
          setError('This offer has expired or is currently unavailable.');
          setLoading(false);
          return;
        }

        setPageData(finalData);
        setLoading(false);

      } catch (err) {
        setError('Failed to load content. Please try again later.');
        setLoading(false);
      }
    };

    if (slug) fetchLandingPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading your experience...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="text-5xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Oops!</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button onClick={() => navigate('/')} className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // ✅ Build canonical URL: always point to /tours/ (the SEO-clean path)
  const canonicalUrl = `https://www.holidaysplanners.com/tours/${slug}`;

  // ✅ Build SEO values from pageData
  const pageTitle = pageData.meta_title || pageData.title || 'Tour Package | Holidays Planners';
  const pageDesc  = pageData.meta_description || pageData.description || 'Explore this exclusive tour package with Holidays Planners. Best prices, customised itineraries. Book now!';
  const pageImage = pageData.hero_image || '/HolidaysPlanners-Logo-HP.png';

  // ✅ JSON-LD: TouristTrip schema
  const touristTripSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": pageData.title || slug,
    "description": pageData.description || pageData.meta_description || '',
    "url": canonicalUrl,
    "image": pageImage ? [pageImage] : [],
    "provider": {
      "@type": "TravelAgency",
      "name": "Holidays Planners",
      "url": "https://www.holidaysplanners.com",
      "telephone": "+91-98162-59997",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Kapil Niwas Bye Pass Road Chakkar",
        "addressLocality": "Shimla",
        "addressRegion": "Himachal Pradesh",
        "postalCode": "171005",
        "addressCountry": "IN"
      }
    },
    ...(pageData.price || pageData.base_price ? {
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "INR",
        "lowPrice": pageData.discount_price || pageData.price || pageData.base_price,
        "highPrice": pageData.base_price || pageData.price,
        "offerCount": 1,
        "availability": "https://schema.org/InStock"
      }
    } : {})
  };

  // ✅ JSON-LD: BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.holidaysplanners.com/" },
      { "@type": "ListItem", "position": 2, "name": "Tour Packages", "item": "https://www.holidaysplanners.com/triplist" },
      { "@type": "ListItem", "position": 3, "name": pageData.title || slug, "item": canonicalUrl }
    ]
  };

  // --- UPDATED TEMPLATE SWITCHER LOGIC ---
  const renderTemplate = () => {
    // Ensure this matches the string saved in your database (e.g., 'template-one')
    const template = pageData.template || 'template-three';
    
    switch (template) {
      case 'template-one': // 2. MAP MINIMAL TEMPLATE
        return <MinimalTemplate pageData={pageData} />;
      
      case 'template-two': // Classic (if you have one, otherwise fallback)
        return <ModernTemplate pageData={pageData} />; 
      
      case 'template-three': // Modern
        return <ModernTemplate pageData={pageData} />;
      
      default:
        return <ModernTemplate pageData={pageData} />;
    }
  };

  return (
    <div className="landing-page-wrapper font-sans text-slate-900">
      {/* ✅ Dynamic SEO: title, description, canonical, OG, schema */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        {pageData.meta_keywords && <meta name="keywords" content={pageData.meta_keywords} />}

        {/* Canonical: always /tours/ path — tells Google to index the clean URL */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={pageImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={pageImage} />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">{JSON.stringify(touristTripSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {renderTemplate()}
    </div>
  );
}