import { useState, useMemo, useEffect } from 'react';
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
  MapPin,
  Users,
  Loader2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// --- API CONFIGURATION ---
const API_CONFIG = {
  FULL_API_URL: 'https://api.yaadigo.com/secure/api/enquires/',
  API_KEY: 'x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ',
  DOMAIN_NAME: 'https://www.holidaysplanners.com',
};
const CAPTCHA_ANSWER = 13;

// --- ICONS ---
const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.383 0 0 5.383 0 12c0 2.136.53 4.168 1.547 5.948L0 24l6.304-2.016C9.055 23.383 10.464 24 12 24c6.617 0 12-5.383 12-12S18.617 0 12 0zm0 22.08c-1.357 0-2.688-.328-3.847-.963l-.276-.163-2.856.915.963-2.856-.164-.276A10.075 10.075 0 011.92 12c0-5.531 4.529-10.08 10.08-10.08 5.551 0 10.08 4.529 10.08 10.08 0 5.551-4.529 10.08-10.08 10.08z"/>
    <path d="M17.622 14.236c-.306-.153-1.81-.892-2.088-.993-.277-.102-.479-.153-.68.153-.204.306-.788.993-.966 1.194-.179.204-.356.229-.662.076-.307-.153-1.291-.476-2.456-1.515-.908-.837-1.52-1.87-1.697-2.177-.178-.306-.019-.471.134-.623.137-.137.306-.357.459-.535.153-.178.204-.306.306-.51.102-.204.052-.381-.025-.535-.077-.153-.68-1.638-.932-2.243-.246-.585-.497-.506-.68-.515-.176-.009-.38-.012-.583-.012-.203 0-.533.076-.812.381-.279.306-1.066 1.04-1.066 2.533 0 1.493 1.093 2.937 1.246 3.141.153.204 2.149 3.283 5.205 4.596.727.313 1.295.5 1.736.64.729.233 1.39.201 1.912.121.583-.087 1.8-.736 2.053-1.445.253-.71.253-1.318.178-1.445-.076-.127-.279-.204-.583-.357z"/>
  </svg>
);

const SuccessToast = ({ message, onClose }) => (
  <motion.div
    className="fixed bottom-6 right-6 p-4 bg-green-600 text-white rounded-lg shadow-xl z-[100002] flex items-center gap-3"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
  >
    <CheckCircle className="h-5 w-5" />
    <span>{message}</span>
    <button onClick={onClose} className="text-white/80 hover:text-white">
      <X className="h-4 w-4" />
    </button>
  </motion.div>
);

// --- DATA PROCESSING ---
const getNavDestinations = (data, type) => {
  const destinations = data.filter(
    d => d.destination_type === type && !d.title?.toLowerCase().includes('copy')
  );
  const limitedDestinations = destinations.slice(0, 15);
  const itemsPerColumn = 5;
  const numColumns = Math.min(3, Math.ceil(limitedDestinations.length / itemsPerColumn));
  const columns = [];
  for (let i = 0; i < numColumns; i++) {
    const start = i * itemsPerColumn;
    const end = start + itemsPerColumn;
    columns.push(limitedDestinations.slice(start, end));
  }
  return { columns, numColumns, allDestinations: limitedDestinations };
};

