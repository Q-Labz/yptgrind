import React from 'react';
import { Box, Typography } from '@mui/material';

const PageHeader = ({ title, subtitle, imagePath }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '400px',
        width: '100%',
        mb: 6,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${imagePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9))',
          }
        }}
      />
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          px: 4,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
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
