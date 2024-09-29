using System;
using System.Windows;

namespace ExcelDesktop
{
    public class Program
    {
        [STAThread]
        public static void Main(string[] args)
        {
            try
            {
                // Set up any necessary environment variables or configurations
                SetupEnvironment();

                // Initialize any required third-party libraries
                InitializeThirdPartyLibraries();

                // Create and run a new instance of the App class
                var app = new App();
                app.Run();
            }
            catch (Exception ex)
            {
                // Handle any unhandled exceptions at the application level
                HandleUnhandledException(ex);
            }
        }

        private static void SetupEnvironment()
        {
            // TODO: Implement environment setup
            // This may include setting up configuration files, environment variables, etc.
        }

        private static void InitializeThirdPartyLibraries()
        {
            // TODO: Initialize any required third-party libraries
            // This may include setting up logging frameworks, dependency injection containers, etc.
        }

        private static void HandleUnhandledException(Exception ex)
        {
            // TODO: Implement proper exception handling and logging
            MessageBox.Show($"An unhandled exception occurred: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);

            // TODO: Log the exception
            // LogException(ex);

            // Terminate the application
            Environment.Exit(1);
        }
    }
}