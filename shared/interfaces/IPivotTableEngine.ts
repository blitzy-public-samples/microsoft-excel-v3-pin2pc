/**
 * Defines the interface for the Pivot Table Engine, which is responsible for creating, updating,
 * and manipulating pivot tables in the Excel-like application.
 */

// Import types from local modules
import { CellRange } from '../types/cell';
import { PivotTableDefinition, PivotTableResult } from '../types/pivotTable';

/**
 * Interface for the Pivot Table Engine, providing methods for creating, updating, and manipulating pivot tables
 */
export interface IPivotTableEngine {
  /**
   * Creates a new pivot table based on the given data range and definition
   * @param dataRange The range of cells containing the source data for the pivot table
   * @param definition The definition of the pivot table structure and settings
   * @returns A promise that resolves to the created pivot table result
   */
  createPivotTable(dataRange: CellRange, definition: PivotTableDefinition): Promise<PivotTableResult>;

  /**
   * Updates an existing pivot table with new data or settings
   * @param pivotTableId The unique identifier of the pivot table to update
   * @param newDefinition The new definition for the pivot table
   * @returns A promise that resolves to the updated pivot table result
   */
  updatePivotTable(pivotTableId: string, newDefinition: PivotTableDefinition): Promise<PivotTableResult>;

  /**
   * Refreshes the pivot table with the latest data from its source range
   * @param pivotTableId The unique identifier of the pivot table to refresh
   * @returns A promise that resolves to the refreshed pivot table result
   */
  refreshPivotTable(pivotTableId: string): Promise<PivotTableResult>;

  /**
   * Deletes an existing pivot table
   * @param pivotTableId The unique identifier of the pivot table to delete
   * @returns A promise that resolves when the pivot table is successfully deleted
   */
  deletePivotTable(pivotTableId: string): Promise<void>;

  /**
   * Retrieves the data for a specific pivot table
   * @param pivotTableId The unique identifier of the pivot table to retrieve
   * @returns A promise that resolves to the pivot table data
   */
  getPivotTableData(pivotTableId: string): Promise<PivotTableResult>;

  /**
   * Applies a filter to a specific field in the pivot table
   * @param pivotTableId The unique identifier of the pivot table to filter
   * @param fieldName The name of the field to apply the filter to
   * @param filterCriteria The criteria to use for filtering the field
   * @returns A promise that resolves to the updated pivot table result after applying the filter
   */
  applyPivotTableFilter(pivotTableId: string, fieldName: string, filterCriteria: any[]): Promise<PivotTableResult>;

  /**
   * Changes the aggregation method for a value field in the pivot table
   * @param pivotTableId The unique identifier of the pivot table to modify
   * @param valueFieldName The name of the value field to change the aggregation method for
   * @param aggregationMethod The new aggregation method to apply
   * @returns A promise that resolves to the updated pivot table result after changing the aggregation method
   */
  changePivotTableAggregation(pivotTableId: string, valueFieldName: string, aggregationMethod: string): Promise<PivotTableResult>;
}

/**
 * Human tasks:
 * 1. Review and validate the IPivotTableEngine interface to ensure it covers all necessary pivot table operations
 * 2. Determine if additional methods are needed for specific Excel-like pivot table features (e.g., calculated fields, pivot charts)
 * 3. Consider adding methods for performance optimization, such as incremental updates or caching mechanisms for large datasets
 * 4. Evaluate the need for error handling methods or specific error types in the interface
 * 5. Define the exact structure of the PivotTableDefinition and PivotTableResult types in the ../types/pivotTable module
 */