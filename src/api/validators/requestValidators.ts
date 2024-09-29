import { z } from 'zod';
import {
  CreateWorkbookRequest,
  UpdateWorkbookRequest,
  CreateWorksheetRequest,
  UpdateWorksheetRequest,
  UpdateCellRequest,
  CreateChartRequest,
  UpdateChartRequest,
  ShareWorkbookRequest
} from '../types/apiTypes';
import { UserRole } from '../../shared/types/user';
import { CellValue, CellFormat } from '../../shared/types/cell';
import { ChartOptions } from '../../shared/types/chart';

// Helper function to create a validator that returns true or throws an error
const createValidator = <T>(schema: z.ZodType<T>) => (data: T): boolean => {
  schema.parse(data);
  return true;
};

// Define Zod schemas for each request type
const createWorkbookSchema = z.object({
  name: z.string().min(1).max(255),
  // Add other relevant fields for creating a workbook
});

const updateWorkbookSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  // Add other relevant fields for updating a workbook
});

const createWorksheetSchema = z.object({
  workbookId: z.string().uuid(),
  name: z.string().min(1).max(255),
  // Add other relevant fields for creating a worksheet
});

const updateWorksheetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  // Add other relevant fields for updating a worksheet
});

const updateCellSchema = z.object({
  worksheetId: z.string().uuid(),
  column: z.string().regex(/^[A-Z]+$/),
  row: z.number().int().positive(),
  value: z.union([z.string(), z.number(), z.boolean(), z.null()]),
  format: z.object({
    // Define the structure of CellFormat
  }).optional(),
  formula: z.string().optional(),
});

const createChartSchema = z.object({
  worksheetId: z.string().uuid(),
  type: z.enum(['bar', 'line', 'pie', 'scatter', 'area']),
  options: z.object({
    // Define the structure of ChartOptions
  }),
});

const updateChartSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['bar', 'line', 'pie', 'scatter', 'area']).optional(),
  options: z.object({
    // Define the structure of ChartOptions
  }).optional(),
});

const shareWorkbookSchema = z.object({
  workbookId: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.nativeEnum(UserRole),
});

// Export validation functions
export const validateCreateWorkbookRequest = createValidator<CreateWorkbookRequest>(createWorkbookSchema);
export const validateUpdateWorkbookRequest = createValidator<UpdateWorkbookRequest>(updateWorkbookSchema);
export const validateCreateWorksheetRequest = createValidator<CreateWorksheetRequest>(createWorksheetSchema);
export const validateUpdateWorksheetRequest = createValidator<UpdateWorksheetRequest>(updateWorksheetSchema);
export const validateUpdateCellRequest = createValidator<UpdateCellRequest>(updateCellSchema);
export const validateCreateChartRequest = createValidator<CreateChartRequest>(createChartSchema);
export const validateUpdateChartRequest = createValidator<UpdateChartRequest>(updateChartSchema);
export const validateShareWorkbookRequest = createValidator<ShareWorkbookRequest>(shareWorkbookSchema);

// Commented list of human tasks
/*
Human tasks:
1. Review and test all validation functions to ensure they cover all edge cases and potential security risks (Required)
2. Consider adding more granular validation for complex types like CellFormat and ChartOptions (Optional)
3. Implement custom error messages for validation failures to improve API usability (Optional)
*/