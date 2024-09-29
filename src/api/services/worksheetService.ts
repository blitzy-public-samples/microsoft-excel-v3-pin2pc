import axios from 'axios';
import { IApiService } from '../interfaces/IApiService';
import {
  ApiResponse,
  CreateWorksheetRequest,
  UpdateWorksheetRequest,
  UpdateCellRequest,
  CreateChartRequest,
  UpdateChartRequest,
  WorksheetListResponse,
  CellRangeResponse,
  ChartListResponse
} from '../types/apiTypes';
import { Worksheet } from '../../shared/types/worksheet';
import { Cell } from '../../shared/types/cell';
import { Chart } from '../../shared/types/chart';

export class WorksheetService implements IApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async createWorksheet(request: CreateWorksheetRequest): Promise<ApiResponse<Worksheet>> {
    try {
      const response = await axios.post(`${this.baseUrl}/worksheets`, request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getWorksheet(workbookId: string, worksheetId: string): Promise<ApiResponse<Worksheet>> {
    try {
      const response = await axios.get(`${this.baseUrl}/workbooks/${workbookId}/worksheets/${worksheetId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateWorksheet(request: UpdateWorksheetRequest): Promise<ApiResponse<Worksheet>> {
    try {
      const response = await axios.put(`${this.baseUrl}/worksheets/${request.worksheetId}`, request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteWorksheet(workbookId: string, worksheetId: string): Promise<ApiResponse<void>> {
    try {
      const response = await axios.delete(`${this.baseUrl}/workbooks/${workbookId}/worksheets/${worksheetId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async listWorksheets(workbookId: string, page: number, pageSize: number): Promise<WorksheetListResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/workbooks/${workbookId}/worksheets`, {
        params: { page, pageSize }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCell(request: UpdateCellRequest): Promise<ApiResponse<Cell>> {
    try {
      const response = await axios.put(`${this.baseUrl}/cells/${request.cellId}`, request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCellRange(workbookId: string, worksheetId: string, range: string): Promise<CellRangeResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/workbooks/${workbookId}/worksheets/${worksheetId}/cells`, {
        params: { range }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createChart(request: CreateChartRequest): Promise<ApiResponse<Chart>> {
    try {
      const response = await axios.post(`${this.baseUrl}/charts`, request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateChart(request: UpdateChartRequest): Promise<ApiResponse<Chart>> {
    try {
      const response = await axios.put(`${this.baseUrl}/charts/${request.chartId}`, request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteChart(workbookId: string, worksheetId: string, chartId: string): Promise<ApiResponse<void>> {
    try {
      const response = await axios.delete(`${this.baseUrl}/workbooks/${workbookId}/worksheets/${worksheetId}/charts/${chartId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async listCharts(workbookId: string, worksheetId: string, page: number, pageSize: number): Promise<ChartListResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/workbooks/${workbookId}/worksheets/${worksheetId}/charts`, {
        params: { page, pageSize }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    // TODO: Implement proper error handling and logging
    console.error('An error occurred:', error);
    return new Error('An error occurred while processing your request.');
  }
}

// TODO: Implement error handling and logging for API requests
// TODO: Add input validation for request parameters
// TODO: Implement retry logic for failed API requests
// TODO: Consider adding caching mechanisms for frequently accessed data
// TODO: Implement rate limiting to prevent API abuse
// TODO: Add unit tests for all methods in the WorksheetService class