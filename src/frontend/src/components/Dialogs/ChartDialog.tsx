import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@material-ui/core';
import { CHART_TYPES } from '../../constants/chartTypes';
import ChartComponent from '../Charts/ChartComponent';
import { Chart, ChartOptions, ChartData } from '../../types/chart';
import useChart from '../../hooks/useChart';

interface ChartDialogProps {
  open: boolean;
  onClose: () => void;
  initialChart: Chart | null;
  onSave: (chart: Chart) => void;
}

const ChartDialog: React.FC<ChartDialogProps> = ({ open, onClose, initialChart, onSave }) => {
  const [chartType, setChartType] = useState<string>(initialChart?.type || CHART_TYPES[0]);
  const [chartTitle, setChartTitle] = useState<string>(initialChart?.options.title || '');
  const [dataRange, setDataRange] = useState<string>(initialChart?.data.range || '');

  const { chartData, chartOptions, updateChartData, updateChartOptions } = useChart(initialChart);

  useEffect(() => {
    if (initialChart) {
      setChartType(initialChart.type);
      setChartTitle(initialChart.options.title);
      setDataRange(initialChart.data.range);
      updateChartData(initialChart.data);
      updateChartOptions(initialChart.options);
    }
  }, [initialChart]);

  const handleChartTypeChange = (newType: string) => {
    setChartType(newType);
    updateChartOptions({ ...chartOptions, chart: { type: newType } });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;
    setChartTitle(newTitle);
    updateChartOptions({ ...chartOptions, title: { text: newTitle } });
  };

  const handleDataRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRange = event.target.value;
    setDataRange(newRange);
    // TODO: Implement data range selection functionality
    // This should update the chartData based on the new range
  };

  const handleSave = () => {
    const chart: Chart = {
      type: chartType,
      options: chartOptions,
      data: chartData,
    };
    onSave(chart);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="chart-dialog-title" maxWidth="md" fullWidth>
      <DialogTitle id="chart-dialog-title">
        {initialChart ? 'Edit Chart' : 'Create New Chart'}
      </DialogTitle>
      <DialogContent>
        <Select
          value={chartType}
          onChange={(e) => handleChartTypeChange(e.target.value as string)}
          fullWidth
          margin="normal"
        >
          {CHART_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
        <TextField
          value={chartTitle}
          onChange={handleTitleChange}
          fullWidth
          margin="normal"
          label="Chart Title"
        />
        <TextField
          value={dataRange}
          onChange={handleDataRangeChange}
          fullWidth
          margin="normal"
          label="Data Range"
          placeholder="e.g., A1:B10"
        />
        <ChartComponent type={chartType} options={chartOptions} data={chartData} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChartDialog;
```

This implementation creates a ChartDialog component that allows users to create or edit charts. It uses Material-UI components for the dialog and form elements, and integrates with the ChartComponent for previewing the chart.

Here's a list of the human tasks that need to be addressed:

```
// TODO: Implement data range selection functionality
// This should update the chartData based on the new range