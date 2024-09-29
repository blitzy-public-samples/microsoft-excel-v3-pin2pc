import { Cell } from '../types/spreadsheet';

/**
 * Converts a zero-based column index to a column letter (e.g., 0 -> 'A', 25 -> 'Z', 26 -> 'AA')
 * @param index The zero-based column index
 * @returns The column letter representation
 */
export function columnIndexToLetter(index: number): string {
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
  let result = 0;
  for (let i = 0; i < column.length; i++) {
    result = result * 26 + (column.charCodeAt(i) - 64);
  }
  return result - 1;
}

/**
 * Converts a cell address string to row and column indices (e.g., 'A1' -> { row: 0, col: 0 })
 * @param address The cell address string
 * @returns An object with row and col properties
 */
export function cellAddressToRowCol(address: string): { row: number; col: number } {
  const match = address.match(/^([A-Z]+)(\d+)$/);
  if (!match) {
    throw new Error('Invalid cell address format');
  }
  const [, colLetters, rowString] = match;
  const col = letterToColumnIndex(colLetters);
  const row = parseInt(rowString, 10) - 1;
  return { row, col };
}

/**
 * Converts row and column indices to a cell address string (e.g., { row: 0, col: 0 } -> 'A1')
 * @param row The zero-based row index
 * @param col The zero-based column index
 * @returns The cell address string
 */
export function rowColToCellAddress(row: number, col: number): string {
  const colLetter = columnIndexToLetter(col);
  return `${colLetter}${row + 1}`;
}

/**
 * Returns an array of cell addresses in a given range (e.g., 'A1:B3' -> ['A1', 'A2', 'A3', 'B1', 'B2', 'B3'])
 * @param range The range string (e.g., 'A1:B3')
 * @returns An array of cell addresses within the range
 */
export function getCellRange(range: string): string[] {
  const [start, end] = range.split(':');
  const startCell = cellAddressToRowCol(start);
  const endCell = cellAddressToRowCol(end);
  
  const result: string[] = [];
  for (let row = startCell.row; row <= endCell.row; row++) {
    for (let col = startCell.col; col <= endCell.col; col++) {
      result.push(rowColToCellAddress(row, col));
    }
  }
  return result;
}

/**
 * Increments a cell address by a given number of rows and columns
 * @param address The starting cell address
 * @param rowIncrement The number of rows to increment (can be negative)
 * @param colIncrement The number of columns to increment (can be negative)
 * @returns The new cell address
 */
export function incrementCellAddress(address: string, rowIncrement: number, colIncrement: number): string {
  const { row, col } = cellAddressToRowCol(address);
  const newRow = row + rowIncrement;
  const newCol = col + colIncrement;
  
  if (newRow < 0 || newCol < 0) {
    throw new Error('Invalid increment: resulting address is out of bounds');
  }
  
  return rowColToCellAddress(newRow, newCol);
}

// TODO: Implement error handling for invalid input in all functions
// TODO: Add unit tests for each function to ensure correct behavior
// TODO: Consider adding functions for working with cell ranges (e.g., expanding or intersecting ranges)
// TODO: Optimize the performance of functions that may be called frequently