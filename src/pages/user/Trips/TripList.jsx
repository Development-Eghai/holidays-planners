import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapPin, Sliders, Star, X, ChevronLeft, ChevronRight } from 'lucide-react';

// --- External Component Import ---
// Assuming the path relative to the ToursListingPage.jsx file
import TripCard from "../../../components/trips/TripCard";

// --- API Configuration ---
const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ";
const IMAGE_BASE_URL = "https://api.yaadigo.com/uploads/"; 

// Helper to get full image URL
const getFullImageUrl = (path) => 
    !path || typeof path !== "string" ? '' : 
    path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;

// --- MODAL PLACEHOLDER ---
const TripInquiryModal = ({ isOpen, onClose, tripName }) => {
    return isOpen ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-2xl">
                <h2 className="text-xl font-bold">Inquiry for: {tripName}</h2>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Close</button>
            </div>
        </div>
    ) : null;
};


// --------------------------------------------------------------------------------
// --- TOURS LISTING PAGE (Main Component) ----------------------------------------
// --------------------------------------------------------------------------------

export default function ToursListingPage() {
    const [searchParams] = useSearchParams();
    const [sortBy, setSortBy] = useState('popular');
    const [priceRange, setPriceRange] = useState([0, 500000]);
    const [selectedDurations, setSelectedDurations] = useState([]);
    const [selectedDestinations, setSelectedDestinations] = useState([]); 
    const [selectedTripTypes, setSelectedTripTypes] = useState([]); 
    const [selectedCategories, setSelectedCategories] = useState([]); 
    const [showFilters, setShowFilters] = useState(false);
    
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTripName, setSelectedTripName] = useState('');

    const [apiTours, setApiTours] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [destinations, setDestinations] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    
    const [showAllDestinations, setShowAllDestinations] = useState(false);
    const scrollRef = useRef(null);
    const scrollStep = 300; 

    // --- Navigation Handlers ---
    const scrollCategories = (direction) => {
        if (scrollRef.current) {
            const currentScroll = scrollRef.current.scrollLeft;
            const newScroll = direction === 'left' ? currentScroll - scrollStep : currentScroll + scrollStep;
            scrollRef.current.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
        }
    };

    // --- Filter Handlers ---
    const handleClearFilters = () => {
        setSelectedDurations([]);
        setSelectedDestinations([]); 
        setSelectedTripTypes([]); 
        setSelectedCategories([]);
        setPriceRange([0, 500000]);
        setShowFilters(false);
    };

    const handleCategoryClick = (categoryId) => {
        setSelectedCategories(prev =>
          prev.includes(categoryId) ? [] : [categoryId]
        );
    };
    
    const handleDurationChange = (duration) => {
        setSelectedDurations(prev =>
          prev.includes(duration)
            ? prev.filter(d => d !== duration)
            : [...prev, duration]
        );
    };

    const handleDestinationChange = (destinationId) => {
        setSelectedDestinations(prev =>
            prev.includes(destinationId)
                ? prev.filter(id => id !== destinationId)
                : [...prev, destinationId]
        );
    };

    const handleTripTypeChange = (type) => {
        setSelectedTripTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };
    
    // --- FETCH CATEGORIES --- (Same as before)
    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/categories/`, { headers: { "x-api-key": API_KEY }});
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const json = await response.json();
            
            const dynamicCategories = (json.data || []).map(cat => ({
                id: String(cat._id || cat.id),
                name: cat.name,
                slug: cat.slug,
                image: Array.isArray(cat.image) && cat.image.length > 0 ? getFullImageUrl(cat.image[0]) : null, 
            }));

            setCategories(dynamicCategories);
        } catch (error) {
            console.error("🚨 Failed to fetch categories:", error);
        }
    }, []);

    // --- FETCH DESTINATIONS --- (Same as before)
    const fetchDestinations = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/destinations/`, { headers: { "x-api-key": API_KEY }});
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const json = await response.json();
            
            const fetchedDestinations = (json.data || []).map(dest => ({
                id: String(dest._id || dest.id),
                name: dest.title || dest.name, 
            }));

            setDestinations(fetchedDestinations);
        } catch (error) {
            console.error("🚨 Failed to fetch destinations:", error);
        }
    }, []);
    
    // --- FETCH TOURS (FIXED pricing_model standardization) ---
    const fetchTours = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
            const response = await fetch(`${API_URL}/trips/`, { headers: { "x-api-key": API_KEY }});
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const json = await response.json();
            const tours = json.data || [];

            const standardizedTours = tours.map(tour => {
                
                let standardizedPricingModel = tour.pricing_model || 'customized';
                if (standardizedPricingModel.toLowerCase() === 'custom') {
                    standardizedPricingModel = 'customized';
                }

                // Calculate Price: Prioritize customized final price, then fixed departure cost
                const customPrice = tour.pricing?.customized?.final_price;
                const fixedPrice = tour.pricing?.fixed_departure?.[0]?.costingPackages?.[0]?.final_price;
                const finalPrice = customPrice !== undefined ? customPrice : (fixedPrice !== undefined ? fixedPrice : 0);
                
                // MOCK/FALLBACK VALUES (To match the visual design and the common TripCard expected props)
                const toursAvailableCount = tour.trip_count || tour.fixed_departure?.length || (Math.floor(Math.random() * 20) + 5);
                
                // Final Price Formatting is done inside the TripCard when accessing trip.pricing...
                // We pass the raw data here for filtering/sorting consistency.

                return {
                    ...tour,
                    id: tour._id || tour.id || `temp-${Math.random().toString(36).substring(7)}`, 
                    price: finalPrice, 
                    rating: tour.rating || 4.5, // Used by TripCard
                    category_ids: Array.isArray(tour.category_id) ? tour.category_id.map(String) : [],
                    destination_id: String(tour.destination_id) || null, 
                    pricing_model: standardizedPricingModel,
                    days: tour.days || 0,
                    nights: tour.nights || 0,
                    location: tour.pickup_location || 'Unknown',
                    image: tour.hero_image,
                    // Use the specific API path for image URL in the common component
                    hero_image: tour.hero_image, 
                    toursAvailable: `${toursAvailableCount} Tours Available`, // Used by TripCard
                    // Pass the raw number for filtering/sorting
                    discount: tour.pricing?.customized?.discount || 0, 
                }
            });

            setApiTours(standardizedTours);

        } catch (error) {
            console.error("🚨 Failed to fetch tours:", error);
            setFetchError("Failed to load tours.");
            setApiTours([]); 
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTours();
        fetchCategories(); 
        fetchDestinations(); 
    }, [fetchTours, fetchCategories, fetchDestinations]); 

    // --- Filtering and Sorting Logic (Same as before) ---
    const applyFilters = (item) => {
        const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
        const matchesCategoryFilter = selectedCategories.length === 0 || selectedCategories.some(catId => item.category_ids.includes(catId)); 
        const matchesDuration = selectedDurations.length === 0 || selectedDurations.some(d => {
            if (d === '1-3') return item.days >= 1 && item.days <= 3;
            if (d === '4-7') return item.days >= 4 && item.days <= 7;
            if (d === '8-14') return item.days >= 8 && item.days <= 14;
            if (d === '15+') return item.days >= 15;
            return false;
        });
        const matchesDestination = selectedDestinations.length === 0 || selectedDestinations.includes(item.destination_id);
        const matchesTripType = selectedTripTypes.length === 0 || selectedTripTypes.includes(item.pricing_model);
        return matchesPrice && matchesDuration && matchesCategoryFilter && matchesDestination && matchesTripType;
    };
    
    const filteredTours = useMemo(() => apiTours.filter(applyFilters), 
        [apiTours, priceRange, selectedDurations, selectedCategories, selectedDestinations, selectedTripTypes]
    );

    const sortedTours = useMemo(() => {
        return [...filteredTours].sort((a, b) => {
            if (sortBy === 'popular') return (b.rating || 0) - (a.rating || 0); 
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
            return 0;
        });
    }, [filteredTours, sortBy]);
    
    const handleQueryClick = (trip) => {
        setModalOpen(true);
        setSelectedTripName(trip.title);
    };

    const getTotalFilteredCount = () => sortedTours.length;

    // --- RENDER CHECKS (Same as before) ---
    if (isLoading) {
        return (
            <div className="py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-500 mt-4">Loading data...</p>
            </div>
        );
    }

    if (fetchError) {
        return <div className="text-center py-20 text-lg text-red-600">{fetchError}</div>;
    }

    // --- MAIN RENDER ---
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
                
                <div className="mb-4 sm:mb-8 bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-6">
                    
                    {/* --- HEADER & SORTING --- */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Explore Tours</h1>
                            <p className="text-gray-600 text-sm mt-0.5">Showing **{getTotalFilteredCount()}** tours</p>
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="popular">Most Popular</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                        </select>
                    </div>

                    {/* --- DYNAMIC CATEGORY SLIDER (Content Omitted for Brevity) --- */}
                    {/* ... (Category Slider Rendering Logic) ... */}
                    {categories.length > 0 ? (
                        <div className="relative">
                            <div ref={scrollRef} className="flex justify-start overflow-x-auto pb-4 custom-scrollbar-hide">
                                <div className="flex gap-6 whitespace-nowrap justify-center">
                                    {categories.map((category) => {
                                        const isSelected = selectedCategories.includes(category.id);
                                        const colorHash = category.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 5;
                                        const fallbackColors = ['bg-orange-600', 'bg-teal-500', 'bg-blue-600', 'bg-purple-500', 'bg-gray-700'];
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => handleCategoryClick(category.id)}
                                                className={`flex flex-col items-center gap-2 flex-shrink-0 transition-transform duration-300 ${isSelected ? 'scale-105' : 'hover:scale-105'} p-1`}
                                            >
                                                <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 relative overflow-hidden ${isSelected ? 'ring-4 ring-offset-2 ring-blue-500' : 'bg-gray-100'}`}>
                                                    {category.image ? (<img src={category.image} alt={category.name} className={`w-full h-full object-cover transition-opacity duration-300 ${isSelected ? 'opacity-70' : 'opacity-100'}`}/>) : (
                                                        <div className={`w-full h-full flex items-center justify-center text-white font-bold ${fallbackColors[colorHash]}`}>
                                                            {category.name[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className={`text-xs font-semibold text-center whitespace-nowrap transition-colors ${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>
                                                    {category.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <button onClick={() => scrollCategories('left')} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 z-10 hidden sm:block border border-gray-200"><ChevronLeft className="w-5 h-5 text-gray-700" /></button>
                            <button onClick={() => scrollCategories('right')} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 z-10 hidden sm:block border border-gray-200"><ChevronRight className="w-5 h-5 text-gray-700" /></button>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 text-sm">No categories available.</p>
                    )}
                </div>
                
                <div className="flex gap-4 sm:gap-8 relative">
                    
                    {/* Mobile Filter Toggle Button */}
                    <div className="lg:hidden w-full mb-4">
                        <button onClick={() => setShowFilters(true)} className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-semibold flex items-center justify-center gap-2">
                            <Sliders className="w-5 h-5" /> Show Filters
                        </button>
                    </div>

                    {/* Overlay for Mobile */}
                    {showFilters && (<div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowFilters(false)}/>)}

                    {/* Sidebar Container (Content Omitted for Brevity) */}
                    <aside className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-0 w-80 flex-shrink-0 transform transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                        <div className="bg-white rounded-none lg:rounded-2xl shadow-xl p-4 sm:p-6 h-full lg:sticky lg:top-8 lg:max-h-[calc(100vh-100px)] overflow-y-auto">
                            
                            <div className="flex items-center justify-between mb-6 lg:hidden">
                                <h3 className="text-xl font-bold">Filters</h3>
                                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                            </div>
                            
                            <h3 className="hidden lg:block text-xl font-bold mb-6">Filter Options</h3>
                            {/* Price Range Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Price Range</label>
                                <input type="range" min="0" max="500000" step="10000" value={priceRange[1]} onChange={(e) => setPriceRange([0, parseInt(e.target.value)])} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                                <div className="flex justify-between mt-2 text-sm text-gray-600">
                                    <span>₹0</span>
                                    <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            {/* Duration Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Duration</label>
                                {['1-3', '4-7', '8-14', '15+'].map(duration => (<label key={duration} className="flex items-center mb-2.5 cursor-pointer group">
                                        <input type="checkbox" checked={selectedDurations.includes(duration)} onChange={() => handleDurationChange(duration)} className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"/>
                                        <span className="ml-2.5 text-gray-700 group-hover:text-gray-900 select-none">{duration === '15+' ? '15+ days' : `${duration} days`}</span>
                                    </label>))}
                            </div>

                            {/* Destination Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Destination</label>
                                {destinations.length > 0 ? (<>
                                        <div className={`transition-max-height duration-500 overflow-y-auto ${showAllDestinations ? 'max-h-96' : 'max-h-40'}`}>
                                            {destinations.map(dest => (<label key={dest.id} className="flex items-start mb-2.5 cursor-pointer group">
                                                    <input type="checkbox" checked={selectedDestinations.includes(dest.id)} onChange={() => handleDestinationChange(dest.id)} className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0 mt-0.5"/>
                                                    <span className="ml-2.5 text-gray-700 group-hover:text-gray-900 select-none leading-snug">{dest.name}</span>
                                                </label>))}
                                        </div>
                                        {destinations.length > 5 && (<button onClick={() => setShowAllDestinations(prev => !prev)} className="mt-2 text-sm text-blue-600 hover:underline font-medium">
                                                {showAllDestinations ? 'View Less' : `View More (${destinations.length} destinations)`}
                                            </button>)}
                                    </>) : (<p className="text-xs text-gray-500">Loading destinations...</p>)}
                            </div>

                            {/* Trip Type Filter (Fixed/Customized) */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Trip Type</label>
                                {['fixed_departure', 'customized'].map(type => (<label key={type} className="flex items-center mb-2.5 cursor-pointer group">
                                        <input type="checkbox" checked={selectedTripTypes.includes(type)} onChange={() => handleTripTypeChange(type)} className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"/>
                                        <span className="ml-2.5 text-gray-700 group-hover:text-gray-900 select-none">{type === 'fixed_departure' ? 'Fixed Departure' : 'Customized'}</span>
                                    </label>))}
                            </div>

                            {/* Clear Filters Button */}
                            <button onClick={handleClearFilters} className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors active:scale-95">
                                Clear All Filters
                            </button>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        {/* --- MAIN TRIPS LISTING (3-IN-A-ROW) --- */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                            {sortedTours.map((tour) => (
                                <TripCard 
                                    key={tour.id} 
                                    trip={tour} 
                                    onSendQuery={handleQueryClick}
                                />
                            ))}
                        </div>

                        {sortedTours.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-gray-500 text-lg">
                                    No tours found matching the selected filters.
                                </p>
                            </div>
                        )}
                        
                    </main>
                </div>
            </div>

            {/* Modal component placeholder */}
            <TripInquiryModal 
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)} 
                tripName={selectedTripName} 
            />

            {/* Custom CSS (Same as before) */}
            <style jsx>{`
                /* Hide native scrollbars on the category slider */
                .custom-scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .custom-scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                /* Defining a specific utility class for max-height transition */
                .transition-max-height {
                    transition-property: max-height;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                    transition-duration: 500ms;
                }
            `}</style>
        </div>
    );
}