import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, MapPin, Users, Mail, Phone, User, PhoneCall, ChevronDown, ArrowLeft, Clock, Calendar } from 'lucide-react';
import { toast, Toaster } from "sonner";
import CountdownTimer from './CountdownTimer'; 

const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const API_KEY = 'x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ';
const DEFAULT_DOMAIN = 'https://www.holidaysplanners.com';

export default function UnifiedEnquiryModal({ 
  trip, 
  isOpen, 
  onClose, 
  popupSettings, 
  popupType, 
  selectedTrips = [], 
  offersConfig,
  pageName = null,
  pageSlug = null 
}) {
  const [formData, setFormData] = useState({
    destination: '',
    full_name: '',
    contact_number: '',
    email: '',
    adults: 2,
    departure_city: 'Web Modal Lead',
    travel_date: new Date().toISOString().split('T')[0],
    is_flexible: false,
    hotel_category: '3 Star',
    additional_comments: '',
    domain_name: DEFAULT_DOMAIN
  });

  const [submittedName, setSubmittedName] = useState('');
  const [submittedDest, setSubmittedDest] = useState('');
  const [showCustomDestination, setShowCustomDestination] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (trip) {
        setFormData(prev => ({
          ...prev,
          destination: trip.trip_title || trip.custom_title || trip.title || ''
        }));
      } else {
        setFormData(prev => ({ ...prev, destination: '' }));
      }
      setShowCustomDestination(false);
      setShowSuccess(false);
    }
  }, [trip, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'destination' && value === 'other_custom') {
      setShowCustomDestination(true);
      setFormData(prev => ({ ...prev, destination: '' }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleClose = () => {
    setShowSuccess(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmittedName(formData.full_name.split(' ')[0]); 
    setSubmittedDest(formData.destination);

    let leadSource = pageName ? `Landing Page: ${pageName}` : 'Website Enquiry';

    const submissionData = {
      ...formData,
      travel_date: formData.is_flexible ? "Flexible" : formData.travel_date,
      departure_city: leadSource,
      source: leadSource
    };

    try {
      const response = await fetch(`${API_BASE_URL}/enquires`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify(submissionData)
      });
      if (!response.ok) throw new Error('Failed to submit');
      
      if (window.gtag) {
        window.gtag('event', 'ads_conversion_submit_lead_form', {
          destination: formData.destination,
          lead_source: leadSource,
          page_name: pageName || 'Direct Website'
        });
      }
      
      setShowSuccess(true);
      toast.success("Request sent successfully!");
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    if (trip) return `${trip.trip_title || trip.custom_title || trip.title}`;
    if (pageName) return pageName;
    return popupSettings?.[popupType]?.title || 'Plan Your Dream Trip';
  };

  const shouldShowCountdown = offersConfig?.header?.enabled && 
                              offersConfig?.end_date && 
                              new Date(offersConfig.end_date) > new Date();

  return (
    <>
      <Toaster richColors position="top-center" style={{ zIndex: 99999 }} />
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            />

            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-[380px] rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[95vh]"
            >
              {showSuccess ? (
                <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[350px]">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                    <PhoneCall className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Thanks, {submittedName}!</h3>
                  <p className="text-slate-500 mb-6 text-sm">Request received for <span className="text-[#FF6B35] font-bold">{submittedDest}</span>. Our team will call you shortly.</p>
                  <Button onClick={handleClose} className="w-full bg-slate-900 text-white rounded-lg h-11">Close</Button>
                </div>
              ) : (
                <>
                  <div className="relative bg-gradient-to-br from-[#FF6B35] to-[#FF9F00] px-5 py-4 text-white shrink-0">
                    <button onClick={handleClose} className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className={shouldShowCountdown ? 'mb-3' : 'mb-0'}>
                      <p className="text-[10px] uppercase tracking-wider font-bold opacity-80 mb-0.5">Enquiry For</p>
                      <h2 className="text-lg font-bold leading-tight line-clamp-1">{getTitle()}</h2>
                    </div>
                    {shouldShowCountdown && (
                      <div className="bg-black/10 border border-white/20 rounded-lg p-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest"><Clock className="w-3 h-3" /> Offer Ends In</span>
                        <div className="scale-75 origin-right"><CountdownTimer endDate={offersConfig.end_date} compact={true} /></div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><MapPin className="w-3 h-3" /> Destination</label>
                        {trip ? (
                          <Input value={formData.destination} readOnly className="bg-slate-50 border-slate-200 h-9 text-sm font-medium text-slate-600 focus-visible:ring-0" />
                        ) : !showCustomDestination ? (
                          <div className="relative">
                            <select name="destination" value={formData.destination} onChange={handleChange} required className="w-full h-9 pl-3 pr-8 rounded-md border border-slate-200 bg-white text-sm font-medium focus:ring-1 focus:ring-[#FF6B35] appearance-none outline-none">
                              <option value="">Select destination</option>
                              {selectedTrips.map((t, i) => <option key={i} value={t.trip_title || t.custom_title}>{t.trip_title || t.custom_title}</option>)}
                              <option value="other_custom" className="text-[#FF6B35] font-bold">+ Other Destination</option>
                            </select>
                            <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <Input name="destination" value={formData.destination} onChange={handleChange} placeholder="Type destination..." autoFocus required className="h-9 text-sm" />
                            <button type="button" onClick={() => setShowCustomDestination(false)} className="text-[10px] text-blue-600 hover:underline flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Back to list</button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><User className="w-3 h-3" /> Full Name</label>
                        <Input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Enter your name" required className="h-9 text-sm" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</label>
                          <Input type="tel" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="Phone number" required className="h-9 text-sm" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Users className="w-3 h-3" /> Pax</label>
                          <Input type="number" name="adults" value={formData.adults} onChange={handleChange} min="1" required className="h-9 text-sm text-center" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 items-end">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Calendar className="w-3 h-3" /> Travel Date</label>
                          <Input type="date" name="travel_date" disabled={formData.is_flexible} value={formData.travel_date} onChange={handleChange} className={`h-9 text-xs ${formData.is_flexible ? 'opacity-30' : 'opacity-100'}`} />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer pb-2.5 select-none">
                          <input type="checkbox" name="is_flexible" checked={formData.is_flexible} onChange={handleChange} className="w-3.5 h-3.5 rounded border-slate-300 text-[#FF6B35] focus:ring-0" />
                          <span className="text-[11px] font-medium text-slate-500">I'm Flexible</span>
                        </label>
                      </div>

                      <div className="space-y-1 pb-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Mail className="w-3 h-3" /> Email Address</label>
                        <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" required className="h-9 text-sm" />
                      </div>

                      <Button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
                        {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-3.5 h-3.5" /> Get Free Quote</>}
                      </Button>
                      <p className="text-center text-[9px] text-slate-400">By clicking, you agree to be contacted for travel quotes.</p>
                    </form>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}