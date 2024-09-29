import { CellValue, FormulaResult, Workbook, Worksheet, Cell } from '../types/SpreadsheetTypes';
import { CELL_TYPES } from '../constants/AppConstants';

/**
 * FormulaParser utility for parsing and evaluating Excel formulas in the mobile application.
 * It provides functions to tokenize, parse, and calculate formula results based on the current workbook state.
 */
export class FormulaParser {
  /**
   * Tokenizes a formula string into an array of tokens
   * @param formula - The formula string to tokenize
   * @returns An array of tokens (strings)
   */
  static tokenizeFormula(formula: string): string[] {
    // Implementation for tokenizing the formula
    const tokens: string[] = [];
    let currentToken = '';
    const operators = ['+', '-', '*', '/', '(', ')', ',', '=', '>', '<', '>=', '<=', '<>'];

    for (let i = 0; i < formula.length; i++) {
      const char = formula[i];
      if (operators.includes(char)) {
        if (currentToken) {
          tokens.push(currentToken);
          currentToken = '';
        }
        tokens.push(char);
      } else if (char === ' ') {
        if (currentToken) {
          tokens.push(currentToken);
          currentToken = '';
        }
      } else {
        currentToken += char;
      }
    }

    if (currentToken) {
      tokens.push(currentToken);
    }

    return tokens;
  }

  /**
   * Parses the tokenized formula into an abstract syntax tree (AST)
   * @param tokens - An array of tokens
   * @returns AST representation of the formula
   */
  static parseFormula(tokens: string[]): object {
    // Implementation for parsing the formula into an AST
    // This is a simplified version and should be expanded for a full implementation
    const ast: any = { type: 'Formula', children: [] };
    let currentNode = ast;

    for (const token of tokens) {
      if (token === '(') {
        const newNode = { type: 'Function', name: currentNode.children.pop(), args: [] };
        currentNode.children.push(newNode);
        currentNode = newNode;
      } else if (token === ')') {
        currentNode = ast; // Simplified: always return to root
      } else if (token === ',') {
        // Do nothing, comma is just a separator
      } else {
        currentNode.children.push(token);
      }
    }

    return ast;
  }

  /**
   * Evaluates a formula string and returns the result
   * @param formula - The formula string to evaluate
   * @param workbook - The current workbook state
   * @param currentWorksheetId - The ID of the current worksheet
   * @returns The result of the formula evaluation
   */
  static evaluateFormula(formula: string, workbook: Workbook, currentWorksheetId: string): FormulaResult {
    try {
      const tokens = this.tokenizeFormula(formula);
      const ast = this.parseFormula(tokens);
      const result = this.evaluateAst(ast, workbook, currentWorksheetId);
      return { value: result, error: null };
    } catch (error) {
      return { value: null, error: error.message };
    }
  }

  /**
   * Evaluates the AST and returns the result
   * @param ast - The abstract syntax tree to evaluate
   * @param workbook - The current workbook state
   * @param currentWorksheetId - The ID of the current worksheet
   * @returns The result of the AST evaluation
   */
  private static evaluateAst(ast: any, workbook: Workbook, currentWorksheetId: string): CellValue {
    if (typeof ast === 'string') {
      // If it's a cell reference, get the cell value
      if (ast.match(/^[A-Z]+[0-9]+$/)) {
        return this.getCellValue(ast, workbook, currentWorksheetId);
      }
      // If it's a number, parse it
      if (!isNaN(Number(ast))) {
        return Number(ast);
      }
      // Otherwise, it's a string
      return ast;
    }

    if (ast.type === 'Function') {
      const args = ast.args.map((arg: any) => this.evaluateAst(arg, workbook, currentWorksheetId));
      return this.applyFunction(ast.name, args);
    }

    if (ast.type === 'Formula') {
      return this.evaluateAst(ast.children[0], workbook, currentWorksheetId);
    }

    throw new Error('Invalid AST node');
  }

  /**
   * Retrieves the value of a cell given its address and the current workbook state
   * @param cellAddress - The address of the cell (e.g., "A1")
   * @param workbook - The current workbook state
   * @param worksheetId - The ID of the worksheet
   * @returns The value of the specified cell
   */
  static getCellValue(cellAddress: string, workbook: Workbook, worksheetId: string): CellValue {
    const worksheet = workbook.worksheets.find(ws => ws.id === worksheetId);
    if (!worksheet) {
      throw new Error('Worksheet not found');
    }

    const cell = worksheet.cells.find(c => c.address === cellAddress);
    return cell ? cell.value : null;
  }

  /**
   * Applies an Excel function to the given arguments
   * @param functionName - The name of the function to apply
   * @param args - The arguments to the function
   * @returns The result of the function application
   */
  static applyFunction(functionName: string, args: CellValue[]): CellValue {
    switch (functionName.toUpperCase()) {
      case 'SUM':
        return args.reduce((sum, value) => sum + (typeof value === 'number' ? value : 0), 0);
      case 'AVERAGE':
        const numbers = args.filter(value => typeof value === 'number');
        return numbers.length > 0 ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : 0;
      // Add more functions as needed
      default:
        throw new Error(`Unsupported function: ${functionName}`);
    }
  }
}

// Human tasks:
// TODO: Implement error handling for circular references in formulas
// TODO: Optimize formula evaluation for large datasets
// OPTIONAL: Add support for array formulas and dynamic arrays