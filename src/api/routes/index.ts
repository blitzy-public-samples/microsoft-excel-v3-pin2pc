import { Router } from 'express';
import workbookRoutes from './workbooks';
import worksheetRoutes from './worksheets';
import cellRoutes from './cells';
import formulaRoutes from './formulas';
import chartRoutes from './charts';

/**
 * Creates and configures the main router for the Excel API by combining all individual route modules.
 * @returns {Router} The configured Express router containing all API routes
 */
function createRouter(): Router {
  const router = Router();

  // Mount individual route modules
  router.use('/workbooks', workbookRoutes);
  router.use('/worksheets', worksheetRoutes);
  router.use('/cells', cellRoutes);
  router.use('/formulas', formulaRoutes);
  router.use('/charts', chartRoutes);

  return router;
}

export default createRouter;

// Human tasks:
// TODO: Review and approve the overall API route structure
// TODO: Ensure that all necessary routes are included and properly organized
// TODO: Verify that the routing structure aligns with the Excel API design and best practices