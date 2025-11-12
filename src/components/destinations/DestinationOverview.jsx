import React, { useState, useEffect } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link2, X } from 'lucide-react';

export default function DestinationOverview({ destinationData }) {
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [currentDestination, setCurrentDestination] = useState(null);
    const [showFullOverview, setShowFullOverview] = useState(false);

    // --- Data Mapping Effect ---
    useEffect(() => {
        if (destinationData) {
            const apiData = destinationData.data || destinationData;
            const mappedData = {
                overview: apiData.overview || 'No overview available.',
                travelGuidelines: apiData.travel_guidelines || '',
            };
            setCurrentDestination(mappedData);
        }
    }, [destinationData]);

    const destination = currentDestination;

    const handleShare = (platform) => {
        const url = window.location.href;
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(url)}`,
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
        { name: 'Copy Link', icon: Link2, bg: 'bg-gray-700 hover:bg-gray-800', action: 'copy' },
        { name: 'LinkedIn', icon: Linkedin, bg: 'bg-blue-700 hover:bg-blue-800', action: 'linkedin' },
        { name: 'Twitter', icon: Twitter, bg: 'bg-sky-500 hover:bg-sky-600', action: 'twitter' },
        { name: 'Facebook', icon: Facebook, bg: 'bg-blue-600 hover:bg-blue-700', action: 'facebook' },
    ];

    // --- Content Processor ---
    const processOverviewContent = (overviewText) => {
        if (!overviewText) return [];
        return overviewText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map((line, index) => {
                const isPotentialHeading = /^\d+\.\s/.test(line) || line.length < 60;
                return {
                    content: line.replace(/^[0-9]+\.\s*/, '').trim(),
                    isHeading: isPotentialHeading && (index === 0 || /^[^a-z]/.test(line)),
                };
            });
    };

    if (!destination) return null;

    const processedOverview = processOverviewContent(destination.overview);
    const totalLines = processedOverview.length;
    const initialLinesToShow = 6;
    const linesToShow = showFullOverview ? processedOverview : processedOverview.slice(0, initialLinesToShow);
    const hasMoreContent = totalLines > initialLinesToShow;

    return (
        <>
            {/* Backdrop when share options are open */}
            {showShareOptions && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={() => setShowShareOptions(false)}
                ></div>
            )}

            {/* Floating Share Buttons */}
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

            {/* --- Overview Section --- */}
            <section className="py-10 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
                        
                        {/* ✅ Removed title section completely (no margin gap) */}
                        
                        <div className="opacity-0 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-10 md:p-12 border-l-4 border-blue-600 shadow-md hover:shadow-lg transition-shadow duration-300 space-y-4">
                                
                                <h3 className="text-2xl font-semibold text-blue-900 mb-6">
                                    Overview
                                </h3>

                                {linesToShow.map((item, index) => {
                                    if (item.isHeading) {
                                        return (
                                            <h4
                                                key={index}
                                                className="text-xl font-extrabold text-blue-900 pt-4 pb-1 mt-4 border-t border-blue-300 first:border-t-0 first:mt-0"
                                            >
                                                {item.content}
                                            </h4>
                                        );
                                    } else {
                                        return (
                                            <p key={index} className="text-gray-800 text-lg leading-relaxed pt-2">
                                                {item.content}
                                            </p>
                                        );
                                    }
                                })}

                                {hasMoreContent && (
                                    <button
                                        onClick={() => setShowFullOverview(!showFullOverview)}
                                        className="mt-8 text-blue-600 hover:text-blue-800 font-medium text-base transition-colors duration-200 flex items-center gap-1"
                                    >
                                        {showFullOverview ? 'View Less' : `View More (${totalLines - initialLinesToShow} lines)`}
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
                    </div>
                </div>
            </section>

            <style jsx>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

                .animate-fade-in { animation: fade-in 0.6s ease-out; }
                .animate-slide-up { animation: slide-up 0.6s ease-out; }
            `}</style>
        </>
    );
}
