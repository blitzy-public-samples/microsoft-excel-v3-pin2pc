import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the theme object
interface Theme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  // Add more theme properties as needed
}

// Define light and dark themes
const lightTheme: Theme = {
  primaryColor: '#217346', // Excel Green
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
};

const darkTheme: Theme = {
  primaryColor: '#185ABD', // Darker shade of Excel Blue
  backgroundColor: '#1E1E1E',
  textColor: '#FFFFFF',
};

// Define the shape of the context value
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Props for the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

// ThemeProvider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Export the ThemeContext for consumers that need more control
export default ThemeContext;

// Human tasks:
// TODO: Implement proper theme persistence using local storage or user preferences API
// TODO: Ensure that the theme toggle respects the user's system preferences for dark mode