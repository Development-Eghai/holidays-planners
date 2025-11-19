// src/pages/admin/modules/QuotationManagement/components/QuotationFormSteps.jsx
// COMPLETE FIX: Edit pre-population + QR upload via /multiple + Per-step Save + Client Update Endpoint
import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Grid, Typography, Alert, CircularProgress,
  IconButton, FormControl, InputLabel, Select, MenuItem, Autocomplete,
  Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent,
  Avatar, Chip, Paper, Divider
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  Visibility as VisibilityIcon, 
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  FlightTakeoff as FlightTakeoffIcon,
  ListAlt as ListAltIcon,
  MonetizationOn as MonetizationOnIcon,
  Gavel as GavelIcon,
  CreditCard as CreditCardIcon
} from '@mui/icons-material';
import axios from 'axios';
import QuotationViewDialog from './QuotationViewDialog';

const STEPS = 7;
const API_KEY = 'x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ';
const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const UPLOAD_API = 'https://api.yaadigo.com/upload';
const MULTIPLE_UPLOAD_API = 'https://api.yaadigo.com/multiple';

const BASE_FORM_DATA = {
  design: '',
  lead_id: 0,
  lead_source: '',
  client_name: '',
  client_email: '',
  client_mobile: '',
  agent: { name: 'Agent Name', email: 'agent@example.com', contact: '+91-9876543210' },
  company: { 
    name: 'Holidays Planners', 
    email: 'info@holidaysplanners.com', 
    mobile: '+91-9988776655', 
    website: 'https://holidaysplanners.com', 
    licence: 'TRV-12345', 
    logo_url: '' 
  },
  trip_id: null,
  display_title: '',
  overview: '',
  hero_image: '',
  gallery_images: [],
  itinerary: [{ day: 1, title: 'Arrival Day', description: 'Arrive at destination and hotel check-in.' }],
  costing: { 
    type: 'person', 
    currency: 'INR', 
    total_amount: 0, 
    items: [{ name: 'Accommodation', quantity: 1, unit_price: 0 }] 
  },
  policies: { 
    payment_terms: '50% advance at booking, 50% before 7 days of travel.', 
    cancellation_policy: 'Cancellation charges apply as per terms.', 
    terms_and_conditions: 'Subject to availability and T&C.', 
    custom_policy: '' 
  },
  payment: { 
    bank_name: '', 
    account_number: '', 
    ifsc_code: '', 
    branch_name: '', 
    gst_number: '', 
    address: '', 
    upi_ids: [''], 
    qr_code_url: '' 
  },
  status: 'Draft',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
};

