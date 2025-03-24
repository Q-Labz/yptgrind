import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle, background, image }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        position: 'relative',
        height: '50vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        bgcolor: background || 'background.default',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.2,
          zIndex: 0,
          backgroundImage: image ? `url(${image})` : 'url(https://images.pexels.com/photos/2381463/pexels-photo-2381463.jpeg?auto=compress&cs=tinysrgb&w=2000)',
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
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          px: 4,
          mt: -8
        }}
      >
        <Typography
          component={motion.h1}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          variant="h2"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            background: 'linear-gradient(45deg, #06B6D4, #0EA5E9)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            variant="h5"
            sx={{
              maxWidth: '800px',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;
