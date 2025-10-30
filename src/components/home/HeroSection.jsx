import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

export default function HeroSection() {
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden" style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Background image with overlay */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
      </motion.div>

      {/* Centered Content - Heading and Subheading */}
      <motion.div
        className="relative z-10 container mx-auto px-4 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main heading */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-6"
          variants={itemVariants}
        >
          Explore The World With Us
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Discover amazing places and create unforgettable memories
        </motion.p>
      </motion.div>

      {/* Search form at bottom */}
      <motion.div
        className="absolute bottom-8 md:bottom-12 left-0 right-0 z-10 container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-white rounded-lg shadow-2xl p-6 md:p-7 max-w-4xl mx-auto"
          variants={itemVariants}
          whileHover={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}
          transition={{ duration: 0.3 }}
        >
          
          <div className="flex flex-col md:flex-row gap-4">
            {/* Destination input */}
            <motion.div
              className="relative flex-1"
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-10 pr-4 py-3 h-12 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </motion.div>

            {/* Search button */}
            <motion.button
              className="h-12 md:w-40 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg font-semibold rounded-md flex items-center justify-center gap-2 transition-all"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Search className="h-5 w-5" />
              Search
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}