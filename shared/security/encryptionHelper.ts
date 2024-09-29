import { User } from '../types/user';
import crypto from 'crypto';

/**
 * This file provides utility functions for encryption and decryption operations
 * used throughout the Microsoft Excel application to ensure data security.
 */

/**
 * Encrypts sensitive data using AES-256 encryption
 * @param data The data to be encrypted
 * @param key The encryption key
 * @returns Encrypted data as a base64 encoded string
 */
export function encryptData(data: string, key: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('base64');
}

/**
 * Decrypts data that was encrypted using the encryptData function
 * @param encryptedData The encrypted data as a base64 encoded string
 * @param key The decryption key
 * @returns Decrypted data as a UTF-8 string
 */
export function decryptData(encryptedData: string, key: string): string {
    const textParts = encryptedData.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

/**
 * Hashes a password using a secure one-way hashing algorithm
 * @param password The password to be hashed
 * @returns Hashed password
 */
export function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

/**
 * Verifies a password against a stored hash
 * @param password The password to be verified
 * @param storedHash The stored hash to compare against
 * @returns True if the password matches, false otherwise
 */
export function verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
}

/**
 * Generates a secure encryption key
 * @returns A secure encryption key as a base64 encoded string
 */
export function generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('base64');
}

/**
 * Encrypts sensitive user data
 * @param user The user object containing sensitive data
 * @param encryptionKey The encryption key
 * @returns An object with encrypted user data
 */
export function encryptUserData(user: User, encryptionKey: string): { encryptedEmail: string } {
    const encryptedEmail = encryptData(user.email, encryptionKey);
    return { encryptedEmail };
}

/**
 * Decrypts encrypted user data
 * @param encryptedUserData An object with encrypted user data
 * @param encryptionKey The decryption key
 * @returns An object with decrypted user data
 */
export function decryptUserData(encryptedUserData: { encryptedEmail: string }, encryptionKey: string): { email: string } {
    const email = decryptData(encryptedUserData.encryptedEmail, encryptionKey);
    return { email };
}

// Human tasks:
// TODO: Review and approve the encryption methods and key sizes used in the encryption helper
// TODO: Ensure that the encryption helper complies with relevant data protection regulations (e.g., GDPR, CCPA)
// TODO: Conduct a security audit of the encryption helper implementation