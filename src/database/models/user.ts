import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { DbTypes } from '../types/dbTypes';
import { DB_CONSTANTS } from '../constants/dbConstants';

export class User {
  id: string;
  username: string;
  email: string;
  private passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  role: DbTypes.UserRole;
  preferences: DbTypes.UserPreferences;

  constructor(userData: DbTypes.UserCreate) {
    this.id = uuidv4();
    this.username = userData.username;
    this.email = userData.email;
    this.role = userData.role;
    this.passwordHash = this.hashPassword(userData.password);
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.preferences = this.initializeDefaultPreferences();
  }

  private hashPassword(password: string): string {
    // TODO: Implement proper error handling for password hashing
    const salt = bcrypt.genSaltSync(DB_CONSTANTS.SALT_ROUNDS);
    return bcrypt.hashSync(password, salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    // TODO: Implement proper error handling for password validation
    return bcrypt.compare(password, this.passwordHash);
  }

  async updatePassword(newPassword: string): Promise<void> {
    // TODO: Implement proper error handling for password update
    this.passwordHash = this.hashPassword(newPassword);
    this.updatedAt = new Date();
  }

  updatePreferences(newPreferences: Partial<DbTypes.UserPreferences>): void {
    this.preferences = { ...this.preferences, ...newPreferences };
    this.updatedAt = new Date();
  }

  toJSON(): DbTypes.User {
    const { passwordHash, ...userWithoutPassword } = this;
    return userWithoutPassword as DbTypes.User;
  }

  private initializeDefaultPreferences(): DbTypes.UserPreferences {
    // TODO: Review and enhance the user preferences structure
    return {
      theme: 'light',
      language: 'en',
      notifications: true,
      // Add more Excel-specific settings here
    };
  }

  // TODO: Implement a method for handling user account lockout after multiple failed login attempts
  // TODO: Consider adding support for multi-factor authentication
}

// Human tasks:
// 1. Implement proper error handling for password hashing and validation
// 2. Review and enhance the user preferences structure to ensure it covers all necessary Excel-specific settings
// 3. Implement a method for handling user account lockout after multiple failed login attempts
// 4. Consider adding support for multi-factor authentication