import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Map, Compass, Trophy, Users, Globe, Smile } from 'lucide-react';

const stats = [
    { label: 'Years Experience', value: '10+', icon: Trophy },
    { label: 'Happy Travelers', value: '15k+', icon: Users },
    { label: 'Destinations', value: '20+', icon: Map },
    { label: 'Satisfaction', value: '98%', icon: Smile },
];

// Continuous Floating Animation
const floatAnim = {
    animate: {
        y: [0, -15, 0],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Pulsing Blob Animation
const pulseAnim = {
    animate: {
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
        transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export default function AboutSection({ 
    title = "Your Trusted Travel Partner", 
    subtitle = "About Us", 
    primaryColor = '#FF6B35', 
    secondaryColor = '#FFB800' 
}) {
    return (
        <section id="about" className="py-24 bg-white overflow-hidden relative">
            
            {/* Background Divider */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* --- 1. SECTION HEADER --- */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-sm font-extrabold tracking-widest uppercase mb-3 block" style={{ color: primaryColor }}>
                        {subtitle}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        {title}
                    </h2>
                    <div className="h-1.5 w-24 mx-auto rounded-full" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }} />
                </motion.div>

                {/* --- 2. MAIN CONTENT CARD --- */}
                <div className="bg-[#F8FAFC] rounded-[3rem] p-8 md:p-16 relative overflow-hidden border border-slate-100 shadow-xl group">
                    
                    {/* Living Background Blobs */}
                    <motion.div 
                        variants={pulseAnim}
                        animate="animate"
                        className="absolute -top-24 -right-24 w-96 h-96 bg-orange-100 rounded-full blur-[80px] pointer-events-none" 
                    />
                    <motion.div 
                        variants={pulseAnim}
                        animate="animate"
                        transition={{ delay: 4 }} // Offset the pulse
                        className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-[80px] pointer-events-none" 
                    />
                    
                    <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                        
                        {/* --- LEFT: CREATIVE LOGO AREA --- */}
                        <div className="w-full lg:w-5/12 flex justify-center lg:justify-start relative">
                            {/* Floating Icons Decor */}
                            <motion.div 
                                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-8 -left-8 text-blue-200"
                            >
                                <Plane className="w-12 h-12 opacity-50" />
                            </motion.div>
                            <motion.div 
                                animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-8 -right-8 text-orange-200"
                            >
                                <Compass className="w-12 h-12 opacity-50" />
                            </motion.div>

                            {/* Main Floating Card */}
                            <motion.div 
                                variants={floatAnim}
                                animate="animate"
                                className="relative z-10"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-orange-100 rounded-[2.5rem] rotate-6 transform transition-transform duration-500 group-hover:rotate-12" />
                                
                                <div className="relative bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 flex items-center justify-center min-h-[320px] min-w-[300px] backdrop-blur-sm bg-white/80">
                                    <img 
                                        src="/holidaysplanners-logo.png" 
                                        alt="Holidays Planners" 
                                        className="w-64 h-auto object-contain drop-shadow-md transform transition-transform duration-500 hover:scale-110"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = `<h3 class="text-3xl font-black text-slate-900 text-center">Holidays<br/><span style="color:${primaryColor}">Planners</span></h3>`;
                                        }}
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* --- RIGHT: CONTENT --- */}
                        <motion.div 
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="w-full lg:w-7/12"
                        >
                            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                                Crafting Unforgettable Journeys <br/>
                                <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
                                    Since 2015
                                </span>
                            </h3>
                            
                            <div className="relative pl-8 border-l-[4px] border-slate-200 mb-10 space-y-4">
                                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                                    "At Holidays Planners, we don't just book trips; we craft experiences. Based in the heart of Shimla, we specialize in creating personalized journeys across India."
                                </p>
                                <p className="text-slate-500 leading-relaxed">
                                    Whether it's the snowy peaks of Himachal or the sunny beaches of Goa, we act as your personal travel architects to ensure a safe, seamless, and unforgettable adventure.
                                </p>
                            </div>

                            {/* Author & Signature */}
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl font-bold text-slate-600 border-2 border-white shadow-md">
                                    PS
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900">Poonam Sharma</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="h-px w-8 bg-slate-300"></div>
                                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>Founder & CEO</p>
                                    </div>
                                </div>
                            </div>

                            {/* --- INTERACTIVE STATS GRID --- */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                                {stats.map((stat, idx) => (
                                    <motion.div 
                                        key={idx}
                                        whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                                        className="bg-white/50 border border-slate-200 p-4 rounded-2xl text-center transition-all cursor-default hover:shadow-lg hover:border-orange-200"
                                    >
                                        <div className="mb-2 flex justify-center text-slate-400">
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                        <div className="text-2xl font-black text-slate-900 mb-1" style={{ color: primaryColor }}>
                                            {stat.value}
                                        </div>
                                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

            </div>
        </section>
    );
}