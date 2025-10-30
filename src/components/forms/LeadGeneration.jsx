import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plane, MapPin, Users, Phone } from 'lucide-react';

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.383 0 0 5.383 0 12c0 2.136.53 4.168 1.547 5.948L0 24l6.304-2.016C9.055 23.383 10.464 24 12 24c6.617 0 12-5.383 12-12S18.617 0 12 0zm0 22.08c-1.357 0-2.688-.328-3.847-.963l-.276-.163-2.856.915.963-2.856-.164-.276A10.075 10.075 0 011.92 12c0-5.531 4.529-10.08 10.08-10.08 5.551 0 10.08 4.529 10.08 10.08 0 5.551-4.529 10.08-10.08 10.08z"/>
    <path d="M17.622 14.236c-.306-.153-1.81-.892-2.088-.993-.277-.102-.479-.153-.68.153-.204.306-.788.993-.966 1.194-.179.204-.356.229-.662.076-.307-.153-1.291-.476-2.456-1.515-.908-.837-1.52-1.87-1.697-2.177-.178-.306-.019-.471.134-.623.137-.137.306-.357.459-.535.153-.178.204-.306.306-.51.102-.204.052-.381-.025-.535-.077-.153-.68-1.638-.932-2.243-.246-.585-.497-.506-.68-.515-.176-.009-.38-.012-.583-.012-.203 0-.533.076-.812.381-.279.306-1.066 1.04-1.066 2.533 0 1.493 1.093 2.937 1.246 3.141.153.204 2.149 3.283 5.205 4.596.727.313 1.295.5 1.736.64.729.233 1.39.201 1.912.121.583-.087 1.8-.736 2.053-1.445.253-.71.253-1.318.178-1.445-.076-.127-.279-.204-.583-.357z"/>
  </svg>
);

