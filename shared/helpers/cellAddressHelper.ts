// Import types from the cell module
import { CellReference, CellRange } from '../types/cell';

/**
 * Converts a column number to its corresponding letter representation.
 * @param column - The column number to convert.
 * @returns The letter representation of the column.
 */
export function columnToLetter(column: number): string {
  let letter = '';
  while (column > 0) {
    const remainder = (column - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    column = Math.floor((column - 1) / 26);
  }
  return letter;
}

/**
 * Converts a column letter representation to its corresponding number.
 * @param letter - The column letter to convert.
 * @returns The numeric representation of the column.
 */
export function letterToColumn(letter: string): number {
  let column = 0;
  const length = letter.length;
  for (let i = 0; i < length; i++) {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
  }
  return column;
}

/**
 * Converts a CellReference object to its string representation.
 * @param cellRef - The CellReference object to convert.
 * @returns The string representation of the cell reference.
 */
export function cellReferenceToString(cellRef: CellReference): string {
  return `${cellRef.column}${cellRef.row}`;
}

/**
 * Converts a string cell reference to a CellReference object.
 * @param cellRefString - The string cell reference to convert.
 * @returns The CellReference object.
 */
export function stringToCellReference(cellRefString: string): CellReference {
  const match = cellRefString.match(/^([A-Z]+)(\d+)$/);
  if (!match) {
    throw new Error('Invalid cell reference string');
  }
  return {
    column: match[1],
    row: parseInt(match[2], 10)
  };
}

/**
 * Converts a CellRange object to its string representation.
 * @param range - The CellRange object to convert.
 * @returns The string representation of the cell range.
 */
export function cellRangeToString(range: CellRange): string {
  return `${cellReferenceToString(range.start)}:${cellReferenceToString(range.end)}`;
}

/**
 * Converts a string cell range to a CellRange object.
 * @param rangeString - The string cell range to convert.
 * @returns The CellRange object.
 */
export function stringToCellRange(rangeString: string): CellRange {
  const [start, end] = rangeString.split(':');
  return {
    start: stringToCellReference(start),
    end: stringToCellReference(end)
  };
}

/**
 * Checks if a given string is a valid cell reference.
 * @param cellRefString - The string to check.
 * @returns True if the string is a valid cell reference, false otherwise.
 */
export function isValidCellReference(cellRefString: string): boolean {
  return /^[A-Z]+\d+$/.test(cellRefString);
}

/**
 * Checks if a given string is a valid cell range.
 * @param rangeString - The string to check.
 * @returns True if the string is a valid cell range, false otherwise.
 */
export function isValidCellRange(rangeString: string): boolean {
  const parts = rangeString.split(':');
  if (parts.length !== 2) return false;
  
  const [start, end] = parts;
  if (!isValidCellReference(start) || !isValidCellReference(end)) return false;
  
  const startRef = stringToCellReference(start);
  const endRef = stringToCellReference(end);
  
  return letterToColumn(startRef.column) <= letterToColumn(endRef.column) && startRef.row <= endRef.row;
}

// Human tasks:
// TODO: Review and validate the cell address helper functions to ensure they cover all necessary use cases
// TODO: Consider adding functions for working with absolute and relative cell references (e.g., $A$1, A$1, $A1)
// TODO: Implement error handling and input validation for edge cases