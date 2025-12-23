import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Eye, MessageCircle, Flame } from 'lucide-react';

export default function TripCard({ trip, index, onEnquire, onViewDetails, primaryColor, secondaryColor }) {
  
  // 1. Logic to determine badge color
  const getBadgeStyle = (badgeText) => {
    if (!badgeText) return {};
    const text = badgeText.toLowerCase();
    
    if (text.includes('best seller')) return { backgroundColor: '#EAB308', color: 'white', boxShadow: '0 0 10px rgba(234, 179, 8, 0.5)' }; // Gold
    if (text.includes('hot')) return { backgroundColor: '#EF4444', color: 'white', boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' };         // Red
    if (text.includes('new')) return { backgroundColor: '#22C55E', color: 'white' };         // Green
    if (text.includes('limited')) return { backgroundColor: '#F97316', color: 'white' };     // Orange
    
    // Default fallback
    return { background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`, color: 'white' };
  };

  // 2. Logic to check if badge should blink/animate (Urgent items)
  const isUrgentBadge = (badgeText) => {
    if (!badgeText) return false;
    const text = badgeText.toLowerCase();
    return text.includes('hot') || text.includes('limited') || text.includes('deal');
  };

  const getPriceDisplay = () => {
    if (!trip) return 'Price on Request';
    if (trip.pricing_model?.includes('custom')) {
      const basePrice = trip.pricing?.customized?.base_price || trip.base_price || trip.price;
      return basePrice ? `₹${basePrice.toLocaleString()}` : 'Price on Request';
    }
    if (trip.pricing_model === 'fixed_departure') {
      const price = trip.pricing?.fixed_departure?.[0]?.price || trip.price;
      return price ? `₹${price.toLocaleString()}` : 'Price on Request';
    }
    const price = trip.price || trip.base_price || 0;
    return price ? `₹${price.toLocaleString()}` : 'Price on Request';
  };

  const priceText = getPriceDisplay();
  const badgeStyle = getBadgeStyle(trip.badge);
  const shouldAnimate = isUrgentBadge(trip.badge);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Image Header */}
      <div className="relative h-60 overflow-hidden bg-slate-100">
        <img 
          src={trip.hero_image || trip.images?.[0] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'} 
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* --- BADGE WITH ANIMATION --- */}
        {trip.badge && (
          <motion.div
            className="absolute top-4 left-4 z-10"
            animate={shouldAnimate ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Badge 
              className="text-[11px] uppercase font-bold px-3 py-1 border-none tracking-wide rounded-full flex items-center gap-1"
              style={badgeStyle}
            >
              {trip.badge}
              {/* Add a tiny flame icon if it's a hot deal */}
              {shouldAnimate && <Flame className="w-3 h-3 fill-white text-white animate-pulse" />}
            </Badge>
          </motion.div>
        )}

        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-white" />
          {trip.days}D / {trip.nights}N
        </div>

        <div className="absolute bottom-4 left-4 right-4">
           <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-0.5">Starting From</p>
           <p className="text-white text-2xl font-bold tracking-tight">{priceText}</p>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4">
           <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-snug mb-2" title={trip.custom_title || trip.title}>
             {trip.custom_title || trip.title}
           </h3>
           
           <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
             <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
               <MapPin className="w-3.5 h-3.5 text-blue-500" />
               <span>{trip.destination_type || 'Custom'}</span>
             </div>
             {trip.hotel_category && (
               <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                 <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                 <span>{trip.hotel_category} Star</span>
               </div>
             )}
           </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
          <Button 
            variant="outline" 
            onClick={() => onViewDetails(trip)}
            className="w-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl h-11 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          
          <Button 
            onClick={() => onEnquire(trip)}
            className="w-full text-white font-bold rounded-xl h-11 shadow-md hover:shadow-lg transition-all"
            style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Enquire Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}