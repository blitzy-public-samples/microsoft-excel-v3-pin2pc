/**
 * This file serves as the main entry point for exporting all shared types used across the Excel-like application.
 * It consolidates type definitions from cell, chart, and formula modules to provide a centralized access point for type information.
 */

// Export all types from the cell module
export * from './cell';

// Export all types from the chart module
export * from './chart';

// Export all types from the formula module
export * from './formula';

/**
 * Represents all possible values in an Excel-like application
 */
export type ExcelValue = CellValue | Formula | ChartOptions;

// TODO: Review the exported types to ensure all necessary types are included for the Excel-like application
// TODO: Confirm that the ExcelValue type union covers all possible value types in the application
// TODO: Consider adding documentation comments for better IDE support and developer experience