import { Users, Award, Globe, Shield, MapPin, Heart, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

const stats = [
  { icon: Users, value: 15000, label: 'Happy Travelers', suffix: '+' },
  { icon: Award, value: 12, label: 'Years Experience', suffix: '+' },
  { icon: Globe, value: 250, label: 'Destinations', suffix: '+' },
  { icon: Shield, value: 98, label: 'Satisfaction Rate', suffix: '%' },
];

const team = [
  {
    name: 'John Smith',
    role: 'CEO & Founder',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Sarah Johnson',
    role: 'Head of Operations',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Michael Chen',
    role: 'Tour Director',
    image: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Customer Relations',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Passion for Travel',
    description: 'We live and breathe travel, sharing our enthusiasm with every journey we craft.',
  },
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Your security and wellbeing are our top priorities on every adventure.',
  },
  {
    icon: Star,
    title: 'Excellence',
    description: 'We strive for perfection in every detail of your travel experience.',
  },
  {
    icon: MapPin,
    title: 'Local Expertise',
    description: 'Deep connections with local guides ensure authentic, immersive experiences.',
  },
];

function CountUpAnimation({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(end * percentage));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div
        className="h-screen relative overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-900/50 to-cyan-900/70" />
        
        {/* Animated overlay elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className={`relative z-10 h-full flex items-center justify-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center text-white px-4">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200">
              About TravelWorld
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-cyan-100">Creating unforgettable travel experiences since 2012</p>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {/* Story Section */}
        <div className={`max-w-4xl mx-auto mb-24 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
            Our Story
          </h2>
          <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
            <p className="hover:text-gray-900 transition-colors duration-300">
              Founded in 2012, TravelWorld began with a simple mission: to make world-class travel experiences accessible to everyone. What started as a small tour operator has grown into a leading travel company, trusted by thousands of travelers worldwide.
            </p>
            <p className="hover:text-gray-900 transition-colors duration-300">
              We believe that travel has the power to transform lives, broaden perspectives, and create lasting memories. Our team of experienced travel professionals works tirelessly to curate exceptional tours that combine adventure, culture, and comfort.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl group-hover:rotate-6 transition-all duration-300">
                  <Icon className="h-12 w-12 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mb-2">
                  <CountUpAnimation end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Values Section */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden"
              >
                <div className="p-6 text-center">
                  <div className="relative mb-6 inline-block">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full object-cover relative z-10 border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{member.name}</h3>
                  <p className="text-cyan-600 font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 animate-gradient" 
               style={{ backgroundSize: '200% 200%' }} />
          <div className="relative z-10 p-12 md:p-16 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Start Your Adventure?</h2>
            <p className="text-xl md:text-2xl mb-8 text-cyan-50">Join thousands of satisfied travelers and explore the world with us</p>
            <a href="/triplist">
            <button className="group bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-cyan-50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 transform">
              Browse Tours
              <span className="inline-block ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
            </button></a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </div>
  );
}