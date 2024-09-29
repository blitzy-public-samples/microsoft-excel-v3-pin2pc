import { ApiResponse, CreateChartRequest, UpdateChartRequest, ChartListResponse } from '../types/apiTypes';
import { Chart, ChartOptions } from '../../shared/types/chart';
import { IDataStorage } from '../../database/interfaces/IDataStorage';
import { ChartingEngine } from '../../backend/services/chartingEngine';

/**
 * ChartService class for handling chart-related operations in the Excel-like application.
 */
export class ChartService {
    private dataStorage: IDataStorage;
    private chartingEngine: ChartingEngine;

    /**
     * Initializes a new instance of the ChartService class.
     * @param dataStorage - The data storage interface for persisting chart data.
     * @param chartingEngine - The charting engine for creating and updating charts.
     */
    constructor(dataStorage: IDataStorage, chartingEngine: ChartingEngine) {
        this.dataStorage = dataStorage;
        this.chartingEngine = chartingEngine;
    }

    /**
     * Creates a new chart in the specified workbook and worksheet.
     * @param request - The create chart request containing chart details.
     * @returns A promise that resolves to an ApiResponse containing the created chart or an error.
     */
    async createChart(request: CreateChartRequest): Promise<ApiResponse<Chart>> {
        try {
            // Validate the request parameters
            this.validateCreateChartRequest(request);

            // Check if the workbook and worksheet exist
            const workbookExists = await this.dataStorage.workbookExists(request.workbookId);
            const worksheetExists = await this.dataStorage.worksheetExists(request.workbookId, request.worksheetId);

            if (!workbookExists || !worksheetExists) {
                throw new Error('Workbook or worksheet not found');
            }

            // Use the chartingEngine to create the chart based on the provided options
            const chart = await this.chartingEngine.createChart(request.options);

            // Save the chart data using the dataStorage
            const savedChart = await this.dataStorage.saveChart(request.workbookId, request.worksheetId, chart);

            // Return the created chart in an ApiResponse
            return { success: true, data: savedChart };
        } catch (error) {
            console.error('Error creating chart:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Updates an existing chart in the specified workbook and worksheet.
     * @param request - The update chart request containing updated chart details.
     * @returns A promise that resolves to an ApiResponse containing the updated chart or an error.
     */
    async updateChart(request: UpdateChartRequest): Promise<ApiResponse<Chart>> {
        try {
            // Validate the request parameters
            this.validateUpdateChartRequest(request);

            // Check if the workbook, worksheet, and chart exist
            const chartExists = await this.dataStorage.chartExists(request.workbookId, request.worksheetId, request.chartId);

            if (!chartExists) {
                throw new Error('Chart not found');
            }

            // Use the chartingEngine to update the chart based on the provided options
            const updatedChart = await this.chartingEngine.updateChart(request.chartId, request.options);

            // Save the updated chart data using the dataStorage
            const savedChart = await this.dataStorage.updateChart(request.workbookId, request.worksheetId, updatedChart);

            // Return the updated chart in an ApiResponse
            return { success: true, data: savedChart };
        } catch (error) {
            console.error('Error updating chart:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Deletes a chart from the specified workbook and worksheet.
     * @param workbookId - The ID of the workbook containing the chart.
     * @param worksheetId - The ID of the worksheet containing the chart.
     * @param chartId - The ID of the chart to be deleted.
     * @returns A promise that resolves to an ApiResponse indicating success or failure.
     */
    async deleteChart(workbookId: string, worksheetId: string, chartId: string): Promise<ApiResponse<boolean>> {
        try {
            // Validate the input parameters
            if (!workbookId || !worksheetId || !chartId) {
                throw new Error('Invalid input parameters');
            }

            // Check if the workbook, worksheet, and chart exist
            const chartExists = await this.dataStorage.chartExists(workbookId, worksheetId, chartId);

            if (!chartExists) {
                throw new Error('Chart not found');
            }

            // Delete the chart data using the dataStorage
            await this.dataStorage.deleteChart(workbookId, worksheetId, chartId);

            // Return a success response in an ApiResponse
            return { success: true, data: true };
        } catch (error) {
            console.error('Error deleting chart:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Retrieves a specific chart from the specified workbook and worksheet.
     * @param workbookId - The ID of the workbook containing the chart.
     * @param worksheetId - The ID of the worksheet containing the chart.
     * @param chartId - The ID of the chart to be retrieved.
     * @returns A promise that resolves to an ApiResponse containing the requested chart or an error.
     */
    async getChart(workbookId: string, worksheetId: string, chartId: string): Promise<ApiResponse<Chart>> {
        try {
            // Validate the input parameters
            if (!workbookId || !worksheetId || !chartId) {
                throw new Error('Invalid input parameters');
            }

            // Retrieve the chart data using the dataStorage
            const chart = await this.dataStorage.getChart(workbookId, worksheetId, chartId);

            if (!chart) {
                throw new Error('Chart not found');
            }

            // Return the chart in an ApiResponse
            return { success: true, data: chart };
        } catch (error) {
            console.error('Error retrieving chart:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Lists all charts in the specified workbook and worksheet.
     * @param workbookId - The ID of the workbook.
     * @param worksheetId - The ID of the worksheet.
     * @returns A promise that resolves to a ChartListResponse containing the list of charts and total count.
     */
    async listCharts(workbookId: string, worksheetId: string): Promise<ChartListResponse> {
        try {
            // Validate the input parameters
            if (!workbookId || !worksheetId) {
                throw new Error('Invalid input parameters');
            }

            // Retrieve all charts for the specified workbook and worksheet using the dataStorage
            const charts = await this.dataStorage.listCharts(workbookId, worksheetId);

            // Return the list of charts and total count in a ChartListResponse
            return {
                success: true,
                data: charts,
                totalCount: charts.length
            };
        } catch (error) {
            console.error('Error listing charts:', error);
            return {
                success: false,
                error: error.message,
                data: [],
                totalCount: 0
            };
        }
    }

    /**
     * Validates the create chart request.
     * @param request - The create chart request to validate.
     * @throws Error if the request is invalid.
     */
    private validateCreateChartRequest(request: CreateChartRequest): void {
        if (!request.workbookId || !request.worksheetId || !request.options) {
            throw new Error('Invalid create chart request');
        }
        // Add more specific validation for chart options if needed
    }

    /**
     * Validates the update chart request.
     * @param request - The update chart request to validate.
     * @throws Error if the request is invalid.
     */
    private validateUpdateChartRequest(request: UpdateChartRequest): void {
        if (!request.workbookId || !request.worksheetId || !request.chartId || !request.options) {
            throw new Error('Invalid update chart request');
        }
        // Add more specific validation for chart options if needed
    }
}

// Human tasks:
// TODO: Implement error handling and logging for all methods in the ChartService class
// TODO: Add input validation for all method parameters to ensure data integrity
// TODO: Consider adding pagination support for the listCharts method
// TODO: Implement caching mechanisms to improve performance for frequently accessed charts