import { getConfig } from '../config/environment';
import { User, AuthenticationType } from '../../shared/types/user';
import { generateJWT, hashPassword, comparePassword } from '../utils/securityHelpers';
import { UserRepository } from '../repositories/userRepository';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Constants for token expiration
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

export class AuthenticationService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async login(email: string, password: string, type: AuthenticationType): Promise<string> {
        // Retrieve user from the database
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        // Compare provided password with stored hashed password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        // Generate and return a JWT token
        return generateJWT(user, JWT_EXPIRATION);
    }

    async register(user: User): Promise<User> {
        // Check if user with the same email already exists
        const existingUser = await this.userRepository.findByEmail(user.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash the user's password
        user.password = await hashPassword(user.password);

        // Create a new user in the database
        const createdUser = await this.userRepository.create(user);

        // Return the created user object (without password)
        const { password, ...userWithoutPassword } = createdUser;
        return userWithoutPassword as User;
    }

    async refreshToken(refreshToken: string): Promise<string> {
        // Verify the refresh token
        try {
            const decoded = jwt.verify(refreshToken, getConfig().JWT_SECRET) as { id: string };
            const user = await this.userRepository.findById(decoded.id);

            if (!user) {
                throw new Error('User not found');
            }

            // Generate and return a new JWT token
            return generateJWT(user, JWT_EXPIRATION);
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    async logout(token: string): Promise<void> {
        // Add the token to a blacklist or invalidate it in the database
        // This implementation depends on how you want to handle token invalidation
        // For this example, we'll assume a method exists in the UserRepository
        await this.userRepository.invalidateToken(token);

        // Remove any associated refresh tokens
        // Again, this implementation depends on how you're storing refresh tokens
        await this.userRepository.removeRefreshTokens(token);
    }

    async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
        // Retrieve user from the database
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Verify the old password
        const isOldPasswordValid = await comparePassword(oldPassword, user.password);
        if (!isOldPasswordValid) {
            throw new Error('Invalid old password');
        }

        // Hash the new password
        const hashedNewPassword = await hashPassword(newPassword);

        // Update the user's password in the database
        await this.userRepository.updatePassword(userId, hashedNewPassword);

        return true;
    }
}

// Human tasks (commented)
/*
TODO: Implement multi-factor authentication support (Required)
TODO: Set up secure storage for refresh tokens (Critical)
TODO: Implement rate limiting for authentication attempts (Required)
TODO: Add support for social login providers (Microsoft Account, Google, etc.) (Optional)
TODO: Implement password reset functionality (Required)
TODO: Set up proper logging for authentication events (Required)
*/