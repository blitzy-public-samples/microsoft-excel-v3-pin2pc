import { SharedConfig } from '../config/sharedConfig';
import { ExcelError } from '../errors/customErrors';

// Enum for log levels
enum LogLevel {
    ERROR = 'ERROR',
    WARN = 'WARN',
    INFO = 'INFO',
    DEBUG = 'DEBUG'
}

class LoggingService {
    private static instance: LoggingService;
    private currentLogLevel: LogLevel;

    private constructor() {
        // Initialize with default log level (assuming it's set in SharedConfig)
        this.currentLogLevel = SharedConfig.DEFAULT_LOG_LEVEL || LogLevel.INFO;
    }

    public static getInstance(): LoggingService {
        if (!LoggingService.instance) {
            LoggingService.instance = new LoggingService();
        }
        return LoggingService.instance;
    }

    private isLogLevelEnabled(level: LogLevel): boolean {
        const logLevels = Object.values(LogLevel);
        return logLevels.indexOf(level) <= logLevels.indexOf(this.currentLogLevel);
    }

    private formatMessage(level: LogLevel, message: string, args: any[]): string {
        const timestamp = new Date().toISOString();
        const formattedArgs = args.map(arg => JSON.stringify(arg)).join(' ');
        return `[${timestamp}] [${level}] ${message} ${formattedArgs}`;
    }

    public log(level: LogLevel, message: string, ...args: any[]): void {
        if (this.isLogLevelEnabled(level)) {
            const formattedMessage = this.formatMessage(level, message, args);
            console.log(formattedMessage);

            // TODO: Implement remote logging service integration
            // if (SharedConfig.REMOTE_LOGGING_ENABLED) {
            //     this.sendToRemoteLoggingService(formattedMessage);
            // }
        }
    }

    public error(message: string | Error, ...args: any[]): void {
        if (message instanceof Error) {
            this.log(LogLevel.ERROR, message.message, ...args, { stack: message.stack });
        } else {
            this.log(LogLevel.ERROR, message, ...args);
        }
    }

    public warn(message: string, ...args: any[]): void {
        this.log(LogLevel.WARN, message, ...args);
    }

    public info(message: string, ...args: any[]): void {
        this.log(LogLevel.INFO, message, ...args);
    }

    public debug(message: string, ...args: any[]): void {
        this.log(LogLevel.DEBUG, message, ...args);
    }

    public setLogLevel(level: LogLevel): void {
        this.currentLogLevel = level;
        this.info(`Log level changed to ${level}`);
    }

    // private sendToRemoteLoggingService(message: string): void {
    //     // TODO: Implement remote logging service integration
    // }
}

export const logger = LoggingService.getInstance();

// Human tasks:
// TODO: Implement a remote logging service integration
// TODO: Add log rotation functionality for file-based logging
// TODO: Implement log filtering based on categories or tags
// TODO: Add unit tests for the logging service