const QuotationFormSteps = ({ activeStep, setActiveStep, handleClose, API_KEY: propKey, QUOTATION_API, quotation }) => {
  const apiKey = propKey || API_KEY;
  const [formData, setFormData] = useState(BASE_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [availableLeads, setAvailableLeads] = useState([]);
  const [availableTrips, setAvailableTrips] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [uploadingQR, setUploadingQR] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // FIX 1: Proper edit data population, including costing details
  useEffect(() => {
    if (quotation && quotation.id) {
      console.log('Loading quotation for edit:', quotation);
      
      // Map the quotation data properly
      setFormData({
        design: quotation.design || '',
        lead_id: quotation.lead_id || 0,
        // Use merged properties from QuotationManagement.jsx or fallback
        lead_source: quotation.__lead_source || quotation.lead_source || '',
        client_name: quotation.__client_name || quotation.client_name || '',
        client_email: quotation.__client_email || quotation.client_email || '',
        client_mobile: quotation.__client_mobile || quotation.client_mobile || '',
        agent: quotation.agent || BASE_FORM_DATA.agent,
        company: quotation.company || BASE_FORM_DATA.company,
        trip_id: quotation.trip_id || null,
        display_title: quotation.trip?.display_title || quotation.display_title || '',
        overview: quotation.trip?.overview || quotation.overview || '',
        hero_image: quotation.trip?.hero_image || quotation.hero_image || '',
        gallery_images: quotation.trip?.gallery_images || quotation.gallery_images || [],
        itinerary: quotation.itinerary || BASE_FORM_DATA.itinerary,
       costing: { // FIX: Ensure costing object is fully mapped
  type: quotation.costing?.type || 'person',
  currency: quotation.costing?.currency || 'INR', 
  total_amount: quotation.amount || 0,
  items: quotation.costing?.items || BASE_FORM_DATA.costing.items
},
        policies: quotation.policies || BASE_FORM_DATA.policies,
        payment: quotation.payment || BASE_FORM_DATA.payment,
        status: quotation.status || 'Draft',
        amount: quotation.amount || 0,
        date: quotation.date ? quotation.date.split('T')[0] : new Date().toISOString().split('T')[0],
      });
      
      console.log('Form data populated for edit');
    }
  }, [quotation]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bookingResp, enquiresResp, leadsResp, tripsResp] = await Promise.all([
          fetch(`${API_BASE_URL}/bookings/`, { headers: { 'x-api-key': apiKey } }).then(r => r.json()).catch(()=>({})),
          fetch(`${API_BASE_URL}/enquires/`, { headers: { 'x-api-key': apiKey } }).then(r => r.json()).catch(()=>({})),
          fetch(`${API_BASE_URL}/leads/`, { headers: { 'x-api-key': apiKey } }).then(r => r.json()).catch(()=>({})),
          fetch(`${API_BASE_URL}/trips/`, { headers: { 'x-api-key': apiKey } }).then(r => r.json()).catch(()=>({}))
        ]);

        const bookingList = bookingResp?.data || bookingResp || [];
        const enquireList = enquiresResp?.data || enquiresResp || [];
        const leadList = leadsResp?.data || leadsResp || [];
        const tripsList = tripsResp?.data || tripsResp || [];

        const normalized = [
          ...bookingList.filter(b => !b.is_deleted).map(b => ({ 
            source: 'booking', 
            id: b.id, 
            label: `${b.full_name} (Booking Request #${b.id})`, 
            name: b.full_name, 
            email: b.email, 
            mobile: b.phone_number 
          })),
          ...enquireList.filter(e => !e.is_deleted).map(e => ({ 
            source: 'enquiry', 
            id: e.id, 
            label: `${e.full_name} (Enquiry #${e.id})`, 
            name: e.full_name, 
            email: e.email, 
            mobile: e.contact_number 
          })),
          ...leadList.map(l => ({ 
            source: 'lead', 
            id: l.id, 
            label: `${l.name} (Lead #${l.id})`, 
            name: l.name, 
            email: l.email, 
            mobile: l.mobile 
          }))
        ];
        setAvailableLeads(normalized);
        setAvailableTrips(tripsList.filter(t => !t.is_deleted));
      } catch (err) {
        console.error('loadData error', err);
        setFormError('Failed loading leads/trips');
      }
    };
    loadData();
  }, [apiKey]);

  useEffect(() => {
    const total = (formData.costing.items || []).reduce((s, it) => s + (Number(it.quantity || 0) * Number(it.unit_price || 0)), 0);
    setFormData(prev => ({ ...prev, costing: { ...prev.costing, total_amount: total }, amount: total }));
  }, [formData.costing.items]);

  // FIX 3: Validation logic before moving to the next step
  const handleNext = () => {
    if (activeStep === 0 && !formData.design) { 
      setFormError('Please choose a design template'); 
      return; 
    }
    if (activeStep === 1 && !formData.client_name) {
      setFormError('Please select a lead or enter client details');
      return;
    }
    if (activeStep === 2 && !formData.display_title) {
      setFormError('Please enter trip title');
      return;
    }
    setFormError(null);
    setActiveStep(s => s + 1);
  };

  const handleBack = () => { 
    setFormError(null); 
    setActiveStep(s => Math.max(0, s - 1)); 
  };

  const handleLeadSelect = (event, value) => {
    if (!value) return;
    setFormData(prev => ({
      ...prev,
      lead_id: value.id,
      lead_source: value.source,
      client_name: value.name || '',
      client_email: value.email || '',
      client_mobile: value.mobile || ''
    }));
  };

  const handleTripSelect = async (e) => {
    const tripId = e.target.value;
    if (!tripId) {
      setFormData(prev => ({ ...prev, trip_id: null, display_title: '', overview: '', hero_image: '', gallery_images: [], itinerary: [{ day: 1, title: 'Arrival Day', description: 'Arrive at destination and hotel check-in.' }] }));
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE_URL}/trips/${tripId}`, { headers: { 'x-api-key': apiKey } });
      const json = await res.json();
      const full = json?.data || json;
      
      setFormData(prev => ({ 
        ...prev, 
        trip_id: tripId, 
        display_title: full.title || '', 
        overview: full.overview || '',
        hero_image: full.hero_image || '',
        gallery_images: full.gallery_images || [],
        itinerary: full.itinerary?.map((it,i)=>({ 
          day: i+1, 
          title: it.title, 
          description: it.description 
        })) || prev.itinerary 
      }));
    } catch (err) {
      console.warn('trip fetch failed', err);
      const trip = availableTrips.find(t => t.id === parseInt(tripId)) || {};
      setFormData(prev => ({ 
        ...prev, 
        trip_id: tripId, 
        display_title: trip.title || '', 
        overview: trip.overview || '',
        hero_image: trip.hero_image || '',
        gallery_images: trip.gallery_images || []
      }));
    }
  };

  const handleInputChange = (e, section, field) => {
    const value = e?.target ? e.target.value : e;
    if (section) {
      setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleImageUpload = async (file, type = 'hero') => {
    if (!file) return;

    const okTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!okTypes.includes(file.type)) {
      setFormError('Only JPG, JPEG, PNG or WEBP allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('File size should not exceed 5MB');
      return;
    }

    const fd = new FormData();
    fd.append('image', file);
    fd.append('storage', 'local');

    if (type === 'hero') setUploadingHero(true);
    else if (type === 'qr') setUploadingQR(true);

    try {
      const res = await axios.post(UPLOAD_API, fd);
      if (res?.data?.message === 'Upload successful' && res?.data?.url) {
        if (type === 'hero') {
          setFormData(prev => ({ ...prev, hero_image: res.data.url }));
        } else if (type === 'qr') {
          // NOTE: This branch is no longer used for QR, but kept for hero image upload
          setFormData(prev => ({ ...prev, payment: { ...prev.payment, qr_code_url: res.data.url } }));
        }
      } else {
        setFormError('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setFormError('Failed to upload image');
    } finally {
      if (type === 'hero') setUploadingHero(false);
      else if (type === 'qr') setUploadingQR(false);
    }
  };

  const handleMultipleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    const okTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    for (const f of files) {
      if (!okTypes.includes(f.type)) {
        setFormError(`Unsupported file type: ${f.name}`);
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        setFormError(`File too large (>5MB): ${f.name}`);
        return;
      }
    }

    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('gallery_images', f));
    fd.append('storage', 'local');

    setUploadingGallery(true);
    try {
      const res = await axios.post(MULTIPLE_UPLOAD_API, fd);
      if (res?.data?.message === 'Files uploaded' && res?.data?.files) {
        const uploaded = Array.isArray(res.data.files) ? res.data.files.flat() : [res.data.files];
        setFormData(prev => ({
          ...prev,
          gallery_images: [...(prev.gallery_images || []), ...uploaded]
        }));
      } else {
        setFormError('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setFormError('Failed to upload images');
    } finally {
      setUploadingGallery(false);
    }
  };

  // FIX 3: QR Code upload via /multiple endpoint
  const handleQRUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const okTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!okTypes.includes(file.type)) {
      setFormError('Only JPG, JPEG, PNG or WEBP allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('File size should not exceed 5MB');
      return;
    }

    const fd = new FormData();
    // Using gallery_images as field name for /multiple endpoint, assuming it accepts singular uploads too
    fd.append('gallery_images', file); 
    fd.append('storage', 'local');

    setUploadingQR(true);
    try {
      const res = await axios.post(MULTIPLE_UPLOAD_API, fd);
      if (res?.data?.message === 'Files uploaded' && res?.data?.files) {
        // The /multiple endpoint returns an array of uploaded files, we take the first one
        const uploaded = Array.isArray(res.data.files) ? res.data.files[0] : res.data.files;
        setFormData(prev => ({
          ...prev,
          payment: { ...prev.payment, qr_code_url: uploaded }
        }));
      } else {
        setFormError('QR upload failed');
      }
    } catch (error) {
      console.error('QR upload error:', error);
      setFormError('Failed to upload QR code');
    } finally {
      setUploadingQR(false);
    }
  };

  const addItineraryDay = () => {
    const newDay = (formData.itinerary || []).length + 1;
    setFormData(prev => ({ 
      ...prev, 
      itinerary: [
        ...(prev.itinerary || []), 
        { day: newDay, title: `Day ${newDay}`, description: '' }
      ] 
    }));
  };

  const removeItineraryDay = (index) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index).map((it, idx) => ({ ...it, day: idx + 1 }))
    }));
  };

  const handleItineraryChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((it, i) => i === index ? { ...it, [field]: value } : it)
    }));
  };

  const addCostingItem = () => {
    setFormData(prev => ({
      ...prev,
      costing: { 
        ...prev.costing, 
        items: [...(prev.costing.items || []), { name: '', quantity: 1, unit_price: 0 }] 
      }
    }));
  };

  const removeCostingItem = (index) => {
    setFormData(prev => ({
      ...prev,
      costing: { ...prev.costing, items: prev.costing.items.filter((_, i) => i !== index) }
    }));
  };

  const handleCostingItemChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      costing: {
        ...prev.costing,
        items: prev.costing.items.map((it, i) => i === index ? { ...it, [field]: value } : it)
      }
    }));
  };
  
  // FIX 2: Function to update lead/enquiry/booking client details on the source table
  const handleClientUpdate = async () => {
    if (!quotation?.id || !formData.lead_id || !formData.lead_source) return;
    
    setSubmitting(true);
    setFormError(null);
    
    const sourceMap = {
      'booking': { endpoint: 'bookings', nameField: 'full_name', contactField: 'phone_number' },
      'enquiry': { endpoint: 'enquires', nameField: 'full_name', contactField: 'contact_number' },
      'lead': { endpoint: 'leads', nameField: 'name', contactField: 'mobile' },
    };
    
    const sourceInfo = sourceMap[formData.lead_source];
    if (!sourceInfo) return;

    const clientPayload = {
      [sourceInfo.nameField]: formData.client_name,
      'email': formData.client_email,
      [sourceInfo.contactField]: formData.client_mobile,
    };
    
    const endpoint = `${API_BASE_URL}/${sourceInfo.endpoint}/${formData.lead_id}`;

    try {
      const response = await fetch(endpoint, {
        method: 'PUT', // Use PUT to update the source record
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'accept': 'application/json'
        },
        body: JSON.stringify(clientPayload)
      });

      const result = await response.json();

      if (response.ok && result.success !== false) {
        console.log(`Successfully updated ${formData.lead_source} #${formData.lead_id}`);
        // No need to set success alert here, main save will do it
      } else {
        console.error(`Failed to update ${formData.lead_source}:`, result.message);
        setFormError(`Warning: Failed to update client details on ${formData.lead_source} source.`);
      }
    } catch (error) {
      console.error('Client update error:', error);
      setFormError('Warning: Network error while trying to update client source details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (sendNow = false, proceedToNext = false) => {
    setSubmitting(true);
    setFormError(null);
    setSaveSuccess(false);

    // If client details are modified AND linked to a source, attempt update
    if (quotation?.id && formData.lead_id && formData.lead_source) {
      await handleClientUpdate();
    }
    
    try {
      const payload = {
        // Core quotation fields
        lead_id: formData.lead_id || 0,
        design: formData.design,
        agent: formData.agent,
        company: formData.company,
        itinerary: formData.itinerary,
        policies: formData.policies,
        payment: formData.payment,
        status: sendNow ? 'Sent' : 'Draft',
        amount: formData.amount,
        date: formData.date,
        // The quotation object will save the current client details directly
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_mobile: formData.client_mobile,

        // Costing structure required by the API
        costing: {
          type: formData.costing.type,
          currency: formData.costing.currency,
          total_amount: formData.amount,
          items: formData.costing.items,
          // API fields not in form
          price_per_person: formData.costing.type === 'person' ? formData.amount : 0,
          price_per_package: formData.costing.type === 'package' ? formData.amount : 0,
          selected_slot: '',
          selected_package: ''
        },

        // Trip structure required by the API
        trip: {
          trip_id: formData.trip_id, // Pass trip_id if selected
          display_title: formData.display_title,
          overview: formData.overview,
          hero_image: formData.hero_image,
          gallery_images: formData.gallery_images,
          sections: []
        },
        // Also save the top-level image fields for simpler access if trip object isn't used
        hero_image: formData.hero_image,
        gallery_images: formData.gallery_images,
      };

      const method = quotation?.id ? 'PUT' : 'POST';
      const endpoint = quotation?.id ? `${QUOTATION_API}${quotation.id}` : QUOTATION_API;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success !== false) {
        if (sendNow) {
          setSendDialogOpen(true);
        } else {
          setSaveSuccess(true);
          if (proceedToNext) handleNext(); // Move to next step after save
        }
      } else {
        setFormError(result.message || 'Failed to save quotation');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setFormError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepHeader = (title, subtitle, Icon) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 4, 
      p: 2, 
      bgcolor: '#f5f5f5', 
      borderRadius: 1,
      borderLeft: '4px solid #1976d2'
    }}>
      <Icon sx={{ fontSize: 36, color: '#1976d2', mr: 2 }} />
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
      </Box>
    </Box>
  );

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ p: 2 }}>
            {renderStepHeader("Choose Your Design Template", "Select the visual theme for the client's quotation document.", CheckCircleIcon)}
            <Grid container spacing={3}>
              {[
                { name: 'Modern Professional', desc: 'Clean gradient design with modern aesthetics', color: '#667eea' },
                { name: 'Luxury Gold', desc: 'Premium gold-themed elegant template', color: '#D4AF37' },
                { name: 'Minimalist Classic', desc: 'Simple, professional black & white', color: '#000' }
              ].map(design => (
                <Grid item xs={12} md={4} key={design.name}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer', 
                      border: formData.design === design.name ? `3px solid ${design.color}` : '2px solid #e0e0e0',
                      boxShadow: formData.design === design.name ? 6 : 2,
                      transition: 'all 0.3s',
                      height: '100%',
                      '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' }
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, design: design.name }))}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 5, position: 'relative' }}>
                      {formData.design === design.name && (
                        <CheckCircleIcon 
                          sx={{ 
                            position: 'absolute', 
                            top: 16, 
                            right: 16, 
                            color: design.color,
                            fontSize: 32
                          }} 
                        />
                      )}
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          margin: '0 auto 16px',
                          bgcolor: design.color,
                          fontSize: 40
                        }}
                      >
                        📄
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>{design.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{design.desc}</Typography>
                      {formData.design === design.name && (
                        <Chip label="Selected" color="primary" sx={{ mt: 2 }} />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ p: 2 }}>
            {renderStepHeader("Customer & Company Information", "Define who the quotation is for and who it's from.", PersonIcon)}

            <Paper elevation={2} sx={{ p: 3, mb: 4, borderLeft: '3px solid #ff9800' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ff9800' }}>Select Existing Lead</Typography>
              <Autocomplete
                options={availableLeads}
                getOptionLabel={(option) => option.label || ''}
                value={availableLeads.find(l => l.id === formData.lead_id && l.source === formData.lead_source) || null}
                onChange={handleLeadSelect}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Search Lead/Booking/Enquiry" 
                    placeholder="Start typing to search..."
                    fullWidth
                  />
                )}
              />
            </Paper>

            <Paper elevation={2} sx={{ p: 3, mb: 4, borderLeft: '3px solid #2196f3' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#2196f3' }}>OR Enter Custom Client Details</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Client Name *" required value={formData.client_name} onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Client Email" type="email" value={formData.client_email} onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Client Mobile" value={formData.client_mobile} onChange={(e) => setFormData(prev => ({ ...prev, client_mobile: e.target.value }))} />
                </Grid>
                {/* Save button for this step */}
                <Grid item xs={12} sx={{ textAlign: 'right' }}>
                  <Button 
                    onClick={() => handleSubmit(false, false)} 
                    variant="contained" 
                    color="success"
                    disabled={submitting || !quotation?.id}
                  >
                    {submitting ? <CircularProgress size={20} color="inherit" /> : 'SAVE DRAFT'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            <Paper elevation={2} sx={{ p: 3, mb: 3, borderLeft: '3px solid #4caf50' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#4caf50' }}>Agent Details</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Agent Name" value={formData.agent.name} onChange={(e) => handleInputChange(e, 'agent', 'name')} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Agent Email" type="email" value={formData.agent.email} onChange={(e) => handleInputChange(e, 'agent', 'email')} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Agent Contact" value={formData.agent.contact} onChange={(e) => handleInputChange(e, 'agent', 'contact')} />
                </Grid>
              </Grid>
            </Paper>

            <Paper elevation={2} sx={{ p: 3, borderLeft: '3px solid #9c27b0' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#9c27b0' }}>Company Details (Sender)</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Company Name" value={formData.company.name} onChange={(e) => handleInputChange(e, 'company', 'name')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Company Email" type="email" value={formData.company.email} onChange={(e) => handleInputChange(e, 'company', 'email')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Company Mobile" value={formData.company.mobile} onChange={(e) => handleInputChange(e, 'company', 'mobile')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Website" value={formData.company.website} onChange={(e) => handleInputChange(e, 'company', 'website')} />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ p: 2 }}>
            {renderStepHeader("Trip Package Details & Media", "Outline the package content and upload supporting media.", FlightTakeoffIcon)}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Published Trip (optional)</InputLabel>
                    <Select 
                      value={formData.trip_id || ''} 
                      onChange={handleTripSelect} 
                      label="Select Published Trip (optional)"
                      sx={{ minHeight: '56px' }}
                    >
                      <MenuItem value=''>-- Custom Trip --</MenuItem>
                      {availableTrips.map(t => (
                        <MenuItem key={t.id} value={t.id}>{t.title}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="Display Title *" 
                    required
                    value={formData.display_title} 
                    onChange={(e) => setFormData(prev => ({ ...prev, display_title: e.target.value }))} 
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    label="Overview / Description" 
                    multiline 
                    rows={5} 
                    value={formData.overview} 
                    onChange={(e) => setFormData(prev => ({ ...prev, overview: e.target.value }))} 
                    placeholder="Describe the trip package in detail..."
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2, borderColor: '#ccc' }} />
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Trip Images</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center', minHeight: 320 }}>
                    <ImageIcon sx={{ fontSize: 48, color: '#999', mb: 1 }} />
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Hero Image (Banner)</Typography>
                    {formData.hero_image && (
                      <Box sx={{ mb: 2, position: 'relative' }}>
                        <img 
                          src={formData.hero_image} 
                          alt="Hero" 
                          style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }}
                        />
                        <IconButton
                          size="small"
                          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                          onClick={() => setFormData(prev => ({ ...prev, hero_image: '' }))}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="hero-upload"
                      type="file"
                      onChange={(e) => handleImageUpload(e.target.files[0], 'hero')}
                      disabled={uploadingHero}
                    />
                    <label htmlFor="hero-upload">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={uploadingHero ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                        disabled={uploadingHero}
                      >
                        {uploadingHero ? 'Uploading...' : 'Upload Hero Image'}
                      </Button>
                    </label>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center', minHeight: 320 }}>
                    <ImageIcon sx={{ fontSize: 48, color: '#999', mb: 1 }} />
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Gallery Images</Typography>
                    {formData.gallery_images && formData.gallery_images.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, justifyContent: 'center' }}>
                        {formData.gallery_images.map((img, idx) => (
                          <Box key={idx} sx={{ position: 'relative', width: 80, height: 80 }}>
                            <img 
                              src={img} 
                              alt={`Gallery ${idx}`} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
                            />
                            <IconButton
                              size="small"
                              sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                              onClick={() => setFormData(prev => ({ ...prev, gallery_images: prev.gallery_images.filter((_, i) => i !== idx) }))}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    )}
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="gallery-upload"
                      type="file"
                      multiple
                      onChange={(e) => handleMultipleImageUpload(e.target.files)}
                      disabled={uploadingGallery}
                    />
                    <label htmlFor="gallery-upload">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={uploadingGallery ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                        disabled={uploadingGallery}
                      >
                        {uploadingGallery ? 'Uploading...' : 'Upload Gallery Images'}
                      </Button>
                    </label>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }} color="text.secondary">
                      Select multiple images
                    </Typography>
                  </Box>
                </Grid>
                 {/* Save button for this step */}
                <Grid item xs={12} sx={{ textAlign: 'right' }}>
                  <Button 
                    onClick={() => handleSubmit(false, false)} 
                    variant="contained" 
                    color="success"
                    disabled={submitting || !quotation?.id}
                  >
                    {submitting ? <CircularProgress size={20} color="inherit" /> : 'SAVE DRAFT'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ p: 2 }}>
            {renderStepHeader("Day-wise Itinerary Builder", "Structure the trip activities for each day.", ListAltIcon)}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Button 
                onClick={() => handleSubmit(false, false)} 
                variant="contained" 
                color="success"
                disabled={submitting || !quotation?.id}
              >
                {submitting ? <CircularProgress size={20} color="inherit" /> : 'SAVE DRAFT'}
              </Button>
              <Button variant="contained" startIcon={<AddIcon />} onClick={addItineraryDay}>
                Add New Day
              </Button>
            </Box>
            {(formData.itinerary || []).map((it, idx) => (
              <Card key={idx} sx={{ mb: 3, bgcolor: '#fafafa', borderLeft: '4px solid #1976d2' }} elevation={4}>
                <CardContent>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <TextField 
                        fullWidth 
                        label={`Day ${it.day} Title`} 
                        value={it.title} 
                        onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)} 
                        sx={{ bgcolor: '#fff' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <TextField 
                        fullWidth 
                        label={`Day ${it.day} Description`} 
                        multiline 
                        rows={2} 
                        value={it.description} 
                        onChange={(e) => handleItineraryChange(idx, 'description', e.target.value)} 
                        sx={{ bgcolor: '#fff' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                      {(formData.itinerary || []).length > 1 && (
                        <IconButton color="error" onClick={() => removeItineraryDay(idx)} size="large">
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>
        );

      case 4:
        return (
          <Box sx={{ p: 2 }}>
            {renderStepHeader("Costing Details", "Define the items, prices, and calculate the total amount.", MonetizationOnIcon)}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Button 
                onClick={() => handleSubmit(false, false)} 
                variant="contained" 
                color="success"
                disabled={submitting || !quotation?.id}
              >
                {submitting ? <CircularProgress size={20} color="inherit" /> : 'SAVE DRAFT'}
              </Button>
              <Button variant="contained" startIcon={<AddIcon />} onClick={addCostingItem}>
                Add Cost Item
              </Button>
            </Box>

            <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: '#e3f2fd', borderLeft: '4px solid #1976d2' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}><Typography variant="subtitle1" fontWeight="bold">Item Name</Typography></Grid>
                <Grid item xs={2}><Typography variant="subtitle1" fontWeight="bold" align="center">Qty</Typography></Grid>
                <Grid item xs={3}><Typography variant="subtitle1" fontWeight="bold" align="right">Unit Price (₹)</Typography></Grid>
                <Grid item xs={2}><Typography variant="subtitle1" fontWeight="bold" align="right">Total</Typography></Grid>
                <Grid item xs={1}></Grid>
              </Grid>
            </Paper>

            {(formData.costing.items || []).map((it, idx) => (
              <Card key={idx} sx={{ mb: 2 }} elevation={1}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                      <TextField fullWidth size="small" label="Item Name" value={it.name} onChange={(e) => handleCostingItemChange(idx, 'name', e.target.value)} />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField fullWidth size="small" type="number" label="Qty" value={it.quantity} onChange={(e) => handleCostingItemChange(idx, 'quantity', e.target.value)} />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField fullWidth size="small" type="number" label="Price" value={it.unit_price} onChange={(e) => handleCostingItemChange(idx, 'unit_price', e.target.value)} />
                    </Grid>
                    <Grid item xs={2} sx={{ textAlign: 'right' }}>
                      <Typography variant="body1" fontWeight="bold" color="success.main">
                        ₹{(Number(it.quantity || 0) * Number(it.unit_price || 0)).toLocaleString('en-IN')}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: 'center' }}>
                      <IconButton color="error" onClick={() => removeCostingItem(idx)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            <Paper elevation={4} sx={{ mt: 4, p: 3, bgcolor: '#4caf50', color: '#fff', borderRadius: 2 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Typography variant="h5" fontWeight="bold">GRAND TOTAL:</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h4" fontWeight="bold">
                    ₹{Number(formData.costing.total_amount || 0).toLocaleString('en-IN')}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );

      case 5:
        return (
          <Box sx={{ p: 2 }}>
            {renderStepHeader("Terms & Policies", "Set the contractual agreements for the quotation.", GavelIcon)}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    multiline 
                    rows={5} 
                    label="Payment Terms" 
                    value={formData.policies.payment_terms} 
                    onChange={(e) => handleInputChange(e, 'policies', 'payment_terms')} 
                    placeholder="Enter payment terms and conditions..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    multiline 
                    rows={5} 
                    label="Cancellation Policy" 
                    value={formData.policies.cancellation_policy} 
                    onChange={(e) => handleInputChange(e, 'policies', 'cancellation_policy')} 
                    placeholder="Enter cancellation policy..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    multiline 
                    rows={5} 
                    label="Terms & Conditions" 
                    value={formData.policies.terms_and_conditions} 
                    onChange={(e) => handleInputChange(e, 'policies', 'terms_and_conditions')} 
                    placeholder="Enter general terms and conditions..."
                  />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'right' }}>
                  <Button 
                    onClick={() => handleSubmit(false, false)} 
                    variant="contained" 
                    color="success"
                    disabled={submitting || !quotation?.id}
                  >
                    {submitting ? <CircularProgress size={20} color="inherit" /> : 'SAVE DRAFT'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );

      case 6:
        return (
          <Box sx={{ p: 2 }}>
            {renderStepHeader("Payment Details", "Provide bank and UPI information for payment collection.", CreditCardIcon)}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Bank Name" value={formData.payment.bank_name} onChange={(e) => handleInputChange(e, 'payment', 'bank_name')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Account Number" value={formData.payment.account_number} onChange={(e) => handleInputChange(e, 'payment', 'account_number')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="IFSC Code" value={formData.payment.ifsc_code} onChange={(e) => handleInputChange(e, 'payment', 'ifsc_code')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Branch Name" value={formData.payment.branch_name} onChange={(e) => handleInputChange(e, 'payment', 'branch_name')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="GST Number" value={formData.payment.gst_number} onChange={(e) => handleInputChange(e, 'payment', 'gst_number')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="UPI ID (Primary)" value={(formData.payment.upi_ids || [])[0] || ''} onChange={(e) => {
                      const newUpi = e.target.value ? [e.target.value] : [];
                      setFormData(prev => ({ 
                        ...prev, 
                        payment: { ...prev.payment, upi_ids: newUpi } 
                      }));
                    }} 
                    placeholder="yourname@upi"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ p: 3, border: '2px dashed #1976d2', borderRadius: 2, textAlign: 'center', bgcolor: '#f5f5ff' }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Upload QR Code (for UPI payments)</Typography>
                    
                    {formData.payment.qr_code_url ? (
                      <Box>
                        <img 
                          src={formData.payment.qr_code_url} 
                          alt="QR Code" 
                          style={{ maxWidth: '200px', maxHeight: '200px', marginBottom: '16px', border: '2px solid #1976d2', borderRadius: 8 }}
                        />
                        <Box>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              payment: { ...prev.payment, qr_code_url: '' }
                            }))}
                          >
                            Remove QR Code
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="qr-upload-button"
                          type="file"
                          onChange={handleQRUpload}
                          disabled={uploadingQR}
                        />
                        <label htmlFor="qr-upload-button">
                          <Button
                            variant="contained"
                            component="span"
                            startIcon={uploadingQR ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                            disabled={uploadingQR}
                            size="large"
                          >
                            {uploadingQR ? 'Uploading QR...' : 'Upload QR Code'}
                          </Button>
                        </label>
                        <Typography variant="caption" display="block" sx={{ mt: 1 }} color="text.secondary">
                          Supported formats: JPG, PNG, WEBP (Max 5MB)
                        </Typography>
                        <Chip 
                          label="Uses /multiple endpoint for upload" 
                          size="small" 
                          color="info" 
                          sx={{ mt: 1 }} 
                        />
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );

      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Box>
      {formError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFormError(null)}>
          {formError}
        </Alert>
      )}
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSaveSuccess(false)}>
          Quotation draft saved successfully!
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        {renderStep()}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 3, borderTop: '2px solid #e0e0e0' }}>
        <Button 
          onClick={handleBack} 
          disabled={activeStep === 0} 
          variant="outlined"
          size="large"
        >
          BACK
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={() => handleClose(false)} variant="outlined" size="large">
            CANCEL
          </Button>

          {formData.design && (
            <Button 
              variant="outlined" 
              startIcon={<VisibilityIcon />} 
              onClick={() => setPreviewOpen(true)}
              size="large"
            >
              PREVIEW
            </Button>
          )}
          
          {/* Global Save Draft Button (New: Color and conditional logic) */}
          {activeStep !== STEPS - 1 && quotation?.id && (
            <Button 
              onClick={() => handleSubmit(false, false)} 
              variant="contained" 
              color="success"
              disabled={submitting}
              size="large"
              sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
            >
              {submitting ? <CircularProgress size={20} color="inherit" /> : 'SAVE DRAFT'}
            </Button>
          )}


          {activeStep !== STEPS - 1 ? (
            <Button 
              variant="contained" 
              onClick={() => {
                  if (quotation?.id) {
                    // If editing, save first then move next
                    handleSubmit(false, true); 
                  } else {
                    // If creating, just move next (save happens on the last step)
                    handleNext();
                  }
              }}
              size="large"
              disabled={submitting && !quotation?.id} // Only disable if creating and submitting
            >
              NEXT
            </Button>
          ) : (
            <>
              {/* Save Draft on Last Step */}
              <Button 
                onClick={() => handleSubmit(false, false)} 
                variant="outlined" 
                disabled={submitting}
                size="large"
              >
                {submitting ? <CircularProgress size={20} /> : 'SAVE DRAFT'}
              </Button>
              <Button 
                onClick={() => handleSubmit(true, false)} 
                variant="contained" 
                color="primary" 
                disabled={submitting}
                size="large"
              >
                {submitting ? <CircularProgress size={20} /> : 'SAVE & SEND'}
              </Button>
            </>
          )}
        </Box>
      </Box>

      <QuotationViewDialog 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
        quotation={{ ...formData, id: quotation?.id }} 
        onEdit={() => setPreviewOpen(false)} 
      />

      <Dialog open={sendDialogOpen} onClose={() => { setSendDialogOpen(false); handleClose(true); }}>
        <DialogTitle>✅ Quotation {quotation?.id ? 'Updated' : 'Created'} Successfully!</DialogTitle>
        <DialogContent>
          <Typography>
            The quotation has been saved and marked as "Sent". You can now share it via email or WhatsApp.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setSendDialogOpen(false); handleClose(true); }} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuotationFormSteps;