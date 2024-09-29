import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { mock } from 'jest-mock-extended';
import { WorkbookService } from '../../services/workbookService';
import { IDataStorage } from '../../interfaces/IDataStorage';
import { CreateWorkbookRequest, UpdateWorkbookRequest, ShareWorkbookRequest } from '../../types/apiTypes';
import { Workbook } from '../../../shared/types/workbook';

describe('WorkbookService', () => {
  let workbookService: WorkbookService;
  let mockDataStorage: jest.Mocked<IDataStorage>;

  beforeEach(() => {
    mockDataStorage = mock<IDataStorage>();
    workbookService = new WorkbookService(mockDataStorage);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createWorkbook', () => {
    it('should create a new workbook', async () => {
      const createRequest: CreateWorkbookRequest = {
        name: 'Test Workbook',
        ownerId: 'user123',
      };

      const expectedWorkbook: Workbook = {
        id: 'wb123',
        name: 'Test Workbook',
        ownerId: 'user123',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        sheets: [],
      };

      mockDataStorage.createWorkbook.mockResolvedValue(expectedWorkbook);

      const result = await workbookService.createWorkbook(createRequest);

      expect(result).toEqual(expectedWorkbook);
      expect(mockDataStorage.createWorkbook).toHaveBeenCalledWith(createRequest);
    });

    it('should throw an error if creation fails', async () => {
      const createRequest: CreateWorkbookRequest = {
        name: 'Test Workbook',
        ownerId: 'user123',
      };

      mockDataStorage.createWorkbook.mockRejectedValue(new Error('Creation failed'));

      await expect(workbookService.createWorkbook(createRequest)).rejects.toThrow('Creation failed');
    });
  });

  describe('getWorkbook', () => {
    it('should retrieve a workbook by id', async () => {
      const workbookId = 'wb123';
      const expectedWorkbook: Workbook = {
        id: workbookId,
        name: 'Test Workbook',
        ownerId: 'user123',
        createdAt: new Date(),
        updatedAt: new Date(),
        sheets: [],
      };

      mockDataStorage.getWorkbook.mockResolvedValue(expectedWorkbook);

      const result = await workbookService.getWorkbook(workbookId);

      expect(result).toEqual(expectedWorkbook);
      expect(mockDataStorage.getWorkbook).toHaveBeenCalledWith(workbookId);
    });

    it('should throw an error if workbook is not found', async () => {
      const workbookId = 'nonexistent';

      mockDataStorage.getWorkbook.mockResolvedValue(null);

      await expect(workbookService.getWorkbook(workbookId)).rejects.toThrow('Workbook not found');
    });
  });

  describe('updateWorkbook', () => {
    it('should update a workbook', async () => {
      const updateRequest: UpdateWorkbookRequest = {
        id: 'wb123',
        name: 'Updated Workbook',
      };

      const expectedWorkbook: Workbook = {
        id: 'wb123',
        name: 'Updated Workbook',
        ownerId: 'user123',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        sheets: [],
      };

      mockDataStorage.updateWorkbook.mockResolvedValue(expectedWorkbook);

      const result = await workbookService.updateWorkbook(updateRequest);

      expect(result).toEqual(expectedWorkbook);
      expect(mockDataStorage.updateWorkbook).toHaveBeenCalledWith(updateRequest);
    });

    it('should throw an error if update fails', async () => {
      const updateRequest: UpdateWorkbookRequest = {
        id: 'wb123',
        name: 'Updated Workbook',
      };

      mockDataStorage.updateWorkbook.mockRejectedValue(new Error('Update failed'));

      await expect(workbookService.updateWorkbook(updateRequest)).rejects.toThrow('Update failed');
    });
  });

  describe('deleteWorkbook', () => {
    it('should delete a workbook', async () => {
      const workbookId = 'wb123';

      mockDataStorage.deleteWorkbook.mockResolvedValue(true);

      const result = await workbookService.deleteWorkbook(workbookId);

      expect(result).toBe(true);
      expect(mockDataStorage.deleteWorkbook).toHaveBeenCalledWith(workbookId);
    });

    it('should throw an error if deletion fails', async () => {
      const workbookId = 'wb123';

      mockDataStorage.deleteWorkbook.mockRejectedValue(new Error('Deletion failed'));

      await expect(workbookService.deleteWorkbook(workbookId)).rejects.toThrow('Deletion failed');
    });
  });

  describe('shareWorkbook', () => {
    it('should share a workbook with another user', async () => {
      const shareRequest: ShareWorkbookRequest = {
        workbookId: 'wb123',
        userId: 'user456',
        permission: 'read',
      };

      mockDataStorage.shareWorkbook.mockResolvedValue(true);

      const result = await workbookService.shareWorkbook(shareRequest);

      expect(result).toBe(true);
      expect(mockDataStorage.shareWorkbook).toHaveBeenCalledWith(shareRequest);
    });

    it('should throw an error if sharing fails', async () => {
      const shareRequest: ShareWorkbookRequest = {
        workbookId: 'wb123',
        userId: 'user456',
        permission: 'read',
      };

      mockDataStorage.shareWorkbook.mockRejectedValue(new Error('Sharing failed'));

      await expect(workbookService.shareWorkbook(shareRequest)).rejects.toThrow('Sharing failed');
    });
  });
});

// TODO: Implement test cases for error scenarios and edge cases
// TODO: Add integration tests for WorkbookService with actual database
// TODO: Implement performance tests for WorkbookService methods