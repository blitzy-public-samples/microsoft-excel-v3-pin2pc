import axios from 'axios';
import { UserAgentApplication } from 'msal';
import { API_BASE_URL } from './api';

const AUTH_STORAGE_KEY = 'excel_auth_token';

const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID,
    authority: process.env.REACT_APP_AZURE_AUTHORITY
  }
};

const msalInstance = new UserAgentApplication(msalConfig);

export const login = async (): Promise<void> => {
  try {
    const loginResponse = await msalInstance.loginPopup();
    const accessToken = loginResponse.accessToken;
    localStorage.setItem(AUTH_STORAGE_KEY, accessToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  delete axios.defaults.headers.common['Authorization'];
  await msalInstance.logout();
  // Redirect to login page
  window.location.href = '/login';
};

export const getToken = (): string | null => {
  return localStorage.getItem(AUTH_STORAGE_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const refreshToken = async (): Promise<void> => {
  try {
    const refreshResponse = await msalInstance.acquireTokenSilent({
      scopes: ['user.read'] // Add appropriate scopes
    });
    const newAccessToken = refreshResponse.accessToken;
    localStorage.setItem(AUTH_STORAGE_KEY, newAccessToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

export const setupAuthInterceptor = (): void => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await refreshToken();
          return axios(originalRequest);
        } catch (refreshError) {
          // If refresh fails, redirect to login
          await logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

// Initialize auth interceptor
setupAuthInterceptor();

// Human tasks:
// TODO: Implement proper error handling for authentication failures
// TODO: Add support for silent token refresh to improve user experience
// TODO: Implement secure token storage mechanism (consider using HttpOnly cookies)
// TODO: Add support for multi-factor authentication
// TODO: Implement logout across all tabs/windows