import { AzureSqlService } from '../../services/azureSqlService';
import { DbTypes } from '../../types/dbTypes';
import { DB_CONSTANTS } from '../../constants/dbConstants';
import { ConnectionPool, Transaction } from 'mssql';
import { config } from '../../config/databaseConfig';
import jest from 'jest';

describe('AzureSqlService', () => {
  let azureSqlService: AzureSqlService;
  let mockConnectionPool: jest.Mocked<ConnectionPool>;
  let mockTransaction: jest.Mocked<Transaction>;

  beforeAll(() => {
    // Mock the config import to use test database configuration
    jest.mock('../../config/databaseConfig', () => ({
      config: {
        // Add test database configuration here
        server: 'test-server',
        database: 'test-database',
        user: 'test-user',
        password: 'test-password',
      },
    }));
  });

  beforeEach(() => {
    // Create mock ConnectionPool and Transaction
    mockConnectionPool = {
      request: jest.fn().mockReturnThis(),
      query: jest.fn(),
    } as unknown as jest.Mocked<ConnectionPool>;

    mockTransaction = {
      request: jest.fn().mockReturnThis(),
      query: jest.fn(),
    } as unknown as jest.Mocked<Transaction>;

    // Create a new instance of AzureSqlService for each test
    azureSqlService = new AzureSqlService();
    (azureSqlService as any).pool = mockConnectionPool;
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('should create a workbook successfully', async () => {
    const sampleWorkbook: DbTypes.Workbook = {
      id: '1',
      name: 'Test Workbook',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockConnectionPool.query.mockResolvedValueOnce({ recordset: [sampleWorkbook] });

    const result = await azureSqlService.createWorkbook(sampleWorkbook);

    expect(result).toEqual(sampleWorkbook);
    expect(mockConnectionPool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO Workbooks')
    );
  });

  test('should retrieve a workbook by ID', async () => {
    const sampleWorkbook: DbTypes.Workbook = {
      id: '1',
      name: 'Test Workbook',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockConnectionPool.query.mockResolvedValueOnce({ recordset: [sampleWorkbook] });

    const result = await azureSqlService.getWorkbook('1');

    expect(result).toEqual(sampleWorkbook);
    expect(mockConnectionPool.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT * FROM Workbooks WHERE id = @id')
    );
  });

  test('should update a workbook successfully', async () => {
    const updatedWorkbook: DbTypes.Workbook = {
      id: '1',
      name: 'Updated Workbook',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockConnectionPool.query.mockResolvedValueOnce({ recordset: [updatedWorkbook] });

    const result = await azureSqlService.updateWorkbook(updatedWorkbook);

    expect(result).toEqual(updatedWorkbook);
    expect(mockConnectionPool.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE Workbooks SET')
    );
  });

  test('should delete a workbook successfully', async () => {
    mockConnectionPool.query.mockResolvedValueOnce({ rowsAffected: [1] });

    await expect(azureSqlService.deleteWorkbook('1')).resolves.not.toThrow();

    expect(mockConnectionPool.query).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM Workbooks WHERE id = @id')
    );
  });
});