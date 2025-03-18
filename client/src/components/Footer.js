import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { motion } from 'framer-motion';

const socialLinks = [
  { icon: LinkedInIcon, url: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FacebookIcon, url: 'https://facebook.com', label: 'Facebook' },
  { icon: TwitterIcon, url: 'https://twitter.com', label: 'Twitter' },
];

const footerLinks = [
  { title: 'Company', items: [
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ]},
  { title: 'Services', items: [
    { name: 'CNC Grinding', path: '/services#cnc' },
    { name: 'Conventional Grinding', path: '/services#conventional' },
    { name: 'Tool Design', path: '/services#design' },
  ]},
  { title: 'Resources', items: [
    { name: 'Store', path: '/store' },
    { name: 'Submit Prints', path: '/contact#prints' },
    { name: 'Get a Quote', path: '/contact#quote' },
  ]},
];

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), transparent)',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 700,
                letterSpacing: '.1rem',
                mb: 2,
                display: 'inline-block',
              }}
            >
              YOUNG'S PRECISION
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Expert tool and cutter grinding services, delivering precision and quality since 1985.
            </Typography>
            <Box sx={{ mt: 2 }}>
              {socialLinks.map((social) => (
                <motion.span
                  key={social.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                      color: 'primary.main',
                      mr: 1,
                      '&:hover': {
                        color: 'primary.light',
                        bgcolor: 'rgba(6, 182, 212, 0.1)',
                      },
                    }}
                  >
                    <social.icon />
                  </IconButton>
                </motion.span>
              ))}
            </Box>
          </Grid>

          {/* Links */}
          {footerLinks.map((section) => (
            <Grid item xs={12} sm={6} md={2} key={section.title}>
              <Typography
                variant="subtitle1"
                color="text.primary"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                {section.title}
              </Typography>
              {section.items.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      color: 'text.secondary',
                      display: 'block',
                      mb: 1,
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </Grid>
          ))}

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="subtitle1"
              color="text.primary"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              1234 Industry Drive
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Sacramento, CA 95814
            </Typography>
            <Link
              href="tel:+1-916-555-0123"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                display: 'block',
                mb: 1,
                '&:hover': {
                  color: 'primary.light',
                },
              }}
            >
              (916) 555-0123
            </Link>
            <Link
              href="mailto:info@youngsprecision.com"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.light',
                },
              }}
            >
              info@youngsprecision.com
            </Link>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 8, pb: 2 }}
        >
          {new Date().getFullYear()} Young's Precision Tool Grinding. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
