# Microsoft Excel Desktop Application

This directory contains the source code and related files for the desktop version of Microsoft Excel, built using C# and WPF for Windows.

## Project Structure

The desktop application project is organized as follows:

- `ExcelDesktop/`: Main project directory
  - `Interfaces/`: Contains interface definitions for core services
  - `Models/`: Data models for workbook, worksheet, cell, etc.
  - `Utils/`: Utility classes and helper functions
  - `Resources/`: XAML resources for styles and icons
  - `Services/`: Implementation of core services (CalculationEngine, ChartingEngine, etc.)
  - `ViewModels/`: ViewModels for MVVM architecture
  - `Views/`: XAML views for the user interface
  - `MainWindow.xaml`: Main application window
  - `App.xaml`: Application entry point
- `ExcelDesktop.Tests/`: Unit and integration tests
- `ExcelCore/`: C++ core library for performance-critical operations

## Setup and Installation

1. Ensure you have Visual Studio 2022 or later installed with the following workloads:
   - .NET Desktop Development
   - Desktop Development with C++
2. Clone the repository and open `ExcelDesktop.sln` in Visual Studio.
3. Restore NuGet packages for the solution.
4. Build the solution to ensure all dependencies are correctly resolved.
5. Set `ExcelDesktop` as the startup project and run the application.

## Development Guidelines

1. Follow Microsoft's C# Coding Conventions and .NET Framework Design Guidelines.
2. Use MVVM pattern for separation of concerns between the UI and business logic.
3. Implement unit tests for all new features and bug fixes.
4. Use dependency injection for better testability and modularity.
5. Keep the UI responsive by offloading heavy computations to background threads.
6. Use async/await for I/O operations and long-running tasks.

## Testing

- Use MSTest for unit testing.
- Run tests using the Test Explorer in Visual Studio.
- Aim for high code coverage, especially for critical components like the CalculationEngine.

## Building and Deployment

1. Update the version number in `AssemblyInfo.cs` before building a release version.
2. Use the Release configuration for production builds.
3. Sign the application with an appropriate certificate for distribution.
4. Use ClickOnce or MSIX for easy deployment and updates.

## Integration with Excel Core

The `ExcelCore` project contains C++ implementations of performance-critical components:

- `CalculationEngine`: High-performance formula evaluation
- `ChartingEngine`: Efficient chart rendering
- `FormulaParser`: Fast parsing of complex formulas

These components are exposed through a C++ CLI wrapper (`ExcelCoreDLL`) for seamless integration with the C# codebase.

## Contributing

1. Create a new branch for each feature or bug fix.
2. Write clear, concise commit messages.
3. Submit a pull request for review before merging into the main branch.
4. Ensure all tests pass and no new warnings are introduced.
5. Update documentation, including this README, when making significant changes.

## Human Tasks

- [Required] Review and update the README content to ensure it accurately reflects the current state of the Excel desktop application project
- [Required] Add specific setup instructions for the development environment, including required software versions
- [Optional] Include troubleshooting section for common development and build issues

For any questions or issues, please contact the desktop development team.