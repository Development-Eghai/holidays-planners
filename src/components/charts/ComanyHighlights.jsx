import React, { useState, useEffect } from 'react';
import { Home, Plane, UserCheck, MapPin, Award, ThumbsUp, Calendar, Users, Shield } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`relative transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative h-full bg-white rounded-2xl p-6 border-2 border-blue-600 shadow-md hover:shadow-2xl transition-all duration-500 ${
        isHovered ? 'scale-105 border-blue-700' : ''
      }`}>
        {/* Icon */}
        <div className="mb-4">
          <div className={`inline-flex p-3 bg-blue-50 rounded-xl transition-all duration-500 ${
            isHovered ? 'bg-blue-100 scale-110 rotate-6' : ''
          }`}>
            <Icon className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-blue-700 mb-3 leading-tight">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>

        {/* Animated corner accent */}
        <div className={`absolute top-0 right-0 w-16 h-16 bg-blue-600 rounded-bl-3xl opacity-5 transition-all duration-500 ${
          isHovered ? 'w-20 h-20 opacity-10' : ''
        }`}></div>
        
        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500 ${
          isHovered ? 'w-full' : 'w-0'
        }`}></div>
      </div>
    </div>
  );
};

export default function TravelFeatures() {
  const features = [
    {
      icon: Home,
      title: 'Handpicked Stays with Friendly Hosts',
      description: 'All our accommodations are verified pre-checked for quality and hygiene.',
      delay: 0
    },
    {
      icon: Plane,
      title: '2500+ Trips Hosted PAN India & Abroad',
      description: 'From group trips to custom tours exploring diverse landscapes, cultures & lots more.',
      delay: 100
    },
    {
      icon: UserCheck,
      title: 'Solo Travel Friendly Trips for All',
      description: 'We provide absolutely safe and comfortable environment for solo travellers.',
      delay: 200
    },
    {
      icon: MapPin,
      title: 'Trip Itineraries Curated with Love',
      description: 'Trip plans hand-crafted by destination experts for hassle -free travel experience.',
      delay: 300
    },
    {
      icon: Award,
      title: '8 Years of On-Ground Experience',
      description: 'Being in Tourism industry for over 8 years, we put our heart in planning your trips.',
      delay: 400
    },
    {
      icon: ThumbsUp,
      title: 'Rated 4.8 Stars on Google Reviews',
      description: 'Our growth lies in the memorable travel experiences we offer to our travellers.',
      delay: 500
    },
    {
      icon: Calendar,
      title: 'Hassle-Free Booking Process',
      description: 'Seamless booking process on all our trips with the help of our travel experts.',
      delay: 600
    },
    {
      icon: Users,
      title: 'Filtering Like-Minded Travellers',
      description: 'We make sure to bring only like-minded travellers on basis of age, gender, comfort etc.',
      delay: 700
    },
    {
      icon: Shield,
      title: 'Experienced & Cool Trip Captains',
      description: 'We appoint friendly trip leaders with strong leadership qualities & high spirit!',
      delay: 800
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 inline-flex items-center justify-center gap-2 flex-wrap">
            Why Select To Travel With Us? 
            <span className="text-4xl animate-wave inline-block">👍</span>
          </h1>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>

        {/* Floating decorative elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 left-10 w-20 h-20 bg-blue-200 rounded-full blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-1/2 right-20 w-32 h-32 bg-blue-300 rounded-full blur-3xl opacity-20 animate-float-delayed"></div>
          <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-blue-400 rounded-full blur-3xl opacity-20 animate-float"></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes wave {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(20deg);
          }
          75% {
            transform: rotate(-20deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-30px) translateX(20px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-40px) translateX(-30px);
          }
        }
        
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}