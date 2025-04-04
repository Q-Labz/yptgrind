import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Alert, CircularProgress, Grid, Link } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PageHeader from '../components/PageHeader';
import { supabase } from '../lib/supabase';

const AnimatedSection = ({ children }) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, submitted: false, error: null });

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            company: formData.company || null,
            message: `${formData.subject ? formData.subject + ': ' : ''}${formData.message}`
          }
        ]);

      if (error) {
        throw error;
      }

      setStatus({
        submitting: false,
        submitted: true,
        error: null
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus({
        submitting: false,
        submitted: false,
        error: error.message || 'Failed to submit form. Please try again.'
      });
    }
  };

  return (
    <Box>
      <PageHeader
        title="Contact Us"
        subtitle="Get in Touch for Custom Tool Solutions"
        image="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&auto=format&fit=crop&q=80"
      />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <AnimatedSection>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Our Location
              </Typography>
              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 'medium' }}>
                  Address:
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  1942 South Augusta Ave, Unit H<br />
                  Ontario, CA 91761
                </Typography>
              </Box>
              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 'medium' }}>
                  Phone:
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <Link href="tel:9513688731" color="inherit">(951) 368-8731</Link>
                </Typography>
              </Box>
              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 'medium' }}>
                  Email:
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <Link href="mailto:yptgrind@yahoo.com" color="inherit">yptgrind@yahoo.com</Link>
                </Typography>
              </Box>
            </AnimatedSection>
          </Grid>
          
          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <AnimatedSection>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                align="center"
                sx={{
                  background: 'linear-gradient(to right, #06B6D4, #0EA5E9)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 4
                }}
              >
                Contact Us
              </Typography>
              
              <Typography 
                variant="body1" 
                paragraph 
                align="center" 
                sx={{ 
                  mb: 6,
                  color: 'text.secondary',
                  maxWidth: '800px',
                  mx: 'auto'
                }}
              >
                Have a question or need a quote? We're here to help. Fill out the form below and we'll get back to you as soon as possible.
              </Typography>
            </AnimatedSection>

            <AnimatedSection>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  maxWidth: 600,
                  mx: 'auto',
                  p: 4,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.02) 1px, transparent 1px)',
                    backgroundSize: '4px 4px',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  },
                  '&:hover::before': {
                    opacity: 1,
                  },
                }}
              >
                <TextField
                  required
                  name="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                      '&:hover fieldset': {
                        borderColor: 'cyan.500',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#06B6D4',
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
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                      '&:hover fieldset': {
                        borderColor: 'cyan.500',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#06B6D4',
                      },
                    },
                  }}
                />

                <TextField
                  name="phone"
                  label="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                      '&:hover fieldset': {
                        borderColor: 'cyan.500',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#06B6D4',
                      },
                    },
                  }}
                />

                <TextField
                  name="company"
                  label="Company"
                  value={formData.company}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                      '&:hover fieldset': {
                        borderColor: 'cyan.500',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#06B6D4',
                      },
                    },
                  }}
                />

                <TextField
                  required
                  name="subject"
                  label="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                      '&:hover fieldset': {
                        borderColor: 'cyan.500',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#06B6D4',
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
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                      '&:hover fieldset': {
                        borderColor: 'cyan.500',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#06B6D4',
                      },
                    },
                  }}
                />

                {status.error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {status.error}
                  </Alert>
                )}

                {status.submitted && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Thank you for your message! We'll get back to you soon.
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={status.submitting}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    bgcolor: '#06B6D4',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#0891B2',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {status.submitting ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </Box>
            </AnimatedSection>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
