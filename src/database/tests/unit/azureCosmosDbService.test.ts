import { AzureCosmosDbService } from '../../services/azureCosmosDbService';
import { DbTypes } from '../../types/dbTypes';
import { DB_CONSTANTS } from '../../constants/dbConstants';
import { CosmosClient } from '@azure/cosmos';
import { jest, describe, beforeAll, afterAll, test, expect } from '@jest/globals';

describe('AzureCosmosDbService', () => {
  let azureCosmosDbService: AzureCosmosDbService;
  let mockCosmosClient: jest.Mocked<CosmosClient>;
  let mockDatabase: any;
  let mockContainer: any;

  beforeAll(() => {
    // Mock CosmosClient, Database, and Container
    mockContainer = {
      items: {
        create: jest.fn(),
        read: jest.fn(),
        replace: jest.fn(),
        delete: jest.fn(),
      },
      item: jest.fn(() => ({
        read: jest.fn(),
        replace: jest.fn(),
        delete: jest.fn(),
      })),
    };
    mockDatabase = {
      container: jest.fn().mockReturnValue(mockContainer),
    };
    mockCosmosClient = {
      database: jest.fn().mockReturnValue(mockDatabase),
    } as unknown as jest.Mocked<CosmosClient>;

    // Initialize AzureCosmosDbService instance with mocked dependencies
    azureCosmosDbService = new AzureCosmosDbService(mockCosmosClient);
  });

  afterAll(() => {
    // Reset all mocks
    jest.resetAllMocks();
  });

  test('createWorkbook should create a new workbook', async () => {
    const sampleWorkbook: DbTypes.Workbook = {
      id: '1',
      name: 'Test Workbook',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockContainer.items.create.mockResolvedValue({ resource: sampleWorkbook });

    const result = await azureCosmosDbService.createWorkbook(sampleWorkbook);

    expect(result).toEqual(sampleWorkbook);
    expect(mockContainer.items.create).toHaveBeenCalledWith(sampleWorkbook);
  });

  test('getWorkbook should retrieve an existing workbook', async () => {
    const sampleWorkbook: DbTypes.Workbook = {
      id: '1',
      name: 'Test Workbook',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockContainer.item().read.mockResolvedValue({ resource: sampleWorkbook });

    const result = await azureCosmosDbService.getWorkbook('1');

    expect(result).toEqual(sampleWorkbook);
    expect(mockContainer.item).toHaveBeenCalledWith('1', '1');
    expect(mockContainer.item().read).toHaveBeenCalled();
  });

  test('updateWorkbook should update an existing workbook', async () => {
    const sampleWorkbook: DbTypes.Workbook = {
      id: '1',
      name: 'Updated Test Workbook',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockContainer.item().replace.mockResolvedValue({ resource: sampleWorkbook });

    const result = await azureCosmosDbService.updateWorkbook(sampleWorkbook);

    expect(result).toEqual(sampleWorkbook);
    expect(mockContainer.item).toHaveBeenCalledWith('1', '1');
    expect(mockContainer.item().replace).toHaveBeenCalledWith(sampleWorkbook);
  });

  test('deleteWorkbook should delete an existing workbook', async () => {
    mockContainer.item().delete.mockResolvedValue({});

    await azureCosmosDbService.deleteWorkbook('1');

    expect(mockContainer.item).toHaveBeenCalledWith('1', '1');
    expect(mockContainer.item().delete).toHaveBeenCalled();
  });
});

// TODO: Implement test cases for Worksheet, Cell, Formula, and Chart CRUD operations once they are added to the AzureCosmosDbService
// TODO: Add test cases for error handling scenarios, such as network errors or Cosmos DB throttling
// TODO: Implement test cases for transaction methods (beginTransaction, commitTransaction, rollbackTransaction) once they are added to the AzureCosmosDbService
// TODO: Add performance tests to ensure query efficiency and optimize indexing strategy
// TODO: Implement integration tests with a real Cosmos DB instance in a separate test suite