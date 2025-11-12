import React, { useState, useEffect } from 'react';

/**
 * Component to display the destination's Travel Guidelines.
 * It expects to receive the full destination data object.
 */
export default function DestinationGuidelines({ destinationData }) {
    const [travelGuidelines, setTravelGuidelines] = useState('');
    const [showAllGuidelines, setShowAllGuidelines] = useState(false);

    useEffect(() => {
        if (destinationData) {
            const apiData = destinationData.data || destinationData;
            setTravelGuidelines(apiData.travel_guidelines || '');
        }
    }, [destinationData]);

    if (!travelGuidelines) {
        return null;
    }

    // Process lines to categorize them as HEADINGS or POINTS
    const processedLines = travelGuidelines
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
            // Regex to detect lines starting with a number followed by a period and a space (e.g., "1. Passport")
            const isHeading = /^\d+\.\s/.test(line);

            // Clean the line and determine the type
            const content = line.replace(/^[0-9]+\.\s*/, '').trim();

            return {
                content: content,
                isHeading: isHeading,
                isListPoint: !isHeading, 
            };
        });
    
    // Filter out only the list points to manage the "View More" functionality correctly
    const allListPoints = processedLines.filter(item => item.isListPoint);
    
    // Control "View More" based on list points, not headings
    const initialPointsToShowCount = 5; // Show more points initially for better content visibility
    const pointsToShow = showAllGuidelines ? allListPoints : allListPoints.slice(0, initialPointsToShowCount);
    const hasMorePoints = allListPoints.length > initialPointsToShowCount;

    // Map back to the original structure to render headings and points together
    const getRenderedContent = (showAll) => {
        let listIndex = 0;
        return processedLines.map((item, index) => {
            if (item.isHeading) {
                // Render Heading
                return (
                    <h4 
                        key={index} 
                        className="text-xl font-bold text-blue-800 pt-4 pb-2 mt-4 border-t border-blue-200 first:border-t-0 first:mt-0"
                    >
                        {item.content}
                    </h4>
                );
            } else {
                // Render List Point, but only if it's currently visible
                const isVisible = showAll || listIndex < initialPointsToShowCount;
                listIndex++;

                if (isVisible) {
                    return (
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
                                {item.content}
                            </p>
                        </div>
                    );
                }
                return null;
            }
        });
    };

    return (
        <section className="py-8 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-10 md:p-12 border-l-4 border-blue-600 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-2xl font-bold text-blue-900 mb-6">
                        Travel Guidelines
                    </h3>
                    
                    <div className="space-y-4">
                        {/* Render all content based on visibility state */}
                        {getRenderedContent(showAllGuidelines)}
                    </div>

                    {hasMorePoints && (
                        <button
                            onClick={() => setShowAllGuidelines(!showAllGuidelines)}
                            className="mt-8 text-blue-600 hover:text-blue-800 font-medium text-base transition-colors duration-200 flex items-center gap-1"
                        >
                            {showAllGuidelines ? 'View Less' : `View More (${allListPoints.length - initialPointsToShowCount} more points)`}
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
            </div>
        </section>
    );
}