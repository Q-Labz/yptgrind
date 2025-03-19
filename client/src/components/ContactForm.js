import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Fade
} from '@mui/material';
import { motion } from 'framer-motion';

const API_URL = process.env.REACT_APP_API_URL || '/.netlify/functions';

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
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    if (status.error) {
      setStatus(prev => ({ ...prev, error: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const errors = [];
    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.message.trim()) errors.push('Message is required');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() && !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

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
      console.log('Submitting contact form to:', `${API_URL}/contact`);
      console.log('Form data:', formData);
      
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Failed to parse server response. Please try again.');
      }

      console.log('Server response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.details || responseData.error || `Request failed with status ${response.status}`);
      }

      setStatus({
        submitting: false,
        submitted: true,
        error: null,
        message: responseData.message || 'Message sent successfully'
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
      console.error('Error submitting form:', error);
      setStatus({
        submitting: false,
        submitted: false,
        error: error.message || 'Failed to send message. Please try again.'
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
        error={status.error?.includes('Name')}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          },
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
        error={status.error?.includes('email')}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          },
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
              borderColor: 'primary.main',
            },
          },
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
              borderColor: 'primary.main',
            },
          },
        }}
      />

      <TextField
        required
        label="Message"
        name="message"
        multiline
        rows={4}
        value={formData.message}
        onChange={handleChange}
        disabled={status.submitting}
        error={status.error?.includes('Message')}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={status.submitting}
        sx={{
          mt: 2,
          position: 'relative',
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        {status.submitting ? (
          <>
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </Button>
    </Box>
  );
};

export default ContactForm;
