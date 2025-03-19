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

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8888/.netlify/functions/contact'
  : '/.netlify/functions/contact';

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
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
        label="Message"
        name="message"
        multiline
        rows={4}
        value={formData.message}
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
          'Send Message'
        )}
      </Button>
    </Box>
  );
};

export default ContactForm;
