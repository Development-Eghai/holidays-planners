import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function AttractionModal({ attraction, isOpen, onClose, primaryColor }) {
    if (!isOpen || !attraction) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 30 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
                >
                    {/* --- Top Right Close Icon --- */}
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 hover:rotate-90"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* --- Hero Image (Top) --- */}
                    <div className="relative h-72 sm:h-80 shrink-0">
                        <img 
                            src={attraction.image} 
                            alt={attraction.title} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        
                        <div className="absolute bottom-6 left-6 right-6">
                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-white/20 text-white backdrop-blur-md border border-white/10">
                                    <MapPin className="w-3 h-3" /> Popular Attraction
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-bold text-white shadow-sm">{attraction.title}</h2>
                            </motion.div>
                        </div>
                    </div>

                    {/* --- Content (Bottom) --- */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="prose prose-lg prose-slate max-w-none">
                            <h3 
                                className="text-xl font-bold mb-4 flex items-center gap-2"
                                style={{ color: primaryColor }}
                            >
                                About this place
                            </h3>
                            {/* Render Description safely */}
                            <div 
                                className="text-slate-600 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: attraction.description }} 
                            />
                        </div>
                    </div>

                    {/* --- Footer Button --- */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50">
                        <Button 
                            onClick={onClose}
                            className="w-full py-6 text-lg font-bold rounded-xl shadow-lg hover:brightness-110 transition-all text-white"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Close Details
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            `}</style>
        </AnimatePresence>
    );
}