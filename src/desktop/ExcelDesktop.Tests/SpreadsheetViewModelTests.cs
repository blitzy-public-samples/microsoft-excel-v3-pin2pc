using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Threading.Tasks;
using ExcelDesktop.ViewModels;
using ExcelDesktop.Models;
using ExcelDesktop.Interfaces;

namespace ExcelDesktop.Tests
{
    [TestClass]
    public class SpreadsheetViewModelTests
    {
        private Mock<ICalculationEngine> mockCalculationEngine;
        private Mock<IChartingEngine> mockChartingEngine;
        private Mock<IDataSyncService> mockDataSyncService;
        private SpreadsheetViewModel viewModel;

        [TestInitialize]
        public void TestInitialize()
        {
            // Initialize mock objects
            mockCalculationEngine = new Mock<ICalculationEngine>();
            mockChartingEngine = new Mock<IChartingEngine>();
            mockDataSyncService = new Mock<IDataSyncService>();

            // Create a new SpreadsheetViewModel with the mock dependencies
            viewModel = new SpreadsheetViewModel(
                mockCalculationEngine.Object,
                mockChartingEngine.Object,
                mockDataSyncService.Object
            );
        }

        [TestMethod]
        public void TestNewWorkbook()
        {
            // Act
            viewModel.NewWorkbook();

            // Assert
            Assert.IsNotNull(viewModel.CurrentWorkbook);
            Assert.IsTrue(viewModel.Worksheets.Count > 0);
            Assert.IsNotNull(viewModel.ActiveWorksheet);
            Assert.AreEqual(viewModel.Worksheets[0], viewModel.ActiveWorksheet);
            Assert.IsNull(viewModel.SelectedCell);
            Assert.AreEqual(string.Empty, viewModel.FormulaBarText);
        }

        [TestMethod]
        public async Task TestOpenWorkbook()
        {
            // Arrange
            string mockFilePath = "C:\\test\\workbook.xlsx";
            var mockWorkbook = new Workbook(); // Assume Workbook is a class in your Models
            mockDataSyncService.Setup(m => m.OpenWorkbook(mockFilePath)).ReturnsAsync(mockWorkbook);

            // Act
            await viewModel.OpenWorkbook(mockFilePath);

            // Assert
            Assert.IsNotNull(viewModel.CurrentWorkbook);
            Assert.IsTrue(viewModel.Worksheets.Count > 0);
            Assert.IsNotNull(viewModel.ActiveWorksheet);
            Assert.AreEqual(viewModel.Worksheets[0], viewModel.ActiveWorksheet);
            Assert.IsNull(viewModel.SelectedCell);
            Assert.AreEqual(string.Empty, viewModel.FormulaBarText);
            mockDataSyncService.Verify(m => m.OpenWorkbook(mockFilePath), Times.Once);
        }

        [TestMethod]
        public async Task TestSaveWorkbook()
        {
            // Arrange
            viewModel.CurrentWorkbook = new Workbook { FilePath = "C:\\test\\workbook.xlsx" };

            // Act
            await viewModel.SaveWorkbook();

            // Assert
            mockDataSyncService.Verify(m => m.SaveWorkbook(viewModel.CurrentWorkbook), Times.Once);
        }

        [TestMethod]
        public void TestAddWorksheet()
        {
            // Arrange
            int initialCount = viewModel.Worksheets.Count;

            // Act
            viewModel.AddWorksheet();

            // Assert
            Assert.AreEqual(initialCount + 1, viewModel.Worksheets.Count);
            Assert.AreEqual(viewModel.Worksheets[viewModel.Worksheets.Count - 1], viewModel.ActiveWorksheet);
        }

        [TestMethod]
        public void TestRemoveWorksheet()
        {
            // Arrange
            viewModel.AddWorksheet(); // Ensure there are at least two worksheets
            viewModel.AddWorksheet();
            int initialCount = viewModel.Worksheets.Count;
            var worksheetToRemove = viewModel.ActiveWorksheet;

            // Act
            viewModel.RemoveWorksheet();

            // Assert
            Assert.AreEqual(initialCount - 1, viewModel.Worksheets.Count);
            Assert.IsNotNull(viewModel.ActiveWorksheet);
            Assert.IsFalse(viewModel.Worksheets.Contains(worksheetToRemove));
        }

        [TestMethod]
        public void TestCreateChart()
        {
            // Arrange
            var mockSelectedRange = new Range(); // Assume Range is a class in your Models
            viewModel.SelectedRange = mockSelectedRange;

            // Act
            viewModel.CreateChart(ChartType.BarChart);

            // Assert
            mockChartingEngine.Verify(m => m.CreateChart(ChartType.BarChart, mockSelectedRange), Times.Once);
            Assert.IsTrue(viewModel.ActiveWorksheet.Charts.Count > 0);
        }

        [TestMethod]
        public async Task TestSyncData()
        {
            // Act
            await viewModel.SyncData();

            // Assert
            mockDataSyncService.Verify(m => m.SyncWorkbook(viewModel.CurrentWorkbook), Times.Once);
        }

        [TestMethod]
        public void TestUpdateCellValue()
        {
            // Arrange
            var mockCell = new Cell(); // Assume Cell is a class in your Models
            viewModel.SelectedCell = mockCell;

            // Act
            viewModel.UpdateCellValue("New Value");

            // Assert
            Assert.AreEqual("New Value", mockCell.Value);
            Assert.AreEqual("New Value", viewModel.FormulaBarText);

            // Verify calculation engine is called if the new value is a formula
            if (mockCell.Value.StartsWith("="))
            {
                mockCalculationEngine.Verify(m => m.Calculate(mockCell), Times.Once);
            }
        }

        [TestMethod]
        public void TestSelectCell()
        {
            // Arrange
            var mockCell = new Cell { Address = "A1", Value = "Test" };
            viewModel.ActiveWorksheet.Cells["A1"] = mockCell;

            // Act
            viewModel.SelectCell("A1");

            // Assert
            Assert.AreEqual(mockCell, viewModel.SelectedCell);
            Assert.AreEqual("Test", viewModel.FormulaBarText);
        }
    }

    // TODO: Implement tests for undo/redo functionality once it's added to SpreadsheetViewModel
    // TODO: Add tests for cell formatting commands when implemented in SpreadsheetViewModel
    // TODO: Create tests for data validation rules once implemented in SpreadsheetViewModel
    // TODO: Add tests for keyboard shortcuts when implemented
    // TODO: Implement tests for auto-save functionality once added to SpreadsheetViewModel
}