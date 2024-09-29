import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, AccountCircle } from '@mui/icons-material';
import { theme } from '../../styles/theme';
import { useUserContext } from '../../contexts/UserContext';
import { login, logout } from '../../services/auth';

const Header: React.FC = () => {
  const { user, setUser } = useUserContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      // TODO: Implement proper error handling
    }
    handleClose();
  };

  const handleLogin = async () => {
    try {
      const loggedInUser = await login();
      setUser(loggedInUser);
    } catch (error) {
      console.error('Error logging in:', error);
      // TODO: Implement proper error handling
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Excel-like Application
        </Typography>
        <Button color="inherit">File</Button>
        <Button color="inherit">Home</Button>
        <Button color="inherit">Insert</Button>
        <Button color="inherit">Data</Button>
        <Button color="inherit">View</Button>
        {user ? (
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        ) : (
          <Button color="inherit" onClick={handleLogin}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

// TODO: Implement proper error handling for login/logout operations
// TODO: Add support for keyboard navigation in the header menu
// TODO: Implement responsive design for mobile devices
// TODO: Add localization support for menu items and user-related text