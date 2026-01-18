import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone, Mail, MapPin, Calendar, Users, 
    CheckCircle, ChevronDown, ChevronUp, 
    Plane, Hotel, Camera, Utensils, Car, 
    Menu, X, Star, ShieldCheck, Clock, Heart,
    Percent, Award, ThumbsUp, Wallet
} from 'lucide-react';
import { toast, Toaster } from "sonner";

// --- COMPONENTS ---
import UnifiedEnquiryModal from '../ModernTemplate/components/UnifiedEnquiryModal';
import BookingNotification from '../ModernTemplate/components/BookingNotification';
import PopupManager from '../ModernTemplate/components/Popupmanager';
import TestimonialCarousel from '../ModernTemplate/components/TestimonialCarousel';
import FloatingCTA from '../ModernTemplate/components/FloatingCTA';
import Footer from '../../../../../../components/layout/Footer';

// --- CONSTANTS ---
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Hero Form State
    const [heroFormData, setHeroFormData] = useState({
        destination: pageData?.page_name || '',
        full_name: '',
        contact_number: '',
        email: '',
        city: '',
        adults: 2,
        departure_city: 'Website Form',
        travel_date: new Date().toISOString().split('T')[0],
        domain_name: DEFAULT_DOMAIN
    });

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/trips`, { headers: { 'x-api-key': API_KEY } });
                const data = await res.json();
                const fetchedTrips = data.data || data;
                setAllTrips(fetchedTrips);

                if (pageData?.packages?.selected_trips) {
                    const selected = fetchedTrips.filter(t => 
                        pageData.packages.selected_trips.some(st => st.trip_id === t.id)
                    );
                    setMainPackages(selected);
                } else {
                    setMainPackages(fetchedTrips.slice(0, 6));
                }
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        fetchTrips();
    }, [pageData]);

    // --- HANDLERS ---
    const handleHeroSubmit = async (e) => {
        e.preventDefault();
        if (heroSubmitting) return;
        setHeroSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/enquires`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
                body: JSON.stringify({ ...heroFormData, source: `Landing Page: ${pageData?.slug}` })
            });
            if (res.ok) {
                toast.success(`Thank you ${heroFormData.full_name}! We will contact you soon.`);
                setHeroFormData({ ...heroFormData, full_name: '', contact_number: '', email: '', city: '' });
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } catch (err) { toast.error("Submission failed. Check connection."); } 
        finally { setHeroSubmitting(false); }
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

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    // --- TRIP CARD COMPONENT ---
    const TripCard = ({ trip }) => {
        const isExpanded = expandedTrip === trip.id;
        const price = getTripPrice(trip);
        
        // --- INCLUSIONS LOGIC ---
        const searchText = `${trip.title} ${trip.inclusions} ${trip.highlights}`.toLowerCase();
        const checkActive = (keywords) => keywords.some(k => searchText.includes(k));

        const amenities = [
            { label: 'Flight', icon: Plane, active: checkActive(['flight', 'airfare', 'ticket']), color: 'text-blue-600', bg: 'bg-blue-100', shadow: 'shadow-blue-200' },
            { label: 'Hotels', icon: Hotel, active: checkActive(['hotel', 'stay', 'accommodation', 'resort']), color: 'text-purple-600', bg: 'bg-purple-100', shadow: 'shadow-purple-200' },
            { label: 'Sightseeing', icon: Camera, active: checkActive(['sightseeing', 'tour', 'visit']), color: 'text-pink-600', bg: 'bg-pink-100', shadow: 'shadow-pink-200' },
            { label: 'Meals', icon: Utensils, active: checkActive(['meal', 'breakfast', 'dinner', 'food']), color: 'text-orange-600', bg: 'bg-orange-100', shadow: 'shadow-orange-200' },
            { label: 'Transfers', icon: Car, active: checkActive(['transfer', 'cab', 'taxi', 'drive', 'volvo']), color: 'text-emerald-600', bg: 'bg-emerald-100', shadow: 'shadow-emerald-200' },
        ];

        return (
            <div className="bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden flex flex-col h-full relative group">
                <div className="relative h-56 overflow-hidden">
                    <img 
                        src={trip.hero_image || trip.image} 
                        alt={trip.title} 
                        loading="lazy"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                    <div className="absolute bottom-[-20px] right-4 bg-white p-2 rounded-full shadow-lg border-2 border-orange-500 z-10 w-12 h-12 flex items-center justify-center animate-bounce-slow">
                        <Star className="text-orange-500 w-6 h-6 fill-current" />
                    </div>
                </div>

                <div className="p-4 pt-8 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold text-slate-900 leading-tight mb-2 min-h-[56px] line-clamp-2">
                        {trip.title}
                    </h2>
                    <h3 className="text-sm font-semibold text-slate-500 mb-4 border-b border-gray-100 pb-2">
                        Duration: <span className="text-slate-900 font-bold">{trip.days} Days / {trip.nights} Nights</span>
                    </h3>

                    {/* Amenities Grid */}
                    <div className="flex justify-between items-center mb-5 px-1 bg-slate-50 py-3 rounded-lg border border-slate-100">
                        {amenities.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1 relative">
                                <div className={`p-2 rounded-full transition-all duration-300 ${
                                    item.active 
                                    ? `${item.bg} ${item.color} shadow-lg ${item.shadow} scale-110 ring-2 ring-white` 
                                    : 'bg-gray-100 text-gray-300 grayscale opacity-40'
                                }`}>
                                    <item.icon size={16} strokeWidth={item.active ? 2.5 : 2} />
                                </div>
                                <span className={`text-[9px] uppercase font-bold tracking-wide ${item.active ? 'text-slate-800' : 'text-slate-300'}`}>{item.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-0 mb-4 flex-1">
                        <h5 className="text-sm font-bold uppercase text-slate-800 mb-2">Highlights:</h5>
                        <ul className="space-y-2">
                            {trip.highlights ? (
                                trip.highlights.split(';').slice(0, 3).map((h, i) => (
                                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                        <CheckCircle size={16} className="text-orange-500 shrink-0 mt-0.5" />
                                        <span className="line-clamp-2 leading-snug">{h.trim()}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="text-sm text-slate-500">Day wise details available on request.</li>
                            )}
                        </ul>
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-2 border-t border-gray-100 pt-2">
                                    <ul className="space-y-2">
                                         {trip.highlights ? (
                                            trip.highlights.split(';').slice(3).map((h, i) => (
                                                <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                                     <CheckCircle size={16} className="text-orange-500 shrink-0 mt-0.5" />
                                                    <span>{h.trim()}</span>
                                                </li>
                                            ))
                                        ) : null}
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <button onClick={() => setExpandedTrip(isExpanded ? null : trip.id)} className="w-full text-center mt-3 text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 transition-colors">
                            {isExpanded ? 'Show Less' : 'View More Details'}
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                    </div>

                    <div className="flex items-center justify-between mt-auto border-t border-dashed border-gray-300 pt-4">
                        <div className="flex flex-col">
                            {price > 0 && <span className="text-xs text-slate-400 line-through decoration-red-500 decoration-1">₹{(price * 1.25).toLocaleString()}</span>}
                            <span className="text-2xl font-black text-slate-900 leading-none">{price > 0 ? `₹${price.toLocaleString()}` : 'On Request'}</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Per Person</span>
                        </div>
                        
                        <button 
                            onClick={() => { setSelectedTrip(trip); setIsEnquiryOpen(true); }}
                            className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-sm font-bold px-6 py-3 rounded shadow-md hover:shadow-xl transition-all animate-heartbeat group/btn"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                ENQUIRE NOW <ChevronDown className="rotate-[-90deg]" size={16} />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full min-h-screen bg-white font-sans text-slate-800">
            <Toaster position="top-right" />
            <PopupManager pageName={pageData?.page_name} pageSlug={pageData?.slug} />
            <BookingNotification pageData={pageData} />

            {/* Custom Styles */}
            <style>
                {`
                    /* Hide Sticky WhatsApp from Footer on this page only */
                    footer + div a[href*="wa.me"], 
                    a[href*="wa.me"].fixed.right-6.bottom-6.z-50 {
                        display: none !important;
                    }
                    
                    @keyframes heartbeat {
                        0% { transform: scale(1); }
                        14% { transform: scale(1.05); }
                        28% { transform: scale(1); }
                        42% { transform: scale(1.05); }
                        70% { transform: scale(1); }
                    }
                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                        100% { transform: translateY(0px); }
                    }
                    @keyframes wiggle {
                        0%, 100% { transform: rotate(-3deg); }
                        50% { transform: rotate(3deg); }
                    }
                    .animate-heartbeat {
                        animation: heartbeat 3s infinite;
                    }
                    .animate-bounce-slow {
                        animation: bounce 3s infinite;
                    }
                    .animate-float {
                        animation: float 2s ease-in-out infinite;
                    }
                    .animate-wiggle {
                        animation: wiggle 2s ease-in-out infinite;
                    }
                `}
            </style>

            {/* --- TOP BAR --- */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50 h-20 shadow-md">
                <div className="max-w-7xl mx-auto px-4 h-full">
                    <div className="flex justify-between items-center h-full">
                        <div className="h-16 w-48 flex-shrink-0 flex items-center">
                            <img src="/holidaysplanners-logo.png" alt="Holidays Planners" className="h-full w-auto object-contain" />
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <a href={`tel:${pageData?.company?.contact}`} className="flex items-center gap-3 group">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Phone size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none mb-1">Call Us</span>
                                    <span className="text-sm font-black text-slate-800 group-hover:text-blue-600 leading-none">
                                        {pageData?.company?.contact || '+91-9876543210'}
                                    </span>
                                </div>
                            </a>
                            <a href={`mailto:${pageData?.company?.email}`} className="flex items-center gap-3 group">
                                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <Mail size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none mb-1">Email Us</span>
                                    <span className="text-sm font-black text-slate-800 group-hover:text-green-600 leading-none">
                                        {pageData?.company?.email || 'info@holidaysplanners.com'}
                                    </span>
                                </div>
                            </a>
                            <button onClick={() => setIsEnquiryOpen(true)} className="bg-gradient-to-r from-[#FF6B35] to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-orange-500/40 transition-all transform hover:-translate-y-0.5 animate-pulse">
                                Get Quote
                            </button>
                        </div>
                        <button className="md:hidden p-2 text-slate-700" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="md:hidden bg-white border-t border-gray-100 overflow-hidden shadow-xl">
                            <div className="flex flex-col p-4 gap-4">
                                <a href={`tel:${pageData?.company?.contact}`} className="flex items-center gap-3 text-slate-800 font-bold border-b border-slate-50 pb-2"><Phone size={18} className="text-blue-600" /> {pageData?.company?.contact}</a>
                                <a href={`mailto:${pageData?.company?.email}`} className="flex items-center gap-3 text-slate-800 font-bold border-b border-slate-50 pb-2"><Mail size={18} className="text-green-600" /> {pageData?.company?.email}</a>
                                <button onClick={() => { setIsEnquiryOpen(true); setIsMobileMenuOpen(false); }} className="bg-orange-600 text-white py-3 rounded font-bold uppercase w-full">Enquire Now</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* --- HERO SECTION --- */}
            <section id="hero" className="relative bg-slate-900 overflow-hidden">
                <div className="absolute inset-0">
                    <img src={pageData?.hero?.background_images?.[0] || 'https://images.unsplash.com/photo-1626621341517-b13d52481e28?q=80&w=2000'} className="w-full h-full object-cover opacity-30" alt="Hero" loading="eager" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 relative z-10">
                    <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                        <div className="w-full md:w-2/3 text-white pt-4">
                            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider mb-6 shadow-lg shadow-orange-500/20">
                                    <Percent size={14} strokeWidth={3} /> <span>Special Festival Offers</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight text-white drop-shadow-lg">
                                    Welcome to <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">{pageData?.page_name}</span>
                                </h1>
                                <ul className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
                                    {['SHIMLA', 'MANALI', 'DALHOUSIE', 'DHARAMSHALA', 'KINNAUR', 'SPITI'].map(place => (
                                        <li key={place} className="flex items-center gap-2 text-sm font-bold text-slate-200">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,1)]"></div> {place}
                                        </li>
                                    ))}
                                </ul>
                                <div className="border-l-4 border-orange-500 pl-6 py-2 bg-white/5 backdrop-blur-sm rounded-r-lg max-w-md">
                                    <h4 className="text-lg font-light text-slate-200">Grab the Exciting</h4>
                                    <h4 className="text-2xl font-bold text-white">Deals upto <span className="text-yellow-400">30% OFF</span></h4>
                                </div>
                            </motion.div>
                        </div>
                        <div className="w-full md:w-1/3">
                            <div className="bg-white rounded-xl shadow-2xl p-6 relative overflow-visible mt-6 md:mt-0">
                                <div className="absolute -top-4 -right-4 bg-red-600 text-white w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-slate-900 animate-pulse">
                                    <span className="text-xs font-bold">SALE</span><span className="text-sm font-black leading-none">30%</span>
                                </div>
                                <div className="bg-slate-800 text-white text-center py-3 -mx-6 -mt-6 mb-6 rounded-t-xl"><h3 className="font-bold uppercase tracking-wide text-sm">Get Free Quote</h3></div>
                                <form onSubmit={handleHeroSubmit} className="space-y-4">
                                    <input type="text" placeholder="Full Name" required className="w-full p-3 border border-gray-300 rounded text-slate-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm font-medium" value={heroFormData.full_name} onChange={e => setHeroFormData({...heroFormData, full_name: e.target.value})} />
                                    <input type="email" placeholder="Email Address" required className="w-full p-3 border border-gray-300 rounded text-slate-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm font-medium" value={heroFormData.email} onChange={e => setHeroFormData({...heroFormData, email: e.target.value})} />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="tel" placeholder="Mobile No." required className="w-full p-3 border border-gray-300 rounded text-slate-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm font-medium" value={heroFormData.contact_number} onChange={e => setHeroFormData({...heroFormData, contact_number: e.target.value})} />
                                         <input type="text" placeholder="City" required className="w-full p-3 border border-gray-300 rounded text-slate-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm font-medium" value={heroFormData.city} onChange={e => setHeroFormData({...heroFormData, city: e.target.value})} />
                                    </div>
                                    <select className="w-full p-3 border border-gray-300 rounded text-slate-900 focus:border-orange-500 outline-none text-sm font-medium bg-white" value={heroFormData.destination} onChange={e => setHeroFormData({...heroFormData, destination: e.target.value})}>
                                        <option value="">Choose Destination</option>
                                        {mainPackages.map(pkg => (<option key={pkg.id} value={pkg.title}>{pkg.title}</option>))}
                                        <option value="Other">Other Custom Package</option>
                                    </select>
                                    <button type="submit" disabled={heroSubmitting} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded uppercase tracking-wider transition-colors shadow-lg text-sm">{heroSubmitting ? 'Sending...' : 'Send Enquiry'}</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- ABOUT & WHY CHOOSE US (Animated Icons) --- */}
            <section id="about" className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
                        <div className="md:col-span-5 flex flex-col justify-center h-full">
                            <h2 className="text-3xl font-light text-slate-900 mb-4">About <span className="font-bold text-blue-600">{pageData?.company?.name || 'Holidays Planners'}</span></h2>
                            <p className="text-slate-600 text-justify leading-relaxed mb-6 text-base">
                                Are you ready to embark on a journey of a lifetime? Look no further! We specialize in curating extraordinary travel experiences to the breathtaking landscapes and cultural wonders. Get ready to explore the crown jewel of beauty with our exclusive tour packages. We provide the best price packages within your budget, ensuring a hassle-free experience.
                            </p>
                            <ul className="space-y-3 mb-8 font-bold text-slate-800 text-base">
                                {['Best Price Packages Within Your Budget', '24*7 Customer Support', 'Special Offer on every Package', 'Hassle Free Booking'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> {item}</li>
                                ))}
                            </ul>
                            <button onClick={() => setIsEnquiryOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow-lg font-bold uppercase text-xs tracking-wider animate-pulse transition-all w-fit">Call Now for customized packages</button>
                        </div>
                        <div className="md:col-span-7">
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <h1 className="text-2xl font-light mb-6 text-center text-slate-900">Why <span className="font-bold text-slate-900">Choose Us?</span></h1>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {[
                                        { title: 'Govt Approved', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50 shadow-green-100' },
                                        { title: 'Trusted Name', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 shadow-blue-100' },
                                        { title: 'Best B2B Service', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50 shadow-purple-100' },
                                        { title: 'Value for Money', icon: CheckCircle, color: 'text-orange-600', bg: 'bg-orange-50 shadow-orange-100' },
                                        { title: 'Custom Solutions', icon: CheckCircle, color: 'text-red-600', bg: 'bg-red-50 shadow-red-100' },
                                        { title: 'Personalized', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50 shadow-pink-100' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex flex-col items-center text-center group cursor-default p-2 rounded-xl">
                                            {/* Faster Floating Animation */}
                                            <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-3 shadow-md ${item.color} animate-float`}>
                                                <item.icon className="w-7 h-7" strokeWidth={1.5} />
                                            </div>
                                            <h4 className="text-sm font-bold text-slate-700 leading-tight">{item.title}</h4>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PACKAGES SECTION --- */}
            <section id="packages" className="py-12 bg-slate-50 relative">
                {/* Fixed Circle with Star Icon - Perfectly Centered & Positioned */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center z-10">
                    <Star className="text-orange-500 w-8 h-8 fill-current animate-wiggle" />
                </div>

                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">Best Selling Packages</h1>
                        <h5 className="text-slate-600 font-medium text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                            Explore the best of <span className="text-orange-600 font-bold">{pageData?.page_name}</span> with our guided tours.
                        </h5>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? <div className="col-span-3 text-center py-12 text-slate-500">Loading Packages...</div> : mainPackages.map((trip) => <TripCard key={trip.id} trip={trip} />)}
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS --- */}
            <section className="py-10 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <TestimonialCarousel testimonials={pageData?.testimonials?.items} />
                </div>
            </section>

            {/* --- WHY BOOK ONLINE (Animated Icons) --- */}
            <section className="py-12 bg-slate-100 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-slate-900">Why Book Online With Us?</h1>
                    </div>
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { title: 'SAVE TIME', desc: 'No need to surf multiple sites.', icon: Clock, color: 'text-blue-600' },
                            { title: 'MULTIPLE OPTIONS', desc: 'Get multiple personalised suggestions.', icon: ThumbsUp, color: 'text-green-600' },
                            { title: 'SAVE MONEY', desc: 'Compare & choose the best price.', icon: Wallet, color: 'text-orange-600' },
                            { title: 'TRUSTED NETWORK', desc: 'Reliable authentic travel guides.', icon: ShieldCheck, color: 'text-purple-600' }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 text-center border-b-4 border-transparent hover:border-orange-500 group">
                                {/* Faster Floating Animation */}
                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner animate-float">
                                    <item.icon size={24} className={item.color} />
                                </div>
                                <h4 className="font-black text-lg mb-2 text-slate-800">{item.title}</h4>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <button onClick={() => setIsEnquiryOpen(true)} className="bg-transparent border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-all text-sm">Start Planning Your Trip</button>
                    </div>
                </div>
            </section>

            <Footer ctaType="none" />

            {/* --- MODALS & CTA --- */}
            <UnifiedEnquiryModal trip={selectedTrip} isOpen={isEnquiryOpen} onClose={() => { setIsEnquiryOpen(false); setSelectedTrip(null); }} pageName={pageData?.page_name} pageSlug={pageData?.slug} />
            <FloatingCTA settings={pageData?.company || {}} offersConfig={pageData?.offers} onOpenEnquiry={() => setIsEnquiryOpen(true)} />
        </div>
    );
}