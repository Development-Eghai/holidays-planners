import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModernTemplate from './ModernTemplate/ModernTemplate';
import { Loader2 } from 'lucide-react';

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
        console.log('🔍 Resolving slug:', slug);
        
        // 1. Fetch the list to find the ID for this slug
        // The list endpoint is lighter and allows us to filter by slug on the client side if the API doesn't support direct slug lookup
        const listResponse = await fetch(`${API_BASE_URL}/landing-pages?per_page=100`, {
          headers: { 'x-api-key': API_KEY }
        });

        if (!listResponse.ok) throw new Error('Failed to connect to server');

        const listData = await listResponse.json();
        // Handle various API response structures ( {pages: []} or {data: []} or [] )
        const pages = listData.pages || listData.data || (Array.isArray(listData) ? listData : []);
        
        // Find the page summary that matches the slug
        const pageSummary = pages.find(p => p.slug === slug);

        if (!pageSummary) {
          console.error('❌ Slug not found in list');
          setError('Page not found');
          setLoading(false);
          return;
        }

        // 2. Fetch the FULL details using the ID
        // The list endpoint returns truncated data; we need the full object for the template.
        console.log('kp Fetching full details for ID:', pageSummary.id);
        const detailResponse = await fetch(`${API_BASE_URL}/landing-pages/${pageSummary.id}`, {
            headers: { 'x-api-key': API_KEY }
        });

        if (!detailResponse.ok) throw new Error('Failed to load page details');

        const fullPageData = await detailResponse.json();
        // Ensure we unwrap the data correctly (e.g. { data: { ... } } vs { ... })
        const finalData = fullPageData.data || fullPageData;

        // Check active status
        if (!finalData.is_active) {
          setError('This offer has expired or is currently unavailable.');
          setLoading(false);
          return;
        }

        setPageData(finalData);
        setLoading(false);

      } catch (err) {
        console.error('💥 Error loading landing page:', err);
        setError('Failed to load content. Please try again later.');
        setLoading(false);
      }
    };

    if (slug) {
      fetchLandingPage();
    } else {
      setError('Invalid URL');
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Loading your experience...</p>
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
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-semibold"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Template Switcher Logic
  const renderTemplate = () => {
    const template = pageData.template || 'template-three';
    
    switch (template) {
      case 'template-three': // Modern
        return <ModernTemplate pageData={pageData} />;
      
      case 'template-two': // Classic
        // Placeholder for Classic Template
        return <ModernTemplate pageData={pageData} />; 
      
      case 'template-one': // Minimal
        // Placeholder for Minimal Template
        return <ModernTemplate pageData={pageData} />;
      
      default:
        // Default fallback
        return <ModernTemplate pageData={pageData} />;
    }
  };

  return (
    <div className="landing-page-wrapper font-sans text-slate-900">
      {renderTemplate()}
    </div>
  );
}  