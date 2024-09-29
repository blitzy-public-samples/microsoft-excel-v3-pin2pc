import { FormulaFunction } from '../types/formula';

/**
 * Mathematical functions available in formulas
 */
export const MATH_FUNCTIONS: Record<string, FormulaFunction> = {
  SUM: (...args: number[]): number => args.reduce((a, b) => a + b, 0),
  AVERAGE: (...args: number[]): number => args.reduce((a, b) => a + b, 0) / args.length,
  MAX: (...args: number[]): number => Math.max(...args),
  MIN: (...args: number[]): number => Math.min(...args),
  COUNT: (...args: any[]): number => args.length,
  ROUND: (number: number, decimals: number): number => Number(Math.round(Number(number + 'e' + decimals)) + 'e-' + decimals)
};

/**
 * Logical functions available in formulas
 */
export const LOGICAL_FUNCTIONS: Record<string, FormulaFunction> = {
  IF: (condition: boolean, trueValue: any, falseValue: any): any => condition ? trueValue : falseValue,
  AND: (...args: boolean[]): boolean => args.every(Boolean),
  OR: (...args: boolean[]): boolean => args.some(Boolean),
  NOT: (value: boolean): boolean => !value
};

/**
 * Text manipulation functions available in formulas
 */
export const TEXT_FUNCTIONS: Record<string, FormulaFunction> = {
  CONCATENATE: (...args: string[]): string => args.join(''),
  LEFT: (text: string, numChars: number): string => text.slice(0, numChars),
  RIGHT: (text: string, numChars: number): string => text.slice(-numChars),
  MID: (text: string, startNum: number, numChars: number): string => text.slice(startNum - 1, startNum - 1 + numChars),
  LEN: (text: string): number => text.length,
  LOWER: (text: string): string => text.toLowerCase(),
  UPPER: (text: string): string => text.toUpperCase()
};

/**
 * Date and time functions available in formulas
 */
export const DATE_FUNCTIONS: Record<string, FormulaFunction> = {
  TODAY: (): Date => new Date(),
  NOW: (): Date => new Date(),
  YEAR: (date: Date): number => date.getFullYear(),
  MONTH: (date: Date): number => date.getMonth() + 1,
  DAY: (date: Date): number => date.getDate(),
  DATEVALUE: (dateString: string): Date => new Date(dateString)
};

/**
 * Lookup and reference functions available in formulas
 */
export const LOOKUP_FUNCTIONS: Record<string, FormulaFunction> = {
  VLOOKUP: (lookupValue: any, tableArray: any[][], colIndex: number, rangeLookup: boolean = false): any => {
    for (let i = 0; i < tableArray.length; i++) {
      if (rangeLookup) {
        if (tableArray[i][0] <= lookupValue && (i === tableArray.length - 1 || tableArray[i + 1][0] > lookupValue)) {
          return tableArray[i][colIndex - 1];
        }
      } else {
        if (tableArray[i][0] === lookupValue) {
          return tableArray[i][colIndex - 1];
        }
      }
    }
    return null;
  },
  HLOOKUP: (lookupValue: any, tableArray: any[][], rowIndex: number, rangeLookup: boolean = false): any => {
    for (let i = 0; i < tableArray[0].length; i++) {
      if (rangeLookup) {
        if (tableArray[0][i] <= lookupValue && (i === tableArray[0].length - 1 || tableArray[0][i + 1] > lookupValue)) {
          return tableArray[rowIndex - 1][i];
        }
      } else {
        if (tableArray[0][i] === lookupValue) {
          return tableArray[rowIndex - 1][i];
        }
      }
    }
    return null;
  },
  INDEX: (array: any[][], rowNum: number, colNum?: number): any => {
    if (colNum === undefined) {
      return array[rowNum - 1];
    }
    return array[rowNum - 1][colNum - 1];
  },
  MATCH: (lookupValue: any, lookupArray: any[], matchType: number = 1): number => {
    for (let i = 0; i < lookupArray.length; i++) {
      if (matchType === 0) {
        if (lookupArray[i] === lookupValue) {
          return i + 1;
        }
      } else if (matchType === 1) {
        if (lookupArray[i] === lookupValue || (i === lookupArray.length - 1) || lookupArray[i + 1] > lookupValue) {
          return i + 1;
        }
      } else if (matchType === -1) {
        if (lookupArray[i] === lookupValue || (i === lookupArray.length - 1) || lookupArray[i + 1] < lookupValue) {
          return i + 1;
        }
      }
    }
    return 0;
  }
};

/**
 * Combines all formula functions into a single record
 */
export const FORMULA_FUNCTIONS: Record<string, FormulaFunction> = {
  ...MATH_FUNCTIONS,
  ...LOGICAL_FUNCTIONS,
  ...TEXT_FUNCTIONS,
  ...DATE_FUNCTIONS,
  ...LOOKUP_FUNCTIONS
};

/**
 * Human tasks:
 * 1. Review and expand the list of supported formula functions (Required)
 * 2. Implement the actual function logic for each formula function (Required)
 * 3. Add more specialized functions (e.g., financial, statistical) based on project requirements (Optional)
 * 4. Consider adding support for custom user-defined functions (Optional)
 */