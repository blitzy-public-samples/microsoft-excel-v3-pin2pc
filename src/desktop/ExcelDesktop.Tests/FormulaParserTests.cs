using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using ExcelDesktop.Utils;
using ExcelDesktop.Models;
using ExcelDesktop.Interfaces;

namespace ExcelDesktop.Tests
{
    [TestClass]
    public class FormulaParserTests
    {
        private Mock<ICalculationEngine> mockCalculationEngine;
        private FormulaParser formulaParser;

        [TestInitialize]
        public void TestInitialize()
        {
            // Initialize mockCalculationEngine
            mockCalculationEngine = new Mock<ICalculationEngine>();

            // Create a new instance of FormulaParser with the mock calculation engine
            formulaParser = new FormulaParser(mockCalculationEngine.Object);
        }

        [TestMethod]
        public void TestTokenize()
        {
            // Create a test formula string
            string formula = "=SUM(A1:A5) + 10 * B2";

            // Call the Tokenize method
            var tokens = formulaParser.Tokenize(formula);

            // Assert that the returned tokens are correct
            Assert.AreEqual(9, tokens.Count);
            Assert.AreEqual("SUM", tokens[1]);
            Assert.AreEqual("A1:A5", tokens[2]);
            Assert.AreEqual("+", tokens[4]);
            Assert.AreEqual("10", tokens[5]);
            Assert.AreEqual("*", tokens[6]);
            Assert.AreEqual("B2", tokens[7]);
        }

        [TestMethod]
        public void TestParse()
        {
            // Create a list of tokens
            var tokens = new List<string> { "=", "SUM", "(", "A1:A5", ")", "+", "10", "*", "B2" };

            // Call the Parse method
            var formulaNode = formulaParser.Parse(tokens);

            // Assert that the returned FormulaNode tree is correct
            Assert.IsNotNull(formulaNode);
            Assert.AreEqual("+", formulaNode.Value);
            Assert.AreEqual(2, formulaNode.Children.Count);

            var sumNode = formulaNode.Children[0];
            Assert.AreEqual("SUM", sumNode.Value);
            Assert.AreEqual(1, sumNode.Children.Count);
            Assert.AreEqual("A1:A5", sumNode.Children[0].Value);

            var multiplyNode = formulaNode.Children[1];
            Assert.AreEqual("*", multiplyNode.Value);
            Assert.AreEqual(2, multiplyNode.Children.Count);
            Assert.AreEqual("10", multiplyNode.Children[0].Value);
            Assert.AreEqual("B2", multiplyNode.Children[1].Value);
        }

        [TestMethod]
        public void TestEvaluate()
        {
            // Create a mock FormulaNode tree
            var formulaNode = new FormulaNode
            {
                Value = "+",
                Children = new List<FormulaNode>
                {
                    new FormulaNode { Value = "SUM", Children = new List<FormulaNode> { new FormulaNode { Value = "A1:A5" } } },
                    new FormulaNode
                    {
                        Value = "*",
                        Children = new List<FormulaNode>
                        {
                            new FormulaNode { Value = "10" },
                            new FormulaNode { Value = "B2" }
                        }
                    }
                }
            };

            // Set up mock CalculationEngine expectations
            mockCalculationEngine.Setup(m => m.EvaluateFunction("SUM", It.IsAny<List<object>>())).Returns(15);
            mockCalculationEngine.Setup(m => m.GetCellValue("B2")).Returns(5);

            // Call the Evaluate method
            var result = formulaParser.Evaluate(formulaNode);

            // Assert that the returned result is correct
            Assert.AreEqual(65, result);
        }

        [TestMethod]
        public void TestParseAndEvaluate()
        {
            // Create a test formula string
            string formula = "=SUM(A1:A5) + 10 * B2";

            // Set up mock CalculationEngine expectations
            mockCalculationEngine.Setup(m => m.EvaluateFunction("SUM", It.IsAny<List<object>>())).Returns(15);
            mockCalculationEngine.Setup(m => m.GetCellValue("B2")).Returns(5);

            // Call the ParseAndEvaluate method
            var result = formulaParser.ParseAndEvaluate(formula);

            // Assert that the returned result is correct
            Assert.AreEqual(65, result);
        }

        [TestMethod]
        public void TestComplexFormula()
        {
            // Create a complex test formula string
            string formula = "=IF(A1>10, SUM(B1:B5), AVERAGE(C1:C5)) * 2 + D1";

            // Set up mock CalculationEngine expectations for cell references and functions
            mockCalculationEngine.Setup(m => m.GetCellValue("A1")).Returns(15);
            mockCalculationEngine.Setup(m => m.EvaluateFunction("SUM", It.IsAny<List<object>>())).Returns(50);
            mockCalculationEngine.Setup(m => m.GetCellValue("D1")).Returns(5);

            // Call the ParseAndEvaluate method
            var result = formulaParser.ParseAndEvaluate(formula);

            // Assert that the returned result is correct
            Assert.AreEqual(105, result);
        }

        [TestMethod]
        public void TestErrorHandling()
        {
            // Create test cases with invalid formulas
            var invalidFormulas = new List<string>
            {
                "=SUM(A1:A5",
                "=10 + * 5",
                "=INVALID_FUNCTION(A1)",
                "=A1:A5",
                "=10 / 0"
            };

            foreach (var invalidFormula in invalidFormulas)
            {
                try
                {
                    formulaParser.ParseAndEvaluate(invalidFormula);
                    Assert.Fail($"Expected an exception for formula: {invalidFormula}");
                }
                catch (Exception ex)
                {
                    Assert.IsTrue(ex is FormulaParseException || ex is FormulaEvaluationException, 
                        $"Unexpected exception type for formula: {invalidFormula}");
                }
            }
        }
    }
}