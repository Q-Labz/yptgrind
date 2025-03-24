import React, { useState } from 'react';
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  Fade,
  useTheme,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';

const ContactForm = () => {
  const theme = useTheme();
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
    success: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    if (status.error) {
      setStatus(prev => ({ ...prev, error: null }));
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.message.trim()) errors.push('Message is required');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() && !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setStatus({
        submitting: false,
        submitted: true,
        error: errors.join(', '),
        success: false
      });
      return;
    }

    setStatus({
      submitting: true,
      submitted: false,
      error: null,
      success: false
    });

    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/contact`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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
        success: true
      });

      // Clear form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      });
    } catch (error) {
      setStatus({
        submitting: false,
        submitted: true,
        error: error.message,
        success: false
      });
    }
  };

  const inputProps = {
    sx: {
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
        },
        '&:hover fieldset': {
          borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
          borderColor: theme.palette.primary.main,
        },
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
      },
      '& .MuiInputLabel-root': {
        color: theme.palette.text.secondary,
      },
      '& .MuiOutlinedInput-input': {
        color: theme.palette.text.primary,
      },
      mb: 2
    }
  };

  return (
    <Paper
      component={motion.form}
      elevation={3}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      sx={{
        p: 4,
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
        borderRadius: 2
      }}
    >
      {status.submitted && (
        <Fade in>
          <Alert 
            severity={status.error ? 'error' : 'success'}
            sx={{ mb: 3 }}
          >
            {status.error || 'Thank you for your message. We will get back to you soon!'}
          </Alert>
        </Fade>
      )}

      <TextField
        required
        fullWidth
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        disabled={status.submitting}
        error={status.error?.includes('Name')}
        {...inputProps}
      />

      <TextField
        required
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        disabled={status.submitting}
        error={status.error?.includes('email')}
        {...inputProps}
      />

      <TextField
        fullWidth
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        disabled={status.submitting}
        {...inputProps}
      />

      <TextField
        fullWidth
        label="Company"
        name="company"
        value={formData.company}
        onChange={handleChange}
        disabled={status.submitting}
        {...inputProps}
      />

      <TextField
        required
        fullWidth
        multiline
        rows={4}
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        disabled={status.submitting}
        error={status.error?.includes('Message')}
        {...inputProps}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={status.submitting}
        sx={{
          mt: 2,
          py: 1.5,
          position: 'relative',
          bgcolor: theme.palette.primary.main,
          color: 'white',
          '&:hover': {
            bgcolor: theme.palette.primary.dark,
          },
          '&.Mui-disabled': {
            bgcolor: theme.palette.action.disabledBackground,
          }
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
                color: theme.palette.primary.main
              }}
            />
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </Button>
    </Paper>
  );
};

export default ContactForm;
