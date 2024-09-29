import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Grid from '../../../components/Spreadsheet/Grid';
import { SpreadsheetContext } from '../../../contexts/SpreadsheetContext';
import { Workbook, Worksheet } from '../../../types/spreadsheet';

// Mock SpreadsheetContext
const mockSpreadsheetContext = {
  workbook: {} as Workbook,
  activeWorksheet: {} as Worksheet,
  selectedCell: null,
  setSelectedCell: jest.fn(),
  updateCell: jest.fn(),
};

// Helper function to render Grid with mocked context
const renderGridWithContext = (contextValue = mockSpreadsheetContext) => {
  return render(
    <SpreadsheetContext.Provider value={contextValue}>
      <Grid />
    </SpreadsheetContext.Provider>
  );
};

describe('Grid component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { container } = renderGridWithContext();
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });

  it('renders the correct number of columns and rows', () => {
    const mockWorksheet: Worksheet = {
      id: '1',
      name: 'Sheet1',
      cells: {},
      columnCount: 10,
      rowCount: 20,
    };
    const contextValue = { ...mockSpreadsheetContext, activeWorksheet: mockWorksheet };
    renderGridWithContext(contextValue);

    const cells = screen.getAllByRole('gridcell');
    expect(cells).toHaveLength(10 * 20); // 10 columns * 20 rows
  });

  it('renders column headers correctly', () => {
    renderGridWithContext();
    const columnHeaders = screen.getAllByRole('columnheader');
    expect(columnHeaders[0]).toHaveTextContent('A');
    expect(columnHeaders[1]).toHaveTextContent('B');
    // Add more assertions for other column headers as needed
  });

  it('renders row headers correctly', () => {
    renderGridWithContext();
    const rowHeaders = screen.getAllByRole('rowheader');
    expect(rowHeaders[0]).toHaveTextContent('1');
    expect(rowHeaders[1]).toHaveTextContent('2');
    // Add more assertions for other row headers as needed
  });

  it('handles cell selection', () => {
    renderGridWithContext();
    const cell = screen.getAllByRole('gridcell')[0];
    fireEvent.click(cell);
    expect(mockSpreadsheetContext.setSelectedCell).toHaveBeenCalledWith(expect.objectContaining({
      row: 0,
      col: 0,
    }));
  });

  it('updates when workbook data changes', () => {
    const { rerender } = renderGridWithContext();
    const initialCells = screen.getAllByRole('gridcell');

    const updatedWorksheet: Worksheet = {
      id: '1',
      name: 'Sheet1',
      cells: { 'A1': { value: 'Updated' } },
      columnCount: 10,
      rowCount: 20,
    };
    const updatedContextValue = { ...mockSpreadsheetContext, activeWorksheet: updatedWorksheet };

    rerender(
      <SpreadsheetContext.Provider value={updatedContextValue}>
        <Grid />
      </SpreadsheetContext.Provider>
    );

    const updatedCells = screen.getAllByRole('gridcell');
    expect(updatedCells[0]).toHaveTextContent('Updated');
  });

  // Add more tests here as needed

  // Placeholder for virtualization test
  it('handles scrolling and virtualization', () => {
    // Implement test for scrolling and virtualization
  });

  // Placeholder for freezing rows and columns test
  it('supports freezing rows and columns', () => {
    // Implement test for freezing rows and columns
  });

  // Placeholder for column and row resizing test
  it('allows column and row resizing', () => {
    // Implement test for column and row resizing
  });

  // Placeholder for merged cells test
  it('handles merged cells correctly', () => {
    // Implement test for merged cells functionality
  });

  // Placeholder for undo/redo test
  it('supports undo/redo functionality', () => {
    // Implement test for undo/redo functionality
  });
});

// Commented list of human tasks
/*
Human tasks:
1. Implement tests for virtualization and performance with large datasets (Required)
2. Add tests for freezing rows and columns functionality (Required)
3. Implement tests for column and row resizing (Required)
4. Add tests for merged cells functionality (Optional)
5. Implement tests for undo/redo functionality in the grid (Required)
*/