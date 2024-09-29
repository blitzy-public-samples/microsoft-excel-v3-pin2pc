import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../types/apiTypes';
import { IApiService } from '../interfaces/IApiService';
import { apiConfig } from '../config/apiConfig';
import { verifyToken, decodeToken } from '../security/apiSecurity';
import { UserRole } from '../../shared/types/user';
import { AuthorizationType } from '../../shared/security/authorizationTypes';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // Extract the JWT token from the Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            const response: ApiResponse = { success: false, message: 'No token provided' };
            res.status(401).json(response);
            return;
        }

        // Verify the token using the verifyToken function
        const isValid = verifyToken(token);

        if (!isValid) {
            const response: ApiResponse = { success: false, message: 'Invalid token' };
            res.status(401).json(response);
            return;
        }

        // If the token is valid, decode it and attach the user information to the request object
        const decodedToken = decodeToken(token);
        (req as any).user = decodedToken;

        // Call next() to proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        const response: ApiResponse = { success: false, message: 'Authentication failed' };
        res.status(401).json(response);
    }
};

export const authorize = (authType: AuthorizationType, allowedRoles: UserRole[]): (req: Request, res: Response, next: NextFunction) => void => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const user = (req as any).user;

            if (!user || !user.role) {
                const response: ApiResponse = { success: false, message: 'User not authenticated or role not found' };
                res.status(403).json(response);
                return;
            }

            if (allowedRoles.includes(user.role)) {
                next();
            } else {
                const response: ApiResponse = { success: false, message: 'User not authorized' };
                res.status(403).json(response);
            }
        } catch (error) {
            console.error('Authorization error:', error);
            const response: ApiResponse = { success: false, message: 'Authorization failed' };
            res.status(403).json(response);
        }
    };
};

// Human tasks:
// TODO: Implement proper error handling and logging for authentication and authorization failures
// TODO: Review and enhance the token verification process for additional security measures (e.g., token expiration, refresh tokens)
// TODO: Consider implementing rate limiting to prevent abuse of the API
// TODO: Evaluate the need for additional authorization checks based on resource ownership (e.g., workbook access rights)