import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Features } from '../components/Features';

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

const CtaSection = ({ title, description, image, buttonText, link, reverse = false }) => {
  const [imageError, setImageError] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageError(false);
    };
    img.onerror = () => {
      setImageError(true);
    };
    img.src = image;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [image]);

  return (
    <Box 
      sx={{ 
        position: 'relative',
        py: { xs: 8, md: 12 },
        color: 'white',
        overflow: 'visible',
        bgcolor: 'background.default',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.2,
          zIndex: 0,
          backgroundImage: !imageError ? `url(${image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: `center ${scrollY * 0.2}px`,
          transition: 'all 0.5s ease-in-out',
          filter: 'brightness(0.8) contrast(1.2)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '70%',
          background: 'linear-gradient(to top, rgba(15, 23, 42, 1), rgba(15, 23, 42, 0.8) 40%, transparent)',
          pointerEvents: 'none',
          zIndex: 1,
        }
      }}
    >
      <Container sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4} direction={reverse ? 'row-reverse' : 'row'} alignItems="center">
          <Grid item xs={12} md={6}>
            <AnimatedSection>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: -20,
                    top: '50%',
                    width: 4,
                    height: '70%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'cyan.500',
                    borderRadius: '4px',
                  }
                }}
              >
                <Typography 
                  variant="h3" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 800,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    color: 'white',
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </Typography>
                <Typography 
                  variant="h6" 
                  paragraph 
                  sx={{ 
                    mb: 4,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 400,
                  }}
                >
                  {description}
                </Typography>
                <Button
                  component={Link}
                  to={link}
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    backgroundColor: 'cyan.500',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 6px 8px rgba(0,0,0,0.2)',
                      backgroundColor: 'cyan.600',
                    },
                  }}
                >
                  {buttonText}
                </Button>
              </Box>
            </AnimatedSection>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const Home = () => {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          minHeight: '90vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'background.default',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.2,
            zIndex: 0,
            backgroundImage: 'url(https://images.pexels.com/photos/2381463/pexels-photo-2381463.jpeg?auto=compress&cs=tinysrgb&w=2000)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            filter: 'brightness(0.8) contrast(1.2)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '70%',
            background: 'linear-gradient(to top, rgba(15, 23, 42, 1), rgba(15, 23, 42, 0.8) 40%, transparent)',
            pointerEvents: 'none',
            zIndex: 1,
          }
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 2, pt: { xs: 8, md: 0 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <AnimatedSection>
                <Box
                  sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: -20,
                      top: '50%',
                      width: 4,
                      height: '70%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'cyan.500',
                      borderRadius: '4px',
                    }
                  }}
                >
                  <Typography 
                    variant="h2" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 800,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                      color: 'white',
                      lineHeight: 1.2,
                    }}
                  >
                    Precision Engineering Solutions
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 4,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: 400,
                    }}
                  >
                    Delivering excellence in high-precision CNC machining, conventional grinding, and custom tooling solutions for industries worldwide.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      component={Link}
                      to="/services#cnc"
                      variant="contained"
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        backgroundColor: 'cyan.500',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 6px 8px rgba(0,0,0,0.2)',
                          backgroundColor: 'cyan.600',
                        },
                      }}
                    >
                      Explore Services
                    </Button>
                    <Button
                      component={Link}
                      to="/contact"
                      variant="outlined"
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        borderColor: 'cyan.500',
                        color: 'white',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          borderColor: 'cyan.400',
                          backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        },
                      }}
                    >
                      Get a Quote
                    </Button>
                  </Box>
                </Box>
              </AnimatedSection>
            </Grid>
            <Grid item xs={12} md={5}>
              <AnimatedSection>
                <Box 
                  sx={{ 
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' },
                    mt: { xs: 4, md: 0 }
                  }}
                >
                  {[
                    { number: '47', label: 'Years Experience' },
                    { number: '99.9%', label: 'Quality Rate' },
                    { number: '500,000+', label: 'Tools Manufactured' },
                  ].map((stat, index) => (
                    <Box
                      key={stat.label}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          borderColor: 'cyan.500',
                          boxShadow: '0 8px 16px rgba(6, 182, 212, 0.15)',
                        }
                      }}
                    >
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 700,
                          color: 'cyan.400',
                          mb: 1 
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography 
                        variant="body1"
                        sx={{ 
                          color: 'text.secondary',
                          fontWeight: 500 
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </AnimatedSection>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <AnimatedSection>
            <Typography
              variant="h3"
              align="center"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                pt: 8,
                color: 'text.primary',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.5), transparent)',
                }
              }}
            >
              Why Choose Us
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{
                mb: 6,
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              Experience excellence in precision manufacturing with our comprehensive range of services and unwavering commitment to quality.
            </Typography>
          </AnimatedSection>
          <Features />
        </Container>
      </Box>

      {/* Final CTA Section */}
      <CtaSection
        title="Ready to Get Started?"
        description="Contact us today to discuss your project requirements and discover how our precision engineering solutions can help you achieve your goals."
        image="https://images.pexels.com/photos/2381463/pexels-photo-2381463.jpeg?auto=compress&cs=tinysrgb&w=2000"
        buttonText="Contact Us"
        link="/contact"
        reverse
      />
    </Box>
  );
};

export default Home;
