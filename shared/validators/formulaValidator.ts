import { Formula, FormulaToken, FormulaOperator, FormulaFunction } from '../types/formula';
import { CellReference, CellRange } from '../types/cell';

/**
 * Validates a given formula expression
 * @param expression The formula expression to validate
 * @returns True if the formula is valid, false otherwise
 */
export function validateFormula(expression: string): boolean {
  // Tokenize the formula expression
  const tokens = tokenizeFormula(expression);

  // Check for balanced parentheses
  if (!checkBalancedParentheses(tokens)) {
    return false;
  }

  // Validate individual tokens
  for (const token of tokens) {
    if (!validateToken(token)) {
      return false;
    }
  }

  // Check for proper token sequence
  if (!validateTokenSequence(tokens)) {
    return false;
  }

  // Validate function arguments
  if (!validateFunctionArguments(tokens)) {
    return false;
  }

  // Check for circular references
  // Note: This step requires access to the current cell and the entire formula structure,
  // which is not available in the current context. It should be implemented at a higher level.

  return true;
}

/**
 * Converts a formula string into an array of tokens
 * @param expression The formula expression to tokenize
 * @returns Array of formula tokens
 */
export function tokenizeFormula(expression: string): FormulaToken[] {
  const tokens: FormulaToken[] = [];
  let currentToken = '';

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (char === ' ') {
      if (currentToken) {
        tokens.push(createToken(currentToken));
        currentToken = '';
      }
    } else if ('+-*/^()=><'.includes(char)) {
      if (currentToken) {
        tokens.push(createToken(currentToken));
        currentToken = '';
      }
      tokens.push(createToken(char));
    } else {
      currentToken += char;
    }
  }

  if (currentToken) {
    tokens.push(createToken(currentToken));
  }

  return tokens;
}

/**
 * Validates an individual formula token
 * @param token The token to validate
 * @returns True if the token is valid, false otherwise
 */
export function validateToken(token: FormulaToken): boolean {
  switch (token.type) {
    case 'number':
      return !isNaN(Number(token.value));
    case 'string':
      return true; // All strings are valid
    case 'reference':
      return validateCellReference(token.value as CellReference);
    case 'range':
      return validateCellRange(token.value as CellRange);
    case 'function':
      return validateFunction(token.value as FormulaFunction);
    case 'operator':
      return validateOperator(token.value as FormulaOperator);
    default:
      return false;
  }
}

/**
 * Validates the sequence of tokens in a formula
 * @param tokens The array of tokens to validate
 * @returns True if the token sequence is valid, false otherwise
 */
export function validateTokenSequence(tokens: FormulaToken[]): boolean {
  let expectOperand = true;

  for (const token of tokens) {
    if (expectOperand) {
      if (token.type === 'operator' && token.value !== '-') {
        return false;
      }
    } else {
      if (token.type !== 'operator' && token.type !== 'function') {
        return false;
      }
    }

    expectOperand = token.type === 'operator' || token.type === 'function';
  }

  return !expectOperand;
}

/**
 * Checks for circular references in a formula
 * @param formula The formula to check for circular references
 * @param currentCell The current cell reference
 * @returns True if there are no circular references, false otherwise
 */
export function checkCircularReferences(formula: Formula, currentCell: CellReference): boolean {
  // This function should be implemented to recursively check all cell references in the formula
  // and ensure that none of them point back to the current cell.
  // The implementation details would depend on how formulas and cell references are structured
  // in the broader application context.
  return true; // Placeholder return value
}

// Helper functions

function createToken(value: string): FormulaToken {
  if (!isNaN(Number(value))) {
    return { type: 'number', value: Number(value) };
  } else if (value.startsWith('"') && value.endsWith('"')) {
    return { type: 'string', value: value.slice(1, -1) };
  } else if (value.includes(':')) {
    return { type: 'range', value: value as CellRange };
  } else if (/^[A-Z]+[0-9]+$/.test(value)) {
    return { type: 'reference', value: value as CellReference };
  } else if ('+-*/^=><'.includes(value)) {
    return { type: 'operator', value: value as FormulaOperator };
  } else {
    return { type: 'function', value: value as FormulaFunction };
  }
}

function checkBalancedParentheses(tokens: FormulaToken[]): boolean {
  let count = 0;
  for (const token of tokens) {
    if (token.value === '(') count++;
    if (token.value === ')') count--;
    if (count < 0) return false;
  }
  return count === 0;
}

function validateCellReference(reference: CellReference): boolean {
  // Implement cell reference validation logic
  return /^[A-Z]+[0-9]+$/.test(reference);
}

function validateCellRange(range: CellRange): boolean {
  // Implement cell range validation logic
  const [start, end] = range.split(':');
  return validateCellReference(start as CellReference) && validateCellReference(end as CellReference);
}

function validateFunction(func: FormulaFunction): boolean {
  // Implement function validation logic
  // This would typically involve checking against a list of supported functions
  return true; // Placeholder return value
}

function validateOperator(operator: FormulaOperator): boolean {
  // Implement operator validation logic
  return '+-*/^=><'.includes(operator);
}

function validateFunctionArguments(tokens: FormulaToken[]): boolean {
  // Implement function argument validation logic
  // This would involve checking the number and types of arguments for each function
  return true; // Placeholder return value
}

// TODO: Implement error reporting mechanism to provide detailed feedback on formula validation failures
// TODO: Optimize the tokenizeFormula function for large and complex formulas
// TODO: Add support for validating array formulas and structured references
// TODO: Implement caching mechanism for validated formulas to improve performance