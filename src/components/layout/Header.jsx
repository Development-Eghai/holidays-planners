import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Search,
  Facebook,
  Twitter, // Used for the X/Twitter icon
  Linkedin,
  Instagram,
  Mail,
  Clock,
  Phone,
  MapPin,
  Users
} from 'lucide-react';

// --- ICONS & UTILITY COMPONENTS ---

// Custom WhatsApp Icon SVG component
const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.383 0 0 5.383 0 12c0 2.136.53 4.168 1.547 5.948L0 24l6.304-2.016C9.055 23.383 10.464 24 12 24c6.617 0 12-5.383 12-12S18.617 0 12 0zm0 22.08c-1.357 0-2.688-.328-3.847-.963l-.276-.163-2.856.915.963-2.856-.164-.276A10.075 10.075 0 011.92 12c0-5.531 4.529-10.08 10.08-10.08 5.551 0 10.08 4.529 10.08 10.08 0 5.551-4.529 10.08-10.08 10.08z"/>
    <path d="M17.622 14.236c-.306-.153-1.81-.892-2.088-.993-.277-.102-.479-.153-.68.153-.204.306-.788.993-.966 1.194-.179.204-.356.229-.662.076-.307-.153-1.291-.476-2.456-1.515-.908-.837-1.52-1.87-1.697-2.177-.178-.306-.019-.471.134-.623.137-.137.306-.357.459-.535.153-.178.204-.306.306-.51.102-.204.052-.381-.025-.535-.077-.153-.68-1.638-.932-2.243-.246-.585-.497-.506-.68-.515-.176-.009-.38-.012-.583-.012-.203 0-.533.076-.812.381-.279.306-1.066 1.04-1.066 2.533 0 1.493 1.093 2.937 1.246 3.141.153.204 2.149 3.283 5.205 4.596.727.313 1.295.5 1.736.64.729.233 1.39.201 1.912.121.583-.087 1.8-.736 2.053-1.445.253-.71.253-1.318.178-1.445-.076-.127-.279-.204-.583-.357z"/>
  </svg>
);

const SuccessToast = ({ message, onClose }) => (
  // Updated z-index to z-[100002]
  <motion.div
    className="fixed bottom-6 right-6 p-4 bg-green-600 text-white rounded-lg shadow-xl z-[100002] flex items-center gap-3"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
  >
    <span>{message}</span>
    <button onClick={onClose} className="text-white/80 hover:text-white">
      <X className="h-4 w-4" />
    </button>
  </motion.div>
);

// --- MAIN COMPONENT: HEADER ---

