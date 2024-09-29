using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace ExcelDesktop.Models
{
    /// <summary>
    /// Represents a single worksheet in a spreadsheet, containing cells, charts, and worksheet-level properties.
    /// </summary>
    public class Worksheet : INotifyPropertyChanged
    {
        private string _name;
        private int _rowCount;
        private int _columnCount;
        private bool _isVisible;
        private string _tabColor;

        /// <summary>
        /// Gets or sets the name of the worksheet.
        /// </summary>
        public string Name
        {
            get => _name;
            set
            {
                if (_name != value)
                {
                    _name = value;
                    OnPropertyChanged(nameof(Name));
                }
            }
        }

        /// <summary>
        /// Gets or sets the collection of cells in the worksheet.
        /// </summary>
        public Dictionary<string, Cell> Cells { get; set; }

        /// <summary>
        /// Gets or sets the collection of charts in the worksheet.
        /// </summary>
        public List<Chart> Charts { get; set; }

        /// <summary>
        /// Gets or sets the number of rows in the worksheet.
        /// </summary>
        public int RowCount
        {
            get => _rowCount;
            set
            {
                if (_rowCount != value)
                {
                    _rowCount = value;
                    OnPropertyChanged(nameof(RowCount));
                }
            }
        }

        /// <summary>
        /// Gets or sets the number of columns in the worksheet.
        /// </summary>
        public int ColumnCount
        {
            get => _columnCount;
            set
            {
                if (_columnCount != value)
                {
                    _columnCount = value;
                    OnPropertyChanged(nameof(ColumnCount));
                }
            }
        }

        /// <summary>
        /// Gets or sets a value indicating whether the worksheet is visible.
        /// </summary>
        public bool IsVisible
        {
            get => _isVisible;
            set
            {
                if (_isVisible != value)
                {
                    _isVisible = value;
                    OnPropertyChanged(nameof(IsVisible));
                }
            }
        }

        /// <summary>
        /// Gets or sets the tab color of the worksheet.
        /// </summary>
        public string TabColor
        {
            get => _tabColor;
            set
            {
                if (_tabColor != value)
                {
                    _tabColor = value;
                    OnPropertyChanged(nameof(TabColor));
                }
            }
        }

        /// <summary>
        /// Initializes a new instance of the Worksheet class with a given name.
        /// </summary>
        /// <param name="name">The name of the worksheet.</param>
        public Worksheet(string name)
        {
            Name = name;
            Cells = new Dictionary<string, Cell>();
            Charts = new List<Chart>();
            RowCount = 1000; // Default row count
            ColumnCount = 26; // Default column count (A to Z)
            IsVisible = true;
            TabColor = "#FFFFFF"; // Default tab color (white)
        }

        /// <summary>
        /// Retrieves a cell at the specified address, creating it if it doesn't exist.
        /// </summary>
        /// <param name="address">The address of the cell.</param>
        /// <returns>The cell at the specified address.</returns>
        public Cell GetCell(string address)
        {
            if (Cells.TryGetValue(address, out Cell cell))
            {
                return cell;
            }

            cell = new Cell(address);
            Cells[address] = cell;
            return cell;
        }

        /// <summary>
        /// Sets the value of a cell at the specified address.
        /// </summary>
        /// <param name="address">The address of the cell.</param>
        /// <param name="value">The value to set.</param>
        public void SetCellValue(string address, object value)
        {
            Cell cell = GetCell(address);
            cell.SetValue(value);
        }

        /// <summary>
        /// Sets the formula of a cell at the specified address.
        /// </summary>
        /// <param name="address">The address of the cell.</param>
        /// <param name="formulaExpression">The formula expression to set.</param>
        public void SetCellFormula(string address, string formulaExpression)
        {
            Cell cell = GetCell(address);
            Formula formula = new Formula(formulaExpression);
            cell.SetFormula(formula);
        }

        /// <summary>
        /// Adds a new chart to the worksheet.
        /// </summary>
        /// <param name="chart">The chart to add.</param>
        public void AddChart(Chart chart)
        {
            Charts.Add(chart);
        }

        /// <summary>
        /// Removes a chart from the worksheet.
        /// </summary>
        /// <param name="chart">The chart to remove.</param>
        /// <returns>True if the chart was successfully removed, false otherwise.</returns>
        public bool RemoveChart(Chart chart)
        {
            return Charts.Remove(chart);
        }

        /// <summary>
        /// Recalculates all cells in the worksheet.
        /// </summary>
        public void Recalculate()
        {
            foreach (var cell in Cells.Values)
            {
                if (cell.Formula != null)
                {
                    // Trigger recalculation for cells with formulas
                    // This is a placeholder and should be implemented with the actual calculation logic
                    cell.Recalculate();
                }
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
```

This implementation of the Worksheet class follows the provided JSON specification and includes all the required properties, methods, and functionality. Here are some additional notes:

1. The class implements INotifyPropertyChanged to support data binding in WPF applications.
2. Properties that need to notify of changes (Name, RowCount, ColumnCount, IsVisible, and TabColor) are implemented with backing fields and raise the PropertyChanged event when modified.
3. The constructor initializes the Cells dictionary and Charts list, sets default values for RowCount and ColumnCount, and sets IsVisible to true and TabColor to white.
4. The GetCell method creates a new Cell if it doesn't exist, ensuring that cells are created on-demand.
5. SetCellValue and SetCellFormula methods use the GetCell method to retrieve or create cells as needed.
6. The Recalculate method iterates through all cells with formulas and triggers a recalculation. The actual implementation of the cell's Recalculate method would need to be defined in the Cell class.

Here are the pending human tasks as comments within the file:

```csharp
// TODO: Implement cell range operations (e.g., copy, paste, fill)
// TODO: Add support for worksheet-level formatting (e.g., gridlines, zoom)
// TODO: Implement undo/redo functionality for worksheet operations
// TODO: Add support for named ranges
// TODO: Implement worksheet protection features