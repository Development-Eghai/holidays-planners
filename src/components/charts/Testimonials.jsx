import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Star, X } from 'lucide-react';

const VideoModal = ({ isOpen, onClose, videoUrl, title }) => {
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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all duration-300 hover:scale-110"
          aria-label="Close video"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Video Container */}
        <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
          <div className="relative pt-[56.25%]">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={videoUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

const VideoCard = ({ image, title, videoUrl, isActive, onPlay }) => {
  return (
    <div className={`relative transition-all duration-500 transform ${
      isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-70'
    }`}>
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200 hover:border-blue-400 transition-all duration-300">
        {/* Video Thumbnail */}
        <div className="relative h-48 bg-gray-200 overflow-hidden group cursor-pointer" onClick={onPlay}>
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-all duration-300">
            <div className="bg-white/90 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 text-blue-600 fill-blue-600" />
            </div>
          </div>
        </div>
        
        {/* Title */}
        <div className="p-4">
          <p className="text-sm text-gray-800 font-medium line-clamp-2">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({ name, avatar, review, rating, delay }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`transition-all duration-700 transform ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-blue-100 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={avatar} 
              alt={name}
              className="w-14 h-14 rounded-full border-2 border-blue-200 object-cover"
            />
            <div>
              <h4 className="font-bold text-gray-900">{name}</h4>
              <div className="flex gap-1 mt-1">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </div>
          <button className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors">
            Read More
          </button>
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {review}
        </p>
      </div>
    </div>
  );
};

export default function TravellerTestimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = [
    {
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop',
      title: 'Winter Spiti - An Unforgettable Journey | Traveler\'s Review | Go4Explore Community',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'
    },
    {
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop',
      title: '1 Day School Picnic | Go4Explore Community | Orsang Resort, Vadodara',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'
    },
    {
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop',
      title: 'Mangla Farm | One Day School Picnic by Go4Explore Community',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'
    }
  ];

  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
    setIsAutoPlaying(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const testimonials = [
    {
      name: 'Prerna Lohmore',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      review: 'So I had my first group trip with go4explore community to Jibhi & Tirthan and it was awesome. Had a great experience and would recommend to everyone.',
      rating: 5,
      delay: 0
    },
    {
      name: 'Kavish Goyal',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      review: 'It was my first trip with a travel community and I found Go4Explore through Instagram recommendations. I went to Tirthan Valley & had an amazing experience.',
      rating: 5,
      delay: 200
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % videos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, videos.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % videos.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + videos.length) % videos.length);
    setIsAutoPlaying(false);
  };

  const getVisibleVideos = () => {
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentSlide + i + videos.length) % videos.length;
      visible.push({ ...videos[index], index, offset: i });
    }
    return visible;
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <VideoModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        videoUrl={selectedVideo?.videoUrl}
        title={selectedVideo?.title}
      />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 inline-flex items-center justify-center gap-2 flex-wrap">
            See What Travellers Are Saying
            <span className="text-4xl animate-bounce">😊</span>
          </h2>
        </div>

        {/* Video Carousel */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center gap-4 mb-8">
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Video Cards Container */}
            <div className="relative w-full max-w-4xl overflow-hidden">
              <div className="flex items-center justify-center gap-4 px-4">
                {getVisibleVideos().map((video, idx) => (
                  <div
                    key={video.index}
                    className="w-full max-w-sm transition-all duration-500"
                    style={{
                      transform: `translateX(${video.offset * 10}px)`,
                    }}
                  >
                    <VideoCard
                      image={video.image}
                      title={video.title}
                      videoUrl={video.videoUrl}
                      isActive={video.offset === 0}
                      onPlay={() => handlePlayVideo(video)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mb-6">
            {videos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSlide(idx);
                  setIsAutoPlaying(false);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Watch More Videos Button */}
          <div className="text-center">
            <a href="/blog">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl">
                View All Blogs
              </button>
            </a>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              avatar={testimonial.avatar}
              review={testimonial.review}
              rating={testimonial.rating}
              delay={testimonial.delay}
            />
          ))}
        </div>
      </div>
    </div>
  );
}