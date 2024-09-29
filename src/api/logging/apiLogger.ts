import { log, error, warn, info, debug, setLogLevel, LogLevel } from '../../../shared/services/loggingService';
import { ApiConfig } from '../config/apiConfig';

/**
 * Logs an API-specific message with the specified log level
 * @param level The log level
 * @param message The message to log
 * @param args Additional arguments to include in the log
 */
export function apiLog(level: LogLevel, message: string, ...args: any[]): void {
    // Format the message with API-specific context (e.g., request ID, endpoint)
    const formattedMessage = `[API] ${message}`;
    
    // Call the appropriate log function from the shared logging service
    switch (level) {
        case LogLevel.ERROR:
            error(formattedMessage, ...args);
            break;
        case LogLevel.WARN:
            warn(formattedMessage, ...args);
            break;
        case LogLevel.INFO:
            info(formattedMessage, ...args);
            break;
        case LogLevel.DEBUG:
            debug(formattedMessage, ...args);
            break;
        default:
            log(level, formattedMessage, ...args);
    }

    // If configured, perform API-specific logging actions (e.g., log to a separate API log file)
    if (ApiConfig.separateApiLogging) {
        // Implementation for separate API logging would go here
    }
}

/**
 * Logs an API-specific error message
 * @param message The error message or Error object
 * @param args Additional arguments to include in the log
 */
export function apiError(message: string | Error, ...args: any[]): void {
    const errorMessage = message instanceof Error ? message.message : message;
    const stackTrace = message instanceof Error ? message.stack : undefined;

    apiLog(LogLevel.ERROR, errorMessage, ...args, { stackTrace });

    // Perform any API-specific error logging actions (e.g., increment error count metrics)
    // Implementation for API-specific error logging would go here
}

/**
 * Logs an API-specific warning message
 * @param message The warning message
 * @param args Additional arguments to include in the log
 */
export function apiWarn(message: string, ...args: any[]): void {
    apiLog(LogLevel.WARN, message, ...args);
}

/**
 * Logs an API-specific informational message
 * @param message The info message
 * @param args Additional arguments to include in the log
 */
export function apiInfo(message: string, ...args: any[]): void {
    apiLog(LogLevel.INFO, message, ...args);
}

/**
 * Logs an API-specific debug message
 * @param message The debug message
 * @param args Additional arguments to include in the log
 */
export function apiDebug(message: string, ...args: any[]): void {
    apiLog(LogLevel.DEBUG, message, ...args);
}

/**
 * Sets the current log level for API logging
 * @param level The log level to set
 */
export function setApiLogLevel(level: LogLevel): void {
    // Call setLogLevel from the shared logging service
    setLogLevel(level);

    // Update any API-specific logging configurations
    if (ApiConfig.separateApiLogging) {
        // Implementation for updating API-specific logging configurations would go here
    }
}

/**
 * Logs information about an incoming API request
 * @param req The request object
 */
export function logApiRequest(req: any): void {
    const { method, url, headers } = req;
    apiInfo(`Incoming ${method} request to ${url}`, { headers });
}

/**
 * Logs information about an outgoing API response
 * @param res The response object
 */
export function logApiResponse(res: any): void {
    const { statusCode, headers } = res;
    apiInfo(`Outgoing response with status ${statusCode}`, { headers });
}

// List of human tasks
/**
 * Human tasks:
 * 1. Implement API-specific log filtering mechanism (Optional)
 * 2. Add integration with API monitoring tools (e.g., Prometheus, Grafana) (Required)
 * 3. Implement log anonymization for sensitive API data (Required)
 * 4. Create unit tests for API-specific logging functions (Required)
 */