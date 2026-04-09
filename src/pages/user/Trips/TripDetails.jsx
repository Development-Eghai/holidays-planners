import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { buildTripSEO } from "../../../utils/seo";
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

  // Build SEO from utility — unique per trip, data-driven
  const seo = buildTripSEO(tripData, slug, id);

  return (
    <>
      {/* ✅ SEO: unique per-trip meta tags, schema, canonical */}
      <Helmet>
        {/* Unique title: trip name + destination + duration */}
        <title>{seo?.title || `${tripData?.title || 'Trip Details'} | Holidays Planners`}</title>
        <meta name="description" content={seo?.desc || tripData?.meta_description || 'Discover amazing travel experiences with Holidays Planners.'} />
        <meta name="keywords" content={seo?.keywords || tripData?.meta_tags || 'India tour packages'} />
        <link rel="canonical" href={seo?.canonical || window.location.href} />

        {/* Open Graph — absolute image URL with descriptive alt */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seo?.canonical || window.location.href} />
        <meta property="og:title" content={seo?.title || tripData?.title} />
        <meta property="og:description" content={seo?.desc} />
        {seo?.heroImg && <meta property="og:image" content={seo.heroImg} />}
        {seo?.heroImg && <meta property="og:image:alt" content={seo.imageAlt} />}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo?.title || tripData?.title} />
        <meta name="twitter:description" content={seo?.desc} />
        {seo?.heroImg && <meta name="twitter:image" content={seo.heroImg} />}
        {seo?.heroImg && <meta name="twitter:image:alt" content={seo.imageAlt} />}

        {/* JSON-LD: TouristTrip — unique per trip, derived from API */}
        {seo?.schema && (
          <script type="application/ld+json">{JSON.stringify(seo.schema)}</script>
        )}
        {/* JSON-LD: BreadcrumbList — destination-aware path */}
        {seo?.breadcrumb && (
          <script type="application/ld+json">{JSON.stringify(seo.breadcrumb)}</script>
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