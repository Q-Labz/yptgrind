import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import { supabase } from '../lib/supabase';
import FileUpload from './FileUpload';

const urgencyLevels = [
  'Low - General Inquiry',
  'Medium - Need Response Within Week',
  'High - Need Response Within 48 Hours',
  'Urgent - Need Immediate Response'
];

const contactMethods = [
  'Email',
  'Phone',
  'Either'
];

const contactTimes = [
  'Morning (8AM-12PM)',
  'Afternoon (12PM-5PM)',
  'Evening (5PM-8PM)',
  'Any Time'
];

const industries = [
  'Aerospace',
  'Automotive',
  'Medical',
  'Defense',
  'Electronics',
  'Energy',
  'Manufacturing',
  'Other'
];

const foundUs = [
  'Google Search',
  'Referral',
  'Social Media',
  'Trade Show',
  'Industry Directory',
  'Other'
];

const ContactForm = () => {
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    email: '',
    phone: '',
    company: '',
    
    // Contact Preferences
    subject: '',
    preferred_contact: '',
    best_time: '',
    urgency: '',
    
    // Business Information
    industry: '',
    location: '',
    how_found: '',
    
    // Message
    message: '',
    
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
    if (!formData.subject) errors.push('Subject is required');
    if (!formData.message) errors.push('Message is required');
    
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
        .from('contact_messages')
        .insert([{
          ...formData,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setStatus({
        submitting: false,
        submitted: true,
        error: null,
        message: 'Message sent successfully!'
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        preferred_contact: '',
        best_time: '',
        urgency: '',
        industry: '',
        location: '',
        how_found: '',
        message: '',
        attachment_urls: []
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus({
        submitting: false,
        submitted: true,
        error: error.message || 'Failed to send message'
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

        {/* Contact Preferences */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Contact Preferences
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Preferred Contact Method</InputLabel>
            <Select
              name="preferred_contact"
              value={formData.preferred_contact}
              onChange={handleChange}
              label="Preferred Contact Method"
            >
              {contactMethods.map((method) => (
                <MenuItem key={method} value={method}>{method}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Best Time to Contact</InputLabel>
            <Select
              name="best_time"
              value={formData.best_time}
              onChange={handleChange}
              label="Best Time to Contact"
            >
              {contactTimes.map((time) => (
                <MenuItem key={time} value={time}>{time}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Urgency</InputLabel>
            <Select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              label="Urgency"
            >
              {urgencyLevels.map((level) => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Business Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Business Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Industry</InputLabel>
            <Select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              label="Industry"
            >
              {industries.map((industry) => (
                <MenuItem key={industry} value={industry}>{industry}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, State"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>How Did You Find Us?</InputLabel>
            <Select
              name="how_found"
              value={formData.how_found}
              onChange={handleChange}
              label="How Did You Find Us?"
            >
              {foundUs.map((source) => (
                <MenuItem key={source} value={source}>{source}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Message */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Message
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            multiline
            rows={4}
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Please provide details about your inquiry"
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
              Upload any relevant files (optional)
            </Typography>
            <FileUpload
              onUploadComplete={handleFileUpload}
              maxFiles={3}
              acceptedTypes=".pdf,.doc,.docx,.png,.jpg,.jpeg"
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
              'Send Message'
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactForm;
