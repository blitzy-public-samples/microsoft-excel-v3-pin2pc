import { ChartingEngine } from '../../services/chartingEngine';
import { ChartType, ChartOptions, ChartSeries } from '../../../shared/types/chart';
import { expect } from '@jest/globals';

describe('ChartingEngine', () => {
  let chartingEngine: ChartingEngine;

  beforeEach(() => {
    // Create a new ChartingEngine instance before each test
    chartingEngine = new ChartingEngine();
  });

  afterEach(() => {
    // Clean up after each test
    // This is a placeholder for any necessary cleanup
    // For example, if ChartingEngine has a method to clear all charts:
    // chartingEngine.clearAllCharts();
  });

  test('should create a new chart with valid options', () => {
    const mockOptions: ChartOptions = {
      type: ChartType.LINE,
      title: 'Test Chart',
      xAxis: { title: 'X Axis' },
      yAxis: { title: 'Y Axis' },
      series: [{ name: 'Series 1', data: [1, 2, 3, 4, 5] }]
    };

    const chartId = chartingEngine.createChart(mockOptions);

    expect(typeof chartId).toBe('string');
    expect(chartId).not.toBe('');

    // Verify that the chart was added to the internal charts Map
    // This assumes that ChartingEngine has a method to get a chart by ID
    const createdChart = chartingEngine.getChart(chartId);
    expect(createdChart).toBeDefined();
    expect(createdChart?.options).toEqual(mockOptions);
  });

  test('should update an existing chart', () => {
    const initialOptions: ChartOptions = {
      type: ChartType.BAR,
      title: 'Initial Chart',
      xAxis: { title: 'X Axis' },
      yAxis: { title: 'Y Axis' },
      series: [{ name: 'Series 1', data: [1, 2, 3] }]
    };

    const chartId = chartingEngine.createChart(initialOptions);

    const updateOptions: Partial<ChartOptions> = {
      title: 'Updated Chart',
      series: [{ name: 'Series 1', data: [4, 5, 6] }]
    };

    chartingEngine.updateChart(chartId, updateOptions);

    const updatedChart = chartingEngine.getChart(chartId);
    expect(updatedChart?.options.title).toBe('Updated Chart');
    expect(updatedChart?.options.series).toEqual(updateOptions.series);
  });

  test('should delete an existing chart', () => {
    const options: ChartOptions = {
      type: ChartType.PIE,
      title: 'Test Chart',
      series: [{ name: 'Series 1', data: [1, 2, 3] }]
    };

    const chartId = chartingEngine.createChart(options);
    expect(chartingEngine.getChart(chartId)).toBeDefined();

    chartingEngine.deleteChart(chartId);
    expect(chartingEngine.getChart(chartId)).toBeUndefined();
  });

  test('should render a chart to the specified format', async () => {
    const options: ChartOptions = {
      type: ChartType.LINE,
      title: 'Test Chart',
      xAxis: { title: 'X Axis' },
      yAxis: { title: 'Y Axis' },
      series: [{ name: 'Series 1', data: [1, 2, 3, 4, 5] }]
    };

    const chartId = chartingEngine.createChart(options);
    const renderedChart = await chartingEngine.renderChart(chartId, 'png');

    expect(renderedChart).toBeInstanceOf(Blob);
    expect(renderedChart.type).toBe('image/png');
  });

  test('should retrieve the data series from a chart', () => {
    const mockSeries: ChartSeries[] = [
      { name: 'Series 1', data: [1, 2, 3] },
      { name: 'Series 2', data: [4, 5, 6] }
    ];

    const options: ChartOptions = {
      type: ChartType.BAR,
      title: 'Test Chart',
      series: mockSeries
    };

    const chartId = chartingEngine.createChart(options);
    const retrievedSeries = chartingEngine.getChartData(chartId);

    expect(retrievedSeries).toEqual(mockSeries);
  });

  test('should update the data series of an existing chart', () => {
    const initialSeries: ChartSeries[] = [{ name: 'Series 1', data: [1, 2, 3] }];
    const options: ChartOptions = {
      type: ChartType.LINE,
      title: 'Test Chart',
      series: initialSeries
    };

    const chartId = chartingEngine.createChart(options);

    const newSeries: ChartSeries[] = [{ name: 'Updated Series', data: [4, 5, 6, 7] }];
    chartingEngine.setChartData(chartId, newSeries);

    const updatedSeries = chartingEngine.getChartData(chartId);
    expect(updatedSeries).toEqual(newSeries);
  });

  test('should return an array of available chart types', () => {
    const chartTypes = chartingEngine.getChartTypes();

    expect(Array.isArray(chartTypes)).toBe(true);
    expect(chartTypes.length).toBeGreaterThan(0);
    expect(chartTypes).toContain(ChartType.LINE);
    expect(chartTypes).toContain(ChartType.BAR);
    expect(chartTypes).toContain(ChartType.PIE);
  });

  test('should correctly validate chart options', () => {
    const validOptions: ChartOptions = {
      type: ChartType.LINE,
      title: 'Valid Chart',
      xAxis: { title: 'X Axis' },
      yAxis: { title: 'Y Axis' },
      series: [{ name: 'Series 1', data: [1, 2, 3] }]
    };

    expect(chartingEngine.validateChartOptions(validOptions)).toBe(true);

    const invalidOptions: any = {
      type: 'InvalidType',
      title: 'Invalid Chart',
      series: 'Not an array'
    };

    expect(chartingEngine.validateChartOptions(invalidOptions)).toBe(false);
  });
});

// Human tasks:
// TODO: Implement additional test cases for edge cases and error handling
// TODO: Add performance tests for chart rendering with large datasets
// TODO: Implement integration tests with actual D3.js rendering
// TODO: Add test cases for concurrent chart operations