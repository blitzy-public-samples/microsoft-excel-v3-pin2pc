import BigNumber from 'bignumber.js';
import { Formula, FormulaToken, FormulaOperator, FormulaFunction } from '../../shared/types/formula';
import { CellReference, CellRange, CellValue } from '../../shared/types/cell';
import { validateFormula, tokenizeFormula } from '../../shared/validators/formulaValidator';
import { add, subtract, multiply, divide, power } from '../../shared/utils/mathOperations';

// Global object to store formula functions
const FORMULA_FUNCTIONS: Record<string, FormulaFunction> = {};

/**
 * Parses a formula string and returns a Formula object
 * @param expression The formula string to parse
 * @returns A Formula object representing the parsed formula
 */
export function parseFormula(expression: string): Formula {
    // Validate the formula
    if (!validateFormula(expression)) {
        throw new Error('Invalid formula');
    }

    // Tokenize the formula
    const tokens = tokenizeFormula(expression);

    // Create and return a new Formula object
    return {
        expression,
        tokens
    };
}

/**
 * Evaluates a parsed Formula object and returns the result
 * @param formula The Formula object to evaluate
 * @param cellValues A record of cell values to use for reference resolution
 * @returns The result of the formula evaluation
 */
export function evaluateFormula(formula: Formula, cellValues: Record<string, CellValue>): CellValue {
    const operandStack: CellValue[] = [];
    const operatorStack: (FormulaOperator | string)[] = [];

    for (const token of formula.tokens) {
        if (typeof token === 'number' || typeof token === 'string' || token === null || token === undefined) {
            operandStack.push(token);
        } else if (typeof token === 'object' && 'type' in token) {
            if (token.type === 'cell' || token.type === 'range') {
                const resolvedValue = resolveReference(token, cellValues);
                operandStack.push(resolvedValue);
            } else if (token.type === 'operator') {
                while (
                    operatorStack.length > 0 &&
                    typeof operatorStack[operatorStack.length - 1] !== 'string' &&
                    (operatorStack[operatorStack.length - 1] as FormulaOperator).precedence >= token.precedence
                ) {
                    const operator = operatorStack.pop() as FormulaOperator;
                    const right = operandStack.pop();
                    const left = operandStack.pop();
                    if (left !== undefined && right !== undefined) {
                        const result = applyOperator(operator, left, right);
                        operandStack.push(result);
                    }
                }
                operatorStack.push(token);
            } else if (token.type === 'function') {
                operatorStack.push(token.name);
            } else if (token.type === 'parenthesis') {
                if (token.value === '(') {
                    operatorStack.push(token.value);
                } else {
                    while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                        const operator = operatorStack.pop() as FormulaOperator;
                        const right = operandStack.pop();
                        const left = operandStack.pop();
                        if (left !== undefined && right !== undefined) {
                            const result = applyOperator(operator, left, right);
                            operandStack.push(result);
                        }
                    }
                    operatorStack.pop(); // Remove the '('
                    if (operatorStack.length > 0 && typeof operatorStack[operatorStack.length - 1] === 'string') {
                        const functionName = operatorStack.pop() as string;
                        const args = operandStack.pop() as CellValue[];
                        const result = evaluateFunction(functionName, args);
                        operandStack.push(result);
                    }
                }
            }
        }
    }

    while (operatorStack.length > 0) {
        const operator = operatorStack.pop() as FormulaOperator;
        const right = operandStack.pop();
        const left = operandStack.pop();
        if (left !== undefined && right !== undefined) {
            const result = applyOperator(operator, left, right);
            operandStack.push(result);
        }
    }

    if (operandStack.length !== 1) {
        throw new Error('Invalid formula: multiple values remain after evaluation');
    }

    return operandStack[0];
}

/**
 * Resolves a cell reference to its value
 * @param reference The cell reference to resolve
 * @param cellValues A record of cell values to use for reference resolution
 * @returns The resolved cell value
 */
function resolveReference(reference: CellReference | CellRange, cellValues: Record<string, CellValue>): CellValue {
    if (reference.type === 'cell') {
        const key = `${reference.column}${reference.row}`;
        return cellValues[key] ?? null;
    } else {
        // Handle range references (e.g., return an array of values)
        // This is a simplified implementation and may need to be expanded
        const values: CellValue[] = [];
        for (let row = reference.startRow; row <= reference.endRow; row++) {
            for (let col = reference.startColumn.charCodeAt(0); col <= reference.endColumn.charCodeAt(0); col++) {
                const key = `${String.fromCharCode(col)}${row}`;
                values.push(cellValues[key] ?? null);
            }
        }
        return values;
    }
}

/**
 * Evaluates a formula function with given arguments
 * @param functionName The name of the function to evaluate
 * @param args The arguments to pass to the function
 * @returns The result of the function evaluation
 */
function evaluateFunction(functionName: string, args: CellValue[]): CellValue {
    const func = FORMULA_FUNCTIONS[functionName.toUpperCase()];
    if (!func) {
        throw new Error(`Unknown function: ${functionName}`);
    }
    return func(args);
}

/**
 * Applies a formula operator to two operands
 * @param operator The operator to apply
 * @param left The left operand
 * @param right The right operand
 * @returns The result of the operation
 */
function applyOperator(operator: FormulaOperator, left: CellValue, right: CellValue): CellValue {
    // Convert operands to BigNumber for precise calculations
    const leftNum = new BigNumber(left as string | number);
    const rightNum = new BigNumber(right as string | number);

    switch (operator.symbol) {
        case '+':
            return add(leftNum, rightNum).toNumber();
        case '-':
            return subtract(leftNum, rightNum).toNumber();
        case '*':
            return multiply(leftNum, rightNum).toNumber();
        case '/':
            return divide(leftNum, rightNum).toNumber();
        case '^':
            return power(leftNum, rightNum).toNumber();
        case '=':
            return leftNum.isEqualTo(rightNum);
        case '<>':
            return !leftNum.isEqualTo(rightNum);
        case '>':
            return leftNum.isGreaterThan(rightNum);
        case '<':
            return leftNum.isLessThan(rightNum);
        case '>=':
            return leftNum.isGreaterThanOrEqualTo(rightNum);
        case '<=':
            return leftNum.isLessThanOrEqualTo(rightNum);
        default:
            throw new Error(`Unknown operator: ${operator.symbol}`);
    }
}

// Export the FORMULA_FUNCTIONS object so it can be extended with custom functions
export { FORMULA_FUNCTIONS };

// Human tasks (commented as requested)
/*
Human tasks:
1. Implement support for array formulas and structured references (Required)
2. Add more built-in Excel functions to the FORMULA_FUNCTIONS object (Required)
3. Optimize formula parsing and evaluation for large and complex formulas (Required)
4. Implement error handling and propagation for formula evaluation (Critical)
5. Add support for custom user-defined functions (Optional)
*/