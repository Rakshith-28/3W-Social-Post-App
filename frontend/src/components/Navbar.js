import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Tooltip,
} from '@mui/material';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import LogoutIcon from '@mui/icons-material/Logout';

function Navbar({ user, onLogout }) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundImage: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 4px 20px rgba(21, 101, 192, 0.25)',
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            mr: 1.5,
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 255, 0.15)',
          }}
        >
          <DynamicFeedIcon />
        </Box>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: '-0.3px' }}
        >
          Social Feed
        </Typography>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.25,
                py: 0.5,
                borderRadius: 999,
                bgcolor: 'rgba(255, 255, 255, 0.12)',
                transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
              }}
            >
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  fontSize: 15,
                  fontWeight: 700,
                  color: 'primary.dark',
                  bgcolor: '#fff',
                }}
              >
                {user.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'block' },
                  pr: 0.5,
                }}
              >
                {user.username}
              </Typography>
            </Box>
            <Tooltip title="Log out" arrow>
              <Button
                color="inherit"
                onClick={onLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Logout
              </Button>
            </Tooltip>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
