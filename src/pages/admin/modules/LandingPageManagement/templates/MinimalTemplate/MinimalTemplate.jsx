import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Mail, Calendar, Users,
  CheckCircle, ChevronDown, ChevronUp,
  Plane, Hotel, Camera, Utensils, Car,
  Menu, X, Star, ShieldCheck, Clock,
  Percent, Award, Wallet, MessageCircle,
  BadgeCheck, Globe, Target,
  TrendingUp, Headphones, Gift, ArrowRight
} from 'lucide-react';
import { toast, Toaster } from "sonner";

// --- COMPONENTS ---
import UnifiedEnquiryModal from '../ModernTemplate/components/UnifiedEnquiryModal';
import BookingNotification from '../ModernTemplate/components/BookingNotification';
import PopupManager from '../ModernTemplate/components/Popupmanager';
import TestimonialCarousel from '../ModernTemplate/components/TestimonialCarousel';
import FloatingCTA from '../ModernTemplate/components/FloatingCTA';
import PromoMediaSection from '../ModernTemplate/components/PromoMediaSection';

// --- CONSTANTS ---
const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const API_KEY = 'x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ';
const DEFAULT_DOMAIN = 'https://www.holidaysplanners.com';
const CONTACT_NUMBER = '+91-9816259997';
const CONTACT_DISPLAY = '+91-98162 59997';

// --- SEO KEYWORDS ---
const SEO_KEYWORDS = [
  "Manali Tour Package", "Best Honeymoon Packages in Himachal", "Shimla Honeymoon Trip",
  "Shimla Tour Packages For Couple", "Complete Himachal Tour Package",
  "Kullu-Manali Tour package", "Manali Adventure Tour Package", "Delhi-Shimla Package",
  "Himachal Tour Package", "Shimla Honeymoon Package", "Shimla-Kullu-Manali tour package",
  "Manali Honeymoon Packages", "himachal tour", "himachal pradesh tourism packages",
  "manali trekking packages", "kullu manali tour", "shimla packages", "himachal trip",
  "shimla manali package", "trip to shimla", "shimla kullu manali tour"
];

