import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import theme from './theme';
import AppRoutes from './routes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          <Router>
            <Box
              component="div"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                bgcolor: 'background.default',
                color: 'text.primary',
              }}
            >
              <Navbar />
              <Box
                component="main"
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  position: 'relative',
                }}
              >
                <AppRoutes />
              </Box>
              <Footer />
            </Box>
          </Router>
        </ThemeProvider>
      </StyledEngineProvider>
    </ErrorBoundary>
  );
}

export default App;
