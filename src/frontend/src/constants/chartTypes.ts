/**
 * This file defines the constant values for various chart types supported in the Excel-like application.
 * It provides a centralized location for managing chart type definitions, ensuring consistency across the frontend application.
 */

/**
 * An object containing key-value pairs of chart type identifiers and their corresponding display names
 */
export const CHART_TYPES: Record<string, string> = {
  BAR: 'Bar',
  COLUMN: 'Column',
  LINE: 'Line',
  PIE: 'Pie',
  AREA: 'Area',
  SCATTER: 'Scatter',
  BUBBLE: 'Bubble',
  STOCK: 'Stock',
  RADAR: 'Radar',
  SURFACE: 'Surface',
  COMBO: 'Combo'
};

/**
 * TODO: Review and confirm the list of chart types to ensure all required types for the Excel-like application are included
 * TODO: Ensure chart type names and values align with backend and API specifications
 */