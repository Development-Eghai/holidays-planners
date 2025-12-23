import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Calendar, MapPin, CheckCircle, XCircle, FileText, 
  Info, Send, Clock, ChevronRight, Star, AlertCircle 
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function TripModal({ trip, isOpen, onClose, onEnquire, primaryColor = '#FF6B35' }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!trip) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'inclusions', label: 'Inclusions', icon: CheckCircle },
    { id: 'policies', label: 'Policies', icon: FileText },
  ];

  // Helper to split semicolon-separated strings safely
  const getList = (str) => (str ? str.split(';').filter(i => i.trim()) : []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[50000] flex items-center justify-center p-4 sm:p-6">
          
          {/* Backdrop (Dark overlay) */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            // Fixed height logic: max-h-[90vh] ensures it fits on screen, flex-col organizes sections
            className="bg-white w-full max-w-5xl h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-50"
          >
            
            {/* --- 1. HEADER (Fixed) --- */}
            <div className="relative h-48 sm:h-64 shrink-0 bg-slate-100">
              <img 
                src={trip.hero_image || trip.images?.[0]} 
                alt={trip.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-all border border-white/20 z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-white/10">
                    <MapPin className="w-3.5 h-3.5" /> {trip.destination_type || 'Destination'}
                  </span>
                  <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-white/10">
                    <Clock className="w-3.5 h-3.5" /> {trip.days} Days / {trip.nights} Nights
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-md">
                  {trip.title}
                </h2>
              </div>
            </div>

            {/* --- 2. TABS NAVIGATION (Fixed) --- */}
            <div className="flex border-b border-slate-100 bg-white shrink-0 overflow-x-auto no-scrollbar px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-[3px] mr-2 ${
                    activeTab === tab.id 
                      ? 'text-slate-900' 
                      : 'text-slate-500 border-transparent hover:text-slate-700'
                  }`}
                  style={{ 
                    borderColor: activeTab === tab.id ? primaryColor : 'transparent',
                    color: activeTab === tab.id ? primaryColor : ''
                  }}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* --- 3. SCROLLABLE CONTENT AREA --- */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#F8FAFC]">
              
              {/* OVERVIEW CONTENT */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold mb-3 text-slate-900">About This Trip</h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line text-[15px]">
                      {trip.overview}
                    </p>
                  </div>
                  
                  {trip.highlights && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <h3 className="text-lg font-bold mb-4 text-slate-900 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Trip Highlights
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {getList(trip.highlights).map((highlight, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-sm font-medium text-slate-700">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ITINERARY CONTENT */}
              {activeTab === 'itinerary' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {trip.itinerary?.length > 0 ? (
                    <div className="relative pl-4 sm:pl-6 border-l-2 border-slate-200 space-y-8 ml-2">
                      {trip.itinerary.map((day, idx) => (
                        <div key={idx} className="relative">
                          {/* Timeline Dot */}
                          <div 
                            className="absolute -left-[29px] sm:-left-[37px] top-0 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center font-bold text-xs text-white"
                            style={{ backgroundColor: primaryColor }}
                          >
                            {day.day_number}
                          </div>
                          
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <h4 className="text-lg font-bold text-slate-900 mb-2">{day.title}</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">{day.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-400">
                      <Calendar className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      <p>Itinerary details coming soon.</p>
                    </div>
                  )}
                </div>
              )}

              {/* INCLUSIONS CONTENT */}
              {activeTab === 'inclusions' && (
                <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-xl border border-green-100">
                      <CheckCircle className="w-5 h-5" /> What's Included
                    </h3>
                    <ul className="space-y-4">
                      {getList(trip.inclusions).length > 0 ? (
                        getList(trip.inclusions).map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-sm text-slate-600 font-medium">{item}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-slate-400 text-sm italic">No inclusions listed.</li>
                      )}
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                      <XCircle className="w-5 h-5" /> What's Excluded
                    </h3>
                    <ul className="space-y-4">
                      {getList(trip.exclusions).length > 0 ? (
                        getList(trip.exclusions).map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="mt-1 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                              <X className="w-3 h-3 text-red-500" />
                            </div>
                            <span className="text-sm text-slate-600 font-medium">{item}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-slate-400 text-sm italic">No exclusions listed.</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* POLICIES CONTENT */}
              {activeTab === 'policies' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {trip.policies?.length > 0 ? (
                    trip.policies.map((policy, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-slate-400" /> {policy.title}
                        </h4>
                        <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line pl-4 border-l-2 border-slate-100">
                          {policy.content}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-400">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      <p>Policy details unavailable.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* --- 4. FOOTER (Fixed Bottom) --- */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-center shrink-0 z-20 gap-4 sm:gap-0">
              <div className="flex flex-col">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-0.5">Total Price</p>
                <div className="text-2xl font-extrabold text-slate-900" style={{ color: primaryColor }}>
                  {trip.pricing?.customized?.final_price 
                    ? `₹${trip.pricing.customized.final_price.toLocaleString()}` 
                    : (trip.price ? `₹${trip.price.toLocaleString()}` : 'Price on Request')}
                </div>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  onClick={onClose} 
                  className="flex-1 sm:flex-none rounded-xl font-bold border-slate-200 h-12"
                >
                  Close
                </Button>
                <Button 
                  onClick={() => { onClose(); onEnquire(trip); }} 
                  className="flex-1 sm:flex-none px-8 h-12 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95"
                  style={{ 
                    background: `linear-gradient(to right, ${primaryColor}, ${primaryColor})` // Solid or Gradient
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Query
                </Button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
      
      {/* Utility CSS for hiding scrollbars in tabs */}
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </AnimatePresence>
  );
}