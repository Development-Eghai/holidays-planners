import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { buildLandingPageSEO } from '../../../../../utils/seo';
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

  // ✅ Build unique SEO per landing page from API data
  const seo = buildLandingPageSEO(pageData, slug);

  // --- UPDATED TEMPLATE SWITCHER LOGIC ---
  const renderTemplate = () => {
    const template = pageData.template || 'template-three';
    switch (template) {
      case 'template-one': return <MinimalTemplate pageData={pageData} />;
      case 'template-two': return <ModernTemplate pageData={pageData} />;
      case 'template-three': return <ModernTemplate pageData={pageData} />;
      default:              return <ModernTemplate pageData={pageData} />;
    }
  };

  return (
    <div className="landing-page-wrapper font-sans text-slate-900">
      {/* ✅ Fully dynamic SEO — unique per landing page, from API data */}
      <Helmet>
        {/* Unique title — admin can override with meta_title field */}
        <title>{seo.title}</title>
        <meta name="description" content={seo.desc} />
        <meta name="keywords" content={seo.keywords} />

        {/* Canonical: always /tours/ — tells Google to index the clean URL */}
        <link rel="canonical" href={seo.canonical} />

        {/* Open Graph — absolute URL + descriptive alt for WhatsApp/FB/Instagram */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seo.canonical} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.desc} />
        <meta property="og:image" content={seo.heroImg} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={seo.imageAlt} />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.desc} />
        <meta name="twitter:image" content={seo.heroImg} />
        <meta name="twitter:image:alt" content={seo.imageAlt} />

        {/* JSON-LD: TouristTrip — unique per landing page */}
        <script type="application/ld+json">{JSON.stringify(seo.schema)}</script>
        {/* JSON-LD: BreadcrumbList */}
        <script type="application/ld+json">{JSON.stringify(seo.breadcrumb)}</script>
      </Helmet>

      {renderTemplate()}
    </div>
  );
}
