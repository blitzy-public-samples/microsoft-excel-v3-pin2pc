/**
 * This file defines the IDataStorage interface, which outlines the contract for data storage operations in the Excel-like application.
 * It provides methods for CRUD operations on workbooks, worksheets, cells, formulas, and charts.
 */

// Import necessary types from the types module
// Note: These types are not yet defined and will need to be implemented in the future
import { Workbook, Worksheet, Cell, Formula, Chart } from '../types';

/**
 * Interface defining the contract for data storage operations in the Excel-like application
 */
export interface IDataStorage {
  /**
   * Creates a new workbook
   * @param workbook The workbook to be created
   * @returns A promise that resolves to the ID of the created workbook
   */
  createWorkbook(workbook: Workbook): Promise<string>;

  /**
   * Retrieves a workbook by its ID
   * @param id The ID of the workbook to retrieve
   * @returns A promise that resolves to the requested Workbook
   */
  getWorkbook(id: string): Promise<Workbook>;

  /**
   * Updates an existing workbook
   * @param id The ID of the workbook to update
   * @param workbook The updated workbook data
   * @returns A promise that resolves when the update is complete
   */
  updateWorkbook(id: string, workbook: Workbook): Promise<void>;

  /**
   * Deletes a workbook by its ID
   * @param id The ID of the workbook to delete
   * @returns A promise that resolves when the deletion is complete
   */
  deleteWorkbook(id: string): Promise<void>;

  /**
   * Creates a new worksheet in a workbook
   * @param workbookId The ID of the workbook to create the worksheet in
   * @param worksheet The worksheet to be created
   * @returns A promise that resolves to the ID of the created worksheet
   */
  createWorksheet(workbookId: string, worksheet: Worksheet): Promise<string>;

  /**
   * Retrieves a worksheet by its ID
   * @param workbookId The ID of the workbook containing the worksheet
   * @param worksheetId The ID of the worksheet to retrieve
   * @returns A promise that resolves to the requested Worksheet
   */
  getWorksheet(workbookId: string, worksheetId: string): Promise<Worksheet>;

  /**
   * Updates an existing worksheet
   * @param workbookId The ID of the workbook containing the worksheet
   * @param worksheetId The ID of the worksheet to update
   * @param worksheet The updated worksheet data
   * @returns A promise that resolves when the update is complete
   */
  updateWorksheet(workbookId: string, worksheetId: string, worksheet: Worksheet): Promise<void>;

  /**
   * Deletes a worksheet by its ID
   * @param workbookId The ID of the workbook containing the worksheet
   * @param worksheetId The ID of the worksheet to delete
   * @returns A promise that resolves when the deletion is complete
   */
  deleteWorksheet(workbookId: string, worksheetId: string): Promise<void>;

  /**
   * Updates a cell in a worksheet
   * @param workbookId The ID of the workbook containing the worksheet
   * @param worksheetId The ID of the worksheet containing the cell
   * @param cellId The ID of the cell to update
   * @param cellData The updated cell data
   * @returns A promise that resolves when the update is complete
   */
  updateCell(workbookId: string, worksheetId: string, cellId: string, cellData: Cell): Promise<void>;

  /**
   * Updates a formula in a cell
   * @param workbookId The ID of the workbook containing the worksheet
   * @param worksheetId The ID of the worksheet containing the cell
   * @param cellId The ID of the cell containing the formula
   * @param formula The updated formula data
   * @returns A promise that resolves when the update is complete
   */
  updateFormula(workbookId: string, worksheetId: string, cellId: string, formula: Formula): Promise<void>;

  /**
   * Creates a new chart in a worksheet
   * @param workbookId The ID of the workbook containing the worksheet
   * @param worksheetId The ID of the worksheet to create the chart in
   * @param chart The chart to be created
   * @returns A promise that resolves to the ID of the created chart
   */
  createChart(workbookId: string, worksheetId: string, chart: Chart): Promise<string>;

  /**
   * Updates an existing chart
   * @param workbookId The ID of the workbook containing the worksheet
   * @param worksheetId The ID of the worksheet containing the chart
   * @param chartId The ID of the chart to update
   * @param chart The updated chart data
   * @returns A promise that resolves when the update is complete
   */
  updateChart(workbookId: string, worksheetId: string, chartId: string, chart: Chart): Promise<void>;

  /**
   * Deletes a chart by its ID
   * @param workbookId The ID of the workbook containing the worksheet
   * @param worksheetId The ID of the worksheet containing the chart
   * @param chartId The ID of the chart to delete
   * @returns A promise that resolves when the deletion is complete
   */
  deleteChart(workbookId: string, worksheetId: string, chartId: string): Promise<void>;
}

// TODO: Review the IDataStorage interface to ensure all necessary methods for data persistence are included
// TODO: Consider adding methods for batch operations to improve performance for bulk updates
// TODO: Evaluate the need for additional methods to support version history and collaborative editing features