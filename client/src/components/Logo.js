import React from 'react';
import { Box } from '@mui/material';
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
      <Box
        component={motion.img}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        src="/images/yptgrindlogo.png"
        alt="Young's Precision Tool Grinding"
        sx={{
          height: height,
          width: 'auto'
        }}
      />
    </Box>
  );
};

export default Logo;
