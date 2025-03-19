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
  Select
} from '@mui/material';
import { motion } from 'framer-motion';

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:9999/.netlify/functions/quote'
  : '/.netlify/functions/quote';

const serviceTypes = [
  'CNC Machining',
  'Precision Grinding',
  'Wire EDM',
  'Prototyping',
  'Production Run',
  'Other'
];

const budgetRanges = [
  'Under $1,000',
  '$1,000 - $5,000',
  '$5,000 - $10,000',
  '$10,000 - $50,000',
  'Over $50,000',
  'Not Sure'
];

const QuoteRequestForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    projectDetails: '',
    timeline: '',
    budgetRange: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const errors = [];
    if (!formData.name) errors.push('Name is required');
    if (!formData.email) errors.push('Email is required');
    if (!formData.serviceType) errors.push('Service type is required');

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
      console.log('Submitting quote request to:', API_URL);
      console.log('Form data:', formData);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const responseData = await response.json().catch(() => ({
        error: 'Failed to parse response',
        details: 'Invalid JSON response from server'
      }));

      console.log('Server response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.details || responseData.error || `HTTP error! status: ${response.status}`);
      }

      setStatus({
        submitting: false,
        submitted: true,
        error: null,
        message: responseData.message || 'Quote request sent successfully'
      });

      // Clear form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        serviceType: '',
        projectDetails: '',
        timeline: '',
        budgetRange: ''
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus({
        submitting: false,
        submitted: false,
        error: error.message || 'Failed to send quote request. Please try again.'
      });
    }
  };

  return (
    <Box
      component={motion.form}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        maxWidth: 600,
        mx: 'auto',
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      {status.error && (
        <Fade in>
          <Alert severity="error" sx={{ mb: 2 }}>
            {status.error}
          </Alert>
        </Fade>
      )}

      {status.submitted && status.message && (
        <Fade in>
          <Alert severity="success" sx={{ mb: 2 }}>
            {status.message}
          </Alert>
        </Fade>
      )}

      <TextField
        required
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        disabled={status.submitting}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#06B6D4'
            }
          }
        }}
      />

      <TextField
        required
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        disabled={status.submitting}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#06B6D4'
            }
          }
        }}
      />

      <TextField
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        disabled={status.submitting}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#06B6D4'
            }
          }
        }}
      />

      <TextField
        label="Company"
        name="company"
        value={formData.company}
        onChange={handleChange}
        disabled={status.submitting}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#06B6D4'
            }
          }
        }}
      />

      <FormControl required>
        <InputLabel>Service Type</InputLabel>
        <Select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          disabled={status.submitting}
          label="Service Type"
          sx={{
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#06B6D4'
            }
          }}
        >
          {serviceTypes.map(type => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Project Details"
        name="projectDetails"
        multiline
        rows={4}
        value={formData.projectDetails}
        onChange={handleChange}
        disabled={status.submitting}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#06B6D4'
            }
          }
        }}
      />

      <TextField
        label="Timeline"
        name="timeline"
        value={formData.timeline}
        onChange={handleChange}
        disabled={status.submitting}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#06B6D4'
            }
          }
        }}
      />

      <FormControl>
        <InputLabel>Budget Range</InputLabel>
        <Select
          name="budgetRange"
          value={formData.budgetRange}
          onChange={handleChange}
          disabled={status.submitting}
          label="Budget Range"
          sx={{
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#06B6D4'
            }
          }}
        >
          {budgetRanges.map(range => (
            <MenuItem key={range} value={range}>
              {range}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        disabled={status.submitting}
        sx={{
          bgcolor: '#06B6D4',
          '&:hover': {
            bgcolor: '#0891B2'
          }
        }}
      >
        {status.submitting ? (
          <CircularProgress size={24} sx={{ color: 'white' }} />
        ) : (
          'Request Quote'
        )}
      </Button>
    </Box>
  );
};

export default QuoteRequestForm;
