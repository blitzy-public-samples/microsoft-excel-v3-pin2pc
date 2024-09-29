import { Formula, FormulaToken, FormulaFunction, FormulaOperator, CellValue } from '../../shared/types/formula';
import { CellReference, CellRange } from '../../shared/types/cell';

export class FormulaService {
  private registeredFunctions: Map<string, FormulaFunction>;

  constructor() {
    this.registeredFunctions = new Map<string, FormulaFunction>();
    this.registerDefaultFunctions();
  }

  /**
   * Parses a formula string into an array of FormulaTokens
   * @param formulaString The formula string to parse
   * @returns An array of parsed formula tokens
   */
  public parseFormula(formulaString: string): FormulaToken[] {
    const tokens: FormulaToken[] = [];
    // Implement tokenization logic here
    // This is a simplified example and should be expanded for full functionality
    const tokenRegex = /(\d+\.?\d*|\+|\-|\*|\/|\(|\)|[A-Z]+\d+|[A-Z]+\([^\)]*\)|\w+)/g;
    const matches = formulaString.match(tokenRegex);

    if (matches) {
      matches.forEach(match => {
        if (/^\d+\.?\d*$/.test(match)) {
          tokens.push({ type: 'value', value: parseFloat(match) });
        } else if (/^[A-Z]+\d+$/.test(match)) {
          tokens.push({ type: 'reference', value: match as CellReference });
        } else if (/^[A-Z]+\([^\)]*\)$/.test(match)) {
          tokens.push({ type: 'function', value: match });
        } else if (['+', '-', '*', '/'].includes(match)) {
          tokens.push({ type: 'operator', value: match as FormulaOperator });
        } else {
          tokens.push({ type: 'unknown', value: match });
        }
      });
    }

    return tokens;
  }

  /**
   * Evaluates a parsed formula and returns the result
   * @param tokens An array of FormulaTokens to evaluate
   * @param getCellValue A function to retrieve cell values
   * @returns The result of the formula evaluation
   */
  public evaluateFormula(tokens: FormulaToken[], getCellValue: (ref: CellReference) => CellValue): CellValue {
    const stack: CellValue[] = [];

    for (const token of tokens) {
      switch (token.type) {
        case 'value':
          stack.push(token.value as number);
          break;
        case 'reference':
          stack.push(getCellValue(token.value as CellReference));
          break;
        case 'function':
          const funcName = token.value.split('(')[0];
          const func = this.registeredFunctions.get(funcName);
          if (func) {
            const args = this.parseArguments(token.value);
            const result = func(args, getCellValue);
            stack.push(result);
          } else {
            throw new Error(`Unknown function: ${funcName}`);
          }
          break;
        case 'operator':
          const b = stack.pop();
          const a = stack.pop();
          if (typeof a === 'number' && typeof b === 'number') {
            stack.push(this.performOperation(a, b, token.value as FormulaOperator));
          } else {
            throw new Error('Invalid operands for operator');
          }
          break;
        default:
          throw new Error(`Unknown token type: ${token.type}`);
      }
    }

    if (stack.length !== 1) {
      throw new Error('Invalid formula: multiple values left on stack');
    }

    return stack[0];
  }

  /**
   * Resolves cell references and ranges in a formula
   * @param formula The formula to resolve references for
   * @param getCellValue A function to retrieve cell values
   * @returns An array of resolved cell values
   */
  public resolveReferences(formula: Formula, getCellValue: (ref: CellReference) => CellValue): CellValue[] {
    const resolvedValues: CellValue[] = [];

    for (const token of formula.tokens) {
      if (token.type === 'reference') {
        resolvedValues.push(getCellValue(token.value as CellReference));
      } else if (token.type === 'range') {
        const range = token.value as CellRange;
        // Implement range resolution logic here
        // This is a simplified example and should be expanded for full functionality
        const [startCol, startRow] = this.parseCellReference(range.start);
        const [endCol, endRow] = this.parseCellReference(range.end);

        for (let col = startCol; col <= endCol; col++) {
          for (let row = startRow; row <= endRow; row++) {
            const cellRef = `${String.fromCharCode(65 + col)}${row + 1}` as CellReference;
            resolvedValues.push(getCellValue(cellRef));
          }
        }
      }
    }

    return resolvedValues;
  }

  /**
   * Registers a custom formula function
   * @param name The name of the function to register
   * @param func The function to register
   */
  public registerFunction(name: string, func: FormulaFunction): void {
    this.registeredFunctions.set(name, func);
  }

  /**
   * Parses and evaluates a formula string
   * @param formulaString The formula string to parse and evaluate
   * @param getCellValue A function to retrieve cell values
   * @returns The result of the formula evaluation
   */
  public parseAndEvaluate(formulaString: string, getCellValue: (ref: CellReference) => CellValue): CellValue {
    const tokens = this.parseFormula(formulaString);
    return this.evaluateFormula(tokens, getCellValue);
  }

  private registerDefaultFunctions(): void {
    // Register default Excel-like functions (SUM, AVERAGE, COUNT, etc.)
    this.registerFunction('SUM', (args, getCellValue) => {
      return args.reduce((sum, arg) => sum + (typeof arg === 'number' ? arg : 0), 0);
    });

    this.registerFunction('AVERAGE', (args, getCellValue) => {
      const sum = args.reduce((sum, arg) => sum + (typeof arg === 'number' ? arg : 0), 0);
      return sum / args.length;
    });

    this.registerFunction('COUNT', (args, getCellValue) => {
      return args.filter(arg => typeof arg === 'number').length;
    });

    // Add more default functions as needed
  }

  private parseArguments(funcString: string): CellValue[] {
    const argsString = funcString.split('(')[1].split(')')[0];
    return argsString.split(',').map(arg => {
      const trimmed = arg.trim();
      return isNaN(Number(trimmed)) ? trimmed : Number(trimmed);
    });
  }

  private performOperation(a: number, b: number, operator: FormulaOperator): number {
    switch (operator) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
      default: throw new Error(`Unknown operator: ${operator}`);
    }
  }

  private parseCellReference(ref: CellReference): [number, number] {
    const colString = ref.match(/[A-Z]+/)?.[0] || '';
    const rowString = ref.match(/\d+/)?.[0] || '';
    const col = colString.split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
    const row = parseInt(rowString) - 1;
    return [col, row];
  }
}

// Human tasks:
// TODO: Implement error handling for formula parsing and evaluation
// TODO: Add support for more complex Excel functions (e.g., VLOOKUP, INDEX, MATCH)
// TODO: Optimize formula evaluation for large datasets
// TODO: Implement caching mechanism for frequently used formulas