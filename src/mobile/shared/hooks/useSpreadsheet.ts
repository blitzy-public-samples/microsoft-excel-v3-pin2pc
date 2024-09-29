import { useState, useEffect, useCallback } from 'react';
import { Workbook, Worksheet, Cell, CellValue, CellAddress, CellRange } from '../types/SpreadsheetTypes';
import FormulaParser from '../utils/FormulaParser';
import CellAddressHelper from '../utils/CellAddressHelper';
import DataValidator from '../utils/DataValidator';
import ApiService from '../services/ApiService';

interface SpreadsheetState {
  workbook: Workbook | null;
  activeWorksheet: Worksheet | null;
  isLoading: boolean;
  error: string | null;
}

interface SpreadsheetActions {
  getValue: (address: CellAddress) => CellValue;
  setValue: (address: CellAddress, value: CellValue) => void;
  getFormula: (address: CellAddress) => string | null;
  setFormula: (address: CellAddress, formula: string) => void;
  addWorksheet: () => void;
  removeWorksheet: (worksheetId: string) => void;
  renameWorksheet: (worksheetId: string, newName: string) => void;
  saveWorkbook: () => Promise<void>;
  exportWorkbook: () => Promise<Blob>;
  getCellRange: (start: CellAddress, end: CellAddress) => CellRange;
  calculateFormula: (formula: string) => CellValue;
}

const useSpreadsheet = (workbookId: string): [SpreadsheetState, SpreadsheetActions] => {
  const [state, setState] = useState<SpreadsheetState>({
    workbook: null,
    activeWorksheet: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchWorkbook = async () => {
      try {
        const workbook = await ApiService.getWorkbook(workbookId);
        setState({
          workbook,
          activeWorksheet: workbook.worksheets[0] || null,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState(prevState => ({
          ...prevState,
          isLoading: false,
          error: 'Failed to load workbook',
        }));
      }
    };

    fetchWorkbook();
  }, [workbookId]);

  const getValue = useCallback((address: CellAddress): CellValue => {
    if (!state.activeWorksheet) return null;
    const cell = state.activeWorksheet.cells.find(c => 
      c.column === address.column && c.row === address.row
    );
    return cell ? cell.value : null;
  }, [state.activeWorksheet]);

  const setValue = useCallback((address: CellAddress, value: CellValue) => {
    setState(prevState => {
      if (!prevState.activeWorksheet) return prevState;
      const updatedCells = prevState.activeWorksheet.cells.map(cell => 
        cell.column === address.column && cell.row === address.row
          ? { ...cell, value }
          : cell
      );
      const updatedWorksheet = { ...prevState.activeWorksheet, cells: updatedCells };
      return {
        ...prevState,
        activeWorksheet: updatedWorksheet,
        workbook: {
          ...prevState.workbook!,
          worksheets: prevState.workbook!.worksheets.map(ws => 
            ws.id === updatedWorksheet.id ? updatedWorksheet : ws
          ),
        },
      };
    });
  }, []);

  const getFormula = useCallback((address: CellAddress): string | null => {
    if (!state.activeWorksheet) return null;
    const cell = state.activeWorksheet.cells.find(c => 
      c.column === address.column && c.row === address.row
    );
    return cell ? cell.formula : null;
  }, [state.activeWorksheet]);

  const setFormula = useCallback((address: CellAddress, formula: string) => {
    setState(prevState => {
      if (!prevState.activeWorksheet) return prevState;
      const updatedCells = prevState.activeWorksheet.cells.map(cell => 
        cell.column === address.column && cell.row === address.row
          ? { ...cell, formula, value: calculateFormula(formula) }
          : cell
      );
      const updatedWorksheet = { ...prevState.activeWorksheet, cells: updatedCells };
      return {
        ...prevState,
        activeWorksheet: updatedWorksheet,
        workbook: {
          ...prevState.workbook!,
          worksheets: prevState.workbook!.worksheets.map(ws => 
            ws.id === updatedWorksheet.id ? updatedWorksheet : ws
          ),
        },
      };
    });
  }, []);

  const addWorksheet = useCallback(() => {
    setState(prevState => {
      if (!prevState.workbook) return prevState;
      const newWorksheet: Worksheet = {
        id: `ws_${Date.now()}`,
        name: `Sheet ${prevState.workbook.worksheets.length + 1}`,
        cells: [],
      };
      return {
        ...prevState,
        workbook: {
          ...prevState.workbook,
          worksheets: [...prevState.workbook.worksheets, newWorksheet],
        },
        activeWorksheet: newWorksheet,
      };
    });
  }, []);

  const removeWorksheet = useCallback((worksheetId: string) => {
    setState(prevState => {
      if (!prevState.workbook) return prevState;
      const updatedWorksheets = prevState.workbook.worksheets.filter(ws => ws.id !== worksheetId);
      return {
        ...prevState,
        workbook: {
          ...prevState.workbook,
          worksheets: updatedWorksheets,
        },
        activeWorksheet: updatedWorksheets[0] || null,
      };
    });
  }, []);

  const renameWorksheet = useCallback((worksheetId: string, newName: string) => {
    setState(prevState => {
      if (!prevState.workbook) return prevState;
      const updatedWorksheets = prevState.workbook.worksheets.map(ws => 
        ws.id === worksheetId ? { ...ws, name: newName } : ws
      );
      return {
        ...prevState,
        workbook: {
          ...prevState.workbook,
          worksheets: updatedWorksheets,
        },
        activeWorksheet: prevState.activeWorksheet?.id === worksheetId
          ? { ...prevState.activeWorksheet, name: newName }
          : prevState.activeWorksheet,
      };
    });
  }, []);

  const saveWorkbook = useCallback(async () => {
    if (!state.workbook) return;
    try {
      await ApiService.saveWorkbook(state.workbook);
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        error: 'Failed to save workbook',
      }));
    }
  }, [state.workbook]);

  const exportWorkbook = useCallback(async () => {
    if (!state.workbook) throw new Error('No workbook to export');
    try {
      return await ApiService.exportWorkbook(state.workbook.id);
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        error: 'Failed to export workbook',
      }));
      throw error;
    }
  }, [state.workbook]);

  const getCellRange = useCallback((start: CellAddress, end: CellAddress): CellRange => {
    return CellAddressHelper.getCellRange(start, end);
  }, []);

  const calculateFormula = useCallback((formula: string): CellValue => {
    return FormulaParser.parse(formula, getValue);
  }, [getValue]);

  const actions: SpreadsheetActions = {
    getValue,
    setValue,
    getFormula,
    setFormula,
    addWorksheet,
    removeWorksheet,
    renameWorksheet,
    saveWorkbook,
    exportWorkbook,
    getCellRange,
    calculateFormula,
  };

  return [state, actions];
};

export default useSpreadsheet;

// Human tasks:
// TODO: Implement error handling and loading states for API calls
// TODO: Add support for undo/redo operations (Optional)
// TODO: Implement caching mechanism for improved performance (Optional)