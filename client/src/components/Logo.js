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
        src="https://raw.githubusercontent.com/Q-Labz/yptgrind/main/client/src/assets/logo.png"
        alt="Young's Precision Tool Grinding"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          height: height,
          width: 'auto',
          objectFit: 'contain',
          filter: 'brightness(0) invert(1)' // Make the logo white
        }}
      />
    </Box>
  );
};

export default Logo;
