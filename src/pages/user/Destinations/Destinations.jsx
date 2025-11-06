import React, { useEffect, useState } from 'react';
import DestinationHero from '../../../components/destinations/DestinationHero';
import DestinationOverview from '../../../components/destinations/DestinationOverview';
import Blog from '../../../components/charts/BlogComponent';
import FAQ from '../../../components/charts/FAQ';
import Form from '../../../components/forms/LeadGeneration';
import Banner from '../../../components/charts/PromotionalBanner';
import Related from '../../../components/destinations/RelatedTrips';
import DestCategory from '../../../components/destinations/DestCategory';
import { useLocation, useNavigate } from 'react-router-dom';

const Destinations = () => {
  const [destinationId, setDestinationId] = useState('jibhi');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get destinationId from URL query parameters
    const params = new URLSearchParams(location.search);
    const id = params.get('destinationId');

    console.log('URL destinationId:', id); // For debugging

    if (id) {
      setDestinationId(id);
    }
  }, [location.search]);

  // Listen for URL changes (when user navigates)
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('destinationId');
      if (id) {
        setDestinationId(id);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  return (
    <div>
      <DestinationHero destinationId={destinationId} />
      <DestinationOverview currentDestinationId={destinationId} />
      <DestCategory currentDestinationId={destinationId} />
      <Related />
      <Banner />
      <Form />
      <FAQ />
    </div>
  );
};

export default Destinations;