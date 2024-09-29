// This file defines TypeScript types and interfaces for database entities and operations
// used in the Excel application's database layer. It provides type definitions for
// workbooks, worksheets, cells, formulas, charts, and related operations.

// Import DB_TYPES from dbConstants (assuming it exists)
import { DB_TYPES } from '../constants/dbConstants';

// Union type of supported database types
export type DbType = typeof DB_TYPES[keyof typeof DB_TYPES];

// Type alias for ID fields
export type Id = string;

// Type alias for timestamp fields
export type Timestamp = number;

// Union type for possible cell values
export type CellValue = string | number | boolean | null;

// Interface for cell address
export interface CellAddress {
  column: string;
  row: number;
}

// Interface for Workbook entity
export interface Workbook {
  id: Id;
  name: string;
  ownerId: Id;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Type for creating a new Workbook
export type WorkbookCreate = Omit<Workbook, 'id' | 'createdAt' | 'updatedAt'>;

// Type for updating an existing Workbook
export type WorkbookUpdate = Partial<Omit<Workbook, 'id' | 'createdAt' | 'updatedAt'>>;

// Interface for Worksheet entity
export interface Worksheet {
  id: Id;
  workbookId: Id;
  name: string;
  index: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Type for creating a new Worksheet
export type WorksheetCreate = Omit<Worksheet, 'id' | 'createdAt' | 'updatedAt'>;

// Type for updating an existing Worksheet
export type WorksheetUpdate = Partial<Omit<Worksheet, 'id' | 'workbookId' | 'createdAt' | 'updatedAt'>>;

// Interface for Cell entity
export interface Cell {
  id: Id;
  worksheetId: Id;
  column: string;
  row: number;
  value: CellValue;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Type for creating a new Cell
export type CellCreate = Omit<Cell, 'id' | 'createdAt' | 'updatedAt'>;

// Type for updating an existing Cell
export type CellUpdate = Partial<Omit<Cell, 'id' | 'worksheetId' | 'createdAt' | 'updatedAt'>>;

// Interface for Formula entity
export interface Formula {
  id: Id;
  cellId: Id;
  expression: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Type for creating a new Formula
export type FormulaCreate = Omit<Formula, 'id' | 'createdAt' | 'updatedAt'>;

// Type for updating an existing Formula
export type FormulaUpdate = Partial<Omit<Formula, 'id' | 'cellId' | 'createdAt' | 'updatedAt'>>;

// Union type of supported chart types
export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'area';

// Interface for Chart entity
export interface Chart {
  id: Id;
  worksheetId: Id;
  name: string;
  type: ChartType;
  startCell: CellAddress;
  endCell: CellAddress;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Type for creating a new Chart
export type ChartCreate = Omit<Chart, 'id' | 'createdAt' | 'updatedAt'>;

// Type for updating an existing Chart
export type ChartUpdate = Partial<Omit<Chart, 'id' | 'worksheetId' | 'createdAt' | 'updatedAt'>>;

// Human tasks (commented as requested)
/*
Human tasks:
1. Review and validate the type definitions to ensure they cover all necessary attributes for each entity
2. Confirm that the types align with the database schema and any ORM requirements
3. Ensure that the types provide sufficient flexibility for future extensions and feature additions
*/