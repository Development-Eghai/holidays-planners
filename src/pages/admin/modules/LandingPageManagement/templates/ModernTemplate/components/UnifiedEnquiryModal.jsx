import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, MapPin, Calendar, Users, Mail, Phone, User, Star, FileText, Plane, CheckSquare, Sparkles, PhoneCall } from 'lucide-react';
import { toast, Toaster } from "sonner";

const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const API_KEY = 'x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ';
const DEFAULT_DOMAIN = 'https://www.holidaysplanners.com';

export default function UnifiedEnquiryModal({ trip, isOpen, onClose, popupSettings, popupType }) {
  const [formData, setFormData] = useState({
    destination: '',
    departure_city: '',
    travel_date: '',
    adults: 2,
    hotel_category: '3 Star',
    full_name: '',
    contact_number: '',
    email: '',
    additional_comments: '',
    domain_name: DEFAULT_DOMAIN
  });
  
  const [isFlexibleDate, setIsFlexibleDate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Get popup title based on type
  const getPopupTitle = () => {
    if (!popupSettings || !popupType) return 'Plan Your Dream Trip';
    
    const popup = popupSettings[popupType];
    return popup?.title || 'Plan Your Dream Trip';
  };

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        destination: trip?.title || '',
      }));
      setShowSuccess(false);
    }
  }, [trip, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setShowSuccess(false);
    setIsFlexibleDate(false);
    onClose();
    
    setTimeout(() => {
      setFormData({
        destination: '',
        departure_city: '',
        travel_date: '',
        adults: 2,
        hotel_category: '3 Star',
        full_name: '',
        contact_number: '',
        email: '',
        additional_comments: '',
        domain_name: DEFAULT_DOMAIN
      });
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalDepartureCity = formData.departure_city.trim() !== "" 
      ? formData.departure_city 
      : "lead from landing page";

    let finalComments = formData.additional_comments;
    let finalDate = formData.travel_date;

    if (isFlexibleDate) {
      finalComments = `(Flexible Travel Dates) ${finalComments}`;
      if (!finalDate) finalDate = new Date().toISOString().split('T')[0]; 
    }

    const payload = {
      ...formData,
      departure_city: finalDepartureCity,
      additional_comments: finalComments,
      travel_date: finalDate
    };

    try {
      const response = await fetch(`${API_BASE_URL}/enquires`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to submit enquiry');
      }

      setShowSuccess(true);

    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast.error('Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" style={{ zIndex: 99999 }} />

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            
            {/* Dark Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Content Wrapper */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden relative z-10"
            >
              
              {showSuccess ? (
                // --- SUCCESS VIEW ---
                <div className="relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#FF6B35] to-[#FFB800]"></div>
                   <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full h-24 bg-white rounded-t-[50%]"></div>

                   <div className="relative z-10 p-8 pt-12 flex flex-col items-center text-center">
                      
                      <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center mb-6 border-4 border-[#FF6B35]"
                      >
                         <PhoneCall className="w-10 h-10 text-[#FF6B35]" />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">
                          Thank you, {formData.full_name.split(' ')[0]}! <span className="inline-block"><Sparkles className="w-6 h-6 text-yellow-500 inline" /></span>
                        </h2>
                        <p className="text-lg text-slate-500 font-medium mb-1">
                           We have received your request for <span className="text-[#FF6B35] font-bold">{formData.destination}</span>.
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-orange-50 border border-orange-100 rounded-xl p-6 mt-6 max-w-md w-full"
                      >
                        <p className="text-xl font-bold text-slate-700 leading-relaxed">
                          "Your dream trip is just a call away!" ✈️
                        </p>
                        <p className="text-sm text-slate-500 mt-2">
                          Our travel expert is reviewing your details and will contact you shortly to finalize your perfect itinerary.
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 w-full max-w-xs"
                      >
                         <Button 
                          onClick={handleClose}
                          className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FFB800] hover:from-[#FF5722] hover:to-[#FFA000] text-white py-6 text-lg rounded-full font-bold shadow-lg transition-transform hover:scale-[1.02]"
                        >
                          Awesome, I'll be waiting!
                        </Button>
                      </motion.div>
                   </div>
                </div>
              ) : (
                // --- FORM VIEW ---
                <>
                  <div className="bg-gradient-to-r from-[#FF6B35] to-[#FFB800] p-5 text-white flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold">{getPopupTitle()}</h2>
                      <p className="text-white/90 text-xs mt-1">Get a customized quote within 24 hours</p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Destination
                        </label>
                        <Input
                          name="destination"
                          value={formData.destination}
                          onChange={handleChange}
                          placeholder="E.g. Manali"
                          required
                          className="font-semibold bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Plane className="w-3 h-3" /> Travel From
                        </label>
                        <Input
                          name="departure_city"
                          value={formData.departure_city}
                          onChange={handleChange}
                          placeholder="City (Optional)"
                          className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Travel Date
                        </label>
                        <div className="relative">
                          <Input
                            type="date"
                            name="travel_date"
                            value={formData.travel_date}
                            onChange={handleChange}
                            disabled={isFlexibleDate}
                            required={!isFlexibleDate}
                            min={new Date().toISOString().split('T')[0]}
                            className={`border-slate-200 transition-colors ${isFlexibleDate ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-50 focus:bg-white'}`}
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-2 cursor-pointer" onClick={() => setIsFlexibleDate(!isFlexibleDate)}>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isFlexibleDate ? 'bg-[#FF6B35] border-[#FF6B35]' : 'border-slate-300 bg-white'}`}>
                            {isFlexibleDate && <CheckSquare className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-xs text-slate-600 select-none">
                            Flexible dates
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Star className="w-3 h-3" /> Hotel Category
                        </label>
                        <select
                          name="hotel_category"
                          value={formData.hotel_category}
                          onChange={handleChange}
                          className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-colors"
                        > 
                          <option>Budget</option>
                          <option>3 Star</option>
                          <option>4 Star</option>
                          <option>5 Star</option>
                          <option>Luxury</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Users className="w-3 h-3" /> No. of Adults
                        </label>
                        <Input
                          type="number"
                          name="adults"
                          value={formData.adults}
                          onChange={handleChange}
                          min="1"
                          required
                          className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <User className="w-3 h-3" /> Full Name
                        </label>
                        <Input
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          placeholder="Your Name"
                          required
                          className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Phone Number
                        </label>
                        <Input
                          type="tel"
                          name="contact_number"
                          value={formData.contact_number}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          required
                          className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>

                    {/* Row 4 */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Email Address
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        required
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                      />
                    </div>

                    {/* Row 5 */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Additional Requirements
                      </label>
                      <textarea
                        name="additional_comments"
                        value={formData.additional_comments}
                        onChange={handleChange}
                        placeholder="Any specific preferences? (Optional)"
                        rows={2}
                        className="w-full px-3 py-2 text-sm border rounded-md bg-slate-50 border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-colors resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FFB800] hover:from-[#FF5722] hover:to-[#FFA000] text-white h-12 text-lg rounded-xl font-bold shadow-lg transform hover:scale-[1.01] transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Get Best Quote
                        </>
                      )}
                    </Button>

                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}