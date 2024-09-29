import { UUID } from 'crypto';

// Importing types from worksheet and cell modules
// These imports assume that the Worksheet and Cell types will be defined in their respective files
import { Worksheet } from './worksheet';
import { Cell } from './cell';

/**
 * Represents a workbook in the Excel-like application
 */
export interface Workbook {
  id: string;
  name: string;
  worksheets: Worksheet[];
  owner: string;
  createdAt: Date;
  modifiedAt: Date;
  metadata: WorkbookMetadata;
  permissions: WorkbookPermissions;
}

/**
 * Contains metadata information for a workbook
 */
export interface WorkbookMetadata {
  author: string;
  company: string;
  keywords: string[];
  category: string;
  comments: string;
  status: string;
}

/**
 * Defines the permissions for a workbook
 */
export interface WorkbookPermissions {
  viewers: string[];
  editors: string[];
  isPublic: boolean;
  sharingLink: string;
}

/**
 * Defines the theme options for a workbook
 */
export type WorkbookTheme = {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
};

/**
 * Represents a version of a workbook for version control
 */
export type WorkbookVersion = {
  id: string;
  timestamp: Date;
  changes: WorkbookChange[];
};

/**
 * Represents a single change in a workbook for version control
 */
export type WorkbookChange = {
  type: 'cell' | 'worksheet' | 'metadata';
  id: string;
  before: any;
  after: any;
};

// Human tasks (commented as requested)
/**
 * TODO: Human tasks
 * 1. Review and validate the workbook types and interfaces to ensure they meet all requirements for the Excel-like application (Required)
 * 2. Determine if additional properties are needed for regulatory compliance or advanced features (Optional)
 * 3. Confirm the version control implementation and adjust the WorkbookVersion and WorkbookChange types if necessary (Required)
 */