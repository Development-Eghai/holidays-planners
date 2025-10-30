import { useState, useEffect } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link2, X } from 'lucide-react';

const destinationData = {
  'jibhi': {
    title: 'About Jibhi Valley Tour Packages',
    shortDescription: 'Escape the urban madness and soak in the charm of the Himalayas with Go4Explore\'s best-suited Jibhi Valley Tour Packages to explore one of the most stunning region nestled in the mighty Himalayas.',
    fullDescription: 'With 7 years of experience, our travel experts leave no stone unturned in curating memorable Jibhi Valley tour packages from Delhi, Bangalore, Hyderabad, Chennai, Mumbai, Ahmedabad, Vadodara, Kolkata, or any city in India to quench your wanderlust soul. Jibhi Valley offers breathtaking views, pristine waterfalls, lush meadows, and adventure activities that make it a perfect destination for nature lovers and trekkers. Our carefully designed itineraries ensure you experience the best of what this valley has to offer, from serene camping sites to thrilling trekking trails. We handle all logistics so you can focus on creating unforgettable memories.'
  },
  'bali-indonesia': {
    title: 'About Bali Trip Packages',
    shortDescription: 'Discover the magical beauty of Kasol with Go4Explore\'s premium Kheerganga Trek Packages. Trek through pristine forests and reach the stunning hot springs nestled in the mountains.',
    fullDescription: 'With over 7 years of expertise, our team crafts exceptional Kasol tour packages from major Indian cities. Kasol is known as the "Amsterdam of India" and offers the perfect blend of adventure and relaxation. The Kheerganga Trek is a highlight, featuring mesmerizing views of the Parvati Valley and natural hot springs. Our packages include expert guides, comfortable accommodations, and curated experiences that let you explore the local culture, enjoy delicious food, and participate in exciting outdoor activities. Whether you\'re a seasoned trekker or a beginner, we have the perfect itinerary for you.'
  },
  'chopta': {
    title: 'About Chopta-Tungnath-Deoriatal Tour Packages',
    shortDescription: 'Experience the serene beauty of Chopta, known as the "Mini Switzerland of India", with our expertly curated tour packages designed for nature enthusiasts.',
    fullDescription: 'Chopta offers an enchanting escape into nature with its verdant meadows, dense forests, and panoramic mountain views. Our comprehensive tour packages include visits to Tungnath, the highest Shiva temple in India, and the pristine Deoriatal Lake. With 7 years of experience, we provide meticulously planned itineraries from all major Indian cities. Our packages feature comfortable stays, local expertise, and guided treks that showcase the natural beauty and spiritual significance of this region. Ideal for families, couples, and solo travelers seeking tranquility and adventure.'
  },
  'yulia': {
    title: 'About Yulia Kanda Trek Packages',
    shortDescription: 'Challenge yourself with the thrilling Yulia Kanda Trek, offering stunning Himalayan vistas and unforgettable mountain experiences curated by Go4Explore.',
    fullDescription: 'The Yulia Kanda Trek is a moderate to challenging trek that rewards trekkers with breathtaking Himalayan panoramas and pristine alpine meadows. Our experienced team has designed these packages to offer the perfect balance of adventure and comfort. Starting from various Indian cities, we provide all-inclusive packages with expert guides, nutritious meals, and safe accommodations. The trek passes through picturesque villages, dense forests, and rocky terrain, offering ample opportunities for photography and nature observation. Whether you\'re an experienced trekker or looking to challenge yourself, our Yulia Kanda packages cater to all skill levels.'
  },
  'hampta': {
    title: 'About Hampta Pass Trek Packages',
    shortDescription: 'Embark on an epic 5-day Hampta Pass Trek adventure through diverse landscapes, from lush forests to alpine meadows and snow-capped peaks.',
    fullDescription: 'The Hampta Pass Trek is a classic trekking experience that takes you through some of the most diverse and stunning landscapes in the Himalayas. This 5-day trek transitions from the green forests of Kullu to the barren landscapes of Spiti, offering incredible biodiversity and natural beauty. Our carefully curated packages include experienced guides, well-planned itineraries, and comfortable camping arrangements. We handle all logistics including permits, supplies, and emergency support. This trek is perfect for adventure seekers looking for a multi-day mountain experience that tests your endurance while rewarding you with unforgettable views.'
  },
  'kedarkantha': {
    title: 'About Kedarkantha Trek Packages',
    shortDescription: 'Embark on a 6-day Kedarkantha Trek adventure featuring snow-capped peaks, alpine meadows, and the stunning Keda Summit offering 360-degree mountain views.',
    fullDescription: 'Kedarkantha is one of the most rewarding winter treks in the Indian Himalayas, offering snow-covered landscapes and pristine alpine meadows. Our 6-day packages from major Indian cities are designed to provide a complete high-altitude trekking experience. The trek features multiple camps at varying altitudes, allowing proper acclimatization, and culminates at the Keda Summit offering panoramic views of surrounding peaks. Our expert guides, nutritious meals, and comfortable accommodations ensure a safe and enjoyable journey. The trek is suitable for both beginners and experienced trekkers, with our team providing comprehensive support throughout.'
  },
  'valley': {
    title: 'About Valley of Flowers Tour Packages',
    shortDescription: 'Witness the natural splendor of the Valley of Flowers, a UNESCO World Heritage Site showcasing thousands of blooming alpine flowers in the Himalayas.',
    fullDescription: 'The Valley of Flowers is a breathtaking UNESCO World Heritage Site that showcases the incredible biodiversity of the Indian Himalayas. Our 7-day tour packages take you through meadows carpeted with wildflowers, alongside pristine streams, and through diverse ecosystems. The best time to visit is July to September when the valley is in full bloom. Our packages include guided treks with local experts, comfortable accommodations, and opportunities to explore nearby attractions. We ensure proper acclimatization and provide all necessary support for a safe and memorable experience. This is an ideal destination for nature photographers and lovers of pristine wilderness.'
  },
  'triund': {
    title: 'About Triund Trek Packages',
    shortDescription: 'Experience the exhilarating Triund Trek, a short but stunning 2-day adventure offering panoramic views of the Dhauladhar Mountains and Kangra Valley.',
    fullDescription: 'The Triund Trek is a perfect getaway for those seeking a quick mountain escape without compromising on natural beauty. This 2-day trek from McLeod Ganj offers stunning views of the Dhauladhar range and the Kangra Valley. Our packages include professional guides, comfortable lodging at Triund, and well-planned meals. The trek starts from McLeod Ganj and ascends through pine forests to reach the Triund meadow, where you can enjoy sunsets and sunrises with spectacular mountain backdrops. Ideal for beginners, families, and busy travelers looking for a rejuvenating mountain experience in just 2 days.'
  }
};

export default function DestinationDetails({ destinationId: propDestinationId = 'jibhi' }) {
  const [expanded, setExpanded] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [destinationId, setDestinationId] = useState(propDestinationId);
  const [currentDestination, setCurrentDestination] = useState(destinationData[propDestinationId]);

  useEffect(() => {
    // Get destinationId from URL query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const urlDestinationId = searchParams.get('destinationId');
    
    if (urlDestinationId) {
      setDestinationId(urlDestinationId);
      setCurrentDestination(destinationData[urlDestinationId] || destinationData['jibhi']);
    } else {
      setDestinationId(propDestinationId);
      setCurrentDestination(destinationData[propDestinationId]);
    }
    setExpanded(false);
  }, [propDestinationId]);

  // Listen for URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const urlDestinationId = searchParams.get('destinationId');
      
      if (urlDestinationId) {
        setDestinationId(urlDestinationId);
        setCurrentDestination(destinationData[urlDestinationId] || destinationData['jibhi']);
        setExpanded(false);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const destination = currentDestination;

  const toggleViewMore = () => {
    setExpanded(!expanded);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = destination.title;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
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
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </>
  );
}