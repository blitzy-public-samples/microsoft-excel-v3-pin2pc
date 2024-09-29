import express from 'express';
import * as worksheetController from '../controllers/worksheetController';
import { authMiddleware } from '../middleware/authentication';
import { validateWorksheetInput } from '../middleware/validators/worksheetValidator';

const router = express.Router();

/**
 * Worksheet routes
 * @module WorksheetRoutes
 */

/**
 * GET /api/worksheets
 * @description Get all worksheets for the authenticated user
 * @access Private
 */
router.get('/', authMiddleware, worksheetController.getAllWorksheets);

/**
 * GET /api/worksheets/:id
 * @description Get a specific worksheet by ID
 * @access Private
 */
router.get('/:id', authMiddleware, worksheetController.getWorksheetById);

/**
 * POST /api/worksheets
 * @description Create a new worksheet
 * @access Private
 */
router.post('/', authMiddleware, validateWorksheetInput, worksheetController.createWorksheet);

/**
 * PUT /api/worksheets/:id
 * @description Update an existing worksheet
 * @access Private
 */
router.put('/:id', authMiddleware, validateWorksheetInput, worksheetController.updateWorksheet);

/**
 * DELETE /api/worksheets/:id
 * @description Delete a worksheet
 * @access Private
 */
router.delete('/:id', authMiddleware, worksheetController.deleteWorksheet);

/**
 * GET /api/worksheets/:id/cells
 * @description Get all cells for a specific worksheet
 * @access Private
 */
router.get('/:id/cells', authMiddleware, worksheetController.getWorksheetCells);

/**
 * POST /api/worksheets/:id/cells
 * @description Add or update cells in a worksheet
 * @access Private
 */
router.post('/:id/cells', authMiddleware, validateWorksheetInput, worksheetController.updateWorksheetCells);

export default router;

// TODO: Implement rate limiting for API endpoints
// TODO: Add API documentation using Swagger or similar tool
// TODO: Implement versioning for the API routes