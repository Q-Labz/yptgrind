import React, { useState } from 'react';
import { Container, Typography, Grid, Box, Dialog, DialogContent } from '@mui/material';
import { motion } from 'framer-motion';
import { Build, Construction, Engineering, Layers } from '@mui/icons-material';
import { useInView } from 'react-intersection-observer';
import PageHeader from '../components/PageHeader';
import QuoteRequestForm from '../components/QuoteRequestForm';

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

const services = [
  {
    title: 'Tool Grinding',
    meta: 'High Precision',
    description: 'Precision grinding services for cutting tools, including end mills, drills, and custom tooling. We handle both standard and specialty tools with exceptional accuracy.',
    icon: <Engineering sx={{ fontSize: 16, color: 'cyan.400' }} />,
    status: 'Available',
    tags: ['Precision', 'Custom'],
    details: [
      'End mill grinding and resharpening',
      'Drill bit reconditioning',
      'Custom tool modifications',
      'Surface grinding'
    ],
    colSpan: 2
  },
  {
    title: 'Cutter Sharpening',
    meta: 'Professional',
    description: 'Professional sharpening services for industrial cutters. We restore your cutting tools to their original specifications or modify them to meet your specific requirements.',
    icon: <Build sx={{ fontSize: 16, color: 'emerald.500' }} />,
    status: 'Active',
    tags: ['Industrial', 'Restoration'],
    details: [
      'Industrial blade sharpening',
      'Circular saw blade reconditioning',
      'Carbide tool sharpening',
      'High-speed steel tool maintenance'
    ]
  },
  {
    title: 'Custom Tool Manufacturing',
    meta: 'Bespoke Solutions',
    description: 'Custom tool design and manufacturing services to meet your unique cutting and grinding needs. We work with you to create tools that perfectly match your specifications.',
    icon: <Construction sx={{ fontSize: 16, color: 'purple.500' }} />,
    status: 'Custom',
    tags: ['Design', 'Manufacturing'],
    details: [
      'Custom tool design',
      'Prototype development',
      'Special geometry tools',
      'Material-specific tooling'
    ],
    colSpan: 2
  },
  {
    title: 'Tool Coating',
    meta: 'Advanced Tech',
    description: 'Advanced coating services to enhance tool performance and longevity. We offer various coating options to improve wear resistance and cutting efficiency.',
    icon: <Layers sx={{ fontSize: 16, color: 'amber.500' }} />,
    status: 'Premium',
    tags: ['Coating', 'Performance'],
    details: [
      'PVD coating',
      'TiN coating',
      'AlTiN coating',
      'Diamond-like carbon coating'
    ]
  }
];

function BentoGrid({ items, onRequestQuote }) {
  return (
    <Grid container spacing={1.5}>
      {items.map((item, index) => (
        <Grid 
          item 
          xs={12} 
          md={item.colSpan === 2 ? 8 : 4} 
          key={index}
        >
          <Box
            sx={{
              position: 'relative',
              p: 3,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 2px 12px rgba(255,255,255,0.03)',
                borderColor: 'cyan.500',
                '& .bento-icon': {
                  bgcolor: 'rgba(6, 182, 212, 0.1)',
                },
                '& .bento-status': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
                '& .bento-tag': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
                '& .quote-button': {
                  opacity: 1,
                  transform: 'translateY(0)',
                }
              }
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.02) 1px, transparent 1px)',
                backgroundSize: '4px 4px',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                '.MuiBox-root:hover &': {
                  opacity: 1,
                },
              }}
            />

            <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box
                  className="bento-icon"
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  className="bento-status"
                  variant="caption"
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    color: 'text.secondary',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {item.status}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: 15,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: 12,
                  }}
                >
                  {item.meta}
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.5,
                  fontSize: 13,
                }}
              >
                {item.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 'auto' }}>
                {item.tags.map((tag, idx) => (
                  <Typography
                    key={idx}
                    className="bento-tag"
                    variant="caption"
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      color: 'text.secondary',
                      fontSize: 11,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {tag}
                  </Typography>
                ))}
              </Box>

              <Box component="ul" sx={{ pl: 2, mt: 2, mb: 0 }}>
                {item.details.map((detail, idx) => (
                  <Typography
                    component="li"
                    key={idx}
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: 13,
                      mb: 0.5,
                    }}
                  >
                    {detail}
                  </Typography>
                ))}
              </Box>

              <Box
                className="quote-button"
                sx={{
                  mt: 2,
                  opacity: 0,
                  transform: 'translateY(10px)',
                  transition: 'all 0.3s ease',
                }}
              >
                <Box
                  onClick={() => onRequestQuote(item.title)}
                  sx={{
                    display: 'inline-block',
                    px: 3,
                    py: 1,
                    borderRadius: 1,
                    bgcolor: '#06B6D4',
                    color: 'white',
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: '#0891B2',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Request Quote
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

const Services = () => {
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleRequestQuote = (service) => {
    setSelectedService(service);
    setQuoteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setQuoteDialogOpen(false);
    setSelectedService(null);
  };

  return (
    <Box>
      <PageHeader
        title="Our Services"
        subtitle="Precision Tool Grinding & Custom Manufacturing Solutions"
        image="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1600&auto=format&fit=crop&q=80"
      />
      <Container maxWidth="lg">
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
            Our Services
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
            We offer comprehensive tool grinding and manufacturing services to meet all your precision tooling needs.
          </Typography>
        </AnimatedSection>

        <AnimatedSection>
          <BentoGrid items={services} onRequestQuote={handleRequestQuote} />
        </AnimatedSection>

        <Dialog
          open={quoteDialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          PaperProps={{
            sx: {
              bgcolor: '#0F172A',
              backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '4px 4px',
            }
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <QuoteRequestForm 
              onClose={handleCloseDialog}
              initialService={selectedService}
            />
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Services;
