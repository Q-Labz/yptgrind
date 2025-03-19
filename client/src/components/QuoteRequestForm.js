import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  MenuItem,
  Fade
} from '@mui/material';
import { motion } from 'framer-motion';

// Use environment variable for API URL with fallback
const API_URL = '/api/quote';

const serviceTypes = [
  'CNC Machining',
  'Precision Grinding',
  'Wire EDM',
  'Prototyping',
  'Production Run',
  'Other'
];

const timelineOptions = [
  'Urgent (1-2 weeks)',
  'Standard (2-4 weeks)',
  'Flexible (4+ weeks)',
  'Not sure yet'
];

const budgetRanges = [
  'Under $1,000',
  '$1,000 - $5,000',
  '$5,000 - $10,000',
  '$10,000+',
  'Not sure yet'
];

const QuoteRequestForm = ({ onClose, initialService }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: initialService || '',
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
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setStatus({
        submitting: false,
        submitted: true,
        error: null,
        message: data.message || 'Quote request submitted successfully'
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

      // Close modal after 2 seconds on success
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus({
        submitting: false,
        submitted: false,
        error: error.message || 'Failed to submit quote request. Please try again.'
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

      <TextField
        required
        select
        label="Service Type"
        name="serviceType"
        value={formData.serviceType}
        onChange={handleChange}
        disabled={status.submitting}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#06B6D4'
            }
          }
        }}
      >
        {serviceTypes.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

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
        select
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
      >
        {timelineOptions.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Budget Range"
        name="budgetRange"
        value={formData.budgetRange}
        onChange={handleChange}
        disabled={status.submitting}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#06B6D4'
            }
          }
        }}
      >
        {budgetRanges.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <Button
        type="submit"
        variant="contained"
        disabled={status.submitting}
        sx={{
          mt: 2,
          py: 1.5,
          bgcolor: '#06B6D4',
          '&:hover': {
            bgcolor: '#0891B2'
          },
          '&:disabled': {
            bgcolor: 'rgba(6, 182, 212, 0.5)'
          }
        }}
      >
        {status.submitting ? (
          <CircularProgress
            size={24}
            sx={{
              color: '#fff'
            }}
          />
        ) : (
          'Submit Quote Request'
        )}
      </Button>
    </Box>
  );
};

export default QuoteRequestForm;
