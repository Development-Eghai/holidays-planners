import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";

const TripCard = ({ trip, onSendQuery }) => {
  // State for hover effect
  const [isHovered, setIsHovered] = React.useState(false); 

  if (!trip) return null;

  // --- Data Extraction and Fallbacks ---
  const tripSlug = trip.slug || `trip-${trip._id || trip.id}`;
  const tripId = trip._id || trip.id;
  const tripPath = `/trip-preview/${tripSlug}/${tripId}`;

  // Flexible price extraction
  const finalPrice =
    trip?.pricing?.customized?.final_price ||
    trip?.pricing?.fixed_departure?.[0]?.price ||
    "N/A";
  
  // Duration Display
  const durationText = `${trip.days} Days ${trip.nights} Nights`;

  // Location Display (using destination type or pickup location for the tag style)
  const locationTag = trip.destination_type || trip.pickup_location;
  
  // Discount amount
  const discount = trip?.pricing?.customized?.discount || 0;

  // --- Event Handler ---
  const handleSendQuery = (e) => {
    e.preventDefault(); 
    if (onSendQuery) {
      onSendQuery(trip);
    } else {
      console.log("Send Query clicked for trip:", trip.title);
    }
  };

  // --- Component Structure (Updated Height and Title Clamp) ---
  return (
    <div
      key={tripId}
      className="cursor-pointer rounded-3xl overflow-hidden shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={tripPath}>
        {/* HEIGHT INCREASED TO h-96 */}
        <div className="relative h-96 transition-all duration-500 transform hover:shadow-2xl hover:-translate-y-2">
          {/* Background Image with Hover Effect */}
          <img
            src={trip.hero_image}
            alt={trip.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Top Content / Badges */}
          <div className="absolute top-0 inset-x-0 flex justify-between p-4">
            {/* Location Tag */}
            {locationTag && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800">
                <MapPin className="w-4 h-4" />
                {locationTag}
              </span>
            )}
            
            {/* Discount Badge */}
            {discount > 0 && (
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ₹{discount} Off
              </div>
            )}
          </div>


          {/* Bottom Content (Title, Duration, Price) */}
          <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end">
                {/* Trip Title - TEXT LIMIT APPLIED HERE */}
            <h3 className="text-2xl font-bold text-white mb-1 leading-tight line-clamp-2">
              {trip.title}
            </h3>
                {/* Duration */}
            <p className="text-white/90 text-sm font-medium mb-2">
              {durationText}
            </p>
                {/* Price */}
            <p className="text-xl font-bold text-white">
              ₹{finalPrice}{" "}
              <span className="text-sm font-normal">per person</span>
            </p>
          </div>

          {/* Hover Border Effect */}
          <div className={`absolute inset-0 border-4 border-blue-500 rounded-3xl transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
        </div>
      </Link>
    </div>
  );
};

export default TripCard;