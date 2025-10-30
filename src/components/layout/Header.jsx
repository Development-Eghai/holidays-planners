import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Search,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Clock,
  Phone,
  Plane,
  MapPin,
  Users
} from 'lucide-react';

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.383 0 0 5.383 0 12c0 2.136.53 4.168 1.547 5.948L0 24l6.304-2.016C9.055 23.383 10.464 24 12 24c6.617 0 12-5.383 12-12S18.617 0 12 0zm0 22.08c-1.357 0-2.688-.328-3.847-.963l-.276-.163-2.856.915.963-2.856-.164-.276A10.075 10.075 0 011.92 12c0-5.531 4.529-10.08 10.08-10.08 5.551 0 10.08 4.529 10.08 10.08 0 5.551-4.529 10.08-10.08 10.08z"/>
    <path d="M17.622 14.236c-.306-.153-1.81-.892-2.088-.993-.277-.102-.479-.153-.68.153-.204.306-.788.993-.966 1.194-.179.204-.356.229-.662.076-.307-.153-1.291-.476-2.456-1.515-.908-.837-1.52-1.87-1.697-2.177-.178-.306-.019-.471.134-.623.137-.137.306-.357.459-.535.153-.178.204-.306.306-.51.102-.204.052-.381-.025-.535-.077-.153-.68-1.638-.932-2.243-.246-.585-.497-.506-.68-.515-.176-.009-.38-.012-.583-.012-.203 0-.533.076-.812.381-.279.306-1.066 1.04-1.066 2.533 0 1.493 1.093 2.937 1.246 3.141.153.204 2.149 3.283 5.205 4.596.727.313 1.295.5 1.736.64.729.233 1.39.201 1.912.121.583-.087 1.8-.736 2.053-1.445.253-.71.253-1.318.178-1.445-.076-.127-.279-.204-.583-.357z"/>
  </svg>
);

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
      {/* Top info bar */}
      <div className="bg-gradient-to-r from-sky-100 to-cyan-50 border-b border-sky-200 hidden md:block">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <span className="text-gray-700 font-semibold text-sm">Follow Us</span>
              <div className="flex gap-3">
                <motion.a href="#" className="text-gray-600 hover:text-blue-600" whileHover={{ scale: 1.1 }}>
                  <Facebook className="h-4 w-4" />
                </motion.a>
                <motion.a href="#" className="text-gray-600 hover:text-blue-600" whileHover={{ scale: 1.1 }}>
                  <Twitter className="h-4 w-4" />
                </motion.a>
                <motion.a href="#" className="text-gray-600 hover:text-blue-600" whileHover={{ scale: 1.1 }}>
                  <Linkedin className="h-4 w-4" />
                </motion.a>
                <motion.a href="#" className="text-gray-600 hover:text-blue-600" whileHover={{ scale: 1.1 }}>
                  <Instagram className="h-4 w-4" />
                </motion.a>
              </div>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <a href="mailto:info@touron.com" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                <Mail className="h-4 w-4" />
                <span>info@touron.com</span>
              </a>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-4 w-4" />
                <span>Sun to Friday: 8.00 am - 7.00 pm</span>
              </div>
              <a href="tel:+256214203215" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                <Phone className="h-4 w-4" />
                <span>+256 214 203 215</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <motion.header className="sticky top-0 z-50 bg-white shadow-md" initial={{ y: -100 }} animate={{ y: 0 }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="flex items-center gap-3 group">
              <motion.div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center" whileHover={{ rotate: 360 }}>
                <Plane className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <span className="text-2xl font-bold text-gray-800 group-hover:text-blue-600">Turmet</span>
                <p className="text-xs text-gray-500">Explore The World</p>
              </div>
            </a>

            <nav className="hidden lg:flex items-center space-x-1">
              <a href="/" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">Home</a>
              <a href="/about" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">About Us</a>
              <a href="/destinations" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">Destinations</a>
              <a href="/triplist" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">Trips</a>
              <div className="relative group">
                <button className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium" onMouseEnter={() => setOpenDropdown('pages')} onMouseLeave={() => setOpenDropdown(null)}>
                  Pages
                  <ChevronDown className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {openDropdown === 'pages' && (
                    <motion.div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-lg py-2 border" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} onMouseEnter={() => setOpenDropdown('pages')} onMouseLeave={() => setOpenDropdown(null)}>
                      <a href="/terms" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Terms & Conditions</a>
                      <a href="/privacy" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Privacy Policy</a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <a href="/blog" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">Blog</a>
              <a href="/contact" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">Contact Us</a>
            </nav>

            <div className="flex items-center gap-3">
              <motion.button className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100" whileHover={{ scale: 1.1 }} onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </motion.button>
              <motion.a href="https://wa.me" className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-green-50 text-green-600" whileHover={{ scale: 1.1 }}>
                <WhatsAppIcon />
              </motion.a>
              <motion.button onClick={() => setIsPlanTripOpen(true)} className="hidden md:block px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-md shadow-md" whileHover={{ scale: 1.05 }}>
                Plan Your Trip
              </motion.button>
              <button className="lg:hidden text-gray-700" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div className="lg:hidden bg-white border-t shadow-lg" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
                <a href="/" className="text-gray-700 hover:text-blue-600 font-medium py-2">Home</a>
                <a href="/about" className="text-gray-700 hover:text-blue-600 font-medium py-2">About Us</a>
                <a href="/destinations" className="text-gray-700 hover:text-blue-600 font-medium py-2">Destinations</a>
                <a href="/tours" className="text-gray-700 hover:text-blue-600 font-medium py-2">Tours</a>
                <a href="/blog" className="text-gray-700 hover:text-blue-600 font-medium py-2">Blog</a>
                <a href="/contact" className="text-gray-700 hover:text-blue-600 font-medium py-2">Contact</a>
                <button onClick={() => { setIsMobileMenuOpen(false); setIsPlanTripOpen(true); }} className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-md">
                  Plan Your Trip
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Plan Your Trip Modal */}
      <AnimatePresence>
        {isPlanTripOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/60 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPlanTripOpen(false)} />
            
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
              <motion.div 
                className="bg-white w-full h-[96vh] sm:h-auto sm:rounded-2xl shadow-2xl sm:w-full sm:max-w-5xl relative sm:max-h-[92vh] overflow-hidden flex flex-col"
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => setIsPlanTripOpen(false)} className="absolute right-2 top-2 sm:right-4 sm:top-4 z-20 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1.5 sm:p-2 shadow-lg">
                  <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col lg:flex-row h-full overflow-hidden">
                  {/* Sidebar - Hidden on mobile */}
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
                          <input type="text" name="destination" placeholder="E.g., Paris" value={formData.destination} onChange={handleInputChange} className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Departure City *</label>
                          <input type="text" name="departureCity" placeholder="E.g., Delhi" value={formData.departureCity} onChange={handleInputChange} className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
                        </div>
                      </div>

                      {/* Travel Dates */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                        <input type="date" name="travelDate" value={formData.travelDate} onChange={handleInputChange} className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                        <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
                          <input type="checkbox" name="flexibleDates" checked={formData.flexibleDates} onChange={handleInputChange} className="w-3 h-3 text-indigo-600 rounded" />
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
                                <button type="button" onClick={() => handleNumberChange(key, -1)} className="px-1.5 py-1 sm:px-2 sm:py-1.5 bg-gray-100 hover:bg-gray-200 text-sm">-</button>
                                <input type="number" name={key} value={formData[key]} readOnly className="w-full text-center border-0 text-sm focus:outline-none py-1" />
                                <button type="button" onClick={() => handleNumberChange(key, 1)} className="px-1.5 py-1 sm:px-2 sm:py-1.5 bg-gray-100 hover:bg-gray-200 text-sm">+</button>
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
                              <input type="radio" name="hotelCategory" value={cat} checked={formData.hotelCategory === cat} onChange={handleInputChange} className="w-3 h-3 text-indigo-600" />
                              <span className="text-xs sm:text-sm text-gray-700">{cat === 'budget' ? 'Budget' : cat.replace('star', '★')}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                          <input type="text" name="fullName" placeholder="Your name" value={formData.fullName} onChange={handleInputChange} className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                          <input type="tel" name="contactNumber" placeholder="Phone" value={formData.contactNumber} onChange={handleInputChange} className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input type="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleInputChange} className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
                      </div>

                      {/* Comments */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Comments</label>
                        <textarea name="comments" placeholder="Special requirements..." value={formData.comments} onChange={handleInputChange} rows="2" className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"></textarea>
                      </div>

                      {/* CAPTCHA */}
                      <div className="border-2 border-indigo-200 rounded-lg p-2.5 bg-indigo-50">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Security Check *</label>
                        <div className="flex items-center gap-2">
                          <div className="bg-white px-3 py-1.5 rounded-lg border-2 border-indigo-600 text-indigo-600 font-bold text-sm">
                            9 + 4 = ?
                          </div>
                          <input type="text" name="captcha" placeholder="Answer" value={formData.captcha} onChange={handleInputChange} className="flex-1 px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
                        </div>
                      </div>

                      {/* Submit */}
                      <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 sm:py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all text-sm">
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

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/50 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSearchOpen(false)} />
            <motion.div className="fixed inset-x-0 top-0 z-50 flex justify-center pt-20" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
              <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Search</h3>
                    <button onClick={() => setIsSearchOpen(false)} className="text-gray-500 hover:text-gray-700">
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" placeholder="Search destinations, tours..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" autoFocus />
                  </div>
                  {searchQuery && (
                    <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
                      <div className="space-y-2">
                        <a href="/destinations/paris" className="block p-3 hover:bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-800">Paris, France</p>
                          <p className="text-sm text-gray-500">Destination</p>
                        </a>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}