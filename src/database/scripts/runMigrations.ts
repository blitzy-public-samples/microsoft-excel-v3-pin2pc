import { promises as fs } from 'fs';
import path from 'path';
import { databaseConfig } from '../config/databaseConfig';
import { IDataStorage } from '../interfaces/IDataStorage';
import { azureSqlService, azureCosmosDbService, sqliteService } from '../services';
import { migrationHelper } from '../utils/migrationHelper';

// Define the directory containing migration files
const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

/**
 * Returns the appropriate data storage service based on the database configuration
 * @param dbType The type of database to use
 * @returns An instance of the data storage service
 */
function getDataStorageService(dbType: string): IDataStorage {
  switch (dbType) {
    case 'azureSql':
      return azureSqlService;
    case 'azureCosmosDb':
      return azureCosmosDbService;
    case 'sqlite':
      return sqliteService;
    default:
      throw new Error(`Unsupported database type: ${dbType}`);
  }
}

/**
 * Executes the database migrations
 */
async function runMigrations(): Promise<void> {
  console.log('Starting database migrations...');

  try {
    const dataStorageService = getDataStorageService(databaseConfig.type);
    const pendingMigrations = await migrationHelper.getPendingMigrations(dataStorageService);

    // Sort migrations by timestamp
    pendingMigrations.sort((a, b) => a.timestamp - b.timestamp);

    for (const migration of pendingMigrations) {
      console.log(`Applying migration: ${migration.name}`);
      const migrationFile = path.join(MIGRATIONS_DIR, migration.name);
      const migrationScript = await fs.readFile(migrationFile, 'utf-8');

      try {
        await dataStorageService.executeQuery(migrationScript);
        await migrationHelper.markMigrationAsCompleted(dataStorageService, migration);
        console.log(`Migration ${migration.name} completed successfully.`);
      } catch (error) {
        console.error(`Error applying migration ${migration.name}:`, error);
        throw error; // Re-throw to stop the migration process
      }
    }

    console.log('All migrations completed successfully.');
  } catch (error) {
    console.error('Error during migration process:', error);
    throw error;
  } finally {
    // Ensure the database connection is closed
    const dataStorageService = getDataStorageService(databaseConfig.type);
    await dataStorageService.close();
  }
}

/**
 * The main function that runs the migration script
 */
async function main(): Promise<void> {
  try {
    await runMigrations();
    console.log('Migration script completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration script failed:', error);
    process.exit(1);
  }
}

// Run the main function
main();

// List of pending human tasks
/**
 * TODO: Human Tasks
 * 1. Review the migration strategy and ensure it supports all database types used in the Excel application (Required)
 * 2. Implement a rollback mechanism for failed migrations (Required)
 * 3. Add logging and monitoring to track successful and failed migrations (Required)
 * 4. Ensure that the migration script can be run safely in production environments (Critical)
 * 5. Create a strategy for handling large-scale migrations that may take a long time to execute (Required)
 */