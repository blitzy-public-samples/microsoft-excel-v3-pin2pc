import { IDataStorage } from '../interfaces/IDataStorage';
import { DbTypes } from '../types/dbTypes';
import { DB_CONSTANTS } from '../constants/dbConstants';
import { queryBuilder } from '../utils/queryBuilder';
import { dataMapper } from '../utils/dataMapper';

/**
 * Repository class for managing workbook data in the database
 * Implements partial IDataStorage interface for workbook-related operations
 */
export class WorkbookRepository implements Partial<IDataStorage> {
  private dataStorage: IDataStorage;

  /**
   * Initializes a new instance of the WorkbookRepository class
   * @param dataStorage - An instance of IDataStorage for database operations
   */
  constructor(dataStorage: IDataStorage) {
    this.dataStorage = dataStorage;
  }

  /**
   * Creates a new workbook in the storage
   * @param workbook - The workbook data to be created
   * @returns A promise that resolves to the created workbook with assigned ID
   */
  async createWorkbook(workbook: DbTypes.WorkbookCreate): Promise<DbTypes.Workbook> {
    // Validate the workbook data
    this.validateWorkbookData(workbook);

    // Generate a unique ID for the workbook
    const id = this.generateUniqueId();

    // Use queryBuilder to create an INSERT query
    const query = queryBuilder.insert(DB_CONSTANTS.TABLES.WORKBOOKS, { ...workbook, id });

    // Execute the query using the dataStorage
    const result = await this.dataStorage.executeQuery(query);

    // Map the result to a Workbook object using dataMapper
    const createdWorkbook = dataMapper.toWorkbook(result);

    return createdWorkbook;
  }

  /**
   * Retrieves a workbook by its ID
   * @param id - The ID of the workbook to retrieve
   * @returns A promise that resolves to the workbook if found, null otherwise
   */
  async getWorkbook(id: string): Promise<DbTypes.Workbook | null> {
    // Validate the workbook ID
    this.validateWorkbookId(id);

    // Use queryBuilder to create a SELECT query
    const query = queryBuilder.select(DB_CONSTANTS.TABLES.WORKBOOKS, ['*'], { id });

    // Execute the query using the dataStorage
    const result = await this.dataStorage.executeQuery(query);

    // Map the result to a Workbook object using dataMapper
    const workbook = dataMapper.toWorkbook(result[0]);

    return workbook || null;
  }

  /**
   * Updates an existing workbook
   * @param id - The ID of the workbook to update
   * @param workbook - The updated workbook data
   * @returns A promise that resolves to the updated workbook
   */
  async updateWorkbook(id: string, workbook: DbTypes.WorkbookUpdate): Promise<DbTypes.Workbook> {
    // Validate the workbook ID and update data
    this.validateWorkbookId(id);
    this.validateWorkbookData(workbook);

    // Use queryBuilder to create an UPDATE query
    const query = queryBuilder.update(DB_CONSTANTS.TABLES.WORKBOOKS, workbook, { id });

    // Execute the query using the dataStorage
    await this.dataStorage.executeQuery(query);

    // Fetch the updated workbook using getWorkbook
    const updatedWorkbook = await this.getWorkbook(id);

    if (!updatedWorkbook) {
      throw new Error(`Workbook with id ${id} not found after update`);
    }

    return updatedWorkbook;
  }

  /**
   * Deletes a workbook by its ID
   * @param id - The ID of the workbook to delete
   * @returns A promise that resolves when the workbook is deleted
   */
  async deleteWorkbook(id: string): Promise<void> {
    // Validate the workbook ID
    this.validateWorkbookId(id);

    // Use queryBuilder to create a DELETE query
    const query = queryBuilder.delete(DB_CONSTANTS.TABLES.WORKBOOKS, { id });

    // Execute the query using the dataStorage
    await this.dataStorage.executeQuery(query);
  }

  /**
   * Retrieves all workbooks owned by a specific user
   * @param userId - The ID of the user
   * @returns A promise that resolves to an array of workbooks owned by the user
   */
  async getWorkbooksByUser(userId: string): Promise<DbTypes.Workbook[]> {
    // Validate the user ID
    this.validateUserId(userId);

    // Use queryBuilder to create a SELECT query with a WHERE clause for the user ID
    const query = queryBuilder.select(DB_CONSTANTS.TABLES.WORKBOOKS, ['*'], { ownerId: userId });

    // Execute the query using the dataStorage
    const results = await this.dataStorage.executeQuery(query);

    // Map the results to Workbook objects using dataMapper
    const workbooks = results.map(dataMapper.toWorkbook);

    return workbooks;
  }

  /**
   * Retrieves all workbooks shared with a specific user
   * @param userId - The ID of the user
   * @returns A promise that resolves to an array of workbooks shared with the user
   */
  async getSharedWorkbooks(userId: string): Promise<DbTypes.Workbook[]> {
    // Validate the user ID
    this.validateUserId(userId);

    // Use queryBuilder to create a SELECT query joining the workbooks and shared_workbooks tables
    const query = queryBuilder.selectJoin(
      DB_CONSTANTS.TABLES.WORKBOOKS,
      DB_CONSTANTS.TABLES.SHARED_WORKBOOKS,
      ['workbooks.*'],
      { 'shared_workbooks.userId': userId },
      'workbooks.id = shared_workbooks.workbookId'
    );

    // Execute the query using the dataStorage
    const results = await this.dataStorage.executeQuery(query);

    // Map the results to Workbook objects using dataMapper
    const sharedWorkbooks = results.map(dataMapper.toWorkbook);

    return sharedWorkbooks;
  }

  // Helper methods for validation

  private validateWorkbookData(workbook: DbTypes.WorkbookCreate | DbTypes.WorkbookUpdate): void {
    // Add validation logic here
    if (!workbook.name || workbook.name.trim() === '') {
      throw new Error('Workbook name is required');
    }
    // Add more validation as needed
  }

  private validateWorkbookId(id: string): void {
    if (!id || id.trim() === '') {
      throw new Error('Invalid workbook ID');
    }
  }

  private validateUserId(userId: string): void {
    if (!userId || userId.trim() === '') {
      throw new Error('Invalid user ID');
    }
  }

  private generateUniqueId(): string {
    // Implement a method to generate a unique ID (e.g., UUID)
    return 'generated-unique-id'; // Replace with actual implementation
  }
}

// Human tasks:
// TODO: Implement proper error handling and logging for database operations
// TODO: Add unit tests for the WorkbookRepository class
// TODO: Implement caching mechanism for frequently accessed workbooks
// TODO: Review and optimize database queries for performance