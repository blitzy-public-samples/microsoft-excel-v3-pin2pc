import { CELL_TYPES } from '../constants/cellTypes';
import { CHART_TYPES } from '../constants/chartTypes';

// Represents the possible values a cell can contain
export type CellValue = string | number | boolean | null;

// Defines the style properties for a cell
export interface CellStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  color: string;
  backgroundColor: string;
  border: string;
  textAlign: string;
  verticalAlign: string;
}

// Represents a single cell in the spreadsheet
export interface Cell {
  id: string;
  value: CellValue;
  type: CELL_TYPES;
  formula: string;
  style: CellStyle;
}

// Represents a row in the spreadsheet
export interface Row {
  id: string;
  index: number;
  cells: Cell[];
  height: number;
}

// Represents a column in the spreadsheet
export interface Column {
  id: string;
  index: number;
  width: number;
}

// Represents a chart in the spreadsheet
export interface Chart {
  id: string;
  type: CHART_TYPES;
  title: string;
  dataRange: string;
  options: ChartOptions;
}

// Defines the options for chart customization
export interface ChartOptions {
  xAxis: AxisOptions;
  yAxis: AxisOptions;
  legend: LegendOptions;
  series: SeriesOptions[];
}

// Defines options for chart axes
export interface AxisOptions {
  title: string;
  min: number;
  max: number;
  gridLines: boolean;
}

// Defines options for chart legend
export interface LegendOptions {
  position: string;
  show: boolean;
}

// Defines options for chart series
export interface SeriesOptions {
  name: string;
  color: string;
  type: CHART_TYPES;
}

// Represents a single worksheet in the workbook
export interface Worksheet {
  id: string;
  name: string;
  rows: Row[];
  columns: Column[];
  charts: Chart[];
}

// Represents the entire workbook
export interface Workbook {
  id: string;
  name: string;
  worksheets: Worksheet[];
  activeWorksheet: string;
}

// Human tasks (commented as requested)
/*
Human tasks:
1. Review and validate the type definitions to ensure they cover all necessary aspects of the spreadsheet application (Required)
2. Ensure that the type definitions align with the backend data models and API contracts (Required)
3. Consider adding more specific types for formulas and their evaluation results (Optional)
*/