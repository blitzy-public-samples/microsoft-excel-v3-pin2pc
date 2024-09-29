/**
 * This file contains constant error messages used throughout the Excel-like application.
 * It provides a centralized location for managing error messages, ensuring consistency
 * and easy maintenance across the application.
 */

/**
 * A record of error messages keyed by their identifier.
 */
export const ERROR_MESSAGES: Record<string, string> = {
  FORMULA_PARSE_ERROR: "Error parsing formula. Please check the syntax and try again.",
  CELL_REFERENCE_ERROR: "Invalid cell reference. Please use the correct format (e.g., A1, B2).",
  DIVISION_BY_ZERO_ERROR: "Division by zero is not allowed.",
  INVALID_VALUE_ERROR: "The entered value is invalid for this operation.",
  CIRCULAR_REFERENCE_ERROR: "Circular reference detected. Please review your formulas.",
  CHART_DATA_ERROR: "Unable to create chart. Please check your data selection.",
  NETWORK_ERROR: "Network error. Please check your internet connection and try again.",
  UNAUTHORIZED_ERROR: "You are not authorized to perform this action.",
  FILE_NOT_FOUND_ERROR: "The requested file could not be found.",
  UNSUPPORTED_FILE_FORMAT_ERROR: "The file format is not supported.",
};

// Export individual error messages for convenient access
export const FORMULA_PARSE_ERROR = ERROR_MESSAGES.FORMULA_PARSE_ERROR;
export const CELL_REFERENCE_ERROR = ERROR_MESSAGES.CELL_REFERENCE_ERROR;
export const DIVISION_BY_ZERO_ERROR = ERROR_MESSAGES.DIVISION_BY_ZERO_ERROR;
export const INVALID_VALUE_ERROR = ERROR_MESSAGES.INVALID_VALUE_ERROR;
export const CIRCULAR_REFERENCE_ERROR = ERROR_MESSAGES.CIRCULAR_REFERENCE_ERROR;
export const CHART_DATA_ERROR = ERROR_MESSAGES.CHART_DATA_ERROR;
export const NETWORK_ERROR = ERROR_MESSAGES.NETWORK_ERROR;
export const UNAUTHORIZED_ERROR = ERROR_MESSAGES.UNAUTHORIZED_ERROR;
export const FILE_NOT_FOUND_ERROR = ERROR_MESSAGES.FILE_NOT_FOUND_ERROR;
export const UNSUPPORTED_FILE_FORMAT_ERROR = ERROR_MESSAGES.UNSUPPORTED_FILE_FORMAT_ERROR;

/**
 * TODO: Human Tasks
 * 1. Review and validate all error messages to ensure they cover all possible error scenarios in the application
 * 2. Ensure error messages are clear, concise, and user-friendly
 * 3. Consider adding localization support for error messages to enable multi-language support
 * 4. Add JSDoc comments for each error constant to provide context and usage information
 */