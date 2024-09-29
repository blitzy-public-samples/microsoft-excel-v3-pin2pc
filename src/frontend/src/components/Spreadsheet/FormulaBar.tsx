import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFormula } from '../../hooks/useFormula';
import { useSpreadsheet } from '../../hooks/useSpreadsheet';
import { Cell } from '../../types/spreadsheet';

const StyledFormulaBar = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  background-color: #f1f1f1;
  border-bottom: 1px solid #ccc;
`;

const FormulaInput = styled.input`
  flex-grow: 1;
  padding: 5px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  margin-left: 10px;
`;

const FormulaBar: React.FC = () => {
  const { selectedCell, updateCellFormula } = useSpreadsheet();
  const { parseFormula, formulaError, clearFormulaError } = useFormula();
  const [formulaInput, setFormulaInput] = useState('');

  useEffect(() => {
    if (selectedCell) {
      setFormulaInput(selectedCell.formula || '');
    }
  }, [selectedCell]);

  const handleFormulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulaInput(e.target.value);
    clearFormulaError();
  };

  const handleFormulaSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && selectedCell) {
      const parsedFormula = parseFormula(formulaInput);
      if (!formulaError) {
        updateCellFormula(selectedCell.id, formulaInput, parsedFormula);
      }
    }
  };

  return (
    <StyledFormulaBar>
      <FormulaInput
        value={formulaInput}
        onChange={handleFormulaChange}
        onKeyDown={handleFormulaSubmit}
        placeholder="Enter formula"
      />
      {formulaError && <ErrorMessage>{formulaError}</ErrorMessage>}
    </StyledFormulaBar>
  );
};

export default FormulaBar;

// Human tasks:
// TODO: Implement autocomplete functionality for formula functions and cell references
// TODO: Add keyboard shortcuts for common formula operations (e.g., sum, average)
// TODO: Implement formula syntax highlighting in the input field