import dotenv from 'dotenv';
import { DbType } from '../types/dbTypes';
import { DB_TYPES } from '../constants/dbConstants';

// Load environment variables from .env file
dotenv.config();

// Default database type to use if not specified in the environment
const DEFAULT_DB_TYPE: DbType = DB_TYPES.AZURE_SQL;

// Interface defining the structure of the database configuration object
interface DatabaseConfig {
  type: DbType;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: boolean;
  connectionTimeout: number;
  maxPoolSize: number;
}

// Object containing the database configuration settings
export const databaseConfig: DatabaseConfig = {
  type: process.env.DB_TYPE as DbType || DEFAULT_DB_TYPE,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  username: process.env.DB_USERNAME || 'sa',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'excel_db',
  ssl: process.env.DB_SSL === 'true',
  connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000', 10),
  maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '20', 10),
};

// Function to load environment variables
function loadEnv(): void {
  dotenv.config();
}

// Call loadEnv to ensure environment variables are loaded
loadEnv();

// Export the loadEnv function for use in other modules if needed
export { loadEnv };

// Human tasks (commented as requested)
/*
Human tasks:
1. Review and validate the database configuration settings to ensure they meet the security and performance requirements for the Excel application
2. Confirm that the configuration supports all necessary database types (Azure SQL, Cosmos DB, SQLite) for different environments
3. Ensure that sensitive information (e.g., passwords) are properly handled and not exposed in the configuration file
4. Verify that the configuration aligns with the infrastructure setup in Azure and local development environments
*/