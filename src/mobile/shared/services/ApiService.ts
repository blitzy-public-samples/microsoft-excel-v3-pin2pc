import axios, { AxiosInstance } from 'axios';
import { Workbook, Worksheet, Cell, ChartData, FormulaResult } from '../types/SpreadsheetTypes';
import { AuthService } from './AuthService';

/**
 * ApiService class handles all API calls to the backend server for the Excel mobile application.
 * It provides methods for CRUD operations on workbooks, worksheets, cells, and other spreadsheet-related data.
 */
export class ApiService {
  private baseUrl: string;
  private authService: AuthService;
  private axiosInstance: AxiosInstance;

  /**
   * Initializes the ApiService with the base URL and AuthService
   * @param baseUrl The base URL of the API
   * @param authService The AuthService instance for handling authentication
   */
  constructor(baseUrl: string, authService: AuthService) {
    this.baseUrl = baseUrl;
    this.authService = authService;
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include the auth token in every request
    this.axiosInstance.interceptors.request.use(async (config) => {
      const token = await this.authService.getAuthToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });
  }

  /**
   * Fetches all workbooks for the current user
   * @returns A promise that resolves to an array of Workbook objects
   */
  async getWorkbooks(): Promise<Workbook[]> {
    try {
      const response = await this.axiosInstance.get<Workbook[]>('/workbooks');
      return response.data;
    } catch (error) {
      console.error('Error fetching workbooks:', error);
      throw error;
    }
  }

  /**
   * Fetches a specific workbook by ID
   * @param workbookId The ID of the workbook to fetch
   * @returns A promise that resolves to a Workbook object
   */
  async getWorkbook(workbookId: string): Promise<Workbook> {
    try {
      const response = await this.axiosInstance.get<Workbook>(`/workbooks/${workbookId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching workbook with ID ${workbookId}:`, error);
      throw error;
    }
  }

  /**
   * Creates a new workbook
   * @param workbookData Partial workbook data to create the new workbook
   * @returns A promise that resolves to the created Workbook object
   */
  async createWorkbook(workbookData: Partial<Workbook>): Promise<Workbook> {
    try {
      const response = await this.axiosInstance.post<Workbook>('/workbooks', workbookData);
      return response.data;
    } catch (error) {
      console.error('Error creating workbook:', error);
      throw error;
    }
  }

  /**
   * Updates an existing workbook
   * @param workbookId The ID of the workbook to update
   * @param workbookData Partial workbook data to update
   * @returns A promise that resolves to the updated Workbook object
   */
  async updateWorkbook(workbookId: string, workbookData: Partial<Workbook>): Promise<Workbook> {
    try {
      const response = await this.axiosInstance.put<Workbook>(`/workbooks/${workbookId}`, workbookData);
      return response.data;
    } catch (error) {
      console.error(`Error updating workbook with ID ${workbookId}:`, error);
      throw error;
    }
  }

  /**
   * Deletes a workbook
   * @param workbookId The ID of the workbook to delete
   * @returns A promise that resolves when the workbook is deleted
   */
  async deleteWorkbook(workbookId: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/workbooks/${workbookId}`);
    } catch (error) {
      console.error(`Error deleting workbook with ID ${workbookId}:`, error);
      throw error;
    }
  }

  /**
   * Fetches all worksheets for a specific workbook
   * @param workbookId The ID of the workbook
   * @returns A promise that resolves to an array of Worksheet objects
   */
  async getWorksheets(workbookId: string): Promise<Worksheet[]> {
    try {
      const response = await this.axiosInstance.get<Worksheet[]>(`/workbooks/${workbookId}/worksheets`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching worksheets for workbook with ID ${workbookId}:`, error);
      throw error;
    }
  }

  /**
   * Updates a specific cell in a worksheet
   * @param workbookId The ID of the workbook
   * @param worksheetId The ID of the worksheet
   * @param cellAddress The address of the cell to update
   * @param cellData Partial cell data to update
   * @returns A promise that resolves to the updated Cell object
   */
  async updateCell(workbookId: string, worksheetId: string, cellAddress: string, cellData: Partial<Cell>): Promise<Cell> {
    try {
      const response = await this.axiosInstance.put<Cell>(
        `/workbooks/${workbookId}/worksheets/${worksheetId}/cells/${cellAddress}`,
        cellData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating cell ${cellAddress} in worksheet ${worksheetId}:`, error);
      throw error;
    }
  }

  /**
   * Calculates the result of a formula
   * @param workbookId The ID of the workbook
   * @param worksheetId The ID of the worksheet
   * @param formula The formula to calculate
   * @returns A promise that resolves to the FormulaResult object
   */
  async calculateFormula(workbookId: string, worksheetId: string, formula: string): Promise<FormulaResult> {
    try {
      const response = await this.axiosInstance.post<FormulaResult>(
        `/workbooks/${workbookId}/worksheets/${worksheetId}/calculate`,
        { formula }
      );
      return response.data;
    } catch (error) {
      console.error(`Error calculating formula in worksheet ${worksheetId}:`, error);
      throw error;
    }
  }

  /**
   * Creates a new chart in a worksheet
   * @param workbookId The ID of the workbook
   * @param worksheetId The ID of the worksheet
   * @param chartData The data for creating the chart
   * @returns A promise that resolves to the created ChartData object
   */
  async createChart(workbookId: string, worksheetId: string, chartData: ChartData): Promise<ChartData> {
    try {
      const response = await this.axiosInstance.post<ChartData>(
        `/workbooks/${workbookId}/worksheets/${worksheetId}/charts`,
        chartData
      );
      return response.data;
    } catch (error) {
      console.error(`Error creating chart in worksheet ${worksheetId}:`, error);
      throw error;
    }
  }
}

// TODO: Implement error handling and retry logic for API calls
// TODO: Add caching mechanism for frequently accessed data
// TODO: Implement offline support and synchronization