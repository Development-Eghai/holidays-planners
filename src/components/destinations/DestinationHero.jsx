import { useState, useEffect } from 'react';

const tripData = {
  'jibhi': {
    title: 'Jibhi & Tirthan Valley',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80'
    ]
  },
  'bali-indonesia': {
    title: 'Bali, Indonesia',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80'
    ]
  },
  'chopta': {
    title: 'Chopta-Tungnath-Deoriatal',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80'
    ]
  },
  'yulia': {
    title: 'Yulia Kanda Trek',
    images: [
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80'
    ]
  },
  'hampta': {
    title: 'Hampta Pass Trek',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80'
    ]
  },
  'kedarkantha': {
    title: 'Kedarkantha Trek',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80'
    ]
  },
  'valley': {
    title: 'Valley of Flowers',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80'
    ]
  },
  'triund': {
    title: 'Triund Trek',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80'
    ]
  },
};

function DestinationHero({ destinationId = 'jibhi' }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const tripInfo = tripData[destinationId] || tripData['jibhi'];
  const images = tripInfo.images;

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
  }, [destinationId]);

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
    <div className="relative w-full">
      {/* Hero Section */}
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

        {/* Left Arrow */}
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

        {/* Right Arrow */}
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

        {/* Carousel Indicators */}
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
    </div>
  );
}

// Main Trips Page Component
export default function TripsPage() {
  const [destinationId, setDestinationId] = useState('jibhi');

  useEffect(() => {
    // Get destinationId from URL query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('destinationId');
    
    console.log('URL destinationId:', id);
    
    if (id) {
      setDestinationId(id);
    }
  }, []);

  // Also listen for URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get('destinationId');
      if (id) {
        setDestinationId(id);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  return (
    <div>
      <DestinationHero destinationId={destinationId} />
    </div>
  );
}