/**
 * AppConstants.ts
 * 
 * This file contains constant values used throughout the Excel mobile application.
 * It defines various configuration settings, default values, and enumeration-like
 * constants to ensure consistency across the app.
 */

// Maximum number of rows supported in a worksheet
export const MAX_ROWS: number = 1048576;

// Maximum number of columns supported in a worksheet
export const MAX_COLUMNS: number = 16384;

// Default font size for cell content
export const DEFAULT_FONT_SIZE: number = 11;

// Default font family for cell content
export const DEFAULT_FONT_FAMILY: string = 'Calibri';

// Enumeration of supported cell data types
export const CELL_TYPES: { [key: string]: string } = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  BOOLEAN: 'boolean',
  FORMULA: 'formula'
};

// Enumeration of supported chart types
export const CHART_TYPES: { [key: string]: string } = {
  BAR: 'bar',
  COLUMN: 'column',
  LINE: 'line',
  PIE: 'pie',
  SCATTER: 'scatter'
};

// Base URL for the Excel mobile API
export const API_BASE_URL: string = 'https://api.excelmobile.com/v1';

// Maximum number of undo operations that can be stored
export const MAX_UNDO_STACK_SIZE: number = 100;

// Interval in milliseconds for auto-saving workbooks (1 minute)
export const AUTO_SAVE_INTERVAL: number = 60000;

// Default number of decimal places to display for numeric values
export const DEFAULT_DECIMAL_PLACES: number = 2;

// Maximum length of a formula in characters
export const MAX_FORMULA_LENGTH: number = 8192;

// Default column width in pixels
export const DEFAULT_COLUMN_WIDTH: number = 64;

// Default row height in pixels
export const DEFAULT_ROW_HEIGHT: number = 20;

// Maximum zoom level as a percentage
export const MAX_ZOOM_LEVEL: number = 400;

// Minimum zoom level as a percentage
export const MIN_ZOOM_LEVEL: number = 10;

// Default app theme (light or dark)
export const DEFAULT_THEME: string = 'light';