// src/pages/admin/modules/LandingPageManagement/templates/ModernTemplate.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Play, Map, Star, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { EnquiryModal, TripDetailModal, AttractionModal } from './TemplateComponents';

export default function ModernTemplate({ pageData }) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [tripModal, setTripModal] = useState({ open: false, id: null });
  const [attractionModal, setAttractionModal] = useState({ open: false, data: null });
  const [selectedDestination, setSelectedDestination] = useState('');

  const handleEnquire = (dest = '') => {
    setSelectedDestination(dest);
    setEnquiryOpen(true);
    setTripModal({ open: false, id: null });
  };

  const { hero, company, packages, attractions, gallery, testimonials } = pageData;

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="font-sans bg-slate-50 min-h-screen selection:bg-rose-500 selection:text-white">
      {/* Floating Header */}
      <motion.nav 
        initial={{ y: -100 }} animate={{ y: 0 }} 
        className="fixed top-6 left-0 right-0 z-40 flex justify-center"
      >
        <div className="bg-white/80 backdrop-blur-xl px-8 py-3 rounded-full shadow-2xl border border-white/20 flex items-center gap-8">
          <span className="font-black text-xl tracking-tighter">{company.name}</span>
          <div className="h-4 w-[1px] bg-slate-300 hidden md:block"></div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
             <a href="#trips" className="hover:text-black">Trips</a>
             <a href="#gallery" className="hover:text-black">Moments</a>
             <a href="#reviews" className="hover:text-black">Stories</a>
          </div>
          <button onClick={() => handleEnquire()} className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform">
            Start Journey
          </button>
        </div>
      </motion.nav>

      {/* Immersive Hero */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          {hero.background_type === 'video' && hero.background_videos.length > 0 ? (
            <video src={hero.background_videos[0]} autoPlay muted loop className="w-full h-full object-cover scale-110" />
          ) : (
            <motion.img 
              initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 10 }}
              src={hero.background_images?.[0]} className="w-full h-full object-cover" alt="Hero" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-slate-50"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.h1 variants={fadeInUp} className="text-6xl md:text-9xl font-black text-white mb-6 drop-shadow-2xl tracking-tighter leading-none">
              {hero.title.split(' ').map((word, i) => <span key={i} className="inline-block mr-4">{word}</span>)}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto mb-10 backdrop-blur-sm bg-black/10 p-4 rounded-xl">
              {hero.description}
            </motion.p>
            <motion.div variants={fadeInUp} className="flex gap-4 justify-center">
              <button onClick={() => document.getElementById('trips').scrollIntoView({ behavior: 'smooth' })} className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors">
                Explore Trips <ArrowUpRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trips Horizontal Scroll */}
      {packages.show_section && (
        <section id="trips" className="py-32 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-5xl font-bold text-slate-900 mb-2 tracking-tighter">{packages.section_title}</h2>
              <p className="text-slate-500">{packages.section_subtitle}</p>
            </div>
            <div className="hidden md:block text-sm font-bold uppercase tracking-widest text-slate-400">Scroll to explore</div>
          </div>
          
          <div className="flex gap-8 overflow-x-auto pb-12 snap-x px-4 -mx-4 no-scrollbar">
            {packages.selected_trips.map((trip, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex-shrink-0 w-80 md:w-96 snap-center bg-white rounded-3xl p-3 shadow-xl hover:shadow-2xl transition-all border border-slate-100 group"
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 relative">
                  <img src={trip.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button onClick={() => setTripModal({ open: true, id: trip.trip_id })} className="bg-white/20 backdrop-blur text-white border border-white/50 px-6 py-2 rounded-full font-bold">Quick View</button>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {trip.price}
                  </div>
                </div>
                <div className="px-2 pb-2">
                   <h3 className="font-bold text-xl mb-1 truncate">{trip.trip_title}</h3>
                   <div className="flex justify-between items-center mt-4">
                     <span className="text-xs text-slate-400 font-bold uppercase">{trip.badge || 'Featured'}</span>
                     <button onClick={() => handleEnquire(trip.trip_title)} className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors">
                       <ArrowUpRight className="w-5 h-5" />
                     </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Attractions Masonry */}
      {attractions.show_section && (
        <section className="py-20 bg-black text-white rounded-t-[3rem]">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold mb-16 text-center">{attractions.section_title}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {attractions.items.map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -10 }}
                  className="relative group cursor-pointer"
                  onClick={() => setAttractionModal({ open: true, data: item })}
                >
                  <div className="aspect-square rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                    <img src={item.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <p className="text-xs text-white/60 line-clamp-1 mt-1">Tap to discover</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <h2 className="text-white text-3xl font-bold mb-6">{company.name}</h2>
        <div className="flex justify-center gap-6 mb-8">
          <Instagram className="w-5 h-5 hover:text-white cursor-pointer" />
          <Facebook className="w-5 h-5 hover:text-white cursor-pointer" />
          <Twitter className="w-5 h-5 hover:text-white cursor-pointer" />
        </div>
        <p className="text-sm">Designed for the modern explorer.</p>
      </footer>

      <EnquiryModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} tripTitle={selectedDestination} />
      <TripDetailModal isOpen={tripModal.open} onClose={() => setTripModal({ open: false, id: null })} tripId={tripModal.id} onEnquire={handleEnquire} />
      <AttractionModal isOpen={attractionModal.open} onClose={() => setAttractionModal({ open: false, data: null })} data={attractionModal.data} />
    </div>
  );
}