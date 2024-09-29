// Import ExcelValue type from the types module
import { ExcelValue } from '../types';

/**
 * Base class for all custom Excel-like application errors
 */
export class ExcelError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExcelError';
    // Set the prototype explicitly to handle transpilation issues
    Object.setPrototypeOf(this, ExcelError.prototype);
  }
}

/**
 * Error class for formula-related errors
 */
export class FormulaError extends ExcelError {
  constructor(message: string) {
    super(message);
    this.name = 'FormulaError';
  }
}

/**
 * Error class for invalid cell references
 */
export class CellReferenceError extends ExcelError {
  constructor(message: string) {
    super(message);
    this.name = 'CellReferenceError';
  }
}

/**
 * Error class for data type mismatches
 */
export class DataTypeError extends ExcelError {
  expectedType: ExcelValue;
  actualType: ExcelValue;

  constructor(message: string, expectedType: ExcelValue, actualType: ExcelValue) {
    super(message);
    this.name = 'DataTypeError';
    this.expectedType = expectedType;
    this.actualType = actualType;
  }
}

/**
 * Error class for chart-related errors
 */
export class ChartError extends ExcelError {
  constructor(message: string) {
    super(message);
    this.name = 'ChartError';
  }
}

// Human tasks:
// TODO: Review the custom error classes and ensure they cover all necessary error scenarios for the Excel-like application
// TODO (Optional): Consider adding more specific error classes if needed based on the application's requirements
// TODO (Optional): Add JSDoc comments to classes and methods for better documentation