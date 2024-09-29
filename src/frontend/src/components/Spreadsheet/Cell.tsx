import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Cell as CellType, CellStyle } from '../../types/spreadsheet';
import { CELL_TYPES } from '../../constants/cellTypes';
import useSpreadsheet from '../../hooks/useSpreadsheet';
import useFormula from '../../hooks/useFormula';
import * as cellAddressHelper from '../../utils/cellAddressHelper';
import * as dataValidator from '../../utils/dataValidator';

interface CellProps extends CellType {
  rowIndex: number;
  columnIndex: number;
}

const StyledCell = styled.div<{ isSelected: boolean; style: CellStyle }>`
  border: 1px solid #e0e0e0;
  padding: 4px;
  min-width: 80px;
  height: 24px;
  background-color: ${(props) => (props.isSelected ? '#e6f2ff' : 'white')};
  font-family: Arial, sans-serif;
  font-size: 14px;
  cursor: default;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  ${(props) => props.style && `
    font-weight: ${props.style.fontWeight};
    font-style: ${props.style.fontStyle};
    text-decoration: ${props.style.textDecoration};
    color: ${props.style.color};
    background-color: ${props.style.backgroundColor};
    text-align: ${props.style.textAlign};
  `}
`;

const CellInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  background-color: transparent;
`;

export const Cell: React.FC<CellProps> = ({ rowIndex, columnIndex, value, type, style }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const { selectedCell, setSelectedCell, updateCellValue } = useSpreadsheet();
  const { evaluateFormula } = useFormula();

  const isSelected = selectedCell?.rowIndex === rowIndex && selectedCell?.columnIndex === columnIndex;

  const cellAddress = cellAddressHelper.getCellAddress(rowIndex, columnIndex);

  const handleCellClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setSelectedCell({ rowIndex, columnIndex });
    if (event.detail === 2) {
      setIsEditing(true);
    }
  }, [rowIndex, columnIndex, setSelectedCell]);

  const handleCellChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setEditValue(newValue);
  }, []);

  const handleCellBlur = useCallback(() => {
    setIsEditing(false);
    if (editValue !== value) {
      const validatedValue = dataValidator.validateCellInput(editValue, type);
      updateCellValue(rowIndex, columnIndex, validatedValue);
      if (validatedValue.startsWith('=')) {
        evaluateFormula(validatedValue.slice(1), cellAddress);
      }
    }
  }, [editValue, value, rowIndex, columnIndex, type, updateCellValue, evaluateFormula, cellAddress]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const displayValue = type === CELL_TYPES.FORMULA ? evaluateFormula(value.slice(1), cellAddress) : value;

  return (
    <StyledCell
      isSelected={isSelected}
      style={style}
      onClick={handleCellClick}
    >
      {isEditing ? (
        <CellInput
          value={editValue}
          onChange={handleCellChange}
          onBlur={handleCellBlur}
          autoFocus
        />
      ) : (
        displayValue
      )}
    </StyledCell>
  );
};

export default Cell;

// Human tasks:
// 1. Implement keyboard navigation between cells
// 2. Add support for cell ranges and multi-cell selection
// 3. Implement copy/paste functionality for cells
// 4. Add right-click context menu for additional cell operations