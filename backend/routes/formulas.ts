import express from 'express';
import * as formulaController from '../controllers/formulaController';

const formulaRouter = express.Router();

// Create a new formula
formulaRouter.post('/', formulaController.createFormula);

// Get a formula by ID
formulaRouter.get('/:id', formulaController.getFormula);

// Update an existing formula
formulaRouter.put('/:id', formulaController.updateFormula);

// Delete a formula by ID
formulaRouter.delete('/:id', formulaController.deleteFormula);

// Evaluate a formula with provided cell values
formulaRouter.post('/:id/evaluate', formulaController.evaluateFormula);

// Check if a formula has circular references
formulaRouter.post('/:id/check-circular', formulaController.checkCircularReference);

// TODO: Implement middleware for request validation
// TODO: Add authentication middleware to protect routes
// TODO: Implement rate limiting for API endpoints
// TODO: Add CORS configuration if needed
// TODO: Implement request logging middleware

export default formulaRouter;

/**
 * @fileoverview This file defines the routes for formula-related operations in the Excel backend API.
 * It maps HTTP methods and paths to their corresponding controller functions.
 * 
 * @requires express
 * @requires ../controllers/formulaController
 */

/**
 * Human tasks:
 * 1. Implement middleware for request validation (Required)
 * 2. Add authentication middleware to protect routes (Critical)
 * 3. Implement rate limiting for API endpoints (Required)
 * 4. Add CORS configuration if needed (Optional)
 * 5. Implement request logging middleware (Required)
 */