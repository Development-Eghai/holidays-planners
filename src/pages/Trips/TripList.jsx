import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Sliders, Star, Backpack, Bus, Plane, Mountain, PartyPopper, Briefcase, Heart, Users, X, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';

const allTours = [
{
id: 1,
tripId: 'jibhi',
title: 'Jibhi & Tirthan Valley',
location: 'Himachal Pradesh',
image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
duration: '3 Days 2 Nights',
days: 3,
people: 15,
price: 7000,
originalPrice: 8000,
rating: 4.8,
reviews: 156,
category: 'Adventure',
difficulty: 'Easy',
travelStyle: 'weekend',
featured: true,
discount: 12,
toursAvailable: '12 Tours Available'
},
{
id: 2,
tripId: 'kasol',
title: 'Kasol Kheerganga Trek',
location: 'Himachal Pradesh',
image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
duration: '3 Days 2 Nights',
days: 3,
people: 20,
price: 6500,
originalPrice: 7500,
rating: 4.7,
reviews: 203,
category: 'Adventure',
difficulty: 'Moderate',
travelStyle: 'backpacking',
bestseller: true,
discount: 13,
toursAvailable: '15 Tours Available'
},
{
id: 3,
tripId: 'chopta',
title: 'Chopta-Tungnath-Deoriatal',
location: 'Uttarakhand',
image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
duration: '3 Days 2 Nights',
days: 3,
people: 18,
price: 6500,
originalPrice: null,
rating: 4.6,
reviews: 189,
category: 'Adventure',
difficulty: 'Moderate',
travelStyle: 'adventure',
featured: false,
toursAvailable: '10 Tours Available'
},
{
id: 4,
tripId: 'yulia',
title: 'Yulia Kanda Trek',
location: 'Himachal Pradesh',
image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',
duration: '3 Days 2 Nights',
days: 3,
people: 12,
price: 8000,
originalPrice: null,
rating: 4.9,
reviews: 124,
category: 'Adventure',
difficulty: 'Difficult',
travelStyle: 'adventure',
featured: true,
toursAvailable: '8 Tours Available'
},
{
id: 5,
tripId: 'hampta',
title: 'Hampta Pass Trek',
location: 'Himachal Pradesh',
image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
duration: '5 Days 4 Nights',
days: 5,
people: 16,
price: 12000,
originalPrice: 14000,
rating: 4.8,
reviews: 178,
category: 'Adventure',
difficulty: 'Difficult',
travelStyle: 'backpacking',
bestseller: true,
discount: 14,
toursAvailable: '14 Tours Available'
},
{
id: 6,
tripId: 'kedarkantha',
title: 'Kedarkantha Trek',
location: 'Uttarakhand',
image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
duration: '6 Days 5 Nights',
days: 6,
people: 20,
price: 15000,
originalPrice: null,
rating: 4.9,
reviews: 245,
category: 'Adventure',
difficulty: 'Difficult',
travelStyle: 'adventure',
featured: true,
toursAvailable: '9 Tours Available'
},
{
id: 7,
tripId: 'valley',
title: 'Valley of Flowers',
location: 'Uttarakhand',
image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
duration: '7 Days 6 Nights',
days: 7,
people: 15,
price: 18000,
originalPrice: 20000,
rating: 4.9,
reviews: 312,
category: 'Adventure',
difficulty: 'Moderate',
travelStyle: 'adventure',
bestseller: true,
discount: 10,
toursAvailable: '6 Tours Available'
},
{
id: 8,
tripId: 'triund',
title: 'Triund Trek',
location: 'Himachal Pradesh',
image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',
duration: '2 Days 1 Night',
days: 2,
people: 25,
price: 3500,
originalPrice: null,
rating: 4.5,
reviews: 421,
category: 'Adventure',
difficulty: 'Easy',
travelStyle: 'weekend',
featured: false,
toursAvailable: '20 Tours Available'
},
{
id: 9,
tripId: 'spiti',
title: 'Frozen Spiti Expedition',
location: 'Himachal Pradesh',
image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',
duration: '7 Days 6 Nights',
days: 7,
people: 12,
price: 25999,
originalPrice: 30000,
rating: 4.9,
reviews: 167,
category: 'Adventure',
difficulty: 'Difficult',
travelStyle: 'adventure',
featured: true,
discount: 13,
toursAvailable: '5 Tours Available'
},
{
id: 10,
tripId: 'manali',
title: 'Manali Cultural Tour',
location: 'Himachal Pradesh',
image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
duration: '4 Days 3 Nights',
days: 4,
people: 20,
price: 9500,
originalPrice: null,
rating: 4.6,
reviews: 198,
category: 'Cultural',
difficulty: 'Easy',
travelStyle: 'weekend',
featured: false,
toursAvailable: '11 Tours Available'
},
{
id: 11,
tripId: 'rishikesh',
title: 'Rishikesh Beach Camping',
location: 'Uttarakhand',
image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
duration: '2 Days 1 Night',
days: 2,
people: 30,
price: 4500,
originalPrice: 5000,
rating: 4.7,
reviews: 289,
category: 'Beach',
difficulty: 'Easy',
travelStyle: 'weekend',
bestseller: true,
discount: 10,
toursAvailable: '18 Tours Available'
},
{
id: 12,
tripId: 'jim-corbett',
title: 'Jim Corbett Wildlife Safari',
location: 'Uttarakhand',
image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',
duration: '3 Days 2 Nights',
days: 3,
people: 18,
price: 11000,
originalPrice: null,
rating: 4.8,
reviews: 156,
category: 'Wildlife',
difficulty: 'Easy',
travelStyle: 'corporate',
featured: true,
toursAvailable: '7 Tours Available'
}
];

