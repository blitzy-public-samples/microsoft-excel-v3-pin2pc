using System;
using System.ComponentModel;

namespace ExcelDesktop.Models
{
    /// <summary>
    /// Represents a single cell in a spreadsheet, containing value, formatting, and formula information.
    /// </summary>
    public class Cell : INotifyPropertyChanged
    {
        private string address;
        private object value;
        private string displayValue;
        private object formula; // Placeholder for Formula object
        private string dataType;
        private string numberFormat;
        private string fontName;
        private float fontSize;
        private bool isBold;
        private bool isItalic;
        private bool isUnderline;
        private string foregroundColor;
        private string backgroundColor;
        private string horizontalAlignment;
        private string verticalAlignment;

        public event PropertyChangedEventHandler PropertyChanged;

        /// <summary>
        /// Gets or sets the address of the cell (e.g., "A1", "B2").
        /// </summary>
        public string Address
        {
            get => address;
            set
            {
                if (address != value)
                {
                    address = value;
                    OnPropertyChanged(nameof(Address));
                }
            }
        }

        /// <summary>
        /// Gets or sets the raw value of the cell.
        /// </summary>
        public object Value
        {
            get => value;
            set
            {
                if (this.value != value)
                {
                    this.value = value;
                    OnPropertyChanged(nameof(Value));
                    UpdateDisplayValue();
                    UpdateDataType();
                }
            }
        }

        /// <summary>
        /// Gets or sets the display value of the cell.
        /// </summary>
        public string DisplayValue
        {
            get => displayValue;
            private set
            {
                if (displayValue != value)
                {
                    displayValue = value;
                    OnPropertyChanged(nameof(DisplayValue));
                }
            }
        }

        /// <summary>
        /// Gets or sets the formula of the cell.
        /// </summary>
        public object Formula
        {
            get => formula;
            set
            {
                if (formula != value)
                {
                    formula = value;
                    OnPropertyChanged(nameof(Formula));
                    // TODO: Trigger recalculation
                }
            }
        }

        /// <summary>
        /// Gets or sets the data type of the cell.
        /// </summary>
        public string DataType
        {
            get => dataType;
            private set
            {
                if (dataType != value)
                {
                    dataType = value;
                    OnPropertyChanged(nameof(DataType));
                }
            }
        }

        /// <summary>
        /// Gets or sets the number format of the cell.
        /// </summary>
        public string NumberFormat
        {
            get => numberFormat;
            set
            {
                if (numberFormat != value)
                {
                    numberFormat = value;
                    OnPropertyChanged(nameof(NumberFormat));
                    UpdateDisplayValue();
                }
            }
        }

        /// <summary>
        /// Gets or sets the font name of the cell.
        /// </summary>
        public string FontName
        {
            get => fontName;
            set
            {
                if (fontName != value)
                {
                    fontName = value;
                    OnPropertyChanged(nameof(FontName));
                }
            }
        }

        /// <summary>
        /// Gets or sets the font size of the cell.
        /// </summary>
        public float FontSize
        {
            get => fontSize;
            set
            {
                if (fontSize != value)
                {
                    fontSize = value;
                    OnPropertyChanged(nameof(FontSize));
                }
            }
        }

        /// <summary>
        /// Gets or sets whether the cell text is bold.
        /// </summary>
        public bool IsBold
        {
            get => isBold;
            set
            {
                if (isBold != value)
                {
                    isBold = value;
                    OnPropertyChanged(nameof(IsBold));
                }
            }
        }

        /// <summary>
        /// Gets or sets whether the cell text is italic.
        /// </summary>
        public bool IsItalic
        {
            get => isItalic;
            set
            {
                if (isItalic != value)
                {
                    isItalic = value;
                    OnPropertyChanged(nameof(IsItalic));
                }
            }
        }

        /// <summary>
        /// Gets or sets whether the cell text is underlined.
        /// </summary>
        public bool IsUnderline
        {
            get => isUnderline;
            set
            {
                if (isUnderline != value)
                {
                    isUnderline = value;
                    OnPropertyChanged(nameof(IsUnderline));
                }
            }
        }

