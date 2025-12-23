import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronDown, Play, Star, MapPin, Users, ArrowRight, MessageCircle } from 'lucide-react';

export default function HeroSection({ heroData, primaryColor, secondaryColor }) {
  const defaultHero = {
    title: 'Escape to Paradise',
    subtitle: '',
    description: 'Discover breathtaking destinations with exclusive deals. Your dream vacation is just one click away.',
    cta_button_1: { text: 'Explore Destinations', link: '#attractions' },
    cta_button_2: { text: 'Get Quote', link: '#contact' },
    background_type: 'slider',
    background_images: ['https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80'],
    background_videos: []
  };

  const hero = heroData || defaultHero;
  const bgImages = hero.background_images?.length > 0 ? hero.background_images : defaultHero.background_images;
  const bgVideos = hero.background_videos?.length > 0 ? hero.background_videos : [];

  // Handle Button Clicks (Smooth Scroll or External Link)
  const handleCtaClick = (e, link) => {
    if (!link) return;
    
    // Check if it's an anchor link (starts with #)
    if (link.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(link);
      if (element) {
        const offset = 100; // Header offset
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      // External link
      window.location.href = link;
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0">
        {hero.background_type === 'video' && bgVideos[0] ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={bgVideos[0]} type="video/mp4" />
          </video>
        ) : (
          <img 
            src={bgImages[0]} 
            alt="Background"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90" />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              opacity: 0 
            }}
            animate={{ 
              y: [null, -100],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white mb-6 tracking-tight"
        >
          <span className="block">{hero.title}</span>
          {hero.subtitle && (
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
              }}
            >
              {hero.subtitle}
            </span>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          {hero.description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          {/* Button 1 (Primary) */}
          <Button 
            onClick={(e) => handleCtaClick(e, hero.cta_button_1?.link)}
            size="lg"
            className="px-8 py-6 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
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
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full backdrop-blur-sm"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {hero.cta_button_2.text}
            </Button>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { icon: MapPin, value: '150+', label: 'Destinations' },
            { icon: Users, value: '50K+', label: 'Happy Travelers' },
            { icon: Star, value: '4.9', label: 'Rating' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: secondaryColor }} />
              <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center cursor-pointer"
          onClick={(e) => handleCtaClick(e, '#attractions')}
        >
          <span className="text-white/60 text-sm mb-2">Scroll to explore</span>
          <ChevronDown className="w-6 h-6 text-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}