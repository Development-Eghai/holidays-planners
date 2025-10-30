import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Backpack, Bus, Plane, Mountain, PartyPopper, Briefcase } from 'lucide-react';

const categories = [
  {
    name: 'Backpacking',
    label: 'Trips',
    slug: 'backpacking',
    icon: Backpack,
    color: 'bg-gradient-to-br from-orange-500 to-red-500',
    shadowColor: 'shadow-orange-500/50',
    hoverColor: 'group-hover:text-orange-600',
  },
  {
    name: 'Weekend',
    label: 'Getaways',
    slug: 'weekend',
    icon: Bus,
    color: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    shadowColor: 'shadow-emerald-500/50',
    hoverColor: 'group-hover:text-emerald-600',
  },
  {
    name: 'International',
    label: 'Trips',
    slug: 'international',
    icon: Plane,
    color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    shadowColor: 'shadow-blue-500/50',
    hoverColor: 'group-hover:text-blue-600',
  },
  {
    name: 'Adventure',
    label: 'Treks',
    slug: 'adventure',
    icon: Mountain,
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    shadowColor: 'shadow-purple-500/50',
    hoverColor: 'group-hover:text-purple-600',
  },
  {
    name: 'Honeymoon',
    label: 'Trips',
    slug: 'honeymoon',
    icon: PartyPopper,
    color: 'bg-gradient-to-br from-rose-500 to-pink-600',
    shadowColor: 'shadow-rose-500/50',
    hoverColor: 'group-hover:text-rose-600',
  },
  {
    name: 'Corporate',
    label: 'Trips',
    slug: 'corporate',
    icon: Briefcase,
    color: 'bg-gradient-to-br from-slate-600 to-gray-700',
    shadowColor: 'shadow-slate-600/50',
    hoverColor: 'group-hover:text-slate-600',
  },
];

export default function CategoriesSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  const handleCategoryClick = (slug) => {
    console.log(`Clicked category: ${slug}`);
    navigate(`/triplist?travelStyle=${slug}`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Find Your Travel Style
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Whether you crave adrenaline or relaxation, we've got trips for every mood
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16 max-w-6xl mx-auto">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isHovered = hoveredIndex === index;
            
            return (
              <div
                key={category.slug}
                className="opacity-0 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div
                  className="flex flex-col items-center gap-3 cursor-pointer group"
                  onClick={() => handleCategoryClick(category.slug)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className={`w-24 h-24 md:w-28 md:h-28 rounded-full ${category.color} flex items-center justify-center shadow-lg transition-all duration-300 ease-out ${
                      isHovered 
                        ? `${category.shadowColor} shadow-2xl -translate-y-2 scale-110` 
                        : ''
                    }`}
                  >
                    <Icon className="h-10 w-10 md:h-12 md:w-12 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="text-center">
                    <p className={`font-semibold text-gray-800 text-base md:text-lg ${category.hoverColor} transition-all duration-200 ${
                      isHovered ? 'scale-105' : ''
                    }`}>
                      {category.name}
                    </p>
                    <p className={`font-semibold text-gray-800 text-base md:text-lg ${category.hoverColor} transition-all duration-200 ${
                      isHovered ? 'scale-105' : ''
                    }`}>
                      {category.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </section>
  );
}