export default function Header() {
  // State for UI controls
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlanTripOpen, setIsPlanTripOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null); // State for toast notification

  // Initial state for the trip planning form
  const initialFormData = {
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
  };
  const [formData, setFormData] = useState(initialFormData);

  // Handles text, date, and checkbox inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handles increment/decrement for traveler counts
  const handleNumberChange = (name, delta) => {
    setFormData(prev => ({
      ...prev,
      [name]: Math.max(name === 'adults' ? 1 : 0, prev[name] + delta) // Ensure adults is at least 1, others at least 0
    }));
  };

  // Handles form submission logic
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send formData to a backend API here.
    console.log('Form submitted:', formData);

    // Instead of using alert(), display a custom toast notification
    setSuccessMessage('Your trip request has been submitted! We will contact you shortly.');
    
    // Close modal and reset form
    setIsPlanTripOpen(false);
    setFormData(initialFormData); 

    // Auto-hide success message after 5 seconds
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <>
      {/* ============================================================
        1. TOP INFO BAR (Full Width) - UPDATED CONTACT INFO
        ============================================================
      */}
      <div className="bg-gradient-to-r from-sky-100 to-cyan-50 border-b border-sky-200 hidden md:block w-full">
        <div className="w-full px-4 py-3">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            {/* Social Media Links */}
            <div className="flex items-center gap-8">
              <span className="text-gray-700 font-semibold text-sm">Follow Us</span>
              <div className="flex gap-3">
                <motion.a href="#" className="text-gray-600 hover:text-blue-600" whileHover={{ scale: 1.1 }}><Facebook className="h-4 w-4" /></motion.a>
                {/* Updated Twitter/X Link */}
                <motion.a href="https://x.com/Holidays_planne" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600" whileHover={{ scale: 1.1 }}><Twitter className="h-4 w-4" /></motion.a>
                <motion.a href="#" className="text-gray-600 hover:text-blue-600" whileHover={{ scale: 1.1 }}><Linkedin className="h-4 w-4" /></motion.a>
                <motion.a href="#" className="text-gray-600 hover:text-blue-600" whileHover={{ scale: 1.1 }}><Instagram className="h-4 w-4" /></motion.a>
              </div>
            </div>
            {/* Contact Info */}
            <div className="flex items-center gap-8 text-sm">
              {/* Updated Email Address */}
              <a href="mailto:info@holidaysplanners.com" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                <Mail className="h-4 w-4" />
                <span>info@holidaysplanners.com</span>
              </a>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-4 w-4" />
                <span>Sun to Friday: 8.00 am - 7.00 pm</span>
              </div>
              {/* Updated Phone Number (Primary Mobile) */}
              <a href="tel:+919816259997" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                <Phone className="h-4 w-4" />
                <span>+91 98162 59997</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
        2. MAIN HEADER (Logo, Navigation, Actions - Full Width)
        ============================================================
      */}
      {/* Updated z-index to z-[9999] */}
      <motion.header className="sticky top-0 z-[9999] bg-white shadow-md w-full" initial={{ y: -100 }} animate={{ y: 0 }}>
        {/* Replaced container mx-auto px-4 with w-full and added padding internally */}
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-20 max-w-7xl mx-auto"> {/* Added max-w-7xl for internal content constraint */}
            {/* Logo and Brand Name */}
            <a href="/" className="flex items-center gap-3 group">
              {/* Logo: Adjusted size to fit 225x132 ratio (approx 1.70:1). h-14 is 56px, w-24 is 96px (ratio 1.71:1) */}
              <motion.img
                src="/holidaysplanners-logo.png"
                alt="Holidays Planners Logo"
                className="h-14 w-24" // Adjusted size to fit 225x132 ratio (1.70:1)
                initial={{ scale: 0.9 }} 
                animate={{ scale: 1 }} 
                whileHover={{ scale: 1.1 }} // Subtle animation on hover
              />
              <div>
                <span className="text-2xl font-bold text-gray-800 group-hover:text-blue-600">Holidays Planners</span>
                <p className="text-xs text-gray-500">Explore The World</p>
              </div>
            </a>

            {/* Desktop Navigation (hidden on mobile - lg:flex) */}
            <nav className="hidden lg:flex items-center space-x-1">
              <a href="/" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">Home</a>
              <a href="/about" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">About Us</a>
              <a href="/destinations" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">Destinations</a>
              <a href="/triplist" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">Trips</a>
              
              {/* Pages Dropdown Menu */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium" onMouseEnter={() => setOpenDropdown('pages')} onMouseLeave={() => setOpenDropdown(null)}>
                  Pages
                  <ChevronDown className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {openDropdown === 'pages' && (
                    <motion.div 
                      // Updated z-index to z-10000
                      className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-lg py-2 border z-[10000]" 
                      initial={{ opacity: 0, y: -8 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -8 }} 
                      onMouseEnter={() => setOpenDropdown('pages')} 
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <a href="/terms" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Terms & Conditions</a>
                      <a href="/privacy" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Privacy Policy</a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <a href="/blog" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">Blog</a>
              <a href="/contact" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">Contact Us</a>
            </nav>

            {/* Actions (Search, WhatsApp, Plan Trip) and Mobile Toggle */}
            <div className="flex items-center gap-3">
              {/* Search Button (Desktop) */}
              <motion.button className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100" whileHover={{ scale: 1.1 }} onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </motion.button>
              {/* WhatsApp Button (Desktop) - UPDATED WHATSAPP NUMBER */}
              <motion.a href="https://wa.me/919816259997" target="_blank" rel="noopener noreferrer" className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-green-50 text-green-600" whileHover={{ scale: 1.1 }}>
                <WhatsAppIcon />
              </motion.a>
              {/* Plan Your Trip Button (Desktop) */}
              <motion.button onClick={() => setIsPlanTripOpen(true)} className="hidden md:block px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-md shadow-md transition-shadow" whileHover={{ scale: 1.05, shadow: "0 8px 15px rgba(0, 100, 200, 0.4)" }}>
                Plan Your Trip
              </motion.button>
              {/* Mobile Menu Toggle */}
              <button className="lg:hidden text-gray-700" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================
          3. MOBILE MENU (Collapsible)
          ===========================================================
        */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="lg:hidden bg-white border-t shadow-lg absolute w-full" 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Added internal padding and constrained width for mobile menu content */}
              <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col space-y-3">
                <a href="/" className="text-gray-700 hover:text-blue-600 font-medium py-2">Home</a>
                <a href="/about" className="text-gray-700 hover:text-blue-600 font-medium py-2">About Us</a>
                <a href="/destinations" className="text-gray-700 hover:text-blue-600 font-medium py-2">Destinations</a>
                <a href="/triplist" className="text-gray-700 hover:text-blue-600 font-medium py-2">Trips</a>
                <a href="/blog" className="text-gray-700 hover:text-blue-600 font-medium py-2">Blog</a>
                <a href="/contact" className="text-gray-700 hover:text-blue-600 font-medium py-2">Contact</a>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setIsPlanTripOpen(true); }} 
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-md transition-colors mt-4"
                >
                  Plan Your Trip
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ============================================================
        4. PLAN YOUR TRIP MODAL (Form)
        ============================================================
      */}
      <AnimatePresence>
        {isPlanTripOpen && (
          <>
            {/* Modal Backdrop - Updated z-index to z-100000 */}
            <motion.div 
              className="fixed inset-0 bg-black/60 z-[100000]" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsPlanTripOpen(false)} 
            />
            
            {/* Modal Content - Updated z-index to z-100001 */}
            <div className="fixed inset-0 z-[100001] flex items-center justify-center p-2 sm:p-4">
              <motion.div 
                className="bg-white w-full h-[96vh] sm:h-auto sm:rounded-2xl shadow-2xl sm:w-full sm:max-w-5xl relative sm:max-h-[92vh] overflow-hidden flex flex-col"
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
              >
                {/* Close Button */}
                <button onClick={() => setIsPlanTripOpen(false)} className="absolute right-2 top-2 sm:right-4 sm:top-4 z-20 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1.5 sm:p-2 shadow-lg">
                  <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col lg:flex-row h-full overflow-hidden">
                  {/* Sidebar (Brand Info) - Fixed/Styling Section */}
                  <div className="hidden lg:block lg:w-2/5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-6 text-white overflow-y-auto">
                    {/* Logo in Sidebar */}
                    <div className="flex items-center gap-3 mb-4">
                      {/* Using a smaller but correctly proportioned size for the modal sidebar */}
                      <img src="/holidaysplanners-logo.png" alt="Logo" className="h-8 w-[5rem]" /> 
                      <h3 className="text-xl font-bold">Holidays Planners</h3>
                    </div>

                    {/* Review Section */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-4xl font-bold">4.9</span>
                        <div className="flex text-yellow-400 text-xl">★★★★★</div>
                      </div>
                      <p className="text-indigo-200 text-sm">Excellent on Google</p>
                      <p className="text-indigo-300 text-xs">Based on 1,245 reviews</p>
                    </div>

                    {/* Value Props */}
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

                    {/* Contact Bottom - UPDATED CONTACT INFO */}
                    <div className="border-t border-indigo-400 pt-4">
                      <h4 className="text-sm font-semibold mb-2">Contact Us</h4>
                      <p className="text-indigo-200 text-sm mb-1">info@holidaysplanners.com</p>
                      <p className="text-indigo-200 text-sm mb-3">+91 98162 59997</p>
                      <a href="https://wa.me/919816259997" target="_blank" rel="noopener noreferrer" className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm">
                        <WhatsAppIcon />
                        Chat on WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Form Content - Scrollable Section */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Plan Your Trip</h2>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3">Fill details to get a custom quote</p>

                    <form onSubmit={handleSubmit} className="space-y-2.5">
                      {/* Destination & Departure */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* Destination */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Destination *</label>
                          <input type="text" name="destination" placeholder="E.g., Paris" value={formData.destination} onChange={handleInputChange} className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
                        </div>
                        {/* Departure City */}
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

                      {/* Travelers Count */}
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
                                <button type="button" onClick={() => handleNumberChange(key, -1)} className="px-1.5 py-1 sm:px-2 sm:py-1.5 bg-gray-100 hover:bg-gray-200 text-sm transition-colors">-</button>
                                <input type="number" name={key} value={formData[key]} readOnly className="w-full text-center border-0 text-sm focus:outline-none py-1" />
                                <button type="button" onClick={() => handleNumberChange(key, 1)} className="px-1.5 py-1 sm:px-2 sm:py-1.5 bg-gray-100 hover:bg-gray-200 text-sm transition-colors">+</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Hotel Category Radio Buttons */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Hotel Category</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                          {['budget', '3star', '4star', '5star'].map((cat) => (
                            <label key={cat} className="flex items-center gap-1 cursor-pointer">
                              <input type="radio" name="hotelCategory" value={cat} checked={formData.hotelCategory === cat} onChange={handleInputChange} className="w-3 h-3 text-indigo-600 focus:ring-indigo-500" />
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

                      {/* CAPTCHA (Simulated) */}
                      <div className="border-2 border-indigo-200 rounded-lg p-2.5 bg-indigo-50">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Security Check *</label>
                        <div className="flex items-center gap-2">
                          <div className="bg-white px-3 py-1.5 rounded-lg border-2 border-indigo-600 text-indigo-600 font-bold text-sm">
                            9 + 4 = ? {/* Static value for simple captcha */}
                          </div>
                          <input type="text" name="captcha" placeholder="Answer (e.g., 13)" value={formData.captcha} onChange={handleInputChange} className="flex-1 px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
                        </div>
                      </div>

                      {/* Submit Button */}
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

      {/* ============================================================
        5. SEARCH MODAL
        ============================================================
      */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Search Modal Backdrop - Updated z-index to z-99998 */}
            <motion.div className="fixed inset-0 bg-black/50 z-[99998]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSearchOpen(false)} />
            {/* Search Content - Updated z-index to z-99999 */}
            <motion.div className="fixed inset-x-0 top-0 z-[99999] flex justify-center pt-20" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
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
                    <input 
                      type="text" 
                      placeholder="Search destinations, tours..." 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors" 
                      autoFocus 
                    />
                  </div>
                  {/* Mock search results */}
                  {searchQuery && (
                    <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
                      <div className="space-y-2">
                        <a href="/destinations/paris" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
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

      {/* ============================================================
        6. SUCCESS TOAST (Replaces alert())
        ============================================================
      */}
      <AnimatePresence>
        {successMessage && (
          <SuccessToast 
            message={successMessage} 
            onClose={() => setSuccessMessage(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}