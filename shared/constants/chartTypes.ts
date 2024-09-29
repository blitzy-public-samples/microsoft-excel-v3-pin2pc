/**
 * This file contains constant definitions for various chart types supported in Microsoft Excel.
 * It provides a centralized location for chart type enumerations, ensuring consistency across the application.
 */

/**
 * An enumeration of all supported chart types in Excel
 */
export const CHART_TYPES = {
  COLUMN: 'column',
  BAR: 'bar',
  LINE: 'line',
  PIE: 'pie',
  AREA: 'area',
  SCATTER: 'scatter',
  STOCK: 'stock',
  SURFACE: 'surface',
  DOUGHNUT: 'doughnut',
  BUBBLE: 'bubble',
  RADAR: 'radar',
  TREEMAP: 'treemap',
  HISTOGRAM: 'histogram',
  BOX_AND_WHISKER: 'boxAndWhisker',
  WATERFALL: 'waterfall',
  FUNNEL: 'funnel',
  COMBO: 'combo'
} as const;

/**
 * Type definition for chart types, ensuring type safety when using chart type values
 */
export type ChartType = typeof CHART_TYPES[keyof typeof CHART_TYPES];

/**
 * An object containing subtypes for main chart types that support them
 */
export const CHART_SUBTYPES = {
  COLUMN: ['clustered', 'stacked', '100% stacked'],
  BAR: ['clustered', 'stacked', '100% stacked'],
  LINE: [
    'line',
    'stacked',
    '100% stacked',
    'lineWithMarkers',
    'stackedWithMarkers',
    '100% stackedWithMarkers'
  ],
  AREA: ['area', 'stacked', '100% stacked']
} as const;

/**
 * Type definition for chart subtypes, ensuring type safety when using subtype values
 */
export type ChartSubtype = typeof CHART_SUBTYPES[keyof typeof CHART_SUBTYPES][number];

/**
 * An enumeration of chart dimensions
 */
export const CHART_DIMENSIONS = {
  TWO_DIMENSIONAL: '2d',
  THREE_DIMENSIONAL: '3d'
} as const;

/**
 * Type definition for chart dimensions, ensuring type safety when using dimension values
 */
export type ChartDimension = typeof CHART_DIMENSIONS[keyof typeof CHART_DIMENSIONS];