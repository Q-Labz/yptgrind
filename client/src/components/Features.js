import React from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import {
  PrecisionManufacturing,
  Speed,
  Engineering,
  LocalShipping,
  VerifiedUser,
  Build,
  Construction
} from '@mui/icons-material';

const features = [
  {
    title: "Precision Machining",
    description: "High-precision CNC machining with exceptional accuracy and repeatability.",
    icon: <PrecisionManufacturing sx={{ fontSize: 40 }} />,
  },
  {
    title: "Rapid Turnaround",
    description: "Quick turnaround times without compromising on quality.",
    icon: <Speed sx={{ fontSize: 40 }} />,
  },
  {
    title: "Engineering Support",
    description: "Expert engineering consultation and design optimization services.",
    icon: <Engineering sx={{ fontSize: 40 }} />,
  },
  {
    title: "Global Shipping",
    description: "Worldwide shipping with careful packaging and tracking.",
    icon: <LocalShipping sx={{ fontSize: 40 }} />,
  },
  {
    title: "Quality Assurance",
    description: "Rigorous quality control and inspection processes.",
    icon: <VerifiedUser sx={{ fontSize: 40 }} />,
  },
  {
    title: "CNC Machining",
    description: "State-of-the-art CNC machining for complex parts and high-volume production.",
    icon: <PrecisionManufacturing sx={{ fontSize: 40 }} />,
  },
  {
    title: "Custom Solutions",
    description: "Tailored manufacturing solutions for unique requirements.",
    icon: <Build sx={{ fontSize: 40 }} />,
  },
  {
    title: "Advanced Equipment",
    description: "State-of-the-art machinery and cutting-edge technology.",
    icon: <Construction sx={{ fontSize: 40 }} />,
  },
];

const Feature = ({ title, description, icon, index }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        py: 5,
        px: 5,
        position: 'relative',
        borderRight: {
          xs: 'none',
          md: index % 4 !== 3 ? `1px solid ${theme.palette.divider}` : 'none'
        },
        borderLeft: {
          xs: 'none',
          md: index % 4 === 0 ? `1px solid ${theme.palette.divider}` : 'none'
        },
        borderBottom: {
          xs: 'none',
          md: index < 4 ? `1px solid ${theme.palette.divider}` : 'none'
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(${index < 4 ? 'to top' : 'to bottom'}, ${theme.palette.cyan[500]}10 0%, transparent 100%)`,
          opacity: 0,
          transition: 'all 0.3s ease',
          pointerEvents: 'none',
        },
        '&:hover': {
          '&::before': {
            opacity: 1,
          },
          '& .feature-indicator': {
            height: '2rem',
            bgcolor: 'cyan.500',
            boxShadow: `0 0 20px ${theme.palette.cyan[500]}40`,
          },
          '& .feature-title': {
            transform: 'translateX(1rem)',
            color: 'cyan.400',
          },
          '& .feature-icon': {
            color: 'cyan.400',
            transform: 'scale(1.1)',
          }
        }
      }}
    >
      <Box 
        className="feature-icon"
        sx={{ 
          mb: 2, 
          color: 'text.secondary',
          transition: 'all 0.3s ease',
        }}
      >
        {icon}
      </Box>
      <Box sx={{ position: 'relative', mb: 1 }}>
        <Box
          className="feature-indicator"
          sx={{
            position: 'absolute',
            left: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 4,
            height: '1.5rem',
            bgcolor: 'divider',
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
            transition: 'all 0.3s ease',
          }}
        />
        <Typography
          variant="h6"
          className="feature-title"
          sx={{
            color: 'text.primary',
            transition: 'all 0.3s ease',
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          maxWidth: '300px',
          lineHeight: 1.6,
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};

export function Features() {
  return (
    <Box 
      sx={{ 
        py: 5, 
        maxWidth: 'lg', 
        mx: 'auto',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.2), transparent)',
        }
      }}
    >
      <Grid container>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={feature.title}>
            <Feature {...feature} index={index} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
