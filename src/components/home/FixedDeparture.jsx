import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TripCard from "../../components/trips/TripCard"; 

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ";
const IMAGE_BASE_URL = "https://api.yaadigo.com/uploads/";

const getFullImageUrl = (path) =>
    !path || typeof path !== "string" ? '' :
    path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;

const standardizeTripData = (t) => {
    // Determine the relevant price and discount based on the pricing model
    const isFixed = t.pricing_model === 'fixed_departure' || t.fixed_departure?.length > 0;
    
    // Fallback logic for price determination
    const finalPrice = isFixed 
        ? t.pricing?.fixed_departure?.[0]?.costingPackages?.[0]?.final_price || 0
        : t.pricing?.customized?.final_price || 0;
        
    const discount = isFixed
        ? t.pricing?.fixed_departure?.[0]?.costingPackages?.[0]?.discount || 0
        : t.pricing?.customized?.discount || 0;

    return {
        ...t, // Spread all properties
        id: t._id || t.id,
        _id: t._id, 
        slug: t.slug,
        title: t.title,
        hero_image: getFullImageUrl(t.hero_image || t.image),
        days: t.days || 1,
        nights: t.nights || 0,
        pricing: {
            ...t.pricing,
            customized: {
                ...t.pricing?.customized,
                final_price: finalPrice.toLocaleString(), // Format for display
                discount: discount // Pass raw discount amount
            },
            // Ensure fixed_departure pricing is formatted if it exists
            fixed_departure: t.pricing?.fixed_departure?.map(fd => ({
                ...fd,
                costingPackages: fd.costingPackages?.map(cp => ({
                    ...cp,
                    final_price: cp.final_price.toLocaleString() // Format the final price
                })) || []
            })) || []
        }
    };
};

export default function DestinationCards() {
    const navigate = useNavigate();

    // 1. Two distinct states for different trip types
    const [fixedDepartures, setFixedDepartures] = useState([]);
    const [customizedPackages, setCustomizedPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTrips = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/trips/`, {
                headers: { "x-api-key": API_KEY }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const json = await response.json();
            const fetchedList = json.data || [];

            // Filter and standardize the data
            const fixedTrips = [];
            const customizedTrips = [];

            fetchedList.slice(0, 16).forEach(t => { // Fetch up to 16 to get 8 of each, if possible
                const standardizedTrip = standardizeTripData(t);

                // Logic to separate the trips
                const isFixedDeparture = t.pricing_model === 'fixed_departure' || t.fixed_departure?.length > 0;
                
                if (isFixedDeparture) {
                    fixedTrips.push(standardizedTrip);
                } else {
                    customizedTrips.push(standardizedTrip);
                }
            });

            // Set the two states, capping at 8 items for each section
            setFixedDepartures(fixedTrips.slice(0, 8));
            setCustomizedPackages(customizedTrips.slice(0, 8));

        } catch (error) {
            console.error("Error fetching trips:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrips();
    }, [fetchTrips]);

    const handleViewAllTrips = () => {
        navigate('/triplist');
        window.scrollTo(0, 0);
    };

    if (isLoading) {
        return (
            <section className="py-16 text-center bg-gray-50">
                <p className="text-gray-500">Loading inspiring trips...</p>
            </section>
        );
    }

    const onSendQuery = (trip) => {
        console.log(`Query requested for: ${trip.title}`);
        // Implement your actual query/form logic here
    };

    // Helper component for rendering a trip section
    const TripSection = ({ title, description, trips, onSendQuery }) => (
        <>
            <div className="text-center mb-10 mt-16 first:mt-0">
                <h3 className="text-3xl md:text-4xl font-semibold mb-2 text-gray-800">
                    {title}
                </h3>
                <p className="text-gray-500 max-w-2xl mx-auto text-md">
                    {description}
                </p>
            </div>
            {trips.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trips.map((trip) => (
                        <TripCard 
                            key={trip.id} 
                            trip={trip} 
                            // onSendQuery={onSendQuery} 
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No {title.toLowerCase()} currently available.</p>
            )}
            <hr className="my-16 border-gray-200" />
        </>
    );

    return (
        <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Main Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                        Trips That Inspire ✨
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Explore our curated fixed departures and flexible customized packages.
                    </p>
                </div>

                {/* --- Fixed Departure Section --- */}
                <TripSection
                    title="Fixed Departures"
                    description="Join our upcoming group adventures with confirmed departure dates."
                    trips={fixedDepartures}
                    onSendQuery={onSendQuery}
                />
                
                {/* --- Customized Packages Section --- */}
                <TripSection
                    title="Customized Packages"
                    description="Tailor your dream trip with a flexible itinerary and private dates."
                    trips={customizedPackages}
                    onSendQuery={onSendQuery}
                />
                
                {/* View All Button */}
                <div className="text-center mt-6">
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