export default function AdventureCTA() {
  const [isPlanTripOpen, setIsPlanTripOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    destination: '',
    departureCity: '',
    travelDate: '',
    flexibleDates: false,
    adults: 1,
    children: 0,
    infants: 0,
    hotelCategory: 'budget',
    fullName: '',
    contactNumber: '',
    email: '',
    comments: '',
    captcha: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNumberChange = (name, delta) => {
    setFormData(prev => ({
      ...prev,
      [name]: Math.max(0, prev[name] + delta)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you! We will get back to you soon.');
    setIsPlanTripOpen(false);
  };

  return (
    <>
      {/* CTA Section */}
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <motion.div 
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background Video with Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-teal-900/80 to-slate-800/70 z-10"></div>
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://cdn.coverr.co/videos/coverr-aerial-view-of-beautiful-resort-4803/1080p.mp4" type="video/mp4" />
          </video>
          
          {/* Content */}
          <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between p-5 md:p-6 min-h-[200px]">
            <div className="text-white mb-4 lg:mb-0 lg:max-w-md">
              <motion.h2 
                className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 leading-tight"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Dreaming of your next Adventure?
              </motion.h2>
              <motion.p 
                className="text-base md:text-lg font-medium mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Hit us up!
              </motion.p>
              <motion.button
                onClick={() => setIsPlanTripOpen(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-2.5 rounded-lg text-sm shadow-lg transition-all transform hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Connect Now
              </motion.button>
            </div>

            {/* Phone Mockup */}
            <motion.div 
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-40">
                <img 
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=250&h=500&fit=crop" 
                  alt="Mobile App" 
                  className="rounded-xl shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Plan Your Trip Modal */}
      <AnimatePresence>
        {isPlanTripOpen && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/60 z-50" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsPlanTripOpen(false)} 
            />
            
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
              <motion.div 
                className="bg-white w-full h-[96vh] sm:h-auto sm:rounded-2xl shadow-2xl sm:w-full sm:max-w-5xl relative sm:max-h-[92vh] overflow-hidden flex flex-col"
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => setIsPlanTripOpen(false)} 
                  className="absolute right-2 top-2 sm:right-4 sm:top-4 z-20 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1.5 sm:p-2 shadow-lg"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col lg:flex-row h-full overflow-hidden">
                  {/* Sidebar */}
                  <div className="hidden lg:block lg:w-2/5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-6 text-white overflow-y-auto">
                    <div className="flex items-center gap-3 mb-4">
                      <Plane className="h-6 w-6" />
                      <h3 className="text-xl font-bold">Travel Co.</h3>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-4xl font-bold">4.9</span>
                        <div className="flex text-yellow-400 text-xl">★★★★★</div>
                      </div>
                      <p className="text-indigo-200 text-sm">Excellent on Google</p>
                      <p className="text-indigo-300 text-xs">Based on 1,245 reviews</p>
                    </div>

                    <div className="space-y-3 mb-4">
                      <h4 className="text-lg font-semibold border-b border-indigo-400 pb-2">Why Choose Us?</h4>
                      
                      <div className="flex gap-3">
                        <MapPin className="h-5 w-5 text-indigo-300 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-base">Personalized Planning</h5>
                          <p className="text-indigo-200 text-sm">Tailored to your needs</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Users className="h-5 w-5 text-indigo-300 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-base">Expert Knowledge</h5>
                          <p className="text-indigo-200 text-sm">Insider tips included</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Phone className="h-5 w-5 text-indigo-300 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-base">24/7 Support</h5>
                          <p className="text-indigo-200 text-sm">Always here to help</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-indigo-400 pt-4">
                      <h4 className="text-sm font-semibold mb-2">Contact Us</h4>
                      <p className="text-indigo-200 text-sm mb-1">support@travelco.com</p>
                      <p className="text-indigo-200 text-sm mb-3">+91 987 654 3210</p>
                      <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm">
                        <WhatsAppIcon />
                        Chat on WhatsApp
                      </button>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Plan Your Trip</h2>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3">Fill details to get a custom quote</p>

                    <form onSubmit={handleSubmit} className="space-y-2.5">
                      {/* Destination & Departure */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Destination *</label>
                          <input 
                            type="text" 
                            name="destination" 
                            placeholder="E.g., Paris" 
                            value={formData.destination} 
                            onChange={handleInputChange} 
                            className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Departure City *</label>
                          <input 
                            type="text" 
                            name="departureCity" 
                            placeholder="E.g., Delhi" 
                            value={formData.departureCity} 
                            onChange={handleInputChange} 
                            className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                            required 
                          />
                        </div>
                      </div>

                      {/* Travel Dates */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                        <input 
                          type="date" 
                          name="travelDate" 
                          value={formData.travelDate} 
                          onChange={handleInputChange} 
                          className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                        />
                        <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="flexibleDates" 
                            checked={formData.flexibleDates} 
                            onChange={handleInputChange} 
                            className="w-3 h-3 text-indigo-600 rounded" 
                          />
                          <span className="text-xs sm:text-sm text-gray-700">Flexible dates</span>
                        </label>
                      </div>

                      {/* Travelers */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Travelers</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { key: 'adults', label: 'Adults (12+)' },
                            { key: 'children', label: 'Children (2-11)' },
                            { key: 'infants', label: 'Infants (0-2)' }
                          ].map(({ key, label }) => (
                            <div key={key}>
                              <label className="block text-xs text-gray-600 mb-0.5">{label}</label>
                              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button 
                                  type="button" 
                                  onClick={() => handleNumberChange(key, -1)} 
                                  className="px-1.5 py-1 sm:px-2 sm:py-1.5 bg-gray-100 hover:bg-gray-200 text-sm"
                                >
                                  -
                                </button>
                                <input 
                                  type="number" 
                                  name={key} 
                                  value={formData[key]} 
                                  readOnly 
                                  className="w-full text-center border-0 text-sm focus:outline-none py-1" 
                                />
                                <button 
                                  type="button" 
                                  onClick={() => handleNumberChange(key, 1)} 
                                  className="px-1.5 py-1 sm:px-2 sm:py-1.5 bg-gray-100 hover:bg-gray-200 text-sm"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Hotel Category */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Hotel Category</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                          {['budget', '3star', '4star', '5star'].map((cat) => (
                            <label key={cat} className="flex items-center gap-1 cursor-pointer">
                              <input 
                                type="radio" 
                                name="hotelCategory" 
                                value={cat} 
                                checked={formData.hotelCategory === cat} 
                                onChange={handleInputChange} 
                                className="w-3 h-3 text-indigo-600" 
                              />
                              <span className="text-xs sm:text-sm text-gray-700">
                                {cat === 'budget' ? 'Budget' : cat.replace('star', '★')}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                          <input 
                            type="text" 
                            name="fullName" 
                            placeholder="Your name" 
                            value={formData.fullName} 
                            onChange={handleInputChange} 
                            className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                          <input 
                            type="tel" 
                            name="contactNumber" 
                            placeholder="Phone" 
                            value={formData.contactNumber} 
                            onChange={handleInputChange} 
                            className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                            required 
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input 
                          type="email" 
                          name="email" 
                          placeholder="your@email.com" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                          required 
                        />
                      </div>

                      {/* Comments */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Comments</label>
                        <textarea 
                          name="comments" 
                          placeholder="Special requirements..." 
                          value={formData.comments} 
                          onChange={handleInputChange} 
                          rows="2" 
                          className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                        />
                      </div>

                      {/* CAPTCHA */}
                      <div className="border-2 border-indigo-200 rounded-lg p-2.5 bg-indigo-50">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Security Check *</label>
                        <div className="flex items-center gap-2">
                          <div className="bg-white px-3 py-1.5 rounded-lg border-2 border-indigo-600 text-indigo-600 font-bold text-sm">
                            9 + 4 = ?
                          </div>
                          <input 
                            type="text" 
                            name="captcha" 
                            placeholder="Answer" 
                            value={formData.captcha} 
                            onChange={handleInputChange} 
                            className="flex-1 px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                            required 
                          />
                        </div>
                      </div>

                      {/* Submit */}
                      <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 sm:py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all text-sm"
                      >
                        Get My Custom Quote
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}