import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DestinationHero from "../../../components/destinations/DestinationHero";
import DestinationOverview from "../../../components/destinations/DestinationOverview";
import DestinationGuidelines from "../../../components/destinations/DestinationGuidelines";
import FAQ from "../../../components/charts/FAQ";
import Form from "../../../components/forms/LeadGeneration";
import DestCategory from "../../../components/destinations/DestCategory";
import PopularTrips from "../../../components/destinations/PopularTrips";


const API_URL = "https://api.yaadigo.com/secure/api/destinations/";
const API_KEY = "x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ";

const Destinations = () => {
  const { slug, id } = useParams();
  const location = useLocation();
  const [destinationId, setDestinationId] = useState(null);
  const [destinationData, setDestinationData] = useState(null);

  // Detect destinationId from URL (slug or query param)
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

  // Fetch destination details
  useEffect(() => {
    if (!destinationId) return;

    const fetchDestination = async () => {
      try {
        const response = await fetch(`${API_URL}${destinationId}/`, {
          headers: { "x-api-key": API_KEY },
        });
        if (!response.ok) throw new Error("Failed to fetch destination");
        const data = await response.json();
        
        // Extract the actual destination data from the response
        const actualData = data.data || data;
        setDestinationData(actualData);
        console.log("Fetched Destination Data:", actualData);
      } catch (error) {
        console.error("Error fetching destination:", error);
      }
    };

    fetchDestination();
  }, [destinationId]);

  // Loading state
  if (!destinationData)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading destination details...
        </p>
      </div>
    );

  const destName  = destinationData.name || destinationData.title || 'India';
  const destSlug  = destinationData.slug || slug || destinationId;
  const destDesc  = destinationData.overview || destinationData.description || '';
  const destImage = destinationData.images?.[0]
    ? (destinationData.images[0].startsWith('http') ? destinationData.images[0] : `https://api.yaadigo.com/uploads/${destinationData.images[0]}`)
    : 'https://www.holidaysplanners.com/HolidaysPlanners-Logo-HP.png';
  const canonicalUrl = `https://www.holidaysplanners.com/destination/${destSlug}/${destinationId}`;

  const seoTitle = destinationData.meta_title
    || `${destName} Travel Guide & Tour Packages 2025 | Holidays Planners`;
  const seoDesc  = destinationData.meta_description
    || (destDesc
      ? `${destDesc.substring(0, 140)} Plan your trip to ${destName} with Holidays Planners.`
      : `Explore ${destName} — top attractions, best tour packages, travel tips & itineraries. Book your ${destName} trip with Holidays Planners, trusted since 2015.`);

  return (
    <div>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:image" content={destImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDesc} />
        <meta name="twitter:image" content={destImage} />
        {/* TouristAttraction Schema */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TouristAttraction",
          "name": destName,
          "description": destDesc || seoDesc,
          "url": canonicalUrl,
          "image": destImage ? [destImage] : [],
          "touristType": ["Family", "Couples", "Adventure Seekers"],
          "geo": destinationData.latitude && destinationData.longitude ? {
            "@type": "GeoCoordinates",
            "latitude": destinationData.latitude,
            "longitude": destinationData.longitude
          } : undefined
        })}</script>
        {/* BreadcrumbList */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.holidaysplanners.com/" },
            { "@type": "ListItem", "position": 2, "name": "Destinations", "item": "https://www.holidaysplanners.com/destinations" },
            { "@type": "ListItem", "position": 3, "name": destName, "item": canonicalUrl }
          ]
        })}</script>
      </Helmet>

      {/* Hero Image Slider */}
      <DestinationHero destinationData={destinationData} />

      {/* Destination Overview */}
      <DestinationOverview destinationData={destinationData} />

      {/* Popular Trips Section */}
      <PopularTrips destinationData={destinationData} />

      {/* Category Section (Custom Packages) */}
      <DestCategory currentDestinationId={destinationId} />

      {/* Travel Guidelines */}
      <DestinationGuidelines destinationData={destinationData} />

      {/* Lead Form */}
      <Form />

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
};

export default Destinations;