// Import types from SpreadsheetTypes
// Assuming CellAddress is a string and CellRange is an object with start and end properties
import { CellAddress, CellRange } from '../types/SpreadsheetTypes';

/**
 * Converts a zero-based column index to a column letter (e.g., 0 -> 'A', 25 -> 'Z', 26 -> 'AA')
 * @param index The zero-based column index
 * @returns The column letter representation
 */
export function columnIndexToLetter(index: number): string {
  if (index < 0) {
    throw new Error('Column index must be non-negative');
  }

  let result = '';
  while (index >= 0) {
    result = String.fromCharCode((index % 26) + 65) + result;
    index = Math.floor(index / 26) - 1;
  }
  return result;
}

/**
 * Converts a column letter to a zero-based column index (e.g., 'A' -> 0, 'Z' -> 25, 'AA' -> 26)
 * @param column The column letter
 * @returns The zero-based column index
 */
export function letterToColumnIndex(column: string): number {
  if (!/^[A-Z]+$/.test(column)) {
    throw new Error('Invalid column letter');
  }

  let result = 0;
  for (let i = 0; i < column.length; i++) {
    result = result * 26 + (column.charCodeAt(i) - 64);
  }
  return result - 1;
}

/**
 * Converts a cell address (e.g., 'A1') to a row and column index pair
 * @param address The cell address
 * @returns An object with row and col properties
 */
export function cellAddressToRowCol(address: CellAddress): { row: number; col: number } {
  const match = address.match(/^([A-Z]+)(\d+)$/);
  if (!match) {
    throw new Error('Invalid cell address');
  }

  const [, colLetters, rowString] = match;
  const col = letterToColumnIndex(colLetters);
  const row = parseInt(rowString, 10) - 1;

  return { row, col };
}

/**
 * Converts a row and column index pair to a cell address (e.g., { row: 0, col: 0 } -> 'A1')
 * @param row The zero-based row index
 * @param col The zero-based column index
 * @returns The cell address string
 */
export function rowColToCellAddress(row: number, col: number): CellAddress {
  if (row < 0 || col < 0) {
    throw new Error('Row and column indices must be non-negative');
  }

  const colString = columnIndexToLetter(col);
  const rowString = (row + 1).toString();
  return `${colString}${rowString}`;
}

/**
 * Checks if a given string is a valid cell address
 * @param address The string to check
 * @returns True if the address is valid, false otherwise
 */
export function isValidCellAddress(address: string): boolean {
  return /^[A-Z]+\d+$/.test(address);
}

/**
 * Checks if a given string is a valid cell range
 * @param range The string to check
 * @returns True if the range is valid, false otherwise
 */
export function isValidCellRange(range: string): boolean {
  const [start, end] = range.split(':');
  if (!start || !end) {
    return false;
  }

  if (!isValidCellAddress(start) || !isValidCellAddress(end)) {
    return false;
  }

  const startCell = cellAddressToRowCol(start as CellAddress);
  const endCell = cellAddressToRowCol(end as CellAddress);

  return startCell.row <= endCell.row && startCell.col <= endCell.col;
}

/**
 * Expands a cell range into an array of all cell addresses within that range
 * @param range The cell range to expand
 * @returns An array of all cell addresses in the range
 */
export function expandCellRange(range: CellRange): CellAddress[] {
  if (!isValidCellRange(`${range.start}:${range.end}`)) {
    throw new Error('Invalid cell range');
  }

  const startCell = cellAddressToRowCol(range.start);
  const endCell = cellAddressToRowCol(range.end);
  const result: CellAddress[] = [];

  for (let row = startCell.row; row <= endCell.row; row++) {
    for (let col = startCell.col; col <= endCell.col; col++) {
      result.push(rowColToCellAddress(row, col));
    }
  }

  return result;
}