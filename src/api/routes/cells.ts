import { Router } from 'express';
import { CellController } from '../controllers/cellController';
import { auth } from '../middleware/auth';
import { ApiResponse, UpdateCellRequest, CellRangeResponse } from '../types/apiTypes';

/**
 * Configures and returns the router for cell-related API endpoints
 * @param cellController The CellController instance to handle cell operations
 * @returns Express router configured with cell routes
 */
export function configureCellRoutes(cellController: CellController): Router {
  const router = Router();

  /**
   * @route PUT /workbooks/:workbookId/worksheets/:worksheetId/cells/:cellId
   * @desc Update a specific cell
   * @access Private
   */
  router.put(
    '/workbooks/:workbookId/worksheets/:worksheetId/cells/:cellId',
    auth.authenticate,
    auth.authorize('edit'),
    async (req, res, next) => {
      try {
        const { workbookId, worksheetId, cellId } = req.params;
        const updateData: UpdateCellRequest = req.body;
        const result: ApiResponse = await cellController.updateCell(workbookId, worksheetId, cellId, updateData);
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * @route GET /workbooks/:workbookId/worksheets/:worksheetId/cells/:range
   * @desc Retrieve a range of cells
   * @access Private
   */
  router.get(
    '/workbooks/:workbookId/worksheets/:worksheetId/cells/:range',
    auth.authenticate,
    auth.authorize('read'),
    async (req, res, next) => {
      try {
        const { workbookId, worksheetId, range } = req.params;
        const result: CellRangeResponse = await cellController.getCellRange(workbookId, worksheetId, range);
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}

// TODO: Implement rate limiting for cell update and retrieval endpoints
// TODO: Add support for batch cell updates to improve performance
// TODO: Implement WebSocket support for real-time cell updates
// TODO: Add routes for cell formatting operations
// TODO: Implement versioning for the cell routes API