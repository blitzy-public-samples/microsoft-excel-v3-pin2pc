import { Router } from 'express';
import ChartController from '../controllers/chartController';
import ChartService from '../services/chartService';
import authMiddleware from '../middleware/auth';
import validateRequestBody from '../middleware/validateRequestBody';
import { CreateChartSchema, UpdateChartSchema } from '../validators/chartSchemas';

const router = Router();
const chartService = new ChartService();
const chartController = new ChartController(chartService);

/**
 * Initializes all chart-related routes
 * @returns {Router} Express Router instance with chart routes
 */
function initializeChartRoutes(): Router {
  // Create a new chart
  router.post(
    '/workbooks/:workbookId/worksheets/:worksheetId/charts',
    authMiddleware,
    validateRequestBody(CreateChartSchema),
    chartController.createChart
  );

  // Update an existing chart
  router.put(
    '/workbooks/:workbookId/worksheets/:worksheetId/charts/:chartId',
    authMiddleware,
    validateRequestBody(UpdateChartSchema),
    chartController.updateChart
  );

  // Delete a chart
  router.delete(
    '/workbooks/:workbookId/worksheets/:worksheetId/charts/:chartId',
    authMiddleware,
    chartController.deleteChart
  );

  // Get a specific chart
  router.get(
    '/workbooks/:workbookId/worksheets/:worksheetId/charts/:chartId',
    authMiddleware,
    chartController.getChart
  );

  // List all charts in a worksheet
  router.get(
    '/workbooks/:workbookId/worksheets/:worksheetId/charts',
    authMiddleware,
    chartController.listCharts
  );

  return router;
}

export default initializeChartRoutes();

// Human tasks:
// TODO: Implement rate limiting middleware for chart routes (Optional)
// TODO: Add request logging middleware to track API usage (Required)
// TODO: Implement pagination for the listCharts route (Optional)
// TODO: Add proper error handling middleware (Required)
// TODO: Implement CORS configuration if needed (Required)
// TODO: Consider adding cache headers for GET requests (Optional)