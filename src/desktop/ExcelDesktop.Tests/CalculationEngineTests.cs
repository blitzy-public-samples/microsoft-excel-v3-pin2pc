using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using ExcelDesktop.Services;
using ExcelDesktop.Interfaces;
using ExcelDesktop.Models;

namespace ExcelDesktop.Tests
{
    [TestClass]
    public class CalculationEngineTests
    {
        private ICalculationEngine calculationEngine;

        [TestInitialize]
        public void TestInitialize()
        {
            // Initialize a new instance of CalculationEngine
            calculationEngine = new CalculationEngine();
        }

        [TestMethod]
        public void TestCalculateSimpleFormula()
        {
            // Create a simple formula (e.g., '=1+2')
            string formula = "=1+2";
            Cell cell = new Cell { Address = "A1", Formula = new Formula { Expression = formula } };

            // Call calculationEngine.Calculate with the formula and cell
            var result = calculationEngine.Calculate(cell);

            // Assert that the result is correct (e.g., 3)
            Assert.AreEqual(3, result);
        }

        [TestMethod]
        public void TestCalculateComplexFormula()
        {
            // Create a complex formula (e.g., '=(2+3)*4-5/2')
            string formula = "=(2+3)*4-5/2";
            Cell cell = new Cell { Address = "B2", Formula = new Formula { Expression = formula } };

            // Call calculationEngine.Calculate with the formula and cell
            var result = calculationEngine.Calculate(cell);

            // Assert that the result is correct (e.g., 17.5)
            Assert.AreEqual(17.5, result);
        }

        [TestMethod]
        public void TestUpdateDependencies()
        {
            // Create multiple cells with interdependent formulas
            Cell cellA1 = new Cell { Address = "A1", Value = 1 };
            Cell cellA2 = new Cell { Address = "A2", Value = 2 };
            Cell cellA3 = new Cell { Address = "A3", Formula = new Formula { Expression = "=A1+A2" } };

            Worksheet worksheet = new Worksheet
            {
                Cells = new List<Cell> { cellA1, cellA2, cellA3 }
            };

            // Call calculationEngine.UpdateDependencies for one of the cells
            calculationEngine.UpdateDependencies(cellA1, worksheet);

            // Verify that the dependency graph is updated correctly
            // This is a simplified test, as we don't have access to the internal dependency graph
            // In a real scenario, we would need to expose some way to check the dependencies
            var result = calculationEngine.Calculate(cellA3);
            Assert.AreEqual(3, result);
        }

        [TestMethod]
        public void TestRecalculateWorksheet()
        {
            // Create a worksheet with multiple cells and formulas
            Worksheet worksheet = new Worksheet
            {
                Cells = new List<Cell>
                {
                    new Cell { Address = "A1", Value = 1 },
                    new Cell { Address = "A2", Value = 2 },
                    new Cell { Address = "A3", Formula = new Formula { Expression = "=A1+A2" } },
                    new Cell { Address = "B1", Formula = new Formula { Expression = "=A3*2" } }
                }
            };

            // Call calculationEngine.RecalculateWorksheet
            calculationEngine.RecalculateWorksheet(worksheet);

            // Verify that all cells are recalculated correctly
            Assert.AreEqual(3, worksheet.Cells.Find(c => c.Address == "A3").Value);
            Assert.AreEqual(6, worksheet.Cells.Find(c => c.Address == "B1").Value);
        }

        [TestMethod]
        public void TestRegisterCustomFunction()
        {
            // Define a custom function (e.g., 'DOUBLE' that multiplies a number by 2)
            Func<double, double> doubleFunction = x => x * 2;

            // Call calculationEngine.RegisterCustomFunction to register the custom function
            calculationEngine.RegisterCustomFunction("DOUBLE", doubleFunction);

            // Create a formula using the custom function (e.g., '=DOUBLE(3)')
            string formula = "=DOUBLE(3)";
            Cell cell = new Cell { Address = "C1", Formula = new Formula { Expression = formula } };

            // Call calculationEngine.Calculate with the formula
            var result = calculationEngine.Calculate(cell);

            // Assert that the result is correct (e.g., 6)
            Assert.AreEqual(6, result);
        }

        [TestMethod]
        [ExpectedException(typeof(CircularReferenceException))]
        public void TestCircularReferenceDetection()
        {
            // Create cells with circular references (e.g., A1 refers to B1, B1 refers to A1)
            Cell cellA1 = new Cell { Address = "A1", Formula = new Formula { Expression = "=B1" } };
            Cell cellB1 = new Cell { Address = "B1", Formula = new Formula { Expression = "=A1" } };

            Worksheet worksheet = new Worksheet
            {
                Cells = new List<Cell> { cellA1, cellB1 }
            };

            // Attempt to calculate the formula in one of the cells
            // This should throw a CircularReferenceException
            calculationEngine.Calculate(cellA1);
        }
    }

    // Custom exception for circular references
    public class CircularReferenceException : Exception
    {
        public CircularReferenceException(string message) : base(message) { }
    }
}
```

This implementation of CalculationEngineTests.cs includes all the test methods specified in the JSON representation. Here are some notes about the implementation:

1. We've added the necessary using statements for the required namespaces.
2. The `ICalculationEngine` interface is used to define the `calculationEngine` field, allowing for dependency injection and easier mocking in future tests.
3. Each test method follows the steps outlined in the JSON specification.
4. We've made some assumptions about the `CalculationEngine` class methods and their signatures, as we don't have the actual implementation. These may need to be adjusted once the `CalculationEngine` class is implemented.
5. For the `TestCircularReferenceDetection` method, we've added a custom `CircularReferenceException` class, as it wasn't specified in the original JSON but is necessary for the test.
6. Some tests, like `TestUpdateDependencies`, may need to be refined once we have more information about how the dependency graph is implemented and exposed in the `CalculationEngine` class.

Here are the pending human tasks as comments:

```csharp
// TODO: Implement additional test cases to cover edge cases and error scenarios
// TODO: Add performance tests for large worksheets with many formulas
// TODO: Create integration tests that cover the interaction between CalculationEngine and other components