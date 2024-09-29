import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Workbook, Worksheet, Cell, CellValue, Row, Column } from '../types/spreadsheet';
import { CELL_TYPES } from '../constants/cellTypes';
import formulaParser from '../utils/formulaParser';
import cellAddressHelper from '../utils/cellAddressHelper';
import dataValidator from '../utils/dataValidator';
import api from '../services/api';

interface UseSpreadsheetResult {
  workbook: Workbook | null;
  activeWorksheet: Worksheet | null;
  loading: boolean;
  error: string | null;
  updateCell: (cellAddress: string, value: CellValue) => void;
  addRow: () => void;
  addColumn: () => void;
  removeRow: (rowIndex: number) => void;
  removeColumn: (columnIndex: number) => void;
  addWorksheet: () => void;
  removeWorksheet: (worksheetId: string) => void;
  saveWorkbook: () => Promise<void>;
  exportWorkbook: () => Promise<Blob>;
}

const useSpreadsheet = (workbookId: string): UseSpreadsheetResult => {
  const [workbook, setWorkbook] = useState<Workbook | null>(null);
  const [activeWorksheet, setActiveWorksheet] = useState<Worksheet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkbook = async () => {
      try {
        setLoading(true);
        const fetchedWorkbook = await api.getWorkbook(workbookId);
        setWorkbook(fetchedWorkbook);
        setActiveWorksheet(fetchedWorkbook.worksheets[0]);
      } catch (err) {
        setError('Failed to fetch workbook');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkbook();
  }, [workbookId]);

  const updateCell = useCallback((cellAddress: string, value: CellValue) => {
    if (!activeWorksheet) return;

    const { row, column } = cellAddressHelper.parseAddress(cellAddress);
    const newCell: Cell = {
      id: uuidv4(),
      value,
      type: dataValidator.getCellType(value),
      formula: value.toString().startsWith('=') ? value.toString() : undefined,
    };

    setActiveWorksheet((prevWorksheet) => {
      if (!prevWorksheet) return null;

      const updatedCells = { ...prevWorksheet.cells, [cellAddress]: newCell };
      return { ...prevWorksheet, cells: updatedCells };
    });

    // Recalculate dependent cells
    // This is a simplified version. In a real-world scenario, you'd need a more sophisticated
    // dependency tracking and recalculation system.
    Object.entries(activeWorksheet.cells).forEach(([addr, cell]) => {
      if (cell.formula && cell.formula.includes(cellAddress)) {
        const recalculatedValue = formulaParser.evaluate(cell.formula, activeWorksheet.cells);
        updateCell(addr, recalculatedValue);
      }
    });
  }, [activeWorksheet]);

  const addRow = useCallback(() => {
    if (!activeWorksheet) return;

    const newRowIndex = activeWorksheet.rowCount;
    const newRow: Row = {
      id: uuidv4(),
      index: newRowIndex,
      height: 25, // Default row height
    };

    setActiveWorksheet((prevWorksheet) => {
      if (!prevWorksheet) return null;

      const updatedRows = [...prevWorksheet.rows, newRow];
      return { ...prevWorksheet, rows: updatedRows, rowCount: newRowIndex + 1 };
    });
  }, [activeWorksheet]);

  const addColumn = useCallback(() => {
    if (!activeWorksheet) return;

    const newColumnIndex = activeWorksheet.columnCount;
    const newColumn: Column = {
      id: uuidv4(),
      index: newColumnIndex,
      width: 100, // Default column width
    };

    setActiveWorksheet((prevWorksheet) => {
      if (!prevWorksheet) return null;

      const updatedColumns = [...prevWorksheet.columns, newColumn];
      return { ...prevWorksheet, columns: updatedColumns, columnCount: newColumnIndex + 1 };
    });
  }, [activeWorksheet]);

  const removeRow = useCallback((rowIndex: number) => {
    if (!activeWorksheet) return;

    setActiveWorksheet((prevWorksheet) => {
      if (!prevWorksheet) return null;

      const updatedRows = prevWorksheet.rows.filter((row) => row.index !== rowIndex);
      const updatedCells = Object.fromEntries(
        Object.entries(prevWorksheet.cells).filter(([addr]) => {
          const { row } = cellAddressHelper.parseAddress(addr);
          return row !== rowIndex;
        })
      );

      return {
        ...prevWorksheet,
        rows: updatedRows,
        cells: updatedCells,
        rowCount: prevWorksheet.rowCount - 1,
      };
    });
  }, [activeWorksheet]);

  const removeColumn = useCallback((columnIndex: number) => {
    if (!activeWorksheet) return;

    setActiveWorksheet((prevWorksheet) => {
      if (!prevWorksheet) return null;

      const updatedColumns = prevWorksheet.columns.filter((column) => column.index !== columnIndex);
      const updatedCells = Object.fromEntries(
        Object.entries(prevWorksheet.cells).filter(([addr]) => {
          const { column } = cellAddressHelper.parseAddress(addr);
          return column !== columnIndex;
        })
      );

      return {
        ...prevWorksheet,
        columns: updatedColumns,
        cells: updatedCells,
        columnCount: prevWorksheet.columnCount - 1,
      };
    });
  }, [activeWorksheet]);

  const addWorksheet = useCallback(() => {
    if (!workbook) return;

    const newWorksheet: Worksheet = {
      id: uuidv4(),
      name: `Sheet${workbook.worksheets.length + 1}`,
      cells: {},
      rows: [],
      columns: [],
      rowCount: 0,
      columnCount: 0,
    };

    setWorkbook((prevWorkbook) => {
      if (!prevWorkbook) return null;

      const updatedWorksheets = [...prevWorkbook.worksheets, newWorksheet];
      return { ...prevWorkbook, worksheets: updatedWorksheets };
    });

    setActiveWorksheet(newWorksheet);
  }, [workbook]);

  const removeWorksheet = useCallback((worksheetId: string) => {
    if (!workbook) return;

    setWorkbook((prevWorkbook) => {
      if (!prevWorkbook) return null;

      const updatedWorksheets = prevWorkbook.worksheets.filter((ws) => ws.id !== worksheetId);
      return { ...prevWorkbook, worksheets: updatedWorksheets };
    });

    if (activeWorksheet?.id === worksheetId) {
      setActiveWorksheet(workbook.worksheets[0]);
    }
  }, [workbook, activeWorksheet]);

  const saveWorkbook = useCallback(async () => {
    if (!workbook) return;

    try {
      await api.saveWorkbook(workbook);
    } catch (err) {
      setError('Failed to save workbook');
    }
  }, [workbook]);

  const exportWorkbook = useCallback(async () => {
    if (!workbook) throw new Error('No workbook to export');

    try {
      return await api.exportWorkbook(workbook.id);
    } catch (err) {
      setError('Failed to export workbook');
      throw err;
    }
  }, [workbook]);

  return {
    workbook,
    activeWorksheet,
    loading,
    error,
    updateCell,
    addRow,
    addColumn,
    removeRow,
    removeColumn,
    addWorksheet,
    removeWorksheet,
    saveWorkbook,
    exportWorkbook,
  };
};

export default useSpreadsheet;
```

This implementation of the `useSpreadsheet` hook provides a comprehensive set of functions for managing spreadsheet state and operations in the Excel-like application frontend. It includes all the required functionality as specified in the JSON representation, such as cell manipulation, worksheet manipulation, and workbook operations.

The hook uses React's `useState`, `useEffect`, and `useCallback` hooks to manage state and memoize functions for better performance. It also integrates with the specified utility functions and services, such as `formulaParser`, `cellAddressHelper`, `dataValidator`, and the `api` service.

Note that this implementation assumes that the imported dependencies (types, constants, utils, and services) are correctly implemented and provide the necessary functionality. In a real-world scenario, you might need to adjust the implementation based on the actual interfaces and behaviors of these dependencies.

Human tasks mentioned in the JSON specification have been added as comments at the end of the file:

```typescript
// TODO: Implement error handling for API calls and state updates
// TODO: Add unit tests for the useSpreadsheet hook
// TODO: Optimize performance for large spreadsheets, possibly by implementing virtualization
// TODO: Implement undo/redo functionality