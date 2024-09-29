import { CellValue, CellAddress, CellRange, CELL_TYPES } from '../types/SpreadsheetTypes';
import { CELL_TYPE_REGEX, FORMULA_REGEX } from '../constants/AppConstants';

/**
 * DataValidator class provides utility functions for validating data inputs
 * and ensuring data integrity within the Excel mobile application.
 */
export class DataValidator {
  /**
   * Validates a cell value based on its type and format
   * @param value The value to be validated
   * @param type The expected cell type
   * @returns True if the value is valid for the given type, false otherwise
   */
  static validateCellValue(value: CellValue, type: CELL_TYPES): boolean {
    // Check if the value is null or undefined
    if (value === null || value === undefined) {
      return false;
    }

    // Switch based on the cell type
    switch (type) {
      case CELL_TYPES.NUMBER:
        return this.isValidNumber(value);
      case CELL_TYPES.DATE:
        return this.isValidDate(value);
      case CELL_TYPES.BOOLEAN:
        return typeof value === 'boolean';
      case CELL_TYPES.STRING:
        return typeof value === 'string';
      default:
        return false;
    }
  }

  /**
   * Validates a cell address format
   * @param address The cell address to be validated
   * @returns True if the address is valid, false otherwise
   */
  static validateCellAddress(address: string): boolean {
    return CELL_TYPE_REGEX.CELL_ADDRESS.test(address);
  }

  /**
   * Validates a cell range format
   * @param range The cell range to be validated
   * @returns True if the range is valid, false otherwise
   */
  static validateCellRange(range: string): boolean {
    const [startAddress, endAddress] = range.split(':');
    
    if (!startAddress || !endAddress) {
      return false;
    }

    // Validate each address using validateCellAddress
    if (!this.validateCellAddress(startAddress) || !this.validateCellAddress(endAddress)) {
      return false;
    }

    // Check if the start address is before the end address
    return this.isStartAddressBeforeEndAddress(startAddress, endAddress);
  }

  /**
   * Validates a formula string
   * @param formula The formula to be validated
   * @returns True if the formula is valid, false otherwise
   */
  static validateFormula(formula: string): boolean {
    if (!formula.startsWith('=')) {
      return false;
    }

    const trimmedFormula = formula.slice(1).trim();
    return FORMULA_REGEX.test(trimmedFormula);
  }

  /**
   * Validates a worksheet name
   * @param name The worksheet name to be validated
   * @returns True if the name is valid, false otherwise
   */
  static validateWorksheetName(name: string): boolean {
    if (!name || name.trim().length === 0) {
      return false;
    }

    // Check if the name length is within the allowed range (1-31 characters)
    if (name.length > 31) {
      return false;
    }

    // Check if the name doesn't contain invalid characters
    const invalidChars = /[\\\/\?\*\[\]]/;
    return !invalidChars.test(name);
  }

  /**
   * Checks if a value is a valid number
   * @param value The value to be checked
   * @returns True if the value is a valid number, false otherwise
   */
  private static isValidNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }

  /**
   * Checks if a value is a valid date
   * @param value The value to be checked
   * @returns True if the value is a valid date, false otherwise
   */
  private static isValidDate(value: any): boolean {
    if (value instanceof Date) {
      return !isNaN(value.getTime());
    }
    return false;
  }

  /**
   * Checks if the start address is before the end address in a cell range
   * @param startAddress The start address of the range
   * @param endAddress The end address of the range
   * @returns True if the start address is before the end address, false otherwise
   */
  private static isStartAddressBeforeEndAddress(startAddress: string, endAddress: string): boolean {
    const startCol = startAddress.replace(/[0-9]/g, '');
    const startRow = parseInt(startAddress.replace(/[A-Z]/g, ''), 10);
    const endCol = endAddress.replace(/[0-9]/g, '');
    const endRow = parseInt(endAddress.replace(/[A-Z]/g, ''), 10);

    if (startCol > endCol) {
      return false;
    }

    if (startCol === endCol && startRow > endRow) {
      return false;
    }

    return true;
  }
}

// Human tasks:
// TODO: Review and update the regex patterns for cell addresses and formulas in the AppConstants file
// TODO: Implement unit tests for each validation function
// TODO: Consider adding localization support for error messages