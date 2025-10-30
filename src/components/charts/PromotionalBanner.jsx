import { useState, useEffect, useRef } from 'react';

export default function PromoBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef(null);

  // ADMIN CONFIG - Change these values
  const slides = [
    {
      type: 'image', // 'image' or 'video'
      desktopSrc: 'https://images.unsplash.com/photo-1483791424735-e9ad0209eea2?w=1920&q=80',
      mobileSrc: 'https://images.unsplash.com/photo-1483791424735-e9ad0209eea2?w=768&q=80',
      link: '/northern-lights',
      altText: 'Northern Lights Tour'
    },
    {
      type: 'image',
      desktopSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      mobileSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=768&q=80',
      link: '/mountain-adventure',
      altText: 'Mountain Adventure'
    },
    {
      type: 'video',
      desktopSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', // Replace with your video URL
      mobileSrc: 'https://www.w3schools.com/html/mov_bbb.mp4', // Mobile video URL
      link: '/video-tour',
      altText: 'Video Tour'
    }
  ];

  const totalSlides = slides.length;

  // Auto-play functionality
  useEffect(() => {
    if (!isPaused) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPaused, totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section 
      className="relative w-full max-w-7xl mx-auto px-4 py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Container */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden bg-gray-900 shadow-2xl">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <a href={slide.link} className="block w-full h-full group">
              {slide.type === 'image' ? (
                <picture>
                  {/* Mobile Image */}
                  <source
                    media="(max-width: 768px)"
                    srcSet={slide.mobileSrc}
                  />
                  {/* Desktop Image */}
                  <source
                    media="(min-width: 769px)"
                    srcSet={slide.desktopSrc}
                  />
                  <img
                    src={slide.desktopSrc}
                    alt={slide.altText}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </picture>
              ) : (
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={slide.desktopSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
            </a>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-cyan-500 hover:bg-cyan-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg opacity-80 hover:opacity-100"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-cyan-500 hover:bg-cyan-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg opacity-80 hover:opacity-100"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* 
===========================================
ADMIN INSTRUCTIONS
===========================================

RECOMMENDED SIZES:
------------------
Desktop Images/Videos: 1920 x 400-500 pixels
Mobile Images/Videos: 768 x 400 pixels
Aspect Ratio: 16:9 or similar wide format

SUPPORTED FORMATS:
------------------
Images: JPG, PNG, WebP
Videos: MP4, WebM (MP4 recommended for best compatibility)

HOW TO ADD/UPDATE SLIDES:
--------------------------
1. Edit the 'slides' array in the component
2. For images:
   {
     type: 'image',
     desktopSrc: 'your-desktop-image-url.jpg',
     mobileSrc: 'your-mobile-image-url.jpg',
     link: '/your-destination-url',
     altText: 'Description for accessibility'
   }

3. For videos:
   {
     type: 'video',
     desktopSrc: 'your-video-url.mp4',
     mobileSrc: 'your-mobile-video-url.mp4',
     link: '/your-destination-url',
     altText: 'Description'
   }

FEATURES:
---------
✅ Auto-play carousel (5 seconds per slide)
✅ Pause on hover
✅ Click arrows to navigate
✅ Click dots to jump to specific slide
✅ Supports both images and videos
✅ Fully responsive
✅ Smooth transitions

VIDEO TIPS:
-----------
- Keep videos under 10MB for fast loading
- Use compressed MP4 format
- Videos auto-play, loop, and are muted
- Consider using a poster image as fallback
*/