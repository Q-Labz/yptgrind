import React from "react";
import { motion } from "framer-motion";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export const LampContainer = ({ children }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        bgcolor: 'slate.950',
        width: '100%',
        borderRadius: 1,
        zIndex: 0
      }}
    >
      <Box sx={{ 
        position: 'relative',
        display: 'flex',
        width: '100%',
        flex: 1,
        transform: 'scaleY(1.25)',
        alignItems: 'center',
        justifyContent: 'center',
        isolation: 'isolate',
        zIndex: 0
      }}>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            position: 'absolute',
            inset: 'auto',
            right: '50%',
            height: '14rem',
            overflow: 'visible',
            width: '30rem',
            background: 'conic-gradient(from 70deg at center top, #06B6D4, transparent, transparent)',
            color: 'white'
          }}
        >
          <Box sx={{
            position: 'absolute',
            width: '100%',
            left: 0,
            bgcolor: 'slate.950',
            height: '10rem',
            bottom: 0,
            zIndex: 20,
            maskImage: 'linear-gradient(to top, white, transparent)'
          }} />
          <Box sx={{
            position: 'absolute',
            width: '10rem',
            height: '100%',
            left: 0,
            bgcolor: 'slate.950',
            bottom: 0,
            zIndex: 20,
            maskImage: 'linear-gradient(to right, white, transparent)'
          }} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            position: 'absolute',
            inset: 'auto',
            left: '50%',
            height: '14rem',
            width: '30rem',
            background: 'conic-gradient(from 290deg at center top, transparent, transparent, #06B6D4)',
            color: 'white'
          }}
        >
          <Box sx={{
            position: 'absolute',
            width: '10rem',
            height: '100%',
            right: 0,
            bgcolor: 'slate.950',
            bottom: 0,
            zIndex: 20,
            maskImage: 'linear-gradient(to left, white, transparent)'
          }} />
          <Box sx={{
            position: 'absolute',
            width: '100%',
            right: 0,
            bgcolor: 'slate.950',
            height: '10rem',
            bottom: 0,
            zIndex: 20,
            maskImage: 'linear-gradient(to top, white, transparent)'
          }} />
        </motion.div>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          height: '12rem',
          width: '100%',
          transform: 'translateY(3rem) scaleX(1.5)',
          bgcolor: 'slate.950',
          filter: 'blur(16px)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '50%',
          zIndex: 50,
          height: '12rem',
          width: '100%',
          bgcolor: 'transparent',
          opacity: 0.1,
          backdropFilter: 'blur(8px)'
        }} />
        <Box sx={{
          position: 'absolute',
          inset: 'auto',
          zIndex: 50,
          height: '9rem',
          width: '28rem',
          transform: 'translateY(-50%)',
          borderRadius: '50%',
          bgcolor: 'cyan.500',
          opacity: 0.5,
          filter: 'blur(24px)'
        }} />
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            position: 'absolute',
            inset: 'auto',
            zIndex: 30,
            height: '9rem',
            transform: 'translateY(-6rem)',
            borderRadius: '50%',
            backgroundColor: '#22D3EE',
            filter: 'blur(16px)'
          }}
        />
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            position: 'absolute',
            inset: 'auto',
            zIndex: 50,
            height: '2px',
            transform: 'translateY(-7rem)',
            backgroundColor: '#22D3EE'
          }}
        />
        <Box sx={{
          position: 'absolute',
          inset: 'auto',
          zIndex: 40,
          height: '11rem',
          width: '100%',
          transform: 'translateY(-12.5rem)',
          bgcolor: 'slate.950'
        }} />
      </Box>

      <Box sx={{
        position: 'relative',
        zIndex: 50,
        display: 'flex',
        transform: 'translateY(-20rem)',
        flexDirection: 'column',
        alignItems: 'center',
        px: 5
      }}>
        {children}
      </Box>
    </Box>
  );
};

export const LampHero = () => {
  return (
    <LampContainer>
      <motion.div
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        <Typography
          variant="h1"
          sx={{
            background: 'linear-gradient(to bottom right, #CBD5E1, #64748B)',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: { xs: "2.5rem", md: "4.5rem" },
            fontWeight: 500,
            letterSpacing: "-0.02em",
            mb: 4
          }}
        >
          Precision Engineering
          <br />
          Excellence in Every Cut
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            mb: 4,
            maxWidth: "800px"
          }}
        >
          Delivering unmatched quality in CNC machining and conventional grinding services
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            component={Link}
            to="/services"
            variant="contained"
            color="primary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              backgroundColor: "cyan.500",
              "&:hover": {
                backgroundColor: "cyan.600",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s ease"
            }}
          >
            Our Services
          </Button>
          <Button
            component={Link}
            to="/contact"
            variant="outlined"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderColor: "cyan.500",
              color: "cyan.500",
              "&:hover": {
                borderColor: "cyan.400",
                backgroundColor: "rgba(6, 182, 212, 0.1)",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s ease"
            }}
          >
            Get a Quote
          </Button>
        </Box>
      </motion.div>
    </LampContainer>
  );
};
