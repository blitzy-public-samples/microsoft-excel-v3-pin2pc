using System;
using System.Collections.Generic;
using System.Linq;
using ExcelDesktop.Models;
using ExcelDesktop.Utils;

namespace ExcelDesktop.Services
{
    /// <summary>
    /// Implements the core calculation functionality for Excel
    /// </summary>
    public class CalculationEngine
    {
        private readonly Dictionary<string, Func<object[], object>> customFunctions;
        private readonly Dictionary<Cell, HashSet<Cell>> dependencyGraph;

        /// <summary>
        /// Initializes a new instance of the CalculationEngine class
        /// </summary>
        public CalculationEngine()
        {
            customFunctions = new Dictionary<string, Func<object[], object>>();
            dependencyGraph = new Dictionary<Cell, HashSet<Cell>>();
        }

        /// <summary>
        /// Calculates the result of a given formula in the context of a specific cell
        /// </summary>
        /// <param name="formula">The formula to calculate</param>
        /// <param name="cell">The cell context for the calculation</param>
        /// <returns>The calculated result of the formula</returns>
        public object Calculate(Formula formula, Cell cell)
        {
            try
            {
                // Parse the formula using FormulaParser
                var parsedFormula = FormulaParser.Parse(formula.Expression);

                // Evaluate the parsed formula in the context of the given cell
                var result = EvaluateFormula(parsedFormula, cell);

                // Handle any circular references or errors
                if (DetectCircularReference(cell))
                {
                    throw new InvalidOperationException("Circular reference detected");
                }

                return result;
            }
            catch (Exception ex)
            {
                // Log the error and return an error value
                Console.WriteLine($"Error calculating formula: {ex.Message}");
                return "#ERROR!";
            }
        }

        /// <summary>
        /// Updates the dependency tree when a cell's formula changes
        /// </summary>
        /// <param name="cell">The cell being updated</param>
        /// <param name="newFormula">The new formula for the cell</param>
        public void UpdateDependencies(Cell cell, Formula newFormula)
        {
            // Remove the cell from old dependencies in the dependencyGraph
            foreach (var dependentCell in dependencyGraph.Values)
            {
                dependentCell.Remove(cell);
            }

            // Parse the new formula to identify new dependencies
            var dependencies = FormulaParser.ExtractCellReferences(newFormula.Expression);

            // Add the cell to new dependencies in the dependencyGraph
            foreach (var dependency in dependencies)
            {
                if (!dependencyGraph.ContainsKey(dependency))
                {
                    dependencyGraph[dependency] = new HashSet<Cell>();
                }
                dependencyGraph[dependency].Add(cell);
            }

            // Trigger recalculation of dependent cells
            RecalculateDependentCells(cell);
        }

        /// <summary>
        /// Recalculates all formulas in a worksheet
        /// </summary>
        /// <param name="worksheet">The worksheet to recalculate</param>
        public void RecalculateWorksheet(Worksheet worksheet)
        {
            // Identify all cells with formulas in the worksheet
            var cellsWithFormulas = worksheet.Cells.Where(c => c.Formula != null).ToList();

            // Perform a topological sort on the cells based on their dependencies
            var sortedCells = TopologicalSort(cellsWithFormulas);

            // Recalculate each cell in the sorted order
            foreach (var cell in sortedCells)
            {
                cell.Value = Calculate(cell.Formula, cell);
            }

            // Update the worksheet with the new calculated values
            worksheet.UpdateCells(sortedCells);
        }

        /// <summary>
        /// Registers a custom function that can be used in formulas
        /// </summary>
        /// <param name="functionName">The name of the custom function</param>
        /// <param name="function">The function to register</param>
        public void RegisterCustomFunction(string functionName, Func<object[], object> function)
        {
            // Validate the function name
            if (string.IsNullOrWhiteSpace(functionName))
            {
                throw new ArgumentException("Function name cannot be empty", nameof(functionName));
            }

            // Add the custom function to the customFunctions dictionary
            customFunctions[functionName.ToUpper()] = function;
        }

        /// <summary>
        /// Evaluates a function with given arguments
        /// </summary>
        /// <param name="functionName">The name of the function to evaluate</param>
        /// <param name="args">The arguments for the function</param>
        /// <returns>The result of the function evaluation</returns>
        public object EvaluateFunction(string functionName, object[] args)
        {
            // Check if the function exists in built-in or custom functions
            if (customFunctions.TryGetValue(functionName.ToUpper(), out var customFunction))
            {
                return customFunction(args);
            }

            // If not found in custom functions, check built-in functions
            switch (functionName.ToUpper())
            {
                case "SUM":
                    return args.Sum(Convert.ToDouble);
                case "AVERAGE":
                    return args.Average(Convert.ToDouble);
                // Add more built-in functions as needed
                default:
                    throw new ArgumentException($"Unknown function: {functionName}");
            }
        }

        /// <summary>
        /// Detects if there's a circular reference in the formula dependencies
        /// </summary>
        /// <param name="startCell">The cell to start checking from</param>
        /// <returns>True if a circular reference is detected, false otherwise</returns>
        private bool DetectCircularReference(Cell startCell)
        {
            var visited = new HashSet<Cell>();
            var recursionStack = new HashSet<Cell>();

            bool HasCircularReference(Cell cell)
            {
                if (!visited.Contains(cell))
                {
                    visited.Add(cell);
                    recursionStack.Add(cell);

                    if (dependencyGraph.TryGetValue(cell, out var dependencies))
                    {
                        foreach (var dependency in dependencies)
                        {
                            if (!visited.Contains(dependency) && HasCircularReference(dependency))
                            {
                                return true;
                            }
                            else if (recursionStack.Contains(dependency))
                            {
                                return true;
                            }
                        }
                    }
                }

                recursionStack.Remove(cell);
                return false;
            }

            return HasCircularReference(startCell);
        }

        private object EvaluateFormula(object parsedFormula, Cell cell)
        {
            // This is a placeholder for the actual formula evaluation logic
            // You would need to implement a more sophisticated evaluation algorithm here
            // based on the parsed formula structure
            throw new NotImplementedException("Formula evaluation not implemented");
        }

        private void RecalculateDependentCells(Cell cell)
        {
            // Implement the logic to recalculate all cells that depend on the given cell
            throw new NotImplementedException("Dependent cell recalculation not implemented");
        }

        private List<Cell> TopologicalSort(List<Cell> cells)
        {
            // Implement a topological sort algorithm to order cells based on their dependencies
            throw new NotImplementedException("Topological sort not implemented");
        }
    }
}
```

This implementation of the CalculationEngine class provides the core functionality for Excel's calculation engine. It includes methods for calculating formulas, updating dependencies, recalculating worksheets, registering custom functions, and detecting circular references.

Note that some methods are marked as `NotImplementedException` as they require more complex logic that would depend on other parts of the system not provided in the current context. These methods should be implemented with the appropriate logic as the rest of the system is developed.

Human tasks that need to be addressed:

```csharp
// TODO: Implement error handling and logging throughout the CalculationEngine class
// TODO: Optimize the calculation engine for large worksheets with many formulas
// TODO: Implement caching mechanisms to improve performance for repeated calculations
// TODO: Add support for multi-threaded calculation for improved performance on multi-core systems
// TODO: Implement unit tests for all public methods of the CalculationEngine class