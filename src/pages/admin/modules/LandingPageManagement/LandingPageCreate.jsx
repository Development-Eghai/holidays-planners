import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, Eye, ArrowLeft, ArrowRight, Info, Layout, Sparkles, 
  Package, MapPin, Image as ImageIcon, MessageSquare, HelpCircle, 
  BookOpen, Tag, Plus, Trash2, X, Upload, Search, Film, Check,
  MonitorPlay, Globe, GripHorizontal, AlertCircle
} from 'lucide-react';

// Rich Text Editor
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Template Imports
import ModernTemplate from './templates/ModernTemplate/ModernTemplate';

// --- CONFIGURATION ---
const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const API_KEY = 'x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ';
const UPLOAD_URL = 'https://api.yaadigo.com/upload';
const MULTIPLE_UPLOAD_URL = 'https://api.yaadigo.com/multiple';

// Size Limits (Bytes)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB

// --- HELPERS ---

const getVideoType = (url) => {
  if (!url) return 'unknown';
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
  if (lowerUrl.match(/\.(mp4|webm|ogg|mov)$/)) return 'file';
  return 'unknown';
};

const getYouTubeEmbedUrl = (url) => {
  try {
    let videoId = null;
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch (e) { return url; }
};

// --- COMPONENT: MEDIA MANAGER (Drag/Drop + URL + Upload) ---
const MediaManager = ({ items = [], onUpdate, type = 'image', label = 'Media', onUploadTrigger }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleSort = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;
    
    const newItems = [...items];
    const item = newItems[draggedItem];
    newItems.splice(draggedItem, 1);
    newItems.splice(index, 0, item);
    
    setDraggedItem(index);
    onUpdate(newItems);
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      onUpdate([...items, urlInput.trim()]);
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((url, idx) => (
          <div 
            key={idx}
            draggable
            onDragStart={() => setDraggedItem(idx)}
            onDragOver={(e) => handleSort(e, idx)}
            onDragEnd={() => setDraggedItem(null)}
            className={`relative group aspect-${type === 'image' ? 'square' : 'video'} rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100 cursor-move hover:border-blue-400 transition-all ${draggedItem === idx ? 'opacity-50' : 'opacity-100'}`}
          >
            {type === 'image' ? (
              <img src={url} className="w-full h-full object-cover pointer-events-none" alt="media" />
            ) : (
              getVideoType(url) === 'youtube' ? (
                <iframe src={getYouTubeEmbedUrl(url)} className="w-full h-full pointer-events-none" title="video" frameBorder="0" />
              ) : (
                <video src={url} className="w-full h-full object-cover pointer-events-none" />
              )
            )}
            
            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <GripHorizontal className="text-white/70 w-6 h-6" />
              <button 
                onClick={(e) => { e.stopPropagation(); onUpdate(items.filter((_, i) => i !== idx)); }} 
                className="bg-red-500 p-1.5 rounded-full text-white hover:scale-110 transition-transform"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono shadow-sm">
              {idx + 1}
            </div>
          </div>
        ))}

        {/* Add Button Area */}
        <div className={`aspect-${type === 'image' ? 'square' : 'video'} border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors p-4 bg-white`}>
           {showUrlInput ? (
             <div className="w-full flex flex-col gap-2 animate-in fade-in zoom-in">
               <input 
                 type="text" 
                 value={urlInput} 
                 onChange={(e) => setUrlInput(e.target.value)} 
                 placeholder={type === 'video' ? "YouTube / MP4 URL..." : "Image URL..."}
                 className="w-full text-xs p-2 border rounded"
                 autoFocus
               />
               <div className="flex gap-2">
                 <button onClick={handleAddUrl} className="flex-1 bg-blue-600 text-white text-xs py-1 rounded font-bold hover:bg-blue-700">Add</button>
                 <button onClick={() => setShowUrlInput(false)} className="bg-slate-200 text-slate-600 text-xs px-2 rounded hover:bg-slate-300"><X className="w-3 h-3" /></button>
               </div>
             </div>
           ) : (
             <>
                <p className="text-xs font-bold text-slate-400 uppercase text-center">Add {label}</p>
                <div className="flex gap-2">
                   <button 
                     onClick={onUploadTrigger}
                     className="bg-blue-50 text-blue-600 p-2.5 rounded-lg hover:bg-blue-100 transition-colors"
                     title="Upload File"
                   >
                     <Upload className="w-5 h-5" />
                   </button>
                   <button 
                     onClick={() => setShowUrlInput(true)}
                     className="bg-purple-50 text-purple-600 p-2.5 rounded-lg hover:bg-purple-100 transition-colors"
                     title="Add via URL"
                   >
                     <Globe className="w-5 h-5" />
                   </button>
                </div>
             </>
           )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function LandingPageCreate() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // UI State
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  // Data State
  const [availableTrips, setAvailableTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [tripSearchQuery, setTripSearchQuery] = useState('');
  const [showTripDropdown, setShowTripDropdown] = useState(false);

  // Main Form Data
  const [formData, setFormData] = useState({
    page_name: '',
    slug: '',
    template: 'template-three',
    is_active: true,
    company: {
      name: '',
      contact: '',
      social_media: { facebook: '', instagram: '', twitter: '', youtube: '' }
    },
    seo: {
      meta_title: '',
      meta_description: '',
      meta_tags: ''
    },
    hero: {
      title: '',
      subtitle: '',
      description: '',
      cta_button_1: { text: 'Explore Destinations', link: '#packages' },
      cta_button_2: { text: 'Get Quote', link: '#contact' },
      background_type: 'slider',
      background_images: [],
      background_videos: []
    },
    packages: {
      section_title: 'Popular Tour Packages',
      section_subtitle: 'Explore our hand-picked packages',
      selected_trips: [], 
      show_section: true
    },
    attractions: {
      section_title: 'Top Attractions',
      section_subtitle: 'Must-visit places',
      items: [], 
      show_section: true
    },
    gallery: {
      section_title: 'Photo Gallery',
      section_subtitle: 'Captured moments',
      images: [],
      videos: [],
      show_section: true
    },
    testimonials: {
      section_title: 'What Our Travelers Say',
      section_subtitle: 'Real experiences',
      items: [], 
      show_section: true
    },
    faqs: {
      section_title: 'Frequently Asked Questions',
      section_subtitle: 'Everything you need to know',
      items: [], 
      show_section: true
    },
    travel_guidelines: {
      section_title: 'Travel Guidelines',
      section_subtitle: 'Important information',
      description: '',
      show_section: true
    },
    offers: {
      start_date: '',
      end_date: '',
      header: { enabled: false, text: '' },
      footer: { enabled: false, text: '' },
      mid_section: { enabled: false, type: 'image', media_urls: [] },
      popups: {
        entry: { enabled: false, title: '' },
        exit: { enabled: false, title: '' },
        idle: { enabled: false, title: '' }
      }
    }
  });

  const steps = [
    { id: 'general', label: 'General', icon: Info },
    { id: 'template', label: 'Select Template', icon: Layout },
    { id: 'hero', label: 'Hero Section', icon: Sparkles },
    { id: 'packages', label: 'Trip Packages', icon: Package },
    { id: 'attractions', label: 'Attractions', icon: MapPin },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'guidelines', label: 'Travel Guidelines', icon: BookOpen },
    { id: 'offers', label: 'Offers & Coupons', icon: Tag }
  ];

  const templateMap = {
    'template-one': 'Minimal',
    'template-two': 'Classic',
    'template-three': 'Modern'
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'clean']
    ]
  };

  // --- INITIAL DATA FETCHING ---
  useEffect(() => {
    fetchTrips();
    if (id) fetchLandingPage(id);
  }, [id]);

  useEffect(() => {
    if (formData.page_name && !id) {
      const slug = formData.page_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.page_name, id]);

  useEffect(() => {
    if (tripSearchQuery) {
      const filtered = availableTrips.filter(trip =>
        trip.title?.toLowerCase().includes(tripSearchQuery.toLowerCase()) ||
        trip.destination?.toLowerCase().includes(tripSearchQuery.toLowerCase())
      );
      setFilteredTrips(filtered);
    } else {
      setFilteredTrips(availableTrips);
    }
  }, [tripSearchQuery, availableTrips]);

  const fetchTrips = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/trips`, { headers: { 'x-api-key': API_KEY } });
      const data = await response.json();
      setAvailableTrips(data.data || data);
      setFilteredTrips(data.data || data);
    } catch (error) { 
      console.error('Error fetching trips:', error);
    }
  };

  const fetchLandingPage = async (pageId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/landing-pages/${pageId}`, { headers: { 'x-api-key': API_KEY } });
      if (!response.ok) throw new Error('Failed to fetch landing page');
      const data = await response.json();
      setFormData(data.data || data);
    } catch (error) { 
      console.error('Error loading page:', error);
      alert('Error loading landing page data'); 
    }
    finally { setIsLoading(false); }
  };

  // --- STATE HANDLERS ---
  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleNestedChange = (parent, field, value) => setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [field]: value } }));
  const handleDeepNestedChange = (parent, child, field, value) => setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: { ...prev[parent][child], [field]: value } } }));
  
  const handleArrayItemChange = (parent, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], items: prev[parent].items.map((item, i) => i === index ? { ...item, [field]: value } : item) }
    }));
  };
  const addArrayItem = (parent, newItem) => setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], items: [...prev[parent].items, newItem] } }));
  const removeArrayItem = (parent, index) => setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], items: prev[parent].items.filter((_, i) => i !== index) } }));

  // --- FILE UPLOAD LOGIC ---
  const checkFileSize = (file, type) => {
    const limit = type === 'video' ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    const limitMB = limit / (1024 * 1024);
    if (file.size > limit) {
      alert(`File "${file.name}" exceeds the ${limitMB}MB limit for ${type}s.`);
      return false;
    }
    return true;
  };

  const uploadSingleFile = async (file) => {
    const fd = new FormData(); fd.append('image', file); fd.append('storage', 'local');
    try {
      const response = await fetch(UPLOAD_URL, { method: 'POST', body: fd });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      return (data.message === 'Upload successful' || data.url) ? data.url : null;
    } catch (error) { console.error('Upload error:', error); return null; }
  };

  const uploadMultipleFiles = async (files) => {
    const fd = new FormData();
    Array.from(files).forEach(file => fd.append('gallery_images', file)); 
    fd.append('storage', 'local');
    try {
      const response = await fetch(MULTIPLE_UPLOAD_URL, { method: 'POST', body: fd });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      return (data.message === 'Files uploaded' && data.files) ? (Array.isArray(data.files) ? data.files.flat() : [data.files]) : [];
    } catch (error) { console.error('Upload error:', error); return []; }
  };

  const handleFileUpload = async (file, callback, type = 'image') => {
    if (!file || !checkFileSize(file, type)) return;
    setUploadingFiles(true);
    const url = await uploadSingleFile(file);
    setUploadingFiles(false);
    if (url) callback(url);
  };

  const handleMultipleFileUpload = async (files, callback, type = 'image') => {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files).filter(f => checkFileSize(f, type));
    if (validFiles.length === 0) return;

    setUploadingFiles(true);
    const urls = await uploadMultipleFiles(validFiles);
    setUploadingFiles(false);
    if (urls && urls.length > 0) callback(urls);
  };

  // --- SAVE HANDLER ---
  const validateForm = () => {
    const errors = {};
    if (!formData.page_name?.trim()) errors.page_name = 'Page name is required';
    if (!formData.slug?.trim()) errors.slug = 'URL slug is required';
    else if (!/^[a-z0-9-]+$/.test(formData.slug)) errors.slug = 'Invalid slug format';
    if (!formData.hero?.title?.trim()) errors.hero_title = 'Hero title is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (shouldRedirect = true) => {
    setValidationErrors({});
    if (!validateForm()) { alert('Please fix validation errors'); return; }
    if (uploadingFiles) { alert('Please wait for uploads to finish'); return; }
    
    setIsSaving(true);
    try {
      const url = id ? `${API_BASE_URL}/landing-pages/${id}/` : `${API_BASE_URL}/landing-pages/`;
      const method = id ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'Failed to save');
      }
      
      if (shouldRedirect) {
        alert(id ? 'Updated successfully!' : 'Created successfully!');
        navigate('/admin/dashboard/landing-pages');
      } else {
        // Show success toast
        const toast = document.getElementById('save-toast');
        if(toast) { 
          // Updated to handle top-side animation
          toast.classList.remove('-translate-y-24', 'opacity-0'); 
          setTimeout(() => toast.classList.add('-translate-y-24', 'opacity-0'), 3000); 
        }
      }
    } catch (error) { 
      console.error('Save error:', error);
      alert('Failed to save: ' + error.message);
    } finally { setIsSaving(false); }
  };

  // --- UI HELPERS ---
  const getTripPriceDisplay = (trip) => {
    if (!trip) return 'N/A';
    if (trip.pricing_model === 'custom' || trip.pricing_model === 'customized' || trip.is_custom) {
      const basePrice = trip.pricing?.customized?.base_price || trip.base_price || trip.price;
      return basePrice ? `Starting from ₹${basePrice}` : 'Price on Request';
    }
    const price = trip.pricing?.fixed_departure?.[0]?.price || trip.price || trip.base_price;
    return price ? `₹${price}` : 'Price on Request';
  };

  const badgeOptions = ['Hot Deal', 'Best Seller', 'Most Popular', 'Limited Offer', 'New'];

  const renderTemplatePreview = () => {
    switch(formData.template) {
      case 'template-three': return <ModernTemplate pageData={formData} />;
      default: return <div className="p-20 text-center text-slate-500">Preview available for Modern Template</div>;
    }
  };

  // --- SUB-COMPONENTS ---
  // UPDATED: Removed save button from Header
  const SectionHeader = ({ title }) => (
    <div className="flex justify-between items-center border-b pb-4 mb-6">
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
    </div>
  );

  if (isLoading) return <div className="p-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans relative">
      
      {/* Toast Notification */}
      {/* UPDATED: Moves toast to top (top-20, right-6) and changed animation to slide up (-translate-y) */}
      <div id="save-toast" className="fixed top-20 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl transform -translate-y-24 opacity-0 transition-all duration-300 z-[100] flex items-center gap-3">
        <Check className="w-5 h-5" /> <span>Changes Saved Successfully!</span>
      </div>

      {/* --- PREVIEW MODAL --- */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-white overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-200">
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-20 shrink-0">
            <div className="flex items-center gap-4">
               <button onClick={() => setShowPreview(false)} className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors font-bold text-lg"><ArrowLeft className="w-6 h-6" /> Back to Editor</button>
               <div className="h-6 w-px bg-slate-700 mx-2 hidden sm:block"></div>
               <span className="text-slate-400 text-sm hidden sm:block">Previewing: <span className="text-white">{formData.page_name || 'Untitled Page'}</span></span>
            </div>
            <div className="flex items-center gap-4"><span className="text-xs bg-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">{templateMap[formData.template]} Mode</span></div>
          </div>
          <div className="flex-1 overflow-y-auto bg-white custom-scrollbar relative">
            {renderTemplatePreview()}
            <button onClick={() => setShowPreview(false)} className="fixed bottom-8 right-8 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-black hover:scale-105 transition-all z-50"><X className="w-6 h-6" /></button>
          </div>
        </div>
      )}

      {/* Upload Indicator */}
      {uploadingFiles && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div><span>Uploading files...</span>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{id ? 'Edit Landing Page' : 'Create Landing Page'}</h1>
          <p className="text-slate-500 mt-1">Design a high-converting travel experience</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowPreview(true)} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm hover:bg-slate-50 hover:text-blue-600 font-bold transition-all"><MonitorPlay className="w-4 h-4" /> Preview</button>
          <button onClick={() => navigate('/admin/dashboard/landing-pages')} className="border bg-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 shadow-sm text-slate-700"><ArrowLeft className="w-4 h-4" /> Back</button>
          <button onClick={() => handleSave(true)} disabled={isSaving || uploadingFiles} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg disabled:opacity-50"><Save className="w-4 h-4" /> Save & Submit</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* SIDEBAR NAVIGATION */}
        <div className="col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border sticky top-6 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white"><h3 className="font-semibold" style={{ color: 'white' }}>Page Configurator</h3></div>
            <div className="p-2">
              {steps.map((step, index) => (
                <button key={step.id} onClick={() => setCurrentStep(index)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-left transition-all ${currentStep === index ? 'bg-blue-50 text-blue-600 font-bold shadow-inner' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <step.icon className="w-5 h-5" /> <span className="text-sm">{step.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN FORM CONTENT */}
        <div className="col-span-9 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border p-8 min-h-[600px]">
            
            {/* STEP 0: GENERAL */}
            {currentStep === 0 && (
              <div className="space-y-8 animate-in fade-in">
                <SectionHeader title="General Settings" />
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Page Name *</label>
                    <input type="text" value={formData.page_name} onChange={(e) => handleChange('page_name', e.target.value)} className={`w-full px-4 py-2 border rounded-lg ${validationErrors.page_name ? 'border-red-500' : ''}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">URL Slug *</label>
                    <input type="text" value={formData.slug} onChange={(e) => handleChange('slug', e.target.value)} className={`w-full px-4 py-2 border rounded-lg ${validationErrors.slug ? 'border-red-500' : ''}`} />
                  </div>
                </div>
                
                <h4 className="font-bold border-b pb-2">Company & Socials</h4>
                <div className="grid grid-cols-2 gap-6">
                    <input type="text" value={formData.company.name} onChange={(e) => handleNestedChange('company', 'name', e.target.value)} placeholder="Company Name" className="w-full px-4 py-2 border rounded-lg" />
                    <input type="text" value={formData.company.contact} onChange={(e) => handleNestedChange('company', 'contact', e.target.value)} placeholder="Contact Info" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {['facebook', 'instagram', 'twitter', 'youtube'].map(plat => (
                      <input key={plat} type="text" value={formData.company.social_media[plat]} onChange={(e) => handleDeepNestedChange('company', 'social_media', plat, e.target.value)} placeholder={`${plat.charAt(0).toUpperCase() + plat.slice(1)} URL`} className="w-full px-4 py-2 border rounded-lg text-sm" />
                    ))}
                </div>

                <h4 className="font-bold border-b pb-2">SEO Settings</h4>
                <div className="space-y-4">
                  <input type="text" value={formData.seo.meta_title} onChange={(e) => handleNestedChange('seo', 'meta_title', e.target.value)} placeholder="Meta Title" className="w-full px-4 py-2 border rounded-lg" />
                  <textarea value={formData.seo.meta_description} onChange={(e) => handleNestedChange('seo', 'meta_description', e.target.value)} placeholder="Meta Description" className="w-full px-4 py-2 border rounded-lg" />
                  <input type="text" value={formData.seo.meta_tags} onChange={(e) => handleNestedChange('seo', 'meta_tags', e.target.value)} placeholder="Meta Tags" className="w-full px-4 py-2 border rounded-lg" />
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-blue-900">Publish Status</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.is_active} onChange={(e) => handleChange('is_active', e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-slate-700">{formData.is_active ? 'Live' : 'Draft'}</span>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 1: TEMPLATE */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <SectionHeader title="Visual Layouts" />
                <div className="grid grid-cols-3 gap-6">
                  {Object.keys(templateMap).map(template => (
                    <div key={template} onClick={() => handleChange('template', template)} className={`cursor-pointer group relative p-4 border-2 rounded-2xl transition-all ${formData.template === template ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}>
                      <div className="aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center group-hover:bg-blue-100">
                        <Layout className={`w-12 h-12 ${formData.template === template ? 'text-blue-600' : 'text-slate-300'}`} />
                      </div>
                      <div className="text-center">
                        <p className="font-bold capitalize">{templateMap[template]}</p>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleChange('template', template); setShowPreview(true); }} 
                            className="mt-2 text-xs text-blue-600 font-bold flex items-center justify-center gap-1 mx-auto bg-white px-3 py-1 rounded-full shadow-sm hover:bg-blue-50 border border-blue-100 transition-colors"
                        >
                            <Eye className="w-3 h-3" /> Preview
                        </button>
                      </div>
                      {formData.template === template && <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full"><Check className="w-4 h-4" /></div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: HERO */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in">
                <SectionHeader title="Hero Section" />
                <div className="grid gap-4">
                  <input type="text" value={formData.hero.title} onChange={(e) => handleNestedChange('hero', 'title', e.target.value)} placeholder="Hero Main Title" className="w-full text-2xl font-bold px-4 py-3 border-b-2 outline-none" />
                  <input type="text" value={formData.hero.subtitle} onChange={(e) => handleNestedChange('hero', 'subtitle', e.target.value)} placeholder="Subtitle" className="w-full px-4 py-2 border rounded-lg" />
                  <textarea value={formData.hero.description} onChange={(e) => handleNestedChange('hero', 'description', e.target.value)} placeholder="Description" rows={2} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <label className="text-xs font-bold uppercase text-slate-400">Primary CTA</label>
                        <input type="text" value={formData.hero.cta_button_1.text} onChange={(e) => handleDeepNestedChange('hero', 'cta_button_1', 'text', e.target.value)} className="w-full border rounded mb-2 px-2 py-1" />
                        <input type="text" value={formData.hero.cta_button_1.link} onChange={(e) => handleDeepNestedChange('hero', 'cta_button_1', 'link', e.target.value)} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <label className="text-xs font-bold uppercase text-slate-400">Secondary CTA</label>
                        <input type="text" value={formData.hero.cta_button_2.text} onChange={(e) => handleDeepNestedChange('hero', 'cta_button_2', 'text', e.target.value)} className="w-full border rounded mb-2 px-2 py-1" />
                        <input type="text" value={formData.hero.cta_button_2.link} onChange={(e) => handleDeepNestedChange('hero', 'cta_button_2', 'link', e.target.value)} className="w-full border rounded px-2 py-1" />
                    </div>
                </div>

                <div className="bg-neutral-900 p-6 rounded-2xl border">
                  <h4 className="font-bold mb-4 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Background Media (Drag to Sort)</h4>
                  <div className="flex gap-4 mb-6">
                    {['slider', 'video'].map(type => (
                      <button key={type} onClick={() => handleNestedChange('hero', 'background_type', type)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${formData.hero.background_type === type ? 'bg-blue-600 text-white' : 'bg-white border text-slate-600'}`}>{type === 'slider' ? 'Image Slider' : 'Video Background'}</button>
                    ))}
                  </div>

                  {formData.hero.background_type === 'slider' ? (
                    <>
                      <MediaManager 
                        items={formData.hero.background_images} 
                        onUpdate={(items) => handleNestedChange('hero', 'background_images', items)} 
                        type="image" 
                        label="Hero Image"
                        onUploadTrigger={() => document.getElementById('upload-hero-image').click()}
                      />
                      <input id="upload-hero-image" type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleMultipleFileUpload(e.target.files, (urls) => handleNestedChange('hero', 'background_images', [...formData.hero.background_images, ...urls]), 'image')} />
                    </>
                  ) : (
                    <>
                      <MediaManager 
                        items={formData.hero.background_videos} 
                        onUpdate={(items) => handleNestedChange('hero', 'background_videos', items)} 
                        type="video" 
                        label="Hero Video"
                        onUploadTrigger={() => document.getElementById('upload-hero-video').click()}
                      />
                      <input id="upload-hero-video" type="file" accept="video/*" multiple className="hidden" onChange={(e) => handleMultipleFileUpload(e.target.files, (urls) => handleNestedChange('hero', 'background_videos', [...formData.hero.background_videos, ...urls]), 'video')} />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: PACKAGES */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <SectionHeader title="Trip Packages" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={formData.packages.section_title} onChange={(e) => handleNestedChange('packages', 'section_title', e.target.value)} placeholder="Section Title" className="w-full px-4 py-2 border rounded-lg font-bold" />
                  <input type="text" value={formData.packages.section_subtitle} onChange={(e) => handleNestedChange('packages', 'section_subtitle', e.target.value)} placeholder="Section Subtitle" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                
                <div className="relative">
                    <div className="relative"><Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" /><input type="text" placeholder="Quick find trips..." value={tripSearchQuery} onChange={(e) => setTripSearchQuery(e.target.value)} onFocus={() => setShowTripDropdown(true)} className="w-full pl-11 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                    {showTripDropdown && (
                        <div className="absolute z-20 w-full mt-2 bg-white border rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                        {filteredTrips.map(trip => (
                            <div key={trip.id} onClick={() => {
                            if(!formData.packages.selected_trips.some(t => t.trip_id === trip.id)) {
                                handleNestedChange('packages', 'selected_trips', [...formData.packages.selected_trips, { trip_id: trip.id, badge: '', trip_title: trip.title, price: getTripPriceDisplay(trip), pricing_model: trip.pricing_model, image: trip.hero_image }]);
                            }
                            setShowTripDropdown(false); setTripSearchQuery('');
                            }} className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b last:border-0 transition-colors">
                            <img src={trip.hero_image || trip.images?.[0]} className="w-10 h-10 object-cover rounded-lg" alt="trip thumb" />
                            <div><p className="text-sm font-bold">{trip.title}</p><p className="text-[10px] text-blue-600 font-bold uppercase">{getTripPriceDisplay(trip)}</p></div>
                            </div>
                        ))}
                        </div>
                    )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar bg-slate-50 p-4 rounded-xl border">
                    {formData.packages.selected_trips.map((st, idx) => (
                        <div key={idx} className="flex gap-3 p-3 bg-white rounded-xl border group hover:shadow-md transition-all relative">
                            <img src={st.image} className="w-16 h-16 object-cover rounded-lg" alt="thumb" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate pr-6">{st.trip_title}</p>
                                <p className="text-[11px] text-blue-600 font-extrabold">{st.price}</p>
                                <input type="text" value={st.badge} onChange={(e) => { const l=[...formData.packages.selected_trips]; l[idx].badge=e.target.value; handleNestedChange('packages', 'selected_trips', l); }} placeholder="Badge Label" className="text-xs border p-1 rounded mt-1 w-full" />
                            </div>
                            <button onClick={() => handleNestedChange('packages', 'selected_trips', formData.packages.selected_trips.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    ))}
                </div>
              </div>
            )}

            {/* STEP 4: ATTRACTIONS */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in">
                <SectionHeader title="Area Highlights" />
                <button onClick={() => addArrayItem('attractions', { title: '', image: '', description: '' })} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 mb-4"><Plus className="w-4 h-4" /> Add Attraction</button>
                
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={formData.attractions.section_title} onChange={(e) => handleNestedChange('attractions', 'section_title', e.target.value)} placeholder="Section Title" className="w-full px-4 py-2 border rounded-lg font-bold" />
                  <input type="text" value={formData.attractions.section_subtitle} onChange={(e) => handleNestedChange('attractions', 'section_subtitle', e.target.value)} placeholder="Section Subtitle" className="w-full px-4 py-2 border rounded-lg text-sm" />
                </div>

                <div className="grid gap-6">
                  {formData.attractions.items.map((item, idx) => (
                    <div key={idx} className="p-6 border rounded-2xl bg-white shadow-sm hover:shadow-md transition-all relative">
                      <button onClick={() => removeArrayItem('attractions', idx)} className="absolute top-4 right-4 text-red-500"><X className="w-5 h-5" /></button>
                      <div className="flex gap-6">
                        <div className="w-1/3">
                          <div onClick={() => {
                            const input = document.createElement('input'); input.type='file'; input.accept='image/*';
                            input.onchange=(e) => { if(e.target.files?.[0]) handleFileUpload(e.target.files[0], (u) => handleArrayItemChange('attractions', idx, 'image', u)); };
                            input.click();
                          }} className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed relative">
                            {item.image ? <><img src={item.image} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-bold">CHANGE IMAGE</div></> : <Upload className="text-slate-300" />}
                          </div>
                        </div>
                        <div className="flex-1 space-y-4">
                          <input type="text" value={item.title} onChange={(e) => handleArrayItemChange('attractions', idx, 'title', e.target.value)} placeholder="Attraction Name" className="w-full px-4 py-2 border-b-2 outline-none font-bold" />
                          <ReactQuill theme="snow" value={item.description} onChange={(v) => handleArrayItemChange('attractions', idx, 'description', v)} modules={quillModules} placeholder="Description..." className="bg-slate-50 rounded-xl" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: GALLERY */}
            {currentStep === 5 && (
              <div className="space-y-8 animate-in fade-in">
                <SectionHeader title="Media Gallery" />
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input type="text" value={formData.gallery.section_title} onChange={(e) => handleNestedChange('gallery', 'section_title', e.target.value)} placeholder="Section Title" className="w-full px-4 py-2 border rounded-lg font-bold" />
                  <input type="text" value={formData.gallery.section_subtitle} onChange={(e) => handleNestedChange('gallery', 'section_subtitle', e.target.value)} placeholder="Section Subtitle" className="w-full px-4 py-2 border rounded-lg text-sm" />
                </div>

                <div className="space-y-8">
                  <div className="p-6 bg-neutral-900 rounded-2xl border">
                    <h4 className="font-bold mb-4 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Images (Drag to Sort)</h4>
                    <MediaManager 
                      items={formData.gallery.images} 
                      onUpdate={(items) => handleNestedChange('gallery', 'images', items)} 
                      type="image" 
                      label="Gallery Image"
                      onUploadTrigger={() => document.getElementById('upload-gallery-image').click()}
                    />
                    <input id="upload-gallery-image" type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleMultipleFileUpload(e.target.files, (urls) => handleNestedChange('gallery', 'images', [...formData.gallery.images, ...urls]), 'image')} />
                  </div>

                  <div className="p-6 bg-neutral-900 rounded-2xl border">
                    <h4 className="font-bold mb-4 flex items-center gap-2"><Film className="w-4 h-4" /> Videos (Drag to Sort)</h4>
                    <MediaManager 
                      items={formData.gallery.videos} 
                      onUpdate={(items) => handleNestedChange('gallery', 'videos', items)} 
                      type="video" 
                      label="Gallery Video"
                      onUploadTrigger={() => document.getElementById('upload-gallery-video').click()}
                    />
                    <input id="upload-gallery-video" type="file" accept="video/*" multiple className="hidden" onChange={(e) => handleMultipleFileUpload(e.target.files, (urls) => handleNestedChange('gallery', 'videos', [...formData.gallery.videos, ...urls]), 'video')} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: TESTIMONIALS */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-in fade-in">
                <SectionHeader title="Traveler Voices" />
                <button onClick={() => addArrayItem('testimonials', { name: '', destination: '', rating: 5, description: '', image: '', date: '' })} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 mb-4"><Plus className="w-4 h-4" /> Add Review</button>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input type="text" value={formData.testimonials.section_title} onChange={(e) => handleNestedChange('testimonials', 'section_title', e.target.value)} placeholder="Section Title" className="w-full px-4 py-2 border rounded-lg font-bold" />
                  <input type="text" value={formData.testimonials.section_subtitle} onChange={(e) => handleNestedChange('testimonials', 'section_subtitle', e.target.value)} placeholder="Section Subtitle" className="w-full px-4 py-2 border rounded-lg text-sm" />
                </div>

                <div className="space-y-6">
                  {formData.testimonials.items.map((item, idx) => (
                    <div key={idx} className="p-6 border rounded-3xl bg-slate-50 relative group">
                      <button onClick={() => removeArrayItem('testimonials', idx)} className="absolute top-6 right-6 text-red-500 hover:scale-110 transition-all"><Trash2 className="w-5 h-5" /></button>
                      <div className="flex gap-6">
                        <div onClick={() => {
                          const input = document.createElement('input'); input.type='file'; input.accept='image/*';
                          input.onchange=(e) => { if(e.target.files?.[0]) handleFileUpload(e.target.files[0], (u) => handleArrayItemChange('testimonials', idx, 'image', u)); };
                          input.click();
                        }} className="w-24 h-24 bg-white border-4 border-white rounded-full flex items-center justify-center cursor-pointer shadow-md overflow-hidden flex-shrink-0">
                           {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <Upload className="text-slate-300" />}
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                           <input type="text" value={item.name} onChange={(e) => handleArrayItemChange('testimonials', idx, 'name', e.target.value)} placeholder="Full Name" className="w-full px-4 py-2 border rounded-lg font-bold" />
                           <input type="text" value={item.destination} onChange={(e) => handleArrayItemChange('testimonials', idx, 'destination', e.target.value)} placeholder="Trip Taken" className="w-full px-4 py-2 border rounded-lg" />
                           <div className="flex items-center gap-4 bg-white px-4 py-2 border rounded-lg">
                             <span className="text-xs font-bold text-slate-400">RATING</span>
                             <select value={item.rating} onChange={(e) => handleArrayItemChange('testimonials', idx, 'rating', parseInt(e.target.value))} className="flex-1 font-bold text-yellow-600 outline-none">
                               {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                             </select>
                           </div>
                           <input type="date" value={item.date} onChange={(e) => handleArrayItemChange('testimonials', idx, 'date', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                           <textarea value={item.description} onChange={(e) => handleArrayItemChange('testimonials', idx, 'description', e.target.value)} placeholder="Review..." rows={3} className="w-full px-4 py-2 border rounded-lg col-span-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 7: FAQs */}
            {currentStep === 7 && (
              <div className="space-y-6 animate-in fade-in">
                <SectionHeader title="Knowledge Base" />
                <button onClick={() => addArrayItem('faqs', { question: '', answer: '' })} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 mb-4"><Plus className="w-4 h-4" /> Add FAQ</button>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input type="text" value={formData.faqs.section_title} onChange={(e) => handleNestedChange('faqs', 'section_title', e.target.value)} placeholder="Section Title" className="w-full px-4 py-2 border rounded-lg font-bold" />
                  <input type="text" value={formData.faqs.section_subtitle} onChange={(e) => handleNestedChange('faqs', 'section_subtitle', e.target.value)} placeholder="Section Subtitle" className="w-full px-4 py-2 border rounded-lg text-sm" />
                </div>

                {formData.faqs.items.map((item, idx) => (
                  <div key={idx} className="p-4 border rounded-2xl bg-white shadow-sm hover:border-blue-200 transition-all relative">
                    <button onClick={() => removeArrayItem('faqs', idx)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                    <input type="text" value={item.question} onChange={(e) => handleArrayItemChange('faqs', idx, 'question', e.target.value)} placeholder="Question Title" className="w-full px-4 py-2 border-b font-bold mb-2 outline-none focus:border-blue-500" />
                    <ReactQuill theme="snow" value={item.answer} onChange={(v) => handleArrayItemChange('faqs', idx, 'answer', v)} modules={quillModules} placeholder="Answer Details..." className="bg-slate-50 rounded-lg" />
                  </div>
                ))}
              </div>
            )}

            {/* STEP 8: GUIDELINES */}
            {currentStep === 8 && (
              <div className="space-y-6 animate-in fade-in">
                <SectionHeader title="Travel Guidelines" />
                <div className="grid gap-4 mb-4">
                  <input type="text" value={formData.travel_guidelines.section_title} onChange={(e) => handleNestedChange('travel_guidelines', 'section_title', e.target.value)} placeholder="Section Title" className="w-full px-4 py-2 border rounded-lg font-bold" />
                  <input type="text" value={formData.travel_guidelines.section_subtitle} onChange={(e) => handleNestedChange('travel_guidelines', 'section_subtitle', e.target.value)} placeholder="Subtitle" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <ReactQuill theme="snow" value={formData.travel_guidelines.description} onChange={(v) => handleNestedChange('travel_guidelines', 'description', v)} modules={quillModules} className="bg-white rounded-xl h-96 mb-12 shadow-inner" />
              </div>
            )}

            {/* STEP 9: OFFERS */}
            {currentStep === 9 && (
              <div className="space-y-8 animate-in fade-in">
                <SectionHeader title="Offers & Banners" />
                
                <div className="grid grid-cols-2 gap-6 p-6 bg-slate-900 rounded-3xl text-white">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-500">Sale Start</label>
                      <input type="date" value={formData.offers.start_date} onChange={(e) => handleNestedChange('offers', 'start_date', e.target.value)} className="w-full bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-500">Sale End</label>
                      <input type="date" value={formData.offers.end_date} onChange={(e) => handleNestedChange('offers', 'end_date', e.target.value)} className="w-full bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 text-white" />
                    </div>
                </div>

                <div className="p-6 border rounded-2xl bg-slate-50">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3"><input type="checkbox" checked={formData.offers.mid_section.enabled} onChange={(e) => handleDeepNestedChange('offers', 'mid_section', 'enabled', e.target.checked)} className="w-5 h-5" /><h4 className="font-bold text-lg">In-Page Banner (Mid Section)</h4></div>
                    <div className="flex p-1 bg-white border rounded-xl">
                      {['image', 'video'].map(t => (
                        <button key={t} onClick={() => handleDeepNestedChange('offers', 'mid_section', 'type', t)} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${formData.offers.mid_section.type === t ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-400'}`}>{t}</button>
                      ))}
                    </div>
                  </div>

                  {formData.offers.mid_section.enabled && (
                    <>
                      <MediaManager 
                        items={formData.offers.mid_section.media_urls || []} 
                        onUpdate={(items) => handleDeepNestedChange('offers', 'mid_section', 'media_urls', items)} 
                        type={formData.offers.mid_section.type} 
                        label="Banner Asset"
                        onUploadTrigger={() => document.getElementById(`upload-mid-${formData.offers.mid_section.type}`).click()}
                      />
                      <input 
                        id={`upload-mid-${formData.offers.mid_section.type}`} 
                        type="file" 
                        accept={formData.offers.mid_section.type === 'image' ? 'image/*' : 'video/*'} 
                        multiple 
                        className="hidden" 
                        onChange={(e) => handleMultipleFileUpload(e.target.files, (urls) => {
                           const current = formData.offers.mid_section.media_urls || [];
                           handleDeepNestedChange('offers', 'mid_section', 'media_urls', [...current, ...urls]);
                        }, formData.offers.mid_section.type)} 
                      />
                    </>
                  )}
                </div>

                <div className="flex gap-4">
                    <div className={`p-6 border rounded-3xl flex-1 transition-all ${formData.offers.header.enabled ? 'border-blue-400 bg-blue-50' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-3 mb-4"><input type="checkbox" checked={formData.offers.header.enabled} onChange={(e) => handleDeepNestedChange('offers', 'header', 'enabled', e.target.checked)} className="w-5 h-5" /><span className="font-bold">Header Alert</span></div>
                      {formData.offers.header.enabled && <input type="text" value={formData.offers.header.text} onChange={(e) => handleDeepNestedChange('offers', 'header', 'text', e.target.value)} placeholder="Text..." className="w-full p-2 border rounded-lg bg-white" />}
                    </div>
                    <div className={`p-6 border rounded-3xl flex-1 transition-all ${formData.offers.footer.enabled ? 'border-blue-400 bg-blue-50' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-3 mb-4"><input type="checkbox" checked={formData.offers.footer.enabled} onChange={(e) => handleDeepNestedChange('offers', 'footer', 'enabled', e.target.checked)} className="w-5 h-5" /><span className="font-bold">Footer Alert</span></div>
                      {formData.offers.footer.enabled && <input type="text" value={formData.offers.footer.text} onChange={(e) => handleDeepNestedChange('offers', 'footer', 'text', e.target.value)} placeholder="Text..." className="w-full p-2 border rounded-lg bg-white" />}
                    </div>
                </div>

                <div className="bg-neutral-900 p-6 border rounded-3xl">
                  <h4 className="font-bold mb-4">Popups</h4>
                  <div className="grid grid-cols-3 gap-6">
                    {Object.entries(formData.offers.popups).map(([key, p]) => (
                      <div key={key} className={`p-4 border rounded-2xl transition-all ${p.enabled ? 'border-blue-400 bg-blue-50' : 'bg-slate-50'}`}>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-bold uppercase text-slate-400">{key}</span>
                          <input type="checkbox" checked={p.enabled} onChange={(e) => {
                            const clone = {...formData.offers.popups}; clone[key].enabled = e.target.checked;
                            handleNestedChange('offers', 'popups', clone);
                          }} />
                        </div>
                        <input type="text" value={p.title} onChange={(e) => {
                          const clone = {...formData.offers.popups}; clone[key].title = e.target.value;
                          handleNestedChange('offers', 'popups', clone);
                        }} placeholder="Heading" className="w-full p-2 text-xs border rounded-lg" disabled={!p.enabled} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MAIN NAVIGATION */}
            {/* UPDATED: Added centered save button */}
            <div className="flex justify-between items-center mt-12 pt-6 border-t">
              <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="flex items-center gap-2 px-6 py-2 border rounded-xl font-bold hover:bg-slate-50 disabled:opacity-30"><ArrowLeft className="w-4 h-4" /> Previous</button>
              
              <button onClick={() => handleSave(false)} className="bg-blue-50 text-blue-600 px-6 py-2 rounded-xl font-bold hover:bg-blue-100 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>

              {currentStep === steps.length - 1 ? (
                <button onClick={() => handleSave(true)} disabled={isSaving || uploadingFiles} className="flex items-center gap-2 bg-green-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-green-700 shadow-lg"><Save className="w-4 h-4" /> Save & Submit</button>
              ) : (
                <button onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-2 rounded-xl font-bold hover:bg-slate-800">Next Step <ArrowRight className="w-4 h-4" /></button>
              )}
            </div>

          </div>
        </div>
      </div>
      
      {/* UI Helper Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}} />
    </div>
  );
}