// Import constants from AppConstants (to be implemented)
import { CELL_TYPES, CHART_TYPES } from '../constants/AppConstants';

/**
 * Represents the possible values a cell can contain
 */
export type CellValue = string | number | boolean | Date | null;

/**
 * Defines the style properties for a cell
 */
export interface CellStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  color: string;
  backgroundColor: string;
  borderTop: string;
  borderRight: string;
  borderBottom: string;
  borderLeft: string;
  textAlign: string;
  verticalAlign: string;
}

/**
 * Represents a single cell in a worksheet
 */
export interface Cell {
  address: string;
  value: CellValue;
  type: CELL_TYPES;
  formula: string | null;
  style: CellStyle;
}

/**
 * Represents a worksheet in a workbook
 */
export interface Worksheet {
  id: string;
  name: string;
  cells: { [address: string]: Cell };
  rowCount: number;
  columnCount: number;
}

/**
 * Represents an Excel workbook
 */
export interface Workbook {
  id: string;
  name: string;
  worksheets: Worksheet[];
  activeWorksheet: string;
}

/**
 * Represents the data for a chart
 */
export interface ChartData {
  type: CHART_TYPES;
  title: string;
  labels: string[];
  datasets: { label: string; data: number[] }[];
}

/**
 * Represents the result of a formula calculation
 */
export interface FormulaResult {
  value: CellValue;
  error: string | null;
}

/**
 * Represents a cell address
 */
export type CellAddress = string;

/**
 * Represents a range of cells
 */
export type CellRange = string;