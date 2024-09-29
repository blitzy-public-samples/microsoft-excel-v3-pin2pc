import express from 'express';
import { FormulaController } from '../controllers/formulaController';
import { auth } from '../middleware/auth';
import { ApiResponse } from '../types/apiTypes';

const createFormulaRoutes = (): express.Router => {
  const router = express.Router();

  // Create a new formula in a specific cell
  router.post(
    '/workbooks/:workbookId/worksheets/:worksheetId/formulas',
    auth.authenticate,
    async (req: express.Request, res: express.Response) => {
      try {
        const result = await FormulaController.createFormula(req, res);
        res.status(201).json(result as ApiResponse);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' } as ApiResponse);
      }
    }
  );

  // Retrieve the formula for a specific cell
  router.get(
    '/workbooks/:workbookId/worksheets/:worksheetId/formulas/:cellId',
    auth.authenticate,
    async (req: express.Request, res: express.Response) => {
      try {
        const result = await FormulaController.getFormula(req, res);
        res.status(200).json(result as ApiResponse);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' } as ApiResponse);
      }
    }
  );

  // Update the formula for a specific cell
  router.put(
    '/workbooks/:workbookId/worksheets/:worksheetId/formulas/:cellId',
    auth.authenticate,
    async (req: express.Request, res: express.Response) => {
      try {
        const result = await FormulaController.updateFormula(req, res);
        res.status(200).json(result as ApiResponse);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' } as ApiResponse);
      }
    }
  );

  // Delete the formula from a specific cell
  router.delete(
    '/workbooks/:workbookId/worksheets/:worksheetId/formulas/:cellId',
    auth.authenticate,
    async (req: express.Request, res: express.Response) => {
      try {
        const result = await FormulaController.deleteFormula(req, res);
        res.status(200).json(result as ApiResponse);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' } as ApiResponse);
      }
    }
  );

  // Evaluate a formula without saving it
  router.post(
    '/workbooks/:workbookId/worksheets/:worksheetId/formulas/evaluate',
    auth.authenticate,
    async (req: express.Request, res: express.Response) => {
      try {
        const result = await FormulaController.evaluateFormula(req, res);
        res.status(200).json(result as ApiResponse);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' } as ApiResponse);
      }
    }
  );

  return router;
};

export { createFormulaRoutes };

// TODO: Implement error handling middleware for formula-specific errors
// TODO: Add input validation middleware for formula routes
// TODO: Consider implementing a bulk formula update route for efficiency
// TODO: Review and ensure proper authorization checks for formula operations