        /// <summary>
        /// Gets or sets the foreground color of the cell.
        /// </summary>
        public string ForegroundColor
        {
            get => foregroundColor;
            set
            {
                if (foregroundColor != value)
                {
                    foregroundColor = value;
                    OnPropertyChanged(nameof(ForegroundColor));
                }
            }
        }

        /// <summary>
        /// Gets or sets the background color of the cell.
        /// </summary>
        public string BackgroundColor
        {
            get => backgroundColor;
            set
            {
                if (backgroundColor != value)
                {
                    backgroundColor = value;
                    OnPropertyChanged(nameof(BackgroundColor));
                }
            }
        }

        /// <summary>
        /// Gets or sets the horizontal alignment of the cell content.
        /// </summary>
        public string HorizontalAlignment
        {
            get => horizontalAlignment;
            set
            {
                if (horizontalAlignment != value)
                {
                    horizontalAlignment = value;
                    OnPropertyChanged(nameof(HorizontalAlignment));
                }
            }
        }

        /// <summary>
        /// Gets or sets the vertical alignment of the cell content.
        /// </summary>
        public string VerticalAlignment
        {
            get => verticalAlignment;
            set
            {
                if (verticalAlignment != value)
                {
                    verticalAlignment = value;
                    OnPropertyChanged(nameof(VerticalAlignment));
                }
            }
        }

        /// <summary>
        /// Initializes a new instance of the Cell class with a given address.
        /// </summary>
        /// <param name="address">The address of the cell.</param>
        public Cell(string address)
        {
            Address = address;
            SetDefaultValues();
        }

        /// <summary>
        /// Sets the value of the cell and updates the DisplayValue and DataType properties.
        /// </summary>
        /// <param name="value">The value to set.</param>
        public void SetValue(object value)
        {
            Value = value;
        }

        /// <summary>
        /// Sets the formula for the cell and triggers a recalculation.
        /// </summary>
        /// <param name="formula">The formula to set.</param>
        public void SetFormula(object formula)
        {
            Formula = formula;
            // TODO: Implement recalculation logic
        }

        /// <summary>
        /// Returns a string representation of the cell.
        /// </summary>
        /// <returns>A string containing the cell's Address and DisplayValue.</returns>
        public override string ToString()
        {
            return $"Cell {Address}: {DisplayValue}";
        }

        private void SetDefaultValues()
        {
            Value = null;
            DisplayValue = string.Empty;
            Formula = null;
            DataType = "General";
            NumberFormat = "General";
            FontName = "Calibri";
            FontSize = 11;
            IsBold = false;
            IsItalic = false;
            IsUnderline = false;
            ForegroundColor = "Black";
            BackgroundColor = "White";
            HorizontalAlignment = "General";
            VerticalAlignment = "Bottom";
        }

        private void UpdateDisplayValue()
        {
            // TODO: Implement logic to format the display value based on the Value and NumberFormat
            DisplayValue = Value?.ToString() ?? string.Empty;
        }

        private void UpdateDataType()
        {
            // TODO: Implement logic to determine the data type based on the Value
            DataType = Value?.GetType().Name ?? "General";
        }

        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
```

This implementation of the Cell class includes all the properties specified in the JSON representation, along with the required methods. Here are some notes about the implementation:

1. The class implements INotifyPropertyChanged to support data binding in WPF applications.
2. The Formula property is currently of type object as a placeholder. It should be updated to the correct type once the Formula class is implemented.
3. The SetValue and SetFormula methods are implemented as specified.
4. The ToString method is implemented to return a string representation of the cell.
5. Private helper methods are added to set default values, update the display value, and update the data type.
6. TODO comments are added where additional logic needs to be implemented, such as recalculation and formatting.

Here are the pending human tasks as comments:

```csharp
// TODO: Implement data validation logic for cell values
// TODO: Add support for cell comments
// TODO: Implement cell locking/protection feature