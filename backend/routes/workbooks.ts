import express from 'express';
import * as workbookController from '../controllers/workbookController';
import { authenticate } from '../middleware/authentication';
import { authorize } from '../middleware/authorization';

const router = express.Router();

/**
 * Configures and returns an Express router with all workbook-related routes.
 * @returns {express.Router} Configured Express router for workbook routes
 */
export function configureWorkbookRoutes(): express.Router {
  // Create a new workbook
  router.post('/', authenticate, workbookController.createWorkbook);

  // Get a specific workbook
  router.get('/:id', authenticate, authorize, workbookController.getWorkbook);

  // Update a workbook
  router.put('/:id', authenticate, authorize, workbookController.updateWorkbook);

  // Delete a workbook
  router.delete('/:id', authenticate, authorize, workbookController.deleteWorkbook);

  // Share a workbook
  router.post('/:id/share', authenticate, authorize, workbookController.shareWorkbook);

  // Unshare a workbook
  router.post('/:id/unshare', authenticate, authorize, workbookController.unshareWorkbook);

  // List workbooks
  router.get('/', authenticate, workbookController.listWorkbooks);

  return router;
}

export default configureWorkbookRoutes();

// TODO: Implement proper error handling for route configuration
// TODO: Add input validation middleware for request parameters and body
// TODO: Implement rate limiting middleware for all routes
// TODO: Add logging middleware to track API usage and performance
// TODO: Consider implementing versioning for the API routes