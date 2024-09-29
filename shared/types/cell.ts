import { UUID } from 'crypto';

// CellValue type is not defined in the formula.ts file, so we'll define it here
type CellValue = string | number | boolean | null;

/**
 * Represents the possible alignment options for cell content
 */
export type CellAlignment = "left" | "center" | "right" | "justify";

/**
 * Defines the formatting options for a cell
 */
export interface CellFormat {
  fontFamily: string | null;
  fontSize: number | null;
  bold: boolean | null;
  italic: boolean | null;
  textColor: string | null;
  backgroundColor: string | null;
  alignment: CellAlignment | null;
  numberFormat: string | null;
}

/**
 * Represents a single cell in a worksheet
 */
export interface Cell {
  id: string;
  column: string;
  row: number;
  value: CellValue;
  formula: string | null;
  format: CellFormat;
}

/**
 * Represents a reference to a cell
 */
export type CellReference = {
  column: string;
  row: number;
};

/**
 * Represents a range of cells
 */
export type CellRange = {
  start: CellReference;
  end: CellReference;
};

// Human tasks (commented as requested)
/**
 * TODO: Human Tasks
 * 1. Review and validate the cell types and interfaces to ensure they meet all requirements for the Excel-like application (Required)
 * 2. Confirm the number format options and add specific formats if needed (Required)
 * 3. Determine if additional properties are needed for regulatory compliance or advanced features (Optional)
 */