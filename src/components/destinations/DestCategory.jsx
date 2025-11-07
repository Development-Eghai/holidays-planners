import React, { useEffect, useState } from "react";
// Ensure this path is correct in your project structure
import TripCard from "../../components/trips/TripCard"; 

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ";

const DestCategory = ({ currentDestinationId }) => {
  const [destinationData, setDestinationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentDestinationId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Fetching destination ID:", currentDestinationId);

        const response = await fetch(
          `${API_URL}/destinations/${currentDestinationId}/`,
          { headers: { "x-api-key": API_KEY } }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();
        setDestinationData(json.data || json);
      } catch (err) {
        console.error("🚨 Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentDestinationId]);

  // --- Render States ---

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 mt-4">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!destinationData) {
    return null;
  }

  const customPackages = destinationData.custom_packages || [];

  if (customPackages.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No custom packages found for this destination.</p>
      </div>
    );
  }

  // --- Main Render ---

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        
        {/* Removed the main <h2>Custom Packages</h2> heading as requested */}

        {customPackages.map((pkg, index) => (
          <div key={index} className="mb-16">
            
            {/* Package Header (Title & Description) */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow-md border-b-4 border-blue-500">
              <h3 className="text-2xl font-extrabold text-gray-800 mb-2">
                {pkg.title || 'Untitled Package'}
              </h3>
              {pkg.description && (
                <p className="text-gray-600">{pkg.description}</p>
              )}

              <br />

              {/* Render the trips associated with this package */}
            {Array.isArray(pkg.trips) && pkg.trips.length > 0 ? (
              // TripCards are rendered directly inside this grid div
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pkg.trips.map((trip) => (
                  <TripCard 
                    key={trip.id || trip._id} 
                    trip={trip} 
                    // Add onSendQuery handler if needed for modal/form submission
                    // onSendQuery={(t) => console.log('Query for:', t.title)}
                  /> 
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No trips found for this package.
              </p>
            )}
            
            </div>

            
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestCategory;