// This file defines the interface for the Charting Engine in Microsoft Excel.
// It provides the contract for creating, modifying, and rendering various types of charts.

// Import necessary types from the chart module
import { ChartType, ChartOptions, ChartSeries, ChartAxis, ChartLegend, ChartTitle } from '../types/chart';

/**
 * Interface defining the contract for the Charting Engine in Microsoft Excel
 */
export interface IChartingEngine {
  /**
   * Creates a new chart based on the provided options
   * @param options The options for creating the chart
   * @returns A promise that resolves to the unique identifier of the created chart
   */
  createChart(options: ChartOptions): Promise<string>;

  /**
   * Updates an existing chart with new options
   * @param chartId The unique identifier of the chart to update
   * @param options The partial options to update the chart with
   * @returns A promise that resolves when the chart has been updated
   */
  updateChart(chartId: string, options: Partial<ChartOptions>): Promise<void>;

  /**
   * Deletes an existing chart
   * @param chartId The unique identifier of the chart to delete
   * @returns A promise that resolves when the chart has been deleted
   */
  deleteChart(chartId: string): Promise<void>;

  /**
   * Renders a chart to a specified format
   * @param chartId The unique identifier of the chart to render
   * @param format The format to render the chart in
   * @returns A promise that resolves to a Blob containing the rendered chart
   */
  renderChart(chartId: string, format: string): Promise<Blob>;

  /**
   * Retrieves the data series from a chart
   * @param chartId The unique identifier of the chart
   * @returns A promise that resolves to an array of ChartSeries objects
   */
  getChartData(chartId: string): Promise<ChartSeries[]>;

  /**
   * Updates the data series of an existing chart
   * @param chartId The unique identifier of the chart
   * @param series The new data series to set for the chart
   * @returns A promise that resolves when the chart data has been updated
   */
  setChartData(chartId: string, series: ChartSeries[]): Promise<void>;

  /**
   * Retrieves the list of available chart types
   * @returns An array of available ChartType values
   */
  getChartTypes(): ChartType[];

  /**
   * Validates the provided chart options
   * @param options The chart options to validate
   * @returns True if the options are valid, false otherwise
   */
  validateChartOptions(options: ChartOptions): boolean;
}

// Human tasks:
// TODO: Review the IChartingEngine interface to ensure all necessary methods for Excel's charting capabilities are included
// TODO: Validate that the method signatures align with the expected usage in the Excel application
// TODO: Consider adding methods for more advanced charting features, such as combining chart types or handling 3D charts