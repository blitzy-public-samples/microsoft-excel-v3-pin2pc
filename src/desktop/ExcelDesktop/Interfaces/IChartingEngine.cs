using System;
using ExcelDesktop.Models;

namespace ExcelDesktop.Interfaces
{
    /// <summary>
    /// Interface defining the contract for the Excel charting engine
    /// </summary>
    public interface IChartingEngine
    {
        /// <summary>
        /// Creates a new chart based on the specified data range and chart type
        /// </summary>
        /// <param name="worksheet">The worksheet containing the data</param>
        /// <param name="dataRange">The range of cells containing the data for the chart</param>
        /// <param name="chartType">The type of chart to create</param>
        /// <returns>The newly created chart object</returns>
        Chart CreateChart(Worksheet worksheet, string dataRange, ChartType chartType);

        /// <summary>
        /// Updates an existing chart with new data or settings
        /// </summary>
        /// <param name="chart">The chart to update</param>
        /// <param name="worksheet">The worksheet containing the new data</param>
        /// <param name="newDataRange">The new range of cells containing the data for the chart</param>
        void UpdateChart(Chart chart, Worksheet worksheet, string newDataRange);

        /// <summary>
        /// Changes the type of an existing chart
        /// </summary>
        /// <param name="chart">The chart to modify</param>
        /// <param name="newChartType">The new chart type to apply</param>
        void ChangeChartType(Chart chart, ChartType newChartType);

        /// <summary>
        /// Applies formatting options to a chart
        /// </summary>
        /// <param name="chart">The chart to format</param>
        /// <param name="formatOptions">The formatting options to apply</param>
        void FormatChart(Chart chart, ChartFormatOptions formatOptions);

        /// <summary>
        /// Exports a chart to a specified file format
        /// </summary>
        /// <param name="chart">The chart to export</param>
        /// <param name="filePath">The file path where the exported chart will be saved</param>
        /// <param name="format">The format to export the chart to</param>
        /// <returns>True if the export was successful, false otherwise</returns>
        bool ExportChart(Chart chart, string filePath, ExportFormat format);
    }

    // TODO: Define the ChartType enum with supported chart types
    public enum ChartType
    {
        // Add chart types here
    }

    // TODO: Create the ChartFormatOptions class to encapsulate chart formatting properties
    public class ChartFormatOptions
    {
        // Add formatting properties here
    }

    // TODO: Define the ExportFormat enum with supported export formats (e.g., PNG, SVG, PDF)
    public enum ExportFormat
    {
        // Add export formats here
    }
}