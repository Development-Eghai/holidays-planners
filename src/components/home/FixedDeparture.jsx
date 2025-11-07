import { useState, useEffect, useCallback } from 'react';
import { MapPin } from 'lucide-react';

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ";
const IMAGE_BASE_URL = "https://api.yaadigo.com/uploads/";

const getFullImageUrl = (path) => 
    !path || typeof path !== "string" ? '' : 
    path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;

export default function DestinationCards() {
  const [departures, setDepartures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const fetchFixedDepartures = useCallback(async () => {
    setIsLoading(true);
    try {
        // Fetch all trips, assuming we would filter for fixed_departure later if needed
        const response = await fetch(`${API_URL}/trips/`, {
            headers: { "x-api-key": API_KEY }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const json = await response.json();
        const fetchedList = json.data || [];
        
        // Filter or select up to 8 fixed departure trips
        const fixedTrips = fetchedList.filter(t => t.pricing_model === 'fixed_departure' || t.fixed_departure?.length > 0).slice(0, 8);
        
        // If no explicit fixed trips, just use the first 8 general trips
        const tripsToMap = fixedTrips.length > 0 ? fixedTrips : fetchedList.slice(0, 8);
        
        const standardizedTrips = tripsToMap.map(t => {
            const price = t.pricing?.fixed_departure?.[0]?.costingPackages?.[0]?.final_price || 
                          t.pricing?.customized?.final_price || 0;
            const fixedDepartureCount = t.pricing?.fixed_departure?.length || 0;

            return {
                id: t._id || t.id,
                tripId: t.slug || t._id || t.id,
                title: t.title,
                location: t.pickup_location || t.destination_type,
                image: getFullImageUrl(t.hero_image || t.image),
                duration: `${t.days || 1} Days ${t.nights || 0} Nights`,
                price: price.toLocaleString(),
                toursAvailable: `${t.trip_count || fixedDepartureCount || 1} Tours Available`
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


  const handleTripDetails = (tripId) => {
    // Assuming tripId is the slug or ID for navigation
    window.location.href = `/trip-preview/${tripId}`; 
  };

  if (isLoading) {
    return (
        <section className="py-16 text-center bg-gray-50">
             <p className="text-gray-500">Loading fixed departure trips...</p>
        </section>
    );
  }

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
          {departures.map((departure, index) => (
            <div
              key={departure.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredCard(departure.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleTripDetails(departure.tripId)}
            >
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl">
                {/* Background Image */}
                <img
                  src={departure.image}
                  alt={departure.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    hoveredCard === departure.id ? 'scale-110' : 'scale-100'
                  }`}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Location Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                  <MapPin className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">{departure.location}</span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-3 leading-tight">
                    {departure.title}
                  </h3>
                  
                  <p className="text-white/90 mb-4 text-sm font-medium">
                    {departure.toursAvailable}
                  </p>

                  {/* Trip Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/80">{departure.duration}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">₹{departure.price}</span>
                      <span className="text-white/80 text-sm">per person</span>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className={`absolute inset-0 border-4 border-blue-500 rounded-3xl transition-opacity duration-300 pointer-events-none ${
                  hoveredCard === departure.id ? 'opacity-100' : 'opacity-0'
                }`} />
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a href="/triplist">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl">
              View All Departures
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}