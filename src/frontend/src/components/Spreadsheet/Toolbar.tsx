import React, { useContext } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFont,
  faBold,
  faItalic,
  faUnderline,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
  faBorderAll,
  faMerge,
  faUnlink,
  faCut,
  faCopy,
  faPaste,
} from '@fortawesome/free-solid-svg-icons';
import { SpreadsheetContext } from '../../contexts/SpreadsheetContext';
import { useSpreadsheet } from '../../hooks/useSpreadsheet';
import { CellFormat, CellAlignment, CellBorder } from '../../types/spreadsheet';
import { formatCell, mergeCells, unmergeCells } from '../../utils/cellOperations';

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
`;

const ToolbarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  margin: 0 2px;
  border-radius: 4px;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const Toolbar: React.FC = () => {
  const { workbook, activeWorksheet } = useContext(SpreadsheetContext);
  const { updateCells, getSelectedCells } = useSpreadsheet();

  const handleFontStyle = (style: 'bold' | 'italic' | 'underline') => {
    const selectedCells = getSelectedCells();
    if (selectedCells.length === 0) return;

    const updatedCells = selectedCells.map((cell) => {
      const newFormat: CellFormat = { ...cell.format };
      newFormat[style] = !newFormat[style];
      return formatCell(cell, newFormat);
    });

    updateCells(updatedCells);
  };

  const handleAlignment = (alignment: CellAlignment) => {
    const selectedCells = getSelectedCells();
    if (selectedCells.length === 0) return;

    const updatedCells = selectedCells.map((cell) => {
      const newFormat: CellFormat = { ...cell.format, alignment };
      return formatCell(cell, newFormat);
    });

    updateCells(updatedCells);
  };

  const handleMergeCells = () => {
    const selectedCells = getSelectedCells();
    if (selectedCells.length <= 1) return;

    const mergedCells = mergeCells(selectedCells);
    updateCells(mergedCells);
  };

  const handleUnmergeCells = () => {
    const selectedCells = getSelectedCells();
    if (selectedCells.length === 0) return;

    const unmergedCells = unmergeCells(selectedCells);
    updateCells(unmergedCells);
  };

  const handleBorderChange = (border: CellBorder) => {
    const selectedCells = getSelectedCells();
    if (selectedCells.length === 0) return;

    const updatedCells = selectedCells.map((cell) => {
      const newFormat: CellFormat = { ...cell.format, border };
      return formatCell(cell, newFormat);
    });

    updateCells(updatedCells);
  };

  const handleCut = () => {
    // TODO: Implement cut functionality
    console.log('Cut operation not yet implemented');
  };

  const handleCopy = () => {
    // TODO: Implement copy functionality
    console.log('Copy operation not yet implemented');
  };

  const handlePaste = () => {
    // TODO: Implement paste functionality
    console.log('Paste operation not yet implemented');
  };

  return (
    <ToolbarContainer>
      <ToolbarButton onClick={() => handleFontStyle('bold')} title="Bold">
        <FontAwesomeIcon icon={faBold} />
      </ToolbarButton>
      <ToolbarButton onClick={() => handleFontStyle('italic')} title="Italic">
        <FontAwesomeIcon icon={faItalic} />
      </ToolbarButton>
      <ToolbarButton onClick={() => handleFontStyle('underline')} title="Underline">
        <FontAwesomeIcon icon={faUnderline} />
      </ToolbarButton>
      <ToolbarButton onClick={() => handleAlignment('left')} title="Align Left">
        <FontAwesomeIcon icon={faAlignLeft} />
      </ToolbarButton>
      <ToolbarButton onClick={() => handleAlignment('center')} title="Align Center">
        <FontAwesomeIcon icon={faAlignCenter} />
      </ToolbarButton>
      <ToolbarButton onClick={() => handleAlignment('right')} title="Align Right">
        <FontAwesomeIcon icon={faAlignRight} />
      </ToolbarButton>
      <ToolbarButton onClick={() => handleAlignment('justify')} title="Justify">
        <FontAwesomeIcon icon={faAlignJustify} />
      </ToolbarButton>
      <ToolbarButton onClick={handleMergeCells} title="Merge Cells">
        <FontAwesomeIcon icon={faMerge} />
      </ToolbarButton>
      <ToolbarButton onClick={handleUnmergeCells} title="Unmerge Cells">
        <FontAwesomeIcon icon={faUnlink} />
      </ToolbarButton>
      <ToolbarButton onClick={() => handleBorderChange('all')} title="All Borders">
        <FontAwesomeIcon icon={faBorderAll} />
      </ToolbarButton>
      <ToolbarButton onClick={handleCut} title="Cut">
        <FontAwesomeIcon icon={faCut} />
      </ToolbarButton>
      <ToolbarButton onClick={handleCopy} title="Copy">
        <FontAwesomeIcon icon={faCopy} />
      </ToolbarButton>
      <ToolbarButton onClick={handlePaste} title="Paste">
        <FontAwesomeIcon icon={faPaste} />
      </ToolbarButton>
    </ToolbarContainer>
  );
};

export default Toolbar;

// TODO: Implement clipboard API integration for cut, copy, and paste operations
// TODO: Add support for more advanced formatting options (e.g., font size, color, background color)
// TODO: Implement undo/redo functionality for toolbar actions
// TODO: Add keyboard shortcuts for common toolbar actions
// TODO: Implement a more advanced border editor with custom border styles