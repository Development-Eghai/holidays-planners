// fileName: AddLeadDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const AddLeadDialog = ({ open, onClose }) => {
  const [tripThemes, setTripThemes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    destinationType: '',
    pickup: '',
    drop: '',
    travelFrom: null,
    travelTo: null,
    adults: 1,
    children: 0
  });

  // Fetch trip themes
  useEffect(() => {
    const fetchTripThemes = async () => {
      try {
        // Fallback data
        const fallbackThemes = [
          { id: 1, name: 'Domestic' },
          { id: 2, name: 'International' },
          { id: 3, name: 'Adventure' },
          { id: 4, name: 'Beach' },
          { id: 5, name: 'Hill Station' },
          { id: 6, name: 'Religious' },
          { id: 7, name: 'Wildlife' },
        ];
        
        setTripThemes(fallbackThemes);
      } catch (error) {
        console.error('Error fetching trip themes:', error);
        setTripThemes([
          { id: 1, name: 'Domestic' },
          { id: 2, name: 'International' },
        ]);
      }
    };
    
    if (open) {
      fetchTripThemes();
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        destination_type: parseInt(formData.destinationType) || 0,
        pickup: formData.pickup,
        drop: formData.drop,
        travel_from: formData.travelFrom ? new Date(formData.travelFrom).toISOString() : null,
        travel_to: formData.travelTo ? new Date(formData.travelTo).toISOString() : null,
        adults: formData.adults.toString(),
        children: formData.children.toString(),
      };

      const response = await fetch('https://api.yaadigo.com/secure/api/leads/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // --- API KEY UPDATE ---
          'x-api-key': 'x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('✅ Lead created successfully');
        // Reset form
        setFormData({
          name: '',
          email: '',
          mobile: '',
          destinationType: '',
          pickup: '',
          drop: '',
          travelFrom: null,
          travelTo: null,
          adults: 1,
          children: 0
        });
        onClose(true); // Tell parent to refresh list
      } else {
        console.error('❌ Error creating lead:', await response.text());
        alert('Failed to create lead. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleClose = () => {
    // Reset form on close
    setFormData({
      name: '',
      email: '',
      mobile: '',
      destinationType: '',
      pickup: '',
      drop: '',
      travelFrom: null,
      travelTo: null,
      adults: 1,
      children: 0
    });
    onClose(false);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: 2
        }
      }}
    >
      <DialogTitle>Add New Lead</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Client Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Destination Type</InputLabel>
              <Select
                name="destinationType"
                value={formData.destinationType}
                onChange={handleInputChange}
                label="Destination Type"
              >
                {tripThemes.map((theme) => (
                  <MenuItem key={theme.id} value={theme.id}>
                    {theme.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Pickup Location"
              name="pickup"
              value={formData.pickup}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Drop Location"
              name="drop"
              value={formData.drop}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Travel From"
                value={formData.travelFrom}
                onChange={(value) => handleDateChange('travelFrom', value)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Travel To"
                value={formData.travelTo}
                onChange={(value) => handleDateChange('travelTo', value)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Number of Adults"
              name="adults"
              type="number"
              value={formData.adults}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Number of Children"
              name="children"
              type="number"
              value={formData.children}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={!formData.name || !formData.email || !formData.mobile}
        >
          Add Lead
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLeadDialog;