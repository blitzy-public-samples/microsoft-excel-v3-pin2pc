import { IApiService } from '../interfaces/IApiService';
import { ApiResponse, UpdateCellRequest, CellRangeResponse } from '../types/apiTypes';
import { Cell } from '../../shared/types/cell';
import { Formula } from '../../shared/types/formula';
import { IDataStorage } from '../../database/interfaces/IDataStorage';
import { ICalculationEngine } from '../../shared/interfaces/ICalculationEngine';
import { validateCellData } from '../../shared/validators/dataValidator';
import { validateFormula } from '../../shared/validators/formulaValidator';
import { parseCellRange } from '../../shared/helpers/cellAddressHelper';
import { logger } from '../logging/apiLogger';

export class CellService implements IApiService {
  private dataStorage: IDataStorage;
  private calculationEngine: ICalculationEngine;

  constructor(dataStorage: IDataStorage, calculationEngine: ICalculationEngine) {
    this.dataStorage = dataStorage;
    this.calculationEngine = calculationEngine;
  }

  /**
   * Updates a cell in a worksheet
   * @param request The update cell request
   * @returns A promise resolving to the updated cell
   */
  async updateCell(request: UpdateCellRequest): Promise<ApiResponse<Cell>> {
    try {
      logger.info(`Updating cell: ${JSON.stringify(request)}`);

      // Validate the request parameters
      if (!request.workbookId || !request.worksheetId || !request.cellAddress) {
        throw new Error('Invalid request parameters');
      }

      // Retrieve the existing cell from the dataStorage
      let cell = await this.dataStorage.getCell(request.workbookId, request.worksheetId, request.cellAddress);

      // If the cell doesn't exist, create a new one
      if (!cell) {
        cell = {
          workbookId: request.workbookId,
          worksheetId: request.worksheetId,
          address: request.cellAddress,
          value: null,
          formula: null,
          format: null,
        };
      }

      // Update the cell value
      if (request.value !== undefined) {
        validateCellData(request.value);
        cell.value = request.value;
      }

      // If a formula is provided, validate and process it
      if (request.formula !== undefined) {
        if (request.formula) {
          validateFormula(request.formula);
          cell.formula = request.formula;
          // Calculate the formula result
          cell.value = await this.calculationEngine.evaluateFormula(cell.formula, request.workbookId, request.worksheetId);
        } else {
          cell.formula = null;
        }
      }

      // Update the cell format if provided
      if (request.format !== undefined) {
        cell.format = request.format;
      }

      // Save the updated cell to the dataStorage
      await this.dataStorage.updateCell(cell);

      // Trigger recalculation of dependent cells using the calculationEngine
      await this.calculationEngine.recalculateDependents(request.workbookId, request.worksheetId, request.cellAddress);

      logger.info(`Cell updated successfully: ${cell.address}`);

      // Return the updated cell in the API response
      return {
        success: true,
        data: cell,
      };
    } catch (error) {
      logger.error(`Error updating cell: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Retrieves a range of cells from a worksheet
   * @param workbookId The ID of the workbook
   * @param worksheetId The ID of the worksheet
   * @param range The cell range to retrieve
   * @returns A promise resolving to the requested range of cells
   */
  async getCellRange(workbookId: string, worksheetId: string, range: string): Promise<CellRangeResponse> {
    try {
      logger.info(`Retrieving cell range: ${workbookId}, ${worksheetId}, ${range}`);

      // Validate the input parameters
      if (!workbookId || !worksheetId || !range) {
        throw new Error('Invalid input parameters');
      }

      // Parse the range string using cellAddressHelper
      const { startCell, endCell } = parseCellRange(range);

      // Retrieve the cells within the specified range from the dataStorage
      const cells = await this.dataStorage.getCellRange(workbookId, worksheetId, startCell, endCell);

      // Format the retrieved cells into the required response structure
      const formattedCells = cells.map(cell => ({
        address: cell.address,
        value: cell.value,
        formula: cell.formula,
        format: cell.format,
      }));

      logger.info(`Cell range retrieved successfully: ${range}`);

      // Return the cell range in the API response
      return {
        success: true,
        data: {
          workbookId,
          worksheetId,
          range,
          cells: formattedCells,
        },
      };
    } catch (error) {
      logger.error(`Error retrieving cell range: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Human tasks:
// TODO: Implement error handling and logging for all methods
// TODO: Add unit tests for the CellService class
// TODO: Optimize performance for large cell ranges
// TODO: Implement caching mechanism for frequently accessed cells
// TODO: Add support for batch cell updates