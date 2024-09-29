/**
 * Defines the interface for the Formula Processor, which is responsible for
 * parsing, evaluating, and managing formulas in the Excel-like application.
 */

// Define necessary types inline since they are not available in a separate file
type CellValue = string | number | boolean | null;

interface FormulaToken {
  // This is a placeholder for the actual FormulaToken structure
  // It should be replaced with the actual implementation when available
  type: string;
  value: string;
}

interface Formula {
  // This is a placeholder for the actual Formula structure
  // It should be replaced with the actual implementation when available
  expression: string;
  tokens: FormulaToken[];
}

type FormulaFunction = (...args: CellValue[]) => CellValue;

export interface IFormulaProcessor {
  /**
   * Parses a formula string into an array of FormulaTokens
   * @param formulaString The string representation of the formula
   * @returns An array of parsed formula tokens
   */
  parseFormula(formulaString: string): FormulaToken[];

  /**
   * Evaluates a parsed formula and returns the result
   * @param formula The formula to evaluate
   * @returns The result of the formula evaluation
   */
  evaluateFormula(formula: Formula): CellValue;

  /**
   * Validates a formula for correctness and circular references
   * @param formula The formula to validate
   * @returns True if the formula is valid, false otherwise
   */
  validateFormula(formula: Formula): boolean;

  /**
   * Updates the dependencies of a formula when cell references change
   * @param formula The formula to update
   * @param changes An object representing the changes in cell references
   * @returns The updated formula with new dependencies
   */
  updateDependencies(formula: Formula, changes: object): Formula;

  /**
   * Registers a custom function that can be used in formulas
   * @param functionName The name of the custom function
   * @param implementation The implementation of the custom function
   */
  registerCustomFunction(functionName: string, implementation: FormulaFunction): void;
}

// Human tasks:
// TODO: Implement error handling mechanism for formula parsing and evaluation
// TODO: Define a strategy for handling circular references in formulas
// TODO: Consider adding support for array formulas and dynamic arrays
// TODO: Implement caching mechanism for formula evaluation to improve performance