import { useState } from 'react';
import { MapPin } from 'lucide-react';

const departures = [
  {
    id: 1,
    tripId: 'jibhi',
    title: 'Jibhi & Tirthan Valley',
    location: 'Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    duration: '3 Days 2 Nights',
    price: '7,000',
    toursAvailable: '12 Tours Available'
  },
  {
    id: 2,
    tripId: 'kasol',
    title: 'Kasol Kheerganga',
    location: 'Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    duration: '3 Days 2 Nights',
    price: '6,500',
    toursAvailable: '15 Tours Available'
  },
  {
    id: 3,
    tripId: 'chopta',
    title: 'Chopta-Tungnath',
    location: 'Uttarakhand',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    duration: '3 Days 2 Nights',
    price: '6,500',
    toursAvailable: '10 Tours Available'
  },
  {
    id: 4,
    tripId: 'yulia',
    title: 'Yulia Kanda Trek',
    location: 'Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',
    duration: '3 Days 2 Nights',
    price: '8,000',
    toursAvailable: '8 Tours Available'
  },
  {
    id: 5,
    tripId: 'hampta',
    title: 'Hampta Pass Trek',
    location: 'Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    duration: '5 Days 4 Nights',
    price: '12,000',
    toursAvailable: '14 Tours Available'
  },
  {
    id: 6,
    tripId: 'kedarkantha',
    title: 'Kedarkantha Trek',
    location: 'Uttarakhand',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    duration: '6 Days 5 Nights',
    price: '15,000',
    toursAvailable: '9 Tours Available'
  },
  {
    id: 7,
    tripId: 'valley',
    title: 'Valley of Flowers',
    location: 'Uttarakhand',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    duration: '7 Days 6 Nights',
    price: '18,000',
    toursAvailable: '6 Tours Available'
  },
  {
    id: 8,
    tripId: 'triund',
    title: 'Triund Trek',
    location: 'Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',
    duration: '2 Days 1 Night',
    price: '3,500',
    toursAvailable: '20 Tours Available'
  }
];

export default function DestinationCards() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleTripDetails = (tripId) => {
    window.location.href = `/trips?tripId=${tripId}`;
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