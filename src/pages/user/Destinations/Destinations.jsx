import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import DestinationHero from "../../../components/destinations/DestinationHero";
import DestinationOverview from "../../../components/destinations/DestinationOverview";
import FAQ from "../../../components/charts/FAQ";
import Form from "../../../components/forms/LeadGeneration";
import DestCategory from "../../../components/destinations/DestCategory";
// import Related from "../../../components/destinations/RelatedTrips"; // 🔒 Hidden safely
// import Banner from "../../../components/charts/PromotionalBanner";  // 🔒 Hidden safely

const API_URL = "https://api.yaadigo.com/secure/api/destinations/";
const API_KEY = "x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ";

const Destinations = () => {
  const { slug, id } = useParams(); // Handles /destination/:slug/:id
  const location = useLocation();
  const [destinationId, setDestinationId] = useState(null);
  const [destinationData, setDestinationData] = useState(null);

  // ✅ Detect destinationId from URL (slug or query param)
  useEffect(() => {
    let detectedId = id;
    if (!detectedId) {
      const params = new URLSearchParams(location.search);
      detectedId = params.get("destinationId");
    }

    if (detectedId) {
      setDestinationId(detectedId);
      console.log("Detected Destination ID:", detectedId);
    }
  }, [id, location.search]);

  // ✅ Fetch destination details
  useEffect(() => {
    if (!destinationId) return;

    const fetchDestination = async () => {
      try {
        const response = await fetch(`${API_URL}${destinationId}/`, {
          headers: { "x-api-key": API_KEY },
        });
        if (!response.ok) throw new Error("Failed to fetch destination");
        const data = await response.json();
        setDestinationData(data);
        console.log("Fetched Destination Data:", data);
      } catch (error) {
        console.error("Error fetching destination:", error);
      }
    };

    fetchDestination();
  }, [destinationId]);

  // ✅ Loading state
  if (!destinationData)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading destination details...
        </p>
      </div>
    );

  return (
    <div>
      {/* 🏝️ HERO IMAGE SLIDER */}
      <DestinationHero destinationData={destinationData} />

      {/* 📜 DESTINATION OVERVIEW */}
      <DestinationOverview destinationData={destinationData} />

      {/* 🧭 CATEGORY SECTION */}
      <DestCategory currentDestinationId={destinationId} />

      {/* 🔒 SIMILAR TRIPS (Hidden for now)
      <Related
        popularTripIds={destinationData.popular_trip_ids || []}
        customPackages={destinationData.custom_packages || []}
      /> */}

      {/* 🔒 Promotional Banner / Video Section (Hidden)
      <Banner /> */}

      {/* 📩 Lead Form */}
      <Form />

      {/* ❓FAQ Section */}
      <FAQ />
    </div>
  );
};

export default Destinations;
