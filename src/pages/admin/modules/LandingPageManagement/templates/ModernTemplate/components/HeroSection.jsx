import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronDown, MapPin, Users, Star, MessageCircle } from 'lucide-react';

// Helper to safely encode URLs (handles spaces in filenames)
const getSafeUrl = (url) => {
  try {
    return encodeURI(url);
  } catch (e) {
    return url;
  }
};

export default function HeroSection({ heroData, primaryColor, secondaryColor, onExploreClick, onGetQuote }) {
  const defaultHero = {
    title: 'Escape to Paradise',
    subtitle: '',
    description: 'Discover breathtaking destinations with exclusive deals.',
    cta_button_1: { text: 'Explore Destinations', link: '#packages' },
    cta_button_2: { text: 'Get Quote', link: '#contact' },
    background_type: 'slider',
    background_images: ['https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80'],
    background_videos: []
  };

  const hero = heroData || defaultHero;
  
  // Combine images and videos into a single slides array
  const bgImages = hero.background_images?.length > 0 ? hero.background_images : defaultHero.background_images;
  const bgVideos = hero.background_videos?.length > 0 ? hero.background_videos : [];
  
  const slides = [
    ...bgImages.map(url => ({ type: 'image', url })),
    ...bgVideos.map(url => ({ type: 'video', url }))
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef(null);

  // Function to go to next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Logic to control slide duration based on content type
  useEffect(() => {
    const currentType = slides[currentSlide].type;

    // Clear any existing timer when slide changes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // IF IMAGE: Set fixed duration (e.g., 5 seconds)
    if (currentType === 'image') {
      timeoutRef.current = setTimeout(nextSlide, 5000);
    }
    
    // IF VIDEO: We do NOTHING here. We rely on the <video onEnded={nextSlide}> 
    // prop in the JSX to trigger the switch only when playback finishes.

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentSlide, slides]);

  // Handle Button Clicks
  const handleCtaClick = (e, link) => {
    if (link === '#packages' && onExploreClick) {
      e.preventDefault();
      onExploreClick();
      return;
    }
    if (link === '#contact' && onGetQuote) {
      e.preventDefault();
      onGetQuote();
      return;
    }

    if (!link) return;
    
    if (link.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = link;
    }
  };

  return (
    <section id="hero" className="relative h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-slate-900">
      
      {/* Background Slider */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            {slides[currentSlide].type === 'video' ? (
              <video
                src={getSafeUrl(slides[currentSlide].url)}
                autoPlay
                muted
                playsInline
                // KEY FIX: When video ends, go to next slide
                onEnded={nextSlide} 
                // Fallback: If video fails, go to next slide immediately to prevent getting stuck
                onError={(e) => {
                  console.error("Video failed to play, skipping:", slides[currentSlide].url);
                  nextSlide();
                }}
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={slides[currentSlide].url} 
                alt="Background"
                className="w-full h-full object-cover"
              />
            )}
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/80" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: 0 
            }}
            animate={{ 
              y: [null, -100],
              opacity: [0, 0.5, 0]
            }}
            transition={{ 
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-8">
        
        {/* Main heading - Compact Size */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-lg"
        >
          <span className="block">{hero.title}</span>
          {hero.subtitle && (
            <span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300"
              style={{
                backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
              }}
            >
              {hero.subtitle}
            </span>
          )}
        </motion.h1>

        {/* Description - Compact Size */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed font-medium drop-shadow-md"
        >
          {hero.description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          {/* Button 1 (Primary) */}
          <Button 
            onClick={(e) => handleCtaClick(e, hero.cta_button_1?.link)}
            size="lg"
            className="px-6 py-5 text-base rounded-full shadow-xl transform hover:scale-105 transition-all duration-300 border-none"
            style={{
              background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
              color: 'white'
            }}
          >
            {hero.cta_button_1?.text}
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="ml-2"
            >
              →
            </motion.span>
          </Button>
          
          {/* Button 2 (Secondary) */}
          {hero.cta_button_2 && hero.cta_button_2.text && (
            <Button 
              onClick={(e) => handleCtaClick(e, hero.cta_button_2?.link)}
              variant="outline"
              size="lg"
              className="border-2 border-white/40 text-white bg-white/5 hover:bg-white/20 px-6 py-5 text-base rounded-full backdrop-blur-md"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {hero.cta_button_2.text}
            </Button>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-3 gap-4 max-w-lg mx-auto border-t border-white/10 pt-6"
        >
          {[
            { icon: MapPin, value: '150+', label: 'Destinations' },
            { icon: Users, value: '50K+', label: 'Travelers' },
            { icon: Star, value: '4.9', label: 'Rating' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="w-4 h-4 mx-auto mb-1 text-white/80" />
              <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-white/60 text-[10px] sm:text-xs uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center cursor-pointer"
          onClick={(e) => handleCtaClick(e, '#packages')}
        >
          <span className="text-white/70 text-[10px] mb-1 tracking-wider uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 text-white/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}