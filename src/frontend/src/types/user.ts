// This file defines frontend-specific TypeScript types and interfaces related to user data in the Microsoft Excel application, extending the shared user types.

// TODO: Import shared user types when available
// import { User, UserRole, AuthenticationType, UserPreferences } from '../../../shared/types/user';

// Placeholder for shared types (remove when imports are available)
type UserRole = string;
type AuthenticationType = string;
interface UserPreferences {}

// Frontend-specific user interface extending the shared User interface
export interface FrontendUser {
  id: string;
  name: string;
  email: string;
  authenticationType: AuthenticationType;
  roles: UserRole[];
  avatarUrl: string;
  lastLogin: Date;
  preferences: FrontendUserPreferences;
}

// Frontend-specific user preferences interface extending the shared UserPreferences interface
export interface FrontendUserPreferences extends UserPreferences {
  theme: string;
  language: string;
  dateFormat: string;
  numberFormat: string;
  sidebarCollapsed: boolean;
  formulaBarVisible: boolean;
  gridlinesVisible: boolean;
  zoomLevel: number;
}

// Interface representing the user's current session information
export interface UserSession {
  user: FrontendUser;
  token: string;
  expiresAt: Date;
}

/**
 * Function to check if a user is authorized for a specific action
 * @param user The FrontendUser to check authorization for
 * @param action The action to check authorization for
 * @returns A boolean indicating whether the user is authorized for the specified action
 */
export function isUserAuthorized(user: FrontendUser, action: string): boolean {
  // TODO: Implement authorization logic based on user roles and the required permissions for the action
  // This is a placeholder implementation
  return user.roles.includes('admin'); // Assume admin role has all permissions
}