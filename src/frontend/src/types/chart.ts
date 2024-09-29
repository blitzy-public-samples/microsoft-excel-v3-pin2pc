import { CHART_TYPES } from '../constants/chartTypes';

export interface Chart {
  id: string;
  type: CHART_TYPES;
  title: string;
  dataRange: string;
  options: ChartOptions;
}

export interface ChartOptions {
  xAxis: AxisOptions;
  yAxis: AxisOptions;
  legend: LegendOptions;
  series: SeriesOptions[];
}

export interface AxisOptions {
  title: string;
  min: number;
  max: number;
  gridLines: boolean;
}

export interface LegendOptions {
  position: string;
  show: boolean;
}

export interface SeriesOptions {
  name: string;
  color: string;
  type: CHART_TYPES;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor: string | string[];
  borderWidth: number;
}

// Human tasks:
// TODO: Review and validate the chart type definitions to ensure they cover all necessary aspects of the charting functionality
// TODO: Ensure that the chart type definitions align with the backend data models and API contracts
// TODO: Consider adding more specific types for different chart types (e.g., BarChartOptions, LineChartOptions) if needed
// TODO: Validate that the ChartData and ChartDataset interfaces cover all necessary properties for data visualization