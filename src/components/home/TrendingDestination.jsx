import { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

// Import or define the same destinations data
const destinations = [
  {
    id: 'paris-france',
    name: 'Paris',
    country: 'France',
    destinationId: 'paris-france',
    image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tourCount: 28,
    continent: 'Europe',
  },
  {
    id: 'bali-indonesia',
    name: 'Bali',
    country: 'Indonesia',
    destinationId: 'bali-indonesia',
    image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tourCount: 34,
    continent: 'Asia',
  },
  {
    id: 'tokyo-japan',
    name: 'Tokyo',
    country: 'Japan',
    destinationId: 'tokyo-japan',
    image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tourCount: 22,
    continent: 'Asia',
  },
  {
    id: 'dubai-uae',
    name: 'Dubai',
    country: 'UAE',
    destinationId: 'dubai-uae',
    image: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tourCount: 19,
    continent: 'Asia',
  },
  {
    id: 'santorini-greece',
    name: 'Santorini',
    country: 'Greece',
    destinationId: 'santorini-greece',
    image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tourCount: 16,
    continent: 'Europe',
  },
  {
    id: 'new-york-usa',
    name: 'New York',
    country: 'USA',
    destinationId: 'new-york-usa',
    image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tourCount: 31,
    continent: 'North America',
  },
  {
    id: 'rome-italy',
    name: 'Rome',
    country: 'Italy',
    destinationId: 'rome-italy',
    image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tourCount: 25,
    continent: 'Europe',
  },
  {
    id: 'sydney-australia',
    name: 'Sydney',
    country: 'Australia',
    destinationId: 'sydney-australia',
    image: 'https://images.pexels.com/photos/995765/pexels-photo-995765.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tourCount: 18,
    continent: 'Oceania',
  },
];

// Duplicate destinations for infinite scroll
const infiniteDestinations = [...destinations, ...destinations, ...destinations];

export default function HolidaySection() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const hasMoved = useRef(false);
  const scrollSpeed = useRef(1); // Control scroll speed

  // Same click handler as DestinationList
  const handleDestinationClick = (destinationId) => {
    // Only navigate if we haven't dragged
    if (!hasMoved.current) {
      const url = `/destinfo?destinationId=${destinationId}`;
      window.location.href = url;
    }
  };

  // Handle mouse drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsPaused(true);
    hasMoved.current = false;
    dragStartX.current = e.pageX - scrollRef.current.offsetLeft;
    dragStartScrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.scrollBehavior = 'auto';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragStartX.current) * 1.5;
    
    // If moved more than 5px, consider it a drag
    if (Math.abs(walk) > 5) {
      hasMoved.current = true;
    }
    
    scrollRef.current.scrollLeft = dragStartScrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPaused(false);
    // Reset hasMoved after a short delay to allow click handler to check it
    setTimeout(() => {
      hasMoved.current = false;
    }, 100);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      hasMoved.current = false;
    }
    setIsPaused(false);
    setHoveredCard(null);
  };

  // Handle container hover - pause animation
  const handleContainerMouseEnter = () => {
    setIsPaused(true);
    if (scrollRef.current) {
      scrollRef.current.style.scrollBehavior = 'smooth';
    }
  };

  const handleContainerMouseLeave = () => {
    setIsPaused(false);
    setHoveredCard(null);
    if (scrollRef.current) {
      scrollRef.current.style.scrollBehavior = 'auto';
    }
  };

  // Handle individual card hover
  const handleCardMouseEnter = (cardId) => {
    setHoveredCard(cardId);
    setIsPaused(true); // Ensure animation is paused
  };

  const handleCardMouseLeave = () => {
    setHoveredCard(null);
    // Keep paused if still hovering over container
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const cardWidth = 344; // 320px width + 24px gap
    const setWidth = destinations.length * cardWidth;

    // Start at the middle set
    scrollContainer.scrollLeft = setWidth;

    let lastTime = performance.now();

    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Only scroll if not paused and not dragging
      if (!isPaused && !isDragging && scrollContainer) {
        // Smooth scroll using delta time for consistent speed
        const scrollAmount = (scrollSpeed.current * deltaTime) / 16; // Normalized to 60fps
        scrollContainer.scrollLeft += scrollAmount;

        const currentScroll = scrollContainer.scrollLeft;

        // Reset to middle set for infinite loop (seamlessly)
        if (currentScroll >= setWidth * 2) {
          scrollContainer.scrollLeft = setWidth + (currentScroll - setWidth * 2);
        } else if (currentScroll <= setWidth / 2) {
          scrollContainer.scrollLeft = setWidth + (currentScroll - setWidth / 2);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, isDragging]);

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center opacity-0 animate-fade-in-down">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Dream Destinations
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Whether you crave adventure or relaxation, we've got the perfect escape for every traveler
          </p>
        </div>

        {/* Destinations Carousel */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={handleContainerMouseEnter}
          onMouseLeave={handleContainerMouseLeave}
        >
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ scrollBehavior: 'auto' }}
          >
            {infiniteDestinations.map((destination, index) => (
              <div
                key={`${destination.id}-${index}`}
                className="flex-shrink-0 w-80 opacity-0 animate-scale-in"
                style={{ 
                  animationDelay: `${(index % destinations.length) * 100 + 200}ms`, 
                  animationFillMode: 'forwards' 
                }}
                onMouseEnter={() => handleCardMouseEnter(`${destination.id}-${index}`)}
                onMouseLeave={handleCardMouseLeave}
              >
                {/* Same card design as DestinationList */}
                <div
                  onClick={() => handleDestinationClick(destination.destinationId)}
                  className="group relative h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform-gpu"
                >
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoveredCard === `${destination.id}-${index}` ? 'scale-110' : 'scale-100'
                    }`}
                    draggable="false"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                    <MapPin className="h-4 w-4 text-white" />
                    <span className="text-white text-sm font-medium">{destination.country}</span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className={`text-3xl font-bold text-white mb-2 transition-colors duration-300 ${
                      hoveredCard === `${destination.id}-${index}` ? 'text-blue-300' : ''
                    }`}>
                      {destination.name}, {destination.country}
                    </h3>
                    <p className="text-white/90 font-medium">{destination.tourCount} Tours Available</p>
                  </div>

                  <div className={`absolute inset-0 border-2 transition-colors duration-300 rounded-2xl pointer-events-none ${
                    hoveredCard === `${destination.id}-${index}` ? 'border-blue-400' : 'border-transparent'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out;
          animation-fill-mode: forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </section>
  );
}