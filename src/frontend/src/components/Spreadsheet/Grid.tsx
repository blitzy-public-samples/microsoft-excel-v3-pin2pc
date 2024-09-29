import React, { useContext, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Workbook, Worksheet, Row, Column } from '../../types/spreadsheet';
import Cell from './Cell';
import useSpreadsheet from '../../hooks/useSpreadsheet';
import { SpreadsheetContext } from '../../contexts/SpreadsheetContext';

const GridContainer = styled.div`
  overflow: auto;
  height: calc(100vh - 120px); // Adjust based on your layout
  width: 100%;
`;

const GridTable = styled.table`
  border-collapse: collapse;
`;

const HeaderCell = styled.th`
  position: sticky;
  background-color: #f1f1f1;
  z-index: 10;
  padding: 4px 8px;
  border: 1px solid #ddd;
`;

const ColumnHeader = styled(HeaderCell)`
  top: 0;
`;

const RowHeader = styled(HeaderCell)`
  left: 0;
`;

const Grid: React.FC = () => {
  const { workbook, activeWorksheet } = useContext(SpreadsheetContext);
  const { updateCell } = useSpreadsheet();
  const [visibleRange, setVisibleRange] = useState({ startRow: 0, endRow: 50, startCol: 0, endCol: 20 });

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollLeft, clientHeight, clientWidth } = event.currentTarget;
    const newStartRow = Math.floor(scrollTop / 25); // Assuming 25px row height
    const newEndRow = Math.min(newStartRow + Math.ceil(clientHeight / 25), activeWorksheet.rows.length);
    const newStartCol = Math.floor(scrollLeft / 100); // Assuming 100px column width
    const newEndCol = Math.min(newStartCol + Math.ceil(clientWidth / 100), activeWorksheet.columns.length);

    setVisibleRange({ startRow: newStartRow, endRow: newEndRow, startCol: newStartCol, endCol: newEndCol });
  }, [activeWorksheet]);

  useEffect(() => {
    // Reset visible range when active worksheet changes
    setVisibleRange({ startRow: 0, endRow: 50, startCol: 0, endCol: 20 });
  }, [activeWorksheet]);

  const renderColumnHeaders = useCallback(() => {
    return activeWorksheet.columns.slice(visibleRange.startCol, visibleRange.endCol).map((column, index) => (
      <ColumnHeader key={column.id}>
        {String.fromCharCode(65 + visibleRange.startCol + index)}
      </ColumnHeader>
    ));
  }, [activeWorksheet, visibleRange]);

  const renderRowHeaders = useCallback(() => {
    return activeWorksheet.rows.slice(visibleRange.startRow, visibleRange.endRow).map((row, index) => (
      <RowHeader key={row.id}>{visibleRange.startRow + index + 1}</RowHeader>
    ));
  }, [activeWorksheet, visibleRange]);

  const renderCells = useCallback(() => {
    return activeWorksheet.rows.slice(visibleRange.startRow, visibleRange.endRow).map((row) => (
      <tr key={row.id}>
        {renderRowHeaders()}
        {activeWorksheet.columns.slice(visibleRange.startCol, visibleRange.endCol).map((column) => (
          <Cell
            key={`${row.id}-${column.id}`}
            rowIndex={row.index}
            columnIndex={column.index}
            value={activeWorksheet.cells[`${row.index},${column.index}`]?.value || ''}
            onChange={(value) => updateCell(row.index, column.index, value)}
          />
        ))}
      </tr>
    ));
  }, [activeWorksheet, visibleRange, updateCell]);

  return (
    <GridContainer onScroll={handleScroll}>
      <GridTable>
        <thead>
          <tr>
            <th></th>
            {renderColumnHeaders()}
          </tr>
        </thead>
        <tbody>
          {renderCells()}
        </tbody>
      </GridTable>
    </GridContainer>
  );
};

export default Grid;

// Human tasks:
// 1. Implement efficient rendering and scrolling for large datasets (virtualization)
// 2. Add support for freezing rows and columns
// 3. Implement column and row resizing functionality
// 4. Add support for merging cells
// 5. Implement undo/redo functionality for grid operations