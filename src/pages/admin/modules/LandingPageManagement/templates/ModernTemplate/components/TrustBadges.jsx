import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Clock, CreditCard, Headphones, RefreshCw } from 'lucide-react';

const badges = [
    { icon: Shield, label: 'Secure Booking', desc: '256-bit SSL encryption' },
    { icon: Award, label: 'Best Price Guarantee', desc: 'Match or beat any price' },
    { icon: Clock, label: '24/7 Support', desc: 'Always here for you' },
    { icon: CreditCard, label: 'Easy Payment', desc: 'Flexible payment options' },
    { icon: RefreshCw, label: 'Free Cancellation', desc: 'Up to 48 hours before' },
    { icon: Headphones, label: 'Expert Guides', desc: 'Local knowledge' }
];

const stats = [
    { label: 'Years Experience', value: '10+' },
    { label: 'Happy Travelers', value: '15k+' },
    { label: 'Destinations', value: '250+' },
    { label: 'Satisfaction', value: '98%' },
];

export default function TrustBadges() {
    return (
        // Added id="about" here
        <section id="about" className="py-20 bg-white border-y border-slate-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* PART 1: TRUST BADGES GRID */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-20">
                    {badges.map((badge, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center group"
                        >
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-50 rounded-2xl mb-4 group-hover:bg-[#FF6B35]/10 group-hover:scale-110 transition-all duration-300">
                                <badge.icon className="w-7 h-7 text-slate-400 group-hover:text-[#FF6B35] transition-colors" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm mb-1">{badge.label}</h4>
                            <p className="text-xs text-slate-500">{badge.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* PART 2: COMPANY AUTHORITY SECTION */}
                <div className="bg-slate-50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    
                    <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                        
                        {/* Left: Holidays Planners Logo */}
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="w-full lg:w-1/3 text-center lg:text-left flex justify-center lg:justify-start"
                        >
                            <div className="relative inline-block">
                                {/* Decor behind logo */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-[2rem] rotate-6 opacity-40 transform scale-105" />
                                
                                <div className="relative bg-white p-8 rounded-[2rem] shadow-xl border-4 border-white/50">
                                    <img 
                                        src="/holidaysplanners-logo.png" 
                                        alt="Holidays Planners" 
                                        className="w-48 h-auto object-contain"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Right: Content */}
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="w-full lg:w-2/3"
                        >
                            <h3 className="text-3xl font-bold text-slate-900 mb-6">
                                Your Trusted Travel Companion <span className="text-blue-600">Since 2015</span>
                            </h3>
                            
                            <div className="relative pl-6 border-l-4 border-blue-500 mb-8">
                                <p className="text-slate-600 text-lg leading-relaxed italic mb-4">
                                    "At Holidays Planners, we don't just book trips; we craft experiences. Based in Shimla, we specialize in creating personalized journeys across India. Whether it's the peaks of Himachal or the beaches of Goa, we serve as your personal travel investigator to ensure a safe, seamless, and unforgettable adventure."
                                </p>
                                
                                {/* AUTHOR BLOCK */}
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900">Poonam Sharma</h4>
                                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Founder & CEO</p>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-200 pt-8">
                                {stats.map((stat, idx) => (
                                    <div key={idx}>
                                        <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

            </div>
        </section>
    );
}