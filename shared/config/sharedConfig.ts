import { ERROR_MESSAGES } from '../constants/errorMessages';

/**
 * Shared configuration settings for the Excel-like application.
 * This object provides a centralized location for managing global configuration options
 * that can be used across different parts of the application.
 */
export const SharedConfig = {
    // Spreadsheet limits
    MAX_ROWS: 1048576, // Maximum number of rows (Excel 2019 limit)
    MAX_COLUMNS: 16384, // Maximum number of columns (Excel 2019 limit)
    
    // UI settings
    DEFAULT_FONT_SIZE: 11,
    DEFAULT_FONT_FAMILY: 'Calibri',
    
    // Formula settings
    MAX_FORMULA_LENGTH: 8192, // Maximum characters in a formula
    
    // Cell settings
    MAX_CELL_CONTENT_LENGTH: 32767, // Maximum characters in a cell
    
    // Application settings
    AUTOSAVE_INTERVAL: 300000, // Autosave interval in milliseconds (5 minutes)
    MAX_UNDO_STEPS: 100, // Maximum number of undo steps
    
    // Number formatting
    DEFAULT_DECIMAL_PLACES: 2,
    
    // Chart settings
    MAX_CHART_DATA_POINTS: 4000, // Maximum number of data points in a chart
};

/**
 * Retrieves the current configuration settings.
 * @returns {typeof SharedConfig} The current configuration object
 */
export function getConfig(): typeof SharedConfig {
    return SharedConfig;
}

/**
 * Updates the configuration settings with new values.
 * @param {Partial<typeof SharedConfig>} newConfig - Partial configuration object with updated values
 * @returns {typeof SharedConfig} The updated configuration object
 */
export function updateConfig(newConfig: Partial<typeof SharedConfig>): typeof SharedConfig {
    Object.assign(SharedConfig, newConfig);
    return SharedConfig;
}

// Human tasks (to be addressed by developers):
// TODO: Review and validate all configuration values to ensure they meet the application's requirements
// TODO: Consider adding environment-specific configurations (e.g., development, production)
// TODO: Implement a mechanism to load configuration from environment variables or a config file
// TODO: Add JSDoc comments for each configuration option to provide context and usage information
// TODO: Consider implementing a validation mechanism for configuration updates