const travelStyles = [
{
name: 'Backpacking',
slug: 'backpacking',
icon: Backpack,
color: 'from-orange-500 to-red-500',
hoverColor: 'hover:border-orange-500',
selectedColor: 'border-orange-500 bg-orange-50',
},
{
name: 'Weekend',
slug: 'weekend',
icon: Bus,
color: 'from-emerald-500 to-teal-500',
hoverColor: 'hover:border-emerald-500',
selectedColor: 'border-emerald-500 bg-emerald-50',
},
{
name: 'International',
slug: 'international',
icon: Plane,
color: 'from-blue-500 to-indigo-600',
hoverColor: 'hover:border-blue-500',
selectedColor: 'border-blue-500 bg-blue-50',
},
{
name: 'Adventure',
slug: 'adventure',
icon: Mountain,
color: 'from-purple-500 to-pink-500',
hoverColor: 'hover:border-purple-500',
selectedColor: 'border-purple-500 bg-purple-50',
},
{
name: 'Honeymoon',
slug: 'honeymoon',
icon: PartyPopper,
color: 'from-rose-500 to-pink-600',
hoverColor: 'hover:border-rose-500',
selectedColor: 'border-rose-500 bg-rose-50',
},
{
name: 'Corporate',
slug: 'corporate',
icon: Briefcase,
color: 'from-slate-600 to-gray-700',
hoverColor: 'hover:border-slate-600',
selectedColor: 'border-slate-600 bg-slate-50',
},
];

