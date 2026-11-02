import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

// Each page is its own chunk, so the first visit only downloads the page being opened.
const loadHome = () => import('./pages/Home');
const loadAbout = () => import('./pages/About');
const loadServices = () => import('./pages/Services');
const loadStore = () => import('./pages/Store');
const loadContact = () => import('./pages/Contact');

const Home = lazy(loadHome);
const About = lazy(loadAbout);
const Services = lazy(loadServices);
const Store = lazy(loadStore);
const Contact = lazy(loadContact);
const ChatBot = lazy(() => import('./components/ChatBot'));

const AppRoutes = () => {
  // Once the current page has settled, fetch the other pages in the background
  // so clicking around the nav is instant.
  useEffect(() => {
    const timer = setTimeout(() => {
      [loadHome, loadAbout, loadServices, loadStore, loadContact].forEach((load) => load());
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Suspense fallback={<Box sx={{ minHeight: '100vh' }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/store" element={<Store />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>
    </>
  );
};

export default AppRoutes;
