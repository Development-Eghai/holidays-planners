import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from 'lucide-react';
import AttractionModal from './AttractionModal';

// Helper to strip HTML tags for preview text
const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

export default function AttractionsSection({ attractions, sectionTitle, sectionSubtitle, primaryColor, secondaryColor }) {
    const [selectedAttraction, setSelectedAttraction] = React.useState(null);

    if (!attractions || attractions.length === 0) return null;

    return (
        <>
            <AttractionModal 
                attraction={selectedAttraction}
                isOpen={!!selectedAttraction}
                onClose={() => setSelectedAttraction(null)}
                primaryColor={primaryColor}
            />
            
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                {/* Background Blobs for Visual Interest */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-sm font-bold tracking-widest uppercase mb-2 block" style={{ color: primaryColor }}>
                            {sectionSubtitle || 'Discover More'}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                            {sectionTitle || 'Popular Attractions'}
                        </h2>
                        <div className="h-1.5 w-20 mx-auto rounded-full" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }} />
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {attractions.map((attraction, index) => {
                            // Create a clean preview snippet
                            const previewText = stripHtml(attraction.description).substring(0, 100) + '...';

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full cursor-pointer"
                                    onClick={() => setSelectedAttraction(attraction)}
                                >
                                    {/* Image Container */}
                                    <div className="relative h-64 overflow-hidden">
                                        <img 
                                            src={attraction.image}
                                            alt={attraction.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            <ArrowRight className="w-5 h-5" style={{ color: primaryColor }} />
                                        </div>
                                    </div>

                                    {/* Content Container */}
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-[color:var(--primary)] transition-colors" style={{ '--primary': primaryColor }}>
                                            {attraction.title}
                                        </h3>
                                        <p className="text-slate-600 mb-6 flex-1 leading-relaxed">
                                            {previewText}
                                        </p>
                                        
                                        <div className="flex items-center text-sm font-bold uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300" style={{ color: primaryColor }}>
                                            Explore Details <ArrowRight className="w-4 h-4 ml-2" />
                                        </div>
                                    </div>
                                    
                                    {/* Hover Border Bottom */}
                                    <div className="absolute bottom-0 left-0 w-full h-1.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" 
                                         style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }} 
                                    />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}