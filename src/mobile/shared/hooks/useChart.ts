import { useState, useCallback, useEffect } from 'react';
import { ChartData, Workbook, Worksheet, CellRange } from '../types/SpreadsheetTypes';
import { CHART_TYPES } from '../constants/AppConstants';
import ApiService from '../services/ApiService';

interface ChartHookResult {
  charts: ChartData[];
  selectedChart: ChartData | null;
  createChart: (type: CHART_TYPES, range: CellRange) => Promise<void>;
  updateChart: (chartId: string, updates: Partial<ChartData>) => Promise<void>;
  deleteChart: (chartId: string) => Promise<void>;
  selectChart: (chartId: string) => void;
  getChartDataFromRange: (range: CellRange) => ChartData;
}

export const useChart = (workbook: Workbook, activeWorksheet: Worksheet): ChartHookResult => {
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [selectedChart, setSelectedChart] = useState<ChartData | null>(null);

  // Load existing charts when workbook or worksheet changes
  useEffect(() => {
    const loadCharts = async () => {
      try {
        const loadedCharts = await ApiService.getCharts(workbook.id, activeWorksheet.id);
        setCharts(loadedCharts);
      } catch (error) {
        console.error('Error loading charts:', error);
        // TODO: Implement proper error handling
      }
    };

    loadCharts();
  }, [workbook.id, activeWorksheet.id]);

  const createChart = useCallback(async (type: CHART_TYPES, range: CellRange) => {
    try {
      const newChart = await ApiService.createChart(workbook.id, activeWorksheet.id, type, range);
      setCharts(prevCharts => [...prevCharts, newChart]);
    } catch (error) {
      console.error('Error creating chart:', error);
      // TODO: Implement proper error handling
    }
  }, [workbook.id, activeWorksheet.id]);

  const updateChart = useCallback(async (chartId: string, updates: Partial<ChartData>) => {
    try {
      const updatedChart = await ApiService.updateChart(workbook.id, activeWorksheet.id, chartId, updates);
      setCharts(prevCharts => prevCharts.map(chart => chart.id === chartId ? updatedChart : chart));
      if (selectedChart && selectedChart.id === chartId) {
        setSelectedChart(updatedChart);
      }
    } catch (error) {
      console.error('Error updating chart:', error);
      // TODO: Implement proper error handling
    }
  }, [workbook.id, activeWorksheet.id, selectedChart]);

  const deleteChart = useCallback(async (chartId: string) => {
    try {
      await ApiService.deleteChart(workbook.id, activeWorksheet.id, chartId);
      setCharts(prevCharts => prevCharts.filter(chart => chart.id !== chartId));
      if (selectedChart && selectedChart.id === chartId) {
        setSelectedChart(null);
      }
    } catch (error) {
      console.error('Error deleting chart:', error);
      // TODO: Implement proper error handling
    }
  }, [workbook.id, activeWorksheet.id, selectedChart]);

  const selectChart = useCallback((chartId: string) => {
    const chart = charts.find(c => c.id === chartId);
    setSelectedChart(chart || null);
  }, [charts]);

  const getChartDataFromRange = useCallback((range: CellRange): ChartData => {
    // TODO: Implement logic to extract chart data from the given cell range
    // This is a placeholder implementation
    return {
      id: 'temp-id',
      type: CHART_TYPES.BAR,
      title: 'Chart from Range',
      data: [],
      options: {}
    };
  }, []);

  return {
    charts,
    selectedChart,
    createChart,
    updateChart,
    deleteChart,
    selectChart,
    getChartDataFromRange
  };
};

// TODO: Implement error handling for API calls in chart operations
// TODO: Add unit tests for the useChart hook
// TODO: Optimize chart data extraction for large ranges