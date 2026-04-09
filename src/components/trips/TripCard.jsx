import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";

const TripCard = ({ trip, onSendQuery }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    if (!trip) return null;

    const tripSlug = trip.slug || `trip-${trip._id || trip.id}`;
    const tripId   = trip._id || trip.id;
    const tripPath = `/trip-preview/${tripSlug}/${tripId}`;

    const finalPriceDisplay = trip.final_price_display || "N/A";
    const displayDiscount   = trip.discount || 0;
    const priceType = trip.pricing?.customized?.pricing_type === 'Price Per Package'
        ? "per package" : "per person";

    const durationText = `${trip.days} Days ${trip.nights} Nights`;
    const locationTag  = trip.destination_type || trip.pickup_location;

    // ✅ SEO: descriptive alt text — trip name + destination + duration
    const imageAlt = [
        trip.title,
        locationTag && `— ${locationTag}`,
        durationText && `| ${durationText}`,
        '| Holidays Planners',
    ].filter(Boolean).join(' ');

    const handleSendQuery = (e) => {
        e.preventDefault();
        if (onSendQuery) onSendQuery(trip);
    };

    return (
        <div
            key={tripId}
            className="cursor-pointer rounded-3xl overflow-hidden shadow-xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link to={tripPath}>
                <div className="relative h-96 transition-all duration-500 transform hover:shadow-2xl hover:-translate-y-2">

                    {/* ✅ SEO: descriptive alt, explicit width/height for CLS */}
                    <img
                        src={trip.hero_image}
                        alt={imageAlt}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                            isHovered ? 'scale-110' : 'scale-100'
                        }`}
                        loading="lazy"
                        width="400"
                        height="384"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Top Content / Badges */}
                    <div className="absolute top-0 inset-x-0 flex justify-between p-4">
                        {locationTag && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800">
                                <MapPin className="w-4 h-4" />
                                {locationTag}
                            </span>
                        )}
                        {displayDiscount > 0 && (
                            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                ₹{displayDiscount} Off
                            </div>
                        )}
                    </div>

                    {/* Bottom Content */}
                    <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end">
                        <h3 className="text-2xl font-bold text-white mb-1 leading-tight line-clamp-2">
                            {trip.title}
                        </h3>
                        <p className="text-white/90 text-sm font-medium mb-2">{durationText}</p>
                        <p className="text-xl font-bold text-white">
                            ₹{finalPriceDisplay}{" "}
                            <span className="text-sm font-normal">{priceType}</span>
                        </p>
                    </div>

                    {/* Hover Border */}
                    <div className={`absolute inset-0 border-4 border-blue-500 rounded-3xl transition-opacity duration-300 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                    }`} />
                </div>
            </Link>
        </div>
    );
};

export default TripCard;