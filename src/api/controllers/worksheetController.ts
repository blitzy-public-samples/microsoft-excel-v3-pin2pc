import { Request, Response } from 'express';
import { WorksheetService } from '../services/worksheetService';
import { ApiResponse, CreateWorksheetRequest, UpdateWorksheetRequest, UpdateCellRequest, CreateChartRequest, UpdateChartRequest } from '../types/apiTypes';

export class WorksheetController {
  private worksheetService: WorksheetService;

  constructor(worksheetService: WorksheetService) {
    this.worksheetService = worksheetService;
  }

  public async createWorksheet(req: Request, res: Response): Promise<void> {
    try {
      const createWorksheetRequest: CreateWorksheetRequest = req.body;
      const result = await this.worksheetService.createWorksheet(createWorksheetRequest);
      const response: ApiResponse = { success: true, data: result };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = { success: false, error: error.message };
      res.status(400).json(response);
    }
  }

  public async getWorksheet(req: Request, res: Response): Promise<void> {
    try {
      const { workbookId, worksheetId } = req.params;
      const result = await this.worksheetService.getWorksheet(workbookId, worksheetId);
      const response: ApiResponse = { success: true, data: result };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = { success: false, error: error.message };
      res.status(404).json(response);
    }
  }

  public async updateWorksheet(req: Request, res: Response): Promise<void> {
    try {
      const updateWorksheetRequest: UpdateWorksheetRequest = req.body;
      const result = await this.worksheetService.updateWorksheet(updateWorksheetRequest);
      const response: ApiResponse = { success: true, data: result };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = { success: false, error: error.message };
      res.status(400).json(response);
    }
  }

  public async deleteWorksheet(req: Request, res: Response): Promise<void> {
    try {
      const { workbookId, worksheetId } = req.params;
      await this.worksheetService.deleteWorksheet(workbookId, worksheetId);
      const response: ApiResponse = { success: true, data: null };
      res.status(204).json(response);
    } catch (error) {
      const response: ApiResponse = { success: false, error: error.message };
      res.status(404).json(response);
    }
  }

  public async listWorksheets(req: Request, res: Response): Promise<void> {
    try {
      const { workbookId } = req.params;
      const { page, limit } = req.query;
      const result = await this.worksheetService.listWorksheets(workbookId, Number(page), Number(limit));
      const response: ApiResponse = { success: true, data: result };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = { success: false, error: error.message };
      res.status(400).json(response);
    }
  }

  public async updateCell(req: Request, res: Response): Promise<void> {
    try {
      const updateCellRequest: UpdateCellRequest = req.body;
      const result = await this.worksheetService.updateCell(updateCellRequest);
      const response: ApiResponse = { success: true, data: result };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = { success: false, error: error.message };
      res.status(400).json(response);
    }
  }

  public async getCellRange(req: Request, res: Response): Promise<void> {
    try {
      const { workbookId, worksheetId, range } = req.params;
      const result = await this.worksheetService.getCellRange(workbookId, worksheetId, range);
      const response: ApiResponse = { success: true, data: result };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = { success: false, error: error.message };
      res.status(404).json(response);
    }
  }

  public async createChart(req: Request, res: Response): Promise<void> {
    try {
      const createChartRequest: CreateChartRequest = req.body;
      const result = await this.worksheetService.createChart(createChartRequest);
      const response: ApiResponse = { success: true, data: result };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = { success: false, error: error.message };
      res.status(400).json(response);
    }
  }

  public async updateChart(req: Request, res: Response): Promise<void> {
    try {
      const updateChartRequest: UpdateChartRequest = req.body;
      const result = await this.worksheetService.updateChart(updateChartRequest);
      const response: ApiResponse = { success: true, data: result };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = { success: false, error: error.message };
      res.status(400).json(response);
    }
  }

  public async deleteChart(req: Request, res: Response): Promise<void> {
    try {
      const { workbookId, worksheetId, chartId } = req.params;
      await this.worksheetService.deleteChart(workbookId, worksheetId, chartId);
      const response: ApiResponse = { success: true, data: null };
      res.status(204).json(response);
    } catch (error) {
      const response: ApiResponse = { success: false, error: error.message };
      res.status(404).json(response);
    }
  }

  public async listCharts(req: Request, res: Response): Promise<void> {
    try {
      const { workbookId, worksheetId } = req.params;
      const { page, limit } = req.query;
      const result = await this.worksheetService.listCharts(workbookId, worksheetId, Number(page), Number(limit));
      const response: ApiResponse = { success: true, data: result };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = { success: false, error: error.message };
      res.status(400).json(response);
    }
  }
}

// Human tasks:
// 1. Implement input validation for all controller methods
// 2. Add error handling and appropriate HTTP status codes for different scenarios
// 3. Implement authentication and authorization checks for each endpoint
// 4. Add request logging for debugging and monitoring purposes
// 5. Implement rate limiting for API endpoints to prevent abuse
// 6. Add unit tests for all controller methods
// 7. Consider implementing caching mechanisms for frequently accessed data
// 8. Review and optimize error messages for better client understanding