export default function MinimalTemplate({ pageData }) {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [allTrips, setAllTrips] = useState([]);
  const [mainPackages, setMainPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSubmitting, setHeroSubmitting] = useState(false);
  const [expandedTrip, setExpandedTrip] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const TRAVELER_AVATARS = [
  "https://randomuser.me/api/portraits/men/77.jpg",
  "https://randomuser.me/api/portraits/men/50.jpg",
  "https://randomuser.me/api/portraits/women/84.jpg",
  "https://randomuser.me/api/portraits/women/22.jpg",
];


  // -------------------------
  // ✅ HERO BG CONFIG (UPLOADED MEDIA)
  // -------------------------
  const heroType = pageData?.hero?.background_type || "slider"; // slider | video
  const heroImages = pageData?.hero?.background_images || [];
  const heroVideos = pageData?.hero?.background_videos || [];
  const overlayOpacity = pageData?.hero?.overlay_opacity ?? 0.4;

  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const activeHeroBg = useMemo(() => {
    if (heroImages?.length > 0) return heroImages[activeHeroIndex];
    return "https://images.unsplash.com/photo-1626621341517-b13d52481e28?q=80&w=2000";
  }, [heroImages, activeHeroIndex]);

  // Auto slide images if multiple
  useEffect(() => {
    if (heroType !== "slider") return;
    if (!heroImages || heroImages.length <= 1) return;

    const t = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 3500);

    return () => clearInterval(t);
  }, [heroType, heroImages?.length]);

  // Hero Form State - Matching CORRECT API Schema (/enquires)
  const [heroFormData, setHeroFormData] = useState({
    destination: '',
    departure_city: 'Website Form',
    travel_date: new Date().toISOString().split('T')[0],
    adults: 2,
    children: 0,
    infants: 0,
    hotel_category: '3 Star',
    full_name: '',
    contact_number: '',
    email: '',
    additional_comments: 'Landing page enquiry',
    domain_name: DEFAULT_DOMAIN
  });

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/trips`, {
          headers: { 'x-api-key': API_KEY }
        });
        const data = await res.json();
        const fetchedTrips = data.data || data;
        setAllTrips(fetchedTrips);

        if (pageData?.packages?.selected_trips?.length) {
          const selected = fetchedTrips.filter(t =>
            pageData.packages.selected_trips.some(st => st.trip_id === t.id)
          );
          setMainPackages(selected);
        } else {
          setMainPackages(fetchedTrips.slice(0, 6));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [pageData]);

  // --- HANDLERS ---
  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    if (heroSubmitting) return;
    setHeroSubmitting(true);

    try {
      const submissionData = {
        destination: heroFormData.destination || pageData?.page_name || 'Himachal Tour',
        departure_city: 'Landing Page Form',
        travel_date: heroFormData.travel_date,
        adults: parseInt(heroFormData.adults) || 2,
        children: parseInt(heroFormData.children) || 0,
        infants: parseInt(heroFormData.infants) || 0,
        hotel_category: '3 Star',
        full_name: heroFormData.full_name,
        contact_number: heroFormData.contact_number,
        email: heroFormData.email,
        additional_comments: `Landing Page: ${pageData?.slug || 'website'}`,
        domain_name: DEFAULT_DOMAIN
      };

      const res = await fetch(`${API_BASE_URL}/enquires`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify(submissionData)
      });

      if (res.ok) {
        const firstName = heroFormData.full_name.split(' ')[0] || "Traveler";

        // Google Ads Conversion
        if (window.gtag) {
          window.gtag('event', 'conversion', {
            send_to: 'AW-CONVERSION_ID/LABEL',
            value: 1.0,
            currency: 'INR'
          });
        }

        // Facebook Pixel
        if (window.fbq) {
          window.fbq('track', 'Lead', {
            content_name: heroFormData.destination,
            value: 1.0,
            currency: 'INR'
          });
        }

        // Open Thank You Page in New Tab
        const params = new URLSearchParams({
          name: firstName,
          destination: heroFormData.destination || 'Himachal Pradesh'
        });
        window.open(`/thank-you?${params.toString()}`, '_blank');

        toast.success(`Thanks ${firstName}! Our team will call you within 5 minutes.`);

        // Reset form
        setHeroFormData({
          destination: '',
          departure_city: 'Website Form',
          travel_date: new Date().toISOString().split('T')[0],
          adults: 2,
          children: 0,
          infants: 0,
          hotel_category: '3 Star',
          full_name: '',
          contact_number: '',
          email: '',
          additional_comments: 'Landing page enquiry',
          domain_name: DEFAULT_DOMAIN
        });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error('Submission error:', err);
      toast.error("Submission failed. Check connection.");
    } finally {
      setHeroSubmitting(false);
    }
  };

  const getTripPrice = (trip) => {
    if (trip.pricing?.fixed_departure?.[0]?.costingPackages?.[0]) {
      return trip.pricing.fixed_departure[0].costingPackages[0].final_price;
    }
    if (trip.pricing?.customized) {
      return trip.pricing.customized.final_price;
    }
    return trip.base_price || trip.price || 0;
  };

  // Check if alerts should be shown
  const showHeaderAlert = pageData?.offers?.header?.enabled;
  const showFooterAlert = pageData?.offers?.footer?.enabled;
  const alertText = pageData?.offers?.header?.text || '🔥 Special Offer: Book Now & Save Up to 50%!';

  // --- TRIP CARD COMPONENT ---
  const TripCard = ({ trip }) => {
    const isExpanded = expandedTrip === trip.id;
    const price = getTripPrice(trip);

    const searchText = `${trip.title} ${trip.inclusions} ${trip.highlights}`.toLowerCase();
    const checkActive = (keywords) => keywords.some(k => searchText.includes(k));

    const amenities = [
      { label: 'Flight', icon: Plane, active: checkActive(['flight', 'airfare', 'ticket']) },
      { label: 'Hotels', icon: Hotel, active: checkActive(['hotel', 'stay', 'accommodation', 'resort']) },
      { label: 'Sightseeing', icon: Camera, active: checkActive(['sightseeing', 'tour', 'visit']) },
      { label: 'Meals', icon: Utensils, active: checkActive(['meal', 'breakfast', 'dinner', 'food']) },
      { label: 'Transfers', icon: Car, active: checkActive(['transfer', 'cab', 'taxi', 'drive', 'volvo']) },
    ];

    const itineraryList = trip.itinerary || [];
    const inclusionsList = trip.inclusions ? trip.inclusions.split(';') : [];
    const visibleItinerary = isExpanded ? itineraryList : itineraryList.slice(0, 2);
    const visibleInclusions = isExpanded ? inclusionsList : inclusionsList.slice(0, 2);

    const renderItineraryTitle = (titleString) => {
      const regex = /^(Day\s*\d+)(.*)/i;
      const match = titleString.match(regex);
      if (match) {
        return (
          <>
            <span className="font-bold text-[#F4C430] uppercase shrink-0 whitespace-nowrap mr-1">{match[1]}</span>
            <span className="text-[#1A1A1A] font-medium">{match[2]}</span>
          </>
        );
      }
      return <span className="text-[#1A1A1A] font-medium">{titleString}</span>;
    };

    return (
      <div className="bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden flex flex-col h-full relative group">
        <div className="relative h-56 overflow-hidden">
          <img
            src={trip.hero_image || trip.image}
            alt={trip.title}
            loading="lazy"
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-[#1E5BA8]/20 group-hover:bg-[#1E5BA8]/30 transition-colors"></div>

          {/* Special Offer Badge */}
          {price > 0 && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black animate-pulse shadow-lg">
              SAVE {Math.round(((price * 1.4 - price) / (price * 1.4)) * 100)}%
            </div>
          )}

          <div className="absolute bottom-[-20px] right-4 bg-white p-2 rounded-full shadow-lg border-2 border-[#F4C430] z-10 w-12 h-12 flex items-center justify-center animate-bounce-slow">
            <Star className="text-[#F4C430] w-6 h-6 fill-current" />
          </div>
        </div>

        <div className="p-4 pt-8 flex-1 flex flex-col">
          <h2 className="text-xl font-bold text-[#1E5BA8] leading-tight mb-2 min-h-[56px] line-clamp-2">
            {trip.title}
          </h2>

          <h3 className="text-sm font-semibold text-[#4A5568] mb-4 border-b border-gray-100 pb-2">
            Duration: <span className="text-[#2D5D3F] font-bold">{trip.days} Days / {trip.nights} Nights</span>
          </h3>

          {/* Amenities Grid */}
          <div className="flex justify-between items-center mb-5 px-1 bg-[#F5F7FA] py-3 rounded-lg border border-slate-100">
            {amenities.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 relative">
                <div className={`p-2 rounded-full transition-all duration-300 ${
                  item.active
                    ? `bg-white text-[#2D5D3F] shadow-md ring-1 ring-[#2D5D3F]/20 scale-110`
                    : 'bg-transparent text-gray-300 grayscale opacity-40'
                }`}>
                  <item.icon size={16} strokeWidth={item.active ? 2.5 : 2} />
                </div>
                <span className={`text-[9px] uppercase font-bold tracking-wide ${item.active ? 'text-[#1E5BA8]' : 'text-[#4A5568]'}`}>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="bg-white p-0 mb-4 flex-1">
            <div className="mb-4">
              <h5 className="text-xs font-black uppercase text-[#1E5BA8] mb-2 flex items-center gap-1">
                <Calendar size={12} /> Itinerary
              </h5>
              <ul className="space-y-2.5">
                {visibleItinerary.length > 0 ? (
                  visibleItinerary.map((day, idx) => (
                    <li key={idx} className="flex items-start text-xs leading-snug">
                      {renderItineraryTitle(day.title)}
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-[#4A5568]">Details on request.</li>
                )}
              </ul>
            </div>

            <div className="mb-3">
              <h5 className="text-xs font-black uppercase text-[#1E5BA8] mb-2 flex items-center gap-1">
                <CheckCircle size={12} /> Inclusions
              </h5>
              <ul className="space-y-1">
                {visibleInclusions.length > 0 ? (
                  visibleInclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#4A5568]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D5D3F] mt-1.5 shrink-0"></span>
                      <span>{inc.trim()}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-[#4A5568]">Inclusions on request.</li>
                )}
              </ul>
            </div>

            <button
              onClick={() => setExpandedTrip(isExpanded ? null : trip.id)}
              className="w-full text-center mt-2 text-sm font-bold text-[#2D5D3F] hover:text-[#1E5BA8] flex items-center justify-center gap-1 transition-colors py-2 bg-[#F5F7FA] rounded-md"
            >
              {isExpanded ? 'Show Less' : 'Read More Details'}
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* PRICING & CTA */}
          <div className="mt-auto border-t border-dashed border-gray-300 pt-4">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <div className="flex items-baseline gap-2">
                  {price > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{(price * 1.4).toLocaleString()}
                    </span>
                  )}
                  <span className="text-3xl font-black text-[#1E5BA8]">
                    {price > 0 ? `₹${price.toLocaleString()}` : 'Request'}
                  </span>
                </div>
                <span className="text-[10px] text-[#4A5568] font-bold uppercase">Per Person</span>
              </div>

              {price > 0 && (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  SAVE {Math.round(((price * 1.4 - price) / (price * 1.4)) * 100)}%
                </div>
              )}
            </div>

            {/* Dual CTA Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setSelectedTrip(trip); setIsEnquiryOpen(true); }}
                className="bg-[#F4C430] hover:bg-[#e0b020] text-[#1A1A1A] text-xs font-bold px-3 py-2.5 rounded shadow-md transition-all flex items-center justify-center gap-1"
              >
                <Mail size={14} /> Enquire
              </button>

              <a
                href={`https://wa.me/${CONTACT_NUMBER.replace(/[^0-9]/g, '')}?text=Hi, I'm interested in ${encodeURIComponent(trip.title)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-2.5 rounded shadow-md transition-all flex items-center justify-center gap-1"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>

            {/* Trust Signal */}
            <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-gray-600 bg-green-50 py-1.5 rounded border border-green-100">
              <CheckCircle size={12} className="text-green-600" />
              <span className="font-semibold">Instant Confirmation • No Hidden Charges</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-white font-sans text-[#1A1A1A]">
      <Toaster position="top-right" />
      <PopupManager  offersConfig={pageData?.offers} pageName={pageData?.page_name} pageSlug={pageData?.slug} />
      <BookingNotification pageData={pageData} />

      {/* Custom Styles */}
      <style>
        {`
          footer + div a[href*="wa.me"],
          a[href*="wa.me"].fixed.right-6.bottom-6.z-50 { display: none !important; }

          @keyframes heartbeat {
            0% { transform: scale(1); } 14% { transform: scale(1.05); }
            28% { transform: scale(1); } 42% { transform: scale(1.05); } 70% { transform: scale(1); }
          }
          @keyframes float {
            0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); }
          }
          @keyframes wiggle {
            0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); }
          }
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }

          .animate-heartbeat { animation: heartbeat 3s infinite; }
          .animate-bounce-slow { animation: bounce 3s infinite; }
          .animate-float { animation: float 2s ease-in-out infinite; }
          .animate-wiggle { animation: wiggle 2s ease-in-out infinite; }
          .animate-slideInRight { animation: slideInRight 0.3s ease-out; }
        `}
      </style>

      {/* --- HEADER ALERT BAR (Sticky) --- */}
      {showHeaderAlert && (
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-2.5 px-4 text-center sticky top-0 z-[60] shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm font-bold">
            <Clock size={16} className="animate-bounce" />
            <span className="animate-pulse">{alertText}</span>
          </div>
        </div>
      )}

      {/* --- TOP BAR --- */}
      <header
        className="bg-white border-b border-gray-100 sticky top-0 z-50 h-20 shadow-md"
        style={{ top: showHeaderAlert ? '40px' : '0' }}
      >
        <div className="max-w-7xl mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="h-16 w-48 flex-shrink-0 flex items-center">
              <img
                src="/holidaysplanners-logo.png"
                alt="Holidays Planners"
                className="h-full w-auto object-contain"
              />
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a href={`tel:${CONTACT_NUMBER}`} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#1E5BA8] group-hover:bg-[#1E5BA8] group-hover:text-white transition-colors">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#4A5568] uppercase font-bold tracking-wider leading-none mb-1">
                    Call Us
                  </span>
                  <span className="text-sm font-black text-[#1A1A1A] group-hover:text-[#1E5BA8] leading-none">
                    {CONTACT_DISPLAY}
                  </span>
                </div>
              </a>

              <a href={`mailto:${pageData?.company?.email}`} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#2D5D3F] group-hover:bg-[#2D5D3F] group-hover:text-white transition-colors">
                  <Mail size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#4A5568] uppercase font-bold tracking-wider leading-none mb-1">
                    Email Us
                  </span>
                  <span className="text-sm font-black text-[#1A1A1A] group-hover:text-[#2D5D3F] leading-none">
                    {pageData?.company?.email || 'info@holidaysplanners.com'}
                  </span>
                </div>
              </a>

              <a
                href={`https://wa.me/${CONTACT_NUMBER.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors shadow-md animate-pulse"
              >
                <MessageCircle size={20} />
              </a>

              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="bg-[#F4C430] hover:bg-[#e0b020] text-[#1A1A1A] px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-yellow-500/40 transition-all transform hover:-translate-y-0.5 animate-pulse"
              >
                Get Call Back in 5 Minutes
              </button>
            </div>

            <button className="md:hidden p-2 text-[#1E5BA8]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative overflow-hidden min-h-[85vh] md:min-h-[600px] flex items-center bg-[#1E5BA8]">
        {/* ✅ HERO BACKGROUND: Uploaded slider/video + parallax scroll feel */}
        <div className="absolute inset-0">
          {/* Video BG */}
          {heroType === "video" && heroVideos?.length > 0 ? (
            <video
              src={heroVideos[0]}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ opacity: 0.35 }}
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHeroBg}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${activeHeroBg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundAttachment: "fixed", // ✅ scrollable feel
                  opacity: 0.35
                }}
              />
            </AnimatePresence>
          )}

          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to right, rgba(26,26,26,0.95), rgba(30,91,168,0.75), rgba(0,0,0,0.10))",
              opacity: overlayOpacity
            }}
          />
        </div>

        {/* ✅ Slider dots */}
        {heroType !== "video" && heroImages?.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveHeroIndex(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === activeHeroIndex ? "w-6 bg-white" : "w-2.5 bg-white/40"
                }`}
                aria-label={`Hero image ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Hero content */}
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 relative z-10 w-full">
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
            <div className="w-full md:w-2/3 text-white pt-4">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F4C430] to-[#E67E22] text-[#1A1A1A] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider mb-6 shadow-lg shadow-yellow-500/20">
                  <Percent size={14} strokeWidth={3} /> <span>Special Festival Offers</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight text-white drop-shadow-lg">
                  Welcome to <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4C430] to-yellow-200">
                    {pageData?.page_name}
                  </span>
                </h1>

                <ul className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
                  {['SHIMLA', 'MANALI', 'DALHOUSIE', 'DHARAMSHALA', 'KINNAUR', 'SPITI'].map(place => (
                    <li key={place} className="flex items-center gap-2 text-sm font-bold text-slate-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F4C430] shadow-[0_0_8px_rgba(244,196,48,1)]"></div>
                      {place}
                    </li>
                  ))}
                </ul>

                <div className="border-l-4 border-[#F4C430] pl-6 py-2 bg-white/5 backdrop-blur-sm rounded-r-lg max-w-md">
                  <h4 className="text-lg font-light text-slate-200">Grab the Exciting</h4>
                  <h4 className="text-2xl font-bold text-white">
                    Deals upto <span className="text-[#F4C430]">35% OFF</span>
                  </h4>
                </div>
              </motion.div>
            </div>

            {/* Hero Form */}
            <div className="w-full md:w-1/3 md:sticky md:top-24">
              <div className="bg-white rounded-xl shadow-2xl p-6 relative overflow-visible mt-6 md:mt-0">
                <div className="absolute -top-4 -right-4 bg-[#F4C430] text-[#1A1A1A] w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-[#1E5BA8] animate-pulse">
                  <span className="text-xs font-bold">SAVE</span>
                  <span className="text-sm font-black leading-none">50%</span>
                </div>

                <div className="bg-[#1E5BA8] text-white text-center py-3 -mx-6 -mt-6 mb-6 rounded-t-xl">
                  <h3 className="font-bold uppercase tracking-wide text-sm">Get Best Price Quote</h3>
                </div>

                <form onSubmit={handleHeroSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    required
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-[#1A1A1A] focus:border-[#F4C430] focus:ring-2 focus:ring-[#F4C430]/20 outline-none text-sm font-medium transition-all"
                    value={heroFormData.full_name}
                    onChange={e => setHeroFormData({ ...heroFormData, full_name: e.target.value })}
                  />

                  <input
                    type="tel"
                    placeholder="WhatsApp Number *"
                    required
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-[#1A1A1A] focus:border-[#F4C430] focus:ring-2 focus:ring-[#F4C430]/20 outline-none text-sm font-medium transition-all"
                    value={heroFormData.contact_number}
                    onChange={e => setHeroFormData({ ...heroFormData, contact_number: e.target.value })}
                  />

                  <input
                    type="email"
                    placeholder="Email Address *"
                    required
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-[#1A1A1A] focus:border-[#F4C430] focus:ring-2 focus:ring-[#F4C430]/20 outline-none text-sm font-medium transition-all"
                    value={heroFormData.email}
                    onChange={e => setHeroFormData({ ...heroFormData, email: e.target.value })}
                  />

                  {/* Trust Signal */}
                  <div className="flex items-center gap-2 text-xs text-gray-600 bg-green-50 p-2 rounded border border-green-200">
                    <ShieldCheck size={14} className="text-green-600" />
                    <span>100% Safe • No Spam • Get Quote in 5 Minutes</span>
                  </div>

                  <button
                    type="submit"
                    disabled={heroSubmitting}
                    className="w-full bg-gradient-to-r from-[#F4C430] to-[#E67E22] hover:from-[#e0b020] hover:to-[#d16d1a] text-[#1A1A1A] font-bold py-4 rounded-lg uppercase tracking-wider transition-all shadow-xl text-sm flex items-center justify-center gap-2 group"
                  >
                    {heroSubmitting ? (
                      <div className="w-5 h-5 border-2 border-[#1A1A1A]/30 border-t-[#1A1A1A] rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Get Best Price Quote</span>
                        <ChevronDown className="group-hover:translate-x-1 transition-transform rotate-[-90deg]" size={16} />
                      </>
                    )}
                  </button>

                  {/* Social Proof */}
                  <div className="text-center text-xs text-gray-600 flex items-center justify-center gap-2">
                    <div className="flex -space-x-2">
                      {TRAVELER_AVATARS.map((src, i) => (
                                <img
                                key={i}
                                src={src}
                                alt="Traveler"
                                className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm"
                                loading="lazy"
                                />
                            ))}
                    </div>
                    <span className="font-semibold text-[#1E5BA8]">500+ travelers booked this month</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PACKAGES SECTION --- */}
      <section id="packages" className="py-12 bg-[#F5F7FA] relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center z-10">
          <Star className="text-[#F4C430] w-8 h-8 fill-current animate-wiggle" />
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-[#1A1A1A] mb-2 tracking-tight">
              🔥 Hot Selling Packages - Limited Time Offer!
            </h1>
            <h5 className="text-[#4A5568] font-medium text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Explore the best of <span className="text-[#1E5BA8] font-bold">{pageData?.page_name}</span> with exclusive discounts up to{" "}
              <span className="text-red-600 font-black">35% OFF</span>
            </h5>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {loading ? (
              <div className="col-span-3 text-center py-12 text-[#4A5568]">
                Loading Amazing Deals...
              </div>
            ) : (
              mainPackages.map((trip) => <TripCard key={trip.id} trip={trip} />)
            )}
          </div>
        </div>
      </section>

      {/* --- ABOUT US (AS YOU HAD) --- */}
      <section id="about" className="py-16 bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#1E5BA8] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F4C430] rounded-full blur-3xl"></div>
        </div>

        <div className="absolute top-10 right-10 opacity-5 hidden lg:block">
          <BadgeCheck size={300} className="text-[#2D5D3F]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="flex flex-col justify-center order-2 md:order-1">
              <div className="inline-flex items-center gap-2 bg-[#1E5BA8]/10 text-[#1E5BA8] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider mb-4 w-fit">
                <Award size={14} /> Local Himachal Experts
              </div>

              <h2 className="text-4xl font-black text-[#1A1A1A] mb-4">
                Why Choose <span className="text-[#1E5BA8]">Holidays Planners</span>?
              </h2>

              <p className="text-[#4A5568] leading-relaxed mb-6 text-base">
                <span className="font-bold text-[#1E5BA8]">Based in Himachal Pradesh</span>, we're locals who know every hidden gem and secret route.
                With over <span className="font-bold text-[#1E5BA8]">15 years of experience</span> and{" "}
                <span className="font-bold text-[#2D5D3F]">Government Tourism approval</span>, we guarantee the best prices and authentic experiences.
                No middlemen, just direct local expertise.
              </p>

              <ul className="space-y-3 mb-8 font-bold text-[#1A1A1A] text-base">
                {[
                  { icon: Target, text: 'Himachal Locals - Best Insider Knowledge' },
                  { icon: BadgeCheck, text: 'Govt. Approved by Tourism India' },
                  { icon: Wallet, text: 'Lowest Prices - Direct Local Rates' },
                  { icon: Headphones, text: '24×7 Support - On-Trip Assistance' }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-[#F4C430] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon size={20} className="text-[#1A1A1A]" />
                    </div>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsEnquiryOpen(true)}
                  className="bg-[#1E5BA8] hover:bg-[#164a8a] text-white px-8 py-4 rounded-lg shadow-lg font-bold uppercase text-sm tracking-wider transition-all flex items-center justify-center gap-2 group"
                >
                  Get Custom Package <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href={`tel:${CONTACT_NUMBER}`}
                  className="border-2 border-[#1E5BA8] text-[#1E5BA8] hover:bg-[#1E5BA8] hover:text-white px-8 py-4 rounded-lg font-bold uppercase text-sm tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <Phone size={18} /> Call Now
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 order-1 md:order-2">
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                  <img src="https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2024/03/15143552/Kalpa.jpg?w=400&h=300&fit=crop" alt="Himachal Mountains" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-sm">Breathtaking Views</span>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                  <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=400&fit=crop" alt="Luxury Hotels" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-sm">Premium Hotels</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                  <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop" alt="Adventure Activities" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-sm">Adventure Awaits</span>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                  <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop" alt="Happy Travelers" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-sm">Happy Travelers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "Govt. Approved", sub: "Himachal Tourism", icon: BadgeCheck, color: "#2D5D3F", bg: "from-green-50 to-emerald-50", iconBg: "bg-white" },
              { title: "15+ Years", sub: "Industry Experience", icon: Award, color: "#F4C430", bg: "from-yellow-50 to-amber-50", iconBg: "bg-white" },
              { title: "4.9/5 Rating", sub: "10,000+ Reviews", icon: Star, color: "#F4C430", bg: "from-yellow-50 to-orange-50", iconBg: "bg-white" },
              { title: "24/7 Support", sub: "On-Trip Assistance", icon: Headphones, color: "#1E5BA8", bg: "from-blue-50 to-sky-50", iconBg: "bg-white" },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${card.bg} p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group`}
                style={{ minHeight: '180px' }}
              >
                <div className={`w-16 h-16 ${card.iconBg} rounded-full flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  <card.icon size={32} style={{ color: card.color }} strokeWidth={1.5} />
                </div>
                <h4 className="font-bold text-[#1A1A1A] text-lg mb-1">{card.title}</h4>
                <p className="text-xs text-[#4A5568] font-semibold">{card.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROMO BANNER --- */}
      {pageData?.offers?.mid_section && (
        <PromoMediaSection
          data={pageData.offers.mid_section}
          primaryColor="#1E5BA8"
          secondaryColor="#2D5D3F"
        />
      )}

      {/* --- TESTIMONIALS --- */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <TestimonialCarousel testimonials={pageData?.testimonials?.items} />
        </div>
      </section>

      {/* --- WHY BOOK WITH US ---
      <section className="py-16 bg-gradient-to-br from-[#F5F7FA] to-blue-50 border-t border-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1E5BA8] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-black text-[#1A1A1A] mb-3">
              🎯 Why Travelers Choose Us
            </h1>
            <p className="text-[#4A5568] text-lg">The Holidays Planners Advantage</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: 'LOCAL EXPERTS',
                desc: 'Born & raised in Himachal - we know every trail, shortcut & hidden gem',
                icon: Target,
                color: 'text-[#1E5BA8]',
                bg: 'bg-blue-100',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxRTVCQTgiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyRDVEM0YiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0idXJsKCNhKSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEyNSIgcj0iNjAiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMiIvPjxwYXRoIGQ9Ik0xNTAgOTBMMjAwIDYwTDI1MCA5MEwyMDAgMTIwWiIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC4zIi8+PHBhdGggZD0iTTE3MCAxNDBMMjAwIDEyMEwyMzAgMTQwTDIwMCAxNjBaIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4='
              },
              {
                title: 'GOVT. APPROVED',
                desc: 'Officially recognized by Tourism India - your safety & quality guaranteed',
                icon: BadgeCheck,
                color: 'text-[#3A6B35]',
                bg: 'bg-green-100',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMyRDVEM0YiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMzQTZCMzUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0idXJsKCNiKSIvPjxwb2x5Z29uIHBvaW50cz0iMjAwLDYwIDI0MCwxMDAgMjAwLDE0MCAxNjAsMTAwIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxMjUiIHI9IjgwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iNCIgb3BhY2l0eT0iMC4yIi8+PHBhdGggZD0iTTE3MCAxMjVMMTkwIDE0NUwyMzAgMTA1IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iOCIgZmlsbD0ibm9uZSIgb3BhY2l0eT0iMC40Ii8+PC9zdmc+'
              },
              {
                title: 'BEST PRICES',
                desc: 'Direct local rates - no middlemen markup. 30-40% cheaper than agencies',
                icon: Wallet,
                color: 'text-[#F4C430]',
                bg: 'bg-yellow-100',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImMiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGNEM0MzAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNFNjdFMjIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0idXJsKCNjKSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iODAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKCuTwvdGV4dD48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxMjUiIHI9IjcwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iNiIgb3BhY2l0eT0iMC4yIiBzdHJva2UtZGFzaGFycmF5PSIxMCA1Ii8+PC9zdmc+'
              },
              {
                title: '24/7 SUPPORT',
                desc: 'Real people, real help - on-trip assistance & emergency response',
                icon: Headphones,
                color: 'text-[#1E5BA8]',
                bg: 'bg-blue-100',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxRTVCQTgiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0QTVBNjgiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0idXJsKCNkKSIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyNSIgcj0iNDAiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMiIvPjxjaXJjbGUgY3g9IjI1MCIgY3k9IjEyNSIgcj0iNDAiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMiIvPjxwYXRoIGQ9Ik0xNTAgMTY1QTE1MCwxNTAgMCAwIDAgMjUwIDE2NSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjYiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuMyIvPjwvc3ZnPg=='
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border-b-4 border-transparent hover:border-[#F4C430]">
                <div className="relative h-40 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className={`absolute top-3 right-3 w-12 h-12 ${item.bg} rounded-full flex items-center justify-center shadow-lg`}>
                    <item.icon size={24} className={item.color} />
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h4 className="font-black text-lg mb-2 text-[#1A1A1A]">{item.title}</h4>
                  <p className="text-sm font-medium text-[#4A5568] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="bg-gradient-to-r from-[#1E5BA8] to-[#2D5D3F] hover:from-[#164a8a] hover:to-[#1f4a2f] text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider transition-all text-base shadow-xl hover:shadow-2xl transform hover:-translate-y-1 inline-flex items-center gap-3"
            >
              <TrendingUp size={20} /> Start Planning Your Dream Trip Now
            </button>
          </div>
        </div>
      </section> */}

      {/* --- STATIC CTA BAR BEFORE FOOTER --- */}
      <section className="bg-gradient-to-r from-[#1E5BA8] via-[#2D5D3F] to-[#1E5BA8] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left text-white">
              <h2 className="text-2xl md:text-3xl font-black mb-2">Ready for Your Himachal Adventure?</h2>
              <p className="text-lg opacity-90">
                Book now and save up to <span className="text-[#F4C430] font-black">35%</span> on your dream vacation!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href={`tel:${CONTACT_NUMBER}`}
                className="bg-gradient-to-r from-[#FF6B35] to-[#FF9F00] hover:from-[#ff5520] hover:to-[#ff8c00] text-white px-6 sm:px-8 py-4 rounded-full font-bold text-sm sm:text-base shadow-2xl transition-all flex items-center justify-center gap-3 animate-pulse whitespace-nowrap"
              >
                <Phone size={20} /> Call: {CONTACT_DISPLAY}
              </a>

              <a
                href={`https://wa.me/${CONTACT_NUMBER.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-4 rounded-full font-bold text-sm sm:text-base shadow-2xl transition-all flex items-center justify-center gap-3 whitespace-nowrap"
              >
                <MessageCircle size={20} /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] text-white pt-12 pb-6 border-t-4 border-[#F4C430] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4C430] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1E5BA8] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-[#F4C430] mb-6 text-center">Popular Destinations</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {[
                { name: 'Shimla', img: 'https://tiagoholidays.com/wp-content/uploads/2021/03/7f628daeff85825989a0d30a89d7b260.jpg?w=200&h=150&fit=crop' },
                { name: 'Manali', img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200&h=150&fit=crop' },
                { name: 'Dharamshala', img: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=200&h=150&fit=crop' },
                { name: 'Dalhousie', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop' },
                { name: 'Kasauli', img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&h=150&fit=crop' },
                { name: 'Spiti Valley', img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&h=150&fit=crop' }
              ].map((dest, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all">
                  <img src={dest.img} alt={dest.name} className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                    <span className="text-white font-bold text-xs">{dest.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-[10px] text-gray-400 leading-relaxed text-center font-medium opacity-80">
              {SEO_KEYWORDS.join(" | ")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start pt-4 border-t border-gray-800">
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-bold text-[#F4C430] uppercase text-xs tracking-widest mb-4">Our Guarantee</h4>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-white/10">
                <ShieldCheck size={40} className="text-[#F4C430]" />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-300"><CheckCircle size={12} className="text-[#F4C430]" /> 100% Trust & Security</div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-300"><CheckCircle size={12} className="text-[#F4C430]" /> 24/7 Support</div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-300"><CheckCircle size={12} className="text-[#F4C430]" /> Best Value Guarantee</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <h4 className="font-bold text-[#F4C430] uppercase text-xs tracking-widest mb-4">Certifications</h4>
              <div className="flex gap-6">
                <div className="flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                  <Globe size={32} className="text-white" />
                  <span className="text-[9px] uppercase tracking-wider text-gray-400">Tourism Dept.</span>
                </div>
                <div className="flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                  <BadgeCheck size={32} className="text-white" />
                  <span className="text-[9px] uppercase tracking-wider text-gray-400">Govt. Reg</span>
                </div>
                <div className="flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                  <Award size={32} className="text-white" />
                  <span className="text-[9px] uppercase tracking-wider text-gray-400">ISO Certified</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end text-center md:text-right">
              <h4 className="font-bold text-[#F4C430] uppercase text-xs tracking-widest mb-4">Payment Methods</h4>
              <div className="flex gap-3 mb-6 bg-white rounded-lg px-4 py-2 shadow-lg">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-6" />
              </div>

              <h4 className="font-bold text-[#F4C430] uppercase text-xs tracking-widest mb-2">24/7 Customer Support</h4>
              <a href={`tel:${CONTACT_NUMBER}`} className="text-xl font-black text-white hover:text-[#F4C430] transition-colors tracking-wide flex items-center gap-2 mb-2">
                <Phone size={18} /> {CONTACT_DISPLAY}
              </a>
              <a href={`mailto:info@holidaysplanners.com`} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <Mail size={18} /> info@holidaysplanners.com
              </a>
            </div>
          </div>

          <div className="mt-10 pt-4 border-t border-gray-900 text-center flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-[10px] text-gray-600 uppercase tracking-wider">
              © Copyright {new Date().getFullYear()}, Holidays Planners. All Rights Reserved.
            </p>
            <p className="text-[10px] text-gray-700">Privacy Policy | Terms & Conditions | Cancellation Policy</p>
          </div>
        </div>
      </footer>

      {/* --- FOOTER ALERT BAR --- */}
      {showFooterAlert && (
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm font-bold">
            <Gift size={16} className="animate-bounce" />
            <span className="animate-pulse">{pageData?.offers?.footer?.text || alertText}</span>
          </div>
        </div>
      )}

      {/* --- MODALS & CTA --- */}
      <UnifiedEnquiryModal
        trip={selectedTrip}
        isOpen={isEnquiryOpen}
        onClose={() => { setIsEnquiryOpen(false); setSelectedTrip(null); }}
        pageName={pageData?.page_name}
        pageSlug={pageData?.slug}
        offersConfig={pageData?.offers}
      />

      <FloatingCTA
        settings={pageData?.company || {}}
        offersConfig={pageData?.offers}
        onOpenEnquiry={() => setIsEnquiryOpen(true)}
      />
    </div>
  );
}
