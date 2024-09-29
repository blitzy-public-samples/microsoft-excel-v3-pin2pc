using System;
using System.Windows;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ExcelDesktop.Services;
using ExcelDesktop.ViewModels;

namespace ExcelDesktop
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        private IServiceProvider _serviceProvider;

        public App()
        {
            // Initialize any application-wide services or configurations
            ConfigureServices();
        }

        private void ConfigureServices()
        {
            var services = new ServiceCollection();

            // Register services
            services.AddSingleton<ICalculationEngine, CalculationEngine>();
            services.AddSingleton<IChartingEngine, ChartingEngine>();
            services.AddSingleton<IFileIOService, FileIOService>();
            services.AddSingleton<IDataSyncService, DataSyncService>();
            services.AddSingleton<IAuthenticationService, AuthenticationService>();

            // Register ViewModels
            services.AddTransient<SpreadsheetViewModel>();
            services.AddTransient<FormulaBarViewModel>();
            services.AddTransient<RibbonViewModel>();
            services.AddTransient<ChartViewModel>();

            // Register MainWindow
            services.AddTransient<MainWindow>();

            // Configure logging
            services.AddLogging(configure => configure.AddConsole());

            _serviceProvider = services.BuildServiceProvider();
        }

        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            // Initialize application-wide services
            InitializeServices();

            // Set up global exception handler
            SetupExceptionHandling();

            // Configure and start any background services
            ConfigureBackgroundServices();

            // Create and show the main window
            var mainWindow = _serviceProvider.GetRequiredService<MainWindow>();
            mainWindow.Show();
        }

        private void InitializeServices()
        {
            // Initialize services that require startup logic
            var authService = _serviceProvider.GetRequiredService<IAuthenticationService>();
            authService.Initialize();

            var dataSyncService = _serviceProvider.GetRequiredService<IDataSyncService>();
            dataSyncService.Initialize();
        }

        private void SetupExceptionHandling()
        {
            AppDomain.CurrentDomain.UnhandledException += (sender, args) =>
                LogUnhandledException((Exception)args.ExceptionObject, "AppDomain.CurrentDomain.UnhandledException");

            DispatcherUnhandledException += (sender, args) =>
            {
                LogUnhandledException(args.Exception, "Application.Current.DispatcherUnhandledException");
                args.Handled = true;
            };

            TaskScheduler.UnobservedTaskException += (sender, args) =>
            {
                LogUnhandledException(args.Exception, "TaskScheduler.UnobservedTaskException");
                args.SetObserved();
            };
        }

        private void LogUnhandledException(Exception exception, string source)
        {
            var logger = _serviceProvider.GetRequiredService<ILogger<App>>();
            logger.LogError(exception, "Unhandled exception in {Source}", source);
            // TODO: Implement proper telemetry and crash reporting
        }

        private void ConfigureBackgroundServices()
        {
            // Start any background services or tasks
            var dataSyncService = _serviceProvider.GetRequiredService<IDataSyncService>();
            dataSyncService.StartBackgroundSync();
        }

        protected override void OnExit(ExitEventArgs e)
        {
            // Perform any cleanup operations
            var dataSyncService = _serviceProvider.GetRequiredService<IDataSyncService>();
            dataSyncService.StopBackgroundSync();

            // Dispose of application-wide resources
            (_serviceProvider as IDisposable)?.Dispose();

            base.OnExit(e);
        }
    }
}