import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { FormulaBar } from '../../../components/Spreadsheet/FormulaBar';
import { useFormula } from '../../../hooks/useFormula';
import { useSpreadsheet } from '../../../hooks/useSpreadsheet';

// Mock the hooks
jest.mock('../../../hooks/useFormula');
jest.mock('../../../hooks/useSpreadsheet');

describe('FormulaBar component', () => {
  const mockUseFormula = useFormula as jest.Mock;
  const mockUseSpreadsheet = useSpreadsheet as jest.Mock;

  beforeEach(() => {
    // Reset mock function calls before each test
    jest.clearAllMocks();

    // Set up default mock implementations
    mockUseFormula.mockReturnValue({
      formula: '',
      setFormula: jest.fn(),
      evaluateFormula: jest.fn(),
    });

    mockUseSpreadsheet.mockReturnValue({
      activeCell: { row: 0, col: 0 },
      updateCell: jest.fn(),
    });
  });

  it('renders correctly', () => {
    render(<FormulaBar />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays the current formula', () => {
    mockUseFormula.mockReturnValue({
      formula: '=SUM(A1:A5)',
      setFormula: jest.fn(),
      evaluateFormula: jest.fn(),
    });

    render(<FormulaBar />);
    expect(screen.getByRole('textbox')).toHaveValue('=SUM(A1:A5)');
  });

  it('updates the formula when user types', () => {
    const setFormula = jest.fn();
    mockUseFormula.mockReturnValue({
      formula: '',
      setFormula,
      evaluateFormula: jest.fn(),
    });

    render(<FormulaBar />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '=1+1' } });

    expect(setFormula).toHaveBeenCalledWith('=1+1');
  });

  it('evaluates the formula on Enter key press', () => {
    const evaluateFormula = jest.fn();
    const updateCell = jest.fn();
    mockUseFormula.mockReturnValue({
      formula: '=1+1',
      setFormula: jest.fn(),
      evaluateFormula,
    });
    mockUseSpreadsheet.mockReturnValue({
      activeCell: { row: 0, col: 0 },
      updateCell,
    });

    render(<FormulaBar />);
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(evaluateFormula).toHaveBeenCalledWith('=1+1');
    expect(updateCell).toHaveBeenCalledWith(0, 0, expect.any(String));
  });

  it('does not evaluate the formula on other key presses', () => {
    const evaluateFormula = jest.fn();
    mockUseFormula.mockReturnValue({
      formula: '=1+1',
      setFormula: jest.fn(),
      evaluateFormula,
    });

    render(<FormulaBar />);
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'A', code: 'KeyA' });

    expect(evaluateFormula).not.toHaveBeenCalled();
  });
});

// Human tasks:
// TODO: Implement tests for formula autocomplete functionality once it's added to the component
// TODO: Add tests for keyboard shortcuts for common formula operations when implemented
// TODO: Create tests for formula syntax highlighting when it's added to the component