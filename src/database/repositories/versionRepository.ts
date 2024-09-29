import { IDataStorage } from '../interfaces/IDataStorage';
import { DbTypes } from '../types/dbTypes';
import { DB_CONSTANTS } from '../constants/dbConstants';
import Version from '../models/version';
import { queryBuilder } from '../utils/queryBuilder';
import { dataMapper } from '../utils/dataMapper';

export class VersionRepository {
  private dataStorage: IDataStorage;

  constructor(dataStorage: IDataStorage) {
    this.dataStorage = dataStorage;
  }

  async createVersion(versionData: DbTypes.VersionCreate): Promise<DbTypes.Version> {
    // Validate the versionData
    this.validateVersionData(versionData);

    // Use queryBuilder to construct the create query
    const query = queryBuilder.buildInsertQuery(DB_CONSTANTS.TABLES.VERSIONS, versionData);

    // Execute the query using dataStorage.createVersion
    const result = await this.dataStorage.createVersion(query, versionData);

    // Map the result to a Version object using dataMapper
    return dataMapper.mapToVersion(result);
  }

  async getVersions(workbookId: string): Promise<DbTypes.Version[]> {
    // Use queryBuilder to construct the query for fetching versions
    const query = queryBuilder.buildSelectQuery(DB_CONSTANTS.TABLES.VERSIONS, {
      workbookId: workbookId
    });

    // Execute the query using dataStorage.getVersions
    const results = await this.dataStorage.getVersions(query);

    // Map the results to Version objects using dataMapper
    return results.map(result => dataMapper.mapToVersion(result));
  }

  async getVersion(workbookId: string, versionNumber: number): Promise<DbTypes.Version | null> {
    // Use queryBuilder to construct the query for fetching a specific version
    const query = queryBuilder.buildSelectQuery(DB_CONSTANTS.TABLES.VERSIONS, {
      workbookId: workbookId,
      versionNumber: versionNumber
    });

    // Execute the query using dataStorage.getVersion
    const result = await this.dataStorage.getVersion(query);

    // Map the result to a Version object using dataMapper if found
    return result ? dataMapper.mapToVersion(result) : null;
  }

  async deleteVersion(versionId: string): Promise<void> {
    // Use queryBuilder to construct the delete query
    const query = queryBuilder.buildDeleteQuery(DB_CONSTANTS.TABLES.VERSIONS, {
      id: versionId
    });

    // Execute the query using dataStorage.deleteVersion
    await this.dataStorage.deleteVersion(query);

    // Note: Updating the workbook's versions array should be handled in a separate service
    // that manages the relationship between workbooks and versions
  }

  async getLatestVersion(workbookId: string): Promise<DbTypes.Version | null> {
    // Use queryBuilder to construct a query for fetching the latest version
    const query = queryBuilder.buildSelectQuery(
      DB_CONSTANTS.TABLES.VERSIONS,
      { workbookId: workbookId },
      { orderBy: 'versionNumber', order: 'DESC', limit: 1 }
    );

    // Execute the query using dataStorage.getVersions with a limit of 1 and sorted by versionNumber in descending order
    const results = await this.dataStorage.getVersions(query);

    // Map the result to a Version object using dataMapper if found
    return results.length > 0 ? dataMapper.mapToVersion(results[0]) : null;
  }

  async restoreVersion(workbookId: string, versionNumber: number): Promise<DbTypes.Version> {
    // Retrieve the specified version
    const versionToRestore = await this.getVersion(workbookId, versionNumber);

    if (!versionToRestore) {
      throw new Error(`Version ${versionNumber} not found for workbook ${workbookId}`);
    }

    // Create a new version with the state of the specified version
    const newVersionData: DbTypes.VersionCreate = {
      workbookId: workbookId,
      versionNumber: await this.getNextVersionNumber(workbookId),
      state: versionToRestore.state,
      timestamp: new Date(),
      userId: versionToRestore.userId, // You might want to update this to the current user
      description: `Restored from version ${versionNumber}`
    };

    // Create the new version
    const restoredVersion = await this.createVersion(newVersionData);

    // Note: Updating the workbook with the restored state should be handled in a separate service
    // that manages the relationship between workbooks and versions

    return restoredVersion;
  }

  private async getNextVersionNumber(workbookId: string): Promise<number> {
    const latestVersion = await this.getLatestVersion(workbookId);
    return latestVersion ? latestVersion.versionNumber + 1 : 1;
  }

  private validateVersionData(versionData: DbTypes.VersionCreate): void {
    if (!versionData.workbookId) {
      throw new Error('WorkbookId is required');
    }
    if (!versionData.state) {
      throw new Error('Version state is required');
    }
    if (!versionData.userId) {
      throw new Error('UserId is required');
    }
    // Add more validations as needed
  }
}

// Human tasks (commented as requested):
/*
TODO: Implement efficient delta compression for storing version states
TODO: Add a mechanism to clean up old versions based on a configurable retention policy
TODO: Implement access control checks in the repository methods to ensure only authorized users can perform version operations
TODO: Add comprehensive error handling and logging for all repository methods
TODO: Optimize queries for large-scale version management, possibly implementing pagination for getVersions method
*/