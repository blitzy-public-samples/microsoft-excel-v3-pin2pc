/**
 * This file contains constant values related to database operations, configurations,
 * and settings for the Excel application. These constants are used across the
 * database layer to maintain consistency and provide easy configuration management.
 */

// Default database connection timeout in milliseconds
export const DB_CONNECTION_TIMEOUT: number = 30000;

// Maximum number of connections in the database connection pool
export const MAX_POOL_SIZE: number = 20;

// Default batch size for bulk operations
export const DEFAULT_BATCH_SIZE: number = 1000;

// Object containing the names of database tables used in the application
export const TABLE_NAMES = {
    WORKBOOKS: 'Workbooks',
    WORKSHEETS: 'Worksheets',
    CELLS: 'Cells',
    FORMULAS: 'Formulas',
    CHARTS: 'Charts',
    USERS: 'Users',
    VERSIONS: 'Versions'
} as const;

// Object containing the supported database types in the application
export const DB_TYPES = {
    AZURE_SQL: 'azure_sql',
    COSMOS_DB: 'cosmos_db',
    SQLITE: 'sqlite'
} as const;

// Maximum number of retry attempts for database operations
export const MAX_RETRY_ATTEMPTS: number = 3;

// Delay between retry attempts in milliseconds
export const RETRY_DELAY: number = 1000;

// Default query timeout in milliseconds
export const QUERY_TIMEOUT: number = 60000;