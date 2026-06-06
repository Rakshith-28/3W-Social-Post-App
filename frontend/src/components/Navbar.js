import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
} from '@mui/material';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';

function Navbar({ user, onLogout }) {
  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        <DynamicFeedIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Social Feed
        </Typography>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {user.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
              variant="body1"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              {user.username}
            </Typography>
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
