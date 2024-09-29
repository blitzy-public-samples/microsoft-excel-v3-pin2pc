import { Router } from 'express';
import { WorkbookController } from '../controllers/workbookController';
import { auth } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

/**
 * Configures and returns the router for workbook-related routes
 * @param workbookController An instance of WorkbookController
 * @returns Express router configured with workbook routes
 */
export const configureWorkbookRoutes = (workbookController: WorkbookController): Router => {
  const router = Router();

  // Apply auth middleware to all routes
  router.use(auth);

  // Apply rateLimiter middleware to all routes
  router.use(rateLimiter);

  // Define POST /workbooks route for creating a new workbook
  router.post('/', workbookController.createWorkbook);

  // Define GET /workbooks/:id route for retrieving a workbook
  router.get('/:id', workbookController.getWorkbook);

  // Define PUT /workbooks/:id route for updating a workbook
  router.put('/:id', workbookController.updateWorkbook);

  // Define DELETE /workbooks/:id route for deleting a workbook
  router.delete('/:id', workbookController.deleteWorkbook);

  // Define GET /workbooks route for listing workbooks
  router.get('/', workbookController.listWorkbooks);

  // Define POST /workbooks/:id/share route for sharing a workbook
  router.post('/:id/share', workbookController.shareWorkbook);

  return router;
};

// Human tasks:
// TODO: Review and adjust rate limiting settings for each route based on expected usage patterns
// TODO: Implement request validation middleware for each route to ensure proper input format
// TODO: Consider adding additional routes for advanced workbook operations like copying or exporting
// TODO: Evaluate the need for versioning in the API routes (e.g., /v1/workbooks)