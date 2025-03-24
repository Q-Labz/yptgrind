import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Logo = ({ height = 40, sx = {} }) => {
  return (
    <Box
      component={Link}
      to="/"
      sx={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        ...sx
      }}
    >
      <Typography
        variant="h4"
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(45deg, #06B6D4, #0EA5E9)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          letterSpacing: '.1rem',
        }}
      >
        YOUNG'S
      </Typography>
    </Box>
  );
};

export default Logo;
