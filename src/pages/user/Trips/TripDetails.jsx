import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import TripHero from "../../../components/trips/TripHero";
import TripOverview from "../../../components/trips/TripOverview";
import TripTab from "../../../components/trips/TripTab";
import RelatedTrips from "../../../components/trips/RelatedTrips";
import Blog from "../../../components/charts/BlogComponent";
import FAQ from "../../../components/charts/FAQ";
import TripInquiryModal from "../../../components/forms/CustomizedTripForm";

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ";

const TripDetails = () => {
  const { id, slug } = useParams();
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [tripData, setTripData] = useState(null);

  console.log("TripDetails → Route Params:", { slug, id });

  // Fetch trip data for the modal and SEO
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch(`${API_URL}/trips/${id}`, {
          headers: { "x-api-key": API_KEY }
        });
        if (response.ok) {
          const data = await response.json();
          setTripData(data.data || data);
        }
      } catch (error) {
        console.error("Error fetching trip data:", error);
      }
    };

    if (id) {
      fetchTripData();
    }
  }, [id]);

  // Generate SEO-friendly page title and description
  const pageTitle = tripData?.meta_title || tripData?.title || "Trip Details";
  const pageDescription = tripData?.meta_description || tripData?.overview || "Discover amazing travel experiences";
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      {/* SEO Meta Tags + JSON-LD Schema */}
      <Helmet>
        <title>{tripData?.meta_title || `${tripData?.title || 'Trip Details'} | Holidays Planners`}</title>
        <meta name="description" content={tripData?.meta_description || tripData?.overview?.substring(0, 160) || 'Discover amazing travel experiences with Holidays Planners.'} />
        {tripData?.meta_tags && <meta name="keywords" content={tripData.meta_tags} />}
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {tripData?.hero_image && <meta property="og:image" content={tripData.hero_image} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {tripData?.hero_image && <meta name="twitter:image" content={tripData.hero_image} />}

        {/* ✅ JSON-LD: TouristTrip Schema */}
        {tripData && (
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            "name": tripData.title || tripData.name,
            "description": tripData.overview || tripData.meta_description || '',
            "image": tripData.hero_image ? [tripData.hero_image] : [],
            "url": pageUrl,
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
            ...(tripData.pricing?.customized?.final_price || tripData.pricing?.fixed_departure?.[0]?.costingPackages?.[0]?.final_price ? {
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "INR",
                "lowPrice": tripData.pricing?.customized?.final_price || tripData.pricing?.fixed_departure?.[0]?.costingPackages?.[0]?.final_price || 0,
                "offerCount": tripData.pricing?.fixed_departure?.length || 1,
                "availability": "https://schema.org/InStock"
              }
            } : {}),
            ...(tripData.rating ? {
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": tripData.rating,
                "bestRating": "5",
                "ratingCount": tripData.review_count || 10
              }
            } : {})
          })}</script>
        )}

        {/* ✅ JSON-LD: BreadcrumbList */}
        {tripData && (
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.holidaysplanners.com/" },
              { "@type": "ListItem", "position": 2, "name": "Tour Packages", "item": "https://www.holidaysplanners.com/triplist" },
              { "@type": "ListItem", "position": 3, "name": tripData.title || "Trip Details", "item": pageUrl }
            ]
          })}</script>
        )}
      </Helmet>


      <div className="trip-container">
        {/* HERO IMAGE SECTION */}
        <TripHero tripId={id} />

        {/* OVERVIEW / DETAILS */}
        <TripOverview tripId={id} />

        {/* ITINERARY & OTHER TABS */}
        <TripTab tripId={id} />

        {/* RELATED TRIPS */}
        <RelatedTrips currentTripId={id} />

        {/* FAQ SECTION */}
        <FAQ tripId={id} />

        {/* BLOG SECTION (temporarily hidden) */}
        {false && <Blog currentTripId={id} />}

        {/* TRIP INQUIRY MODAL */}
        <TripInquiryModal
          isOpen={showInquiryModal}
          onClose={() => setShowInquiryModal(false)}
          tripName={tripData?.title || tripData?.name || "This Trip"}
          availableDates={tripData?.available_dates || tripData?.departure_dates || []}
        />

        {/* Floating Book Now Button */}
        <button
          onClick={() => setShowInquiryModal(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
        >
          <span>Enquire Now</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default TripDetails;