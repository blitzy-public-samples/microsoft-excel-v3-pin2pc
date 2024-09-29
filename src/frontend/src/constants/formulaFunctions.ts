/**
 * This file contains constant definitions for all supported formula functions
 * in the Excel frontend application. It provides a centralized location for
 * managing and referencing formula functions throughout the frontend codebase.
 */

/**
 * Interface defining the structure of a formula function
 */
export interface FormulaFunctionDefinition {
  name: string;
  category: string;
  description: string;
  syntax: string;
  example: string;
  minArgs: number;
  maxArgs: number;
}

/**
 * A record of all supported formula functions with their definitions
 */
export const FORMULA_FUNCTIONS: Record<string, FormulaFunctionDefinition> = {
  SUM: {
    name: "SUM",
    category: "Math and Trigonometry",
    description: "Adds all the numbers in a range of cells",
    syntax: "SUM(number1, [number2], ...)",
    example: "SUM(A1:A10)",
    minArgs: 1,
    maxArgs: 255
  },
  AVERAGE: {
    name: "AVERAGE",
    category: "Statistical",
    description: "Returns the average (arithmetic mean) of the arguments",
    syntax: "AVERAGE(number1, [number2], ...)",
    example: "AVERAGE(A1:A10)",
    minArgs: 1,
    maxArgs: 255
  },
  COUNT: {
    name: "COUNT",
    category: "Statistical",
    description: "Counts how many numbers are in the list of arguments",
    syntax: "COUNT(value1, [value2], ...)",
    example: "COUNT(A1:A10)",
    minArgs: 1,
    maxArgs: 255
  },
  IF: {
    name: "IF",
    category: "Logical",
    description: "Specifies a logical test to perform",
    syntax: "IF(logical_test, value_if_true, [value_if_false])",
    example: 'IF(A1>10,"High","Low")',
    minArgs: 2,
    maxArgs: 3
  },
  VLOOKUP: {
    name: "VLOOKUP",
    category: "Lookup and Reference",
    description: "Looks for a value in the leftmost column of a table, and then returns a value in the same row from a column you specify",
    syntax: "VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])",
    example: "VLOOKUP(A2,B2:D7,2,FALSE)",
    minArgs: 3,
    maxArgs: 4
  }
};

// Human tasks:
// TODO: Review and expand the list of formula functions to ensure all required Excel functions are included
// TODO: Verify that the function definitions align with the exact behavior of Microsoft Excel functions
// TODO: Consider adding locale-specific information for function names and descriptions