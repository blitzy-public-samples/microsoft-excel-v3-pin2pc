/**
 * cellTypes.ts
 * 
 * This file defines the constant values for different cell types in the Excel spreadsheet application.
 * These cell types are used to determine how data is displayed, formatted, and processed within the application.
 */

export enum CELL_TYPES {
  // Basic cell types
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  TIME = 'TIME',
  BOOLEAN = 'BOOLEAN',

  // Special cell types
  FORMULA = 'FORMULA',
  ERROR = 'ERROR',
  EMPTY = 'EMPTY',

  // Formatted cell types
  CURRENCY = 'CURRENCY',
  PERCENTAGE = 'PERCENTAGE',
  SCIENTIFIC = 'SCIENTIFIC',

  // Advanced cell types
  HYPERLINK = 'HYPERLINK',
  RICH_TEXT = 'RICH_TEXT',
  ARRAY_FORMULA = 'ARRAY_FORMULA',

  // Custom cell types (can be extended based on specific requirements)
  CUSTOM = 'CUSTOM'
}

/**
 * Helper function to check if a given value is a valid CELL_TYPE
 * @param value - The value to check
 * @returns boolean - True if the value is a valid CELL_TYPE, false otherwise
 */
export function isValidCellType(value: string): value is CELL_TYPES {
  return Object.values(CELL_TYPES).includes(value as CELL_TYPES);
}

/**
 * Default cell type to be used when no specific type is specified
 */
export const DEFAULT_CELL_TYPE = CELL_TYPES.TEXT;

/**
 * Map of cell types to their corresponding display names
 * This can be used for UI purposes, such as dropdown menus for cell type selection
 */
export const CELL_TYPE_DISPLAY_NAMES: Record<CELL_TYPES, string> = {
  [CELL_TYPES.TEXT]: 'Text',
  [CELL_TYPES.NUMBER]: 'Number',
  [CELL_TYPES.DATE]: 'Date',
  [CELL_TYPES.TIME]: 'Time',
  [CELL_TYPES.BOOLEAN]: 'Boolean',
  [CELL_TYPES.FORMULA]: 'Formula',
  [CELL_TYPES.ERROR]: 'Error',
  [CELL_TYPES.EMPTY]: 'Empty',
  [CELL_TYPES.CURRENCY]: 'Currency',
  [CELL_TYPES.PERCENTAGE]: 'Percentage',
  [CELL_TYPES.SCIENTIFIC]: 'Scientific',
  [CELL_TYPES.HYPERLINK]: 'Hyperlink',
  [CELL_TYPES.RICH_TEXT]: 'Rich Text',
  [CELL_TYPES.ARRAY_FORMULA]: 'Array Formula',
  [CELL_TYPES.CUSTOM]: 'Custom'
};