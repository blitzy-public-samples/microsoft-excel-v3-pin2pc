import { CellValue, Cell, Row, Column, Worksheet, Workbook, Chart, ChartOptions } from '../types/spreadsheet';
import { CELL_TYPES } from '../constants/cellTypes';

/**
 * Checks if the given value is a valid cell value
 * @param value Any value to be checked
 * @returns True if the value is a valid cell value, false otherwise
 */
export function isValidCellValue(value: any): boolean {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null;
}

/**
 * Validates a cell object against the Cell interface
 * @param cell Any object to be validated as a Cell
 * @returns True if the cell object is valid, false otherwise
 */
export function isValidCell(cell: any): boolean {
  if (!cell || typeof cell !== 'object') return false;
  if (!('id' in cell && 'value' in cell && 'type' in cell)) return false;
  if (!isValidCellValue(cell.value)) return false;
  if (!CELL_TYPES.includes(cell.type)) return false;
  if ('formula' in cell && typeof cell.formula !== 'string') return false;
  if ('style' in cell && typeof cell.style !== 'object') return false;
  return true;
}

/**
 * Validates a row object against the Row interface
 * @param row Any object to be validated as a Row
 * @returns True if the row object is valid, false otherwise
 */
export function isValidRow(row: any): boolean {
  if (!row || typeof row !== 'object') return false;
  if (!('id' in row && 'index' in row && 'cells' in row)) return false;
  if (typeof row.index !== 'number') return false;
  if (!Array.isArray(row.cells) || !row.cells.every(isValidCell)) return false;
  if ('height' in row && typeof row.height !== 'number') return false;
  return true;
}

/**
 * Validates a column object against the Column interface
 * @param column Any object to be validated as a Column
 * @returns True if the column object is valid, false otherwise
 */
export function isValidColumn(column: any): boolean {
  if (!column || typeof column !== 'object') return false;
  if (!('id' in column && 'index' in column && 'width' in column)) return false;
  if (typeof column.index !== 'number' || typeof column.width !== 'number') return false;
  return true;
}

/**
 * Validates a worksheet object against the Worksheet interface
 * @param worksheet Any object to be validated as a Worksheet
 * @returns True if the worksheet object is valid, false otherwise
 */
export function isValidWorksheet(worksheet: any): boolean {
  if (!worksheet || typeof worksheet !== 'object') return false;
  if (!('id' in worksheet && 'name' in worksheet && 'rows' in worksheet && 'columns' in worksheet)) return false;
  if (!Array.isArray(worksheet.rows) || !worksheet.rows.every(isValidRow)) return false;
  if (!Array.isArray(worksheet.columns) || !worksheet.columns.every(isValidColumn)) return false;
  if ('charts' in worksheet && (!Array.isArray(worksheet.charts) || !worksheet.charts.every(isValidChart))) return false;
  return true;
}

/**
 * Validates a workbook object against the Workbook interface
 * @param workbook Any object to be validated as a Workbook
 * @returns True if the workbook object is valid, false otherwise
 */
export function isValidWorkbook(workbook: any): boolean {
  if (!workbook || typeof workbook !== 'object') return false;
  if (!('id' in workbook && 'name' in workbook && 'worksheets' in workbook && 'activeWorksheet' in workbook)) return false;
  if (!Array.isArray(workbook.worksheets) || !workbook.worksheets.every(isValidWorksheet)) return false;
  if (!workbook.worksheets.some(ws => ws.id === workbook.activeWorksheet)) return false;
  return true;
}

/**
 * Validates a chart object against the Chart interface
 * @param chart Any object to be validated as a Chart
 * @returns True if the chart object is valid, false otherwise
 */
export function isValidChart(chart: any): boolean {
  if (!chart || typeof chart !== 'object') return false;
  if (!('id' in chart && 'type' in chart && 'title' in chart && 'dataRange' in chart)) return false;
  if (!['bar', 'line', 'pie', 'scatter', 'area'].includes(chart.type)) return false;
  if (typeof chart.title !== 'string') return false;
  if (!validateDataRange(chart.dataRange)) return false;
  if ('options' in chart && typeof chart.options !== 'object') return false;
  return true;
}

/**
 * Validates the data range string for charts
 * @param dataRange The data range string to be validated
 * @returns True if the data range is valid, false otherwise
 */
export function validateDataRange(dataRange: string): boolean {
  const rangeRegex = /^[A-Z]+[1-9]\d*:[A-Z]+[1-9]\d*$/;
  if (!rangeRegex.test(dataRange)) return false;

  const [start, end] = dataRange.split(':');
  const startCol = start.replace(/[0-9]/g, '');
  const startRow = parseInt(start.replace(/[A-Z]/g, ''), 10);
  const endCol = end.replace(/[0-9]/g, '');
  const endRow = parseInt(end.replace(/[A-Z]/g, ''), 10);

  if (startCol > endCol || startRow > endRow) return false;

  return true;
}

// Human tasks:
// TODO: Implement unit tests for each validation function to ensure accuracy
// TODO: Review and update validation logic if new features or data types are added to the spreadsheet application
// TODO: Consider adding more specific validation for formula syntax and chart options