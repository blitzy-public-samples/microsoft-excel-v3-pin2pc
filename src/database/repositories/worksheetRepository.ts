import { IDataStorage } from '../interfaces/IDataStorage';
import { DbTypes } from '../types/dbTypes';
import { DB_CONSTANTS } from '../constants/dbConstants';

/**
 * Repository class for managing worksheet-related database operations
 */
export class WorksheetRepository {
  private dataStorage: IDataStorage;

  /**
   * Initializes a new instance of the WorksheetRepository class
   * @param dataStorage An instance of IDataStorage for database operations
   */
  constructor(dataStorage: IDataStorage) {
    this.dataStorage = dataStorage;
  }

  /**
   * Creates a new worksheet in the specified workbook
   * @param workbookId The ID of the workbook to create the worksheet in
   * @param worksheet The worksheet data to create
   * @returns A promise that resolves to the created worksheet with assigned ID
   */
  async createWorksheet(workbookId: string, worksheet: DbTypes.WorksheetCreate): Promise<DbTypes.Worksheet> {
    return this.dataStorage.createWorksheet(workbookId, worksheet);
  }

  /**
   * Retrieves a worksheet by its ID
   * @param id The ID of the worksheet to retrieve
   * @returns A promise that resolves to the worksheet if found, null otherwise
   */
  async getWorksheet(id: string): Promise<DbTypes.Worksheet | null> {
    return this.dataStorage.getWorksheet(id);
  }

  /**
   * Updates an existing worksheet
   * @param id The ID of the worksheet to update
   * @param worksheet The updated worksheet data
   * @returns A promise that resolves to the updated worksheet
   */
  async updateWorksheet(id: string, worksheet: DbTypes.WorksheetUpdate): Promise<DbTypes.Worksheet> {
    return this.dataStorage.updateWorksheet(id, worksheet);
  }

  /**
   * Deletes a worksheet by its ID
   * @param id The ID of the worksheet to delete
   * @returns A promise that resolves when the worksheet is deleted
   */
  async deleteWorksheet(id: string): Promise<void> {
    return this.dataStorage.deleteWorksheet(id);
  }

  /**
   * Retrieves all worksheets for a given workbook
   * @param workbookId The ID of the workbook to retrieve worksheets for
   * @returns A promise that resolves to an array of worksheets belonging to the specified workbook
   */
  async getWorksheetsByWorkbookId(workbookId: string): Promise<DbTypes.Worksheet[]> {
    // Assuming IDataStorage has a method to fetch worksheets by workbook ID
    return this.dataStorage.getWorksheetsByWorkbookId(workbookId);
  }

  /**
   * Renames a worksheet
   * @param id The ID of the worksheet to rename
   * @param newName The new name for the worksheet
   * @returns A promise that resolves to the updated worksheet with the new name
   */
  async renameWorksheet(id: string, newName: string): Promise<DbTypes.Worksheet> {
    const worksheet = await this.getWorksheet(id);
    if (!worksheet) {
      throw new Error(`Worksheet with ID ${id} not found`);
    }
    const updateObject: DbTypes.WorksheetUpdate = { name: newName };
    return this.updateWorksheet(id, updateObject);
  }
}

// TODO: Implement error handling and input validation for all repository methods
// TODO: Add logging for all database operations to aid in debugging and monitoring
// TODO: Implement caching mechanisms to improve performance for frequently accessed worksheets
// TODO: Consider adding batch operations for creating or updating multiple worksheets at once