import { IDataStorage } from '../interfaces/IDataStorage';
import { DbTypes } from '../types/dbTypes';
import { DB_CONSTANTS } from '../constants/dbConstants';
import { queryBuilder } from '../utils/queryBuilder';
import { dataMapper } from '../utils/dataMapper';

/**
 * Repository class for managing cell data in the Excel database
 * Implements the cell-related operations of the IDataStorage interface
 */
export class CellRepository implements IDataStorage {
  private dataStorage: IDataStorage;

  /**
   * Initializes a new instance of the CellRepository class
   * @param dataStorage An instance of IDataStorage for database operations
   */
  constructor(dataStorage: IDataStorage) {
    this.dataStorage = dataStorage;
  }

  /**
   * Creates a new cell in a worksheet
   * @param worksheetId The ID of the worksheet
   * @param cell The cell data to be created
   * @returns A promise that resolves to the created cell with assigned ID
   */
  async createCell(worksheetId: string, cell: DbTypes.CellCreate): Promise<DbTypes.Cell> {
    // Validate input parameters
    if (!worksheetId || !cell) {
      throw new Error('Invalid input parameters');
    }

    // Generate a unique ID for the new cell
    const cellId = this.generateUniqueId();

    // Prepare the cell data for insertion
    const cellData = {
      id: cellId,
      worksheetId,
      ...cell,
    };

    // Use queryBuilder to create an INSERT query
    const query = queryBuilder.insert(DB_CONSTANTS.TABLES.CELLS, cellData);

    // Execute the query using the dataStorage
    await this.dataStorage.executeQuery(query);

    // Map the result to a Cell object using dataMapper
    const createdCell = dataMapper.mapToCell(cellData);

    return createdCell;
  }

  /**
   * Retrieves a cell by its ID
   * @param id The ID of the cell to retrieve
   * @returns A promise that resolves to the cell if found, null otherwise
   */
  async getCell(id: string): Promise<DbTypes.Cell | null> {
    // Validate the input parameter
    if (!id) {
      throw new Error('Invalid cell ID');
    }

    // Use queryBuilder to create a SELECT query
    const query = queryBuilder.select(DB_CONSTANTS.TABLES.CELLS, ['*'], { id });

    // Execute the query using the dataStorage
    const result = await this.dataStorage.executeQuery(query);

    // Map the result to a Cell object using dataMapper
    const cell = result.length > 0 ? dataMapper.mapToCell(result[0]) : null;

    return cell;
  }

  /**
   * Updates an existing cell
   * @param id The ID of the cell to update
   * @param cell The updated cell data
   * @returns A promise that resolves to the updated cell
   */
  async updateCell(id: string, cell: DbTypes.CellUpdate): Promise<DbTypes.Cell> {
    // Validate the input parameters
    if (!id || !cell) {
      throw new Error('Invalid input parameters');
    }

    // Use queryBuilder to create an UPDATE query
    const query = queryBuilder.update(DB_CONSTANTS.TABLES.CELLS, cell, { id });

    // Execute the query using the dataStorage
    await this.dataStorage.executeQuery(query);

    // Fetch the updated cell data
    const updatedCell = await this.getCell(id);

    if (!updatedCell) {
      throw new Error('Failed to retrieve updated cell');
    }

    return updatedCell;
  }

  /**
   * Deletes a cell by its ID
   * @param id The ID of the cell to delete
   * @returns A promise that resolves when the cell is deleted
   */
  async deleteCell(id: string): Promise<void> {
    // Validate the input parameter
    if (!id) {
      throw new Error('Invalid cell ID');
    }

    // Use queryBuilder to create a DELETE query
    const query = queryBuilder.delete(DB_CONSTANTS.TABLES.CELLS, { id });

    // Execute the query using the dataStorage
    await this.dataStorage.executeQuery(query);
  }

  /**
   * Retrieves cells within a specified range in a worksheet
   * @param worksheetId The ID of the worksheet
   * @param startCell The starting cell address of the range
   * @param endCell The ending cell address of the range
   * @returns A promise that resolves to an array of cells within the specified range
   */
  async getCellsInRange(worksheetId: string, startCell: string, endCell: string): Promise<DbTypes.Cell[]> {
    // Validate the input parameters
    if (!worksheetId || !startCell || !endCell) {
      throw new Error('Invalid input parameters');
    }

    // Parse the startCell and endCell to determine the range
    const { startRow, startCol, endRow, endCol } = this.parseRange(startCell, endCell);

    // Use queryBuilder to create a SELECT query with range conditions
    const query = queryBuilder.select(
      DB_CONSTANTS.TABLES.CELLS,
      ['*'],
      {
        worksheetId,
        row: { $gte: startRow, $lte: endRow },
        column: { $gte: startCol, $lte: endCol },
      }
    );

    // Execute the query using the dataStorage
    const results = await this.dataStorage.executeQuery(query);

    // Map the results to Cell objects using dataMapper
    const cells = results.map(dataMapper.mapToCell);

    return cells;
  }

  /**
   * Updates multiple cells in a single operation
   * @param cells An array of cell updates
   * @returns A promise that resolves to an array of updated cells
   */
  async bulkUpdateCells(cells: DbTypes.CellUpdate[]): Promise<DbTypes.Cell[]> {
    // Validate the input parameter
    if (!Array.isArray(cells) || cells.length === 0) {
      throw new Error('Invalid input: cells must be a non-empty array');
    }

    // Begin a transaction using dataStorage.beginTransaction()
    await this.dataStorage.beginTransaction();

    try {
      // Use queryBuilder to create a batch UPDATE query
      const batchQuery = cells.map(cell => 
        queryBuilder.update(DB_CONSTANTS.TABLES.CELLS, cell, { id: cell.id })
      );

      // Execute the batch query using the dataStorage
      await this.dataStorage.executeBatchQuery(batchQuery);

      // Fetch the updated cell data
      const updatedCells = await Promise.all(
        cells.map(cell => this.getCell(cell.id))
      );

      // Commit the transaction using dataStorage.commitTransaction()
      await this.dataStorage.commitTransaction();

      // Filter out any null values (cells that weren't found)
      return updatedCells.filter((cell): cell is DbTypes.Cell => cell !== null);
    } catch (error) {
      // Rollback the transaction in case of any error
      await this.dataStorage.rollbackTransaction();
      throw error;
    }
  }

  /**
   * Generates a unique ID for a new cell
   * @returns A unique ID string
   */
  private generateUniqueId(): string {
    // Implementation depends on the specific ID generation strategy
    // This is a placeholder implementation
    return `cell_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Parses the range from start and end cell addresses
   * @param startCell The starting cell address
   * @param endCell The ending cell address
   * @returns An object with the parsed range information
   */
  private parseRange(startCell: string, endCell: string): { startRow: number; startCol: string; endRow: number; endCol: string } {
    // This is a simplified implementation. In a real-world scenario,
    // you would use a more robust parsing logic or a library like xlsx-populate
    const startMatch = startCell.match(/([A-Z]+)(\d+)/);
    const endMatch = endCell.match(/([A-Z]+)(\d+)/);

    if (!startMatch || !endMatch) {
      throw new Error('Invalid cell range format');
    }

    return {
      startCol: startMatch[1],
      startRow: parseInt(startMatch[2], 10),
      endCol: endMatch[1],
      endRow: parseInt(endMatch[2], 10),
    };
  }
}

// Human tasks:
// TODO: Implement error handling and logging for all repository methods
// TODO: Add unit tests for the CellRepository class
// TODO: Optimize the bulkUpdateCells method for large datasets
// TODO: Implement caching mechanism for frequently accessed cells