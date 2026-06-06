import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  GlobalStyles,
} from '@mui/material';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';

// Shared easing + gradient tokens reused across the app
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
const PRIMARY_GRADIENT = 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)';

// App-wide Material UI theme: gradient-driven, modern, with smooth motion
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0' },
    secondary: { main: '#dc004e' },
    background: { default: '#f8f9fa', paper: '#ffffff' },
    text: { primary: '#1a2027', secondary: '#5a6772' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.5px' },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 18,
          transition: `all 0.3s ${EASING}`,
        },
        contained: {
          backgroundImage: PRIMARY_GRADIENT,
          boxShadow: '0 4px 14px rgba(25, 118, 210, 0.25)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 22px rgba(25, 118, 210, 0.35)',
          },
        },
        outlined: {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 16 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { transition: `all 0.3s ${EASING}` },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: `box-shadow 0.3s ${EASING}`,
          '&.Mui-focused': {
            boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.12)',
          },
        },
      },
    },
  },
});

// Global keyframes + page background gradient
const globalStyles = (
  <GlobalStyles
    styles={{
      'html, body, #root': { minHeight: '100%' },
      body: {
        background: 'linear-gradient(135deg, #f8f9fa 0%, #f5f7fa 100%)',
        backgroundAttachment: 'fixed',
      },
      '@keyframes fadeIn': {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      '@keyframes fadeInUp': {
        from: { opacity: 0, transform: 'translateY(16px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
      },
    }}
  />
);

// Safely read the stored user from localStorage
const readStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

function App() {
  const [user, setUser] = useState(readStoredUser());

  const isAuthenticated = Boolean(user && localStorage.getItem('token'));

  // Called by Login/Signup pages on success
  const handleAuthSuccess = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles}
      <BrowserRouter>
        {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
        <Box
          sx={{
            minHeight: '100vh',
            animation: `fadeIn 0.3s ${EASING}`,
          }}
        >
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login onAuthSuccess={handleAuthSuccess} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Signup onAuthSuccess={handleAuthSuccess} />
                )
              }
            />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Feed user={user} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
