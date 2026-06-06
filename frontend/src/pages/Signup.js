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
  LinearProgress,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CelebrationIcon from '@mui/icons-material/Celebration';
import api from '../api';

const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

const keyframes = {
  '@keyframes slideUp': {
    from: { opacity: 0, transform: 'translateY(40px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes bounce': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
    '50%': { transform: 'translate(-22px, 28px) scale(1.1)' },
  },
};

// Score a password 0–4 across length and character variety
const scorePassword = (pwd) => {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 6) score += 1;
  if (pwd.length >= 10) score += 1;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
  if (/\d/.test(pwd)) score += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
  return Math.min(score, 4);
};

const STRENGTH = [
  { label: '', color: '#e0e0e0' },
  { label: 'Weak', color: '#e53935' },
  { label: 'Fair', color: '#fb8c00' },
  { label: 'Good', color: '#1e88e5' },
  { label: 'Strong', color: '#43a047' },
];

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
        animation: `float 13s ${EASING} infinite`,
        animationDelay: delay,
        pointerEvents: 'none',
      }}
    />
  );
}

function Signup({ onAuthSuccess }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation before hitting the API
    if (form.password !== form.passwordConfirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', form);
      onAuthSuccess(data.token, data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = scorePassword(form.password);
  const strengthInfo = STRENGTH[strength];
  const passwordsMatch =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;
  const showMatch = form.passwordConfirm.length > 0;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        py: 4,
        background:
          'linear-gradient(135deg, #7b1fa2 0%, #6a1b9a 45%, #4a148c 100%)',
        ...keyframes,
      }}
    >
      {/* Animated floating background pattern */}
      <Blob size={320} color="#ab47bc" top="-70px" right="-50px" delay="0s" />
      <Blob size={260} color="#4a148c" bottom="-80px" left="-50px" delay="4s" />
      <Blob size={170} color="#ce93d8" top="35%" left="10%" delay="7s" />

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
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.3)',
            animation: `slideUp 600ms ${EASING}`,
          }}
        >
          {/* Bouncing icon badge */}
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
                'linear-gradient(135deg, #ab47bc 0%, #6a1b9a 100%)',
              boxShadow: '0 10px 24px rgba(106, 27, 154, 0.45)',
              animation: 'bounce 2.2s ease-in-out infinite',
            }}
          >
            <CelebrationIcon sx={{ fontSize: 38 }} />
          </Box>

          <Typography variant="h4" align="center" sx={{ fontWeight: 700 }}>
            Create Account
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Join Social Post and start sharing
          </Typography>

          <Collapse in={Boolean(error)} unmountOnExit>
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          </Collapse>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              helperText="At least 3 characters"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
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
              helperText="At least 6 characters"
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
            />

            {/* Real-time password strength indicator */}
            <Collapse in={form.password.length > 0} unmountOnExit>
              <Box sx={{ mt: 0.5, mb: 1, px: 0.5 }}>
                <LinearProgress
                  variant="determinate"
                  value={(strength / 4) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'rgba(0,0,0,0.08)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      bgcolor: strengthInfo.color,
                      transition: `transform 0.4s ${EASING}, background-color 0.4s ${EASING}`,
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: strengthInfo.color,
                    fontWeight: 700,
                    display: 'block',
                    mt: 0.5,
                  }}
                >
                  {strengthInfo.label && `Password strength: ${strengthInfo.label}`}
                </Typography>
              </Box>
            </Collapse>

            <TextField
              label="Confirm Password"
              name="passwordConfirm"
              type={showPassword ? 'text' : 'password'}
              value={form.passwordConfirm}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              error={showMatch && !passwordsMatch}
              helperText={
                showMatch
                  ? passwordsMatch
                    ? 'Passwords match'
                    : 'Passwords do not match'
                  : ' '
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: showMatch && (
                  <InputAdornment position="end">
                    {passwordsMatch ? (
                      <CheckCircleIcon sx={{ color: '#43a047' }} />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                  </InputAdornment>
                ),
              }}
              FormHelperTextProps={{
                sx: { color: passwordsMatch ? '#43a047' : undefined, fontWeight: 600 },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.3,
                fontSize: '1rem',
                position: 'relative',
                overflow: 'hidden',
                backgroundImage:
                  'linear-gradient(135deg, #ab47bc 0%, #6a1b9a 100%)',
                boxShadow: '0 4px 14px rgba(106, 27, 154, 0.35)',
                '&:hover': {
                  backgroundImage:
                    'linear-gradient(135deg, #9c27b0 0%, #4a148c 100%)',
                  boxShadow: '0 8px 22px rgba(106, 27, 154, 0.45)',
                },
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
                'Sign Up'
              )}
            </Button>
          </form>

          <Typography align="center" sx={{ mt: 3 }}>
            Already have an account?{' '}
            <Link
              component={RouterLink}
              to="/login"
              sx={{ fontWeight: 600, textDecoration: 'none', color: '#6a1b9a' }}
            >
              Log in
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Signup;
