import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import { getConfig } from '../config/environment';

// Constants for default rate limiting values
const DEFAULT_WINDOW_MS = 900000; // 15 minutes
const DEFAULT_MAX_REQUESTS = 100;

/**
 * Creates and configures the rate limiter middleware
 * @returns Configured rate limiter middleware
 */
const createRateLimiter = (): rateLimit.RateLimit => {
    const config = getConfig();
    
    // Create Redis client for storing rate limit data
    const redisClient = createClient({
        url: config.REDIS_URL,
        password: config.REDIS_PASSWORD
    });

    redisClient.on('error', (err) => console.error('Redis Client Error', err));

    // Configure rate limiter options
    const limiterOptions: rateLimit.Options = {
        windowMs: config.RATE_LIMIT_WINDOW_MS || DEFAULT_WINDOW_MS,
        max: config.RATE_LIMIT_MAX_REQUESTS || DEFAULT_MAX_REQUESTS,
        standardHeaders: true,
        legacyHeaders: false,
        store: new RedisStore({
            sendCommand: (...args: string[]) => redisClient.sendCommand(args),
        }),
        message: 'Too many requests, please try again later.',
    };

    // Create and return the rate limiter middleware
    return rateLimit(limiterOptions);
};

export default createRateLimiter;

// List of human tasks
/**
 * TODO: Human tasks
 * 1. Fine-tune rate limiting parameters based on expected API usage patterns
 * 2. Implement custom rate limiting rules for different API endpoints or user roles (Optional)
 * 3. Set up monitoring and alerting for rate limit violations
 */