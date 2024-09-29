using System;
using System.Windows;
using System.Windows.Controls;
using ExcelDesktop.ViewModels;

namespace ExcelDesktop.Views
{
    /// <summary>
    /// Interaction logic for ChartView.xaml
    /// </summary>
    public partial class ChartView : UserControl
    {
        /// <summary>
        /// Initializes a new instance of the ChartView class.
        /// </summary>
        public ChartView()
        {
            InitializeComponent();
            Loaded += OnLoaded;
            Unloaded += OnUnloaded;
        }

        /// <summary>
        /// Event handler for the Loaded event of the UserControl.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The event arguments.</param>
        private void OnLoaded(object sender, RoutedEventArgs e)
        {
            try
            {
                // Perform any necessary initialization when the control is loaded
                if (DataContext is ChartViewModel viewModel)
                {
                    // Access the ChartViewModel from the DataContext if needed
                    viewModel.InitializeChart();
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error in ChartView OnLoaded: {ex.Message}");
                // You might want to use a proper logging mechanism in a production environment
            }
        }

        /// <summary>
        /// Event handler for the Unloaded event of the UserControl.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The event arguments.</param>
        private void OnUnloaded(object sender, RoutedEventArgs e)
        {
            try
            {
                // Perform any necessary cleanup when the control is unloaded
                if (DataContext is ChartViewModel viewModel)
                {
                    // Unsubscribe from any events if subscribed in the code-behind
                    viewModel.CleanupChart();
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error in ChartView OnUnloaded: {ex.Message}");
                // You might want to use a proper logging mechanism in a production environment
            }
        }

        // Additional methods for handling user interactions not covered by XAML bindings can be added here
    }
}