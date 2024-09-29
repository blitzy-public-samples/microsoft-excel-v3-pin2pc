using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Windows.Input;
using ExcelDesktop.Models;
using ExcelDesktop.Interfaces;

namespace ExcelDesktop.ViewModels
{
    /// <summary>
    /// ViewModel class for managing chart data and interactions in the Excel Desktop application.
    /// </summary>
    public class ChartViewModel : INotifyPropertyChanged
    {
        private Chart _chart;
        private IChartingEngine _chartingEngine;
        private string _selectedChartType;
        private string _chartTitle;
        private string _dataRange;
        private bool _hasLegend;
        private string _xAxisTitle;
        private string _yAxisTitle;

        public event PropertyChangedEventHandler PropertyChanged;

        public Chart Chart
        {
            get => _chart;
            set
            {
                _chart = value;
                OnPropertyChanged(nameof(Chart));
            }
        }

        public IChartingEngine ChartingEngine
        {
            get => _chartingEngine;
            set
            {
                _chartingEngine = value;
                OnPropertyChanged(nameof(ChartingEngine));
            }
        }

        public ObservableCollection<string> AvailableChartTypes { get; }

        public string SelectedChartType
        {
            get => _selectedChartType;
            set
            {
                _selectedChartType = value;
                OnPropertyChanged(nameof(SelectedChartType));
            }
        }

        public string ChartTitle
        {
            get => _chartTitle;
            set
            {
                _chartTitle = value;
                OnPropertyChanged(nameof(ChartTitle));
            }
        }

        public string DataRange
        {
            get => _dataRange;
            set
            {
                _dataRange = value;
                OnPropertyChanged(nameof(DataRange));
            }
        }

        public bool HasLegend
        {
            get => _hasLegend;
            set
            {
                _hasLegend = value;
                OnPropertyChanged(nameof(HasLegend));
            }
        }

        public string XAxisTitle
        {
            get => _xAxisTitle;
            set
            {
                _xAxisTitle = value;
                OnPropertyChanged(nameof(XAxisTitle));
            }
        }

        public string YAxisTitle
        {
            get => _yAxisTitle;
            set
            {
                _yAxisTitle = value;
                OnPropertyChanged(nameof(YAxisTitle));
            }
        }

        public ICommand UpdateChartCommand { get; private set; }
        public ICommand AddSeriesCommand { get; private set; }
        public ICommand RemoveSeriesCommand { get; private set; }

        /// <summary>
        /// Initializes a new instance of the ChartViewModel class.
        /// </summary>
        /// <param name="chart">The Chart model.</param>
        /// <param name="chartingEngine">The charting engine implementation.</param>
        public ChartViewModel(Chart chart, IChartingEngine chartingEngine)
        {
            Chart = chart;
            ChartingEngine = chartingEngine;

            // Initialize AvailableChartTypes with values from ChartType enum
            AvailableChartTypes = new ObservableCollection<string>(Enum.GetNames(typeof(ChartType)));

            // Set initial values from the Chart object
            ChartTitle = chart.Title;
            DataRange = chart.DataRange;
            HasLegend = chart.HasLegend;
            XAxisTitle = chart.XAxisTitle;
            YAxisTitle = chart.YAxisTitle;

            // Initialize commands
            UpdateChartCommand = new RelayCommand(UpdateChart);
            AddSeriesCommand = new RelayCommand<(string, string)>(AddSeries);
            RemoveSeriesCommand = new RelayCommand<string>(RemoveSeries);
        }

        /// <summary>
        /// Updates the chart with the current ViewModel properties.
        /// </summary>
        private void UpdateChart()
        {
            // Update Chart properties with ViewModel properties
            Chart.Title = ChartTitle;
            Chart.DataRange = DataRange;
            Chart.HasLegend = HasLegend;
            Chart.XAxisTitle = XAxisTitle;
            Chart.YAxisTitle = YAxisTitle;

            // Call ChartingEngine to refresh the chart
            ChartingEngine.RefreshChart(Chart);

            // Raise PropertyChanged events for updated properties
            OnPropertyChanged(nameof(Chart));
        }

        /// <summary>
        /// Adds a new series to the chart.
        /// </summary>
        /// <param name="seriesInfo">Tuple containing series name and range.</param>
        private void AddSeries((string seriesName, string seriesRange) seriesInfo)
        {
            // Validate input parameters
            if (string.IsNullOrEmpty(seriesInfo.seriesName) || string.IsNullOrEmpty(seriesInfo.seriesRange))
            {
                throw new ArgumentException("Series name and range must not be empty.");
            }

            // Create a new CellRange object from seriesRange
            var cellRange = new CellRange(seriesInfo.seriesRange);

            // Call Chart.AddSeries with the new series information
            Chart.AddSeries(seriesInfo.seriesName, cellRange);

            // Update the chart using ChartingEngine
            ChartingEngine.RefreshChart(Chart);

            // Raise PropertyChanged event for relevant properties
            OnPropertyChanged(nameof(Chart));
        }

        /// <summary>
        /// Removes a series from the chart.
        /// </summary>
        /// <param name="seriesName">The name of the series to remove.</param>
        private void RemoveSeries(string seriesName)
        {
            // Find the series in the Chart object
            var seriesToRemove = Chart.Series.FirstOrDefault(s => s.Name == seriesName);

            if (seriesToRemove != null)
            {
                // Remove the series from the Chart
                Chart.RemoveSeries(seriesToRemove);

                // Update the chart using ChartingEngine
                ChartingEngine.RefreshChart(Chart);

                // Raise PropertyChanged event for relevant properties
                OnPropertyChanged(nameof(Chart));
            }
        }

        /// <summary>
        /// Raises the PropertyChanged event for a property.
        /// </summary>
        /// <param name="propertyName">The name of the property that changed.</param>
        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }

    // Helper class for ICommand implementation
    public class RelayCommand : ICommand
    {
        private readonly Action _execute;
        private readonly Func<bool> _canExecute;

        public RelayCommand(Action execute, Func<bool> canExecute = null)
        {
            _execute = execute ?? throw new ArgumentNullException(nameof(execute));
            _canExecute = canExecute;
        }

        public bool CanExecute(object parameter) => _canExecute == null || _canExecute();
        public void Execute(object parameter) => _execute();
        public event EventHandler CanExecuteChanged
        {
            add { CommandManager.RequerySuggested += value; }
            remove { CommandManager.RequerySuggested -= value; }
        }
    }

    public class RelayCommand<T> : ICommand
    {
        private readonly Action<T> _execute;
        private readonly Func<T, bool> _canExecute;

        public RelayCommand(Action<T> execute, Func<T, bool> canExecute = null)
        {
            _execute = execute ?? throw new ArgumentNullException(nameof(execute));
            _canExecute = canExecute;
        }

        public bool CanExecute(object parameter) => _canExecute == null || _canExecute((T)parameter);
        public void Execute(object parameter) => _execute((T)parameter);
        public event EventHandler CanExecuteChanged
        {
            add { CommandManager.RequerySuggested += value; }
            remove { CommandManager.RequerySuggested -= value; }
        }
    }
}