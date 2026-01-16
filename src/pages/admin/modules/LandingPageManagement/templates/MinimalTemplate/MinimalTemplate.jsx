import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone, Mail, CheckCircle,
    Plane, Building2, Utensils,
    Car, Camera, Clock, Send, Star, Users, 
    X, ChevronDown, ChevronUp, Heart, Menu, Sparkles, Compass
} from 'lucide-react';
import { toast, Toaster } from "sonner";

// --- COMPONENTS ---
import UnifiedEnquiryModal from '../ModernTemplate/components/UnifiedEnquiryModal';
import BookingNotification from '../ModernTemplate/components/BookingNotification';
import ContactForm from '../ModernTemplate/components/ContactForm';
import PopupManager from '../ModernTemplate/components/Popupmanager';
import AboutSection from '../ModernTemplate/components/AboutSection';
import TestimonialCarousel from '../ModernTemplate/components/TestimonialCarousel';
import PromoMediaSection from '../ModernTemplate/components/PromoMediaSection';
import FloatingCTA from '../ModernTemplate/components/FloatingCTA'; // Imported Component with Countdown

// --- CONSTANTS & CONFIG ---
const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const API_KEY = 'x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ';
const DEFAULT_DOMAIN = 'https://www.holidaysplanners.com';

export default function MinimalTemplate({ pageData }) {
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
    const [allTrips, setAllTrips] = useState([]);
    const [mainPackages, setMainPackages] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [heroSubmitting, setHeroSubmitting] = useState(false);
    const [expandedTrip, setExpandedTrip] = useState(null);
    
    // Header States
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Hero Form State
    const [heroFormData, setHeroFormData] = useState({
        destination: pageData?.page_name || '',
        full_name: '',
        contact_number: '',
        email: '',
        adults: 2,
        departure_city: 'Hero Form Lead',
        travel_date: new Date().toISOString().split('T')[0],
        domain_name: DEFAULT_DOMAIN
    });

    // --- 1. FETCH DATA ---
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/trips`, { headers: { 'x-api-key': API_KEY } });
                const data = await res.json();
                const fetchedTrips = data.data || data;
                setAllTrips(fetchedTrips);

                // Filter Main "Popular" Packages
                if (pageData?.packages?.selected_trips) {
                    const selected = fetchedTrips.filter(t => 
                        pageData.packages.selected_trips.some(st => st.trip_id === t.id)
                    );
                    
                    // Enrich with specific badge overrides from the selection if needed
                    const enriched = selected.map(t => {
                        const meta = pageData.packages.selected_trips.find(st => st.trip_id === t.id);
                        return { ...t, badge: meta?.badge || t.badge };
                    });
                    setMainPackages(enriched);
                }

            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        fetchTrips();

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pageData]);

    const scrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    // --- LOGIC: Smart Icon Generation ---
    const getInclusionIcons = (trip) => {
        const content = `${trip.inclusions || ''} ${trip.highlights || ''} ${trip.title || ''}`.toLowerCase();
        const iconList = [];

        // 1. SIGHTSEEING (Pink)
        iconList.push({ icon: Camera, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100', label: 'Sightseeing' });

        // 2. HOTELS (Purple)
        if (content.includes('hotel') || content.includes('stay')) {
            iconList.push({ icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', label: 'Hotels' });
        }

        // 3. MEALS (Orange)
        if (content.includes('meal') || content.includes('breakfast')) {
            iconList.push({ icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', label: 'Meals' });
        }

        // 4. TRANSFERS (Green)
        if (content.includes('transfer') || content.includes('cab')) {
            iconList.push({ icon: Car, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Transfers' });
        }

        // 5. FLIGHTS (Blue)
        if (content.includes('flight') || content.includes('airfare')) {
            iconList.push({ icon: Plane, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', label: 'Flights' });
        }

        return iconList.slice(0, 4);
    };

    const getTripPrice = (trip) => {
        if (trip.pricing?.pricing_model === 'fixed_departure' &&
            trip.pricing?.fixed_departure?.[0]?.costingPackages?.[0]) {
            return trip.pricing.fixed_departure[0].costingPackages[0].final_price;
        }
        if (trip.pricing?.customized) {
            return trip.pricing.customized.final_price;
        }
        return trip.base_price || trip.price || null;
    };

    const handleHeroSubmit = async (e) => {
        e.preventDefault();
        
        // Prevent double submission
        if (heroSubmitting) return;
        
        setHeroSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/enquires`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
                body: JSON.stringify({ ...heroFormData, source: `Landing Page: ${pageData?.slug}` })
            });
            
            if (res.ok) {
                // Personalized Success Message
                const firstName = heroFormData.full_name.split(' ')[0] || "Traveler";
                toast.success(`Thank you ${firstName} for submitting! We will contact you soon.`);
                
                // Clear form
                setHeroFormData({ 
                    destination: pageData?.page_name || '',
                    full_name: '', 
                    contact_number: '', 
                    email: '',
                    adults: 2,
                    departure_city: 'Hero Form Lead',
                    travel_date: new Date().toISOString().split('T')[0],
                    domain_name: DEFAULT_DOMAIN
                });
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } catch (err) { 
            toast.error("Submission failed. Check connection."); 
        } finally { 
            setHeroSubmitting(false); 
        }
    };

    // Socials & Contact
    const contactNumber = pageData?.company?.contact || '';
    const whatsAppNumber = contactNumber.replace(/[^0-9]/g, '');
    const whatsAppLink = `https://wa.me/${whatsAppNumber}`;

    const handleOpenEnquiry = () => {
        setIsEnquiryOpen(true);
    };

    // --- REUSABLE TRIP CARD COMPONENT ---
    const SingleTripCard = ({ trip, index }) => {
        const icons = getInclusionIcons(trip);
        const isExpanded = expandedTrip === trip.id;
        const price = getTripPrice(trip);

        return (
            <motion.div
                key={trip.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group relative"
            >
                {/* Image Section */}
                <div className="h-64 overflow-hidden relative shrink-0">
                    <img
                        src={trip.hero_image}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={trip.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-60" />

                    {/* 1. BADGES CONTAINER (Top Left - Absolute) */}
                    <div className="absolute top-4 left-4 z-30 flex gap-2 items-start">
                        {/* Duration Badge */}
                        <div className="bg-white shadow-md px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                            <Clock size={14} className="text-[#FF6B35]" />
                            <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                            {trip.days}D / {trip.nights}N
                            </span>
                        </div>
                        
                        {/* Deal/Label Badge */}
                        {trip.badge && (
                            <div className="bg-[#FF6B35] text-white shadow-md px-3 py-1.5 rounded-lg flex items-center">
                                <span className="text-xs font-black uppercase tracking-wide">{trip.badge}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg text-[#FF6B35] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-20">
                        <Heart size={18} />
                    </div>

                    {/* 2. ICONS (Bottom of Image - Half Overlap) */}
                    <div className="absolute bottom-10 translate-y-1/2 left-0 right-0 flex justify-center gap-2 px-4 z-20">
                        {icons.map((item, i) => (
                            <div
                                key={i}
                                className={`${item.bg} ${item.border} w-12 h-12 border shadow-lg rounded-xl flex flex-col items-center justify-center gap-0.5 transform transition-transform hover:-translate-y-1 bg-white`}
                                title={item.label}
                            >
                                <item.icon size={16} className={item.color} strokeWidth={2.5} />
                                <span className={`text-[8px] font-black uppercase tracking-wider ${item.color} leading-none`}>
                                    {item.label.substring(0,6)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Section - Padding Top increased to clear icons */}
                <div className="px-5 pb-5 pt-10 flex-1 flex flex-col">
                    <h3 className="text-lg md:text-xl font-black mb-3 leading-tight text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-center mt-2">
                        {trip.title}
                    </h3>

                    {/* Expandable Content Area */}
                    <div className="flex-1">
                        <AnimatePresence initial={false}>
                            {!isExpanded ? (
                                <motion.div
                                    key="collapsed"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="space-y-1"
                                >
                                    {trip.highlights && trip.highlights.split(';').slice(0, 2).map((h, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-500 justify-center">
                                            <CheckCircle size={12} className="text-green-500 shrink-0 mt-0.5" />
                                            <span className="line-clamp-1">{h.trim()}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="expanded"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-3 overflow-hidden mt-2"
                                >
                                    <div>
                                        <h5 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-2 text-center">Trip Highlights</h5>
                                        <div className="grid gap-1.5">
                                            {trip.highlights && trip.highlights.split(';').map((h, i) => (
                                                <div key={i} className="flex gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                                                    <CheckCircle size={12} className="text-[#FF6B35] shrink-0 mt-0.5" />
                                                    <span className="leading-snug">{h.trim()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {trip.inclusions && (
                                        <div>
                                            <h5 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-2 text-center">What's Included</h5>
                                            <div
                                                dangerouslySetInnerHTML={{ __html: trip.inclusions }}
                                                className="text-xs text-slate-500 leading-relaxed [&_ul]:list-disc [&_ul]:ml-4 [&_li]:mb-1"
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={() => setExpandedTrip(isExpanded ? null : trip.id)}
                        className="w-full mt-3 text-blue-600 hover:text-blue-800 font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-1 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        {isExpanded ? (
                            <>Show Less <ChevronUp size={14} /></>
                        ) : (
                            <>View Details <ChevronDown size={14} /></>
                        )}
                    </button>

                    {/* Price & CTA */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Starting From</span>
                            {price ? (
                                <span className="text-xl font-black text-slate-900 leading-none">
                                    ₹{price.toLocaleString('en-IN')}
                                </span>
                            ) : (
                                <span className="text-base font-bold text-slate-600">On Request</span>
                            )}
                        </div>
                        <button
                            onClick={() => { setSelectedTrip(trip); setIsEnquiryOpen(true); }}
                            className="bg-slate-900 hover:bg-[#FF6B35] text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
                        >
                            Enquire Now
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 font-sans scroll-smooth text-slate-900 selection:bg-orange-100 selection:text-orange-600 overflow-x-hidden">
            <title>{pageData?.seo?.meta_title || pageData?.page_name}</title>
            
            <style>
                {`
                  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                  .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
                `}
            </style>

            <Toaster position="top-right" richColors />

            <PopupManager pageName={pageData?.page_name} pageSlug={pageData?.slug} offersConfig={pageData?.offers} />
            <BookingNotification pageData={pageData} />

            {/* ========================================
               0. HEADER ALERT (From Data)
            ======================================== */}
             {pageData?.offers?.header?.enabled && (
                <div 
                    className="w-full py-2 px-4 text-center text-xs font-bold uppercase tracking-widest relative z-[1003] bg-slate-900 text-white"
                >
                    {pageData.offers.header.text}
                </div>
            )}

            {/* ========================================
               2. HEADER (Sticky & Responsive)
            ======================================== */}
        
            <motion.header
                className={`sticky top-0 z-[999] w-full transition-all duration-300 ${
                    isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg py-1' : 'bg-white py-2'
                }`}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        
                        {/* LOGO */}
                        <a href="#" onClick={(e) => scrollToSection(e, 'hero')} className="relative group z-50">
                            <img
                                src="/holidaysplanners-logo.png"
                                alt="Holidays Planners" 
                                // Reduced height from h-14 to h-10
                                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                        </a>

                        {/* DESKTOP NAV */}
                        <nav className="hidden lg:flex items-center gap-6"> {/* Reduced gap from 8 to 6 */}
                            {['packages', 'about', 'contact'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item}`}
                                    onClick={(e) => scrollToSection(e, item)}
                                    className="text-slate-700 font-bold text-xs uppercase tracking-wider hover:text-[#FF6B35] transition-colors relative group py-2"
                                >
                                    {item}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6B35] transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            ))}
                            <button
                                onClick={() => setIsEnquiryOpen(true)}
                                className="bg-[#FF6B35] hover:bg-orange-600 text-white px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-orange-500/30 transform hover:-translate-y-0.5 transition-all active:scale-95"
                            >
                                Get Quote
                            </button>
                        </nav>

                        {/* MOBILE TOGGLE */}
                        <button
                            className="lg:hidden p-1.5 text-slate-800 hover:bg-slate-100 rounded-lg transition-colors z-50" // Reduced padding
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />} // Reduced icon size
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            className="lg:hidden bg-white border-t border-slate-100 absolute w-full left-0 shadow-2xl overflow-hidden"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <nav className="flex flex-col p-4 space-y-1"> {/* Reduced padding and spacing */}
                                {['packages', 'about', 'contact'].map((item) => (
                                    <a
                                        key={item}
                                        href={`#${item}`}
                                        onClick={(e) => scrollToSection(e, item)}
                                        className="block p-3 rounded-xl text-slate-900 font-bold text-lg hover:bg-slate-50 hover:text-[#FF6B35] capitalize transition-all"
                                    >
                                        {item}
                                    </a>
                                ))}
                                <div className="h-px bg-slate-100 my-2" />
                                {pageData?.company?.contact && (
                                    <a
                                        href={whatsAppLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl text-green-600 font-bold hover:bg-green-50 transition-all"
                                    >
                                        <Phone className="h-5 w-5" />
                                        WhatsApp Us
                                    </a>
                                )}
                                <button
                                    onClick={() => { setIsEnquiryOpen(true); setIsMobileMenuOpen(false); }}
                                    className="mt-2 w-full py-3 bg-[#FF6B35] text-white font-bold text-lg rounded-xl shadow-md active:scale-95 transition-transform"
                                >
                                    Enquire Now
                                </button>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* ========================================
               3. HERO SECTION
            ======================================== */}
            <section id="hero" className="relative min-h-[550px] lg:min-h-[650px] flex items-center bg-slate-900 overflow-hidden w-full">
                <div className="absolute inset-0 z-0">
                    <img src={pageData?.hero?.background_images?.[0]} className="w-full h-full object-cover opacity-50 scale-105 animate-pulse-slow" alt="Banner" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-slate-900/30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 py-12 w-full items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-white text-center lg:text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/30 text-[#FF6B35] text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                            <Star size={12} fill="currentColor" /> Premium Travel Experience
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 tracking-tight">
                            {pageData?.hero?.title}
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-xl mb-10 leading-relaxed font-light mx-auto lg:mx-0">
                            {pageData?.hero?.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button
                                onClick={(e) => scrollToSection(e, 'packages')}
                                className="bg-white text-slate-900 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#FF6B35] hover:text-white transition-all shadow-xl hover:shadow-orange-500/20 hover:scale-105 active:scale-95"
                            >
                                Explore Packages
                            </button>
                            <button
                                onClick={() => setIsEnquiryOpen(true)}
                                className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-white/10 transition-all backdrop-blur-sm"
                            >
                                Custom Plan
                            </button>
                        </div>
                    </motion.div>

                    {/* Form Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF6B35] to-transparent"></div>
                        <div className="mb-6">
                            <h3 className="text-2xl md:text-3xl font-black text-white mb-2">Get Free Quote</h3>
                            <p className="text-slate-300 text-sm font-medium">Plan your dream vacation today</p>
                        </div>
                        <form onSubmit={handleHeroSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    required
                                    value={heroFormData.full_name}
                                    onChange={e => setHeroFormData({ ...heroFormData, full_name: e.target.value })}
                                    placeholder="Full Name"
                                    className="w-full p-3.5 bg-white/90 border-0 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-[##FF6B35] outline-none transition-all"
                                />
                                <input
                                    required
                                    value={heroFormData.contact_number}
                                    onChange={e => setHeroFormData({ ...heroFormData, contact_number: e.target.value })}
                                    placeholder="Phone Number"
                                    className="w-full p-3.5 bg-white/90 border-0 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-[##FF6B35] outline-none transition-all"
                                />
                            </div>
                            <input
                                required
                                type="email"
                                value={heroFormData.email}
                                onChange={e => setHeroFormData({ ...heroFormData, email: e.target.value })}
                                placeholder="Email Address"
                                className="w-full p-3.5 bg-white/90 border-0 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-[##FF6B35] outline-none transition-all"
                            />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    required
                                    type="date"
                                    value={heroFormData.travel_date}
                                    onChange={e => setHeroFormData({ ...heroFormData, travel_date: e.target.value })}
                                    className="w-full p-3.5 bg-white/90 border-0 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#FF6B35] outline-none transition-all"
                                />
                                <div className="flex items-center bg-white/90 rounded-xl px-4">
                                    <Users size={18} className="text-slate-500 mr-2" />
                                    <input
                                        type="number"
                                        min="1"
                                        value={heroFormData.adults}
                                        onChange={e => setHeroFormData({ ...heroFormData, adults: e.target.value })}
                                        className="bg-transparent border-none w-full text-sm font-bold text-slate-900 py-3.5 outline-none"
                                        placeholder="Travelers"
                                    />
                                </div>
                             </div>

                            <button
                                type="submit"
                                disabled={heroSubmitting}
                                className="w-full bg-[#FF6B35] hover:bg-orange-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg hover:shadow-orange-500/40 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
                            >
                                {heroSubmitting ? "Sending..." : "Get Instant Quote"} <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* ========================================
               4. PACKAGES SECTION (Main Selection)
            ======================================== */}
            <section id="packages" className="py-24 bg-slate-50 relative overflow-hidden w-full">
                <div className="absolute top-0 right-0 w-full md:w-1/3 h-full bg-blue-100/50 -skew-x-12 z-0 pointer-events-none opacity-50"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-[#FF6B35] font-black uppercase tracking-[0.2em] text-xs mb-4 block">
                            Our Curated Packages
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            {pageData?.packages?.section_title || "Explore Our Best Sellers"}
                        </h2>
                        <div className="w-20 h-1.5 bg-[#FF6B35] mx-auto rounded-full"></div>
                        <p className="text-slate-600 font-medium text-lg mt-6 max-w-2xl mx-auto">
                            {pageData?.packages?.section_subtitle}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            [1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-3xl h-[500px] animate-pulse border border-slate-200 shadow-sm"></div>
                            ))
                        ) : (
                            mainPackages.map((trip, idx) => (
                                <SingleTripCard key={trip.id} trip={trip} index={idx} />
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* ========================================
               5. CUSTOM PACKAGES (Dynamic Sections)
            ======================================== */}
            {pageData?.packages?.custom_packages?.map((pkg, idx) => {
                const pkgTrips = allTrips.filter(t => pkg.trip_ids?.includes(t.id));
                if (pkgTrips.length === 0) return null;

                return (
                    <section key={idx} className="py-16 bg-white border-t border-slate-100 w-full relative overflow-hidden">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mb-12"
                            >
                                {pkg.badge && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-slate-100 text-slate-600">
                                        <Compass className="w-4 h-4" />
                                        <span className="text-sm font-bold uppercase">{pkg.badge}</span>
                                    </div>
                                )}
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{pkg.title}</h2>
                                {pkg.description && (
                                    <p className="text-lg text-slate-600 max-w-3xl mx-auto">{pkg.description}</p>
                                )}
                            </motion.div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {pkgTrips.map((trip, tIdx) => (
                                    <SingleTripCard key={trip.id} trip={trip} index={tIdx} />
                                ))}
                            </div>
                        </div>
                    </section>
                );
            })}

            {/* ========================================
               6. PROMO MEDIA SECTION
            ======================================== */}
            {pageData?.offers?.mid_section && (
                <PromoMediaSection 
                    data={pageData.offers.mid_section} 
                    primaryColor="#0f172a" 
                    secondaryColor="#FF6B35" 
                />
            )}

            <section id="about">
                <AboutSection
                    title={pageData?.company_about?.section_title}
                    subtitle={pageData?.company_about?.section_subtitle}
                />
            </section>

            {/* Testimonials */}
<div className="pb-0"> {/* Reduced bottom padding */}
    <TestimonialCarousel testimonials={pageData?.testimonials?.items} />
</div>

            <section id="contact" className="py-8 sm:py-10">
                <ContactForm
                    settings={pageData?.company}
                    pageName={pageData?.page_name}
                    pageSlug={pageData?.slug}
                />
            </section>

            <UnifiedEnquiryModal
                trip={selectedTrip}
                isOpen={isEnquiryOpen}
                onClose={() => {
                    setIsEnquiryOpen(false);
                    setSelectedTrip(null);
                }}
                pageName={pageData?.page_name}
                pageSlug={pageData?.slug}
            />

            <FloatingCTA 
                settings={pageData?.company || {}} 
                offersConfig={pageData?.offers}
                onOpenEnquiry={handleOpenEnquiry}
            />

            {/* Footer */}
          
<footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 relative z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo & Copyright */}
            <div className="flex flex-col items-center md:items-start">
                <img 
                    src="/holidaysplanners-logo.png" 
                    alt="Footer Logo" 
                    className="h-10 mb-3 object-contain" 
                />
                <p className="text-sm font-medium text-center md:text-left">
                    &copy; {new Date().getFullYear()} {pageData?.company?.name}. All rights reserved.
                </p>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex flex-wrap justify-center md:justify-end gap-6 text-sm font-bold uppercase tracking-wider">
                <a 
                    href="#packages" 
                    onClick={(e) => scrollToSection(e, 'packages')} 
                    className="hover:text-[#FF6B35] transition-colors"
                >
                    Packages
                </a>
                <a 
                    href="#about" 
                    onClick={(e) => scrollToSection(e, 'about')} 
                    className="hover:text-[#FF6B35] transition-colors"
                >
                    About
                </a>
                <a 
                    href="#contact" 
                    onClick={(e) => scrollToSection(e, 'contact')} 
                    className="hover:text-[#FF6B35] transition-colors"
                >
                    Contact
                </a>
            </nav>
        </div>
    </div>
</footer>
             <style jsx>{`
                @keyframes shimmer {
                  0% { transform: translateX(-100%) skewX(-12deg); }
                  100% { transform: translateX(200%) skewX(-12deg); }
                }
                .animate-shimmer {
                  animation: shimmer 3s infinite linear;
                }
                .animate-pulse-slow {
                    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
              `}</style>
        </div>
    );
}