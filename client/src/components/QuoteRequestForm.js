import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
  Paper
} from '@mui/material';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import FileUpload from './FileUpload';

const serviceTypes = [
  'CNC Machining',
  'Precision Grinding',
  'Wire EDM',
  'Surface Grinding',
  'Cylindrical Grinding',
  'Tool & Cutter Grinding',
  'Prototyping',
  'Production Run',
  'Other'
];

const materialOptions = [
  'Tool Steel',
  'High Speed Steel',
  'Carbide',
  'Stainless Steel',
  'Aluminum',
  'Brass',
  'Bronze',
  'Plastic',
  'Other'
];

const surfaceFinishOptions = [
  'Ra 0.1-0.2 (Mirror)',
  'Ra 0.2-0.4 (Fine)',
  'Ra 0.4-0.8 (Medium)',
  'Ra 0.8-1.6 (Standard)',
  'Ra >1.6 (Rough)',
  'As Required'
];

const QuoteRequestForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    material: '',
    quantity: '',
    dimensions: '',
    surfaceFinish: '',
    tolerances: '',
    projectDetails: '',
    sampleRequired: false,
    prototypeRequired: false,
    specialRequirements: '',
    timeline: '',
    deliveryLocation: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!isSupabaseConfigured()) {
        console.log('Form submission (Development Mode):', formData);
        setSuccess(true);
        return;
      }

      const { error: uploadError } = await supabase
        .from('quote_requests')
        .insert([
          {
            ...formData,
            attachment_urls: files.map(f => f.url)
          }
        ]);

      if (uploadError) throw uploadError;
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        serviceType: '',
        material: '',
        quantity: '',
        dimensions: '',
        surfaceFinish: '',
        tolerances: '',
        projectDetails: '',
        sampleRequired: false,
        prototypeRequired: false,
        specialRequirements: '',
        timeline: '',
        deliveryLocation: '',
      });
      setFiles([]);
    } catch (err) {
      setError(err.message || 'An error occurred while submitting the form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Contact Information */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Contact Information
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Project Details */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Project Details
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Service Type</InputLabel>
              <Select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                label="Service Type"
              >
                {serviceTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Material</InputLabel>
              <Select
                name="material"
                value={formData.material}
                onChange={handleChange}
                label="Material"
              >
                {materialOptions.map(material => (
                  <MenuItem key={material} value={material}>{material}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Dimensions"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
              placeholder="e.g., 10mm x 20mm x 30mm"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Surface Finish</InputLabel>
              <Select
                name="surfaceFinish"
                value={formData.surfaceFinish}
                onChange={handleChange}
                label="Surface Finish"
              >
                {surfaceFinishOptions.map(finish => (
                  <MenuItem key={finish} value={finish}>{finish}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tolerances"
              name="tolerances"
              value={formData.tolerances}
              onChange={handleChange}
              placeholder="e.g., ±0.01mm"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Project Details"
              name="projectDetails"
              value={formData.projectDetails}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Additional Requirements */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Additional Requirements
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.sampleRequired}
                  onChange={handleChange}
                  name="sampleRequired"
                />
              }
              label="Sample Required"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.prototypeRequired}
                  onChange={handleChange}
                  name="prototypeRequired"
                />
              }
              label="Prototype Required"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Special Requirements"
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Timeline & Delivery */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Timeline & Delivery
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              placeholder="e.g., 2 weeks"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Delivery Location"
              name="deliveryLocation"
              value={formData.deliveryLocation}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* File Upload */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          File Attachments
        </Typography>
        <FileUpload files={files} setFiles={setFiles} />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Quote request submitted successfully! We'll get back to you soon.
          </Alert>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              minWidth: 200,
              py: 1.5,
              fontSize: '1.1rem',
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Request'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default QuoteRequestForm;
