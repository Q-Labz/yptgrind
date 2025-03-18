import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  useScrollTrigger,
  Slide,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const pages = [
  { title: 'Home', path: '/' },
  { title: 'About', path: '/about' },
  { title: 'Services', path: '/services' },
  { title: 'Store', path: '/store' },
  { title: 'Contact', path: '/contact' },
];

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        elevation={isScrolled ? 4 : 0}
        sx={{
          background: isScrolled 
            ? 'rgba(15, 23, 42, 0.9)' 
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo for larger screens */}
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'white',
                textDecoration: 'none',
                letterSpacing: '.1rem',
              }}
            >
              YOUNG'S PRECISION
            </Typography>

            {/* Mobile menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                sx={{ color: 'white' }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
                PaperProps={{
                  sx: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(10px)',
                  }
                }}
              >
                {pages.map((page) => (
                  <MenuItem 
                    key={page.title} 
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to={page.path}
                    selected={location.pathname === page.path}
                    sx={{
                      color: 'white',
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(6, 182, 212, 0.05)',
                      },
                    }}
                  >
                    <Typography textAlign="center">{page.title}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Logo for mobile */}
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                color: 'white',
                textDecoration: 'none',
                letterSpacing: '.1rem',
              }}
            >
              YOUNG'S
            </Typography>

            {/* Desktop menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
              {pages.map((page) => {
                const isActive = location.pathname === page.path;
                return (
                  <motion.div
                    key={page.title}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      component={Link}
                      to={page.path}
                      onClick={handleCloseNavMenu}
                      sx={{
                        my: 2,
                        mx: 1,
                        color: 'white',
                        display: 'block',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: '10px',
                          left: '50%',
                          width: isActive ? '100%' : '0%',
                          height: '2px',
                          backgroundColor: 'cyan.400',
                          transition: 'all 0.3s ease',
                          transform: 'translateX(-50%)',
                        },
                        '&:hover::after': {
                          width: '100%',
                        },
                      }}
                    >
                      {page.title}
                    </Button>
                  </motion.div>
                );
              })}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
