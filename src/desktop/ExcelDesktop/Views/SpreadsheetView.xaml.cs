using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Input;
using ExcelDesktop.ViewModels;
using ExcelDesktop.Utils;

namespace ExcelDesktop.Views
{
    /// <summary>
    /// Interaction logic for SpreadsheetView.xaml
    /// </summary>
    public partial class SpreadsheetView : UserControl
    {
        /// <summary>
        /// The ViewModel associated with this view.
        /// </summary>
        public SpreadsheetViewModel ViewModel { get; private set; }

        /// <summary>
        /// Initializes a new instance of the SpreadsheetView class.
        /// </summary>
        public SpreadsheetView()
        {
            InitializeComponent();
            ViewModel = new SpreadsheetViewModel();
            DataContext = ViewModel;

            // Subscribe to relevant events
            Loaded += OnLoaded;
        }

        /// <summary>
        /// Event handler for when the control is loaded.
        /// </summary>
        private void OnLoaded(object sender, RoutedEventArgs e)
        {
            InitializeSpreadsheetGrid();
            ApplyTheme();
        }

        /// <summary>
        /// Event handler for when the selected cell changes.
        /// </summary>
        private void OnCellSelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (sender is DataGrid dataGrid && dataGrid.SelectedItem is Cell selectedCell)
            {
                ViewModel.SelectedCell = selectedCell;
                UpdateFormulaBarText();
            }
        }

        /// <summary>
        /// Event handler for when the formula bar text changes.
        /// </summary>
        private void OnFormulaBarTextChanged(object sender, TextChangedEventArgs e)
        {
            if (sender is TextBox formulaBar)
            {
                ViewModel.FormulaBarText = formulaBar.Text;
                // Trigger formula evaluation if needed
                ViewModel.EvaluateFormula();
            }
        }

        /// <summary>
        /// Event handler for when a cell's value changes.
        /// </summary>
        private void OnCellValueChanged(object sender, DataGridCellEditEndingEventArgs e)
        {
            if (e.EditAction == DataGridEditAction.Commit)
            {
                var cell = e.Row.Item as Cell;
                var newValue = (e.EditingElement as TextBox)?.Text;

                if (cell != null && newValue != null)
                {
                    ViewModel.UpdateCellValue(cell, newValue);
                    // Trigger recalculation of dependent cells
                    ViewModel.RecalculateDependentCells(cell);
                }
            }
        }

        /// <summary>
        /// Initializes the spreadsheet grid with columns and rows.
        /// </summary>
        private void InitializeSpreadsheetGrid()
        {
            // Generate columns based on the ViewModel's configuration
            for (int i = 0; i < ViewModel.ColumnCount; i++)
            {
                var column = new DataGridTextColumn
                {
                    Header = CellAddressHelper.GetColumnName(i),
                    Binding = new Binding($"Cells[{i}].Value")
                };
                SpreadsheetGrid.Columns.Add(column);
            }

            // Set up row headers
            SpreadsheetGrid.RowHeaderWidth = 50;
            SpreadsheetGrid.LoadingRow += (s, e) =>
            {
                e.Row.Header = (e.Row.GetIndex() + 1).ToString();
            };

            // Apply initial styling to the grid
            SpreadsheetGrid.AutoGenerateColumns = false;
            SpreadsheetGrid.CanUserAddRows = false;
            SpreadsheetGrid.CanUserDeleteRows = false;
            SpreadsheetGrid.SelectionMode = DataGridSelectionMode.Single;
            SpreadsheetGrid.SelectionUnit = DataGridSelectionUnit.Cell;

            // Bind the ItemsSource to the ViewModel's data
            SpreadsheetGrid.ItemsSource = ViewModel.Rows;

            // Subscribe to events
            SpreadsheetGrid.SelectedCellsChanged += OnCellSelectionChanged;
            SpreadsheetGrid.CellEditEnding += OnCellValueChanged;
        }

        /// <summary>
        /// Applies the current theme to the spreadsheet view.
        /// </summary>
        private void ApplyTheme()
        {
            var currentTheme = ThemeManager.GetCurrentTheme();
            // Apply theme colors and styles to the UI elements
            SpreadsheetGrid.Background = currentTheme.BackgroundBrush;
            SpreadsheetGrid.Foreground = currentTheme.ForegroundBrush;
            // Apply more theme-specific styling as needed
        }

        /// <summary>
        /// Updates the formula bar text based on the selected cell.
        /// </summary>
        private void UpdateFormulaBarText()
        {
            if (ViewModel.SelectedCell != null)
            {
                FormulaBar.Text = ViewModel.SelectedCell.Formula ?? ViewModel.SelectedCell.Value;
            }
            else
            {
                FormulaBar.Text = string.Empty;
            }
        }
    }
}
```

This code implements the SpreadsheetView class, which is the code-behind for the SpreadsheetView.xaml file. Here's a breakdown of the implementation:

1. The class inherits from UserControl and implements the partial class as specified in the JSON representation.
2. It has a property for the SpreadsheetViewModel, which is initialized in the constructor.
3. The constructor initializes the component, sets up the data context, and subscribes to the Loaded event.
4. The OnLoaded method initializes the spreadsheet grid and applies the initial theme.
5. Event handlers are implemented for cell selection changes, formula bar text changes, and cell value changes.
6. The InitializeSpreadsheetGrid method sets up the columns, row headers, and initial styling for the grid.
7. The ApplyTheme method uses the ThemeManager to apply the current theme to the UI elements.
8. Helper methods like UpdateFormulaBarText are implemented to keep the UI in sync with the ViewModel.

The code follows best practices for WPF development, including:
- Proper separation of concerns between the View and ViewModel.
- Use of data binding to connect the UI with the ViewModel.
- Event-driven programming to handle user interactions.
- Utilization of helper classes like CellAddressHelper and ThemeManager.

Here are the human tasks listed as comments:

```csharp
// Human tasks:
// TODO: Implement custom cell editors for different data types (e.g., date picker for date cells)
// TODO: Add support for keyboard navigation within the spreadsheet grid
// TODO: Implement undo/redo functionality
// TODO: Add support for copy/paste operations
// TODO: Implement cell formatting options (e.g., bold, italic, cell colors)