import { SQLiteService } from '../../services/sqliteService';
import { DbTypes } from '../../types/dbTypes';
import { DB_CONSTANTS } from '../../constants/dbConstants';
import { jest, describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import sqlite3 from 'sqlite3';

describe('SQLiteService', () => {
  let sqliteService: SQLiteService;
  let mockDb: jest.Mocked<sqlite3.Database>;

  beforeAll(() => {
    // Mock the sqlite3 Database
    mockDb = {
      run: jest.fn(),
      get: jest.fn(),
      all: jest.fn(),
      exec: jest.fn(),
      close: jest.fn(),
    } as unknown as jest.Mocked<sqlite3.Database>;

    // Create a new SQLiteService instance with the mock database
    sqliteService = new SQLiteService(':memory:', mockDb);
  });

  afterAll(() => {
    // Close the database connection
    mockDb.close();
  });

  test('should create a new workbook', async () => {
    const mockWorkbook: DbTypes.Workbook = {
      id: 'wb1',
      name: 'Test Workbook',
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: 'user1',
    };

    mockDb.run.mockImplementation((sql, params, callback) => {
      callback(null);
    });

    mockDb.get.mockImplementation((sql, params, callback) => {
      callback(null, mockWorkbook);
    });

    const result = await sqliteService.createWorkbook(mockWorkbook);

    expect(mockDb.run).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO workbooks'),
      expect.arrayContaining([mockWorkbook.id, mockWorkbook.name, mockWorkbook.ownerId]),
      expect.any(Function)
    );

    expect(result).toEqual(mockWorkbook);
  });

  test('should retrieve an existing workbook', async () => {
    const mockWorkbook: DbTypes.Workbook = {
      id: 'wb1',
      name: 'Test Workbook',
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: 'user1',
    };

    mockDb.get.mockImplementation((sql, params, callback) => {
      callback(null, mockWorkbook);
    });

    const result = await sqliteService.getWorkbook('wb1');

    expect(mockDb.get).toHaveBeenCalledWith(
      expect.stringContaining('SELECT * FROM workbooks'),
      ['wb1'],
      expect.any(Function)
    );

    expect(result).toEqual(mockWorkbook);
  });

  test('should update an existing workbook', async () => {
    const mockWorkbook: DbTypes.Workbook = {
      id: 'wb1',
      name: 'Updated Workbook',
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: 'user1',
    };

    mockDb.run.mockImplementation((sql, params, callback) => {
      callback(null);
    });

    mockDb.get.mockImplementation((sql, params, callback) => {
      callback(null, mockWorkbook);
    });

    const result = await sqliteService.updateWorkbook('wb1', { name: 'Updated Workbook' });

    expect(mockDb.run).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE workbooks'),
      expect.arrayContaining(['Updated Workbook', 'wb1']),
      expect.any(Function)
    );

    expect(result).toEqual(mockWorkbook);
  });

  test('should delete an existing workbook', async () => {
    mockDb.run.mockImplementation((sql, params, callback) => {
      callback(null);
    });

    await sqliteService.deleteWorkbook('wb1');

    expect(mockDb.run).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM workbooks'),
      ['wb1'],
      expect.any(Function)
    );
  });

  // Add more test cases for other methods in the IDataStorage interface
});

// TODO: Implement test cases for all methods in the IDataStorage interface
// TODO: Add test cases for error handling and edge cases
// TODO: Implement performance tests for large datasets
// TODO: Add test cases for concurrent access scenarios
// TODO: Implement test cases for data migration scenarios