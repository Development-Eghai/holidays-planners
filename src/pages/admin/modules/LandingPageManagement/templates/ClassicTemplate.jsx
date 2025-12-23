// src/pages/admin/modules/LandingPageManagement/templates/ClassicTemplate.jsx
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Check, Star, ChevronRight } from 'lucide-react';
import { EnquiryModal, TripDetailModal, AttractionModal } from './TemplateComponents';

export default function ClassicTemplate({ pageData }) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [tripModal, setTripModal] = useState({ open: false, id: null });
  const [attractionModal, setAttractionModal] = useState({ open: false, data: null });
  const [selectedDestination, setSelectedDestination] = useState('');

  const handleEnquire = (dest = '') => {
    setSelectedDestination(dest);
    setEnquiryOpen(true);
    setTripModal({ open: false, id: null });
  };

  const { hero, company, packages, attractions, gallery, testimonials, faqs, seo } = pageData;
  const primaryColor = seo?.primary_color || '#3B82F6';

  return (
    <div className="font-sans text-slate-700">
      {/* Top Bar */}
      <div className="bg-slate-900 text-slate-300 py-2 px-4 text-xs">
        <div className="max-w-6xl mx-auto flex justify-between">
          <div className="flex gap-4">
             <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {company.contact}</span>
          </div>
          <div className="flex gap-4">
             <span className="cursor-pointer hover:text-white">Travel Guidelines</span>
             <span className="cursor-pointer hover:text-white">Support</span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wider">{company.name}</h1>
          <button onClick={() => handleEnquire()} style={{ backgroundColor: primaryColor }} className="text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:opacity-90 transition-opacity">
            Enquire Now
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative h-[600px]">
        {hero.background_type === 'video' && hero.background_videos.length > 0 ? (
           <video src={hero.background_videos[0]} autoPlay muted loop className="w-full h-full object-cover" />
        ) : (
           <img src={hero.background_images?.[0]} className="w-full h-full object-cover" alt="Hero" />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-4">
          <div className="max-w-3xl bg-white/10 backdrop-blur-md p-10 rounded-2xl border border-white/20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-md">{hero.title}</h2>
            <p className="text-xl text-white/90 mb-8 font-medium">{hero.subtitle}</p>
            <div className="flex justify-center gap-4">
               <button onClick={() => document.getElementById('packages').scrollIntoView({ behavior: 'smooth' })} className="bg-white text-slate-900 px-8 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors">
                 {hero.cta_button_1?.text || 'View Packages'}
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      {packages.show_section && (
        <section id="packages" className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-wide">{packages.section_title}</h2>
              <div className="w-20 h-1 mx-auto mt-4 rounded-full" style={{ backgroundColor: primaryColor }}></div>
              <p className="mt-4 text-slate-500">{packages.section_subtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {packages.selected_trips.map((trip, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-slate-100">
                  <div className="h-56 relative overflow-hidden">
                    <img src={trip.image} className="w-full h-full object-cover transition-transform hover:scale-110 duration-500" alt="" />
                    <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-3 py-1 uppercase">{trip.price}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-slate-900 line-clamp-1">{trip.trip_title}</h3>
                    {trip.badge && <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded mb-4 font-bold">{trip.badge}</span>}
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => setTripModal({ open: true, id: trip.trip_id })} className="flex-1 py-2 border-2 border-slate-200 rounded font-bold text-slate-600 hover:border-slate-400">View Details</button>
                      <button onClick={() => handleEnquire(trip.trip_title)} style={{ backgroundColor: primaryColor }} className="flex-1 py-2 text-white rounded font-bold hover:opacity-90">Book Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Attractions List */}
      {attractions.show_section && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 border-l-4 pl-4" style={{ borderColor: primaryColor }}>{attractions.section_title}</h2>
            <div className="grid md:grid-cols-2 gap-10">
              {attractions.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                   <img src={item.image} className="w-32 h-32 object-cover rounded-lg shadow-md shrink-0" alt="" />
                   <div>
                     <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                     <div className="text-sm text-slate-500 line-clamp-2 mb-2" dangerouslySetInnerHTML={{ __html: item.description }} />
                     <button onClick={() => setAttractionModal({ open: true, data: item })} className="text-xs font-bold uppercase tracking-wider text-blue-600 hover:underline flex items-center">
                       Read More <ChevronRight className="w-3 h-3" />
                     </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.show_section && (
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
             <h2 className="text-3xl font-bold mb-12">{testimonials.section_title}</h2>
             <div className="grid md:grid-cols-3 gap-8">
               {testimonials.items.map((item, idx) => (
                 <div key={idx} className="bg-slate-800 p-8 rounded-xl relative">
                   <div className="flex justify-center mb-4 text-yellow-400">
                     {[...Array(item.rating || 5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                   </div>
                   <p className="italic text-slate-300 mb-6">"{item.description}"</p>
                   <div className="flex items-center justify-center gap-3">
                     <img src={item.image || 'https://via.placeholder.com/50'} className="w-10 h-10 rounded-full object-cover" alt="" />
                     <div className="text-left">
                       <p className="font-bold text-sm">{item.name}</p>
                       <p className="text-xs text-slate-500">{item.destination}</p>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-100 py-12 border-t">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{company.name}</h2>
            <p className="text-slate-500 max-w-sm">Crafting unforgettable journeys with premium service and authentic experiences.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Home</li>
              <li>Packages</li>
              <li>About Us</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> {company.contact}</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Coimbatore, TN</li>
            </ul>
          </div>
        </div>
      </footer>

      <EnquiryModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} tripTitle={selectedDestination} />
      <TripDetailModal isOpen={tripModal.open} onClose={() => setTripModal({ open: false, id: null })} tripId={tripModal.id} onEnquire={handleEnquire} />
      <AttractionModal isOpen={attractionModal.open} onClose={() => setAttractionModal({ open: false, data: null })} data={attractionModal.data} />
    </div>
  );
}