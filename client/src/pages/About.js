import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PageHeader from '../components/PageHeader';
import {
  Engineering,
  PrecisionManufacturing,
  History,
  Groups,
  Timer,
  Construction,
  Inventory,
  LocalShipping,
  Work,
} from '@mui/icons-material';

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

const items = [
  {
    title: "Industry Experience",
    meta: "45+ Years",
    description: "Four decades of excellence in precision tool grinding and manufacturing solutions",
    icon: <Engineering sx={{ fontSize: 16, color: '#06B6D4' }} />,
    status: "Established",
    tags: ["Experience", "Expertise"],
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: "Quality Control",
    meta: "99.9% Rate",
    description: "Rigorous quality assurance processes ensuring precision in every project",
    icon: <PrecisionManufacturing sx={{ fontSize: 16, color: '#06B6D4' }} />,
    status: "Certified",
    tags: ["Quality", "Precision"],
  },
  {
    title: "Project History",
    meta: "1000+ Projects",
    description: "Successfully completed projects across various industrial sectors",
    icon: <History sx={{ fontSize: 16, color: '#06B6D4' }} />,
    tags: ["Projects", "Success"],
    colSpan: 2,
  },
  {
    title: "Expert Team",
    meta: "25+ Members",
    description: "Skilled professionals with extensive industry knowledge",
    icon: <Groups sx={{ fontSize: 16, color: '#06B6D4' }} />,
    status: "Growing",
    tags: ["Team", "Skills"],
  },
  {
    title: "Fast Turnaround",
    meta: "24/7 Support",
    description: "Quick delivery without compromising on quality standards",
    icon: <Timer sx={{ fontSize: 16, color: '#06B6D4' }} />,
    status: "Active",
    tags: ["Speed", "Service"],
  },
  {
    title: "Modern Equipment",
    meta: "Latest Tech",
    description: "State-of-the-art machinery for precise manufacturing",
    icon: <Construction sx={{ fontSize: 16, color: '#06B6D4' }} />,
    status: "Updated",
    tags: ["Technology", "Innovation"],
    colSpan: 2,
  },
  {
    title: "Inventory Management",
    meta: "Real-time",
    description: "Efficient tracking and management of materials and tools",
    icon: <Inventory sx={{ fontSize: 16, color: '#06B6D4' }} />,
    status: "Optimized",
    tags: ["Management", "Efficiency"],
  },
  {
    title: "Global Shipping",
    meta: "Worldwide",
    description: "International delivery with careful packaging and tracking",
    icon: <LocalShipping sx={{ fontSize: 16, color: '#06B6D4' }} />,
    status: "Available",
    tags: ["Shipping", "Global"],
  },
];

const BentoGrid = ({ items }) => {
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
              p: 2,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 2px 12px rgba(255,255,255,0.03)',
                borderColor: '#06B6D4',
                '& .bento-icon': {
                  bgcolor: 'rgba(6, 182, 212, 0.1)',
                },
                '& .bento-status': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
                '& .bento-tag': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
                '& .bento-cta': {
                  opacity: 1,
                },
              },
              ...(item.hasPersistentHover && {
                transform: 'translateY(-2px)',
                boxShadow: '0 2px 12px rgba(255,255,255,0.03)',
              }),
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.02) 1px, transparent 1px)',
                backgroundSize: '4px 4px',
                opacity: item.hasPersistentHover ? 1 : 0,
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
                  {item.status || "Active"}
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
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{
                      ml: 1,
                      color: 'text.secondary',
                      fontWeight: 400,
                    }}
                  >
                    {item.meta}
                  </Typography>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: 14,
                    lineHeight: 1.4,
                    mt: 0.5,
                  }}
                >
                  {item.description}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {item.tags?.map((tag, i) => (
                    <Typography
                      key={i}
                      className="bento-tag"
                      variant="caption"
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        color: 'text.secondary',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      #{tag}
                    </Typography>
                  ))}
                </Box>
                <Typography
                  className="bento-cta"
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {item.cta || "Learn more →"}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                zIndex: -1,
                p: '1px',
                borderRadius: 2,
                background: 'linear-gradient(to bottom right, transparent, rgba(255,255,255,0.1), transparent)',
                opacity: item.hasPersistentHover ? 1 : 0,
                transition: 'opacity 0.3s ease',
                '.MuiBox-root:hover &': {
                  opacity: 1,
                },
              }}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

