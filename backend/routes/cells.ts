import express, { Router } from 'express';
import * as cellController from '../controllers/cellController';
import { authMiddleware } from '../middleware/authentication';
import { rateLimiter } from '../middleware/rateLimiter';

const configureCellRoutes = (): Router => {
  const router = express.Router();

  // Apply authentication middleware to all routes
  router.use(authMiddleware);

  // Apply rate limiting middleware to all routes
  router.use(rateLimiter);

  // Define GET route for retrieving cell value
  router.get(
    '/workbooks/:workbookId/worksheets/:worksheetId/cells/:cellAddress',
    cellController.getCellValue
  );

  // Define PUT route for setting cell value
  router.put(
    '/workbooks/:workbookId/worksheets/:worksheetId/cells/:cellAddress',
    cellController.setCellValue
  );

  // Define GET route for retrieving cell style
  router.get(
    '/workbooks/:workbookId/worksheets/:worksheetId/cells/:cellAddress/style',
    cellController.getCellStyle
  );

  // Define PUT route for setting cell style
  router.put(
    '/workbooks/:workbookId/worksheets/:worksheetId/cells/:cellAddress/style',
    cellController.setCellStyle
  );

  // Define DELETE route for clearing cell contents
  router.delete(
    '/workbooks/:workbookId/worksheets/:worksheetId/cells/:cellAddress',
    cellController.clearCell
  );

  return router;
};

export default configureCellRoutes;

// TODO: Implement input validation middleware for all routes
// TODO: Add support for batch operations on multiple cells
// TODO: Implement versioning for the API routes
// TODO: Add documentation comments for OpenAPI/Swagger
// TODO: Implement proper error handling and response formatting