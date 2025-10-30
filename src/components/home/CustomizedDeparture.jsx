import { useState } from 'react';
import { MapPin } from 'lucide-react';

const destinations = [
  {
    id: 1,
    destinationId: 'paris-france',
    title: 'Paris, France',
    country: 'France',
    tours: 28,
    image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 2,
    destinationId: 'bali-indonesia',
    title: 'Bali, Indonesia',
    country: 'Indonesia',
    tours: 34,
    image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 3,
    destinationId: 'tokyo-japan',
    title: 'Tokyo, Japan',
    country: 'Japan',
    tours: 22,
    image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 4,
    destinationId: 'dubai-uae',
    title: 'Dubai, UAE',
    country: 'UAE',
    tours: 19,
    image: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 5,
    destinationId: 'santorini-greece',
    title: 'Santorini, Greece',
    country: 'Greece',
    tours: 25,
    image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 6,
    destinationId: 'new-york-usa',
    title: 'New York, USA',
    country: 'USA',
    tours: 31,
    image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 7,
    destinationId: 'rome-italy',
    title: 'Rome, Italy',
    country: 'Italy',
    tours: 27,
    image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 8,
    destinationId: 'sydney-australia',
    title: 'Sydney, Australia',
    country: 'Australia',
    tours: 23,
    image: 'https://images.pexels.com/photos/995765/pexels-photo-995765.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

export default function CustomizedDestinationsSection() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleDestinationDetails = (destinationId) => {
    // Navigate to destination info page with destinationId as query parameter
    window.location.href = `/destinfo?destinationId=${destinationId}`;
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 opacity-0 animate-fade-in-down">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Design Your Own Adventure
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Pick the path, set the pace, and craft a travel story that's uniquely yours.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <div
              key={destination.id}
              className="opacity-0 animate-slide-up cursor-pointer rounded-3xl overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards',
              }}
              onMouseEnter={() => setHoveredCard(destination.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleDestinationDetails(destination.destinationId)}
            >
              <div className="relative shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-80">
                {/* Background Image */}
                <img
                  src={destination.image}
                  alt={destination.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    hoveredCard === destination.id ? 'scale-110' : 'scale-100'
                  }`}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  {/* Country Tag */}
                  <div className="flex justify-end">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800">
                      <MapPin className="w-4 h-4" />
                      {destination.country}
                    </span>
                  </div>
                  
                  {/* Bottom Content */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {destination.title}
                    </h3>
                    <p className="text-white/90 text-base font-medium">
                      {destination.tours} Tours Available
                    </p>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className={`absolute inset-0 border-4 border-blue-500 rounded-3xl transition-opacity duration-300 ${
                  hoveredCard === destination.id ? 'opacity-100' : 'opacity-0'
                }`} />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="text-center mt-12 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
        >
          <a href="/destinations">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl">
              View All Destinations
            </button>
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </section>
  );
}