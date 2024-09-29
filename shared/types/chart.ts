/**
 * This file defines TypeScript types and interfaces related to charts in Microsoft Excel.
 * It provides type definitions for various chart types, chart properties, and chart-related data structures.
 */

/**
 * Enum representing the various types of charts available in Excel
 */
export enum ChartType {
  Column = 'Column',
  Bar = 'Bar',
  Line = 'Line',
  Pie = 'Pie',
  Area = 'Area',
  XY = 'XY',
  Stock = 'Stock',
  Radar = 'Radar',
  Surface = 'Surface',
  Doughnut = 'Doughnut',
  Bubble = 'Bubble',
  Sunburst = 'Sunburst',
  Treemap = 'Treemap'
}

/**
 * Interface representing a series of data in a chart
 */
export interface ChartSeries {
  name: string;
  xValues: string[] | number[];
  yValues: number[];
  color: string;
}

/**
 * Interface representing an axis in a chart
 */
export interface ChartAxis {
  title: string;
  min: number | null;
  max: number | null;
  majorUnit: number | null;
  minorUnit: number | null;
  logarithmic: boolean;
}

/**
 * Interface representing the legend of a chart
 */
export interface ChartLegend {
  position: string;
  visible: boolean;
}

/**
 * Interface representing the title of a chart
 */
export interface ChartTitle {
  text: string;
  visible: boolean;
}

/**
 * Interface representing the options for creating or modifying a chart
 */
export interface ChartOptions {
  type: ChartType;
  series: ChartSeries[];
  xAxis: ChartAxis;
  yAxis: ChartAxis;
  legend: ChartLegend;
  title: ChartTitle;
  width: number;
  height: number;
}

// Human tasks:
// TODO: Review and validate the chart types to ensure all required Excel chart types are included
// TODO: Confirm if any additional chart-specific properties or options need to be added to the types