const About = () => {
  return (
    <Box>
      <PageHeader
        title="About Young's Precision"
        subtitle="Over 45 Years of Excellence in Precision Tool Grinding"
        imagePath="/images/machine-shop-about.jpg"
      />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <AnimatedSection>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{
              background: 'linear-gradient(to right, #06B6D4, #0EA5E9)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              mb: 6
            }}
          >
            My Career Journey in Precision Tool Manufacturing
          </Typography>

          <Typography 
            variant="h6" 
            component="p" 
            align="center" 
            sx={{ 
              mb: 8,
              color: '#94A3B8',
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Explore my career timeline and learn how decades of expertise in cutting tool manufacturing have shaped my journey across the aerospace and precision tool industries. From honing skills in custom tool grinding to founding my own business, each step in my career has been focused on precision, innovation, and delivering custom cutting solutions for demanding industries.
          </Typography>

          <Timeline position="alternate" sx={{ mb: 8 }}>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot sx={{ bgcolor: '#06B6D4' }}>
                  <Work />
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: '#06B6D4' }} />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={3} sx={{ p: 3, bgcolor: '#0F172A', borderRadius: 2, border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <Typography variant="h6" component="h2" sx={{ color: '#06B6D4' }}>1976 – Aerospace Cutting Tools</Typography>
                  <Typography sx={{ color: '#94A3B8' }}>Started my career specializing in precision aerospace tools, laying the foundation for a long-lasting commitment to tool manufacturing excellence.</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot sx={{ bgcolor: '#06B6D4' }}>
                  <Work />
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: '#06B6D4' }} />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={3} sx={{ p: 3, bgcolor: '#0F172A', borderRadius: 2, border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <Typography variant="h6" component="h2" sx={{ color: '#06B6D4' }}>1980 – Northrop Corporation</Typography>
                  <Typography sx={{ color: '#94A3B8' }}>Focused on custom cutting tools, grinding them based on detailed prints, and developed deep expertise in tool design and aerospace functionality.</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot sx={{ bgcolor: '#06B6D4' }}>
                  <Work />
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: '#06B6D4' }} />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={3} sx={{ p: 3, bgcolor: '#0F172A', borderRadius: 2, border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <Typography variant="h6" component="h2" sx={{ color: '#06B6D4' }}>1982 – Craig Tools</Typography>
                  <Typography sx={{ color: '#94A3B8' }}>Expanded my knowledge by working with a wide range of rotary cutting tools, enhancing versatility and skills for various industrial applications.</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot sx={{ bgcolor: '#06B6D4' }}>
                  <Work />
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: '#06B6D4' }} />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={3} sx={{ p: 3, bgcolor: '#0F172A', borderRadius: 2, border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <Typography variant="h6" component="h2" sx={{ color: '#06B6D4' }}>1984 – Rockwell International</Typography>
                  <Typography sx={{ color: '#94A3B8' }}>Contributed to high-profile aerospace projects, including the Space Shuttle and B1B Bomber, producing specialized cutting tools and receiving performance awards for excellence.</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot sx={{ bgcolor: '#06B6D4' }}>
                  <Work />
                </TimelineDot>
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={3} sx={{ p: 3, bgcolor: '#0F172A', borderRadius: 2, border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <Typography variant="h6" component="h2" sx={{ color: '#06B6D4' }}>1997 – Young's Precision Tool Grinding</Typography>
                  <Typography sx={{ color: '#94A3B8' }}>Founded my own company, Young's Precision Tool Grinding, providing custom cutting solutions across industries, continuing my legacy of precision and innovation.</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          </Timeline>

          <Typography variant="h4" component="h2" align="center" sx={{ mb: 6, color: '#06B6D4' }}>
            Our Capabilities
          </Typography>

          <BentoGrid items={items} />
        </AnimatedSection>
      </Container>
    </Box>
  );
};

export default About;
