import { CalculationEngine } from '../../services/calculationEngine';
import { Cell, CellReference, CellRange } from '../../shared/types/cell';
import { CellValue } from '../../shared/types/formula';
import { expect } from '@jest/globals';

describe('CalculationEngine', () => {
  let calculationEngine: CalculationEngine;

  beforeEach(() => {
    calculationEngine = new CalculationEngine();
  });

  const createMockCellMap = (): Map<string, Cell> => {
    const cellMap = new Map<string, Cell>();
    cellMap.set('A1', { reference: 'A1', value: 10 });
    cellMap.set('B1', { reference: 'B1', value: 20 });
    cellMap.set('C1', { reference: 'C1', value: 30 });
    cellMap.set('D1', { reference: 'D1', formula: '=A1+B1' });
    return cellMap;
  };

  it('should correctly evaluate a simple formula', () => {
    const cellMap = createMockCellMap();
    const result = calculationEngine.evaluateFormula('=A1+B1', cellMap);
    expect(result).toBe(30);
  });

  it('should handle cell references in formulas', () => {
    const cellMap = createMockCellMap();
    const result = calculationEngine.evaluateFormula('=A1*C1', cellMap);
    expect(result).toBe(300);
  });

  it('should calculate a single cell correctly', () => {
    const cellMap = createMockCellMap();
    const cell: Cell = { reference: 'E1', formula: '=A1+B1+C1' };
    const result = calculationEngine.calculateCell(cell, cellMap);
    expect(result).toBe(60);
  });

  it('should calculate a range of cells', () => {
    const cellMap = createMockCellMap();
    const range: CellRange = { start: 'A1', end: 'C1' };
    const result = calculationEngine.calculateRange(range, cellMap);
    expect(result).toEqual([[10, 20, 30]]);
  });

  it('should register and evaluate custom functions', () => {
    calculationEngine.registerCustomFunction('SUM', (args: CellValue[]) => {
      return args.reduce((sum, value) => sum + (typeof value === 'number' ? value : 0), 0);
    });

    const cellMap = createMockCellMap();
    const result = calculationEngine.evaluateFormula('=SUM(A1,B1,C1)', cellMap);
    expect(result).toBe(60);
  });

  it('should update dependencies when a cell\'s formula changes', () => {
    const cellMap = createMockCellMap();
    calculationEngine.updateDependencies('D1', '=A1+B1+C1', cellMap);
    const updatedCell = cellMap.get('D1');
    expect(updatedCell?.formula).toBe('=A1+B1+C1');
    expect(calculationEngine.evaluateFormula(updatedCell?.formula || '', cellMap)).toBe(60);
  });

  it('should handle complex nested formulas', () => {
    const cellMap = createMockCellMap();
    const result = calculationEngine.evaluateFormula('=(A1+B1)*C1/2', cellMap);
    expect(result).toBe(450);
  });

  it('should throw an error for circular dependencies', () => {
    const cellMap = createMockCellMap();
    cellMap.set('E1', { reference: 'E1', formula: '=F1+1' });
    cellMap.set('F1', { reference: 'F1', formula: '=E1+1' });

    expect(() => {
      calculationEngine.evaluateFormula('=E1', cellMap);
    }).toThrow('Circular dependency detected');
  });
});

// Human tasks:
// TODO: Implement tests for error handling in circular dependencies
// TODO: Add performance tests for large spreadsheets with many interconnected formulas
// TODO: Create tests for caching mechanism once implemented
// TODO: Develop tests for array formulas and dynamic arrays
// TODO: Design tests to verify parallel processing of independent calculations