import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  MenuItem,
  Typography,
  Fade
} from '@mui/material';
import { motion } from 'framer-motion';

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

  const timelineOptions = [
    'Immediate',
    'Within 1 week',
    'Within 1 month',
    'Within 3 months',
    'Flexible'
  ];

  const budgetRangeOptions = [
    'Under $1,000',
    '$1,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $50,000',
    'Over $50,000',
    'To be discussed'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (status.error) {
      setStatus(prev => ({ ...prev, error: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
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
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to submit quote request');
      }

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
      console.error('Form submission error:', error);
      setStatus({
        submitting: false,
        submitted: false,
        error: error.message
      });
    }
  };

  const formFields = [
    { name: 'name', label: 'Name', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone' },
    { name: 'company', label: 'Company' },
    { 
      name: 'serviceType', 
      label: 'Service Type', 
      required: true,
      select: true,
      options: [
        'Tool Grinding',
        'Cutter Sharpening',
        'Custom Tool Manufacturing',
        'Tool Coating',
        'Other'
      ]
    },
    { 
      name: 'projectDetails', 
      label: 'Project Details', 
      multiline: true, 
      rows: 4,
      required: true
    },
    { 
      name: 'timeline', 
      label: 'Timeline',
      select: true,
      options: timelineOptions
    },
    { 
      name: 'budgetRange', 
      label: 'Budget Range',
      select: true,
      options: budgetRangeOptions
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          width: '100%',
          maxWidth: 600,
          mx: 'auto',
          p: 4,
          borderRadius: 2,
          border: '1px solid',
          borderColor: status.error ? 'error.main' : 'divider',
          bgcolor: '#0F172A',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.05) 1px, transparent 1px)',
            backgroundSize: '4px 4px',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::before': {
            opacity: 1,
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            background: 'linear-gradient(to right, #06B6D4, #0EA5E9)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center'
          }}
        >
          Request a Quote
        </Typography>

        {/* Form Status Messages */}
        {status.error && (
          <Fade in={!!status.error}>
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2, 
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                '& .MuiAlert-icon': {
                  color: '#ef4444'
                }
              }}
            >
              {status.error}
            </Alert>
          </Fade>
        )}
        
        {status.submitted && (
          <Fade in={status.submitted}>
            <Alert 
              severity="success"
              sx={{ 
                mt: 2,
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                color: '#06b6d4',
                '& .MuiAlert-icon': {
                  color: '#06b6d4'
                }
              }}
            >
              {status.message}
            </Alert>
          </Fade>
        )}

        {formFields.map((field) => (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label}
            value={formData[field.name]}
            onChange={handleChange}
            required={field.required}
            type={field.type || 'text'}
            multiline={field.multiline}
            rows={field.rows}
            select={field.select}
            disabled={status.submitting}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(6, 182, 212, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(6, 182, 212, 0.4)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#06B6D4',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#06B6D4',
                },
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
            }}
          >
            {field.select && field.options.map((option) => (
              <MenuItem 
                key={option} 
                value={option}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'rgba(6, 182, 212, 0.1) !important',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(6, 182, 212, 0.05)',
                  }
                }}
              >
                {option}
              </MenuItem>
            ))}
          </TextField>
        ))}

        {/* Submit Button */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={status.submitting}
            sx={{
              backgroundColor: '#06b6d4',
              '&:hover': {
                backgroundColor: '#0891b2'
              },
              '&:disabled': {
                backgroundColor: 'rgba(6, 182, 212, 0.5)'
              }
            }}
          >
            {status.submitting ? (
              <CircularProgress 
                size={24} 
                sx={{ 
                  color: 'white',
                  opacity: 0.8
                }} 
              />
            ) : (
              'Submit Quote Request'
            )}
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
};

export default QuoteRequestForm;
