using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Windows.Input;
using System.Threading.Tasks;
using ExcelDesktop.Models;
using ExcelDesktop.Interfaces;

namespace ExcelDesktop.ViewModels
{
    /// <summary>
    /// The main view model for the Excel-like spreadsheet application, managing the interaction between the user interface and the underlying data models.
    /// </summary>
    public class SpreadsheetViewModel : INotifyPropertyChanged
    {
        private Workbook _currentWorkbook;
        private Worksheet _activeWorksheet;
        private Cell _selectedCell;
        private string _formulaBarText;

        public event PropertyChangedEventHandler PropertyChanged;

        public Workbook CurrentWorkbook
        {
            get => _currentWorkbook;
            set
            {
                _currentWorkbook = value;
                OnPropertyChanged(nameof(CurrentWorkbook));
            }
        }

        public Worksheet ActiveWorksheet
        {
            get => _activeWorksheet;
            set
            {
                _activeWorksheet = value;
                OnPropertyChanged(nameof(ActiveWorksheet));
            }
        }

        public ObservableCollection<Worksheet> Worksheets { get; set; }

        public Cell SelectedCell
        {
            get => _selectedCell;
            set
            {
                _selectedCell = value;
                OnPropertyChanged(nameof(SelectedCell));
                FormulaBarText = _selectedCell?.Formula ?? _selectedCell?.Value?.ToString() ?? string.Empty;
            }
        }

        public string FormulaBarText
        {
            get => _formulaBarText;
            set
            {
                _formulaBarText = value;
                OnPropertyChanged(nameof(FormulaBarText));
            }
        }

        public ICalculationEngine CalculationEngine { get; }
        public IChartingEngine ChartingEngine { get; }
        public IDataSyncService DataSyncService { get; }

        public ICommand NewWorkbookCommand { get; private set; }
        public ICommand OpenWorkbookCommand { get; private set; }
        public ICommand SaveWorkbookCommand { get; private set; }
        public ICommand AddWorksheetCommand { get; private set; }
        public ICommand RemoveWorksheetCommand { get; private set; }
        public ICommand CreateChartCommand { get; private set; }
        public ICommand SyncDataCommand { get; private set; }

        public SpreadsheetViewModel(ICalculationEngine calculationEngine, IChartingEngine chartingEngine, IDataSyncService dataSyncService)
        {
            CalculationEngine = calculationEngine;
            ChartingEngine = chartingEngine;
            DataSyncService = dataSyncService;

            // Initialize with a new workbook
            NewWorkbook();

            // Initialize commands
            InitializeCommands();
        }

        private void InitializeCommands()
        {
            NewWorkbookCommand = new RelayCommand(NewWorkbook);
            OpenWorkbookCommand = new RelayCommand<string>(async (path) => await OpenWorkbook(path));
            SaveWorkbookCommand = new RelayCommand(async () => await SaveWorkbook());
            AddWorksheetCommand = new RelayCommand(AddWorksheet);
            RemoveWorksheetCommand = new RelayCommand(RemoveWorksheet);
            CreateChartCommand = new RelayCommand<ChartType>(CreateChart);
            SyncDataCommand = new RelayCommand(async () => await SyncData());
        }

        public void NewWorkbook()
        {
            CurrentWorkbook = new Workbook();
            Worksheets = new ObservableCollection<Worksheet>(CurrentWorkbook.Worksheets);
            ActiveWorksheet = Worksheets[0];
            SelectedCell = null;
            FormulaBarText = string.Empty;
        }

        public async Task OpenWorkbook(string filePath)
        {
            // Assume CurrentWorkbook has a method to load from file
            CurrentWorkbook = await CurrentWorkbook.LoadFromFileAsync(filePath);
            Worksheets = new ObservableCollection<Worksheet>(CurrentWorkbook.Worksheets);
            ActiveWorksheet = Worksheets[0];
            SelectedCell = null;
            FormulaBarText = string.Empty;
        }

        public async Task SaveWorkbook()
        {
            if (string.IsNullOrEmpty(CurrentWorkbook.FilePath))
            {
                // Implement logic to prompt user for save location
                // For now, we'll assume it's saved to a default location
                CurrentWorkbook.FilePath = "default_path.xlsx";
            }

            await CurrentWorkbook.SaveAsync();
        }

        public void AddWorksheet()
        {
            var newWorksheet = CurrentWorkbook.AddWorksheet();
            Worksheets.Add(newWorksheet);
            ActiveWorksheet = newWorksheet;
        }

        public void RemoveWorksheet()
        {
            if (Worksheets.Count > 1)
            {
                CurrentWorkbook.RemoveWorksheet(ActiveWorksheet);
                Worksheets.Remove(ActiveWorksheet);
                ActiveWorksheet = Worksheets[0];
            }
            else
            {
                // Implement logic to show an error message to the user
                // Cannot remove the last worksheet
            }
        }

        public void CreateChart(ChartType chartType)
        {
            // Implement logic to get the selected data range
            var selectedRange = GetSelectedRange();

            var chart = ChartingEngine.CreateChart(ActiveWorksheet, selectedRange, chartType);
            ActiveWorksheet.Charts.Add(chart);
        }

        public async Task SyncData()
        {
            await DataSyncService.SyncWorkbook(CurrentWorkbook);
            // Implement logic to handle conflicts and update UI
        }

        public void UpdateCellValue(string newValue)
        {
            if (SelectedCell != null)
            {
                if (newValue.StartsWith("="))
                {
                    SelectedCell.Formula = newValue;
                    SelectedCell.Value = CalculationEngine.Calculate(SelectedCell);
                }
                else
                {
                    SelectedCell.Value = newValue;
                    SelectedCell.Formula = null;
                }

                FormulaBarText = newValue;
                // Trigger recalculation of dependent cells
                CalculationEngine.RecalculateDependents(SelectedCell);
            }
        }

        public void SelectCell(string cellAddress)
        {
            SelectedCell = ActiveWorksheet.GetCell(cellAddress);
            FormulaBarText = SelectedCell.Formula ?? SelectedCell.Value?.ToString() ?? string.Empty;
        }

        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        private Range GetSelectedRange()
        {
            // Implement logic to get the currently selected range
            // This is a placeholder implementation
            return new Range(ActiveWorksheet, "A1:B5");
        }
    }

    // Placeholder implementations for missing types
    public class Range
    {
        public Range(Worksheet worksheet, string address) { }
    }

    public enum ChartType { }

    public class RelayCommand : ICommand
    {
        private readonly Action _execute;
        private readonly Func<bool> _canExecute;

        public RelayCommand(Action execute, Func<bool> canExecute = null)
        {
            _execute = execute ?? throw new ArgumentNullException(nameof(execute));
            _canExecute = canExecute;
        }

        public bool CanExecute(object parameter) => _canExecute?.Invoke() ?? true;
        public void Execute(object parameter) => _execute();
        public event EventHandler CanExecuteChanged;
        public void RaiseCanExecuteChanged() => CanExecuteChanged?.Invoke(this, EventArgs.Empty);
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

        public bool CanExecute(object parameter) => _canExecute?.Invoke((T)parameter) ?? true;
        public void Execute(object parameter) => _execute((T)parameter);
        public event EventHandler CanExecuteChanged;
        public void RaiseCanExecuteChanged() => CanExecuteChanged?.Invoke(this, EventArgs.Empty);
    }
}