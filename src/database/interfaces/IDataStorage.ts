import { DbTypes } from '../types/dbTypes';
import { DB_CONSTANTS } from '../constants/dbConstants';

/**
 * Interface defining the contract for data storage operations in the Excel database layer
 */
export interface IDataStorage {
  /**
   * Creates a new workbook in the storage
   * @param workbook The workbook to create
   * @returns The created workbook with assigned ID
   */
  createWorkbook(workbook: DbTypes.WorkbookCreate): Promise<DbTypes.Workbook>;

  /**
   * Retrieves a workbook by its ID
   * @param id The ID of the workbook to retrieve
   * @returns The workbook if found, null otherwise
   */
  getWorkbook(id: string): Promise<DbTypes.Workbook | null>;

  /**
   * Updates an existing workbook
   * @param id The ID of the workbook to update
   * @param workbook The updated workbook data
   * @returns The updated workbook
   */
  updateWorkbook(id: string, workbook: DbTypes.WorkbookUpdate): Promise<DbTypes.Workbook>;

  /**
   * Deletes a workbook by its ID
   * @param id The ID of the workbook to delete
   */
  deleteWorkbook(id: string): Promise<void>;

  /**
   * Creates a new worksheet in a workbook
   * @param workbookId The ID of the workbook to create the worksheet in
   * @param worksheet The worksheet to create
   * @returns The created worksheet with assigned ID
   */
  createWorksheet(workbookId: string, worksheet: DbTypes.WorksheetCreate): Promise<DbTypes.Worksheet>;

  /**
   * Retrieves a worksheet by its ID
   * @param id The ID of the worksheet to retrieve
   * @returns The worksheet if found, null otherwise
   */
  getWorksheet(id: string): Promise<DbTypes.Worksheet | null>;

  /**
   * Updates an existing worksheet
   * @param id The ID of the worksheet to update
   * @param worksheet The updated worksheet data
   * @returns The updated worksheet
   */
  updateWorksheet(id: string, worksheet: DbTypes.WorksheetUpdate): Promise<DbTypes.Worksheet>;

  /**
   * Deletes a worksheet by its ID
   * @param id The ID of the worksheet to delete
   */
  deleteWorksheet(id: string): Promise<void>;

  /**
   * Creates a new cell in a worksheet
   * @param worksheetId The ID of the worksheet to create the cell in
   * @param cell The cell to create
   * @returns The created cell with assigned ID
   */
  createCell(worksheetId: string, cell: DbTypes.CellCreate): Promise<DbTypes.Cell>;

  /**
   * Retrieves a cell by its ID
   * @param id The ID of the cell to retrieve
   * @returns The cell if found, null otherwise
   */
  getCell(id: string): Promise<DbTypes.Cell | null>;

  /**
   * Updates an existing cell
   * @param id The ID of the cell to update
   * @param cell The updated cell data
   * @returns The updated cell
   */
  updateCell(id: string, cell: DbTypes.CellUpdate): Promise<DbTypes.Cell>;

  /**
   * Deletes a cell by its ID
   * @param id The ID of the cell to delete
   */
  deleteCell(id: string): Promise<void>;

  /**
   * Creates a new formula in a cell
   * @param cellId The ID of the cell to create the formula in
   * @param formula The formula to create
   * @returns The created formula with assigned ID
   */
  createFormula(cellId: string, formula: DbTypes.FormulaCreate): Promise<DbTypes.Formula>;

  /**
   * Retrieves a formula by its ID
   * @param id The ID of the formula to retrieve
   * @returns The formula if found, null otherwise
   */
  getFormula(id: string): Promise<DbTypes.Formula | null>;

  /**
   * Updates an existing formula
   * @param id The ID of the formula to update
   * @param formula The updated formula data
   * @returns The updated formula
   */
  updateFormula(id: string, formula: DbTypes.FormulaUpdate): Promise<DbTypes.Formula>;

  /**
   * Deletes a formula by its ID
   * @param id The ID of the formula to delete
   */
  deleteFormula(id: string): Promise<void>;

  /**
   * Creates a new chart in a worksheet
   * @param worksheetId The ID of the worksheet to create the chart in
   * @param chart The chart to create
   * @returns The created chart with assigned ID
   */
  createChart(worksheetId: string, chart: DbTypes.ChartCreate): Promise<DbTypes.Chart>;

  /**
   * Retrieves a chart by its ID
   * @param id The ID of the chart to retrieve
   * @returns The chart if found, null otherwise
   */
  getChart(id: string): Promise<DbTypes.Chart | null>;

  /**
   * Updates an existing chart
   * @param id The ID of the chart to update
   * @param chart The updated chart data
   * @returns The updated chart
   */
  updateChart(id: string, chart: DbTypes.ChartUpdate): Promise<DbTypes.Chart>;

  /**
   * Deletes a chart by its ID
   * @param id The ID of the chart to delete
   */
  deleteChart(id: string): Promise<void>;

  /**
   * Begins a new database transaction
   */
  beginTransaction(): Promise<void>;

  /**
   * Commits the current database transaction
   */
  commitTransaction(): Promise<void>;

  /**
   * Rolls back the current database transaction
   */
  rollbackTransaction(): Promise<void>;
}

/**
 * Human tasks:
 * 1. Review and validate the IDataStorage interface methods to ensure they cover all necessary operations for Excel's data layer
 * 2. Confirm that the interface aligns with the specific requirements of Azure SQL Database, Azure Cosmos DB, and Azure Blob Storage
 * 3. Ensure that the interface methods provide sufficient flexibility for implementing offline capabilities in desktop and mobile versions
 */