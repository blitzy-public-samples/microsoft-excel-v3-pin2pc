import dotenv from 'dotenv';
import { getEnvironment } from '../config/environment';

// Load environment variables
dotenv.config();

// Define the database configuration interface
interface DatabaseConfig {
  azureSql: {
    server: string;
    database: string;
    user: string;
    password: string;
    options: {
      encrypt: boolean;
      enableArithAbort: boolean;
    };
  };
  azureCosmosDb: {
    endpoint: string;
    key: string;
    databaseId: string;
  };
  azureBlobStorage: {
    connectionString: string;
    containerName: string;
  };
}

// Define the database configurations for different environments
const DATABASE_CONFIG: Record<string, DatabaseConfig> = {
  development: {
    azureSql: {
      server: process.env.DEV_AZURE_SQL_SERVER || '',
      database: process.env.DEV_AZURE_SQL_DATABASE || '',
      user: process.env.DEV_AZURE_SQL_USER || '',
      password: process.env.DEV_AZURE_SQL_PASSWORD || '',
      options: {
        encrypt: true,
        enableArithAbort: true
      }
    },
    azureCosmosDb: {
      endpoint: process.env.DEV_COSMOS_DB_ENDPOINT || '',
      key: process.env.DEV_COSMOS_DB_KEY || '',
      databaseId: process.env.DEV_COSMOS_DB_DATABASE_ID || ''
    },
    azureBlobStorage: {
      connectionString: process.env.DEV_BLOB_STORAGE_CONNECTION_STRING || '',
      containerName: process.env.DEV_BLOB_STORAGE_CONTAINER_NAME || ''
    }
  },
  staging: {
    azureSql: {
      server: process.env.STAGING_AZURE_SQL_SERVER || '',
      database: process.env.STAGING_AZURE_SQL_DATABASE || '',
      user: process.env.STAGING_AZURE_SQL_USER || '',
      password: process.env.STAGING_AZURE_SQL_PASSWORD || '',
      options: {
        encrypt: true,
        enableArithAbort: true
      }
    },
    azureCosmosDb: {
      endpoint: process.env.STAGING_COSMOS_DB_ENDPOINT || '',
      key: process.env.STAGING_COSMOS_DB_KEY || '',
      databaseId: process.env.STAGING_COSMOS_DB_DATABASE_ID || ''
    },
    azureBlobStorage: {
      connectionString: process.env.STAGING_BLOB_STORAGE_CONNECTION_STRING || '',
      containerName: process.env.STAGING_BLOB_STORAGE_CONTAINER_NAME || ''
    }
  },
  production: {
    azureSql: {
      server: process.env.PROD_AZURE_SQL_SERVER || '',
      database: process.env.PROD_AZURE_SQL_DATABASE || '',
      user: process.env.PROD_AZURE_SQL_USER || '',
      password: process.env.PROD_AZURE_SQL_PASSWORD || '',
      options: {
        encrypt: true,
        enableArithAbort: true
      }
    },
    azureCosmosDb: {
      endpoint: process.env.PROD_COSMOS_DB_ENDPOINT || '',
      key: process.env.PROD_COSMOS_DB_KEY || '',
      databaseId: process.env.PROD_COSMOS_DB_DATABASE_ID || ''
    },
    azureBlobStorage: {
      connectionString: process.env.PROD_BLOB_STORAGE_CONNECTION_STRING || '',
      containerName: process.env.PROD_BLOB_STORAGE_CONTAINER_NAME || ''
    }
  }
};

/**
 * Retrieves the database configuration based on the current environment
 * @returns {DatabaseConfig} The database configuration object for the current environment
 */
export function getDatabaseConfig(): DatabaseConfig {
  const environment = getEnvironment();
  return DATABASE_CONFIG[environment];
}

// List of human tasks
/**
 * Human Tasks:
 * 1. Set up environment variables for database configurations in development, staging, and production environments
 * 2. Review and adjust database connection settings for each environment
 * 3. Implement proper secret management for database credentials
 */