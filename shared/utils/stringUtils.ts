import { ExcelValue } from '../types/index';

/**
 * Removes leading and trailing whitespace from a string
 * @param input The input string to trim
 * @returns The trimmed string
 */
export function trimString(input: string): string {
    return input.trim();
}

/**
 * Capitalizes the first letter of a string
 * @param input The input string to capitalize
 * @returns The capitalized string
 */
export function capitalizeString(input: string): string {
    if (!input) return input;
    return input.charAt(0).toUpperCase() + input.slice(1);
}

/**
 * Formats a cell value as a string based on its type
 * @param value The cell value to format
 * @returns Formatted string representation of the cell value
 */
export function formatCellValue(value: ExcelValue): string {
    if (typeof value === 'number') {
        // Format number with appropriate decimal places
        return value.toFixed(2);
    } else if (value instanceof Date) {
        // Format date according to the application's date format settings
        return value.toISOString().split('T')[0]; // Simple ISO date format (YYYY-MM-DD)
    } else if (typeof value === 'boolean') {
        return value ? 'TRUE' : 'FALSE';
    } else if (typeof value === 'string') {
        return value;
    } else if (typeof value === 'object' && value !== null) {
        if ('formula' in value) {
            // Assuming Formula type has a 'formula' property
            return value.formula;
        } else if ('type' in value && value.type === 'Chart') {
            // Assuming ChartOptions type has a 'type' property set to 'Chart'
            return '[Chart]';
        }
    }
    // For any other type, return an empty string or appropriate placeholder
    return '';
}

/**
 * Extracts the column name from a cell address (e.g., 'A' from 'A1')
 * @param cellAddress The cell address to extract the column name from
 * @returns The column name
 */
export function extractColumnName(cellAddress: string): string {
    const match = cellAddress.match(/^[A-Z]+/);
    return match ? match[0] : '';
}

/**
 * Extracts the row number from a cell address (e.g., '1' from 'A1')
 * @param cellAddress The cell address to extract the row number from
 * @returns The row number
 */
export function extractRowNumber(cellAddress: string): number {
    const match = cellAddress.match(/\d+$/);
    return match ? parseInt(match[0], 10) : NaN;
}

// Human tasks:
// TODO: Review and potentially expand the string utility functions based on specific needs of the Excel-like application
// TODO: Implement robust error handling for edge cases in string manipulation
// TODO: Consider adding localization support for string formatting, especially in the formatCellValue function