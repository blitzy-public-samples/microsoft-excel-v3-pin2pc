using System;
using System.Windows.Input;
using System.ComponentModel;
using ExcelDesktop.Interfaces;
using ExcelDesktop.Models;

namespace ExcelDesktop.ViewModels
{
    /// <summary>
    /// ViewModel class for managing the Excel Ribbon UI
    /// </summary>
    public class RibbonViewModel : INotifyPropertyChanged
    {
        private readonly ICalculationEngine _calculationEngine;
        private readonly IChartingEngine _chartingEngine;
        private readonly IFileIOService _fileIOService;
        private bool _isWorkbookOpen;

        public event PropertyChangedEventHandler PropertyChanged;

        // Command properties
        public ICommand NewWorkbookCommand { get; private set; }
        public ICommand OpenWorkbookCommand { get; private set; }
        public ICommand SaveWorkbookCommand { get; private set; }
        public ICommand SaveAsWorkbookCommand { get; private set; }
        public ICommand UndoCommand { get; private set; }
        public ICommand RedoCommand { get; private set; }
        public ICommand CutCommand { get; private set; }
        public ICommand CopyCommand { get; private set; }
        public ICommand PasteCommand { get; private set; }
        public ICommand InsertChartCommand { get; private set; }
        public ICommand InsertPivotTableCommand { get; private set; }
        public ICommand RecalculateCommand { get; private set; }

        public bool IsWorkbookOpen
        {
            get => _isWorkbookOpen;
            set
            {
                if (_isWorkbookOpen != value)
                {
                    _isWorkbookOpen = value;
                    OnPropertyChanged(nameof(IsWorkbookOpen));
                }
            }
        }

        /// <summary>
        /// Initializes a new instance of the RibbonViewModel class
        /// </summary>
        /// <param name="calculationEngine">The calculation engine instance</param>
        /// <param name="chartingEngine">The charting engine instance</param>
        /// <param name="fileIOService">The file I/O service instance</param>
        public RibbonViewModel(ICalculationEngine calculationEngine, IChartingEngine chartingEngine, IFileIOService fileIOService)
        {
            _calculationEngine = calculationEngine ?? throw new ArgumentNullException(nameof(calculationEngine));
            _chartingEngine = chartingEngine ?? throw new ArgumentNullException(nameof(chartingEngine));
            _fileIOService = fileIOService ?? throw new ArgumentNullException(nameof(fileIOService));

            InitializeCommands();
        }

        private void InitializeCommands()
        {
            NewWorkbookCommand = new RelayCommand(NewWorkbook);
            OpenWorkbookCommand = new RelayCommand(OpenWorkbook);
            SaveWorkbookCommand = new RelayCommand(SaveWorkbook, () => IsWorkbookOpen);
            SaveAsWorkbookCommand = new RelayCommand(SaveAsWorkbook, () => IsWorkbookOpen);
            UndoCommand = new RelayCommand(Undo, () => IsWorkbookOpen);
            RedoCommand = new RelayCommand(Redo, () => IsWorkbookOpen);
            CutCommand = new RelayCommand(Cut, () => IsWorkbookOpen);
            CopyCommand = new RelayCommand(Copy, () => IsWorkbookOpen);
            PasteCommand = new RelayCommand(Paste, () => IsWorkbookOpen);
            InsertChartCommand = new RelayCommand(InsertChart, () => IsWorkbookOpen);
            InsertPivotTableCommand = new RelayCommand(InsertPivotTable, () => IsWorkbookOpen);
            RecalculateCommand = new RelayCommand(Recalculate, () => IsWorkbookOpen);
        }

        private void NewWorkbook()
        {
            // Create a new Workbook instance
            var newWorkbook = new Workbook();
            // Set the current workbook (implementation depends on how workbook state is managed)
            // UpdateCurrentWorkbook(newWorkbook);
            IsWorkbookOpen = true;
        }

        private void OpenWorkbook()
        {
            // Show file open dialog
            var filePath = _fileIOService.ShowOpenFileDialog();
            if (!string.IsNullOrEmpty(filePath))
            {
                // Use IFileIOService to load the workbook
                var workbook = _fileIOService.LoadWorkbook(filePath);
                // Set the current workbook (implementation depends on how workbook state is managed)
                // UpdateCurrentWorkbook(workbook);
                IsWorkbookOpen = true;
            }
        }

        private void SaveWorkbook()
        {
            if (!IsWorkbookOpen) return;

            // Implementation depends on how current workbook is accessed
            // if (CurrentWorkbook.FilePath == null)
            // {
            //     SaveAsWorkbook();
            // }
            // else
            // {
            //     _fileIOService.SaveWorkbook(CurrentWorkbook, CurrentWorkbook.FilePath);
            // }
        }

        private void SaveAsWorkbook()
        {
            if (!IsWorkbookOpen) return;

            // Show file save dialog
            var filePath = _fileIOService.ShowSaveFileDialog();
            if (!string.IsNullOrEmpty(filePath))
            {
                // Use IFileIOService to save the workbook with the new path
                // _fileIOService.SaveWorkbook(CurrentWorkbook, filePath);
                // Update current workbook file path
                // CurrentWorkbook.FilePath = filePath;
            }
        }

        private void InsertChart()
        {
            // Get the selected range (implementation depends on how selection is managed)
            // var selectedRange = GetSelectedRange();
            // Use IChartingEngine to create a new chart
            // var chart = _chartingEngine.CreateChart(selectedRange);
            // Insert the chart into the current worksheet
            // CurrentWorksheet.InsertChart(chart);
        }

        private void InsertPivotTable()
        {
            // Get the selected range (implementation depends on how selection is managed)
            // var selectedRange = GetSelectedRange();
            // Show pivot table creation dialog
            // var pivotTableSettings = ShowPivotTableDialog(selectedRange);
            // Create and insert the pivot table based on user input
            // var pivotTable = _calculationEngine.CreatePivotTable(selectedRange, pivotTableSettings);
            // CurrentWorksheet.InsertPivotTable(pivotTable);
        }

        private void Recalculate()
        {
            // Call ICalculationEngine.RecalculateWorksheet for each worksheet in the workbook
            // foreach (var worksheet in CurrentWorkbook.Worksheets)
            // {
            //     _calculationEngine.RecalculateWorksheet(worksheet);
            // }
        }

        // Placeholder methods for other commands
        private void Undo() { /* Implement undo functionality */ }
        private void Redo() { /* Implement redo functionality */ }
        private void Cut() { /* Implement cut functionality */ }
        private void Copy() { /* Implement copy functionality */ }
        private void Paste() { /* Implement paste functionality */ }

        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }

    // Simple implementation of ICommand for the purpose of this example
    public class RelayCommand : ICommand
    {
        private readonly Action _execute;
        private readonly Func<bool> _canExecute;

        public RelayCommand(Action execute, Func<bool> canExecute = null)
        {
            _execute = execute ?? throw new ArgumentNullException(nameof(execute));
            _canExecute = canExecute;
        }

        public event EventHandler CanExecuteChanged
        {
            add { CommandManager.RequerySuggested += value; }
            remove { CommandManager.RequerySuggested -= value; }
        }

        public bool CanExecute(object parameter) => _canExecute == null || _canExecute();

        public void Execute(object parameter) => _execute();
    }
}