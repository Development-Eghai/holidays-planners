import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, MapPin, Users, Mail, Phone, User, PhoneCall, Clock, Calendar } from 'lucide-react';
import { toast, Toaster } from "sonner";
import CountdownTimer from './CountdownTimer'; 

const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const API_KEY = 'x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ';

// Helper Component for Cleaner Form Code
const FormField = ({ icon: Icon, label, children }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
      <Icon className="w-3 h-3" /> {label}
    </label>
    {children}
  </div>
);

export default function UnifiedEnquiryModal({ trip, isOpen, onClose, popupSettings, popupType, offersConfig, pageName, pageSlug }) {
  const [formData, setFormData] = useState({
    destination: '', full_name: '', contact_number: '', email: '', adults: 2,
    departure_city: 'Web Modal Lead', travel_date: new Date().toISOString().split('T')[0],
    is_flexible: false, hotel_category: '3 Star', domain_name: 'https://www.holidaysplanners.com'
  });
  const [status, setStatus] = useState({ submitting: false, success: false, name: '' });

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, destination: trip?.trip_title || trip?.title || '' }));
      setStatus({ ...status, success: false });
    }
  }, [trip, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ ...status, submitting: true });
    
    try {
      const res = await fetch(`${API_BASE_URL}/enquires`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify({
          ...formData,
          travel_date: formData.is_flexible ? "Flexible" : formData.travel_date,
          departure_city: pageName ? `Landing Page: ${pageName}` : 'Website Enquiry'
        })
      });
      if (!res.ok) throw new Error();
      setStatus({ submitting: false, success: true, name: formData.full_name.split(' ')[0] });
      toast.success("Request sent!");
    } catch {
      toast.error('Failed to submit.');
      setStatus(prev => ({ ...prev, submitting: false }));
    }
  };

  const getTitle = () => trip ? (trip.trip_title || trip.title) : (pageName || popupSettings?.[popupType]?.title || 'Plan Your Trip');
  const showTimer = offersConfig?.header?.enabled && offersConfig?.end_date && new Date(offersConfig.end_date) > new Date();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-white w-full max-w-[360px] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
          >
            {status.success ? (
              <div className="flex flex-col items-center justify-center p-8 text-center min-h-[350px]">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600"><PhoneCall className="w-8 h-8" /></div>
                <h3 className="text-xl font-bold text-slate-800">Thanks, {status.name}!</h3>
                <p className="text-slate-500 mb-6 text-sm mt-1">We received your request. calling you shortly.</p>
                <Button onClick={onClose} className="w-full bg-slate-900 text-white rounded-lg">Close</Button>
              </div>
            ) : (
              <>
                <div className="relative bg-gradient-to-br from-[#FF6B35] to-[#FF9F00] px-5 py-4 text-white">
                  <button onClick={onClose} className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/30 rounded-full"><X className="w-4 h-4" /></button>
                  <div>
                    <p className="text-[10px] uppercase font-bold opacity-90">Enquiry For</p>
                    <h2 className="text-lg font-bold line-clamp-1">{getTitle()}</h2>
                  </div>
                  {showTimer && (
                    <div className="mt-3 bg-black/20 border border-white/20 rounded-lg p-2 flex justify-between items-center">
                      <span className="flex gap-1.5 text-[9px] font-bold uppercase"><Clock className="w-3 h-3" /> Offer Ends In</span>
                      <div className="scale-75 origin-right"><CountdownTimer endDate={offersConfig.end_date} compact /></div>
                    </div>
                  )}
                </div>

                <div className="p-5 bg-white flex-1 overflow-y-auto">
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <FormField icon={MapPin} label="Destination">
                      <Input value={formData.destination} readOnly={!!trip} onChange={e => setFormData({...formData, destination: e.target.value})} placeholder="Where do you want to go?" required className={`h-10 text-sm ${trip ? 'bg-slate-50 text-slate-500' : ''}`} />
                    </FormField>

                    <FormField icon={User} label="Full Name">
                      <Input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} placeholder="Enter name" required className="h-10 text-sm" />
                    </FormField>

                    <div className="grid grid-cols-2 gap-3">
                      <FormField icon={Phone} label="Phone">
                        <Input type="tel" value={formData.contact_number} onChange={e => setFormData({...formData, contact_number: e.target.value})} placeholder="Mobile No." required className="h-10 text-sm" />
                      </FormField>
                      <FormField icon={Users} label="Travelers">
                        <Input type="number" value={formData.adults} onChange={e => setFormData({...formData, adults: e.target.value})} min="1" required className="h-10 text-sm text-center" />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-3 items-end">
                      <FormField icon={Calendar} label="Date">
                        <Input type="date" disabled={formData.is_flexible} value={formData.travel_date} onChange={e => setFormData({...formData, travel_date: e.target.value})} className={`h-10 text-xs ${formData.is_flexible ? 'opacity-40' : ''}`} />
                      </FormField>
                      <label className="flex items-center gap-2 cursor-pointer pb-3 select-none">
                        <input type="checkbox" checked={formData.is_flexible} onChange={e => setFormData({...formData, is_flexible: e.target.checked})} className="w-4 h-4 rounded text-[#FF6B35] focus:ring-[#FF6B35]" />
                        <span className="text-xs font-semibold text-slate-600">Flexible?</span>
                      </label>
                    </div>

                    <FormField icon={Mail} label="Email">
                      <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email ID" required className="h-10 text-sm" />
                    </FormField>

                    <Button type="submit" disabled={status.submitting} className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl font-bold mt-2">
                      {status.submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Get Free Quote</>}
                    </Button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}