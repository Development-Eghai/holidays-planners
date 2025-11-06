import React, { useState } from 'react';
import { MapPin, TrendingUp, Calendar, Star, Clock, Award, Plane } from 'lucide-react';

const destinations = [
  {
    id: 'paris-france',
    name: 'Paris',
    country: 'France',
    destinationId: 'paris-france',
    image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tourCount: 28,
    continent: 'Europe',
    description: 'Experience the city of lights with its iconic landmarks, world-class museums, romantic streets, and exquisite French cuisine that captivates millions of visitors.',
    rating: 4.9,
    bestTime: 'April - October',
    tours: [
      { id: 1, name: 'Eiffel Tower & Seine Cruise', image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 2, name: 'Louvre Museum Tour', image: 'https://images.pexels.com/photos/2675268/pexels-photo-2675268.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 3, name: 'Versailles Palace Day Trip', image: 'https://images.pexels.com/photos/2422259/pexels-photo-2422259.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ]
  },
  {
    id: 'bali-indonesia',
    name: 'Bali',
    country: 'Indonesia',
    destinationId: 'bali-indonesia',
    image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tourCount: 34,
    continent: 'Asia',
    description: 'Immerse yourself in the magical island paradise with pristine beaches, ancient temples, lush rice terraces, and vibrant Balinese culture.',
    rating: 4.8,
    bestTime: 'April - October',
    tours: [
      { id: 4, name: 'Ubud Rice Terraces & Temples', image: 'https://images.pexels.com/photos/2161449/pexels-photo-2161449.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 5, name: 'Beach Hopping Adventure', image: 'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 6, name: 'Mount Batur Sunrise Trek', image: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ]
  },
  {
    id: 'tokyo-japan',
    name: 'Tokyo',
    country: 'Japan',
    destinationId: 'tokyo-japan',
    image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tourCount: 22,
    continent: 'Asia',
    description: 'Discover the perfect harmony of ancient traditions and cutting-edge technology in this mesmerizing metropolis where the future meets the past.',
    rating: 4.9,
    bestTime: 'March - May',
    tours: [
      { id: 7, name: 'Tokyo City Highlights', image: 'https://images.pexels.com/photos/315191/pexels-photo-315191.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 8, name: 'Mount Fuji Day Trip', image: 'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 9, name: 'Traditional Tea Ceremony', image: 'https://images.pexels.com/photos/5538323/pexels-photo-5538323.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ]
  },
  {
    id: 'dubai-uae',
    name: 'Dubai',
    country: 'UAE',
    destinationId: 'dubai-uae',
    image: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tourCount: 19,
    continent: 'Asia',
    description: 'Step into a world of opulence and innovation where desert dreams become reality with iconic skyscrapers and extraordinary experiences.',
    rating: 4.7,
    bestTime: 'November - March',
    tours: [
      { id: 10, name: 'Burj Khalifa & Dubai Mall', image: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 11, name: 'Desert Safari Adventure', image: 'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ]
  },
  {
    id: 'santorini-greece',
    name: 'Santorini',
    country: 'Greece',
    destinationId: 'santorini-greece',
    image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tourCount: 16,
    continent: 'Europe',
    description: 'Discover the enchanting beauty of whitewashed villages, stunning caldera views, and legendary sunsets that paint the sky in golden hues.',
    rating: 4.9,
    bestTime: 'April - October',
    tours: [
      { id: 12, name: 'Sunset Catamaran Cruise', image: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 13, name: 'Wine Tasting Tour', image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ]
  },
  {
    id: 'new-york-usa',
    name: 'New York',
    country: 'USA',
    destinationId: 'new-york-usa',
    image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tourCount: 31,
    continent: 'North America',
    description: 'Experience the pulse of the city that never sleeps with world-class museums, Broadway shows, and iconic landmarks at every corner.',
    rating: 4.8,
    bestTime: 'April - June',
    tours: [
      { id: 14, name: 'Manhattan Walking Tour', image: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 15, name: 'Statue of Liberty Tour', image: 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ]
  },
  {
    id: 'rome-italy',
    name: 'Rome',
    country: 'Italy',
    destinationId: 'rome-italy',
    image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tourCount: 25,
    continent: 'Europe',
    description: 'Walk through history in the Eternal City with ancient ruins, Renaissance art, and authentic Italian cuisine at every corner.',
    rating: 4.8,
    bestTime: 'April - June',
    tours: [
      { id: 16, name: 'Colosseum & Roman Forum', image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 17, name: 'Vatican Museums Tour', image: 'https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ]
  },
  {
    id: 'sydney-australia',
    name: 'Sydney',
    country: 'Australia',
    destinationId: 'sydney-australia',
    image: 'https://images.pexels.com/photos/995765/pexels-photo-995765.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tourCount: 18,
    continent: 'Oceania',
    description: 'Experience Australia\'s harbor city with its iconic Opera House, beautiful beaches, and laid-back lifestyle under the southern sun.',
    rating: 4.7,
    bestTime: 'September - November',
    tours: [
      { id: 18, name: 'Sydney Opera House Tour', image: 'https://images.pexels.com/photos/995765/pexels-photo-995765.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 19, name: 'Bondi Beach & Coastal Walk', image: 'https://images.pexels.com/photos/327430/pexels-photo-327430.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ]
  },
];

const DestinationList = () => {
  const [selectedDestination, setSelectedDestination] = useState('paris-france');
  const [hoveredTour, setHoveredTour] = useState(null);

  const handleDestinationClick = (destinationId) => {
    const url = `/destinfo?destinationId=${destinationId}`;
    window.location.href = url;
  };

  const destination = destinations.find(d => d.id === selectedDestination);

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
      `}</style>

      <div className="container mx-auto px-4 py-12">
        {/* Select Button */}
        <div className="flex justify-end mb-8">
          <select 
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="px-6 py-2.5 rounded-lg bg-white text-gray-900 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
          >
            {destinations.map((dest) => (
              <option key={dest.id} value={dest.id}>
                {dest.name}, {dest.country}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-12 text-center animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Popular Destinations</h2>
          </div>
          <p className="text-gray-600 text-lg">Discover amazing places around the world</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {destinations.map((dest, index) => (
            <div
              key={dest.id}
              onClick={() => handleDestinationClick(dest.destinationId)}
              className={`group relative h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer animate-scale-in delay-${index * 100}`}
              style={{ opacity: 0 }}
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                <MapPin className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-medium">{dest.country}</span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                  {dest.name}, {dest.country}
                </h3>
                <p className="text-white/90 font-medium">{dest.tourCount} Tours Available</p>
              </div>

              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 transition-colors duration-300 rounded-2xl pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Selected Destination Details */}
        {destination && (
          <div className="animate-fade-in-up delay-400" style={{ opacity: 0 }}>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 md:p-12 mb-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-600 font-semibold">{destination.country}, {destination.continent}</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    {destination.name}
                  </h2>
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    {destination.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-900">{destination.rating}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-900 font-medium">{destination.tourCount} Tours</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-900 font-medium">{destination.bestTime}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-80 object-cover rounded-2xl shadow-xl"
                  />
                </div>
              </div>
            </div>

            {/* Tours Section */}
            <div>
              <div className="flex items-center gap-2 mb-8">
                <Award className="h-6 w-6 text-blue-600" />
                <h3 className="text-3xl font-bold text-gray-900">Popular Tours in {destination.name}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {destination.tours.map((tour, index) => (
                  <div
                    key={tour.id}
                    className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 animate-scale-in delay-${(index + 5) * 100}`}
                    style={{ opacity: 0 }}
                    onMouseEnter={() => setHoveredTour(tour.id)}
                    onMouseLeave={() => setHoveredTour(null)}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={tour.image} 
                        alt={tour.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>

                    <div className="p-6">
                      <h4 className="text-xl text-center font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300 min-h-14 flex items-center justify-center">
                        {tour.name}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationList;