import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/matchers';
import Spreadsheet from '../../components/Spreadsheet/Spreadsheet';
import Grid from '../../components/Spreadsheet/Grid';
import FormulaBar from '../../components/Spreadsheet/FormulaBar';
import Toolbar from '../../components/Spreadsheet/Toolbar';
import { SpreadsheetProvider } from '../../contexts/SpreadsheetContext';
import { mockWorkbook, mockWorksheet } from '../mocks/spreadsheetMocks';

// Helper function to render the Spreadsheet component with necessary providers
const renderSpreadsheet = (props = {}) => {
  return render(
    <SpreadsheetProvider>
      <Spreadsheet {...props} />
    </SpreadsheetProvider>
  );
};

describe('Spreadsheet Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Spreadsheet component with all sub-components', () => {
    const { getByTestId } = renderSpreadsheet();

    expect(getByTestId('spreadsheet')).toBeInTheDocument();
    expect(getByTestId('grid')).toBeInTheDocument();
    expect(getByTestId('formula-bar')).toBeInTheDocument();
    expect(getByTestId('toolbar')).toBeInTheDocument();
  });

  it('updates cell value when entered in the Grid', async () => {
    const { getByTestId } = renderSpreadsheet();
    const cellA1 = getByTestId('cell-A1');

    fireEvent.click(cellA1);
    fireEvent.change(cellA1, { target: { value: '42' } });
    fireEvent.blur(cellA1);

    await waitFor(() => {
      expect(cellA1).toHaveTextContent('42');
    });
  });

  it('updates formula bar when a cell is selected', () => {
    const { getByTestId } = renderSpreadsheet();
    const cellA1 = getByTestId('cell-A1');
    const formulaBar = getByTestId('formula-bar-input');

    fireEvent.click(cellA1);

    expect(formulaBar).toHaveValue(cellA1.textContent);
  });

  it('applies bold formatting when toolbar button is clicked', async () => {
    const { getByTestId } = renderSpreadsheet();
    const cellA1 = getByTestId('cell-A1');
    const boldButton = getByTestId('toolbar-bold');

    fireEvent.click(cellA1);
    fireEvent.click(boldButton);

    await waitFor(() => {
      expect(cellA1).toHaveStyle('font-weight: bold');
    });
  });

  it('calculates formula result correctly', async () => {
    const { getByTestId } = renderSpreadsheet();
    const cellA1 = getByTestId('cell-A1');
    const cellA2 = getByTestId('cell-A2');
    const cellA3 = getByTestId('cell-A3');

    fireEvent.click(cellA1);
    fireEvent.change(cellA1, { target: { value: '10' } });
    fireEvent.blur(cellA1);

    fireEvent.click(cellA2);
    fireEvent.change(cellA2, { target: { value: '20' } });
    fireEvent.blur(cellA2);

    fireEvent.click(cellA3);
    fireEvent.change(cellA3, { target: { value: '=SUM(A1:A2)' } });
    fireEvent.blur(cellA3);

    await waitFor(() => {
      expect(cellA3).toHaveTextContent('30');
    });
  });

  it('syncs data between Grid and FormulaBar', async () => {
    const { getByTestId } = renderSpreadsheet();
    const cellB1 = getByTestId('cell-B1');
    const formulaBar = getByTestId('formula-bar-input');

    fireEvent.click(cellB1);
    fireEvent.change(formulaBar, { target: { value: 'Hello, World!' } });
    fireEvent.blur(formulaBar);

    await waitFor(() => {
      expect(cellB1).toHaveTextContent('Hello, World!');
    });
  });

  // Add more integration tests here

  // TODO: Implement performance testing for large datasets
  // TODO: Add tests for collaborative editing scenarios
});