import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, Eye, ArrowLeft, ArrowRight, Info, Layout, Sparkles, 
  Package, MapPin, Image as ImageIcon, MessageSquare, HelpCircle, 
  BookOpen, Tag, Plus, Trash2, X, Upload, Search, Film, Check,
  MonitorPlay, ChevronLeft
} from 'lucide-react';

// Rich Text Editor - React Quill
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// --- TEMPLATE IMPORTS ---
import ModernTemplate from './templates/ModernTemplate/ModernTemplate';

const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const API_KEY = 'x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ';
const UPLOAD_URL = 'https://api.yaadigo.com/upload';
const MULTIPLE_UPLOAD_URL = 'https://api.yaadigo.com/multiple';

export default function LandingPageCreate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Preview State
  const [showPreview, setShowPreview] = useState(false);

  // Available data from API
  const [availableTrips, setAvailableTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [tripSearchQuery, setTripSearchQuery] = useState('');
  const [showTripDropdown, setShowTripDropdown] = useState(false);

  // Template Display Mapping
  const templateMap = {
    'template-one': 'Minimal',
    'template-two': 'Classic',
    'template-three': 'Modern'
  };

  // Form Data Initial State
  const [formData, setFormData] = useState({
    page_name: '',
    slug: '',
    template: 'template-three', // Default to Modern
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
      // --- UPDATED DEFAULTS HERE ---
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

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'clean']
    ]
  };

  useEffect(() => {
    fetchTrips();
    if (id) fetchLandingPage(id);
  }, [id]);

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
      const response = await fetch(`${API_BASE_URL}/trips`, {
        headers: { 'x-api-key': API_KEY }
      });
      const data = await response.json();
      setAvailableTrips(data.data || data);
      setFilteredTrips(data.data || data);
    } catch (error) { 
      console.error('Error fetching trips:', error);
      alert('Failed to load trips');
    }
  };

  const fetchLandingPage = async (pageId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/landing-pages/${pageId}`, {
        headers: { 'x-api-key': API_KEY }
      });
      if (!response.ok) throw new Error('Failed to fetch landing page');
      const data = await response.json();
      setFormData(data.data || data);
    } catch (error) { 
      console.error('Error loading landing page:', error);
      alert('Error loading landing page'); 
    }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (formData.page_name && !id) {
      const slug = formData.page_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.page_name, id]);

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

  const uploadSingleFile = async (file) => {
    const fd = new FormData();
    fd.append('image', file); 
    fd.append('storage', 'local');
    
    try {
      const response = await fetch(UPLOAD_URL, { method: 'POST', body: fd });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      if (data.message === 'Upload successful' || data.url) return data.url;
      throw new Error('Upload response invalid');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
      return null;
    }
  };

  const uploadMultipleFiles = async (files) => {
    const fd = new FormData();
    Array.from(files).forEach(file => fd.append('gallery_images', file)); 
    fd.append('storage', 'local');
    
    try {
      const response = await fetch(MULTIPLE_UPLOAD_URL, { method: 'POST', body: fd });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      if (data.message === 'Files uploaded' && data.files) {
        return Array.isArray(data.files) ? data.files.flat() : [data.files];
      }
      throw new Error('Upload response invalid');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload files');
      return [];
    }
  };

  const handleFileUpload = async (file, callback) => {
    if (!file) return;
    setUploadingFiles(true);
    const url = await uploadSingleFile(file);
    setUploadingFiles(false);
    if (url) callback(url);
  };

  const handleMultipleFileUpload = async (files, callback) => {
    if (!files || files.length === 0) return;
    setUploadingFiles(true);
    const urls = await uploadMultipleFiles(files);
    setUploadingFiles(false);
    if (urls && urls.length > 0) callback(urls);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.page_name || formData.page_name.trim() === '') errors.page_name = 'Page name is required';
    if (!formData.slug || formData.slug.trim() === '') {
      errors.slug = 'URL slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    if (!formData.hero || !formData.hero.title || formData.hero.title.trim() === '') errors.hero_title = 'Hero title is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    setValidationErrors({});
    if (!validateForm()) {
      alert('Please fix the validation errors before saving');
      setCurrentStep(0);
      return;
    }
    if (uploadingFiles) {
      alert('Please wait for file uploads to complete');
      return;
    }
    
    setIsSaving(true);
    try {
      const url = id 
        ? `${API_BASE_URL}/landing-pages/${id}/` 
        : `${API_BASE_URL}/landing-pages/`;
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json', 
          'x-api-key': API_KEY 
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'Failed to save');
      }
      
      alert(id ? 'Landing page updated successfully!' : 'Landing page created successfully!');
      navigate('/admin/dashboard/landing-pages');
    } catch (error) { 
      console.error('Save error:', error);
      if (error.message.includes('Slug already exists')) {
        setValidationErrors({ slug: 'This slug is already in use.' });
        setCurrentStep(0);
        alert('Error: This slug is already in use.');
      } else if (error.message.includes('Unauthorized')) {
        alert('Authentication error. Please check your API key.');
      } else {
        alert('Failed to save landing page: ' + error.message);
      }
    }
    finally { setIsSaving(false); }
  };

  const getTripPriceDisplay = (trip) => {
    if (!trip) return 'N/A';
    if (trip.pricing_model === 'custom' || trip.pricing_model === 'customized' || trip.is_custom) {
      const basePrice = trip.pricing?.customized?.base_price || trip.base_price || trip.price;
      return basePrice ? `Starting from ₹${basePrice}` : 'Price on Request';
    }
    if (trip.pricing_model === 'fixed_departure') {
        const price = trip.pricing?.fixed_departure?.[0]?.price || trip.price;
        return `₹${price}`;
    }
    return `₹${trip.price || trip.base_price || 0}`;
  };

  const badgeOptions = ['Hot Deal', 'Best Seller', 'Most Popular', 'Limited Offer', 'New'];

  // --- RENDER PREVIEW LOGIC ---
  const renderTemplatePreview = () => {
    switch(formData.template) {
      case 'template-three': // Modern
        return <ModernTemplate pageData={formData} />;
      case 'template-two': // Classic
        return (
            <div className="flex flex-col items-center justify-center h-full bg-slate-50 text-slate-500">
                <Layout className="w-16 h-16 mb-4 opacity-20" />
                <h2 className="text-2xl font-bold">Classic Template</h2>
                <p>Preview implementation coming soon for this template.</p>
            </div>
        );
      case 'template-one': // Minimal
      default:
        return (
            <div className="flex flex-col items-center justify-center h-full bg-slate-50 text-slate-500">
                <Layout className="w-16 h-16 mb-4 opacity-20" />
                <h2 className="text-2xl font-bold">Minimal Template</h2>
                <p>Preview implementation coming soon for this template.</p>
            </div>
        );
    }
  };

  if (isLoading) return <div className="p-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans relative">
      {/* --- PREVIEW MODAL OVERLAY --- */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-white overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-200">
          {/* Header Bar */}
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-20 shrink-0">
            <div className="flex items-center gap-4">
               {/* MAIN BACK BUTTON IN HEADER */}
               <button onClick={() => setShowPreview(false)} className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors font-bold text-lg">
                 <ArrowLeft className="w-6 h-6" /> Back to Editor
               </button>
               <div className="h-6 w-px bg-slate-700 mx-2 hidden sm:block"></div>
               <span className="text-slate-400 text-sm hidden sm:block">Previewing: <span className="text-white">{formData.page_name || 'Untitled Page'}</span></span>
            </div>
            
            <div className="flex items-center gap-4">
               <span className="text-xs bg-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                 {templateMap[formData.template]} Mode
               </span>
            </div>
          </div>

          {/* Preview Content Area */}
          <div className="flex-1 overflow-y-auto bg-white custom-scrollbar relative">
            {renderTemplatePreview()}
            
            {/* FLOATING BACK BUTTON (Bottom Right Fallback) */}
            <button 
              onClick={() => setShowPreview(false)} 
              className="fixed bottom-8 right-8 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-black hover:scale-105 transition-all z-50 flex items-center justify-center group"
              title="Close Preview"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Upload Indicator */}
      {uploadingFiles && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span>Uploading files...</span>
        </div>
      )}

      {/* Main Editor Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{id ? 'Edit Landing Page' : 'Create Landing Page'}</h1>
          <p className="text-slate-500 mt-1">Design a high-converting travel experience</p>
        </div>
        <div className="flex gap-3">
           {/* Main Preview Button */}
          <button onClick={() => setShowPreview(true)} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm hover:bg-slate-50 hover:text-blue-600 font-bold transition-all">
            <MonitorPlay className="w-4 h-4" /> Preview
          </button>
          <button onClick={() => navigate('/admin/dashboard/landing-pages')} className="border bg-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 shadow-sm text-slate-700"><ArrowLeft className="w-4 h-4" /> Back</button>
          <button onClick={handleSave} disabled={isSaving || uploadingFiles} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg disabled:opacity-50"><Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Page'}</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar Nav */}
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

        {/* Main Form Content */}
        <div className="col-span-9 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            
            {/* STEP 0: GENERAL */}
            {currentStep === 0 && (
              <div className="space-y-8 animate-in fade-in">
                <section>
                  <h3 className="text-lg font-bold border-b pb-2 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Page Name *</label>
                      <input type="text" value={formData.page_name} onChange={(e) => handleChange('page_name', e.target.value)} placeholder="e.g. Exotic Bali Getaway" className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.page_name ? 'border-red-500' : ''}`} />
                      {validationErrors.page_name && <p className="text-xs text-red-500 mt-1">{validationErrors.page_name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">URL Slug *</label>
                      <input type="text" value={formData.slug} onChange={(e) => handleChange('slug', e.target.value)} placeholder="bali-tour" className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.slug ? 'border-red-500' : ''}`} />
                      {validationErrors.slug ? (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.slug}</p>
                      ) : (
                        <p className="text-xs text-blue-500 mt-1 font-medium italic">Path: /landing/{formData.slug}</p>
                      )}
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold border-b pb-2 mb-4">Company & Social Presence</h3>
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <input type="text" value={formData.company.name} onChange={(e) => handleNestedChange('company', 'name', e.target.value)} placeholder="Company Name" className="w-full px-4 py-2 border rounded-lg" />
                    <input type="text" value={formData.company.contact} onChange={(e) => handleNestedChange('company', 'contact', e.target.value)} placeholder="Support Contact (Phone/Email)" className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {['facebook', 'instagram', 'twitter', 'youtube'].map(plat => (
                      <input key={plat} type="text" value={formData.company.social_media[plat]} onChange={(e) => handleDeepNestedChange('company', 'social_media', plat, e.target.value)} placeholder={`${plat.charAt(0).toUpperCase() + plat.slice(1)} URL`} className="w-full px-4 py-2 border rounded-lg text-sm" />
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold border-b pb-2 mb-4">Search Engine Optimization</h3>
                  <div className="space-y-4">
                    <input type="text" value={formData.seo.meta_title} onChange={(e) => handleNestedChange('seo', 'meta_title', e.target.value)} placeholder="SEO Meta Title" className="w-full px-4 py-2 border rounded-lg" />
                    <textarea value={formData.seo.meta_description} onChange={(e) => handleNestedChange('seo', 'meta_description', e.target.value)} placeholder="SEO Meta Description" rows={3} className="w-full px-4 py-2 border rounded-lg" />
                    <input type="text" value={formData.seo.meta_tags} onChange={(e) => handleNestedChange('seo', 'meta_tags', e.target.value)} placeholder="Meta Tags (tour, bali, luxury, etc)" className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                </section>

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
                <div className="flex justify-between items-center"><h3 className="text-xl font-bold">Visual Layouts</h3></div>
                <div className="grid grid-cols-3 gap-6">
                  {Object.keys(templateMap).map(template => (
                    <div key={template} onClick={() => handleChange('template', template)} className={`cursor-pointer group relative p-4 border-2 rounded-2xl transition-all ${formData.template === template ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}>
                      <div className="aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center group-hover:bg-blue-100">
                        <Layout className={`w-12 h-12 ${formData.template === template ? 'text-blue-600' : 'text-slate-300'}`} />
                      </div>
                      <div className="text-center">
                        <p className="font-bold capitalize">{templateMap[template]}</p>
                        {/* Modified Preview Button to Trigger Modal */}
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
                <section>
                  <h3 className="text-xl font-bold mb-4">Hero Content</h3>
                  <div className="grid gap-4">
                    <div>
                      <input type="text" value={formData.hero.title} onChange={(e) => handleNestedChange('hero', 'title', e.target.value)} placeholder="Hero Main Title *" className={`w-full text-2xl font-bold px-4 py-3 border-b-2 border-gray-100 focus:border-blue-500 outline-none ${validationErrors.hero_title ? 'border-red-500' : ''}`} />
                      {validationErrors.hero_title && <p className="text-xs text-red-500 mt-1">{validationErrors.hero_title}</p>}
                    </div>
                    <input type="text" value={formData.hero.subtitle} onChange={(e) => handleNestedChange('hero', 'subtitle', e.target.value)} placeholder="Sub-heading or Catchphrase" className="w-full px-4 py-2 border rounded-lg" />
                    <textarea value={formData.hero.description} onChange={(e) => handleNestedChange('hero', 'description', e.target.value)} placeholder="Brief compelling description..." rows={3} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-6 mt-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-widest">Primary CTA Button</label>
                      <input type="text" value={formData.hero.cta_button_1.text} onChange={(e) => handleDeepNestedChange('hero', 'cta_button_1', 'text', e.target.value)} placeholder="Text (e.g. Book Now)" className="w-full px-3 py-2 border rounded-lg mb-2" />
                      <input type="text" value={formData.hero.cta_button_1.link} onChange={(e) => handleDeepNestedChange('hero', 'cta_button_1', 'link', e.target.value)} placeholder="URL Link or #section" className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-widest">Secondary CTA Button</label>
                      <input type="text" value={formData.hero.cta_button_2.text} onChange={(e) => handleDeepNestedChange('hero', 'cta_button_2', 'text', e.target.value)} placeholder="Text (e.g. Enquire)" className="w-full px-3 py-2 border rounded-lg mb-2" />
                      <input type="text" value={formData.hero.cta_button_2.link} onChange={(e) => handleDeepNestedChange('hero', 'cta_button_2', 'link', e.target.value)} placeholder="URL Link or #section" className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                  </div>
                </section>

                <section className="bg-slate-900 rounded-3xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><ImageIcon className="w-5 h-5 text-blue-400" /> Background Media</h3>
                  <div className="flex gap-4 mb-6">
                    {['slider', 'video'].map(type => (
                      <button key={type} onClick={() => handleNestedChange('hero', 'background_type', type)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${formData.hero.background_type === type ? 'bg-blue-600 shadow-lg shadow-blue-500/50 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>{type === 'slider' ? 'Image Slider' : 'Video Player'}</button>
                    ))}
                  </div>

                  {formData.hero.background_type === 'slider' ? (
                    <div className="grid grid-cols-4 gap-4">
                      {formData.hero.background_images.map((url, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-slate-700">
                          <img src={url} className="w-full h-full object-cover" />
                          <button onClick={() => handleNestedChange('hero', 'background_images', formData.hero.background_images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-500 p-1.5 rounded-full hover:scale-110 transition-all opacity-0 group-hover:opacity-100"><X className="w-3 h-3 text-white" /></button>
                        </div>
                      ))}
                      <button onClick={() => {
                        const input = document.createElement('input'); input.type='file'; input.accept='image/*'; input.multiple=true;
                        input.onchange=(e) => { if(e.target.files) handleMultipleFileUpload(e.target.files, (urls) => handleNestedChange('hero', 'background_images', [...formData.hero.background_images, ...urls])); };
                        input.click();
                      }} className="aspect-square border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center hover:bg-slate-800 transition-all"><Upload className="w-6 h-6 text-slate-500 mb-2" /><span className="text-[10px] font-bold uppercase text-slate-500">Upload</span></button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {formData.hero.background_videos.map((url, idx) => (
                        <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border-2 border-slate-700">
                          <video src={url} className="w-full h-full object-cover" controls />
                          <button onClick={() => handleNestedChange('hero', 'background_videos', formData.hero.background_videos.filter((_, i) => i !== idx))} className="absolute top-2 right-2 bg-red-500 p-2 rounded-full z-10"><X className="w-4 h-4 text-white" /></button>
                        </div>
                      ))}
                      <button onClick={() => {
                        const input = document.createElement('input'); input.type='file'; input.accept='video/*'; input.multiple=true;
                        input.onchange=(e) => { if(e.target.files) handleMultipleFileUpload(e.target.files, (urls) => handleNestedChange('hero', 'background_videos', [...formData.hero.background_videos, ...urls])); };
                        input.click();
                      }} className="aspect-video border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center hover:bg-slate-800"><Film className="w-6 h-6 text-slate-500 mb-2" /><span className="text-xs font-bold uppercase text-slate-500">Add Video</span></button>
                    </div>
                  )}
                </section>

                <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3 border border-blue-100">
                    <Info className="text-blue-600 w-5 h-5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                        <strong>Pro Tip:</strong> Want to see how your hero section looks? Click the <strong className="cursor-pointer hover:underline" onClick={() => setShowPreview(true)}>Preview Button</strong> at the top right to see changes in real-time!
                    </p>
                </div>
              </div>
            )}

            {/* STEP 3: PACKAGES */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl text-white">
                  <div className="flex items-center gap-3">
                    <Package className="text-blue-400" />
                    <div><h3 className="font-bold text-white">Trip Inventory Selection</h3><p className="text-xs text-slate-400">Add packages to your landing page showcase</p></div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.packages.show_section} onChange={(e) => handleNestedChange('packages', 'show_section', e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                {formData.packages.show_section && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <input type="text" value={formData.packages.section_title} onChange={(e) => handleNestedChange('packages', 'section_title', e.target.value)} placeholder="Section Title" className="w-full px-4 py-2 border rounded-lg font-bold" />
                        <input type="text" value={formData.packages.section_subtitle} onChange={(e) => handleNestedChange('packages', 'section_subtitle', e.target.value)} placeholder="Section Subtitle" className="w-full px-4 py-2 border rounded-lg text-sm" />
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
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Selected Inventory ({formData.packages.selected_trips.length})</h4>
                      <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        {formData.packages.selected_trips.map((st, idx) => {
                          const tripData = availableTrips.find(t => t.id === st.trip_id);
                          const displayImage = tripData?.hero_image || tripData?.images?.[0];
                          
                          return (
                            <div key={idx} className="flex gap-3 p-3 bg-white rounded-xl border group hover:shadow-md transition-all relative">
                              <img src={displayImage} className="w-16 h-16 object-cover rounded-lg" alt="thumb" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate pr-6">{st.trip_title}</p>
                                <p className="text-[11px] text-blue-600 font-extrabold">{getTripPriceDisplay(tripData)}</p>
                                <select value={st.badge} onChange={(e) => {
                                  const list = [...formData.packages.selected_trips]; list[idx].badge = e.target.value;
                                  handleNestedChange('packages', 'selected_trips', list);
                                }} className="mt-2 text-[10px] border px-2 py-1 rounded bg-slate-50 font-bold">
                                  <option value="">NO LABEL</option>
                                  {badgeOptions.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                              </div>
                              <button onClick={() => handleNestedChange('packages', 'selected_trips', formData.packages.selected_trips.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          );
                        })}
                      </div>
                      {formData.packages.selected_trips.length === 0 && <div className="text-center py-10 text-slate-400"><Package className="mx-auto mb-2 opacity-20" /><p className="text-sm">Start searching above to add trips</p></div>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: ATTRACTIONS */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center"><h3 className="text-xl font-bold">Area Highlights</h3><button onClick={() => addArrayItem('attractions', { title: '', image: '', description: '' })} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md"><Plus className="w-4 h-4" /> Add Attraction</button></div>
                
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
                          <ReactQuill theme="snow" value={item.description} onChange={(v) => handleArrayItemChange('attractions', idx, 'description', v)} modules={quillModules} placeholder="Why is this place special?" className="bg-slate-50 rounded-xl" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: GALLERY */}
            {currentStep === 5 && (
              <div className="space-y-12 animate-in fade-in">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input type="text" value={formData.gallery.section_title} onChange={(e) => handleNestedChange('gallery', 'section_title', e.target.value)} placeholder="Section Title" className="w-full px-4 py-2 border rounded-lg font-bold" />
                  <input type="text" value={formData.gallery.section_subtitle} onChange={(e) => handleNestedChange('gallery', 'section_subtitle', e.target.value)} placeholder="Section Subtitle" className="w-full px-4 py-2 border rounded-lg text-sm" />
                </div>

                <section>
                  <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Image Vault</h3><button onClick={() => {
                    const input = document.createElement('input'); input.type='file'; input.accept='image/*'; input.multiple=true;
                    input.onchange=(e) => { if(e.target.files) handleMultipleFileUpload(e.target.files, (urls) => handleNestedChange('gallery', 'images', [...formData.gallery.images, ...urls])); };
                    input.click();
                  }} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-100">UPLOAD MULTIPLE</button></div>
                  <div className="grid grid-cols-5 gap-4">
                    {formData.gallery.images.map((url, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm border">
                        <img src={url} className="w-full h-full object-cover" />
                        <button onClick={() => handleNestedChange('gallery', 'images', formData.gallery.images.filter((_, i) => i !== idx))} className="absolute top-2 right-2 bg-red-500 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Video Showcase</h3><button onClick={() => {
                    const input = document.createElement('input'); input.type='file'; input.accept='video/*'; input.multiple=true;
                    input.onchange=(e) => { if(e.target.files) handleMultipleFileUpload(e.target.files, (urls) => handleNestedChange('gallery', 'videos', [...formData.gallery.videos, ...urls])); };
                    input.click();
                  }} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md">ADD VIDEOS</button></div>
                  <div className="grid grid-cols-3 gap-4">
                    {formData.gallery.videos.map((url, idx) => (
                      <div key={idx} className="relative group aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
                        <video src={url} className="w-full h-full object-cover" controls />
                        <button onClick={() => handleNestedChange('gallery', 'videos', formData.gallery.videos.filter((_, i) => i !== idx))} className="absolute top-2 right-2 bg-red-500 p-2 rounded-full text-white z-10"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* STEP 6: TESTIMONIALS */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center"><h3 className="text-xl font-bold">Traveler Voices</h3><button onClick={() => addArrayItem('testimonials', { name: '', destination: '', rating: 5, description: '', image: '', date: '' })} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> Add Review</button></div>
                
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
                           <input type="text" value={item.destination} onChange={(e) => handleArrayItemChange('testimonials', idx, 'destination', e.target.value)} placeholder="Trip Taken (e.g. Kerala Package)" className="w-full px-4 py-2 border rounded-lg" />
                           <div className="flex items-center gap-4 bg-white px-4 py-2 border rounded-lg">
                             <span className="text-xs font-bold text-slate-400">RATING</span>
                             <select value={item.rating} onChange={(e) => handleArrayItemChange('testimonials', idx, 'rating', parseInt(e.target.value))} className="flex-1 font-bold text-yellow-600 outline-none">
                               {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                             </select>
                           </div>
                           <input type="date" value={item.date} onChange={(e) => handleArrayItemChange('testimonials', idx, 'date', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                           <textarea value={item.description} onChange={(e) => handleArrayItemChange('testimonials', idx, 'description', e.target.value)} placeholder="Write their review here..." rows={3} className="w-full px-4 py-2 border rounded-lg col-span-2" />
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
                <div className="flex justify-between items-center"><h3 className="text-xl font-bold">Knowledge Base</h3><button onClick={() => addArrayItem('faqs', { question: '', answer: '' })} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> Add FAQ</button></div>
                
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
                <h3 className="text-xl font-bold">Pro-Traveler Guidelines</h3>
                <div className="grid gap-4 mb-4">
                  <input type="text" value={formData.travel_guidelines.section_title} onChange={(e) => handleNestedChange('travel_guidelines', 'section_title', e.target.value)} placeholder="Section Title" className="w-full px-4 py-2 border rounded-lg font-bold" />
                  <input type="text" value={formData.travel_guidelines.section_subtitle} onChange={(e) => handleNestedChange('travel_guidelines', 'section_subtitle', e.target.value)} placeholder="Subtitle" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <ReactQuill theme="snow" value={formData.travel_guidelines.description} onChange={(v) => handleNestedChange('travel_guidelines', 'description', v)} modules={quillModules} className="bg-white rounded-xl h-96 mb-12 shadow-inner" />
              </div>
            )}

            {/* STEP 9: OFFERS */}
            {currentStep === 9 && (
              <div className="space-y-10 animate-in fade-in">
                <section>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Tag className="text-red-500" /> Active Promotions</h3>
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
                </section>

                <section className="space-y-6">
                  <div className="flex gap-4">
                    <div className={`p-6 border rounded-3xl flex-1 transition-all ${formData.offers.header.enabled ? 'border-blue-400 bg-blue-50 shadow-md shadow-blue-100' : 'border-slate-200 opacity-60'}`}>
                      <div className="flex items-center gap-3 mb-4"><input type="checkbox" checked={formData.offers.header.enabled} onChange={(e) => handleDeepNestedChange('offers', 'header', 'enabled', e.target.checked)} className="w-5 h-5 rounded cursor-pointer" /><span className="font-bold">Header Alert Bar</span></div>
                      {formData.offers.header.enabled && <input type="text" value={formData.offers.header.text} onChange={(e) => handleDeepNestedChange('offers', 'header', 'text', e.target.value)} placeholder="Discount code text..." className="w-full p-2 border rounded-lg bg-white" />}
                    </div>
                    <div className={`p-6 border rounded-3xl flex-1 transition-all ${formData.offers.footer.enabled ? 'border-blue-400 bg-blue-50 shadow-md shadow-blue-100' : 'border-slate-200 opacity-60'}`}>
                      <div className="flex items-center gap-3 mb-4"><input type="checkbox" checked={formData.offers.footer.enabled} onChange={(e) => handleDeepNestedChange('offers', 'footer', 'enabled', e.target.checked)} className="w-5 h-5 rounded cursor-pointer" /><span className="font-bold">Sticky Footer Code</span></div>
                      {formData.offers.footer.enabled && <input type="text" value={formData.offers.footer.text} onChange={(e) => handleDeepNestedChange('offers', 'footer', 'text', e.target.value)} placeholder="Coupon text..." className="w-full p-2 border rounded-lg bg-white" />}
                    </div>
                  </div>

                  <div className="p-8 border rounded-3xl bg-slate-50">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3"><input type="checkbox" checked={formData.offers.mid_section.enabled} onChange={(e) => handleDeepNestedChange('offers', 'mid_section', 'enabled', e.target.checked)} className="w-5 h-5" /><h4 className="font-bold text-lg">In-Page Banner Assets</h4></div>
                      {formData.offers.mid_section.enabled && (
                        <div className="flex p-1 bg-white border rounded-xl">
                          {['image', 'video'].map(t => (
                            <button key={t} onClick={() => handleDeepNestedChange('offers', 'mid_section', 'type', t)} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${formData.offers.mid_section.type === t ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-400'}`}>{t}</button>
                          ))}
                        </div>
                      )}
                    </div>
                    {formData.offers.mid_section.enabled && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-4 gap-4">
                          {formData.offers.mid_section.media_urls.map((url, idx) => (
                            <div key={idx} className="relative group aspect-video bg-white rounded-2xl overflow-hidden border shadow-sm">
                              {formData.offers.mid_section.type === 'image' ? <img src={url} className="w-full h-full object-cover" /> : <video src={url} className="w-full h-full object-cover" controls />}
                              <button onClick={() => handleDeepNestedChange('offers', 'mid_section', 'media_urls', formData.offers.mid_section.media_urls.filter((_, i) => i !== idx))} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button>
                            </div>
                          ))}
                          <button onClick={() => {
                            const input = document.createElement('input'); input.type='file'; input.accept=formData.offers.mid_section.type === 'image' ? 'image/*' : 'video/*'; input.multiple=true;
                            input.onchange=(e) => { if(e.target.files) handleMultipleFileUpload(e.target.files, (urls) => handleDeepNestedChange('offers', 'mid_section', 'media_urls', [...formData.offers.mid_section.media_urls, ...urls])); };
                            input.click();
                          }} className="aspect-video border-2 border-dashed rounded-2xl flex flex-col items-center justify-center hover:bg-white text-slate-400 font-bold text-xs"><Upload className="mb-1" /> UPLOAD</button>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
                
                <section className="bg-white p-6 border rounded-3xl">
                  <h4 className="font-bold mb-4">Urgency Popups</h4>
                  <div className="grid grid-cols-3 gap-6">
                    {Object.entries(formData.offers.popups).map(([key, p]) => (
                      <div key={key} className={`p-4 border rounded-2xl transition-all ${p.enabled ? 'border-blue-400 bg-blue-50' : 'bg-slate-50'}`}>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter">{key} Popup</span>
                          <input type="checkbox" checked={p.enabled} onChange={(e) => {
                            const clone = {...formData.offers.popups}; clone[key].enabled = e.target.checked;
                            handleNestedChange('offers', 'popups', clone);
                          }} />
                        </div>
                        <input type="text" value={p.title} onChange={(e) => {
                          const clone = {...formData.offers.popups}; clone[key].title = e.target.value;
                          handleNestedChange('offers', 'popups', clone);
                        }} placeholder="Popup Heading" className="w-full p-2 text-xs border rounded-lg" disabled={!p.enabled} />
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* SHARED NAVIGATION */}
            <div className="flex justify-between mt-12 pt-6 border-t">
              <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="flex items-center gap-2 px-6 py-2 border rounded-xl font-bold hover:bg-slate-50 disabled:opacity-30"><ArrowLeft className="w-4 h-4" /> Previous</button>
              {currentStep === steps.length - 1 ? (
                <button onClick={handleSave} disabled={isSaving || uploadingFiles} className="flex items-center gap-2 bg-green-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-green-700 shadow-lg"><Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save & Submit'}</button>
              ) : (
                <button onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-2 rounded-xl font-bold hover:bg-slate-800">Next Step <ArrowRight className="w-4 h-4" /></button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Small UI CSS helper */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}} />
    </div>
  );
}