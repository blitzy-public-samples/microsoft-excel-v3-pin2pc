using System;
using System.Collections.Generic;

namespace ExcelDesktop.Models
{
    /// <summary>
    /// Represents a chart in Excel, including its type, data range, and formatting options.
    /// </summary>
    public class Chart
    {
        /// <summary>
        /// Gets or sets the unique identifier for the chart.
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets the type of the chart.
        /// </summary>
        public ChartType Type { get; set; }

        /// <summary>
        /// Gets or sets the title of the chart.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the data range for the chart.
        /// </summary>
        public CellRange DataRange { get; set; }

        /// <summary>
        /// Gets or sets the colors for each series in the chart.
        /// </summary>
        public Dictionary<string, string> SeriesColors { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the chart has a legend.
        /// </summary>
        public bool HasLegend { get; set; }

        /// <summary>
        /// Gets or sets the title of the X-axis.
        /// </summary>
        public string XAxisTitle { get; set; }

        /// <summary>
        /// Gets or sets the title of the Y-axis.
        /// </summary>
        public string YAxisTitle { get; set; }

        /// <summary>
        /// Gets or sets the parent worksheet containing this chart.
        /// </summary>
        public Worksheet ParentWorksheet { get; set; }

        /// <summary>
        /// Initializes a new instance of the Chart class with default values.
        /// </summary>
        public Chart()
        {
            Id = Guid.NewGuid().ToString();
            Type = ChartType.Column;
            SeriesColors = new Dictionary<string, string>();
            HasLegend = true;
        }

        /// <summary>
        /// Updates the data range for the chart.
        /// </summary>
        /// <param name="newRange">The new cell range for the chart data.</param>
        public void UpdateDataRange(CellRange newRange)
        {
            // Validate the newRange parameter
            if (newRange == null)
            {
                throw new ArgumentNullException(nameof(newRange), "New range cannot be null.");
            }

            // Update the DataRange property with the new value
            DataRange = newRange;

            // Trigger a chart refresh if necessary
            // This would typically involve notifying the UI or charting engine to redraw the chart
            // For now, we'll just add a comment as a placeholder
            // TODO: Implement chart refresh logic
        }

        /// <summary>
        /// Adds a new data series to the chart.
        /// </summary>
        /// <param name="seriesName">The name of the new series.</param>
        /// <param name="seriesRange">The cell range for the new series data.</param>
        /// <param name="color">The color for the new series.</param>
        public void AddSeries(string seriesName, CellRange seriesRange, string color)
        {
            // Validate the input parameters
            if (string.IsNullOrWhiteSpace(seriesName))
            {
                throw new ArgumentException("Series name cannot be null or empty.", nameof(seriesName));
            }
            if (seriesRange == null)
            {
                throw new ArgumentNullException(nameof(seriesRange), "Series range cannot be null.");
            }
            if (string.IsNullOrWhiteSpace(color))
            {
                throw new ArgumentException("Color cannot be null or empty.", nameof(color));
            }

            // Add the new series to the chart's data source
            // This would typically involve updating the underlying data structure
            // For now, we'll just add a comment as a placeholder
            // TODO: Implement logic to add the new series to the chart's data source

            // Update the SeriesColors dictionary with the new series and color
            SeriesColors[seriesName] = color;

            // Refresh the chart display
            // This would typically involve notifying the UI or charting engine to redraw the chart
            // TODO: Implement chart refresh logic
        }

        /// <summary>
        /// Changes the type of the chart.
        /// </summary>
        /// <param name="newType">The new chart type.</param>
        public void ChangeChartType(ChartType newType)
        {
            // Validate if the new chart type is supported
            if (!Enum.IsDefined(typeof(ChartType), newType))
            {
                throw new ArgumentException("Invalid chart type.", nameof(newType));
            }

            // Update the Type property with the new value
            Type = newType;

            // Adjust the chart's data representation for the new type if necessary
            // This would typically involve reorganizing the data or updating the charting engine
            // TODO: Implement logic to adjust data representation for the new chart type

            // Refresh the chart display
            // This would typically involve notifying the UI or charting engine to redraw the chart
            // TODO: Implement chart refresh logic
        }
    }

    /// <summary>
    /// Enum representing the various types of charts available in Excel.
    /// </summary>
    public enum ChartType
    {
        Column,
        Bar,
        Line,
        Pie,
        Scatter,
        Area
    }

    /// <summary>
    /// Represents a range of cells in an Excel worksheet.
    /// </summary>
    public class CellRange
    {
        /// <summary>
        /// Gets or sets the starting cell of the range.
        /// </summary>
        public string StartCell { get; set; }

        /// <summary>
        /// Gets or sets the ending cell of the range.
        /// </summary>
        public string EndCell { get; set; }

        /// <summary>
        /// Initializes a new instance of the CellRange class.
        /// </summary>
        /// <param name="start">The starting cell reference.</param>
        /// <param name="end">The ending cell reference.</param>
        public CellRange(string start, string end)
        {
            // Validate the start and end cell references
            if (string.IsNullOrWhiteSpace(start) || string.IsNullOrWhiteSpace(end))
            {
                throw new ArgumentException("Start and end cell references cannot be null or empty.");
            }

            // TODO: Implement more robust validation for cell references

            StartCell = start;
            EndCell = end;
        }

        /// <summary>
        /// Returns a string representation of the cell range.
        /// </summary>
        /// <returns>A string in the format 'StartCell:EndCell'</returns>
        public override string ToString()
        {
            return $"{StartCell}:{EndCell}";
        }
    }
}