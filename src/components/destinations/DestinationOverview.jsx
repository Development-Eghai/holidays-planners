import React, { useState, useEffect } from 'react';
// Note: Assuming this component lives in a path like 'components/destinations/DestinationOverview.jsx'
// and is receiving the fetched data via props.
import { Share2, Facebook, Twitter, Linkedin, Link2, X } from 'lucide-react';

/**
 * Component to display the destination's description and social sharing options.
 * It expects to receive the full destination data object fetched from the API.
 */
export default function DestinationDetails({ destinationData }) {
    const [expanded, setExpanded] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [currentDestination, setCurrentDestination] = useState(null);

    // --- Data Mapping Effect ---
    useEffect(() => {
        if (destinationData) {
            // Map the dynamic API fields to the required structure
            const apiData = destinationData.data || destinationData;
            
            // For the title and descriptions, we combine API fields for a better display.
            // Using title and overview for the description content.
            const mappedData = {
                title: apiData.title || 'About Destination',
                // Using subtitle for a short description if available, otherwise use the start of the overview
                shortDescription: apiData.subtitle || apiData.overview?.slice(0, 150) + '...' || 'No short description available.',
                fullDescription: apiData.overview || 'No detailed description available.',
            };
            setCurrentDestination(mappedData);
            setExpanded(false);
        }
    }, [destinationData]);

    const destination = currentDestination;

    const toggleViewMore = () => {
        setExpanded(!expanded);
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const title = destination?.title || 'Check out this awesome trip!';
        
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            // Note: WhatsApp and Telegram are often handled via navigator.share for better mobile support
            // Placeholder:
            whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
        };

        if (platform === 'copy') {
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        } else {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
        setShowShareOptions(false);
    };

    const shareButtons = [
        { 
            name: 'Copy Link', 
            icon: Link2, 
            bg: 'bg-gray-700 hover:bg-gray-800',
            action: 'copy'
        },
        { 
            name: 'LinkedIn', 
            icon: Linkedin, 
            bg: 'bg-blue-700 hover:bg-blue-800',
            action: 'linkedin'
        },
        { 
            name: 'Twitter', 
            icon: Twitter, 
            bg: 'bg-sky-500 hover:bg-sky-600',
            action: 'twitter'
        },
        { 
            name: 'Facebook', 
            icon: Facebook, 
            bg: 'bg-blue-600 hover:bg-blue-700',
            action: 'facebook'
        },
    ];

    if (!destination) {
        return null; // Don't render if data hasn't been mapped yet
    }

    // Determine if the full description is long enough to require a "Read More" button
    const requiresExpandButton = (destination.fullDescription?.length || 0) > 200;


    return (
        <>
            {/* Backdrop when share options are open */}
            {showShareOptions && (
                <div 
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={() => setShowShareOptions(false)}
                ></div>
            )}

            {/* Share Button with Options - Bottom Left */}
            <div className="fixed bottom-6 left-6 z-50 flex flex-col-reverse items-center gap-4">
                <button
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className={`bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-full shadow-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-110 flex items-center justify-center border-4 border-white ${
                        showShareOptions ? 'rotate-90' : 'rotate-0'
                    }`}
                >
                    {showShareOptions ? (
                        <X className="w-6 h-6 transition-transform duration-300" />
                    ) : (
                        <Share2 className="w-6 h-6 transition-transform duration-300" />
                    )}
                </button>

                {shareButtons.map((button, index) => (
                    <button
                        key={button.name}
                        onClick={() => handleShare(button.action)}
                        className={`${button.bg} text-white p-4 rounded-full shadow-2xl transition-all duration-300 border-4 border-white ${
                            showShareOptions 
                                ? 'opacity-100 scale-100 translate-y-0' 
                                : 'opacity-0 scale-0 translate-y-20 pointer-events-none'
                        }`}
                        style={{
                            transitionDelay: showShareOptions ? `${index * 50}ms` : `${(shareButtons.length - index - 1) * 30}ms`
                        }}
                        title={button.name}
                    >
                        <button.icon className="w-6 h-6" />
                    </button>
                ))}
            </div>

            <section className="py-20 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
                        {/* Title Section */}
                        <div className="mb-12 opacity-0 animate-slide-down text-center" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                                {destination.title}
                            </h2>
                            <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mx-auto"></div>
                        </div>

                        {/* Content Cards */}
                        <div className="space-y-8 opacity-0 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                            {/* Short Description Card */}
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 border-l-4 border-blue-600 shadow-md hover:shadow-lg transition-shadow duration-300">
                                <p className="text-gray-800 text-lg leading-relaxed font-medium">
                                    {destination.shortDescription}
                                </p>
                            </div>

                            {/* Full Description - Collapsible */}
                            <div
                                className="overflow-hidden transition-all duration-700 ease-in-out"
                                style={{
                                    maxHeight: expanded ? '500px' : '0px',
                                    opacity: expanded ? 1 : 0,
                                    marginTop: expanded ? '32px' : '0px'
                                }}
                            >
                                <div className="bg-white rounded-2xl p-8 border-2 border-blue-200 shadow-md">
                                    <p className="text-gray-700 text-lg leading-relaxed">
                                        {destination.fullDescription}
                                    </p>
                                </div>
                            </div>

                            {/* View More Button */}
                            {requiresExpandButton && (
                                <div className="flex justify-center pt-4">
                                    <button
                                        onClick={toggleViewMore}
                                        className="inline-flex items-center justify-center gap-2 px-8 py-3 text-blue-600 font-semibold bg-blue-50 border-2 border-blue-300 rounded-full hover:bg-blue-100 hover:border-blue-500 transition-all duration-300 group"
                                    >
                                        <span>
                                            {expanded ? 'Read Less' : 'Read More'}
                                        </span>
                                        <svg 
                                            className={`w-5 h-5 transition-transform duration-500 ${expanded ? 'rotate-180' : 'rotate-0'}`}
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-down { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

                .animate-fade-in { animation: fade-in 0.6s ease-out; }
                .animate-slide-down { animation: slide-down 0.6s ease-out; }
                .animate-slide-up { animation: slide-up 0.6s ease-out; }
            `}</style>
        </>
    );
}