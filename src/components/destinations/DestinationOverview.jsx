import React, { useState, useEffect } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link2, X } from 'lucide-react';

/**
 * Component to display the destination's description and social sharing options.
 * It expects to receive the full destination data object fetched from the API.
 */
export default function DestinationDetails({ destinationData }) {
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [currentDestination, setCurrentDestination] = useState(null);
    const [showFullOverview, setShowFullOverview] = useState(false);
    const [showAllGuidelines, setShowAllGuidelines] = useState(false);

    // --- Data Mapping Effect ---
    useEffect(() => {
        if (destinationData) {
            // Map the dynamic API fields to the required structure
            const apiData = destinationData.data || destinationData;
            
            const mappedData = {
                title: apiData.title || 'About Destination',
                overview: apiData.overview || 'No overview available.',
                travelGuidelines: apiData.travel_guidelines || '',
            };
            setCurrentDestination(mappedData);
        }
    }, [destinationData]);

    const destination = currentDestination;

    const handleShare = (platform) => {
        const url = window.location.href;
        const title = destination?.title || 'Check out this awesome trip!';
        
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
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
        return null;
    }

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
                <div className="max-w-7xl mx-auto">
                    <div className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
                        {/* Title Section */}
                        <div className="mb-12 opacity-0 animate-slide-down text-center" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                                {destination.title}
                            </h2>
                            <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mx-auto"></div>
                        </div>

                        {/* Single Blue Container with All Content */}
                        <div className="opacity-0 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-10 md:p-12 border-l-4 border-blue-600 shadow-md hover:shadow-lg transition-shadow duration-300 space-y-8">
                                {/* Overview */}
                                <div>
                                    <h3 className="text-2xl font-semibold text-blue-900 mb-4">
                                        Overview
                                    </h3>
                                    <div className="relative">
                                        <div 
                                            className={`text-gray-800 text-lg leading-relaxed whitespace-pre-line ${!showFullOverview && destination.overview.length > 400 ? 'line-clamp-4' : ''}`}
                                            dangerouslySetInnerHTML={{ 
                                                __html: destination.overview.replace(/\n/g, '<br/>') 
                                            }}
                                        />
                                        {destination.overview.length > 400 && (
                                            <button
                                                onClick={() => setShowFullOverview(!showFullOverview)}
                                                className="mt-3 text-blue-600 hover:text-blue-800 font-medium text-base transition-colors duration-200 flex items-center gap-1"
                                            >
                                                {showFullOverview ? 'View Less' : 'View More'}
                                                <svg 
                                                    className={`w-4 h-4 transition-transform duration-300 ${showFullOverview ? 'rotate-180' : ''}`}
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Travel Guidelines - Only show if available */}
                                {destination.travelGuidelines && (() => {
                                    const allPoints = destination.travelGuidelines
                                        .split('.')
                                        .filter(point => point.trim().length > 0);
                                    const pointsToShow = showAllGuidelines ? allPoints : allPoints.slice(0, 3);
                                    const hasMorePoints = allPoints.length > 3;

                                    return (
                                        <div className="pt-6 border-t-2 border-blue-200">
                                            <h3 className="text-2xl font-semibold text-blue-900 mb-5">
                                                Travel Guidelines
                                            </h3>
                                            <div className="space-y-4">
                                                {pointsToShow.map((point, index) => (
                                                    <div key={index} className="flex items-start gap-3">
                                                        <svg 
                                                            className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" 
                                                            fill="none" 
                                                            stroke="currentColor" 
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path 
                                                                strokeLinecap="round" 
                                                                strokeLinejoin="round" 
                                                                strokeWidth={2} 
                                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                                                            />
                                                        </svg>
                                                        <p className="text-gray-800 text-lg leading-relaxed flex-1">
                                                            {point.trim()}.
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                            {hasMorePoints && (
                                                <button
                                                    onClick={() => setShowAllGuidelines(!showAllGuidelines)}
                                                    className="mt-5 text-blue-600 hover:text-blue-800 font-medium text-base transition-colors duration-200 flex items-center gap-1"
                                                >
                                                    {showAllGuidelines ? 'View Less' : `View More (${allPoints.length - 3} more)`}
                                                    <svg 
                                                        className={`w-4 h-4 transition-transform duration-300 ${showAllGuidelines ? 'rotate-180' : ''}`}
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
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
                
                .line-clamp-4 {
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </>
    );
}