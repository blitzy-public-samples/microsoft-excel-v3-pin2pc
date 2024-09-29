import React from 'react';
import { Line, Bar, Pie, Doughnut, Scatter } from 'react-chartjs-2';
import { Chart, ChartOptions, ChartData } from '../../types/chart';
import { CHART_TYPES } from '../../constants/chartTypes';
import { useChart } from '../../hooks/useChart';

interface ChartComponentProps {
  chart: Chart;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ chart }) => {
  const { data, options } = useChart(chart);

  const renderChart = (type: CHART_TYPES, data: ChartData, options: ChartOptions): JSX.Element => {
    switch (type) {
      case CHART_TYPES.LINE:
        return <Line data={data} options={options} />;
      case CHART_TYPES.BAR:
        return <Bar data={data} options={options} />;
      case CHART_TYPES.PIE:
        return <Pie data={data} options={options} />;
      case CHART_TYPES.DOUGHNUT:
        return <Doughnut data={data} options={options} />;
      case CHART_TYPES.SCATTER:
        return <Scatter data={data} options={options} />;
      default:
        throw new Error(`Unsupported chart type: ${type}`);
    }
  };

  return (
    <div className="chart-container">
      {renderChart(chart.type, data, options)}
    </div>
  );
};

export default ChartComponent;

// Human tasks:
// TODO: Implement error handling for unsupported chart types
// TODO: Add accessibility features to the chart components, such as ARIA labels
// TODO: Optimize the chart rendering for large datasets
// TODO: Implement interactivity features like zooming and panning for applicable chart types