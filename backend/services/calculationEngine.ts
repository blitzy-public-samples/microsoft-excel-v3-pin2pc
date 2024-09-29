import { Cell, CellValue, CellReference, CellRange } from '../../shared/types/cell';
import * as mathjs from 'mathjs';

export class CalculationEngine {
    private customFunctions: Map<string, Function>;
    private dependencyGraph: Map<string, Set<string>>;

    constructor() {
        this.customFunctions = new Map<string, Function>();
        this.dependencyGraph = new Map<string, Set<string>>();
    }

    async evaluateFormula(formula: string, cellMap: Map<string, Cell>): Promise<CellValue> {
        try {
            // Step 1: Parse the formula
            const parsedFormula = this.parseFormula(formula);

            // Step 2: Replace cell references with their values from cellMap
            const resolvedFormula = this.resolveCellReferences(parsedFormula, cellMap);

            // Step 3: Evaluate custom functions if present
            const evaluatedFormula = await this.evaluateCustomFunctions(resolvedFormula);

            // Step 4: Use mathjs to evaluate the resulting expression
            const result = mathjs.evaluate(evaluatedFormula);

            // Step 5: Return the calculated value
            return result;
        } catch (error) {
            console.error('Error evaluating formula:', error);
            return '#ERROR!';
        }
    }

    async calculateCell(cell: Cell, cellMap: Map<string, Cell>): Promise<CellValue> {
        if (cell.formula) {
            const result = await this.evaluateFormula(cell.formula, cellMap);
            cell.value = result;
            return result;
        }
        return cell.value;
    }

    async calculateRange(range: CellRange, cellMap: Map<string, Cell>): Promise<CellValue[][]> {
        const result: CellValue[][] = [];
        for (let row = range.startRow; row <= range.endRow; row++) {
            const rowResult: CellValue[] = [];
            for (let col = range.startCol; col <= range.endCol; col++) {
                const cellRef = `${String.fromCharCode(65 + col)}${row + 1}`;
                const cell = cellMap.get(cellRef);
                if (cell) {
                    const cellValue = await this.calculateCell(cell, cellMap);
                    rowResult.push(cellValue);
                } else {
                    rowResult.push(null);
                }
            }
            result.push(rowResult);
        }
        return result;
    }

    registerCustomFunction(functionName: string, implementation: Function): void {
        this.customFunctions.set(functionName, implementation);
    }

    async updateDependencies(cellRef: CellReference, newFormula: string): Promise<void> {
        const dependencies = this.parseFormula(newFormula);
        this.dependencyGraph.set(cellRef, new Set(dependencies));
    }

    private parseFormula(formula: string): string[] {
        const cellRefRegex = /[A-Z]+[0-9]+/g;
        return formula.match(cellRefRegex) || [];
    }

    private resolveCellReferences(cellRefs: string[], cellMap: Map<string, Cell>): string {
        let resolvedFormula = cellRefs.join(' ');
        for (const cellRef of cellRefs) {
            const cell = cellMap.get(cellRef);
            if (cell) {
                resolvedFormula = resolvedFormula.replace(cellRef, cell.value?.toString() || '0');
            }
        }
        return resolvedFormula;
    }

    private async evaluateCustomFunctions(formula: string): Promise<string> {
        for (const [funcName, funcImpl] of this.customFunctions) {
            const regex = new RegExp(`${funcName}\\(([^)]+)\\)`, 'g');
            formula = formula.replace(regex, (match, args) => {
                const argArray = args.split(',').map(arg => arg.trim());
                return funcImpl(...argArray);
            });
        }
        return formula;
    }
}

// Human tasks:
// 1. Implement error handling for circular dependencies in formulas
// 2. Optimize performance for large spreadsheets with many interconnected formulas
// 3. Implement caching mechanism for frequently accessed cell values
// 4. Add support for array formulas and dynamic arrays
// 5. Implement parallel processing for independent calculations