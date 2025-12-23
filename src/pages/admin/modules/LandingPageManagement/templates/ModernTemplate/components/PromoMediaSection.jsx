import React from 'react';
import { motion } from 'framer-motion';

export default function PromoMediaSection({ data }) {
  // 1. Safety Checks: If disabled or no media, render nothing
  if (!data || !data.enabled || !data.media_urls || data.media_urls.length === 0) {
    return null;
  }

  const { type, media_urls } = data;

  // 2. Grid Layout Logic based on number of items
  const getGridClass = (count) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    // Default to 3 columns if more
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`grid ${getGridClass(media_urls.length)} gap-6`}
        >
          {media_urls.map((url, index) => (
            <div 
              key={index} 
              className="relative overflow-hidden rounded-3xl shadow-2xl group h-64 md:h-80 lg:h-96 w-full bg-gray-100"
            >
              {type === 'video' ? (
                <video
                  src={url}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <img 
                    src={url} 
                    alt={`Promo Banner ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Optional Overlay for aesthetics */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}