import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Encrypts sensitive data using AES-256 encryption
 * @param data The data to be encrypted
 * @param key The encryption key
 * @returns The encrypted data as a string
 */
export function encryptData(data: string, key: string): string {
  // Generate a random initialization vector (IV)
  const iv = crypto.randomBytes(16);
  
  // Create a cipher using the provided key and IV
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  
  // Encrypt the data
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Return the IV concatenated with the encrypted data
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypts data that was encrypted using the encryptData function
 * @param encryptedData The encrypted data
 * @param key The decryption key
 * @returns The decrypted data as a string
 */
export function decryptData(encryptedData: string, key: string): string {
  // Extract the IV from the encrypted data
  const textParts = encryptedData.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  
  // Create a decipher using the provided key and extracted IV
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  
  // Decrypt the data
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  // Return the decrypted data
  return decrypted.toString();
}

/**
 * Hashes a password using bcrypt
 * @param password The password to hash
 * @returns A promise that resolves to the hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate a salt using bcrypt
  const salt = await bcrypt.genSalt(10);
  
  // Hash the password with the generated salt
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // Return the hashed password
  return hashedPassword;
}

/**
 * Compares a plain-text password with a hashed password
 * @param plainTextPassword The plain-text password
 * @param hashedPassword The hashed password
 * @returns A promise that resolves to true if passwords match, false otherwise
 */
export async function comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
  // Use bcrypt to compare the plain-text password with the hashed password
  const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
  
  // Return the result of the comparison
  return isMatch;
}

/**
 * Generates a JSON Web Token (JWT) for user authentication
 * @param payload The payload to be included in the token
 * @param secretKey The secret key used to sign the token
 * @param options Additional options for token generation
 * @returns The generated JWT
 */
export function generateJWT(payload: object, secretKey: string, options?: jwt.SignOptions): string {
  // Use jsonwebtoken to sign the payload with the secret key and options
  const token = jwt.sign(payload, secretKey, options);
  
  // Return the generated token
  return token;
}

/**
 * Verifies a JSON Web Token (JWT)
 * @param token The token to verify
 * @param secretKey The secret key used to sign the token
 * @returns The decoded payload if the token is valid
 * @throws An error if verification fails
 */
export function verifyJWT(token: string, secretKey: string): object {
  try {
    // Use jsonwebtoken to verify the token with the secret key
    const decoded = jwt.verify(token, secretKey);
    
    // Return the decoded payload if verification is successful
    return decoded as object;
  } catch (error) {
    // Throw an error if verification fails
    throw new Error('Invalid token');
  }
}

// Human tasks (commented list)
/**
 * TODO: Human tasks for security considerations
 * 1. Review and approve the encryption key management strategy (Critical)
 * 2. Ensure compliance with relevant data protection regulations (e.g., GDPR, CCPA) (Required)
 * 3. Conduct a security audit of the implemented cryptographic functions (Required)
 */