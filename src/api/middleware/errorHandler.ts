import { Request, Response, NextFunction } from 'express';

// Since we don't have the actual implementation of ApiResponse and CustomError,
// we'll define interfaces for them based on the information in the JSON specification
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
}

interface ErrorResponse {
  status: number;
  message: string;
  stack?: string;
}

// Assuming CustomError extends Error and has a status property
class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type ErrorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => void;

const errorHandler: ErrorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  // Step 1: Check if the error is an instance of CustomError
  const isCustomError = error instanceof CustomError;

  // Step 2: If it's a CustomError, use its status code and message
  // Step 3: If it's not a CustomError, use a default 500 status code and generic error message
  const status = isCustomError ? (error as CustomError).status : 500;
  const message = isCustomError ? error.message : 'Internal Server Error';

  // Step 4: Log the error details for debugging purposes
  console.error('Error:', error);

  // Step 5: Send a standardized ApiResponse with error details
  const errorResponse: ErrorResponse = {
    status,
    message,
  };

  // Include stack trace in development environment
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
  }

  const apiResponse: ApiResponse<null> = {
    success: false,
    error: errorResponse,
  };

  res.status(status).json(apiResponse);
};

export default errorHandler;

// Human tasks (commented as requested):
/*
Human tasks:
1. Review error logging mechanism and ensure it meets security and privacy requirements (Required)
2. Determine if additional error types or custom errors need to be handled (Optional)
3. Consider implementing different error handling strategies for development and production environments (Optional)
*/