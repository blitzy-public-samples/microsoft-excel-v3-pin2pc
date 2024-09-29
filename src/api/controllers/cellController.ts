import { Request, Response } from 'express';
import { IApiService } from '../interfaces/IApiService';
import { ApiResponse, UpdateCellRequest, CellRangeResponse } from '../types/apiTypes';
import { Cell } from '../../shared/types/cell';

/**
 * Controller class for handling cell-related API requests
 */
class CellController {
  private apiService: IApiService;

  /**
   * Initializes the CellController with an API service
   * @param apiService The API service to be used for cell operations
   */
  constructor(apiService: IApiService) {
    this.apiService = apiService;
  }

  /**
   * Controller method for updating a cell
   * @param req Express Request object
   * @param res Express Response object
   */
  public updateCell = async (req: Request, res: Response): Promise<void> => {
    try {
      const updateCellRequest: UpdateCellRequest = req.body;
      const updatedCell: Cell = await this.apiService.updateCell(updateCellRequest);
      const response: ApiResponse<Cell> = { success: true, data: updatedCell };
      res.status(200).json(response);
    } catch (error) {
      const errorResponse: ApiResponse<null> = { success: false, error: error.message };
      res.status(400).json(errorResponse);
    }
  };

  /**
   * Controller method for retrieving a range of cells
   * @param req Express Request object
   * @param res Express Response object
   */
  public getCellRange = async (req: Request, res: Response): Promise<void> => {
    try {
      const { workbookId, worksheetId, range } = req.params;
      const cellRange: CellRangeResponse = await this.apiService.getCellRange(workbookId, worksheetId, range);
      const response: ApiResponse<CellRangeResponse> = { success: true, data: cellRange };
      res.status(200).json(response);
    } catch (error) {
      const errorResponse: ApiResponse<null> = { success: false, error: error.message };
      res.status(400).json(errorResponse);
    }
  };
}

// Standalone functions for direct use in routing if needed

/**
 * Handles the API request to update a cell
 * @param req Express Request object
 * @param res Express Response object
 */
export async function updateCell(req: Request, res: Response): Promise<void> {
  const controller = new CellController(req.app.locals.apiService);
  await controller.updateCell(req, res);
}

/**
 * Handles the API request to retrieve a range of cells
 * @param req Express Request object
 * @param res Express Response object
 */
export async function getCellRange(req: Request, res: Response): Promise<void> {
  const controller = new CellController(req.app.locals.apiService);
  await controller.getCellRange(req, res);
}

export default CellController;

// Human tasks:
// TODO: Implement error handling and input validation for cell updates and retrievals
// TODO: Add support for bulk cell updates to improve performance for large data sets
// TODO: Implement caching mechanisms for frequently accessed cell ranges
// TODO: Add support for cell formatting operations
// TODO: Implement real-time update notifications for collaborative editing