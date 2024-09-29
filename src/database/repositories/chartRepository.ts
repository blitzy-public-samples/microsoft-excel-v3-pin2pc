import { IDataStorage } from '../interfaces/IDataStorage';
import { DbTypes } from '../types/dbTypes';
import { DB_CONSTANTS } from '../constants/dbConstants';

/**
 * Repository class for managing chart entities in the Excel database
 */
export class ChartRepository {
  private dataStorage: IDataStorage;

  /**
   * Initializes a new instance of the ChartRepository class
   * @param dataStorage The data storage service to use for database operations
   */
  constructor(dataStorage: IDataStorage) {
    this.dataStorage = dataStorage;
  }

  /**
   * Creates a new chart in the database
   * @param worksheetId The ID of the worksheet to which the chart belongs
   * @param chart The chart data to create
   * @returns A promise that resolves to the created chart with assigned ID
   */
  async createChart(worksheetId: string, chart: DbTypes.ChartCreate): Promise<DbTypes.Chart> {
    try {
      return await this.dataStorage.createChart(worksheetId, chart);
    } catch (error) {
      console.error('Error creating chart:', error);
      throw new Error('Failed to create chart');
    }
  }

  /**
   * Retrieves a chart by its ID
   * @param id The ID of the chart to retrieve
   * @returns A promise that resolves to the chart if found, null otherwise
   */
  async getChart(id: string): Promise<DbTypes.Chart | null> {
    try {
      return await this.dataStorage.getChart(id);
    } catch (error) {
      console.error('Error getting chart:', error);
      throw new Error('Failed to retrieve chart');
    }
  }

  /**
   * Updates an existing chart
   * @param id The ID of the chart to update
   * @param chart The updated chart data
   * @returns A promise that resolves to the updated chart
   */
  async updateChart(id: string, chart: DbTypes.ChartUpdate): Promise<DbTypes.Chart> {
    try {
      return await this.dataStorage.updateChart(id, chart);
    } catch (error) {
      console.error('Error updating chart:', error);
      throw new Error('Failed to update chart');
    }
  }

  /**
   * Deletes a chart by its ID
   * @param id The ID of the chart to delete
   * @returns A promise that resolves when the chart is deleted
   */
  async deleteChart(id: string): Promise<void> {
    try {
      await this.dataStorage.deleteChart(id);
    } catch (error) {
      console.error('Error deleting chart:', error);
      throw new Error('Failed to delete chart');
    }
  }

  /**
   * Retrieves all charts for a given worksheet
   * @param worksheetId The ID of the worksheet
   * @returns A promise that resolves to an array of charts associated with the worksheet
   */
  async getChartsByWorksheet(worksheetId: string): Promise<DbTypes.Chart[]> {
    try {
      // Assuming the IDataStorage interface has a method for this operation
      // If not, you may need to implement a custom query or filter
      return await this.dataStorage.getChartsByWorksheet(worksheetId);
    } catch (error) {
      console.error('Error getting charts by worksheet:', error);
      throw new Error('Failed to retrieve charts for worksheet');
    }
  }
}

// Human tasks (commented):
// TODO: Implement error handling and logging for all repository methods (Required)
// TODO: Add input validation for all method parameters (Required)
// TODO: Implement caching mechanism for frequently accessed charts to improve performance (Optional)
// TODO: Add method to bulk create/update/delete charts for improved efficiency in batch operations (Optional)
// TODO: Implement versioning support for charts if not handled at the storage level (Optional)