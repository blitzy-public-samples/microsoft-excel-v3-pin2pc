import React, { createContext, useContext, useMemo } from 'react';
import { Workbook, Worksheet, Cell, CellValue, Chart } from '../types/spreadsheet';
import useSpreadsheet from '../hooks/useSpreadsheet';

// Define the shape of the SpreadsheetContext value
interface SpreadsheetContextType {
  workbook: Workbook;
  activeWorksheet: Worksheet;
  selectedCell: Cell | null;
  setWorkbook: (workbook: Workbook) => void;
  setActiveWorksheet: (worksheetId: string) => void;
  setSelectedCell: (cell: Cell | null) => void;
  updateCell: (worksheetId: string, cellId: string, value: CellValue) => void;
  addWorksheet: () => void;
  removeWorksheet: (worksheetId: string) => void;
  addChart: (worksheetId: string, chart: Chart) => void;
  removeChart: (worksheetId: string, chartId: string) => void;
  updateChart: (worksheetId: string, chartId: string, updates: Partial<Chart>) => void;
}

// Create the context with a default value of undefined
const SpreadsheetContext = createContext<SpreadsheetContextType | undefined>(undefined);

// Create the SpreadsheetProvider component
export const SpreadsheetProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  // Initialize the spreadsheet state using the useSpreadsheet hook
  const spreadsheetState = useSpreadsheet();

  // Create a memoized context value object with the state and dispatch functions
  const contextValue = useMemo(() => ({
    ...spreadsheetState,
  }), [spreadsheetState]);

  // Return the SpreadsheetContext.Provider with the memoized value and children
  return (
    <SpreadsheetContext.Provider value={contextValue}>
      {children}
    </SpreadsheetContext.Provider>
  );
};

// Create a custom hook to access the SpreadsheetContext
export const useSpreadsheetContext = (): SpreadsheetContextType => {
  const context = useContext(SpreadsheetContext);
  if (context === undefined) {
    throw new Error('useSpreadsheetContext must be used within a SpreadsheetProvider');
  }
  return context;
};

// Human tasks:
// TODO: Implement error handling and logging for context operations
// TODO: Add performance optimizations for large spreadsheets, such as virtualization or lazy loading
// TODO: Implement undo/redo functionality for spreadsheet operations (Optional)