const tripPackages = {
  'paris-france': {
    name: 'Paris, France',
    honeymoon: [
      { id: 1, name: 'Romantic Paris Getaway', duration: '5 Days 4 Nights', price: 249999, days: 5, rating: 4.9, reviews: 156, image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Eiffel Tower Dinner, Seine Cruise, Private Tour', tours: '12 Tours Available', featured: true, travelStyle: 'honeymoon', difficulty: 'Easy', category: 'Cultural' },
      { id: 2, name: 'Champagne & Châteaux', duration: '7 Days 6 Nights', price: 329999, days: 7, rating: 4.8, reviews: 203, image: 'https://images.pexels.com/photos/2422259/pexels-photo-2422259.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Versailles, Wine Tasting, Luxury Hotel', tours: '15 Tours Available', bestseller: true, travelStyle: 'honeymoon', difficulty: 'Easy', category: 'Cultural' },
      { id: 3, name: 'Paris Love Package', duration: '4 Days 3 Nights', price: 199999, days: 4, rating: 4.7, reviews: 189, image: 'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Louvre Museum, Romantic Dinner, City Lights', tours: '10 Tours Available', travelStyle: 'honeymoon', difficulty: 'Easy', category: 'Cultural' },
    ],
    office: [
      { id: 4, name: 'Paris Business Retreat', duration: '3 Days 2 Nights', price: 179999, days: 3, rating: 4.6, reviews: 124, image: 'https://images.pexels.com/photos/2869499/pexels-photo-2869499.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Conference Facilities, Team Building, City Tour', tours: '8 Tours Available', travelStyle: 'corporate', difficulty: 'Easy', category: 'Cultural' },
      { id: 5, name: 'Corporate Paris Experience', duration: '4 Days 3 Nights', price: 229999, days: 4, rating: 4.7, reviews: 156, image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Meeting Rooms, Networking Events, Gala Dinner', tours: '6 Tours Available', featured: true, travelStyle: 'corporate', difficulty: 'Easy', category: 'Cultural' },
      { id: 6, name: 'Team Building Paris', duration: '2 Days 1 Night', price: 149999, days: 2, rating: 4.5, reviews: 98, image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Adventure Activities, Team Games, Dinner Cruise', tours: '5 Tours Available', travelStyle: 'corporate', difficulty: 'Easy', category: 'Cultural' },
    ],
    family: [
      { id: 7, name: 'Paris Family Adventure', duration: '6 Days 5 Nights', price: 349999, days: 6, rating: 4.8, reviews: 189, image: 'https://images.pexels.com/photos/2739666/pexels-photo-2739666.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Disneyland Paris, Eiffel Tower, Kid-Friendly Tours', tours: '10 Tours Available', featured: true, travelStyle: 'international', difficulty: 'Easy', category: 'Cultural' },
      { id: 8, name: 'Family Fun in Paris', duration: '5 Days 4 Nights', price: 299999, days: 5, rating: 4.7, reviews: 167, image: 'https://images.pexels.com/photos/1850629/pexels-photo-1850629.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Theme Parks, Museums, Seine River Cruise', tours: '8 Tours Available', bestseller: true, travelStyle: 'international', difficulty: 'Easy', category: 'Cultural' },
      { id: 9, name: 'Paris Kids Special', duration: '4 Days 3 Nights', price: 249999, days: 4, rating: 4.6, reviews: 145, image: 'https://images.pexels.com/photos/2467506/pexels-photo-2467506.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Interactive Tours, Adventure Parks, French Cuisine', tours: '7 Tours Available', travelStyle: 'international', difficulty: 'Easy', category: 'Cultural' },
    ]
  },
  'bali-indonesia': {
    name: 'Bali, Indonesia',
    honeymoon: [
      { id: 10, name: 'Bali Tropical Romance', duration: '7 Days 6 Nights', price: 219999, days: 7, rating: 4.9, reviews: 245, image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Beach Villa, Couples Massage, Sunset Dinner', tours: '15 Tours Available', bestseller: true, travelStyle: 'honeymoon', difficulty: 'Easy', category: 'Beach' },
      { id: 11, name: 'Bali Honeymoon Bliss', duration: '6 Days 5 Nights', price: 189999, days: 6, rating: 4.8, reviews: 213, image: 'https://images.pexels.com/photos/1680140/pexels-photo-1680140.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Private Pool Villa, Spa Treatment, Island Tours', tours: '12 Tours Available', featured: true, travelStyle: 'honeymoon', difficulty: 'Easy', category: 'Beach' },
      { id: 12, name: 'Romantic Bali Escape', duration: '5 Days 4 Nights', price: 159999, days: 5, rating: 4.7, reviews: 198, image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Beach Resort, Water Sports, Cultural Shows', tours: '10 Tours Available', travelStyle: 'honeymoon', difficulty: 'Easy', category: 'Beach' },
    ],
    office: [
      { id: 13, name: 'Bali Team Building Retreat', duration: '4 Days 3 Nights', price: 159999, days: 4, rating: 4.6, reviews: 167, image: 'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Beach Activities, Meeting Spaces, Team Challenges', tours: '8 Tours Available', travelStyle: 'corporate', difficulty: 'Easy', category: 'Beach' },
      { id: 14, name: 'Corporate Bali Getaway', duration: '5 Days 4 Nights', price: 199999, days: 5, rating: 4.7, reviews: 189, image: 'https://images.pexels.com/photos/1549280/pexels-photo-1549280.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Conference Hall, Networking, Adventure Activities', tours: '7 Tours Available', bestseller: true, travelStyle: 'corporate', difficulty: 'Easy', category: 'Beach' },
      { id: 15, name: 'Bali Business Package', duration: '3 Days 2 Nights', price: 129999, days: 3, rating: 4.5, reviews: 134, image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Meeting Facilities, Team Dinner, Cultural Tour', tours: '6 Tours Available', travelStyle: 'corporate', difficulty: 'Easy', category: 'Beach' },
    ],
    family: [
      { id: 16, name: 'Bali Family Beach Holiday', duration: '8 Days 7 Nights', price: 319999, days: 8, rating: 4.8, reviews: 198, image: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Water Sports, Cultural Shows, Family Resort', tours: '12 Tours Available', featured: true, travelStyle: 'international', difficulty: 'Easy', category: 'Beach' },
      { id: 17, name: 'Family Fun Bali', duration: '6 Days 5 Nights', price: 269999, days: 6, rating: 4.7, reviews: 176, image: 'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Beach Activities, Kid-Friendly Tours, Water Parks', tours: '10 Tours Available', travelStyle: 'international', difficulty: 'Easy', category: 'Beach' },
      { id: 18, name: 'Bali Kids Adventure', duration: '5 Days 4 Nights', price: 229999, days: 5, rating: 4.6, reviews: 154, image: 'https://images.pexels.com/photos/2412610/pexels-photo-2412610.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Monkey Forest, Rice Terraces, Beach Fun', tours: '8 Tours Available', bestseller: true, travelStyle: 'international', difficulty: 'Easy', category: 'Beach' },
    ]
  },
  'tokyo-japan': {
    name: 'Tokyo, Japan',
    honeymoon: [
      { id: 19, name: 'Tokyo Cherry Blossom Romance', duration: '6 Days 5 Nights', price: 289999, days: 6, rating: 4.9, reviews: 289, image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Mount Fuji View, Traditional Ryokan, Tea Ceremony', tours: '10 Tours Available', featured: true, travelStyle: 'honeymoon', difficulty: 'Easy', category: 'Cultural' },
      { id: 20, name: 'Romantic Tokyo Escape', duration: '5 Days 4 Nights', price: 249999, days: 5, rating: 4.8, reviews: 256, image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Tokyo Tower, Kyoto Day Trip, Onsen Experience', tours: '8 Tours Available', bestseller: true, travelStyle: 'honeymoon', difficulty: 'Easy', category: 'Cultural' },
      { id: 21, name: 'Tokyo Love Story', duration: '4 Days 3 Nights', price: 209999, days: 4, rating: 4.7, reviews: 234, image: 'https://images.pexels.com/photos/2506897/pexels-photo-2506897.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Shibuya Crossing, Temples, Fine Dining', tours: '7 Tours Available', travelStyle: 'honeymoon', difficulty: 'Easy', category: 'Cultural' },
    ],
    office: [
      { id: 22, name: 'Tokyo Innovation Summit', duration: '4 Days 3 Nights', price: 219999, days: 4, rating: 4.7, reviews: 178, image: 'https://images.pexels.com/photos/2339009/pexels-photo-2339009.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Tech Tours, Conference Halls, Networking Events', tours: '8 Tours Available', travelStyle: 'corporate', difficulty: 'Easy', category: 'Cultural' },
      { id: 23, name: 'Tokyo Business Elite', duration: '5 Days 4 Nights', price: 259999, days: 5, rating: 4.8, reviews: 198, image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Business Center, Corporate Tours, Gala Events', tours: '6 Tours Available', featured: true, travelStyle: 'corporate', difficulty: 'Easy', category: 'Cultural' },
      { id: 24, name: 'Corporate Tokyo Package', duration: '3 Days 2 Nights', price: 189999, days: 3, rating: 4.6, reviews: 167, image: 'https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Meeting Rooms, Team Activities, City Tour', tours: '5 Tours Available', travelStyle: 'corporate', difficulty: 'Easy', category: 'Cultural' },
    ],
    family: [
      { id: 25, name: 'Tokyo Disney Family Trip', duration: '7 Days 6 Nights', price: 379999, days: 7, rating: 4.9, reviews: 312, image: 'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Tokyo Disneyland, DisneySea, Family Hotel', tours: '15 Tours Available', bestseller: true, travelStyle: 'international', difficulty: 'Easy', category: 'Cultural' },
      { id: 26, name: 'Family Tokyo Adventure', duration: '6 Days 5 Nights', price: 329999, days: 6, rating: 4.8, reviews: 289, image: 'https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Theme Parks, Museums, Kid-Friendly Tours', tours: '12 Tours Available', featured: true, travelStyle: 'international', difficulty: 'Easy', category: 'Cultural' },
      { id: 27, name: 'Tokyo Kids Special', duration: '5 Days 4 Nights', price: 289999, days: 5, rating: 4.7, reviews: 267, image: 'https://images.pexels.com/photos/2339009/pexels-photo-2339009.jpeg?auto=compress&cs=tinysrgb&w=400', highlights: 'Anime Tours, Interactive Museums, Cultural Shows', tours: '10 Tours Available', travelStyle: 'international', difficulty: 'Easy', category: 'Cultural' },
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
        <div 
          className="bg-white w-full h-full sm:h-auto sm:rounded-2xl shadow-2xl sm:max-w-lg sm:max-h-[90vh] overflow-y-auto pointer-events-auto animate-slide-up sm:animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sm:rounded-t-2xl z-10">
            <div className="flex-1 pr-4">
              <h2 className="text-xl sm:text-2xl font-bold text-teal-700">Trip Inquiry</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 line-clamp-1">
                <span className="font-semibold text-teal-600">{displayTitle}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 pb-6 sm:pb-8">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                1. Preferred Departure Date
              </label>
              <input
                type="date"
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                className="w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition text-base"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-sm sm:text-base">
                2. Number of Travelers & Ages
              </label>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 mb-2">Adults (12+)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.adults}
                    onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg text-center text-lg font-semibold focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 mb-2">Children (2-11)</label>
                  <input
                    type="number"
                    readOnly
                    value={formData.totalChildren}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg text-center text-lg font-semibold bg-gray-50"
                  />
                </div>
              </div>

              {formData.childrenAges.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs sm:text-sm text-gray-600 mb-2">Children's Ages (2-11)</label>
                  <div className="space-y-2">
                    {formData.childrenAges.map((age, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 w-16">Child {index + 1}:</span>
                        <input
                          type="number"
                          min="2"
                          max="11"
                          value={age}
                          onChange={(e) => handleChildAgeChange(index, e.target.value)}
                          className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-base"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveChild(index)}
                          className="p-2.5 sm:p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddChild}
                className="w-full py-3 sm:py-3.5 border-2 border-dashed border-teal-300 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Add Child
              </button>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-sm sm:text-base">
                3. Contact Details
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition placeholder-gray-400 text-base"
                />
                <input
                  type="email"
                  placeholder="Email ID"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition placeholder-gray-400 text-base"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition placeholder-gray-400 text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-teal-700 font-semibold mb-3 text-sm sm:text-base">
                4. Security Check
              </label>
              <div className="flex items-center gap-3">
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-teal-50 border-2 border-teal-300 rounded-lg font-bold text-lg sm:text-xl text-teal-700 flex-shrink-0">
                  {num1} + {num2} = ?
                </div>
                <input
                  type="number"
                  placeholder="Answer"
                  value={formData.securityAnswer}
                  onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                  className="flex-1 px-3 sm:px-4 py-3 sm:py-4 border-2 border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition placeholder-gray-400 text-base"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3.5 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform active:scale-95 shadow-lg hover:shadow-xl"
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

        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

const DestinationTripCard = ({ destination, category, onQueryClick, destinationId }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    const tripSlug = destination.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    window.location.href = `/destinfo/${category.id}?tripId=${tripSlug}`;
  };

  const currentDestination = tripPackages[destinationId];

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer"
    >
      <div className="relative h-80 sm:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl">
        <img
          src={destination.image}
          alt={destination.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 shadow-lg">
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
          <span className="text-xs sm:text-sm font-medium text-gray-700">{destination.location || currentDestination.name}</span>
        </div>

        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-1.5 sm:gap-2">
          {destination.featured && (
            <span className="bg-blue-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-lg">
              Featured
            </span>
          )}
          {destination.bestseller && (
            <span className="bg-green-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-lg">
              Bestseller
            </span>
          )}
        </div>

        {destination.rating && (
          <div className="absolute top-16 sm:top-20 left-3 sm:left-4 bg-yellow-400/90 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg flex items-center gap-0.5 sm:gap-1 shadow-lg">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white text-white" />
            <span className="text-xs sm:text-sm font-bold text-white">{destination.rating}</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
          <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3 leading-tight line-clamp-2">
            {destination.name}
          </h3>
          
          <p className="text-white/90 mb-3 sm:mb-4 text-xs sm:text-sm font-medium line-clamp-1">
            {destination.tours || destination.highlights}
          </p>

          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-white/80">{destination.duration}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold">₹{destination.price.toLocaleString()}</span>
              <span className="text-white/80 text-xs sm:text-sm">per person</span>
            </div>
          </div>
        </div>

        <div className={`absolute inset-0 border-2 sm:border-4 border-blue-500 rounded-2xl sm:rounded-3xl transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>
    </div>
  );
};

export default function ToursListingPage() {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTravelStyles, setSelectedTravelStyles] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTripName, setSelectedTripName] = useState('');
  const [selectedDestinationId, setSelectedDestinationId] = useState('paris-france');

  useEffect(() => {
    const travelStyleParam = searchParams.get('travelStyle');
    if (travelStyleParam) {
      setSelectedTravelStyles([travelStyleParam]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchParams]);

  const handleDurationChange = (duration) => {
    setSelectedDurations(prev =>
      prev.includes(duration)
        ? prev.filter(d => d !== duration)
        : [...prev, duration]
    );
  };

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulties(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleTravelStyleChange = (slug) => {
    setSelectedTravelStyles(prev =>
      prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    );
  };

  const applyFilters = (item) => {
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];

    const matchesDuration = selectedDurations.length === 0 || selectedDurations.some(d => {
      if (d === '1-3') return item.days >= 1 && item.days <= 3;
      if (d === '4-7') return item.days >= 4 && item.days <= 7;
      if (d === '8-14') return item.days >= 8 && item.days <= 14;
      if (d === '15+') return item.days >= 15;
      return false;
    });

    const matchesDifficulty = selectedDifficulties.length === 0 || 
      selectedDifficulties.includes(item.difficulty);

    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(item.category);

    const matchesTravelStyle = selectedTravelStyles.length === 0 || 
      selectedTravelStyles.includes(item.travelStyle);

    return matchesPrice && matchesDuration && matchesDifficulty && matchesCategory && matchesTravelStyle;
  };

  const filteredTours = allTours.filter(applyFilters);

  const sortedTours = [...filteredTours].sort((a, b) => {
    if (sortBy === 'popular') return b.reviews - a.reviews;
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const getFilteredDestinationPackages = () => {
    const filtered = {};
    
    Object.entries(tripPackages).forEach(([destinationId, destinationData]) => {
      filtered[destinationId] = {
        name: destinationData.name,
        honeymoon: destinationData.honeymoon.filter(applyFilters),
        office: destinationData.office.filter(applyFilters),
        family: destinationData.family.filter(applyFilters),
      };
    });

    return filtered;
  };

  const filteredDestinationPackages = getFilteredDestinationPackages();

  const sortDestinationPackages = (packages) => {
    return [...packages].sort((a, b) => {
      if (sortBy === 'popular') return b.reviews - a.reviews;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  };

  const handleTripDetails = (tripId) => {
    window.location.href = `/trips?tripId=${tripId}`;
  };

  const handleQueryClick = (tripName) => {
    setSelectedTripName(tripName);
    setModalOpen(true);
  };

  const packageCategories = [
    {
      id: 'honeymoon',
      name: 'Honeymoon Trip Packages',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 'office',
      name: 'Office Trip Packages',
      icon: Briefcase,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      id: 'family',
      name: 'Family Trip Packages',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
    }
  ];

  const getTotalFilteredCount = () => {
    let count = sortedTours.length;
    Object.values(filteredDestinationPackages).forEach(dest => {
      count += dest.honeymoon.length + dest.office.length + dest.family.length;
    });
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-6">
            <div className="lg:hidden space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Explore Tours</h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5">{getTotalFilteredCount()} tours</p>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2.5 sm:p-3 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Sliders className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <div className="relative -mx-3 px-3">
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                  {travelStyles.map((style) => {
                    const Icon = style.icon;
                    const isSelected = selectedTravelStyles.includes(style.slug);
                    
                    return (
                      <button
                        key={style.slug}
                        onClick={() => handleTravelStyleChange(style.slug)}
                        className="flex flex-col items-center gap-1.5 sm:gap-2 flex-shrink-0 snap-start transition-all duration-300"
                      >
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${style.color} flex items-center justify-center shadow-md transition-all duration-300 ${
                          isSelected ? 'ring-4 ring-offset-2 ring-offset-white scale-110' : ''
                        }`}>
                          <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" strokeWidth={1.5} />
                        </div>
                        <span className={`text-[10px] sm:text-xs font-semibold text-center whitespace-nowrap transition-colors ${
                          isSelected ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {style.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
                
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <div className="hidden lg:block">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex-shrink-0">
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">Explore Tours</h1>
                  <p className="text-gray-600 text-sm">Showing {getTotalFilteredCount()} tours</p>
                </div>

                <div className="flex-shrink-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-4">
                {travelStyles.map((style) => {
                  const Icon = style.icon;
                  const isSelected = selectedTravelStyles.includes(style.slug);
                  
                  return (
                    <button
                      key={style.slug}
                      onClick={() => handleTravelStyleChange(style.slug)}
                      className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                        isSelected ? 'scale-110' : 'scale-100 hover:scale-105'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${style.color} flex items-center justify-center shadow-lg transition-all duration-300 ${
                        isSelected ? 'ring-4 ring-offset-2 ring-offset-white' : 'hover:shadow-xl'
                      }`}>
                        <Icon className="h-7 w-7 text-white" strokeWidth={1.5} />
                      </div>
                      <span className={`text-xs font-semibold text-center transition-colors ${
                        isSelected ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {style.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 sm:gap-8 relative">
          {showFilters && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
          )}

          <aside className={`
            fixed lg:static inset-y-0 left-0 z-50 lg:z-0
            w-80 lg:w-80 flex-shrink-0
            transform transition-transform duration-300 ease-in-out
            ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="bg-white rounded-none lg:rounded-2xl shadow-sm p-4 sm:p-6 h-full lg:sticky lg:top-8 lg:max-h-[calc(100vh-100px)] overflow-y-auto">
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="text-xl font-bold">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className="hidden lg:block text-xl font-bold mb-6">Filters</h3>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Price Range
                </label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>₹0</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Duration
                </label>
                {['1-3', '4-7', '8-14', '15+'].map(duration => (
                  <label key={duration} className="flex items-center mb-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedDurations.includes(duration)}
                      onChange={() => handleDurationChange(duration)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="ml-2.5 text-gray-700 group-hover:text-gray-900 select-none">
                      {duration === '15+' ? '15+ days' : `${duration} days`}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Difficulty
                </label>
                {['Easy', 'Moderate', 'Difficult'].map(difficulty => (
                  <label key={difficulty} className="flex items-center mb-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedDifficulties.includes(difficulty)}
                      onChange={() => handleDifficultyChange(difficulty)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="ml-2.5 text-gray-700 group-hover:text-gray-900 select-none">{difficulty}</span>
                  </label>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category
                </label>
                {['Adventure', 'Cultural', 'Beach', 'Wildlife'].map(category => (
                  <label key={category} className="flex items-center mb-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="ml-2.5 text-gray-700 group-hover:text-gray-900 select-none">{category}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={() => {
                  setSelectedDurations([]);
                  setSelectedDifficulties([]);
                  setSelectedCategories([]);
                  setSelectedTravelStyles([]);
                  setPriceRange([0, 500000]);
                  setShowFilters(false);
                }}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors active:scale-95"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {sortedTours.map((tour) => (
                <div
                  key={tour.id}
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredCard(tour.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => handleTripDetails(tour.tripId)}
                >
                  <div className="relative h-80 sm:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        hoveredCard === tour.id ? 'scale-110' : 'scale-100'
                      }`}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">{tour.location}</span>
                    </div>

                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-1.5 sm:gap-2">
                      {tour.featured && (
                        <span className="bg-blue-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-lg">
                          Featured
                        </span>
                      )}
                      {tour.bestseller && (
                        <span className="bg-green-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-lg">
                          Bestseller
                        </span>
                      )}
                      {tour.discount && (
                        <span className="bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-lg">
                          {tour.discount}% Off
                        </span>
                      )}
                    </div>

                    {tour.rating && (
                      <div className="absolute top-16 sm:top-20 left-3 sm:left-4 bg-yellow-400/90 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg flex items-center gap-0.5 sm:gap-1 shadow-lg">
                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white text-white" />
                        <span className="text-xs sm:text-sm font-bold text-white">{tour.rating}</span>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                      <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3 leading-tight line-clamp-2">
                        {tour.title}
                      </h3>
                      
                      <p className="text-white/90 mb-3 sm:mb-4 text-xs sm:text-sm font-medium line-clamp-1">
                        {tour.toursAvailable}
                      </p>

                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-white/80">{tour.duration}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-bold">₹{tour.price.toLocaleString()}</span>
                          <span className="text-white/80 text-xs sm:text-sm">per person</span>
                        </div>
                      </div>
                    </div>

                    <div className={`absolute inset-0 border-2 sm:border-4 border-blue-500 rounded-2xl sm:rounded-3xl transition-opacity duration-300 pointer-events-none ${
                      hoveredCard === tour.id ? 'opacity-100' : 'opacity-0'
                    }`} />
                  </div>
                </div>
              ))}
            </div>

            {getTotalFilteredCount() === 0 && (
              <div className="text-center py-12 sm:py-20 mb-8 sm:mb-12">
                <p className="text-gray-500 text-base sm:text-lg mb-3 sm:mb-4">No tours found matching your filters.</p>
                <button
                  onClick={() => {
                    setSelectedDurations([]);
                    setSelectedDifficulties([]);
                    setSelectedCategories([]);
                    setSelectedTravelStyles([]);
                    setPriceRange([0, 500000]);
                  }}
                  className="text-blue-600 font-semibold hover:underline text-sm sm:text-base"
                >
                  Clear all filters
                </button>
              </div>
            )}

            <div className="mt-8 sm:mt-16">
              {Object.entries(filteredDestinationPackages).map(([destinationId, destinationData]) => (
                <div key={destinationId} className="mb-12 sm:mb-16">
                  {packageCategories.map((category) => {
                    const categoryPackages = sortDestinationPackages(destinationData[category.id] || []);

                    if (categoryPackages.length === 0) return null;

                    return (
                      <div key={category.id} className="mb-8 sm:mb-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                          {categoryPackages.map((destination) => (
                            <DestinationTripCard 
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
              ))}
            </div>
          </main>
        </div>
      </div>

      <TripInquiryModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        destinationId={selectedDestinationId}
        tripName={selectedTripName}
      />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}