import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Linkedin, Youtube, ChevronUp } from 'lucide-react';

const FooterColumn = ({ title, links, delay }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`transition-all duration-700 transform ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <h3 className="text-white font-bold text-lg mb-4">{title}</h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <a 
              href="#" 
              className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm inline-block hover:translate-x-2 transform transition-transform"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const SocialIcon = ({ icon: Icon, href, delay, bgColor }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${bgColor} w-12 h-12 rounded-full flex items-center justify-center text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg transform ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
      }`}
    >
      <Icon className="w-5 h-5" />
    </a>
  );
};

const StickyWhatsApp = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <a
      href="https://wa.me/919090403075"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed right-6 bottom-6 z-50 transition-all duration-500 transform ${
        isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-0 translate-y-10'
      }`}
    >
      <div className="relative group">
        {/* Pulsing ring */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
        
        {/* Main button with WhatsApp logo */}
        <div className="relative bg-gradient-to-br from-green-400 to-green-600 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group-hover:shadow-green-500/50">
          <svg 
            viewBox="0 0 32 32" 
            className="w-10 h-10"
            fill="white"
          >
            <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-4.713 1.262 1.262-4.669-0.292-0.508c-1.207-2.100-1.847-4.507-1.847-6.924 0-7.435 6.050-13.485 13.485-13.485s13.485 6.050 13.485 13.485c0 7.436-6.050 13.486-13.485 13.486zM21.97 18.495c-0.397-0.199-2.361-1.166-2.727-1.298-0.365-0.132-0.63-0.199-0.894 0.199s-1.030 1.298-1.261 1.563c-0.232 0.265-0.463 0.298-0.861 0.099s-1.678-0.618-3.195-1.972c-1.182-1.053-1.979-2.352-2.210-2.750s-0.025-0.612 0.174-0.811c0.179-0.178 0.397-0.463 0.596-0.695s0.265-0.397 0.397-0.662c0.132-0.265 0.066-0.496-0.033-0.695s-0.894-2.154-1.226-2.949c-0.323-0.776-0.651-0.671-0.894-0.684-0.231-0.012-0.496-0.015-0.761-0.015s-0.695 0.099-1.060 0.496c-0.365 0.397-1.394 1.363-1.394 3.32s1.427 3.853 1.626 4.118c0.199 0.265 2.807 4.285 6.802 6.009 0.951 0.411 1.693 0.656 2.271 0.839 0.955 0.303 1.824 0.260 2.512 0.158 0.766-0.115 2.361-0.966 2.695-1.898s0.334-1.732 0.234-1.898c-0.099-0.165-0.364-0.264-0.761-0.463z"/>
          </svg>
        </div>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with us!
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
        </div>
      </div>
    </a>
  );
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed right-6 bottom-28 z-50 bg-cyan-500 hover:bg-cyan-600 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
};

export default function Footer() {
  const internationalTrips = [
    'Europe', 'Bali', 'Vietnam', 'Thailand', 'Kazakhstan', 
    'Singapore', 'Bhutan', 'Maldives', 'Dubai', 'Malaysia'
  ];

  const indiaTrips = [
    'Ladakh', 'Spiti Valley', 'Meghalaya', 'Kashmir', 
    'Himachal Pradesh', 'Andaman', 'Rajasthan'
  ];

  const wanderonSpecial = [
    'Community Trips', 'Honeymoon Trips', 'Corporate Trips', 'Weekend Getaways'
  ];

  const quickLinks = [
    'About Us', 'Privacy Policy', 'Terms & Conditions', 
    'Customer Success & Support', 'Disclaimer', 'Careers', 'Blogs', 'Payments'
  ];

  return (
    <>
      {/* Sticky WhatsApp Button */}
      <StickyWhatsApp />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
        {/* Cyan top border */}
        <div className="h-1 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <FooterColumn 
              title="International Trips" 
              links={internationalTrips}
              delay={0}
            />
            <FooterColumn 
              title="India Trips" 
              links={indiaTrips}
              delay={100}
            />
            <FooterColumn 
              title="WanderOn Special" 
              links={wanderonSpecial}
              delay={200}
            />
            <FooterColumn 
              title="Quick Links" 
              links={quickLinks}
              delay={300}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 mb-8"></div>

          {/* Company Info */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              WANDERON EXPERIENCES PVT LTD
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              3rd Floor, Building No-436, Phase IV, Udyog Vihar, Sector-18, Gurugram, Haryana-122015
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm">
              <a 
                href="mailto:hello@wanderon.in" 
                className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
              >
                hello@wanderon.in
              </a>
              <a 
                href="tel:+919090403075" 
                className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
              >
                +91-9090403075
              </a>
              <a 
                href="https://www.wanderon.in" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
              >
                www.wanderon.in
              </a>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-4">
            <SocialIcon 
              icon={Facebook} 
              href="https://facebook.com" 
              delay={400}
              bgColor="bg-blue-600 hover:bg-blue-700"
            />
            <SocialIcon 
              icon={Instagram} 
              href="https://instagram.com" 
              delay={500}
              bgColor="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600"
            />
            <SocialIcon 
              icon={Linkedin} 
              href="https://linkedin.com" 
              delay={600}
              bgColor="bg-blue-700 hover:bg-blue-800"
            />
            <SocialIcon 
              icon={Youtube} 
              href="https://youtube.com" 
              delay={700}
              bgColor="bg-red-600 hover:bg-red-700"
            />
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-800 py-4">
          <p className="text-center text-gray-500 text-sm">
            © 2025 WanderOn Experiences Pvt Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}