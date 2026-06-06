import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  Collapse,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import api from '../api';

const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

// Shared animation keyframes for this page
const keyframes = {
  '@keyframes slideUp': {
    from: { opacity: 0, transform: 'translateY(40px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes wave': {
    '0%, 60%, 100%': { transform: 'rotate(0deg)' },
    '10%, 30%': { transform: 'rotate(14deg)' },
    '20%': { transform: 'rotate(-8deg)' },
    '40%': { transform: 'rotate(-4deg)' },
    '50%': { transform: 'rotate(10deg)' },
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
    '50%': { transform: 'translate(20px, -30px) scale(1.08)' },
  },
};

// Decorative blurred blob used to build the animated background
function Blob({ size, color, top, left, right, bottom, delay }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        borderRadius: '50%',
        background: color,
        filter: 'blur(60px)',
        opacity: 0.5,
        animation: `float 12s ${EASING} infinite`,
        animationDelay: delay,
        pointerEvents: 'none',
      }}
    />
  );
}

function Login({ onAuthSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      onAuthSuccess(data.token, data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background:
          'linear-gradient(135deg, #1976d2 0%, #1565c0 55%, #0d47a1 100%)',
        ...keyframes,
      }}
    >
      {/* Animated floating background pattern */}
      <Blob size={320} color="#42a5f5" top="-80px" left="-60px" delay="0s" />
      <Blob size={260} color="#0d47a1" bottom="-70px" right="-40px" delay="3s" />
      <Blob size={180} color="#64b5f6" top="40%" right="12%" delay="6s" />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            width: '100%',
            borderRadius: 4,
            bgcolor: 'rgba(255, 255, 255, 0.82)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.28)',
            animation: `slideUp 600ms ${EASING}`,
          }}
        >
          {/* Pulsing/waving icon badge */}
          <Box
            sx={{
              width: 76,
              height: 76,
              mx: 'auto',
              mb: 2,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              backgroundImage:
                'linear-gradient(135deg, #42a5f5 0%, #1565c0 100%)',
              boxShadow: '0 10px 24px rgba(21, 101, 192, 0.45)',
            }}
          >
            <WavingHandIcon
              sx={{
                fontSize: 38,
                transformOrigin: '70% 70%',
                animation: 'wave 2.4s ease-in-out infinite',
              }}
            />
          </Box>

          <Typography variant="h4" align="center" sx={{ fontWeight: 700 }}>
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Log in to your Social Post account
          </Typography>

          <Collapse in={Boolean(error)} unmountOnExit>
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          </Collapse>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  transition: `box-shadow 0.3s ${EASING}, transform 0.3s ${EASING}`,
                  '&:hover': { boxShadow: '0 4px 18px rgba(25, 118, 210, 0.18)' },
                },
              }}
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  transition: `box-shadow 0.3s ${EASING}`,
                  '&:hover': { boxShadow: '0 4px 18px rgba(25, 118, 210, 0.18)' },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.3,
                fontSize: '1rem',
                position: 'relative',
                overflow: 'hidden',
                // Shine sweep on hover
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-120%',
                  width: '60%',
                  height: '100%',
                  background:
                    'linear-gradient(120deg, transparent, rgba(255,255,255,0.5), transparent)',
                  transition: `left 0.6s ${EASING}`,
                },
                '&:hover::after': { left: '140%' },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'Log In'
              )}
            </Button>
          </form>

          <Typography align="center" sx={{ mt: 3 }}>
            Don&apos;t have an account?{' '}
            <Link
              component={RouterLink}
              to="/signup"
              sx={{ fontWeight: 600, textDecoration: 'none' }}
            >
              Sign up
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
