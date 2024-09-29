import { Cell } from '../types/cell';
import { CellValue } from '../types/formula';
import { CellReference } from '../types/cell';
import { CellRange } from '../types/cell';

/**
 * Interface for the Calculation Engine, providing methods for formula evaluation and cell value calculation
 */
export interface ICalculationEngine {
  /**
   * Evaluates a given formula and returns the result
   * @param formula - The formula to evaluate
   * @param cellMap - A map of cell references to their corresponding Cell objects
   * @returns A Promise that resolves to the calculated result of the formula
   */
  evaluateFormula(formula: string, cellMap: Map<string, Cell>): Promise<CellValue>;

  /**
   * Calculates the value of a cell, taking into account its formula if present
   * @param cell - The cell to calculate
   * @param cellMap - A map of cell references to their corresponding Cell objects
   * @returns A Promise that resolves to the calculated value of the cell
   */
  calculateCell(cell: Cell, cellMap: Map<string, Cell>): Promise<CellValue>;

  /**
   * Calculates the values for a range of cells
   * @param range - The range of cells to calculate
   * @param cellMap - A map of cell references to their corresponding Cell objects
   * @returns A Promise that resolves to a 2D array of calculated cell values
   */
  calculateRange(range: CellRange, cellMap: Map<string, Cell>): Promise<CellValue[][]>;

  /**
   * Registers a custom function that can be used in formulas
   * @param functionName - The name of the custom function
   * @param implementation - The implementation of the custom function
   */
  registerCustomFunction(functionName: string, implementation: Function): void;

  /**
   * Updates the dependency graph when a cell's formula changes
   * @param cellRef - The reference of the cell whose formula has changed
   * @param newFormula - The new formula for the cell
   * @returns A Promise that resolves when the dependency graph has been updated
   */
  updateDependencies(cellRef: CellReference, newFormula: string): Promise<void>;
}

// TODO: Review and validate the ICalculationEngine interface to ensure it covers all necessary calculation scenarios
// TODO: Determine if additional methods are needed for specific Excel-like features (e.g., array formulas, pivot tables)
// TODO: Consider adding methods for performance optimization, such as batch calculations or caching mechanisms
// TODO: Evaluate the need for error handling methods or specific error types in the interface