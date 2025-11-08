import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TripCard from "../../components/trips/TripCard"; // Import the new component

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ";
const IMAGE_BASE_URL = "https://api.yaadigo.com/uploads/";

const getFullImageUrl = (path) =>
    !path || typeof path !== "string" ? '' :
    path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;

export default function DestinationCards() {
    const navigate = useNavigate();

    const [departures, setDepartures] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Removed hoveredCard state as the logic is now inside TripCard

    const fetchFixedDepartures = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/trips/`, {
                headers: { "x-api-key": API_KEY }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const json = await response.json();
            const fetchedList = json.data || [];

            const fixedTrips = fetchedList.filter(t => t.pricing_model === 'fixed_departure' || t.fixed_departure?.length > 0).slice(0, 8);
            const tripsToMap = fixedTrips.length > 0 ? fixedTrips : fetchedList.slice(0, 8);

            const standardizedTrips = tripsToMap.map(t => {
                // Ensure price and discount are numbers before formatting
                const finalPrice = t.pricing?.fixed_departure?.[0]?.costingPackages?.[0]?.final_price ||
                                   t.pricing?.customized?.final_price || 0;
                const discount = t.pricing?.customized?.discount || 0;
                
                // Return the object in a structure that mostly aligns with the fetched API data
                // The TripCard component will handle final display formatting and logic.
                return {
                    ...t, // Spread all properties for TripCard to use
                    id: t._id || t.id,
                    _id: t._id, // Keep both for safety
                    slug: t.slug,
                    title: t.title,
                    pickup_location: t.pickup_location,
                    destination_type: t.destination_type,
                    hero_image: getFullImageUrl(t.hero_image || t.image),
                    days: t.days || 1,
                    nights: t.nights || 0,
                    // Re-calculate pricing structure to be robust for TripCard
                    pricing: {
                        ...t.pricing,
                        customized: {
                            ...t.pricing?.customized,
                            final_price: finalPrice.toLocaleString(), // Format price for display
                            discount: discount // Pass raw discount amount
                        },
                        // Simplified fixed_departure for TripCard
                        fixed_departure: t.pricing?.fixed_departure?.map(fd => ({
                            ...fd,
                            price: finalPrice.toLocaleString() // Ensure price is formatted
                        }))
                    }
                };
            });

            setDepartures(standardizedTrips);
        } catch (error) {
            console.error("Error fetching fixed departures:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFixedDepartures();
    }, [fetchFixedDepartures]);

    // Removed handleTripDetails as navigation is handled by Link in TripCard
    // The previous logic was:
    // const handleTripDetails = (tripSlug, tripId) => {
    //     const tripPath = `/trip-preview/${tripSlug}/${tripId}`;
    //     navigate(tripPath);
    //     window.scrollTo(0, 0);
    // };

    const handleViewAllTrips = () => {
        navigate('/triplist');
        window.scrollTo(0, 0);
    };

    if (isLoading) {
        return (
            <section className="py-16 text-center bg-gray-50">
                <p className="text-gray-500">Loading fixed departure trips...</p>
            </section>
        );
    }

    // No action needed for onSendQuery for this component's current use case
    const onSendQuery = (trip) => {
        console.log(`Query requested for: ${trip.title}`);
        // Implement your actual query/form logic here
    };

    return (
        <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                        Trips That Inspire
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Join our upcoming group adventures with confirmed departure dates
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {departures.map((departure) => (
                        <TripCard 
                            key={departure.id} 
                            trip={departure} 
                            // onSendQuery={onSendQuery} // Optional: include if you add a query button
                        />
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <button 
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
                        onClick={handleViewAllTrips}
                    >
                        View All Trips
                    </button>
                </div>
            </div>
        </section>
    );
}