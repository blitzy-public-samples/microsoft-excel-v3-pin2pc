import { renderHook, act } from '@testing-library/react-hooks';
import { vi } from 'vitest';
import useSpreadsheet from '../../../hooks/useSpreadsheet';
import { Workbook, Worksheet, Cell } from '../../../types/spreadsheet';
import api from '../../../services/api';

// Mock the api service
vi.mock('../../../services/api');

describe('useSpreadsheet', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  it('should initialize with an empty workbook', () => {
    const { result } = renderHook(() => useSpreadsheet());
    expect(result.current.workbook).toEqual({ worksheets: [] });
  });

  // Add more test cases here to cover all functions returned by useSpreadsheet

  // Example test case (implement actual logic based on useSpreadsheet implementation)
  it('should add a new worksheet', () => {
    const { result } = renderHook(() => useSpreadsheet());
    act(() => {
      result.current.addWorksheet();
    });
    expect(result.current.workbook.worksheets.length).toBe(1);
  });

  // Example test case for cell update
  it('should update a cell value', () => {
    const { result } = renderHook(() => useSpreadsheet());
    act(() => {
      result.current.addWorksheet();
      result.current.updateCell(0, 'A1', '42');
    });
    expect(result.current.workbook.worksheets[0].cells['A1'].value).toBe('42');
  });

  // Add more test cases here...

  // Test case for large spreadsheets (edge case)
  it('should handle large spreadsheets', () => {
    const { result } = renderHook(() => useSpreadsheet());
    act(() => {
      result.current.addWorksheet();
      for (let i = 0; i < 1000; i++) {
        for (let j = 0; j < 100; j++) {
          result.current.updateCell(0, `${String.fromCharCode(65 + j)}${i + 1}`, `Value ${i},${j}`);
        }
      }
    });
    expect(Object.keys(result.current.workbook.worksheets[0].cells).length).toBe(100000);
  });

  // Test case for complex formulas (edge case)
  it('should handle complex formulas', () => {
    const { result } = renderHook(() => useSpreadsheet());
    act(() => {
      result.current.addWorksheet();
      result.current.updateCell(0, 'A1', '10');
      result.current.updateCell(0, 'A2', '20');
      result.current.updateCell(0, 'A3', '=SUM(A1:A2) * 2 + AVERAGE(A1:A2)');
    });
    // Assuming the formula is calculated correctly
    expect(result.current.workbook.worksheets[0].cells['A3'].value).toBe('75');
  });

  // Add performance test (optional)
  it('should perform calculations efficiently', () => {
    const { result } = renderHook(() => useSpreadsheet());
    const start = performance.now();
    act(() => {
      result.current.addWorksheet();
      for (let i = 0; i < 10000; i++) {
        result.current.updateCell(0, `A${i + 1}`, `=${i}`);
      }
    });
    const end = performance.now();
    expect(end - start).toBeLessThan(1000); // Assuming less than 1 second for 10000 cells
  });
});

// Commented list of human tasks
/*
Human tasks:
1. Implement comprehensive test cases covering all functions returned by useSpreadsheet (Required)
2. Add edge case tests for large spreadsheets and complex formulas (Required)
3. Implement performance tests to ensure the hook scales well with larger datasets (Optional)
*/