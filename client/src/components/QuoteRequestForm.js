import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Fade,
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
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
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
  'Ra 0.8-1.6 (Semi-rough)',
  'Ra >1.6 (Rough)',
  'Not specified'
];

const toleranceOptions = [
  '± 0.0001"',
  '± 0.0005"',
  '± 0.001"',
  '± 0.005"',
  '± 0.010"',
  'Standard tolerance',
  'Not specified'
];

const certificationOptions = [
  'ISO 9001',
  'AS9100',
  'ITAR',
  'Material Certification',
  'First Article Inspection',
  'PPAP',
  'Custom Requirements'
];

const QuoteRequestForm = () => {
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    email: '',
    phone: '',
    company: '',
    
    // Project Details
    service_type: '',
    project_details: '',
    material: '',
    quantity: '',
    dimensions: '',
    surface_finish: '',
    tolerances: '',
    special_requirements: '',
    certification_requirements: [],
    
    // Business Details
    previous_supplier: '',
    target_price_range: '',
    timeline: '',
    delivery_location: '',
    preferred_shipping_method: '',
    
    // Quality Requirements
    quality_requirements: '',
    inspection_requirements: '',
    
    // Additional Options
    sample_required: false,
    prototype_required: false,
    
    // File Attachments
    attachment_urls: []
  });

  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null,
    message: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleCertificationChange = (e) => {
    setFormData(prev => ({
      ...prev,
      certification_requirements: e.target.value
    }));
  };

  const handleFileUpload = (urls) => {
    setFormData(prev => ({
      ...prev,
      attachment_urls: urls
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.name) errors.push('Name is required');
    if (!formData.email) errors.push('Email is required');
    if (!formData.service_type) errors.push('Service type is required');
    if (!formData.project_details) errors.push('Project details are required');
    if (!formData.material) errors.push('Material is required');
    if (!formData.quantity) errors.push('Quantity is required');
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setStatus({
        submitting: false,
        submitted: false,
        error: errors.join(', ')
      });
      return;
    }

    setStatus({ submitting: true, submitted: false, error: null });

    try {
      const { error } = await supabase
        .from('quote_requests')
        .insert([{
          ...formData,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setStatus({
        submitting: false,
        submitted: true,
        error: null,
        message: 'Quote request submitted successfully!'
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service_type: '',
        project_details: '',
        material: '',
        quantity: '',
        dimensions: '',
        surface_finish: '',
        tolerances: '',
        special_requirements: '',
        certification_requirements: [],
        previous_supplier: '',
        target_price_range: '',
        timeline: '',
        delivery_location: '',
        preferred_shipping_method: '',
        quality_requirements: '',
        inspection_requirements: '',
        sample_required: false,
        prototype_required: false,
        attachment_urls: []
      });
    } catch (error) {
      console.error('Error submitting quote request:', error);
      setStatus({
        submitting: false,
        submitted: true,
        error: error.message || 'Failed to submit quote request'
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>
        
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

        {/* Project Details */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Project Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Service Type</InputLabel>
            <Select
              name="service_type"
              value={formData.service_type}
              onChange={handleChange}
              label="Service Type"
            >
              {serviceTypes.map((type) => (
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
              {materialOptions.map((material) => (
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
            type="number"
            value={formData.quantity}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Dimensions"
            name="dimensions"
            placeholder='2" x 3" x 0.5"'
            value={formData.dimensions}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Surface Finish</InputLabel>
            <Select
              name="surface_finish"
              value={formData.surface_finish}
              onChange={handleChange}
              label="Surface Finish"
            >
              {surfaceFinishOptions.map((finish) => (
                <MenuItem key={finish} value={finish}>{finish}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Tolerances</InputLabel>
            <Select
              name="tolerances"
              value={formData.tolerances}
              onChange={handleChange}
              label="Tolerances"
            >
              {toleranceOptions.map((tolerance) => (
                <MenuItem key={tolerance} value={tolerance}>{tolerance}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Project Details"
            name="project_details"
            required
            value={formData.project_details}
            onChange={handleChange}
            placeholder="Please provide detailed information about your project requirements"
          />
        </Grid>

        {/* Quality and Certification */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Quality & Certification Requirements
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Certification Requirements</InputLabel>
            <Select
              multiple
              name="certification_requirements"
              value={formData.certification_requirements}
              onChange={handleCertificationChange}
              label="Certification Requirements"
              renderValue={(selected) => selected.join(', ')}
            >
              {certificationOptions.map((cert) => (
                <MenuItem key={cert} value={cert}>
                  <Checkbox checked={formData.certification_requirements.indexOf(cert) > -1} />
                  {cert}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Quality Requirements"
            name="quality_requirements"
            value={formData.quality_requirements}
            onChange={handleChange}
            placeholder="Specify any specific quality requirements"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Inspection Requirements"
            name="inspection_requirements"
            value={formData.inspection_requirements}
            onChange={handleChange}
            placeholder="Specify any inspection requirements or criteria"
          />
        </Grid>

        {/* Additional Options */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Additional Requirements
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.sample_required}
                onChange={handleCheckboxChange}
                name="sample_required"
              />
            }
            label="Sample Required"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.prototype_required}
                onChange={handleCheckboxChange}
                name="prototype_required"
              />
            }
            label="Prototype Required"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Special Requirements"
            name="special_requirements"
            multiline
            rows={2}
            value={formData.special_requirements}
            onChange={handleChange}
            placeholder="Any special requirements or notes"
          />
        </Grid>

        {/* Timeline and Delivery */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Timeline & Delivery
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            placeholder="When do you need this by?"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Delivery Location"
            name="delivery_location"
            value={formData.delivery_location}
            onChange={handleChange}
          />
        </Grid>

        {/* File Upload */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Attachments
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              Upload any relevant files (drawings, specifications, etc.)
            </Typography>
            <FileUpload
              onUploadComplete={handleFileUpload}
              maxFiles={5}
              acceptedTypes=".pdf,.dwg,.dxf,.step,.stp,.iges,.igs,.x_t,.x_b,.png,.jpg,.jpeg"
            />
          </Paper>
        </Grid>

        {/* Form Status and Submit */}
        <Grid item xs={12}>
          {status.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {status.error}
            </Alert>
          )}
          {status.submitted && status.message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {status.message}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={status.submitting}
            sx={{ mt: 2 }}
          >
            {status.submitting ? (
              <CircularProgress size={24} />
            ) : (
              'Submit Quote Request'
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuoteRequestForm;
