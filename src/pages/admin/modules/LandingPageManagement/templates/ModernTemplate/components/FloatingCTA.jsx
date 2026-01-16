import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, X, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function FloatingCTA({ settings, offersConfig, onOpenEnquiry }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showBanner, setShowBanner] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        // Show sticky banner after scrolling BUT hide when footer is visible
        const handleScroll = () => {
            const footer = document.querySelector('footer');
            if (footer) {
                const footerRect = footer.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // Show banner only if scrolled past 500px AND footer is not in viewport
                const isFooterVisible = footerRect.top < windowHeight;
                setShowBanner(window.scrollY > 500 && !isFooterVisible);
            } else {
                setShowBanner(window.scrollY > 500);
            }
        };
        
        handleScroll(); // Initial check
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll); // Also check on resize
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    // Countdown timer
    useEffect(() => {
        if (!offersConfig?.end_date) return;

        const calculateTimeLeft = () => {
            const endDate = new Date(offersConfig.end_date);
            const now = new Date();
            const difference = endDate - now;

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                };
            }
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [offersConfig?.end_date]);

    const handleGetQuote = () => {
        if (onOpenEnquiry) {
            onOpenEnquiry();
        }
    };

    // Check if footer banner should be shown
    const showFooterBanner = offersConfig?.footer?.enabled && offersConfig?.footer?.text;

    return (
        <>
            {/* Floating Chat Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.8 }}
                            className="absolute bottom-20 right-0 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden mb-4"
                        >
                            <div className="bg-gradient-to-r from-[#FF6B35] to-[#FFB800] p-4 text-white">
                                <h4 className="font-bold">Need Help?</h4>
                                <p className="text-sm opacity-90">We're here to assist you!</p>
                            </div>
                            <div className="p-4 space-y-3">
    <a
        href={`tel:${settings?.contact || '+919876543210'}`}
        className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
    >
        <div className="p-2 rounded-full bg-[#FF6B35]">
            <Phone className="w-4 h-4 text-white" />
        </div>
        <div>
            <div className="font-semibold text-slate-900">Call Us</div>
            <div className="text-sm text-slate-500">
                {settings?.contact || '+91 98765 43210'}
            </div>
        </div>
    </a>

    <a
        href={`https://wa.me/${(settings?.contact || '919876543210').replace(/[^0-9]/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
    >
        <div className="p-2 rounded-full bg-[#25D366]">
            <MessageCircle className="w-4 h-4 text-white" />
        </div>
        <div>
            <div className="font-semibold text-slate-900">WhatsApp</div>
            <div className="text-sm text-slate-500">Chat with us</div>
        </div>
    </a>
</div>

                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative p-4 text-white rounded-full shadow-xl bg-gradient-to-r from-[#FF6B35] to-[#FFB800]"
                    style={{
                        boxShadow: '0 20px 25px -5px rgba(255, 107, 53, 0.3)'
                    }}
                >
                    {isOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <MessageCircle className="w-6 h-6" />
                    )}
                    {!isOpen && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
                    )}
                </motion.button>
            </div>

            {/* Sticky Bottom Banner - Hides when footer is visible */}
            <AnimatePresence>
                {showBanner && showFooterBanner && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-slate-900 to-slate-800 border-t border-slate-700"
                    >
                        <div className="max-w-7xl mx-auto px-4 py-3">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={{ rotate: [0, 15, -15, 0] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        <Sparkles className="w-5 h-5 text-[#FFB800]" />
                                    </motion.div>
                                    <span className="text-white font-medium text-sm sm:text-base">
                                        🔥 <span className="text-[#FF6B35]">{offersConfig.footer.text}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {offersConfig?.end_date && (
                                        <div className="hidden sm:flex items-center gap-2 text-white/80 text-sm">
                                            <span>Ends in:</span>
                                            <div className="flex items-center gap-1 font-mono font-bold">
                                                {timeLeft.days > 0 && (
                                                    <>
                                                        <span className="bg-white/10 px-2 py-1 rounded">{String(timeLeft.days).padStart(2, '0')}d</span>
                                                        <span>:</span>
                                                    </>
                                                )}
                                                <span className="bg-white/10 px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}h</span>
                                                <span>:</span>
                                                <span className="bg-white/10 px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}m</span>
                                                <span>:</span>
                                                <span className="bg-white/10 px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}s</span>
                                            </div>
                                        </div>
                                    )}
                                    <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-[#FF6B35] to-[#FFB800] text-white rounded-full px-6 hover:shadow-lg transition-all"
                                        onClick={handleGetQuote}
                                    >
                                        Get Quote
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}