// --- MAIN COMPONENT ---
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [fetchedDestinations, setFetchedDestinations] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlanTripOpen, setIsPlanTripOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // ✅ Fetch live destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('https://api.yaadigo.com/secure/api/destinations/', {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_CONFIG.API_KEY,
          },
        });

        const json = await response.json();
        console.log("✅ API Response (destinations):", json);

        const apiData = json?.data || [];
        const cleanedData = apiData.filter(
          d =>
            d.title &&
            d.slug &&
            !d.title.toLowerCase().includes('copy') &&
            (d.destination_type === 'domestic' || d.destination_type === 'international')
        );

        setFetchedDestinations(cleanedData);
      } catch (err) {
        console.error("❌ Error fetching destinations:", err);
      }
    };

    fetchDestinations();
  }, []);

  const domesticNav = useMemo(
    () => getNavDestinations(fetchedDestinations, 'domestic'),
    [fetchedDestinations]
  );
  const internationalNav = useMemo(
    () => getNavDestinations(fetchedDestinations, 'international'),
    [fetchedDestinations]
  );

  // --- FORM STATE ---
  const initialFormData = {
    destination: '', departureCity: '', travelDate: '', flexibleDates: false,
    adults: 1, children: 0, infants: 0, hotelCategory: 'budget', fullName: '',
    contactNumber: '', email: '', comments: '', captcha: ''
  };
  const [formData, setFormData] = useState(initialFormData);
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleNumberChange = (name, delta) => {
    setFormData(prev => ({ ...prev, [name]: Math.max(name === 'adults' ? 1 : 0, prev[name] + delta) }));
  };
  const resetForm = () => { setFormData(initialFormData); setFormError(null); }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);
    if (parseInt(formData.captcha) !== CAPTCHA_ANSWER) {
      setFormError('Incorrect security answer (9 + 4). Please try again.');
      setIsSubmitting(false); return;
    }
    const apiData = {
      "domain_name": API_CONFIG.DOMAIN_NAME,
      "destination": formData.destination,
      "departure_city": formData.departureCity,
      "travel_date": formData.flexibleDates ? '' : formData.travelDate,
      "adults": parseInt(formData.adults),
      "children": parseInt(formData.children),
      "infants": parseInt(formData.infants),
      "hotel_category": formData.hotelCategory,
      "full_name": formData.fullName,
      "contact_number": formData.contactNumber,
      "email": formData.email,
      "additional_comments": formData.comments,
    };
    try {
      const response = await fetch(API_CONFIG.FULL_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_CONFIG.API_KEY },
        body: JSON.stringify(apiData),
      });
      if (!response.ok) {
        let errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API submission failed with status ${response.status}.`);
      }
      setSuccessMessage('Your custom trip quote request has been sent! A specialist will contact you shortly.');
      setIsPlanTripOpen(false);
      resetForm();
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Submission failed:', error.message);
      setFormError(error.message || 'Submission failed due to an unexpected error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- MAIN JSX ---
  return (
    <>
      {/* ===== TOP BAR ===== */}
      <div className="bg-gradient-to-r from-sky-100 to-cyan-50 border-b border-sky-200 hidden md:block w-full">
        <div className="w-full px-4 py-3">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-8">
              <span className="text-gray-700 font-semibold text-sm">Follow Us</span>
              <div className="flex gap-3">
                <motion.a href="#" className="text-gray-600 hover:text-[#1877F2]" whileHover={{ scale: 1.1 }}><Facebook className="h-4 w-4" /></motion.a>
                <motion.a href="https://x.com/Holidays_planne" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#1DA1F2]" whileHover={{ scale: 1.1 }}><Twitter className="h-4 w-4" /></motion.a>
                <motion.a href="#" className="text-gray-600 hover:text-[#0A66C2]" whileHover={{ scale: 1.1 }}><Linkedin className="h-4 w-4" /></motion.a>
                <motion.a href="#" className="text-gray-600 hover:text-[#C13584]" whileHover={{ scale: 1.1 }}><Instagram className="h-4 w-4" /></motion.a>
              </div>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <a href="mailto:info@holidaysplanners.com" className="flex items-center gap-2 text-gray-700 hover:text-blue-600"><Mail className="h-4 w-4" /><span>info@holidaysplanners.com</span></a>
              <div className="flex items-center gap-2 text-gray-700"><Clock className="h-4 w-4" /><span>Sun to Friday: 8.00 am - 7.00 pm</span></div>
              <a href="tel:+919816259997" className="flex items-center gap-2 text-gray-700 hover:text-blue-600"><Phone className="h-4 w-4" /><span>+91 98162 59997</span></a>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN HEADER ===== */}
      <motion.header className="sticky top-0 z-[9999] bg-white shadow-md w-full" initial={{ y: -100 }} animate={{ y: 0 }}>
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-20 max-w-7xl mx-auto">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <motion.img src="/HP-logo.png" alt="Holidays Planners Logo" className="h-[24] w-60"
                initial={{ scale: 0.9 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} />
            </a>

            {/* ===== NAVIGATION ===== */}
            <nav className="hidden lg:flex items-center space-x-1">
              {/* Domestic Trips */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onMouseEnter={() => setOpenDropdown('domestic')}
                  onMouseLeave={() => setOpenDropdown(null)}>
                  Domestic Trips
                  <ChevronDown className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {openDropdown === 'domestic' && (
                    <motion.div className="absolute top-full left-0 bg-white shadow-xl rounded-lg py-2 border z-[10000]"
                      style={{ width: `${domesticNav.numColumns * 12}rem` }}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}>
                      {domesticNav.columns.length ? (
                        <div className={`grid gap-x-2 grid-cols-${domesticNav.numColumns}`}>
                          {domesticNav.columns.map((column, i) => (
                            <div key={i} className="min-w-48">
                              {column.map(dest => (
                                <a key={dest.id} href={`/destination/${dest.slug}/${dest.id}`}
                                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 whitespace-nowrap">
                                  {dest.title}
                                </a>
                              ))}
                            </div>
                          ))}
                        </div>
                      ) : (<p className="px-4 py-2 text-gray-500 text-sm">Loading...</p>)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* International Trips */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onMouseEnter={() => setOpenDropdown('international')}
                  onMouseLeave={() => setOpenDropdown(null)}>
                  International Trips
                  <ChevronDown className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {openDropdown === 'international' && (
                    <motion.div className="absolute top-full left-0 bg-white shadow-xl rounded-lg py-2 border z-[10000]"
                      style={{ width: `${internationalNav.numColumns * 12}rem` }}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}>
                      {internationalNav.columns.length ? (
                        <div className={`grid gap-x-2 grid-cols-${internationalNav.numColumns}`}>
                          {internationalNav.columns.map((column, i) => (
                            <div key={i} className="min-w-48">
                              {column.map(dest => (
                                <a key={dest.id} href={`/destination/${dest.slug}/${dest.id}`}
                                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 whitespace-nowrap">
                                  {dest.title}
                                </a>
                              ))}
                            </div>
                          ))}
                        </div>
                      ) : (<p className="px-4 py-2 text-gray-500 text-sm">Loading...</p>)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <a href="/triplist" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">Explore Trips</a>
              <a href="/about" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">About Us</a>
              <a href="/blog" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">Blog</a>
            </nav>

            {/* ===== RIGHT ACTIONS ===== */}
            <div className="flex items-center gap-3">
              <motion.button className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100"
                whileHover={{ scale: 1.1 }} onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </motion.button>
              <motion.a href="https://wa.me/919816259997" target="_blank" rel="noopener noreferrer"
                className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-green-50 text-green-600"
                whileHover={{ scale: 1.1 }}>
                <WhatsAppIcon />
              </motion.a>
              <motion.button onClick={() => { setIsPlanTripOpen(true); resetForm(); }}
                className="hidden md:block px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-md shadow-md transition-shadow"
                whileHover={{ scale: 1.05, shadow: "0 8px 15px rgba(0, 100, 200, 0.4)" }}>
                Plan Your Trip
              </motion.button>
              <button className="lg:hidden text-gray-700" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
}
