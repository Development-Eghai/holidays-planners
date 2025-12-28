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
  offersConfig 
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

  // Snapshot states to keep the Success Screen populated while form resets
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
        setShowCustomDestination(false);
      } else {
        setFormData(prev => ({ ...prev, destination: '' }));
        setShowCustomDestination(false);
      }
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
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleClose = () => {
    setShowSuccess(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Capture values for the success screen before potential reset
    setSubmittedName(formData.full_name.split(' ')[0]); 
    setSubmittedDest(formData.destination);

    const submissionData = {
        ...formData,
        travel_date: formData.is_flexible ? "Flexible" : formData.travel_date
    };

    try {
      const response = await fetch(`${API_BASE_URL}/enquires`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'x-api-key': API_KEY 
        },
        body: JSON.stringify(submissionData)
      });
      
      if (!response.ok) throw new Error('Failed to submit');
      
      setShowSuccess(true);
      toast.success("Request sent successfully!");
      
      // Delay form reset slightly to ensure no UI flickering
      setTimeout(() => {
        setFormData({
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
      }, 500);
    } catch (error) {
      console.error('Submission Error:', error);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    if (trip) return `Book: ${trip.trip_title || trip.custom_title || trip.title}`;
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
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-[400px] rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
            >
              
              {showSuccess ? (
                <div className="flex flex-col items-center justify-center p-10 text-center h-full min-h-[400px]">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600"
                  >
                    <PhoneCall className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Thanks, {submittedName}!</h3>
                  <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                    We've received your request for <br/>
                    <span className="text-[#FF6B35] font-bold">{submittedDest}</span>.<br/>
                    Our team will contact you shortly.
                  </p>
                  <Button onClick={handleClose} className="w-full bg-slate-900 text-white rounded-xl py-6">
                    Close
                  </Button>
                </div>
              ) : (
                <>
                  {/* HEADER */}
                  <div className="relative bg-gradient-to-br from-[#FF6B35] to-[#FFB800] p-6 text-white shrink-0">
                    <button 
                      onClick={handleClose}
                      className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    
                    <div className="mb-4 pr-6">
                      <h2 className="text-xl font-bold leading-tight mb-1">{getTitle()}</h2>
                      <p className="text-white/90 text-xs">Unlock exclusive deals now!</p>
                    </div>

                    {shouldShowCountdown && (
                      <div className="bg-white/10 border border-white/20 rounded-xl p-3 backdrop-blur-sm flex flex-col items-center">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/90 mb-1">
                           <Clock className="w-3 h-3" /> Offer Ends In
                        </div>
                        <div className="text-white scale-90">
                           <CountdownTimer endDate={offersConfig.end_date} compact={true} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* FORM BODY */}
                  <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      
                      {/* DESTINATION FIELD */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Destination
                        </label>
                        
                        {trip ? (
                          <div className="relative opacity-80">
                             <Input 
                               value={formData.destination} 
                               readOnly 
                               className="bg-slate-100 border-slate-200 font-semibold text-slate-700 focus-visible:ring-0" 
                             />
                          </div>
                        ) : !showCustomDestination ? (
                           <div className="relative">
                              {selectedTrips && selectedTrips.length > 0 ? (
                                <>
                                  <select
                                    name="destination"
                                    value={formData.destination}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-10 pl-3 pr-8 rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] appearance-none shadow-sm"
                                  >
                                    <option value="">Select a destination</option>
                                    {selectedTrips.map((trip, index) => (
                                      <option key={index} value={trip.trip_title || trip.custom_title}>
                                        {trip.trip_title || trip.custom_title}
                                      </option>
                                    ))}
                                    <option value="other_custom" className="font-bold text-[#FF6B35] bg-orange-50">
                                      + Other / Custom Destination
                                    </option>
                                  </select>
                                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                                </>
                              ) : (
                                <Input
                                  name="destination"
                                  value={formData.destination}
                                  onChange={handleChange}
                                  placeholder="Enter your Dream Destination"
                                  required
                                  className="h-10 rounded-md border border-slate-200 focus:ring-[#FF6B35]"
                                />
                              )}
                           </div>
                        ) : (
                          <div className="space-y-2">
                             <Input
                               name="destination"
                               value={formData.destination}
                               onChange={handleChange}
                               placeholder="Enter your custom destination"
                               autoFocus
                               required
                               className="bg-white border-slate-200 focus:ring-[#FF6B35]"
                             />
                             <button
                               type="button"
                               onClick={() => {
                                 setShowCustomDestination(false);
                                 setFormData(prev => ({ ...prev, destination: '' }));
                               }}
                               className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                             >
                               <ArrowLeft className="w-3 h-3" /> Back to list
                             </button>
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <User className="w-3 h-3" /> Name
                        </label>
                        <Input
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="bg-white border-slate-200 h-10"
                        />
                      </div>

                      {/* Phone & Pax Row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <Phone className="w-3 h-3" /> Phone
                          </label>
                          <Input
                            type="tel"
                            name="contact_number"
                            value={formData.contact_number}
                            onChange={handleChange}
                            placeholder="+91 98765"
                            required
                            className="bg-white border-slate-200 h-10"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <Users className="w-3 h-3" /> Pax
                          </label>
                          <Input
                            type="number"
                            name="adults"
                            value={formData.adults}
                            onChange={handleChange}
                            min="1"
                            required
                            className="bg-white border-slate-200 h-10 text-center font-semibold"
                          />
                        </div>
                      </div>

                      {/* Travel Date & Flexible Row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Travel Date
                          </label>
                          <Input
                            type="date"
                            name="travel_date"
                            disabled={formData.is_flexible}
                            value={formData.travel_date}
                            onChange={handleChange}
                            required={!formData.is_flexible}
                            className={`bg-white border-slate-200 h-10 text-xs transition-opacity ${formData.is_flexible ? 'opacity-40 cursor-not-allowed' : 'opacity-100'}`}
                          />
                        </div>
                        <div className="flex flex-col justify-end pb-2">
                           <label className="flex items-center gap-2 cursor-pointer group select-none">
                             <input 
                                type="checkbox"
                                name="is_flexible"
                                checked={formData.is_flexible}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-slate-300 text-[#FF6B35] focus:ring-[#FF6B35] cursor-pointer"
                             />
                             <span className="text-xs font-medium text-slate-600 group-hover:text-slate-800 transition-colors">Flexible Dates</span>
                           </label>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Mail className="w-3 h-3" /> Email
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                          className="bg-white border-slate-200 h-10"
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="pt-2">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl font-bold shadow-lg transform active:scale-[0.98] transition-all"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Sending...
                            </div>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Get Free Quote
                            </>
                          )}
                        </Button>
                      </div>
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