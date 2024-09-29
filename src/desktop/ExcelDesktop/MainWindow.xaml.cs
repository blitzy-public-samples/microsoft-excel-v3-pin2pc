using System;
using System.Windows;
using System.ComponentModel;
using System.Windows.Controls;
using ExcelDesktop.ViewModels;

namespace ExcelDesktop
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        // View models
        public SpreadsheetViewModel SpreadsheetViewModel { get; private set; }
        public FormulaBarViewModel FormulaBarViewModel { get; private set; }
        public RibbonViewModel RibbonViewModel { get; private set; }

        public MainWindow()
        {
            InitializeComponent();

            // Initialize view models
            InitializeViewModels();

            // Set up data contexts for the views
            SetupDataContexts();

            // Subscribe to necessary events
            SubscribeToEvents();

            // Set the DataContext of the window to itself
            DataContext = this;

            // Register Loaded and Closing events
            Loaded += OnLoaded;
            Closing += OnClosing;
        }

        private void InitializeViewModels()
        {
            // TODO: Implement proper initialization of view models
            SpreadsheetViewModel = new SpreadsheetViewModel();
            FormulaBarViewModel = new FormulaBarViewModel();
            RibbonViewModel = new RibbonViewModel();
        }

        private void SetupDataContexts()
        {
            // TODO: Set up data contexts for the views
            // Example:
            // spreadsheetView.DataContext = SpreadsheetViewModel;
            // formulaBarView.DataContext = FormulaBarViewModel;
            // ribbonView.DataContext = RibbonViewModel;
        }

        private void SubscribeToEvents()
        {
            // TODO: Subscribe to necessary events from view models
            // Example:
            // SpreadsheetViewModel.PropertyChanged += OnSpreadsheetViewModelPropertyChanged;
        }

        private void OnLoaded(object sender, RoutedEventArgs e)
        {
            try
            {
                // Perform any necessary initialization after the window has loaded
                // TODO: Implement initialization logic

                // Load the last opened workbook or create a new one
                LoadOrCreateWorkbook();
            }
            catch (Exception ex)
            {
                // TODO: Implement proper error handling and logging
                MessageBox.Show($"An error occurred while loading the application: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void OnClosing(object sender, CancelEventArgs e)
        {
            try
            {
                // Prompt user to save any unsaved changes
                if (HasUnsavedChanges())
                {
                    var result = MessageBox.Show("Do you want to save changes before closing?", "Save Changes", MessageBoxButton.YesNoCancel, MessageBoxImage.Question);
                    
                    switch (result)
                    {
                        case MessageBoxResult.Yes:
                            SaveChanges();
                            break;
                        case MessageBoxResult.Cancel:
                            e.Cancel = true;
                            return;
                    }
                }

                // Perform any necessary cleanup operations
                CleanupResources();

                // Save application state if required
                SaveApplicationState();
            }
            catch (Exception ex)
            {
                // TODO: Implement proper error handling and logging
                MessageBox.Show($"An error occurred while closing the application: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void LoadOrCreateWorkbook()
        {
            // TODO: Implement logic to load the last opened workbook or create a new one
        }

        private bool HasUnsavedChanges()
        {
            // TODO: Implement logic to check for unsaved changes
            return false;
        }

        private void SaveChanges()
        {
            // TODO: Implement logic to save changes
        }

        private void CleanupResources()
        {
            // TODO: Implement proper disposal of resources
            // Example:
            // SpreadsheetViewModel.Dispose();
            // FormulaBarViewModel.Dispose();
            // RibbonViewModel.Dispose();
        }

        private void SaveApplicationState()
        {
            // TODO: Implement logic to save application state
        }
    }
}