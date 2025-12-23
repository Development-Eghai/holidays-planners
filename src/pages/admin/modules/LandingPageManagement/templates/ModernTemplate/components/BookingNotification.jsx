import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, MapPin } from 'lucide-react';

const notifications = [
    { name: 'Sarah M.', location: 'New York', destination: 'Bali Paradise', time: '2 minutes ago' },
    { name: 'John D.', location: 'London', destination: 'Maldives Escape', time: '5 minutes ago' },
    { name: 'Emma L.', location: 'Sydney', destination: 'Swiss Alps Adventure', time: '8 minutes ago' },
    { name: 'Michael R.', location: 'Toronto', destination: 'Tokyo Explorer', time: '12 minutes ago' },
    { name: 'Lisa K.', location: 'Berlin', destination: 'Santorini Dreams', time: '15 minutes ago' },
    { name: 'David W.', location: 'Paris', destination: 'Dubai Luxury', time: '18 minutes ago' },
    { name: 'Anna S.', location: 'Miami', destination: 'Bali Paradise', time: '21 minutes ago' },
    { name: 'Chris P.', location: 'Chicago', destination: 'Iceland Northern Lights', time: '25 minutes ago' },
];

export default function BookingNotification() {
    const [currentNotification, setCurrentNotification] = useState(null);
    const [notificationIndex, setNotificationIndex] = useState(0);

    useEffect(() => {
        const showNotification = () => {
            setCurrentNotification(notifications[notificationIndex]);
            setNotificationIndex((prev) => (prev + 1) % notifications.length);
            
            // Hide after 5 seconds
            setTimeout(() => {
                setCurrentNotification(null);
            }, 5000);
        };

        // Show first notification after 3 seconds
        const initialTimeout = setTimeout(showNotification, 3000);
        
        // Then show every 15-25 seconds
        const interval = setInterval(showNotification, Math.random() * 10000 + 15000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, [notificationIndex]);

    return (
        <AnimatePresence>
            {currentNotification && (
                <motion.div
                    initial={{ x: -400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -400, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="fixed bottom-6 left-6 z-50 max-w-sm"
                >
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex items-start gap-4">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB800] flex items-center justify-center text-white font-bold text-lg">
                                {currentNotification.name.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                <MapPin className="w-3 h-3" />
                                {currentNotification.location}
                                <span className="text-slate-300">•</span>
                                {currentNotification.time}
                            </div>
                            <div className="font-semibold text-slate-900">
                                {currentNotification.name} just booked
                            </div>
                            <div className="text-[#FF6B35] font-medium">
                                {currentNotification.destination}
                            </div>
                        </div>

                        {/* Close button */}
                        <button 
                            onClick={() => setCurrentNotification(null)}
                            className="text-slate-400 hover:text-slate-600 text-sm"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Pulse ring */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: 1.2, opacity: 0 }}
                        transition={{ duration: 1, repeat: 2 }}
                        className="absolute inset-0 bg-green-500/20 rounded-2xl -z-10"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}