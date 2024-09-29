import { UUID } from 'crypto';
import { Cell, CellRange } from './cell';

/**
 * Represents a single worksheet in a workbook
 */
export interface Worksheet {
    id: string;
    name: string;
    cells: Map<string, Cell>;
    metadata: WorksheetMetadata;
}

/**
 * Contains metadata information for a worksheet
 */
export interface WorksheetMetadata {
    rowCount: number;
    columnCount: number;
    rowHeights: Map<number, number>;
    columnWidths: Map<string, number>;
    isVisible: boolean;
    protection: WorksheetProtection | null;
}

/**
 * Defines the protection options for a worksheet
 */
export interface WorksheetProtection {
    isProtected: boolean;
    password: string | null;
    options: WorksheetProtectionOptions;
}

/**
 * Specifies which actions are allowed when a worksheet is protected
 */
export type WorksheetProtectionOptions = {
    selectLockedCells: boolean;
    selectUnlockedCells: boolean;
    formatCells: boolean;
    formatColumns: boolean;
    formatRows: boolean;
    insertColumns: boolean;
    insertRows: boolean;
    insertHyperlinks: boolean;
    deleteColumns: boolean;
    deleteRows: boolean;
    sort: boolean;
    useAutoFilter: boolean;
    usePivotTableReports: boolean;
};

/**
 * Represents a named range in a worksheet
 */
export type WorksheetRange = {
    name: string;
    range: CellRange;
};

// Human tasks:
// TODO: Review and validate the worksheet types and interfaces to ensure they meet all requirements for the Excel-like application
// TODO: Confirm if additional metadata properties are needed for advanced features or compliance
// TODO: Determine if any worksheet-level formulas or functions need to be included in the types