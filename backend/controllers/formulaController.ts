import { Request, Response } from 'express';
import { HttpStatus } from 'http-status-codes';
import { Formula } from '../models/formula';

export class FormulaController {
  /**
   * Creates a new formula in the database
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public static async createFormula(req: Request, res: Response): Promise<void> {
    try {
      const formulaData = req.body;
      const newFormula = new Formula(formulaData);
      const savedFormula = await newFormula.save();
      res.status(HttpStatus.CREATED).json(savedFormula);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error creating formula' });
    }
  }

  /**
   * Retrieves a formula by its ID
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public static async getFormula(req: Request, res: Response): Promise<void> {
    try {
      const formulaId = req.params.id;
      const formula = await Formula.findById(formulaId);
      if (!formula) {
        res.status(HttpStatus.NOT_FOUND).json({ error: 'Formula not found' });
        return;
      }
      res.status(HttpStatus.OK).json(formula);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error retrieving formula' });
    }
  }

  /**
   * Updates an existing formula
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public static async updateFormula(req: Request, res: Response): Promise<void> {
    try {
      const formulaId = req.params.id;
      const updatedFormulaData = req.body;
      const updatedFormula = await Formula.findByIdAndUpdate(formulaId, updatedFormulaData, { new: true });
      if (!updatedFormula) {
        res.status(HttpStatus.NOT_FOUND).json({ error: 'Formula not found' });
        return;
      }
      res.status(HttpStatus.OK).json(updatedFormula);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error updating formula' });
    }
  }

  /**
   * Deletes a formula by its ID
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public static async deleteFormula(req: Request, res: Response): Promise<void> {
    try {
      const formulaId = req.params.id;
      const deletedFormula = await Formula.findByIdAndDelete(formulaId);
      if (!deletedFormula) {
        res.status(HttpStatus.NOT_FOUND).json({ error: 'Formula not found' });
        return;
      }
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error deleting formula' });
    }
  }

  /**
   * Evaluates a formula with provided cell values
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public static async evaluateFormula(req: Request, res: Response): Promise<void> {
    try {
      const formulaId = req.params.id;
      const cellValues = req.body.cellValues;
      const formula = await Formula.findById(formulaId);
      if (!formula) {
        res.status(HttpStatus.NOT_FOUND).json({ error: 'Formula not found' });
        return;
      }
      // Assuming the Formula model has an evaluate method
      const result = await formula.evaluate(cellValues);
      res.status(HttpStatus.OK).json({ result });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error evaluating formula' });
    }
  }

  /**
   * Checks if a formula has circular references
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public static async checkCircularReference(req: Request, res: Response): Promise<void> {
    try {
      const formulaId = req.params.id;
      const currentCellAddress = req.body.currentCellAddress;
      const formula = await Formula.findById(formulaId);
      if (!formula) {
        res.status(HttpStatus.NOT_FOUND).json({ error: 'Formula not found' });
        return;
      }
      // Assuming the Formula model has an isCircular method
      const isCircular = await formula.isCircular(currentCellAddress);
      res.status(HttpStatus.OK).json({ isCircular });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error checking circular reference' });
    }
  }
}

// Human tasks:
// TODO: Implement error handling middleware
// TODO: Add input validation for all endpoints
// TODO: Implement authentication and authorization checks
// TODO: Add pagination for listing formulas (if needed)
// TODO: Implement caching mechanism for frequently accessed formulas
// TODO: Add logging for all controller actions