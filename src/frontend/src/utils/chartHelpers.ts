import { Chart, ChartConfiguration } from 'chart.js';
import { CHART_TYPES } from '../constants/chartTypes';

/**
 * Creates a new chart instance based on the provided type and data
 * @param type The type of chart to create
 * @param data The data for the chart
 * @param options Additional options for the chart
 * @returns A new Chart.js instance
 */
export function createChart(type: string, data: object, options: object): Chart {
  // Validate the chart type
  if (!validateChartType(type)) {
    throw new Error(`Invalid chart type: ${type}`);
  }

  // Process and format the input data for Chart.js
  const formattedData = processChartData(data);

  // Merge default options with provided options
  const mergedOptions = {
    ...getDefaultChartOptions(type),
    ...options,
  };

  // Create and return a new Chart instance
  const config: ChartConfiguration = {
    type: type as keyof typeof CHART_TYPES,
    data: formattedData,
    options: mergedOptions,
  };

  return new Chart(document.createElement('canvas'), config);
}

/**
 * Updates the data of an existing chart
 * @param chart The chart to update
 * @param newData The new data for the chart
 */
export function updateChartData(chart: Chart, newData: object): void {
  // Validate the new data structure
  if (!isValidChartData(newData)) {
    throw new Error('Invalid chart data structure');
  }

  // Update the chart's datasets with the new data
  chart.data = processChartData(newData);

  // Call chart.update() to reflect the changes
  chart.update();
}

/**
 * Extracts chart data from a given cell range
 * @param cellRange The range of cells to extract data from
 * @returns Formatted data object for chart creation
 */
export function getChartDataFromRange(cellRange: any[][]): object {
  // Analyze the cell range to determine data structure
  const { labels, datasets } = analyzeCellRange(cellRange);

  // Format the extracted data into a Chart.js compatible object
  return {
    labels,
    datasets,
  };
}

/**
 * Validates if the given chart type is supported
 * @param type The chart type to validate
 * @returns True if the chart type is valid, false otherwise
 */
export function validateChartType(type: string): boolean {
  return Object.values(CHART_TYPES).includes(type);
}

/**
 * Returns the default options for a given chart type
 * @param type The chart type
 * @returns Default chart options
 */
export function getDefaultChartOptions(type: string): object {
  // Validate the chart type
  if (!validateChartType(type)) {
    throw new Error(`Invalid chart type: ${type}`);
  }

  // Return a predefined set of default options for the given chart type
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // Add more default options based on the chart type
  };

  return defaultOptions;
}

// Helper functions

function processChartData(data: object): object {
  // Implement data processing logic here
  return data;
}

function isValidChartData(data: object): boolean {
  // Implement data validation logic here
  return true;
}

function analyzeCellRange(cellRange: any[][]): { labels: string[], datasets: object[] } {
  // Implement cell range analysis logic here
  return {
    labels: [],
    datasets: [],
  };
}

// TODO: Implement error handling for invalid chart types or data structures
// TODO: Optimize performance for large datasets in getChartDataFromRange function
// TODO: Add support for additional chart customization options