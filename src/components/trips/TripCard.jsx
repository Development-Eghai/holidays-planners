import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";

const TripCard = ({ trip, onSendQuery }) => {
  // Ensure a trip object is present before rendering
  if (!trip) return null;

  // --- Data Extraction and Fallbacks ---
  const tripSlug = trip.slug || `trip-${trip._id || trip.id}`;
  const tripId = trip._id || trip.id;
  const tripPath = `/trip-preview/${tripSlug}/${tripId}`;

  // Flexible price extraction, checking customized price first, then fixed departure price
  const finalPrice =
    trip?.pricing?.customized?.final_price ||
    trip?.pricing?.fixed_departure?.[0]?.price ||
    "N/A";

  const discount = trip?.pricing?.customized?.discount || 0;

  // --- Event Handler ---
  const handleSendQuery = () => {
    if (onSendQuery) {
      // Execute the function passed from the parent component (e.g., to open a modal)
      onSendQuery(trip);
    } else {
      console.log("Send Query clicked for trip:", trip.title);
      // Fallback action if no onSendQuery prop is provided
    }
  };

  // --- Component Structure ---
  return (
    <div
      key={tripId}
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 flex flex-col hover:shadow-xl hover:-translate-y-1"
    >
      {/* Hero Image Section */}
      <div className="relative flex-shrink-0">
        <img
          src={trip.hero_image}
          alt={trip.title}
          className="w-full h-56 object-cover"
          loading="lazy"
        />

        {/* Bestseller Badge */}
        {trip.is_bestseller && (
          <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Bestseller
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {discount}% Off
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="p-5 flex flex-col flex-grow">
        <Link to={tripPath} className="hover:text-blue-600 transition-colors">
          <h3 className="text-lg font-bold mb-1">{trip.title}</h3>
        </Link>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{trip.pickup_location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center text-yellow-500 mb-3">
          <Star className="w-4 h-4 mr-1 fill-yellow-500" />
          <span>{trip.rating || "4.5"}</span>
        </div>

        {/* Duration */}
        <p className="text-sm text-gray-500 mb-4">
          {trip.days} Days {trip.nights} Nights
        </p>

        {/* Price and Buttons */}
        <div className="mt-auto">
          <p className="text-lg font-bold text-gray-900 mb-3">
            ₹{finalPrice}{" "}
            <span className="text-sm text-gray-500">per person</span>
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <Link
              to={tripPath}
              className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View Details
            </Link>

            <button
              onClick={handleSendQuery}
              className="flex-1 text-center bg-cyan-600 text-white py-2 rounded-lg font-semibold hover:bg-cyan-700 transition-colors"
            >
              Send Query
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;