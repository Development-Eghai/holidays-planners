import { useState, useEffect } from 'react';

// TripHero Component (include this in the same file or import it)
const tripImages = {
  'jibhi': [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80'
  ],
  'kasol': [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80'
  ],
  'chopta': [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80'
  ],
  'yulia': [
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80'
  ],
  'hampta': [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80'
  ],
  'kedarkantha': [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80'
  ],
  'valley': [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80'
  ],
  'romantic-paris-getaway': [
      'https://plus.unsplash.com/premium_photo-1718035557075-5111d9d906d2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2071',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80'
    ],
  'triund': [
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80'
  ]
};

function TripHero({ tripId = 'jibhi' }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = tripImages[tripId] || tripImages['jibhi'];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 600);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [tripId]);

  const goToImage = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  const goToPrevious = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goToNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-black">
      <div className="absolute inset-0">
        <img
          src={images[currentImageIndex]}
          alt="Trip destination"
          className={`w-full h-full object-cover transition-all duration-700 ${
            isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        />
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        aria-label="Previous image"
      >
        <svg
          className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        aria-label="Next image"
      >
        <svg
          className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`transition-all duration-300 rounded-full ${
              currentImageIndex === index
                ? 'w-8 md:w-12 h-2 md:h-3 bg-white shadow-lg'
                : 'w-2 md:w-3 h-2 md:h-3 bg-white/50 hover:bg-white/80 hover:scale-125'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Main Trips Page Component
export default function TripsPage() {
  const [tripId, setTripId] = useState('jibhi');

  useEffect(() => {
    // Get tripId from URL query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('tripId');
    
    console.log('URL tripId:', id); // Debug log
    
    if (id) {
      setTripId(id);
    }
  }, []);

  // Also listen for URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get('tripId');
      if (id) {
        setTripId(id);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  return (
    <div>
      <TripHero tripId={tripId} />
    </div>
  );
}