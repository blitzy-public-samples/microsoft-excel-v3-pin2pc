import React from 'react';
import { CssBaseline, Box } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import { SpreadsheetProvider } from './contexts/SpreadsheetContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import Grid from './components/Spreadsheet/Grid';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <SpreadsheetProvider>
          <CssBaseline />
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Header />
            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
              <Sidebar />
              <Box sx={{ flexGrow: 1, overflow: 'auto', padding: 2 }}>
                <Grid />
              </Box>
            </Box>
            <Footer />
          </Box>
        </SpreadsheetProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;

// Human tasks:
// TODO: Implement proper error boundaries for the application (Required)
// TODO: Add support for routing if multiple pages are required (Optional)
// TODO: Implement lazy loading for performance optimization (Optional)
// TODO: Add global keyboard shortcut handling (Required)