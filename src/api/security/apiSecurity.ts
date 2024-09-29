import { API_VERSION, HEADERS } from '../constants/apiConstants';
import { ApiResponse } from '../types/apiTypes';
import { IApiService } from '../interfaces/IApiService';
import { authorizationTypes } from '../../shared/security/authorizationTypes';
import { encryptionHelper } from '../../shared/security/encryptionHelper';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';

// Global constants
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '1h';

/**
 * Generates a JWT token for authenticated users
 * @param user - User object containing necessary information
 * @returns JWT token as a string
 */
export const generateToken = (user: { id: string; email: string; role: string }): string => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
};

/**
 * Verifies the validity of a JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload if valid, null otherwise
 */
export const verifyToken = (token: string): object | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as object;
    } catch (error) {
        return null;
    }
};

/**
 * Hashes a plain text password using bcrypt
 * @param password - Plain text password to hash
 * @returns Promise resolving to the hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

/**
 * Compares a plain text password with a hashed password
 * @param plainTextPassword - Plain text password to compare
 * @param hashedPassword - Hashed password to compare against
 * @returns Promise resolving to true if passwords match, false otherwise
 */
export const comparePassword = async (plainTextPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainTextPassword, hashedPassword);
};

/**
 * Middleware to authenticate API requests
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const authenticateRequest = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }

    (req as any).user = decodedToken;
    next();
};

/**
 * Middleware to authorize API requests based on user roles
 * @param allowedRoles - Array of roles allowed to access the resource
 * @returns Middleware function
 */
export const authorizeRequest = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const userRole = (req as any).user?.role;

        if (!userRole || !allowedRoles.includes(userRole)) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        next();
    };
};

/**
 * Encrypts sensitive data before storing or transmitting
 * @param data - Sensitive data to encrypt
 * @returns Encrypted data as a string
 */
export const encryptSensitiveData = (data: string): string => {
    return encryptionHelper.encrypt(data);
};

/**
 * Decrypts sensitive data after retrieval
 * @param encryptedData - Encrypted data to decrypt
 * @returns Decrypted data as a string
 */
export const decryptSensitiveData = (encryptedData: string): string => {
    return encryptionHelper.decrypt(encryptedData);
};

// Human tasks (commented)
/**
 * TODO: Human tasks for API security
 * 1. Review and update the JWT_SECRET and TOKEN_EXPIRATION environment variables for production use (Critical)
 * 2. Implement a secure key management solution for storing and rotating encryption keys (Required)
 * 3. Conduct a security audit of the authentication and authorization implementation (Required)
 * 4. Implement additional security measures such as rate limiting and IP whitelisting (Required)
 * 5. Set up monitoring and alerting for suspicious authentication activities (Required)
 */