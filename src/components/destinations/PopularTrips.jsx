import React, { useEffect, useState, useRef } from "react";
import TripCard from "../trips/TripCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ";

const PopularTrips = ({ destinationData }) => {
  console.log("🚀 PopularTrips Component Rendered!");
  console.log("📊 destinationData received:", destinationData);
  
  const [popularTrips, setPopularTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const scrollRef = useRef(null);
  const scrollStep = 340; // card width (w-80) + gap

  useEffect(() => {
    // Check if we have popular_trips array directly in destinationData
    const popularTripsFromAPI = destinationData?.popular_trips || [];
    
    console.log("🔍 Processing popular trips...");
    console.log("📦 popular_trips array:", popularTripsFromAPI);
    
    if (popularTripsFromAPI.length === 0) {
      console.log("⚠️ No popular trips found in destinationData.popular_trips");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("✅ Found", popularTripsFromAPI.length, "popular trips");
      
      // Use the trips directly from the API
      setPopularTrips(popularTripsFromAPI);
      
    } catch (err) {
      console.error("🚨 Error processing popular trips:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [destinationData]);

  // Process pricing logic (same as DestCategory)
  const getProcessedTripData = (trip) => {
    const fixedPrice =
      trip.pricing?.fixed_departure?.[0]?.costingPackages?.[0]?.final_price;
    const customPrice = trip.pricing?.customized?.final_price;

    let finalPrice;
    let discountAmount = 0;

    if (fixedPrice !== undefined && fixedPrice !== null && fixedPrice > 0) {
      finalPrice = fixedPrice;
      discountAmount =
        trip.pricing?.fixed_departure?.[0]?.costingPackages?.[0]?.discount || 0;
    } else if (customPrice !== undefined && customPrice !== null && customPrice > 0) {
      finalPrice = customPrice;
      discountAmount = trip.pricing?.customized?.discount || 0;
    } else {
      finalPrice = 0;
    }

    const finalPriceDisplay =
      finalPrice > 0 ? finalPrice.toLocaleString("en-IN") : "N/A";

    return {
      ...trip,
      final_price_display: finalPriceDisplay,
      discount: discountAmount,
    };
  };

  // Scroll navigation
  const scrollCarousel = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const currentScroll = container.scrollLeft;
      const newScroll =
        direction === "left"
          ? currentScroll - scrollStep
          : currentScroll + scrollStep;
      container.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-4">Loading popular trips...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!popularTrips || popularTrips.length === 0) {
    return null; // Don't show section if no popular trips
  }

  // Main render
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-4xl font-extrabold text-blue-900 mb-2">
                Popular Trips
              </h2>
              <p className="text-gray-600">
                Discover our most loved travel experiences
              </p>
            </div>

            {/* Scroll Controls - Show only if more than 3 trips */}
            {popularTrips.length > 3 && (
              <div className="hidden sm:flex space-x-3">
                <button
                  onClick={() => scrollCarousel("left")}
                  className="p-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors shadow-md"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollCarousel("right")}
                  className="p-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors shadow-md"
                  aria-label="Scroll Right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Trip Cards Carousel */}
        <div
          ref={scrollRef}
          className="flex overflow-x-scroll pb-4 space-x-6 custom-scrollbar-hide"
        >
          {popularTrips.map((trip) => {
            const processedTrip = getProcessedTripData(trip);
            return (
              <div
                key={processedTrip.id || processedTrip._id}
                className="w-80 flex-shrink-0"
              >
                <TripCard trip={processedTrip} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Scrollbar Hide */}
      <style jsx>{`
        .custom-scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default PopularTrips;