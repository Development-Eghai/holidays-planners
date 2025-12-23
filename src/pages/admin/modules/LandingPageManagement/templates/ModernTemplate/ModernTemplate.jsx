import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

// Components
import LandingPageHeader from './components/LandingPageHeader';
import HeroSection from './components/HeroSection';
import TripCard from './components/TripCard';
import TripModal from './components/TripModal';
import BookingNotification from './components/BookingNotification';
import ContactForm from './components/ContactForm';
import TestimonialCarousel from './components/TestimonialCarousel';
import FloatingCTA from './components/FloatingCTA';
import UnifiedEnquiryModal from './components/UnifiedEnquiryModal';
import PopupManager from './components/Popupmanager';
import TrustBadges from './components/TrustBadges';
import CountdownTimer from './components/CountdownTimer';
import FAQSection from './components/FAQSection';
import AttractionsSection from './components/AttractionsSection';
import TravelGuidelinesSection from './components/TravelGuidelinesSection';
import PromoMediaSection from './components/PromoMediaSection';
import Footer from '../../../../../../components/layout/Footer'; // Common website footer
import { Badge } from '@/components/ui/badge';
import { Flame, TrendingUp } from 'lucide-react';

const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const API_KEY = 'x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ';

export default function ModernTemplate({ pageData }) {
  const [selectedTrip, setSelectedTrip] = useState(null); // For Enquiry
  const [viewDetailsTrip, setViewDetailsTrip] = useState(null); // For View Details Modal
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const tripsRef = useRef(null);

  // Fetch trips based on selected trip IDs
  useEffect(() => {
    const fetchTrips = async () => {
      if (!pageData?.packages?.selected_trips || pageData.packages.selected_trips.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/trips`, {
          headers: { 'x-api-key': API_KEY }
        });
        const data = await response.json();
        const allTrips = data.data || data;

        // Filter trips that are in selected_trips
        const selectedTripIds = pageData.packages.selected_trips.map(st => st.trip_id);
        const filteredTrips = allTrips.filter(trip => selectedTripIds.includes(trip.id));

        // Merge with badge information from pageData
        const enrichedTrips = filteredTrips.map(trip => {
          const selectedTripData = pageData.packages.selected_trips.find(st => st.trip_id === trip.id);
          return {
            ...trip,
            badge: selectedTripData?.badge || '',
            custom_title: selectedTripData?.trip_title || trip.title,
            custom_price: selectedTripData?.price || null
          };
        });

        setTrips(enrichedTrips);
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [pageData]);

  const primaryColor = '#FF6B35';
  const secondaryColor = '#FFB800';

  const scrollToTrips = () => {
    const element = document.getElementById('packages');
    if(element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // Handler: Open Enquiry Form (for specific trip or general)
  const handleEnquire = (trip) => {
    setSelectedTrip(trip);
    setIsEnquiryOpen(true);
  };

  // Handler: Open View Details Modal
  const handleViewDetails = (trip) => {
    setViewDetailsTrip(trip);
  };

  // Handler: Hero "Get Quote"
  const handleHeroGetQuote = () => {
    setSelectedTrip(null);
    setIsEnquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{pageData?.seo?.meta_title || pageData?.page_name || 'Travel Landing Page'}</title>
        <meta name="description" content={pageData?.seo?.meta_description || pageData?.hero?.description || ''} />
        <meta name="keywords" content={pageData?.seo?.meta_tags || ''} />
      </Helmet>

      {/* Popup Manager for Entry/Exit/Idle popups */}
      <PopupManager offersConfig={pageData?.offers} />

      {/* Live Booking Notifications */}
      <BookingNotification />
      
      {/* Floating CTA */}
      <FloatingCTA 
        settings={pageData?.company || {}} 
        offersConfig={pageData?.offers}
        onOpenEnquiry={handleHeroGetQuote}
      />
      
      {/* Enquiry Modal (Contact Form Popup) */}
      <UnifiedEnquiryModal 
        trip={selectedTrip}
        isOpen={isEnquiryOpen}
        onClose={() => {
          setIsEnquiryOpen(false);
          setSelectedTrip(null);
        }}
        settings={pageData?.company || {}}
        popupSettings={null}
        popupType={null}
      />

      {/* Detail View Modal (Trip Details) */}
      <TripModal 
        trip={viewDetailsTrip}
        isOpen={!!viewDetailsTrip}
        onClose={() => setViewDetailsTrip(null)}
        onEnquire={handleEnquire}
        primaryColor={primaryColor}
      />

      {/* HEADER */}
      <LandingPageHeader 
        companySettings={pageData?.company} 
        promoData={pageData?.offers?.header} 
        primaryColor={primaryColor} 
        secondaryColor={secondaryColor} 
      />

      {/* Hero Section (ID: hero) */}
      <div id="hero">
        <HeroSection 
          onExploreClick={scrollToTrips} 
          onGetQuote={handleHeroGetQuote}
          heroData={pageData?.hero}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      </div>

      {/* Trust Badges (ID: about) */}
      <div id="about">
        <TrustBadges />
      </div>

      {/* Flash Sale Banner */}
      {pageData?.offers?.header?.enabled && pageData?.offers?.end_date && (
        <section className="relative overflow-hidden">
          <div 
            className="py-12 relative"
            style={{
              background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
            }}
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-white/10"
              style={{ width: '50%', transform: 'skewX(-20deg)' }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Flame className="w-12 h-12 text-white" />
                  </motion.div>
                  <div className="text-white">
                    <h3 className="text-2xl md:text-3xl font-bold">
                      {pageData?.offers?.header?.text || 'FLASH SALE - 40% OFF'}
                    </h3>
                    <p className="text-white/80">Limited time offer on all destinations!</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-white text-center">
                    <div className="text-sm opacity-80">Sale ends in:</div>
                    <CountdownTimer endDate={new Date(pageData.offers.end_date)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trips Section (ID: packages) */}
      {pageData?.packages?.show_section && (
        <section id="packages" ref={tripsRef} className="py-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{
                  backgroundColor: `${primaryColor}15`,
                  color: primaryColor
                }}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">Trending Destinations</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                {pageData?.packages?.section_title || 'Handpicked'} 
                <span 
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                  }}
                >
                  {' '}Adventures
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                {pageData?.packages?.section_subtitle || 'Explore our most popular destinations with exclusive deals.'}
              </p>
            </motion.div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading amazing destinations...</p>
              </div>
            ) : trips.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trips.map((trip, index) => (
                  <TripCard 
                    key={trip.id} 
                    trip={trip} 
                    index={index}
                    onEnquire={handleEnquire}
                    onViewDetails={handleViewDetails}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p className="text-xl">No trips available at the moment.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Promo Media Section (Mid Section) */}
      <PromoMediaSection data={pageData?.offers?.mid_section} />

      {/* Attractions Section (ID: attractions) */}
      {pageData?.attractions?.show_section && pageData?.attractions?.items?.length > 0 && (
        <div id="attractions">
          <AttractionsSection 
            attractions={pageData.attractions.items} 
            sectionTitle={pageData.attractions.section_title}
            sectionSubtitle={pageData.attractions.section_subtitle}
            primaryColor={primaryColor} 
            secondaryColor={secondaryColor} 
          />
        </div>
      )}

      {/* Testimonials */}
      {pageData?.testimonials?.show_section && pageData?.testimonials?.items?.length > 0 && (
        <TestimonialCarousel 
          testimonials={pageData.testimonials.items}
          sectionTitle={pageData.testimonials.section_title}
          sectionSubtitle={pageData.testimonials.section_subtitle}
        />
      )}

      {/* Travel Guidelines */}
      {pageData?.travel_guidelines?.show_section && pageData?.travel_guidelines?.description && (
        <TravelGuidelinesSection 
          content={pageData.travel_guidelines.description} 
          sectionTitle={pageData.travel_guidelines.section_title}
          sectionSubtitle={pageData.travel_guidelines.section_subtitle}
          primaryColor={primaryColor} 
          secondaryColor={secondaryColor} 
        />
      )}

      {/* FAQ Section */}
      {pageData?.faqs?.show_section && pageData?.faqs?.items?.length > 0 && (
        <FAQSection 
          faqs={pageData.faqs.items} 
          sectionTitle={pageData.faqs.section_title}
          sectionSubtitle={pageData.faqs.section_subtitle}
          primaryColor={primaryColor} 
          secondaryColor={secondaryColor} 
        />
      )}

      {/* Contact Form (ID: contact) */}
      <div id="contact">
        <ContactForm 
          settings={pageData?.company || {}} 
          primaryColor={primaryColor} 
          secondaryColor={secondaryColor}
          selectedTrips={pageData?.packages?.selected_trips || []}
        />
      </div>

      {/* Footer - Using Common Website Footer */}
      <Footer 
        ctaType="none"
        ctaName=""
        ctaTitle=""
        ctaSubtitle=""
      />
    </div>
  );
}