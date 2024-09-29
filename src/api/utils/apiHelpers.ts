import axios from 'axios';
import { API_VERSION, BASE_URL, ENDPOINTS, STATUS_CODES, ERROR_MESSAGES } from '../constants/apiConstants';
import { ApiResponse } from '../types/apiTypes';
import { getApiConfig } from '../config/apiConfig';

/**
 * Default timeout for API requests in milliseconds
 */
export const API_TIMEOUT = 30000;

/**
 * Constructs a full API URL based on the endpoint and parameters
 * @param endpoint - The API endpoint
 * @param params - Optional query parameters
 * @returns The constructed API URL
 */
export function buildApiUrl(endpoint: string, params?: Record<string, string | number>): string {
  const baseUrl = getApiConfig().baseUrl || BASE_URL;
  let url = `${baseUrl}/${API_VERSION}${endpoint}`;

  if (params) {
    const queryString = formatQueryParams(params);
    url += `?${queryString}`;
  }

  return url;
}

/**
 * Processes the API response and formats it according to the ApiResponse interface
 * @param response - The raw API response
 * @returns The formatted API response
 */
export function handleApiResponse<T>(response: any): ApiResponse<T> {
  if (response.status >= 200 && response.status < 300) {
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } else {
    return {
      success: false,
      error: {
        message: response.data?.message || ERROR_MESSAGES.UNKNOWN_ERROR,
        code: response.status,
      },
      status: response.status,
    };
  }
}

/**
 * Handles API errors and formats them into a consistent error response
 * @param error - The error object
 * @returns The formatted error response
 */
export function handleApiError(error: any): ApiResponse<null> {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
    const message = error.response?.data?.message || error.message || ERROR_MESSAGES.UNKNOWN_ERROR;

    return {
      success: false,
      error: {
        message,
        code: status,
      },
      status,
    };
  }

  return {
    success: false,
    error: {
      message: ERROR_MESSAGES.UNKNOWN_ERROR,
      code: STATUS_CODES.INTERNAL_SERVER_ERROR,
    },
    status: STATUS_CODES.INTERNAL_SERVER_ERROR,
  };
}

/**
 * Validates the current API configuration
 * @returns True if the configuration is valid, false otherwise
 */
export function validateApiConfig(): boolean {
  const config = getApiConfig();

  if (!config.baseUrl) {
    console.error('API base URL is not set');
    return false;
  }

  if (!config.apiKey) {
    console.error('API key is not set');
    return false;
  }

  // Add more validation as needed

  return true;
}

/**
 * Formats an object of query parameters into a URL-encoded string
 * @param params - The query parameters object
 * @returns The formatted query string
 */
export function formatQueryParams(params: Record<string, string | number | boolean>): string {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
}

// Human tasks (to be addressed by developers):
// TODO: Review and test all utility functions to ensure they handle edge cases and error scenarios correctly
// TODO: Implement unit tests for each utility function in the apiHelpers file
// TODO: Consider adding more advanced error handling and logging mechanisms for API-related operations
// TODO: Evaluate the need for additional utility functions based on the API's specific requirements
// TODO: Ensure that the API_TIMEOUT constant is configurable and can be overridden by the API configuration