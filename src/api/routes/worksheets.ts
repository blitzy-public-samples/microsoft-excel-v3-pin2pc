import express from 'express';
import { WorksheetController } from '../controllers/worksheetController';
import { auth } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

/**
 * Creates and returns an Express router with worksheet-related routes
 * @returns {express.Router} Router instance with defined routes
 */
export const worksheetRoutes = (): express.Router => {
  const router = express.Router();
  const worksheetController = new WorksheetController();

  // Apply rate limiting to all worksheet routes
  router.use(rateLimiter);

  // GET /worksheets
  router.get('/', auth, worksheetController.getAllWorksheets);

  // GET /worksheets/:id
  router.get('/:id', auth, worksheetController.getWorksheetById);

  // POST /worksheets
  router.post('/', auth, worksheetController.createWorksheet);

  // PUT /worksheets/:id
  router.put('/:id', auth, worksheetController.updateWorksheet);

  // DELETE /worksheets/:id
  router.delete('/:id', auth, worksheetController.deleteWorksheet);

  return router;
};

// TODO: Implement proper error handling middleware
// TODO: Add input validation middleware for request parameters and body
// TODO: Implement pagination for list endpoints
// TODO: Add documentation comments for each route
// TODO: Consider implementing request logging middleware
// TODO: Review and optimize route naming conventions