import { useState, useCallback, useEffect } from 'react';
import { Chart, ChartOptions } from '../types/chart';
import { createChart, updateChart } from '../services/api';
import { createChartInstance, updateChartData, getChartDataFromRange, validateChartType, getDefaultChartOptions } from '../utils/chartHelpers';
import CHART_TYPES from '../constants/chartTypes';

interface UseChartResult {
  charts: Chart[];
  currentChart: Chart | null;
  isLoading: boolean;
  createNewChart: (type: CHART_TYPES, dataRange: string, options?: ChartOptions) => Promise<Chart>;
  updateChartData: (chartId: string, newDataRange: string) => Promise<Chart>;
  deleteChart: (chartId: string) => Promise<void>;
  setCurrentChart: (chartId: string) => void;
  updateChartOptions: (chartId: string, newOptions: Partial<ChartOptions>) => Promise<Chart>;
}

const useChart = (workbookId: string, worksheetId: string): UseChartResult => {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [currentChart, setCurrentChart] = useState<Chart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch initial charts data
  useEffect(() => {
    const fetchCharts = async () => {
      setIsLoading(true);
      try {
        // Assuming there's a method to fetch charts from the API
        const fetchedCharts = await createChart(workbookId, worksheetId);
        setCharts(fetchedCharts);
      } catch (error) {
        console.error('Error fetching charts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharts();
  }, [workbookId, worksheetId]);

  const createNewChart = useCallback(async (type: CHART_TYPES, dataRange: string, options?: ChartOptions): Promise<Chart> => {
    setIsLoading(true);
    try {
      if (!validateChartType(type)) {
        throw new Error('Invalid chart type');
      }

      const chartData = await getChartDataFromRange(workbookId, worksheetId, dataRange);
      const defaultOptions = getDefaultChartOptions(type);
      const chartOptions = { ...defaultOptions, ...options };

      const newChartInstance = createChartInstance(type, chartData, chartOptions);
      const createdChart = await createChart(workbookId, worksheetId, newChartInstance);

      setCharts(prevCharts => [...prevCharts, createdChart]);
      setCurrentChart(createdChart);

      return createdChart;
    } catch (error) {
      console.error('Error creating new chart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [workbookId, worksheetId]);

  const updateChartData = useCallback(async (chartId: string, newDataRange: string): Promise<Chart> => {
    setIsLoading(true);
    try {
      const chartToUpdate = charts.find(chart => chart.id === chartId);
      if (!chartToUpdate) {
        throw new Error('Chart not found');
      }

      const newChartData = await getChartDataFromRange(workbookId, worksheetId, newDataRange);
      const updatedChartInstance = updateChartData(chartToUpdate, newChartData);
      const updatedChart = await updateChart(workbookId, worksheetId, updatedChartInstance);

      setCharts(prevCharts => prevCharts.map(chart => chart.id === chartId ? updatedChart : chart));
      if (currentChart && currentChart.id === chartId) {
        setCurrentChart(updatedChart);
      }

      return updatedChart;
    } catch (error) {
      console.error('Error updating chart data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [workbookId, worksheetId, charts, currentChart]);

  const deleteChart = useCallback(async (chartId: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Assuming there's a method to delete a chart from the API
      await updateChart(workbookId, worksheetId, { id: chartId, deleted: true });

      setCharts(prevCharts => prevCharts.filter(chart => chart.id !== chartId));
      if (currentChart && currentChart.id === chartId) {
        setCurrentChart(null);
      }
    } catch (error) {
      console.error('Error deleting chart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [workbookId, worksheetId, currentChart]);

  const setActiveChart = useCallback((chartId: string) => {
    const chart = charts.find(c => c.id === chartId);
    if (chart) {
      setCurrentChart(chart);
    } else {
      console.warn('Chart not found:', chartId);
    }
  }, [charts]);

  const updateChartOptions = useCallback(async (chartId: string, newOptions: Partial<ChartOptions>): Promise<Chart> => {
    setIsLoading(true);
    try {
      const chartToUpdate = charts.find(chart => chart.id === chartId);
      if (!chartToUpdate) {
        throw new Error('Chart not found');
      }

      const updatedOptions = { ...chartToUpdate.options, ...newOptions };
      const updatedChartInstance = { ...chartToUpdate, options: updatedOptions };
      const updatedChart = await updateChart(workbookId, worksheetId, updatedChartInstance);

      setCharts(prevCharts => prevCharts.map(chart => chart.id === chartId ? updatedChart : chart));
      if (currentChart && currentChart.id === chartId) {
        setCurrentChart(updatedChart);
      }

      return updatedChart;
    } catch (error) {
      console.error('Error updating chart options:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [workbookId, worksheetId, charts, currentChart]);

  return {
    charts,
    currentChart,
    isLoading,
    createNewChart,
    updateChartData,
    deleteChart,
    setCurrentChart: setActiveChart,
    updateChartOptions,
  };
};

export default useChart;

// TODO: Implement proper error handling and user feedback for chart operations
// TODO: Optimize performance for large datasets and multiple charts
// TODO: Add support for real-time collaboration on chart editing