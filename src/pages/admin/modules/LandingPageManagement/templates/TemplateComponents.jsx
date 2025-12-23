// src/pages/admin/modules/LandingPageManagement/templates/TemplateComponents.jsx
import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, Phone, Mail, CheckCircle, Loader2 } from 'lucide-react';

const API_KEY = 'x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ';
const API_BASE_URL = 'https://api.yaadigo.com/secure/api';

// --- ENQUIRY MODAL ---
export const EnquiryModal = ({ isOpen, onClose, tripTitle, destination }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    destination: tripTitle || destination || '',
    departure_city: '',
    travel_date: '',
    adults: 2,
    children: 0,
    infants: 0,
    hotel_category: '3 Star',
    full_name: '',
    contact_number: '',
    email: '',
    additional_comments: '',
    domain_name: 'https://www.holidaysplanners.com'
  });

  useEffect(() => {
    if (tripTitle) setFormData(prev => ({ ...prev, destination: tripTitle }));
  }, [tripTitle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/enquires/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to submit');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({ ...formData, full_name: '', email: '', contact_number: '' });
      }, 3000);
    } catch (error) {
      alert('Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">Plan Your Trip</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        
        {success ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900">Request Sent!</h3>
            <p className="text-slate-500 mt-2">Our travel expert will contact you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500">Destination</label>
                <input type="text" required value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Departure City</label>
                <input type="text" required value={formData.departure_city} onChange={e => setFormData({...formData, departure_city: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500">Travel Date</label>
                <input type="date" required value={formData.travel_date} onChange={e => setFormData({...formData, travel_date: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Hotel Category</label>
                <select value={formData.hotel_category} onChange={e => setFormData({...formData, hotel_category: e.target.value})} className="w-full p-2 border rounded-lg">
                  <option>2 Star</option>
                  <option>3 Star</option>
                  <option>4 Star</option>
                  <option>5 Star</option>
                  <option>Luxury</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500">Adults</label>
                <input type="number" min="1" value={formData.adults} onChange={e => setFormData({...formData, adults: parseInt(e.target.value)})} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500">Kids</label>
                <input type="number" min="0" value={formData.children} onChange={e => setFormData({...formData, children: parseInt(e.target.value)})} className="w-full p-2 border rounded-lg" />
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t">
              <input type="text" placeholder="Full Name *" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full p-3 border rounded-lg bg-slate-50" />
              <div className="grid grid-cols-2 gap-4">
                 <input type="tel" placeholder="Phone *" required value={formData.contact_number} onChange={e => setFormData({...formData, contact_number: e.target.value})} className="w-full p-3 border rounded-lg bg-slate-50" />
                 <input type="email" placeholder="Email *" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border rounded-lg bg-slate-50" />
              </div>
              <textarea placeholder="Any specific requirements?" value={formData.additional_comments} onChange={e => setFormData({...formData, additional_comments: e.target.value})} className="w-full p-3 border rounded-lg bg-slate-50 h-20"></textarea>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Send Enquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// --- TRIP DETAIL MODAL ---
export const TripDetailModal = ({ isOpen, onClose, tripId, onEnquire }) => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && tripId) {
      setLoading(true);
      fetch(`${API_BASE_URL}/trips/${tripId}`, { headers: { 'x-api-key': API_KEY } })
        .then(res => res.json())
        .then(data => setTrip(data.data || data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, tripId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 bg-white/80 p-2 rounded-full z-10 hover:bg-white"><X className="w-5 h-5" /></button>
        
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>
        ) : trip ? (
          <div>
            <div className="h-64 md:h-80 relative">
              <img src={trip.hero_image || trip.images?.[0]} className="w-full h-full object-cover" alt={trip.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                <div>
                  <h2 className="text-3xl font-bold text-white">{trip.title}</h2>
                  <p className="text-white/90 flex items-center gap-2 mt-2"><MapPin className="w-4 h-4" /> {trip.destination}</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="prose max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: trip.description }} />
                
                {trip.itinerary && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Itinerary Highlights</h3>
                    <div className="space-y-4">
                      {trip.itinerary.slice(0, 3).map((day, idx) => (
                         <div key={idx} className="flex gap-4">
                           <div className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded h-fit whitespace-nowrap">Day {day.day}</div>
                           <div>
                             <h4 className="font-bold text-slate-800">{day.title}</h4>
                             <p className="text-sm text-slate-500 line-clamp-2">{day.description}</p>
                           </div>
                         </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border">
                  <p className="text-sm text-slate-500 mb-1">Starting From</p>
                  <p className="text-3xl font-bold text-blue-600">₹{trip.price || trip.base_price || 'On Request'}</p>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600"><Calendar className="w-4 h-4" /> {trip.duration || 'Flexible'} Days</div>
                    <div className="flex items-center gap-3 text-sm text-slate-600"><Users className="w-4 h-4" /> Family & Group Friendly</div>
                  </div>
                  <button onClick={() => onEnquire(trip.title)} className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200">
                    Book This Package
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center">Failed to load trip details</div>
        )}
      </div>
    </div>
  );
};

// --- ATTRACTION POPUP ---
export const AttractionModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <img src={data.image} className="w-full h-64 object-cover" alt={data.title} />
        <div className="p-8">
          <h3 className="text-2xl font-bold mb-4">{data.title}</h3>
          <div className="prose text-slate-600" dangerouslySetInnerHTML={{ __html: data.description }} />
          <button onClick={onClose} className="mt-6 w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200">Close</button>
        </div>
      </div>
    </div>
  );
};