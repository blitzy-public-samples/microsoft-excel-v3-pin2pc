/**
 * responseFormatter.ts
 * Utility functions for formatting API responses consistently across the Excel-like application
 */

// TODO: Import the ApiResponse type once it's defined
// import { ApiResponse } from '../types/apiTypes';

/**
 * Formats a successful API response
 * @param data - The data to be included in the response
 * @returns Formatted success response
 */
export function formatSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
  };
}

/**
 * Formats an error API response
 * @param errorMessage - The error message to be included in the response
 * @returns Formatted error response
 */
export function formatErrorResponse(errorMessage: string): ApiResponse<null> {
  return {
    success: false,
    data: null,
    error: errorMessage,
  };
}

/**
 * Formats a paginated API response
 * @param items - The array of items for the current page
 * @param totalCount - The total number of items across all pages
 * @param page - The current page number
 * @param pageSize - The number of items per page
 * @returns Formatted paginated response
 */
export function formatPaginatedResponse<T>(
  items: T[],
  totalCount: number,
  page: number,
  pageSize: number
): ApiResponse<{ items: T[]; totalCount: number; page: number; pageSize: number }> {
  return {
    success: true,
    data: {
      items,
      totalCount,
      page,
      pageSize,
    },
    error: null,
  };
}

// TODO: Define the ApiResponse type if not imported
type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
};

/**
 * Human tasks:
 * 1. Review and validate the response formatting functions to ensure they meet all API requirements (Required)
 * 2. Consider adding additional formatting functions for specific response types if needed (Optional)
 * 3. Implement error code handling if required by the API specification (Optional)
 */