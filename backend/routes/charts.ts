import express from 'express';
import { ChartController } from '../controllers/chartController';
import { authMiddleware } from '../middleware/authentication';
import { validateChartInput } from '../middleware/validation';

/**
 * Configures and returns the router for chart-related routes
 * @param chartController An instance of ChartController
 * @returns Configured express.Router for chart routes
 */
export function configureChartRoutes(chartController: ChartController): express.Router {
    const router = express.Router();

    // Create a new chart
    router.post('/', authMiddleware, validateChartInput, chartController.createChart);

    // Get a specific chart
    router.get('/:chartId', authMiddleware, chartController.getChart);

    // Update a chart
    router.put('/:chartId', authMiddleware, validateChartInput, chartController.updateChart);

    // Delete a chart
    router.delete('/:chartId', authMiddleware, chartController.deleteChart);

    // Get all charts for a specific worksheet
    router.get('/worksheet/:worksheetId', authMiddleware, chartController.getChartsForWorksheet);

    return router;
}

// Human tasks:
// TODO: Implement rate limiting for chart API endpoints (Required)
// TODO: Add swagger documentation for all chart routes (Required)
// TODO: Implement versioning for the chart API (Optional)