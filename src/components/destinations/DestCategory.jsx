import React, { useState, useEffect } from 'react';
import { Heart, Briefcase, Users, MapPin, DollarSign, Star, Clock, X, Plus, Minus } from 'lucide-react';

const tripPackages = {
  'paris-france': {
    name: 'Paris, France',
    honeymoon: [
      { id: 1, name: 'Romantic Paris Getaway', duration: '5 Days 4 Nights', price: '₹2,49,999', rating: 4.9, image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Eiffel Tower Dinner, Seine Cruise, Private Tour', tours: '12 Tours Available' },
      { id: 2, name: 'Champagne & Châteaux', duration: '7 Days 6 Nights', price: '₹3,29,999', rating: 4.8, image: 'https://images.pexels.com/photos/2422259/pexels-photo-2422259.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Versailles, Wine Tasting, Luxury Hotel', tours: '15 Tours Available' },
    ],
    office: [
      { id: 4, name: 'Paris Business Retreat', duration: '3 Days 2 Nights', price: '₹1,79,999', rating: 4.6, image: 'https://images.pexels.com/photos/2869499/pexels-photo-2869499.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Conference Facilities, Team Building, City Tour', tours: '8 Tours Available' },
    ],
    family: [
      { id: 6, name: 'Paris Family Adventure', duration: '6 Days 5 Nights', price: '₹3,49,999', rating: 4.8, image: 'https://images.pexels.com/photos/2739666/pexels-photo-2739666.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Disneyland Paris, Eiffel Tower, Kid-Friendly Tours', tours: '10 Tours Available' },
    ]
  },
  'bali-indonesia': {
    name: 'Bali, Indonesia',
    honeymoon: [
      { id: 9, name: 'Bali Tropical Romance', duration: '7 Days 6 Nights', price: '₹2,19,999', rating: 4.9, image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Beach Villa, Couples Massage, Sunset Dinner', tours: '15 Tours Available' },
    ],
    office: [
      { id: 12, name: 'Bali Team Building Retreat', duration: '4 Days 3 Nights', price: '₹1,59,999', rating: 4.6, image: 'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Beach Activities, Meeting Spaces, Team Challenges', tours: '8 Tours Available' }
    ],
    family: [
      { id: 14, name: 'Bali Family Beach Holiday', duration: '8 Days 7 Nights', price: '₹3,19,999', rating: 4.8, image: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Water Sports, Cultural Shows, Family Resort', tours: '12 Tours Available' },
    ]
  },
  'tokyo-japan': {
    name: 'Tokyo, Japan',
    honeymoon: [
      { id: 17, name: 'Tokyo Cherry Blossom Romance', duration: '6 Days 5 Nights', price: '₹2,89,999', rating: 4.9, image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Mount Fuji View, Traditional Ryokan, Tea Ceremony', tours: '10 Tours Available' },
    ],
    office: [
      { id: 19, name: 'Tokyo Innovation Summit', duration: '4 Days 3 Nights', price: '₹2,19,999', rating: 4.7, image: 'https://images.pexels.com/photos/2339009/pexels-photo-2339009.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Tech Tours, Conference Halls, Networking Events', tours: '8 Tours Available' },
    ],
    family: [
      { id: 21, name: 'Tokyo Disney Family Trip', duration: '7 Days 6 Nights', price: '₹3,79,999', rating: 4.9, image: 'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Tokyo Disneyland, DisneySea, Family Hotel', tours: '15 Tours Available' },
    ]
  }
};

const destinationTitles = {
  'paris-france': 'Paris, France Tour',
  'bali-indonesia': 'Bali, Indonesia Tour',
  'tokyo-japan': 'Tokyo, Japan Tour',
};

const TripInquiryModal = ({ isOpen, onClose, destinationId = 'paris-france', tripName = '' }) => {
  const [formData, setFormData] = useState({
    departureDate: '',
    adults: 1,
    totalChildren: 0,
    childrenAges: [],
    fullName: '',
    email: '',
    phone: '',
    securityAnswer: ''
  });

  const [num1] = useState(Math.floor(Math.random() * 9) + 1);
  const [num2] = useState(Math.floor(Math.random() * 9) + 1);

  if (!isOpen) return null;

  const destinationTitle = destinationTitles[destinationId] || 'Amazing Tour';
  const displayTitle = tripName || destinationTitle;

  const handleAddChild = () => {
    if (formData.childrenAges.length < 10) {
      setFormData({
        ...formData,
        totalChildren: formData.totalChildren + 1,
        childrenAges: [...formData.childrenAges, 5]
      });
    }
  };

  const handleRemoveChild = (index) => {
    const newAges = formData.childrenAges.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      totalChildren: newAges.length,
      childrenAges: newAges
    });
  };

  const handleChildAgeChange = (index, value) => {
    const newAges = [...formData.childrenAges];
    newAges[index] = parseInt(value) || 0;
    setFormData({
      ...formData,
      childrenAges: newAges
    });
  };

  const handleSubmit = () => {
    if (!formData.departureDate || !formData.fullName || !formData.email || !formData.phone || !formData.securityAnswer) {
      alert('Please fill in all required fields.');
      return;
    }
    if (parseInt(formData.securityAnswer) !== num1 + num2) {
      alert('Incorrect security answer. Please try again.');
      return;
    }
    console.log('Inquiry submitted:', { ...formData, destinationId, tripName });
    alert('Inquiry sent successfully!');
    setFormData({
      departureDate: '',
      adults: 1,
      totalChildren: 0,
      childrenAges: [],
      fullName: '',
      email: '',
      phone: '',
      securityAnswer: ''
    });
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <div>
              <h2 className="text-2xl font-bold text-teal-700">Trip Inquiry</h2>
              <p className="text-sm text-gray-600 mt-1">
                Inquiring about: <span className="font-semibold text-teal-600">{displayTitle}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">1. Preferred Departure Date</label>
              <input
                type="date"
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3">2. Number of Travelers & Ages</label>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Adults (12+)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.adults}
                    onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg font-semibold focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Total Children (2-11)</label>
                  <input
                    type="number"
                    readOnly
                    value={formData.totalChildren}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg font-semibold bg-gray-50"
                  />
                </div>
              </div>

              {formData.childrenAges.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2">Children's Ages (2-11)</label>
                  <div className="space-y-2">
                    {formData.childrenAges.map((age, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="number"
                          min="2"
                          max="11"
                          value={age}
                          onChange={(e) => handleChildAgeChange(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveChild(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddChild}
                className="w-full py-3 border-2 border-dashed border-teal-300 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                <Plus className="w-5 h-5" />
                Add Child
              </button>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3">3. Contact Details</label>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition placeholder-gray-400"
                />
                <input
                  type="email"
                  placeholder="Email ID"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition placeholder-gray-400"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-teal-700 font-semibold mb-3">4. Security Check</label>
              <div className="flex items-center gap-3">
                <div className="px-6 py-4 bg-teal-50 border-2 border-teal-300 rounded-lg font-bold text-xl text-teal-700">
                  {num1} × {num2} = ?
                </div>
                <input
                  type="number"
                  placeholder="Enter result"
                  value={formData.securityAnswer}
                  onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                  className="flex-1 px-4 py-4 border-2 border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition placeholder-gray-400"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 rounded-lg font-bold text-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Send Inquiry
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

const TripCard = ({ destination, category, onQueryClick, destinationId }) => {
  const handleCardClick = () => {
    // Create a URL-friendly slug from the destination name
    const tripSlug = destination.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    // Changed from destinationId to tripId in the URL
    window.location.href = `/destinfo/${category.id}?tripId=${tripSlug}`;
  };

  const currentDestination = tripPackages[destinationId];

  return (
    <div 
      onClick={handleCardClick}
      className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
      style={{ height: '400px' }}
    >
      <img 
        src={destination.image} 
        alt={destination.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
        <MapPin className="h-4 w-4 text-gray-700" />
        <span className="font-semibold text-sm text-gray-900">{destination.location || currentDestination.name}</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h4 className="text-2xl font-bold mb-2 transition-all duration-300 group-hover:text-yellow-300">
          {destination.name}
        </h4>
        
        <p className="text-sm text-gray-200 mb-3">{destination.tours || destination.highlights}</p>
        
        <p className="text-sm text-gray-300 mb-4">{destination.duration}</p>
        
        <div className="text-3xl font-bold">
          {destination.price} <span className="text-base font-normal">per person</span>
        </div>
      </div>
    </div>
  );
};

const TripPackagesByCategory = ({ destinationId: propDestinationId = 'paris-france' }) => {
  const [destinationId, setDestinationId] = useState(propDestinationId);
  const [currentDestination, setCurrentDestination] = useState(tripPackages[propDestinationId]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTripName, setSelectedTripName] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    
    let urlDestinationId = searchParams.get('destinationid') || 
                          searchParams.get('destinationId') || 
                          searchParams.get('destination');
    
    console.log('URL Search Params:', window.location.search);
    console.log('URL Destination ID:', urlDestinationId);
    console.log('Available destinations:', Object.keys(tripPackages));
    
    if (urlDestinationId && tripPackages[urlDestinationId]) {
      console.log('Setting destination to:', urlDestinationId);
      setDestinationId(urlDestinationId);
      setCurrentDestination(tripPackages[urlDestinationId]);
    } else {
      console.log('No URL param, using prop:', propDestinationId);
      setDestinationId(propDestinationId);
      setCurrentDestination(tripPackages[propDestinationId]);
    }
  }, [propDestinationId]);

  useEffect(() => {
    const handleUrlChange = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const urlDestinationId = searchParams.get('destinationid');
      
      console.log('URL changed, new destination:', urlDestinationId);
      
      if (urlDestinationId) {
        setDestinationId(urlDestinationId);
        setCurrentDestination(tripPackages[urlDestinationId] || tripPackages['paris-france']);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const handleQueryClick = (tripName) => {
    setSelectedTripName(tripName);
    setModalOpen(true);
  };

  const destinationData = currentDestination;

  const categories = [
    { 
      id: 'honeymoon', 
      name: 'Honeymoon Trip Packages', 
      icon: Heart, 
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50'
    },
    { 
      id: 'office', 
      name: 'Office Trip Packages', 
      icon: Briefcase, 
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50'
    },
    { 
      id: 'family', 
      name: 'Family Trip Packages', 
      icon: Users, 
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    }
  ];

  if (!destinationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-900">Loading destination...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {categories.map((category) => {
          const CategoryIcon = category.icon;
          const categoryPackages = destinationData[category.id] || [];

          if (categoryPackages.length === 0) return null;

          return (
            <div key={category.id} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${category.color} shadow-lg`}>
                  <CategoryIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryPackages.map((destination) => (
                  <TripCard 
                    key={destination.id} 
                    destination={destination} 
                    category={category}
                    onQueryClick={handleQueryClick}
                    destinationId={destinationId}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <TripInquiryModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        destinationId={destinationId}
        tripName={selectedTripName}
      />
    </div>
  );
};

export default TripPackagesByCategory;