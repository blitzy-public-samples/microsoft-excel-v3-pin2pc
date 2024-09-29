import { IDataStorage } from '../../interfaces/IDataStorage';
import { DbTypes } from '../../types/dbTypes';
import { DB_CONSTANTS } from '../../constants/dbConstants';
import { AzureSqlService } from '../../services/azureSqlService';
import { AzureCosmosDbService } from '../../services/azureCosmosDbService';
import { AzureBlobStorageService } from '../../services/azureBlobStorageService';
import { SqliteService } from '../../services/sqliteService';
import { mock, MockProxy } from 'jest-mock-extended';

// Helper function to setup test database
async function setupTestDatabase(dataStorage: IDataStorage): Promise<void> {
  // Create a test workbook
  await dataStorage.createWorkbook({ id: 'test-workbook', name: 'Test Workbook' });
  
  // Create test worksheets
  await dataStorage.createWorksheet({ id: 'test-worksheet-1', workbookId: 'test-workbook', name: 'Sheet1' });
  await dataStorage.createWorksheet({ id: 'test-worksheet-2', workbookId: 'test-workbook', name: 'Sheet2' });
  
  // Create test cells
  await dataStorage.updateCell({ id: 'A1', worksheetId: 'test-worksheet-1', value: '10', type: 'number' });
  await dataStorage.updateCell({ id: 'B1', worksheetId: 'test-worksheet-1', value: '20', type: 'number' });
  await dataStorage.updateCell({ id: 'C1', worksheetId: 'test-worksheet-1', value: '=A1+B1', type: 'formula' });
  
  // Create test formulas
  await dataStorage.createFormula({ id: 'formula-1', worksheetId: 'test-worksheet-1', expression: '=SUM(A1:B1)' });
  
  // Create test charts
  await dataStorage.createChart({ id: 'chart-1', worksheetId: 'test-worksheet-1', type: 'bar', data: { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] } });
}

// Helper function to cleanup test database
async function cleanupTestDatabase(dataStorage: IDataStorage): Promise<void> {
  await dataStorage.deleteWorkbook('test-workbook');
}

describe('IDataStorage Integration Tests', () => {
  const dataStorageImplementations: [string, () => IDataStorage][] = [
    ['AzureSqlService', () => new AzureSqlService()],
    ['AzureCosmosDbService', () => new AzureCosmosDbService()],
    ['AzureBlobStorageService', () => new AzureBlobStorageService()],
    ['SqliteService', () => new SqliteService()],
  ];

  dataStorageImplementations.forEach(([name, createDataStorage]) => {
    describe(`${name}`, () => {
      let dataStorage: IDataStorage;

      beforeAll(async () => {
        dataStorage = createDataStorage();
        await setupTestDatabase(dataStorage);
      });

      afterAll(async () => {
        await cleanupTestDatabase(dataStorage);
      });

      test('getWorkbook should return the correct workbook', async () => {
        const workbook = await dataStorage.getWorkbook('test-workbook');
        expect(workbook).toBeDefined();
        expect(workbook.name).toBe('Test Workbook');
      });

      test('getWorksheets should return all worksheets for a workbook', async () => {
        const worksheets = await dataStorage.getWorksheets('test-workbook');
        expect(worksheets).toHaveLength(2);
        expect(worksheets[0].name).toBe('Sheet1');
        expect(worksheets[1].name).toBe('Sheet2');
      });

      test('getCells should return cells for a worksheet', async () => {
        const cells = await dataStorage.getCells('test-worksheet-1');
        expect(cells).toHaveLength(3);
        expect(cells[0].id).toBe('A1');
        expect(cells[1].id).toBe('B1');
        expect(cells[2].id).toBe('C1');
      });

      test('getFormulas should return formulas for a worksheet', async () => {
        const formulas = await dataStorage.getFormulas('test-worksheet-1');
        expect(formulas).toHaveLength(1);
        expect(formulas[0].expression).toBe('=SUM(A1:B1)');
      });

      test('getCharts should return charts for a worksheet', async () => {
        const charts = await dataStorage.getCharts('test-worksheet-1');
        expect(charts).toHaveLength(1);
        expect(charts[0].type).toBe('bar');
      });

      test('updateCell should update cell value', async () => {
        await dataStorage.updateCell({ id: 'A1', worksheetId: 'test-worksheet-1', value: '30', type: 'number' });
        const updatedCell = await dataStorage.getCell('test-worksheet-1', 'A1');
        expect(updatedCell.value).toBe('30');
      });

      test('deleteWorksheet should remove the worksheet', async () => {
        await dataStorage.deleteWorksheet('test-worksheet-2');
        const worksheets = await dataStorage.getWorksheets('test-workbook');
        expect(worksheets).toHaveLength(1);
        expect(worksheets[0].name).toBe('Sheet1');
      });
    });
  });
});

// Additional tests for concurrent data access and modifications
describe('Concurrent Data Access and Modifications', () => {
  let dataStorage: IDataStorage;

  beforeAll(async () => {
    dataStorage = new AzureSqlService(); // Using AzureSqlService for this test, but could be any implementation
    await setupTestDatabase(dataStorage);
  });

  afterAll(async () => {
    await cleanupTestDatabase(dataStorage);
  });

  test('multiple clients updating the same cell should not cause conflicts', async () => {
    const updatePromises = [];
    for (let i = 0; i < 10; i++) {
      updatePromises.push(dataStorage.updateCell({ id: 'A1', worksheetId: 'test-worksheet-1', value: i.toString(), type: 'number' }));
    }
    await Promise.all(updatePromises);
    const finalCell = await dataStorage.getCell('test-worksheet-1', 'A1');
    expect(parseInt(finalCell.value)).toBeLessThanOrEqual(9);
    expect(parseInt(finalCell.value)).toBeGreaterThanOrEqual(0);
  });
});

// Performance benchmarks
describe('Performance Benchmarks', () => {
  let dataStorage: IDataStorage;

  beforeAll(async () => {
    dataStorage = new AzureSqlService(); // Using AzureSqlService for this test, but could be any implementation
    await setupTestDatabase(dataStorage);
  });

  afterAll(async () => {
    await cleanupTestDatabase(dataStorage);
  });

  test('should handle bulk cell updates efficiently', async () => {
    const startTime = Date.now();
    const updatePromises = [];
    for (let i = 0; i < 1000; i++) {
      updatePromises.push(dataStorage.updateCell({ id: `Cell${i}`, worksheetId: 'test-worksheet-1', value: i.toString(), type: 'number' }));
    }
    await Promise.all(updatePromises);
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`Bulk update of 1000 cells took ${duration}ms`);
    expect(duration).toBeLessThan(5000); // Assuming 5 seconds is an acceptable duration for 1000 updates
  });
});

// Commented list of human tasks
/*
Human Tasks:
1. Implement comprehensive test cases for all methods in the IDataStorage interface (Required)
2. Ensure test coverage for different storage backends (Azure SQL, Azure Cosmos DB, Azure Blob Storage, SQLite) (Required)
3. Add performance benchmarks for critical data operations (Optional)
4. Implement tests for concurrent data access and modifications (Required)
*/