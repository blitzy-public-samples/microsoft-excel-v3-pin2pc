import { describe, it, expect, jest } from '@jest/globals';
import { Request, Response } from 'express';
import { WorkbookController } from '../../controllers/workbookController';
import { IApiService } from '../../interfaces/IApiService';
import { ApiResponse, CreateWorkbookRequest, UpdateWorkbookRequest, ShareWorkbookRequest, WorkbookListResponse } from '../../types/apiTypes';
import { Workbook } from '../../../shared/types/workbook';

// Mock the IApiService
const mockApiService: jest.Mocked<IApiService> = {
  createWorkbook: jest.fn(),
  getWorkbook: jest.fn(),
  updateWorkbook: jest.fn(),
  deleteWorkbook: jest.fn(),
  listWorkbooks: jest.fn(),
  shareWorkbook: jest.fn(),
};

// Initialize the WorkbookController with the mock service
const workbookController = new WorkbookController(mockApiService);

// Helper functions to create mock Request and Response objects
const createMockRequest = (body: any = {}, params: any = {}, query: any = {}): Partial<Request> => ({
  body,
  params,
  query,
});

const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('WorkbookController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createWorkbook', () => {
    it('should create a workbook and return 201 status', async () => {
      const mockRequest = createMockRequest({
        name: 'Test Workbook',
        userId: 'user123',
      } as CreateWorkbookRequest);
      const mockResponse = createMockResponse();

      const mockWorkbook: Workbook = {
        id: 'wb123',
        name: 'Test Workbook',
        userId: 'user123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockApiService.createWorkbook.mockResolvedValue(mockWorkbook);

      await workbookController.createWorkbook(mockRequest as Request, mockResponse as Response);

      expect(mockApiService.createWorkbook).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockWorkbook,
      } as ApiResponse<Workbook>);
    });

    // Add more test cases for error scenarios
  });

  describe('getWorkbook', () => {
    it('should get a workbook and return 200 status', async () => {
      const mockRequest = createMockRequest({}, { id: 'wb123' });
      const mockResponse = createMockResponse();

      const mockWorkbook: Workbook = {
        id: 'wb123',
        name: 'Test Workbook',
        userId: 'user123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockApiService.getWorkbook.mockResolvedValue(mockWorkbook);

      await workbookController.getWorkbook(mockRequest as Request, mockResponse as Response);

      expect(mockApiService.getWorkbook).toHaveBeenCalledWith('wb123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockWorkbook,
      } as ApiResponse<Workbook>);
    });

    // Add more test cases for error scenarios
  });

  describe('updateWorkbook', () => {
    it('should update a workbook and return 200 status', async () => {
      const mockRequest = createMockRequest({
        name: 'Updated Workbook',
      } as UpdateWorkbookRequest, { id: 'wb123' });
      const mockResponse = createMockResponse();

      const mockWorkbook: Workbook = {
        id: 'wb123',
        name: 'Updated Workbook',
        userId: 'user123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockApiService.updateWorkbook.mockResolvedValue(mockWorkbook);

      await workbookController.updateWorkbook(mockRequest as Request, mockResponse as Response);

      expect(mockApiService.updateWorkbook).toHaveBeenCalledWith('wb123', mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockWorkbook,
      } as ApiResponse<Workbook>);
    });

    // Add more test cases for error scenarios
  });

  describe('deleteWorkbook', () => {
    it('should delete a workbook and return 204 status', async () => {
      const mockRequest = createMockRequest({}, { id: 'wb123' });
      const mockResponse = createMockResponse();

      mockApiService.deleteWorkbook.mockResolvedValue(undefined);

      await workbookController.deleteWorkbook(mockRequest as Request, mockResponse as Response);

      expect(mockApiService.deleteWorkbook).toHaveBeenCalledWith('wb123');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
      } as ApiResponse<void>);
    });

    // Add more test cases for error scenarios
  });

  describe('listWorkbooks', () => {
    it('should list workbooks and return 200 status', async () => {
      const mockRequest = createMockRequest({}, {}, { userId: 'user123' });
      const mockResponse = createMockResponse();

      const mockWorkbooks: Workbook[] = [
        {
          id: 'wb123',
          name: 'Workbook 1',
          userId: 'user123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'wb456',
          name: 'Workbook 2',
          userId: 'user123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockApiService.listWorkbooks.mockResolvedValue(mockWorkbooks);

      await workbookController.listWorkbooks(mockRequest as Request, mockResponse as Response);

      expect(mockApiService.listWorkbooks).toHaveBeenCalledWith('user123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockWorkbooks,
      } as ApiResponse<WorkbookListResponse>);
    });

    // Add more test cases for error scenarios
  });

  describe('shareWorkbook', () => {
    it('should share a workbook and return 200 status', async () => {
      const mockRequest = createMockRequest({
        userId: 'user456',
        permission: 'read',
      } as ShareWorkbookRequest, { id: 'wb123' });
      const mockResponse = createMockResponse();

      mockApiService.shareWorkbook.mockResolvedValue(undefined);

      await workbookController.shareWorkbook(mockRequest as Request, mockResponse as Response);

      expect(mockApiService.shareWorkbook).toHaveBeenCalledWith('wb123', mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Workbook shared successfully',
      } as ApiResponse<void>);
    });

    // Add more test cases for error scenarios
  });
});

// Human tasks:
// 1. Implement additional test cases to cover edge cases and error scenarios
// 2. Add integration tests to verify the interaction between controllers and the actual API service