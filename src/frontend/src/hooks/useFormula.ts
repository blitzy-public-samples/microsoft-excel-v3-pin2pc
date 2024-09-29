import { useState, useCallback, useEffect } from 'react';
import { parseFormula, evaluateFormula, validateFormula } from '../utils/formulaParser';
import { FORMULA_FUNCTIONS } from '../constants/formulaFunctions';
import { useSpreadsheet } from './useSpreadsheet';

interface FormulaHookResult {
  currentFormula: string;
  formulaResult: any;
  formulaError: string | null;
  setFormula: (formula: string) => void;
  evaluateCurrentFormula: () => void;
  isFormulaValid: (formula: string) => boolean;
}

export const useFormula = (): FormulaHookResult => {
  // Initialize state for currentFormula, formulaResult, and formulaError
  const [currentFormula, setCurrentFormula] = useState<string>('');
  const [formulaResult, setFormulaResult] = useState<any>(null);
  const [formulaError, setFormulaError] = useState<string | null>(null);

  // Get the current spreadsheet context using useSpreadsheet hook
  const spreadsheet = useSpreadsheet();

  // Define callback functions for updating and evaluating formulas
  const setFormula = useCallback((formula: string) => {
    setCurrentFormula(formula);
    setFormulaError(null);
  }, []);

  const evaluateCurrentFormula = useCallback(() => {
    try {
      const parsedFormula = parseFormula(currentFormula);
      const result = evaluateFormula(parsedFormula, spreadsheet);
      setFormulaResult(result);
      setFormulaError(null);
    } catch (error) {
      setFormulaResult(null);
      setFormulaError(error.message);
    }
  }, [currentFormula, spreadsheet]);

  const isFormulaValid = useCallback((formula: string) => {
    try {
      validateFormula(formula, FORMULA_FUNCTIONS);
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  // Set up effect hooks for formula validation and evaluation
  useEffect(() => {
    if (currentFormula && isFormulaValid(currentFormula)) {
      evaluateCurrentFormula();
    }
  }, [currentFormula, isFormulaValid, evaluateCurrentFormula]);

  // Return an object with state and functions for formula management
  return {
    currentFormula,
    formulaResult,
    formulaError,
    setFormula,
    evaluateCurrentFormula,
    isFormulaValid,
  };
};

// Human tasks:
// TODO: Implement caching mechanism for parsed formulas to improve performance
// TODO: Add support for handling circular references in formulas
// TODO: Implement undo/redo functionality for formula changes