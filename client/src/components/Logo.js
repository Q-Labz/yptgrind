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
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        variant="h6"
        sx={{
          fontWeight: 700,
          color: 'primary.main',
          letterSpacing: 1,
          textTransform: 'uppercase'
        }}
      >
        Young's Precision
      </Typography>
    </Box>
  );
};

export default Logo;
