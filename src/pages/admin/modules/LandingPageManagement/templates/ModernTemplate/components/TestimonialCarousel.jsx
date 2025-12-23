import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function TestimonialCarousel({ 
    testimonials = [], 
    sectionTitle = "What Our Travelers Say", 
    sectionSubtitle = "Real experiences" 
}) {
    // 1. Map the API/Form data to the Component's expected structure
    const items = testimonials.length > 0 ? testimonials.map((t, i) => ({
        id: i,
        name: t.name || 'Happy Traveler',
        // 'role' isn't in your form, so we use a default or derive it
        role: 'Verified Traveler', 
        // Use uploaded image or generate a placeholder avatar
        image: t.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name || 'User')}&background=random`,
        rating: t.rating || 5,
        text: t.description || 'No review text provided.',
        destination: t.destination || 'Unspecified Trip',
        date: t.date || new Date().toISOString().split('T')[0]
    })) : [];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Auto-scroll logic
    useEffect(() => {
        if (items.length <= 1) return; // Don't auto-scroll if only 1 item

        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [items.length]);

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const paginate = (newDirection) => {
        setDirection(newDirection);
        setCurrentIndex((prev) => (prev + newDirection + items.length) % items.length);
    };

    // Safe guard if no items exist (though ModernTemplate prevents this render)
    if (items.length === 0) return null;

    return (
        <section className="py-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-[#FF6B35] font-semibold text-sm uppercase tracking-wider">
                        {sectionSubtitle}
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mt-4 mb-6">
                        {sectionTitle}
                    </h2>
                    <div className="flex items-center justify-center gap-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-6 h-6 fill-[#FFB800] text-[#FFB800]" />
                            ))}
                        </div>
                        <span className="text-slate-600 font-medium">Trusted by {items.length * 100}+ travelers</span>
                    </div>
                </motion.div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Navigation buttons - Only show if > 1 item */}
                    {items.length > 1 && (
                        <>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-16 z-10 rounded-full w-12 h-12 border-2 hover:bg-slate-50"
                                onClick={() => paginate(-1)}
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-16 z-10 rounded-full w-12 h-12 border-2 hover:bg-slate-50"
                                onClick={() => paginate(1)}
                            >
                                <ChevronRight className="w-6 h-6" />
                            </Button>
                        </>
                    )}

                    {/* Testimonial card */}
                    <div className="relative h-[400px] flex items-center justify-center">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                className="absolute w-full"
                            >
                                <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 relative border border-slate-100">
                                    <Quote className="absolute top-8 right-8 w-16 h-16 text-[#FF6B35]/10" />
                                    
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                                        <img
                                            src={items[currentIndex].image}
                                            alt={items[currentIndex].name}
                                            className="w-20 h-20 rounded-full object-cover border-4 border-[#FFB800]/20 bg-slate-100"
                                        />
                                        <div className="text-center sm:text-left">
                                            <h4 className="text-xl font-bold text-slate-900">
                                                {items[currentIndex].name}
                                            </h4>
                                            <p className="text-slate-500">
                                                {items[currentIndex].role}
                                            </p>
                                            <div className="flex items-center gap-1 mt-2 justify-center sm:justify-start">
                                                {[...Array(items[currentIndex].rating)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="sm:ml-auto text-center sm:text-right">
                                            <div className="text-[#FF6B35] font-semibold">
                                                {items[currentIndex].destination}
                                            </div>
                                            <div className="text-sm text-slate-400">
                                                {items[currentIndex].date}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-lg text-slate-600 leading-relaxed text-center sm:text-left overflow-y-auto max-h-[150px] pr-2 custom-scrollbar">
                                        "{items[currentIndex].text}"
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Dots */}
                    {items.length > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {items.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setDirection(index > currentIndex ? 1 : -1);
                                        setCurrentIndex(index);
                                    }}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        index === currentIndex 
                                            ? 'bg-[#FF6B35] w-8' 
                                            : 'bg-slate-300 hover:bg-slate-400'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
            `}</style>
        </section>
    );
}