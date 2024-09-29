import { 
  ApiResponse, 
  CreateWorkbookRequest, 
  UpdateWorkbookRequest, 
  CreateWorksheetRequest, 
  UpdateWorksheetRequest, 
  UpdateCellRequest, 
  CreateChartRequest, 
  UpdateChartRequest, 
  ShareWorkbookRequest, 
  WorkbookListResponse, 
  WorksheetListResponse, 
  CellRangeResponse, 
  ChartListResponse 
} from '../types/apiTypes';
import { Workbook } from '../../shared/types/workbook';
import { Worksheet } from '../../shared/types/worksheet';
import { Cell } from '../../shared/types/cell';
import { Chart } from '../../shared/types/chart';

/**
 * Interface defining all the methods for interacting with the Excel-like application's API
 */
export interface IApiService {
  /**
   * Creates a new workbook
   * @param request The request object containing workbook creation details
   * @returns A promise that resolves to the created workbook
   */
  createWorkbook(request: CreateWorkbookRequest): Promise<ApiResponse<Workbook>>;

  /**
   * Retrieves a workbook by ID
   * @param workbookId The ID of the workbook to retrieve
   * @returns A promise that resolves to the requested workbook
   */
  getWorkbook(workbookId: string): Promise<ApiResponse<Workbook>>;

  /**
   * Updates an existing workbook
   * @param request The request object containing workbook update details
   * @returns A promise that resolves to the updated workbook
   */
  updateWorkbook(request: UpdateWorkbookRequest): Promise<ApiResponse<Workbook>>;

  /**
   * Deletes a workbook
   * @param workbookId The ID of the workbook to delete
   * @returns A promise that resolves to a confirmation of deletion
   */
  deleteWorkbook(workbookId: string): Promise<ApiResponse<void>>;

  /**
   * Lists all workbooks for the current user
   * @param page The page number for pagination
   * @param pageSize The number of items per page
   * @returns A promise that resolves to a list of workbooks and total count
   */
  listWorkbooks(page: number, pageSize: number): Promise<WorkbookListResponse>;

  /**
   * Creates a new worksheet in a workbook
   * @param request The request object containing worksheet creation details
   * @returns A promise that resolves to the created worksheet
   */
  createWorksheet(request: CreateWorksheetRequest): Promise<ApiResponse<Worksheet>>;

  /**
   * Retrieves a worksheet by ID
   * @param workbookId The ID of the workbook containing the worksheet
   * @param worksheetId The ID of the worksheet to retrieve
   * @returns A promise that resolves to the requested worksheet
   */
  getWorksheet(workbookId: string, worksheetId: string): Promise<ApiResponse<Worksheet>>;

  /**
   * Updates an existing worksheet
   * @param request The request object containing worksheet update details
   * @returns A promise that resolves to the updated worksheet
   */
  updateWorksheet(request: UpdateWorksheetRequest): Promise<ApiResponse<Worksheet>>;

  /**
   * Deletes a worksheet
   * @param workbookId The ID of the workbook containing the worksheet
   * @param worksheetId The ID of the worksheet to delete
   * @returns A promise that resolves to a confirmation of deletion
   */
  deleteWorksheet(workbookId: string, worksheetId: string): Promise<ApiResponse<void>>;

  /**
   * Lists all worksheets in a workbook
   * @param workbookId The ID of the workbook
   * @param page The page number for pagination
   * @param pageSize The number of items per page
   * @returns A promise that resolves to a list of worksheets and total count
   */
  listWorksheets(workbookId: string, page: number, pageSize: number): Promise<WorksheetListResponse>;

  /**
   * Updates a cell in a worksheet
   * @param request The request object containing cell update details
   * @returns A promise that resolves to the updated cell
   */
  updateCell(request: UpdateCellRequest): Promise<ApiResponse<Cell>>;

  /**
   * Retrieves a range of cells from a worksheet
   * @param workbookId The ID of the workbook
   * @param worksheetId The ID of the worksheet
   * @param range The range of cells to retrieve (e.g., "A1:B10")
   * @returns A promise that resolves to the requested range of cells
   */
  getCellRange(workbookId: string, worksheetId: string, range: string): Promise<CellRangeResponse>;

  /**
   * Creates a new chart in a worksheet
   * @param request The request object containing chart creation details
   * @returns A promise that resolves to the created chart
   */
  createChart(request: CreateChartRequest): Promise<ApiResponse<Chart>>;

  /**
   * Updates an existing chart
   * @param request The request object containing chart update details
   * @returns A promise that resolves to the updated chart
   */
  updateChart(request: UpdateChartRequest): Promise<ApiResponse<Chart>>;

  /**
   * Deletes a chart
   * @param workbookId The ID of the workbook containing the chart
   * @param worksheetId The ID of the worksheet containing the chart
   * @param chartId The ID of the chart to delete
   * @returns A promise that resolves to a confirmation of deletion
   */
  deleteChart(workbookId: string, worksheetId: string, chartId: string): Promise<ApiResponse<void>>;

  /**
   * Lists all charts in a worksheet
   * @param workbookId The ID of the workbook
   * @param worksheetId The ID of the worksheet
   * @param page The page number for pagination
   * @param pageSize The number of items per page
   * @returns A promise that resolves to a list of charts and total count
   */
  listCharts(workbookId: string, worksheetId: string, page: number, pageSize: number): Promise<ChartListResponse>;

  /**
   * Shares a workbook with another user
   * @param request The request object containing sharing details
   * @returns A promise that resolves to a confirmation of sharing
   */
  shareWorkbook(request: ShareWorkbookRequest): Promise<ApiResponse<void>>;
}

// Human tasks:
// TODO: Review and validate the API methods to ensure they cover all required functionality for the Excel-like application
// TODO: Evaluate the need for additional methods related to user management, authentication, and authorization
// TODO: Assess the requirement for methods related to real-time collaboration features
// OPTIONAL: Consider adding methods for bulk operations (e.g., updating multiple cells at once) for performance optimization