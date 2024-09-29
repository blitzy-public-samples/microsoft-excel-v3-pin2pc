import { BaseModel } from '../../shared/models/baseModel';
import { User, UserRole, AuthenticationType, UserPreferences } from '../../shared/types/user';
import { trimString, capitalizeString } from '../../shared/utils/stringUtils';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserModel extends BaseModel implements User {
  name: string;
  email: string;
  authenticationType: AuthenticationType;
  roles: UserRole[];
  preferences: UserPreferences;

  constructor(userData: Partial<User>) {
    super(userData);
    this.roles = userData.roles || [];
    this.preferences = userData.preferences || {};
    this.setName(userData.name || '');
    this.setEmail(userData.email || '');
    this.authenticationType = userData.authenticationType || AuthenticationType.Local;
    if (userData.roles) this.roles = userData.roles;
    if (userData.preferences) this.preferences = userData.preferences;
  }

  setName(name: string): void {
    const trimmedName = trimString(name);
    this.name = capitalizeString(trimmedName);
  }

  setEmail(email: string): void {
    const trimmedEmail = trimString(email);
    if (this.isValidEmail(trimmedEmail)) {
      this.email = trimmedEmail;
    } else {
      throw new Error(ERROR_MESSAGES.INVALID_VALUE_ERROR);
    }
  }

  addRole(role: UserRole): void {
    if (!this.roles.includes(role)) {
      this.roles.push(role);
    }
  }

  removeRole(role: UserRole): void {
    this.roles = this.roles.filter(r => r !== role);
  }

  updatePreferences(newPreferences: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...newPreferences };
  }

  validate(): boolean {
    const baseIsValid = super.validate();
    const nameIsValid = !!this.name && this.name.length > 0;
    const emailIsValid = !!this.email && this.isValidEmail(this.email);
    const authTypeIsValid = Object.values(AuthenticationType).includes(this.authenticationType);
    const rolesAreValid = this.roles.length > 0;

    return baseIsValid && nameIsValid && emailIsValid && authTypeIsValid && rolesAreValid;
  }

  private isValidEmail(email: string): boolean {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Human tasks:
// TODO: Implement robust email validation logic in the setEmail method
// TODO: Review and potentially expand the UserPreferences interface based on specific Excel application requirements
// TODO: Implement unit tests for the UserModel class
// TODO: Consider adding methods for password hashing and verification if not handled by a separate authentication service