import dotenv from 'dotenv';

// Enum of valid environment names
export const ENVIRONMENTS = ['development', 'staging', 'production'] as const;
type Environment = typeof ENVIRONMENTS[number];

// Configuration object for different environments
export const CONFIG: Record<Environment, {
  apiUrl: string;
  logLevel: string;
  maxFileSize: number;
}> = {
  development: {
    apiUrl: 'http://localhost:3000',
    logLevel: 'debug',
    maxFileSize: 10485760 // 10MB
  },
  staging: {
    apiUrl: 'https://staging-api.excel.com',
    logLevel: 'info',
    maxFileSize: 20971520 // 20MB
  },
  production: {
    apiUrl: 'https://api.excel.com',
    logLevel: 'warn',
    maxFileSize: 52428800 // 50MB
  }
};

/**
 * Loads environment variables from a .env file
 */
export function loadEnvironment(): void {
  const result = dotenv.config();

  if (result.error) {
    throw new Error('Failed to load .env file');
  }

  // Check if required environment variables are set
  const requiredEnvVars = ['NODE_ENV', 'DATABASE_URL', 'JWT_SECRET'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
}

/**
 * Retrieves the current environment (development, staging, or production)
 * @returns Current environment name
 */
export function getEnvironment(): Environment {
  const env = process.env.NODE_ENV as Environment;
  return ENVIRONMENTS.includes(env) ? env : 'development';
}

/**
 * Retrieves the configuration object for the current environment
 * @returns Configuration object for the current environment
 */
export function getConfig() {
  const env = getEnvironment();
  return CONFIG[env];
}

// Load environment variables when this module is imported
loadEnvironment();

// Export the current environment and configuration
export const currentEnvironment = getEnvironment();
export const currentConfig = getConfig();

// Human tasks (commented)
/*
TODO: Human tasks
- Set up .env file with necessary environment variables (Critical)
- Review and adjust configuration settings for each environment (Required)
- Implement proper secret management for sensitive configuration values (Critical)
- Ensure all team members have access to the required environment variables for local development (Required)
*/