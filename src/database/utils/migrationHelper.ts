import { IDataStorage } from '../interfaces/IDataStorage';
import { DbTypes } from '../types/dbTypes';
import { DB_CONSTANTS } from '../constants/dbConstants';
import { v4 as uuidv4 } from 'uuid';

/**
 * Applies a single migration to the database
 * @param dataStorage The data storage instance
 * @param migration The migration to apply
 */
export async function applyMigration(dataStorage: IDataStorage, migration: DbTypes.Migration): Promise<void> {
    try {
        await dataStorage.beginTransaction();
        await migration.up(dataStorage);
        await updateVersion(dataStorage, migration.version);
        await dataStorage.commitTransaction();
    } catch (error) {
        await dataStorage.rollbackTransaction();
        throw error;
    }
}

/**
 * Rolls back a single migration in the database
 * @param dataStorage The data storage instance
 * @param migration The migration to roll back
 */
export async function rollbackMigration(dataStorage: IDataStorage, migration: DbTypes.Migration): Promise<void> {
    try {
        await dataStorage.beginTransaction();
        await migration.down(dataStorage);
        await updateVersion(dataStorage, getPreviousVersion(migration.version));
        await dataStorage.commitTransaction();
    } catch (error) {
        await dataStorage.rollbackTransaction();
        throw error;
    }
}

/**
 * Retrieves the current database schema version
 * @param dataStorage The data storage instance
 * @returns The current database schema version
 */
export async function getCurrentVersion(dataStorage: IDataStorage): Promise<string> {
    const result = await dataStorage.query(DB_CONSTANTS.QUERIES.GET_CURRENT_VERSION);
    return result.length > 0 ? result[0].version : '0';
}

/**
 * Updates the database schema version
 * @param dataStorage The data storage instance
 * @param newVersion The new version to set
 */
export async function updateVersion(dataStorage: IDataStorage, newVersion: string): Promise<void> {
    const currentVersion = await getCurrentVersion(dataStorage);
    if (currentVersion === '0') {
        await dataStorage.query(DB_CONSTANTS.QUERIES.INSERT_VERSION, [newVersion, uuidv4()]);
    } else {
        await dataStorage.query(DB_CONSTANTS.QUERIES.UPDATE_VERSION, [newVersion]);
    }
}

/**
 * Executes all pending migrations in order
 * @param dataStorage The data storage instance
 * @param migrations The array of migrations to execute
 */
export async function executeMigrations(dataStorage: IDataStorage, migrations: DbTypes.Migration[]): Promise<void> {
    const currentVersion = await getCurrentVersion(dataStorage);
    const pendingMigrations = migrations
        .filter(migration => compareVersions(migration.version, currentVersion) > 0)
        .sort((a, b) => compareVersions(a.version, b.version));

    for (const migration of pendingMigrations) {
        await applyMigration(dataStorage, migration);
    }
}

/**
 * Compares two version strings
 * @param versionA The first version string
 * @param versionB The second version string
 * @returns A number indicating the relationship between the versions
 */
function compareVersions(versionA: string, versionB: string): number {
    const partsA = versionA.split('.').map(Number);
    const partsB = versionB.split('.').map(Number);

    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const partA = partsA[i] || 0;
        const partB = partsB[i] || 0;
        if (partA > partB) return 1;
        if (partA < partB) return -1;
    }

    return 0;
}

/**
 * Gets the previous version string
 * @param version The current version string
 * @returns The previous version string
 */
function getPreviousVersion(version: string): string {
    const parts = version.split('.').map(Number);
    for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i] > 0) {
            parts[i]--;
            break;
        }
        parts[i] = 9;
    }
    return parts.join('.');
}

// Human tasks:
// TODO: Implement proper error handling and logging for migration processes
// TODO: Develop a strategy for handling migration conflicts in collaborative environments
// TODO: Create a mechanism for backing up data before applying migrations
// TODO: Design a system for managing and versioning migration scripts