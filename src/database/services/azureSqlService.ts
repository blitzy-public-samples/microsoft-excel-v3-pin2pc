import { ConnectionPool, Transaction } from 'mssql';
import { config } from '../config/databaseConfig';
import { IDataStorage } from '../interfaces/IDataStorage';
import { DbTypes } from '../types/dbTypes';
import { DB_CONSTANTS } from '../constants/dbConstants';
import { queryBuilder } from '../utils/queryBuilder';
import { dataMapper } from '../utils/dataMapper';

export class AzureSqlService implements IDataStorage {
  private pool: ConnectionPool;
  private transaction: Transaction | null = null;

  constructor() {
    this.pool = new ConnectionPool(config);
    // Initialize the connection pool
    this.pool.connect().catch((err) => {
      console.error('Error connecting to Azure SQL Database:', err);
    });
  }

  async createWorkbook(workbook: DbTypes.WorkbookCreate): Promise<DbTypes.Workbook> {
    try {
      const query = queryBuilder.createWorkbook(workbook);
      const result = await this.pool.request().query(query);
      return dataMapper.toWorkbook(result.recordset[0]);
    } catch (error) {
      console.error('Error creating workbook:', error);
      throw error;
    }
  }

  async getWorkbook(id: string): Promise<DbTypes.Workbook | null> {
    try {
      const query = queryBuilder.getWorkbook(id);
      const result = await this.pool.request().query(query);
      return result.recordset[0] ? dataMapper.toWorkbook(result.recordset[0]) : null;
    } catch (error) {
      console.error('Error getting workbook:', error);
      throw error;
    }
  }

  async updateWorkbook(id: string, workbook: DbTypes.WorkbookUpdate): Promise<DbTypes.Workbook> {
    try {
      const query = queryBuilder.updateWorkbook(id, workbook);
      const result = await this.pool.request().query(query);
      return dataMapper.toWorkbook(result.recordset[0]);
    } catch (error) {
      console.error('Error updating workbook:', error);
      throw error;
    }
  }

  async deleteWorkbook(id: string): Promise<void> {
    try {
      const query = queryBuilder.deleteWorkbook(id);
      await this.pool.request().query(query);
    } catch (error) {
      console.error('Error deleting workbook:', error);
      throw error;
    }
  }

  async createWorksheet(workbookId: string, worksheet: DbTypes.WorksheetCreate): Promise<DbTypes.Worksheet> {
    try {
      const query = queryBuilder.createWorksheet(workbookId, worksheet);
      const result = await this.pool.request().query(query);
      return dataMapper.toWorksheet(result.recordset[0]);
    } catch (error) {
      console.error('Error creating worksheet:', error);
      throw error;
    }
  }

  async getWorksheet(id: string): Promise<DbTypes.Worksheet | null> {
    try {
      const query = queryBuilder.getWorksheet(id);
      const result = await this.pool.request().query(query);
      return result.recordset[0] ? dataMapper.toWorksheet(result.recordset[0]) : null;
    } catch (error) {
      console.error('Error getting worksheet:', error);
      throw error;
    }
  }

  // TODO: Implement remaining CRUD operations for worksheets, cells, formulas, and charts

  // TODO: Implement transaction methods (beginTransaction, commitTransaction, rollbackTransaction)

  // TODO: Add error handling and logging for database operations

  // TODO: Optimize query performance for large datasets

  // TODO: Implement connection pooling and connection retry logic

  // Helper method to close the connection pool
  async close() {
    try {
      await this.pool.close();
    } catch (error) {
      console.error('Error closing connection pool:', error);
    }
  }
}

// TODO: Add unit tests for all database operations