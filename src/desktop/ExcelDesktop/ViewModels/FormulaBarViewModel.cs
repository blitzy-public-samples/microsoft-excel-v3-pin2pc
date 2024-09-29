using System;
using System.ComponentModel;
using System.Collections.ObjectModel;
using System.Windows.Input;

namespace ExcelDesktop.ViewModels
{
    /// <summary>
    /// ViewModel class for managing the Formula Bar functionality
    /// </summary>
    public class FormulaBarViewModel : INotifyPropertyChanged
    {
        private readonly ICalculationEngine _calculationEngine;
        private string _currentFormula;
        private Cell _activeCell;
        private bool _isEditing;
        private ObservableCollection<string> _recentFormulas;

        public event PropertyChangedEventHandler PropertyChanged;

        public FormulaBarViewModel(ICalculationEngine calculationEngine)
        {
            _calculationEngine = calculationEngine ?? throw new ArgumentNullException(nameof(calculationEngine));
            _recentFormulas = new ObservableCollection<string>();
            
            // Initialize commands
            UpdateFormulaCommand = new RelayCommand(UpdateFormula, CanUpdateFormula);
            StartEditingCommand = new RelayCommand(StartEditing);
            EndEditingCommand = new RelayCommand<bool>(EndEditing);
        }

        public string CurrentFormula
        {
            get => _currentFormula;
            set
            {
                if (_currentFormula != value)
                {
                    _currentFormula = value;
                    OnPropertyChanged(nameof(CurrentFormula));
                }
            }
        }

        public Cell ActiveCell
        {
            get => _activeCell;
            set
            {
                if (_activeCell != value)
                {
                    _activeCell = value;
                    OnPropertyChanged(nameof(ActiveCell));
                    CurrentFormula = _activeCell?.Formula?.Expression ?? string.Empty;
                }
            }
        }

        public bool IsEditing
        {
            get => _isEditing;
            set
            {
                if (_isEditing != value)
                {
                    _isEditing = value;
                    OnPropertyChanged(nameof(IsEditing));
                }
            }
        }

        public ObservableCollection<string> RecentFormulas => _recentFormulas;

        public ICommand UpdateFormulaCommand { get; }
        public ICommand StartEditingCommand { get; }
        public ICommand EndEditingCommand { get; }

        /// <summary>
        /// Updates the current formula and applies it to the active cell
        /// </summary>
        public void UpdateFormula()
        {
            if (ActiveCell == null || string.IsNullOrWhiteSpace(CurrentFormula))
                return;

            if (ValidateFormula(CurrentFormula))
            {
                ActiveCell.Formula = new Formula { Expression = CurrentFormula };
                _calculationEngine.RecalculateCell(ActiveCell);

                if (!RecentFormulas.Contains(CurrentFormula))
                {
                    RecentFormulas.Insert(0, CurrentFormula);
                    if (RecentFormulas.Count > 10) // Keep only the 10 most recent formulas
                    {
                        RecentFormulas.RemoveAt(RecentFormulas.Count - 1);
                    }
                }
            }
            else
            {
                // TODO: Implement error handling and user feedback for invalid formulas
            }
        }

        private bool CanUpdateFormula()
        {
            return ActiveCell != null && !string.IsNullOrWhiteSpace(CurrentFormula);
        }

        /// <summary>
        /// Sets the active cell and updates the current formula
        /// </summary>
        public void SetActiveCell(Cell cell)
        {
            ActiveCell = cell;
            IsEditing = false;
        }

        /// <summary>
        /// Starts the formula editing mode
        /// </summary>
        public void StartEditing()
        {
            IsEditing = true;
        }

        /// <summary>
        /// Ends the formula editing mode and applies the changes
        /// </summary>
        public void EndEditing(bool applyChanges)
        {
            if (applyChanges)
            {
                UpdateFormula();
            }
            else
            {
                CurrentFormula = ActiveCell?.Formula?.Expression ?? string.Empty;
            }
            IsEditing = false;
        }

        /// <summary>
        /// Validates the given formula
        /// </summary>
        private bool ValidateFormula(string formula)
        {
            // TODO: Implement proper formula validation using the ICalculationEngine
            return _calculationEngine.ValidateFormula(formula);
        }

        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }

    // TODO: Implement this command class or use an existing implementation
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