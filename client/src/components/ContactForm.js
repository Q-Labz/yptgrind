import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Fade
} from '@mui/material';
import { motion } from 'framer-motion';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null,
    message: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = [];
    if (!formData.name) errors.push('Name is required');
    if (!formData.email) errors.push('Email is required');
    if (!formData.message) errors.push('Message is required');

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
      const response = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to send message');
      }

      setStatus({
        submitting: false,
        submitted: true,
        error: null,
        message: data.message || 'Message sent successfully'
      });

      // Clear form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      });

    } catch (error) {
      console.error('Form submission error:', error);
      setStatus({
        submitting: false,
        submitted: false,
        error: error.message
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 600,
          mx: 'auto',
          p: 3,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: 3,
            color: '#fff',
            textAlign: 'center',
            fontWeight: 600
          }}
        >
          Contact Us
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

        {/* Form Fields */}
        <TextField
          required
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: '#06b6d4',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#06b6d4',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: '#06b6d4',
              },
            },
          }}
        />

        <TextField
          required
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: '#06b6d4',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#06b6d4',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: '#06b6d4',
              },
            },
          }}
        />

        <TextField
          name="phone"
          label="Phone (optional)"
          value={formData.phone}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: '#06b6d4',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#06b6d4',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: '#06b6d4',
              },
            },
          }}
        />

        <TextField
          name="company"
          label="Company (optional)"
          value={formData.company}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: '#06b6d4',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#06b6d4',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: '#06b6d4',
              },
            },
          }}
        />

        <TextField
          required
          name="message"
          label="Message"
          multiline
          rows={4}
          value={formData.message}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: '#06b6d4',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#06b6d4',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: '#06b6d4',
              },
            },
          }}
        />

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
              'Send Message'
            )}
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
};

export default ContactForm;
