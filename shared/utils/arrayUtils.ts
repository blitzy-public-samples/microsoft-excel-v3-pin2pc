import { ExcelValue } from '../types/index';

/**
 * Utility functions for array operations commonly used in Excel-like applications.
 * These functions provide helper methods for manipulating and processing arrays of data,
 * which are essential for spreadsheet operations.
 */

/**
 * Flattens a multi-dimensional array into a single-dimensional array
 * @param array The input multi-dimensional array
 * @returns A flattened array containing all elements from the input array
 */
export function flatten(array: ExcelValue[][]): ExcelValue[] {
  // Check if the input is a valid array
  if (!Array.isArray(array)) {
    throw new Error('Input must be an array');
  }

  // Use Array.prototype.flat() with Infinity as the depth to flatten the array completely
  return array.flat(Infinity) as ExcelValue[];
}

/**
 * Returns an array with unique values from the input array
 * @param array The input array
 * @returns An array containing only unique values from the input array
 */
export function unique(array: ExcelValue[]): ExcelValue[] {
  // Check if the input is a valid array
  if (!Array.isArray(array)) {
    throw new Error('Input must be an array');
  }

  // Use Set to remove duplicate values
  return Array.from(new Set(array));
}

/**
 * Sorts an array of ExcelValues in ascending or descending order
 * @param array The input array to be sorted
 * @param ascending A boolean indicating whether to sort in ascending (true) or descending (false) order
 * @returns A new sorted array based on the input array and sort order
 */
export function sort(array: ExcelValue[], ascending: boolean = true): ExcelValue[] {
  // Check if the input is a valid array
  if (!Array.isArray(array)) {
    throw new Error('Input must be an array');
  }

  // Create a copy of the input array to avoid modifying the original
  const sortedArray = [...array];

  // Use Array.prototype.sort() with a custom compare function that handles different ExcelValue types
  sortedArray.sort((a, b) => {
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }
    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b);
    }
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() - b.getTime();
    }
    // For mixed types or unsupported types, convert to string and compare
    return String(a).localeCompare(String(b));
  });

  // If ascending is false, reverse the sorted array
  return ascending ? sortedArray : sortedArray.reverse();
}

/**
 * Transposes a 2D array (matrix)
 * @param matrix The input 2D array to be transposed
 * @returns A new 2D array with rows and columns swapped
 */
export function transpose(matrix: ExcelValue[][]): ExcelValue[][] {
  // Check if the input is a valid 2D array
  if (!Array.isArray(matrix) || !Array.isArray(matrix[0])) {
    throw new Error('Input must be a 2D array');
  }

  // Create a new array with the number of columns in the original array
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result: ExcelValue[][] = Array.from({ length: cols }, () => new Array(rows));

  // Iterate through the original array, populating the new array with transposed values
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = matrix[i][j];
    }
  }

  return result;
}

// Human tasks:
// TODO: Implement error handling for edge cases in array operations
// TODO: Optimize the sort function for large arrays if performance issues are identified
// TODO: Add unit tests for each array utility function
// TODO: Consider adding more array utility functions as needed for Excel-like operations