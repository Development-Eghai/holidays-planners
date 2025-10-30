import React, { useEffect, useState } from 'react';
import TripHero from '../../components/trips/TripHero';
import TripOverview from '../../components/trips/TripOverview';
import TripTab from '../../components/trips/TripTab';
import RelatedTrips from '../../components/trips/RelatedTrips';
import Blog from '../../components/charts/BlogComponent';
import FAQ from '../../components/charts/FAQ';

import { Book } from 'lucide-react';
import { Form } from 'react-router-dom';

const Trips = () => {
  const [tripId, setTripId] = useState('jibhi');

  useEffect(() => {
    // Get tripId from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const id = params.get('tripId');

    console.log('URL tripId:', id); // For debugging

    if (id) {
      setTripId(id);
    }
  }, []);

  // Listen for URL changes (when user navigates)
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('tripId');
      if (id) {
        setTripId(id);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  return (
    <div>
      <TripHero tripId={tripId} />
      <TripOverview tripId={tripId} />
      <TripTab tripId={tripId} />
      <RelatedTrips currentTripId={tripId} />
      <Blog currentTripId={tripId} />
      <FAQ />
      {/* Add your other trip details sections here */}
    </div>
  );
};

export default Trips;