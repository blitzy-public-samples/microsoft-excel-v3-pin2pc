import { Cell } from '../../shared/types/cell';
import { Chart, ChartOptions } from '../../shared/types/chart';
import { Formula } from '../../shared/types/formula';
import { User, UserRole } from '../../shared/types/user';
import { Workbook } from '../../shared/types/workbook';
import { Worksheet } from '../../shared/types/worksheet';

// Generic interface for API responses
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

// Request body for creating a new workbook
export interface CreateWorkbookRequest {
  name: string;
  metadata: WorkbookMetadata;
}

// Request body for updating a workbook
export interface UpdateWorkbookRequest {
  id: string;
  name?: string;
  metadata?: WorkbookMetadata;
}

// Request body for creating a new worksheet
export interface CreateWorksheetRequest {
  workbookId: string;
  name: string;
  metadata?: WorksheetMetadata;
}

// Request body for updating a worksheet
export interface UpdateWorksheetRequest {
  workbookId: string;
  worksheetId: string;
  name?: string;
  metadata?: WorksheetMetadata;
}

// Request body for updating a cell
export interface UpdateCellRequest {
  workbookId: string;
  worksheetId: string;
  cellId: string;
  value: CellValue;
  formula?: Formula;
  format?: CellFormat;
}

// Request body for creating a new chart
export interface CreateChartRequest {
  workbookId: string;
  worksheetId: string;
  options: ChartOptions;
}

// Request body for updating a chart
export interface UpdateChartRequest {
  workbookId: string;
  worksheetId: string;
  chartId: string;
  options: ChartOptions;
}

// Request body for sharing a workbook
export interface ShareWorkbookRequest {
  workbookId: string;
  userId: string;
  role: UserRole;
}

// Response type for listing workbooks
export type WorkbookListResponse = ApiResponse<{ workbooks: Workbook[]; totalCount: number }>;

// Response type for listing worksheets
export type WorksheetListResponse = ApiResponse<{ worksheets: Worksheet[]; totalCount: number }>;

// Response type for retrieving a range of cells
export type CellRangeResponse = ApiResponse<{ cells: Cell[]; range: CellRange }>;

// Response type for listing charts
export type ChartListResponse = ApiResponse<{ charts: Chart[]; totalCount: number }>;

// TODO: Define WorkbookMetadata, WorksheetMetadata, CellValue, CellFormat, and CellRange types
// These types should be imported from the respective shared type files once they are available

/**
 * @todo Review and validate the API types and interfaces to ensure they cover all required API endpoints
 * @todo Confirm if pagination parameters need to be added to list response types
 * @todo Determine if any additional API-specific types are needed for advanced features or integrations
 */