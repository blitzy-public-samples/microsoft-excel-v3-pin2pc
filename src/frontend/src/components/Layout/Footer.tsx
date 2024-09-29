import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { theme } from '../../styles/theme';
import { useUserContext } from '../../contexts/UserContext';

const Footer: React.FC = () => {
  const { user } = useUserContext();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2),
        marginTop: 'auto',
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        &copy; {new Date().getFullYear()} Microsoft Excel-like Application
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: theme.spacing(1),
        }}
      >
        <Link
          href="/privacy"
          color="inherit"
          sx={{ mx: 1 }}
          underline="hover"
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          color="inherit"
          sx={{ mx: 1 }}
          underline="hover"
        >
          Terms of Service
        </Link>
      </Box>
      <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 1 }}>
        Version: 1.0.0 {user && `| User: ${user.name}`}
      </Typography>
    </Box>
  );
};

export default Footer;

// Human tasks:
// TODO: Implement proper routing for footer links (Required)
// TODO: Add localization support for footer text and links (Optional)
// TODO: Implement responsive design for mobile devices (Required)
// TODO: Add accessibility features (e.g., proper ARIA labels) (Required)