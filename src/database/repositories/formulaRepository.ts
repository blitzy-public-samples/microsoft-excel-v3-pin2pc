import { IDataStorage } from '../interfaces/IDataStorage';
import { DbTypes } from '../types/dbTypes';
import { DB_CONSTANTS } from '../constants/dbConstants';
import { queryBuilder } from '../utils/queryBuilder';
import { dataMapper } from '../utils/dataMapper';

export class FormulaRepository {
  private dataStorage: IDataStorage;

  constructor(dataStorage: IDataStorage) {
    this.dataStorage = dataStorage;
  }

  async createFormula(formula: DbTypes.FormulaCreate): Promise<DbTypes.Formula> {
    try {
      // Validate the input formula data
      this.validateFormulaData(formula);

      // Use queryBuilder to create an INSERT query
      const query = queryBuilder.buildInsertQuery(DB_CONSTANTS.TABLES.FORMULAS, formula);

      // Execute the query using dataStorage.createFormula
      const result = await this.dataStorage.createFormula(query);

      // Map the result to a Formula object using dataMapper
      return dataMapper.mapToFormula(result);
    } catch (error) {
      console.error('Error creating formula:', error);
      throw error;
    }
  }

  async getFormula(id: string): Promise<DbTypes.Formula | null> {
    try {
      // Validate the input ID
      this.validateId(id);

      // Use queryBuilder to create a SELECT query
      const query = queryBuilder.buildSelectQuery(DB_CONSTANTS.TABLES.FORMULAS, { id });

      // Execute the query using dataStorage.getFormula
      const result = await this.dataStorage.getFormula(query);

      // Map the result to a Formula object using dataMapper if found
      return result ? dataMapper.mapToFormula(result) : null;
    } catch (error) {
      console.error('Error getting formula:', error);
      throw error;
    }
  }

  async updateFormula(id: string, formula: DbTypes.FormulaUpdate): Promise<DbTypes.Formula> {
    try {
      // Validate the input ID and formula data
      this.validateId(id);
      this.validateFormulaData(formula);

      // Use queryBuilder to create an UPDATE query
      const query = queryBuilder.buildUpdateQuery(DB_CONSTANTS.TABLES.FORMULAS, { id }, formula);

      // Execute the query using dataStorage.updateFormula
      const result = await this.dataStorage.updateFormula(query);

      // Map the result to a Formula object using dataMapper
      return dataMapper.mapToFormula(result);
    } catch (error) {
      console.error('Error updating formula:', error);
      throw error;
    }
  }

  async deleteFormula(id: string): Promise<void> {
    try {
      // Validate the input ID
      this.validateId(id);

      // Use queryBuilder to create a DELETE query
      const query = queryBuilder.buildDeleteQuery(DB_CONSTANTS.TABLES.FORMULAS, { id });

      // Execute the query using dataStorage.deleteFormula
      await this.dataStorage.deleteFormula(query);
    } catch (error) {
      console.error('Error deleting formula:', error);
      throw error;
    }
  }

  async getFormulasByCellId(cellId: string): Promise<DbTypes.Formula[]> {
    try {
      // Validate the input cellId
      this.validateId(cellId);

      // Use queryBuilder to create a SELECT query with a WHERE clause for the cellId
      const query = queryBuilder.buildSelectQuery(DB_CONSTANTS.TABLES.FORMULAS, { cellId });

      // Execute the query using a custom method on dataStorage
      const results = await this.dataStorage.getFormulasByCellId(query);

      // Map the results to Formula objects using dataMapper
      return results.map(dataMapper.mapToFormula);
    } catch (error) {
      console.error('Error getting formulas by cell ID:', error);
      throw error;
    }
  }

  private validateFormulaData(formula: DbTypes.FormulaCreate | DbTypes.FormulaUpdate): void {
    // Implement validation logic for formula data
    if (!formula || typeof formula !== 'object') {
      throw new Error('Invalid formula data');
    }
    // Add more specific validation rules as needed
  }

  private validateId(id: string): void {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid ID');
    }
  }
}

// Human tasks:
// TODO: Implement error handling and logging for database operations
// TODO: Add input validation for all public methods to ensure data integrity
// TODO: Implement caching mechanism for frequently accessed formulas to improve performance
// TODO: Add unit tests for all public methods of the FormulaRepository class