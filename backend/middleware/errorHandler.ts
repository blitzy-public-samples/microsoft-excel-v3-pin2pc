import { Request, Response, NextFunction } from 'express';
import { getConfig } from '../config/environment';

/**
 * Custom error class for handling application-specific errors
 */
export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'CustomError';
  }
}

/**
 * Error handling middleware for the Microsoft Excel backend API
 * @param error - The error object
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The next middleware function
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Get the current environment configuration
  const config = getConfig();

  // Log the error (with stack trace in development)
  if (config.environment === 'development') {
    console.error('Error:', error.message, '\nStack:', error.stack);
  } else {
    console.error('Error:', error.message);
  }

  // Determine the status code based on the error type
  let statusCode = 500;
  if (error instanceof CustomError) {
    statusCode = error.statusCode;
  }

  // Prepare the error response object
  const errorResponse = {
    error: {
      message: error.message,
      ...(config.environment === 'development' && { stack: error.stack }),
    },
  };

  // Send the error response with appropriate status code
  res.status(statusCode).json(errorResponse);
};

// Human tasks (commented as requested):
/**
 * TODO: Human tasks
 * 1. [Required] Implement error logging service or integration with a monitoring tool
 * 2. [Required] Define and document all possible CustomError types and their corresponding status codes
 * 3. [Optional] Review and enhance error messages for better client-side error handling
 */