import { Request, Response } from 'express';
import { Cell } from '../models/cell';
import { Formula } from '../models/formula';
import { ICalculationEngine } from '../interfaces/ICalculationEngine';
import { DataValidator } from '../utils/dataValidator';

class CellController {
  private calculationEngine: ICalculationEngine;

  constructor(calculationEngine: ICalculationEngine) {
    this.calculationEngine = calculationEngine;
  }

  /**
   * Retrieves the value of a specific cell
   * @param req - Express request object
   * @param res - Express response object
   */
  public async getCellValue(req: Request, res: Response): Promise<void> {
    try {
      const { workbookId, worksheetId, cellAddress } = req.params;

      // Validate input parameters
      if (!DataValidator.isValidWorkbookId(workbookId) ||
          !DataValidator.isValidWorksheetId(worksheetId) ||
          !DataValidator.isValidCellAddress(cellAddress)) {
        res.status(400).json({ error: 'Invalid input parameters' });
        return;
      }

      // Retrieve the cell from the database
      const cell = await Cell.findOne({ workbookId, worksheetId, cellAddress });

      if (!cell) {
        res.status(404).json({ error: 'Cell not found' });
        return;
      }

      // Return the cell value in the response
      res.status(200).json({ value: cell.getValue() });
    } catch (error) {
      console.error('Error in getCellValue:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Sets the value of a specific cell
   * @param req - Express request object
   * @param res - Express response object
   */
  public async setCellValue(req: Request, res: Response): Promise<void> {
    try {
      const { workbookId, worksheetId, cellAddress } = req.params;
      const { value } = req.body;

      // Validate input parameters
      if (!DataValidator.isValidWorkbookId(workbookId) ||
          !DataValidator.isValidWorksheetId(worksheetId) ||
          !DataValidator.isValidCellAddress(cellAddress) ||
          !DataValidator.isValidCellValue(value)) {
        res.status(400).json({ error: 'Invalid input parameters' });
        return;
      }

      // Retrieve the cell from the database or create a new one
      let cell = await Cell.findOne({ workbookId, worksheetId, cellAddress });
      if (!cell) {
        cell = new Cell({ workbookId, worksheetId, cellAddress });
      }

      // Update the cell value
      if (typeof value === 'string' && value.startsWith('=')) {
        // If the value is a formula, parse and set it
        const formula = new Formula(value);
        cell.setFormula(formula);
      } else {
        cell.setValue(value);
      }

      // Save the updated cell to the database
      await cell.save();

      // Trigger recalculation of dependent cells
      await this.calculationEngine.recalculateDependentCells(cell);

      // Return the updated cell in the response
      res.status(200).json(cell);
    } catch (error) {
      console.error('Error in setCellValue:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Retrieves the style of a specific cell
   * @param req - Express request object
   * @param res - Express response object
   */
  public async getCellStyle(req: Request, res: Response): Promise<void> {
    try {
      const { workbookId, worksheetId, cellAddress } = req.params;

      // Validate input parameters
      if (!DataValidator.isValidWorkbookId(workbookId) ||
          !DataValidator.isValidWorksheetId(worksheetId) ||
          !DataValidator.isValidCellAddress(cellAddress)) {
        res.status(400).json({ error: 'Invalid input parameters' });
        return;
      }

      // Retrieve the cell from the database
      const cell = await Cell.findOne({ workbookId, worksheetId, cellAddress });

      if (!cell) {
        res.status(404).json({ error: 'Cell not found' });
        return;
      }

      // Return the cell style in the response
      res.status(200).json({ style: cell.getStyle() });
    } catch (error) {
      console.error('Error in getCellStyle:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Sets the style of a specific cell
   * @param req - Express request object
   * @param res - Express response object
   */
  public async setCellStyle(req: Request, res: Response): Promise<void> {
    try {
      const { workbookId, worksheetId, cellAddress } = req.params;
      const { style } = req.body;

      // Validate input parameters
      if (!DataValidator.isValidWorkbookId(workbookId) ||
          !DataValidator.isValidWorksheetId(worksheetId) ||
          !DataValidator.isValidCellAddress(cellAddress) ||
          !DataValidator.isValidCellStyle(style)) {
        res.status(400).json({ error: 'Invalid input parameters' });
        return;
      }

      // Retrieve the cell from the database or create a new one
      let cell = await Cell.findOne({ workbookId, worksheetId, cellAddress });
      if (!cell) {
        cell = new Cell({ workbookId, worksheetId, cellAddress });
      }

      // Update the cell style
      cell.setStyle(style);

      // Save the updated cell to the database
      await cell.save();

      // Return the updated cell in the response
      res.status(200).json(cell);
    } catch (error) {
      console.error('Error in setCellStyle:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Clears the contents of a specific cell
   * @param req - Express request object
   * @param res - Express response object
   */
  public async clearCell(req: Request, res: Response): Promise<void> {
    try {
      const { workbookId, worksheetId, cellAddress } = req.params;

      // Validate input parameters
      if (!DataValidator.isValidWorkbookId(workbookId) ||
          !DataValidator.isValidWorksheetId(worksheetId) ||
          !DataValidator.isValidCellAddress(cellAddress)) {
        res.status(400).json({ error: 'Invalid input parameters' });
        return;
      }

      // Retrieve the cell from the database
      const cell = await Cell.findOne({ workbookId, worksheetId, cellAddress });

      if (!cell) {
        res.status(404).json({ error: 'Cell not found' });
        return;
      }

      // Clear the cell contents
      cell.clearContents();

      // Save the updated cell to the database
      await cell.save();

      // Trigger recalculation of dependent cells
      await this.calculationEngine.recalculateDependentCells(cell);

      // Return the updated cell in the response
      res.status(200).json(cell);
    } catch (error) {
      console.error('Error in clearCell:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default CellController;

// TODO: Implement error handling and logging for all controller functions
// TODO: Add support for batch operations on multiple cells
// TODO: Implement caching mechanism for frequently accessed cells
// TODO: Add support for undo/redo operations
// TODO: Implement cell locking and unlocking functionality