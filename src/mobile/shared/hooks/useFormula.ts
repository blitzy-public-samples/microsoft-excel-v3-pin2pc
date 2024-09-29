import { useState, useCallback, useContext } from 'react';
import { FormulaResult, Workbook } from '../types/SpreadsheetTypes';
import { evaluateFormula } from '../utils/FormulaParser';
import ApiService from '../services/ApiService';

interface UseFormulaProps {
  apiService: ApiService;
}

interface UseFormulaResult {
  formulaResult: FormulaResult | null;
  isCalculating: boolean;
  calculateFormula: (formula: string, workbookId: string, worksheetId: string) => Promise<void>;
  setFormulaResult: (result: FormulaResult) => void;
}

export const useFormula = ({ apiService }: UseFormulaProps): UseFormulaResult => {
  const [formulaResult, setFormulaResult] = useState<FormulaResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const calculateFormula = useCallback(
    async (formula: string, workbookId: string, worksheetId: string): Promise<void> => {
      setIsCalculating(true);
      try {
        const result = await apiService.calculateFormula(formula, workbookId, worksheetId);
        setFormulaResult(result);
      } catch (error) {
        console.error('Error calculating formula:', error);
        setFormulaResult({ error: 'Failed to calculate formula' });
      } finally {
        setIsCalculating(false);
      }
    },
    [apiService]
  );

  const updateFormulaResult = useCallback((result: FormulaResult): void => {
    setFormulaResult(result);
  }, []);

  return {
    formulaResult,
    isCalculating,
    calculateFormula,
    setFormulaResult: updateFormulaResult,
  };
};

// Human tasks:
// TODO: Implement caching mechanism for frequently used formulas
// TODO: Add support for formula suggestions and auto-completion
// TODO: Implement error handling for network failures during formula calculation