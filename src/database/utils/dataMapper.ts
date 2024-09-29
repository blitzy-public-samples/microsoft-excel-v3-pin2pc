import {
  Workbook,
  Worksheet,
  Cell,
  Formula,
  Chart,
  WorkbookCreate,
  WorksheetCreate,
  CellCreate,
  FormulaCreate,
  ChartCreate,
  WorkbookUpdate,
  WorksheetUpdate,
  CellUpdate,
  FormulaUpdate,
  ChartUpdate
} from '../types/dbTypes';

/**
 * Maps an application Workbook model to a database Workbook model
 * @param workbook The application Workbook object
 * @returns A database-ready Workbook object (WorkbookCreate | WorkbookUpdate)
 */
export function mapWorkbookToDb(workbook: any): WorkbookCreate | WorkbookUpdate {
  // Extract relevant properties from the input workbook object
  const { id, name, createdAt, updatedAt, ownerId, ...otherProps } = workbook;

  // Transform properties if necessary (e.g., date to timestamp)
  const dbWorkbook: WorkbookCreate | WorkbookUpdate = {
    id,
    name,
    created_at: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
    updated_at: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
    owner_id: ownerId,
    ...otherProps
  };

  return dbWorkbook;
}

/**
 * Maps a database Workbook model to an application Workbook model
 * @param dbWorkbook The database Workbook object
 * @returns An application-ready Workbook object
 */
export function mapWorkbookFromDb(dbWorkbook: Workbook): any {
  // Extract all properties from the input dbWorkbook object
  const { id, name, created_at, updated_at, owner_id, ...otherProps } = dbWorkbook;

  // Transform properties if necessary (e.g., timestamp to Date)
  const appWorkbook = {
    id,
    name,
    createdAt: new Date(created_at),
    updatedAt: new Date(updated_at),
    ownerId: owner_id,
    ...otherProps
  };

  return appWorkbook;
}

/**
 * Maps an application Worksheet model to a database Worksheet model
 * @param worksheet The application Worksheet object
 * @returns A database-ready Worksheet object (WorksheetCreate | WorksheetUpdate)
 */
export function mapWorksheetToDb(worksheet: any): WorksheetCreate | WorksheetUpdate {
  // Extract relevant properties from the input worksheet object
  const { id, name, workbookId, index, ...otherProps } = worksheet;

  // Transform properties if necessary
  const dbWorksheet: WorksheetCreate | WorksheetUpdate = {
    id,
    name,
    workbook_id: workbookId,
    index,
    ...otherProps
  };

  return dbWorksheet;
}

/**
 * Maps a database Worksheet model to an application Worksheet model
 * @param dbWorksheet The database Worksheet object
 * @returns An application-ready Worksheet object
 */
export function mapWorksheetFromDb(dbWorksheet: Worksheet): any {
  // Extract all properties from the input dbWorksheet object
  const { id, name, workbook_id, index, ...otherProps } = dbWorksheet;

  // Transform properties if necessary
  const appWorksheet = {
    id,
    name,
    workbookId: workbook_id,
    index,
    ...otherProps
  };

  return appWorksheet;
}

/**
 * Maps an application Cell model to a database Cell model
 * @param cell The application Cell object
 * @returns A database-ready Cell object (CellCreate | CellUpdate)
 */
export function mapCellToDb(cell: any): CellCreate | CellUpdate {
  // Extract relevant properties from the input cell object
  const { id, worksheetId, row, column, value, dataType, ...otherProps } = cell;

  // Transform properties if necessary
  const dbCell: CellCreate | CellUpdate = {
    id,
    worksheet_id: worksheetId,
    row,
    column,
    value,
    data_type: dataType,
    ...otherProps
  };

  return dbCell;
}

/**
 * Maps a database Cell model to an application Cell model
 * @param dbCell The database Cell object
 * @returns An application-ready Cell object
 */
export function mapCellFromDb(dbCell: Cell): any {
  // Extract all properties from the input dbCell object
  const { id, worksheet_id, row, column, value, data_type, ...otherProps } = dbCell;

  // Transform properties if necessary
  const appCell = {
    id,
    worksheetId: worksheet_id,
    row,
    column,
    value,
    dataType: data_type,
    ...otherProps
  };

  return appCell;
}

/**
 * Maps an application Formula model to a database Formula model
 * @param formula The application Formula object
 * @returns A database-ready Formula object (FormulaCreate | FormulaUpdate)
 */
export function mapFormulaToDb(formula: any): FormulaCreate | FormulaUpdate {
  // Extract relevant properties from the input formula object
  const { id, cellId, expression, ...otherProps } = formula;

  // Transform properties if necessary
  const dbFormula: FormulaCreate | FormulaUpdate = {
    id,
    cell_id: cellId,
    expression,
    ...otherProps
  };

  return dbFormula;
}

/**
 * Maps a database Formula model to an application Formula model
 * @param dbFormula The database Formula object
 * @returns An application-ready Formula object
 */
export function mapFormulaFromDb(dbFormula: Formula): any {
  // Extract all properties from the input dbFormula object
  const { id, cell_id, expression, ...otherProps } = dbFormula;

  // Transform properties if necessary
  const appFormula = {
    id,
    cellId: cell_id,
    expression,
    ...otherProps
  };

  return appFormula;
}

/**
 * Maps an application Chart model to a database Chart model
 * @param chart The application Chart object
 * @returns A database-ready Chart object (ChartCreate | ChartUpdate)
 */
export function mapChartToDb(chart: any): ChartCreate | ChartUpdate {
  // Extract relevant properties from the input chart object
  const { id, worksheetId, type, dataRange, options, ...otherProps } = chart;

  // Transform properties if necessary
  const dbChart: ChartCreate | ChartUpdate = {
    id,
    worksheet_id: worksheetId,
    type,
    data_range: dataRange,
    options: JSON.stringify(options),
    ...otherProps
  };

  return dbChart;
}

/**
 * Maps a database Chart model to an application Chart model
 * @param dbChart The database Chart object
 * @returns An application-ready Chart object
 */
export function mapChartFromDb(dbChart: Chart): any {
  // Extract all properties from the input dbChart object
  const { id, worksheet_id, type, data_range, options, ...otherProps } = dbChart;

  // Transform properties if necessary
  const appChart = {
    id,
    worksheetId: worksheet_id,
    type,
    dataRange: data_range,
    options: JSON.parse(options),
    ...otherProps
  };

  return appChart;
}

// Human tasks (commented)
/**
 * TODO: Implement proper error handling for cases where input objects don't match expected structures
 * TODO: Add unit tests to ensure correct mapping between database and application models
 * TODO: Review the mapping functions to ensure they handle all edge cases and special data types correctly
 * OPTIONAL: Consider adding logging for debugging purposes in mapping functions
 */