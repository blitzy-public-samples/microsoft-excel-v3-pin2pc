// TODO: Import CellReference and CellRange once they are defined
// import { CellReference, CellRange } from './cell';

/**
 * Represents a formula in the spreadsheet
 */
export interface Formula {
    expression: string;
    references: CellReference[];
    ranges: CellRange[];
}

/**
 * Represents the possible values a cell can contain
 */
export type CellValue = string | number | boolean | Date | null;

/**
 * Represents a function that can be used in a formula
 */
export type FormulaFunction = (...args: CellValue[]) => CellValue;

/**
 * Represents the available operators in a formula
 */
export type FormulaOperator = "+" | "-" | "*" | "/" | "^" | "=" | "<" | ">" | "<=" | ">=" | "<>";

/**
 * Represents a token in a formula expression
 */
export type FormulaToken = {
    type: "value" | "reference" | "range" | "function" | "operator";
    value: string | CellValue | CellReference | CellRange | FormulaFunction | FormulaOperator;
};

// TODO: Implement CellReference and CellRange types
// For now, we'll use placeholder types
type CellReference = any;
type CellRange = any;

// Human tasks:
// TODO: Review and expand the list of supported formula functions
// TODO: Validate the formula token structure and ensure it covers all possible scenarios
// TODO: Consider adding support for array formulas and structured references