import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import Logo from './Logo';

const socialLinks = [
  { icon: LinkedInIcon, url: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FacebookIcon, url: 'https://facebook.com', label: 'Facebook' },
  { icon: TwitterIcon, url: 'https://twitter.com', label: 'Twitter' },
];

const footerLinks = [
  { title: 'Company', items: [
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
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
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Logo height={60} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Over 45 years of excellence in precision tool grinding and manufacturing solutions.
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" component="div">
                1942 South Augusta Ave, Unit H<br />
                Ontario, CA 91761
              </Typography>
              <Typography variant="body2" color="text.secondary" component="div" sx={{ mt: 1 }}>
                <Link href="tel:9513688731" color="inherit">(951) 368-8731</Link><br />
                <Link href="mailto:yptgrind@yahoo.com" color="inherit">yptgrind@yahoo.com</Link>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component={Link}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <social.icon />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <Grid item xs={12} sm={6} md={2} key={section.title}>
              <Typography
                variant="subtitle1"
                color="text.primary"
                sx={{ mb: 2, fontWeight: 'bold' }}
              >
                {section.title}
              </Typography>
              <Box
                component="ul"
                sx={{
                  m: 0,
                  p: 0,
                  listStyle: 'none',
                }}
              >
                {section.items.map((item) => (
                  <Box
                    component="li"
                    key={item.name}
                    sx={{ mb: 1 }}
                  >
                    <Link
                      component={RouterLink}
                      to={item.path}
                      sx={{
                        color: 'text.secondary',
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'none',
                        },
                      }}
                    >
                      {item.name}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Copyright */}
      <Box
        sx={{
          py: 3,
          bgcolor: 'background.default',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {new Date().getFullYear()} Young's Precision Tool Grinding. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
