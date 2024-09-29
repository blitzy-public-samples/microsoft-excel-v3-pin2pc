import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../types/apiTypes';
import { CustomError } from '../../shared/errors/customErrors';

// Interface for configurable options of the rate limiter
interface RateLimiterOptions {
  windowMs: number;
  max: number;
  standardHeaders: boolean;
  legacyHeaders: boolean;
  message: string;
}

// Default options for the rate limiter
const DEFAULT_RATE_LIMIT_OPTIONS: RateLimiterOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests, please try again later.',
};

/**
 * Factory function to create a rate limiter middleware with configurable options
 * @param options - Custom options for the rate limiter
 * @returns Express middleware function for rate limiting
 */
export const createRateLimiter = (options?: Partial<RateLimiterOptions>) => {
  const mergedOptions = { ...DEFAULT_RATE_LIMIT_OPTIONS, ...options };

  return rateLimit({
    windowMs: mergedOptions.windowMs,
    max: mergedOptions.max,
    standardHeaders: mergedOptions.standardHeaders,
    legacyHeaders: mergedOptions.legacyHeaders,
    message: mergedOptions.message,
    handler: (req: Request, res: Response) => {
      const apiResponse: ApiResponse = {
        success: false,
        message: mergedOptions.message,
        error: new CustomError('RateLimitExceeded', 429, mergedOptions.message),
      };
      res.status(429).json(apiResponse);
    },
  });
};

/**
 * Express middleware function for applying rate limiting to routes
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction
 */
export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const limiter = createRateLimiter();
  limiter(req, res, next);
};

// Export the interface for use in other parts of the application
export { RateLimiterOptions };

// Human tasks (commented):
/*
TODO: Required - Determine appropriate rate limit values for different API endpoints based on expected usage patterns
TODO: Required - Implement IP-based rate limiting or user-based rate limiting depending on authentication strategy
TODO: Optional - Consider implementing different rate limit tiers for various user roles or subscription levels
TODO: Optional - Evaluate the need for distributed rate limiting if the application is deployed across multiple servers
*/