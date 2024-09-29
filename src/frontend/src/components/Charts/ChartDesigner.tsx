import React, { useState, useEffect } from 'react';
import { Select, Input, Button, Form } from 'antd';
import { CHART_TYPES } from '../../constants/chartTypes';
import ChartComponent from './ChartComponent';
import { Chart, ChartOptions } from '../../types/chart';
import useSpreadsheet from '../../hooks/useSpreadsheet';
import useChart from '../../hooks/useChart';

interface ChartDesignerProps {
  initialChart: Chart | null;
  onSave: (chart: Chart) => void;
  onCancel: () => void;
}

const ChartDesigner: React.FC<ChartDesignerProps> = ({ initialChart, onSave, onCancel }) => {
  const [chartType, setChartType] = useState<string>(initialChart?.type || CHART_TYPES[0]);
  const [dataRange, setDataRange] = useState<string>(initialChart?.dataRange || '');
  const [chartOptions, setChartOptions] = useState<ChartOptions>(initialChart?.options || {});

  const { getSpreadsheetData } = useSpreadsheet();
  const { createChart, updateChart } = useChart();

  useEffect(() => {
    if (initialChart) {
      setChartType(initialChart.type);
      setDataRange(initialChart.dataRange);
      setChartOptions(initialChart.options);
    }
  }, [initialChart]);

  const handleChartTypeChange = (value: string) => {
    setChartType(value);
    // Reset or adjust chart options based on the new chart type if necessary
    setChartOptions({});
  };

  const handleDataRangeChange = (value: string) => {
    // TODO: Implement data validation for chart data range input
    setDataRange(value);
  };

  const handleOptionChange = (optionKey: string, value: any) => {
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      [optionKey]: value,
    }));
  };

  const handleSave = () => {
    // Validate the current chart configuration
    if (!chartType || !dataRange) {
      // Show error message
      return;
    }

    const chartData = getSpreadsheetData(dataRange);
    const chart: Chart = {
      type: chartType,
      dataRange,
      options: chartOptions,
      data: chartData,
    };

    if (initialChart) {
      updateChart(initialChart.id, chart);
    } else {
      createChart(chart);
    }

    onSave(chart);
  };

  return (
    <div className="chart-designer">
      <Form layout="vertical">
        <Form.Item label="Chart Type">
          <Select value={chartType} onChange={handleChartTypeChange}>
            {CHART_TYPES.map((type) => (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Data Range">
          <Input value={dataRange} onChange={(e) => handleDataRangeChange(e.target.value)} />
        </Form.Item>
        {/* Add more form items for chart options specific to each chart type */}
        {/* For example: */}
        <Form.Item label="Title">
          <Input
            value={chartOptions.title}
            onChange={(e) => handleOptionChange('title', e.target.value)}
          />
        </Form.Item>
        {/* Add more options as needed */}
      </Form>
      <div className="chart-preview">
        <ChartComponent
          type={chartType}
          data={getSpreadsheetData(dataRange)}
          options={chartOptions}
        />
      </div>
      <div className="chart-designer-actions">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default ChartDesigner;

// TODO: Implement data validation for chart data range input
// TODO: Add support for advanced chart options specific to each chart type
// TODO: Implement undo/redo functionality for chart design changes
// TODO: Add a color picker for customizing chart colors
// TODO: Implement drag-and-drop functionality for selecting data ranges