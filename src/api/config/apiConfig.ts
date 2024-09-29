import { config } from 'dotenv';
import { SharedConfig, getConfig, updateConfig } from '../../shared/config/sharedConfig';
import { API_VERSION, BASE_URL, ENDPOINTS, RATE_LIMIT, TIMEOUT } from '../constants/apiConstants';
import { ApiResponse } from '../types/apiTypes';

// Load environment variables
config();

// Define the API configuration defaults
const API_CONFIG_DEFAULTS = {
  version: API_VERSION,
  baseUrl: BASE_URL,
  endpoints: ENDPOINTS,
  rateLimit: RATE_LIMIT,
  timeout: TIMEOUT.REQUEST_TIMEOUT_MS,
};

// Define the ApiConfig object
export const ApiConfig: SharedConfig & typeof API_CONFIG_DEFAULTS = {
  ...getConfig(),
  ...API_CONFIG_DEFAULTS,
};

/**
 * Retrieves the current API configuration settings
 * @returns The current API configuration object
 */
export function getApiConfig(): typeof ApiConfig {
  return ApiConfig;
}

/**
 * Updates the API configuration settings with new values
 * @param newConfig Partial configuration object with updated values
 * @returns The updated API configuration object
 */
export function updateApiConfig(newConfig: Partial<typeof ApiConfig>): typeof ApiConfig {
  // Merge the newConfig object with the existing ApiConfig
  const updatedConfig = { ...ApiConfig, ...newConfig };

  // Update the shared configuration if necessary
  updateConfig(updatedConfig);

  // Update the ApiConfig object
  Object.assign(ApiConfig, updatedConfig);

  return ApiConfig;
}

/**
 * Loads configuration from environment variables
 */
export function loadEnvironmentConfig(): void {
  try {
    // Load environment variables using dotenv
    config();

    // Update ApiConfig with values from environment variables
    const envConfig: Partial<typeof ApiConfig> = {
      version: process.env.API_VERSION || ApiConfig.version,
      baseUrl: process.env.API_BASE_URL || ApiConfig.baseUrl,
      rateLimit: process.env.API_RATE_LIMIT ? parseInt(process.env.API_RATE_LIMIT, 10) : ApiConfig.rateLimit,
      timeout: process.env.API_TIMEOUT ? parseInt(process.env.API_TIMEOUT, 10) : ApiConfig.timeout,
    };

    // Update the API configuration
    updateApiConfig(envConfig);

    // Validate the loaded configuration
    validateConfig();
  } catch (error) {
    console.error('Error loading environment configuration:', error);
    throw error;
  }
}

/**
 * Validates the current API configuration
 * @throws Error if the configuration is invalid
 */
function validateConfig(): void {
  // Add validation logic here
  // For example:
  if (!ApiConfig.baseUrl) {
    throw new Error('API base URL is required');
  }
  if (ApiConfig.rateLimit <= 0) {
    throw new Error('API rate limit must be greater than 0');
  }
  if (ApiConfig.timeout <= 0) {
    throw new Error('API timeout must be greater than 0');
  }
}

// Load environment configuration on module import
loadEnvironmentConfig();

// TODO: Implement proper error handling for configuration loading and updating
// TODO: Create a .env.example file with sample environment variables for API configuration
// TODO: Add JSDoc comments for each API configuration option to provide context and usage information
// TODO: Consider implementing a validation mechanism for API configuration updates
// TODO: Evaluate the need for additional API-specific configuration options based on the application's requirements