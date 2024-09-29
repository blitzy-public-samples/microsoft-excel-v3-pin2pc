import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import { i18n } from './localization/i18n';

/**
 * Renders the root App component with necessary providers
 */
const renderApp = () => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  
  root.render(
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </React.StrictMode>
  );
};

// Initialize the app
renderApp();

// Hot Module Replacement (HMR) for development
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App', renderApp);
}

// TODO: Implement error tracking and reporting service integration
// TODO: Add performance monitoring
// TODO: Implement service worker for offline capabilities

/**
 * This file serves as the entry point for the React application.
 * It sets up the necessary providers and renders the root App component.
 * 
 * Human tasks:
 * 1. Implement error tracking and reporting service integration (Required)
 * 2. Add performance monitoring (Optional)
 * 3. Implement service worker for offline capabilities (Optional)
 */