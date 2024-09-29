/**
 * This file contains constant values used throughout the Excel API.
 * It defines various string literals, numeric values, and other constants
 * that are used for API endpoints, error messages, rate limiting, and other API-related functionalities.
 */

// API version
export const API_VERSION = 'v1';

// Base URL for the API
export const BASE_URL = 'https://api.excel.com';

// API endpoints
export const ENDPOINTS = {
    WORKBOOKS: '/workbooks',
    WORKSHEETS: '/worksheets',
    CELLS: '/cells',
    FORMULAS: '/formulas',
    CHARTS: '/charts',
    USERS: '/users'
};

// HTTP methods
export const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
};

// HTTP status codes
export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

// Error messages
export const ERROR_MESSAGES = {
    INVALID_REQUEST: 'Invalid request',
    UNAUTHORIZED_ACCESS: 'Unauthorized access',
    RESOURCE_NOT_FOUND: 'Resource not found',
    INTERNAL_ERROR: 'Internal server error'
};

// Rate limiting constants
export const RATE_LIMIT = {
    REQUESTS_PER_MINUTE: 60,
    BURST: 10
};

// Pagination constants
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100
};

// Request timeout (in milliseconds)
export const TIMEOUT = {
    REQUEST_TIMEOUT_MS: 30000 // 30 seconds
};

// Common headers
export const HEADERS = {
    CONTENT_TYPE: 'Content-Type',
    AUTHORIZATION: 'Authorization',
    API_KEY: 'X-API-Key'
};

// Human tasks (commented as requested)
/**
 * TODO: Human tasks
 * 1. Review and adjust API rate limiting constants based on expected traffic and server capacity
 * 2. Confirm the API version number and update if necessary
 * 3. Verify that all necessary API endpoints are included in the ENDPOINTS constant
 */