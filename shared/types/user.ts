/**
 * This file defines the TypeScript types and interfaces related to user data in the Microsoft Excel application.
 */

/**
 * Enum representing the possible roles a user can have in relation to a workbook
 */
export enum UserRole {
  Owner = 'Owner',
  Editor = 'Editor',
  Viewer = 'Viewer',
  Commenter = 'Commenter'
}

/**
 * Enum representing the different authentication methods supported
 */
export enum AuthenticationType {
  MicrosoftAccount = 'MicrosoftAccount',
  AzureActiveDirectory = 'AzureActiveDirectory',
  SingleSignOn = 'SingleSignOn'
}

/**
 * Interface representing a user in the Excel application
 */
export interface User {
  id: string;
  name: string;
  email: string;
  authenticationType: AuthenticationType;
  roles: UserRole[];
}

/**
 * Interface representing user preferences
 */
export interface UserPreferences {
  theme: string;
  language: string;
  dateFormat: string;
  numberFormat: string;
}