import { Request, Response, NextFunction } from 'express';
import { getConfig } from '../config/environment';
import { User, AuthenticationType } from '../../shared/types/user';
import { verifyJWT } from '../utils/securityHelpers';

// Assuming JWT_SECRET is stored in the environment configuration
const JWT_SECRET = getConfig('JWT_SECRET');

/**
 * Express middleware function to authenticate incoming requests
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Extract the JWT token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1]; // Assuming Bearer token

        // Verify the JWT token
        const decodedToken = await verifyJWT(token, JWT_SECRET);

        // Attach the decoded user information to the request object
        req.user = decodedToken as User;

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

/**
 * Express middleware function to check if a user has the required role
 * @param requiredRoles - Array of roles that are allowed to access the route
 * @returns Middleware function that checks user roles
 */
export const authorize = (requiredRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const userRoles = (req.user as User).roles || [];

        if (requiredRoles.some(role => userRoles.includes(role))) {
            next();
        } else {
            res.status(403).json({ error: 'Insufficient permissions' });
        }
    };
};

// TODO: Implement proper error handling and logging for authentication failures
// TODO: Set up secure storage and rotation for the JWT_SECRET
// TODO: Implement refresh token mechanism for enhanced security
// TODO: Add support for multiple authentication methods (Microsoft Account, Azure AD, SSO)