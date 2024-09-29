using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using ExcelDesktop.Models;
using ExcelDesktop.Interfaces;

namespace ExcelDesktop.Utils
{
    /// <summary>
    /// Implements a formula parser for Excel-like formulas, providing functionality to tokenize, parse, and evaluate formulas used in the Excel desktop application.
    /// </summary>
    public class FormulaParser
    {
        private readonly ICalculationEngine _calculationEngine;
        private readonly Dictionary<string, Func<object[], object>> BuiltInFunctions;

        /// <summary>
        /// Initializes a new instance of the FormulaParser class.
        /// </summary>
        /// <param name="calculationEngine">The calculation engine used for evaluating formulas.</param>
        public FormulaParser(ICalculationEngine calculationEngine)
        {
            _calculationEngine = calculationEngine ?? throw new ArgumentNullException(nameof(calculationEngine));
            BuiltInFunctions = InitializeBuiltInFunctions();
        }

        /// <summary>
        /// Initializes the dictionary of built-in Excel functions.
        /// </summary>
        /// <returns>A dictionary of built-in Excel functions.</returns>
        private Dictionary<string, Func<object[], object>> InitializeBuiltInFunctions()
        {
            return new Dictionary<string, Func<object[], object>>(StringComparer.OrdinalIgnoreCase)
            {
                { "SUM", args => args.Sum(Convert.ToDouble) },
                { "AVERAGE", args => args.Average(Convert.ToDouble) },
                { "MAX", args => args.Max(Convert.ToDouble) },
                { "MIN", args => args.Min(Convert.ToDouble) },
                // Add more built-in functions here
            };
        }

        /// <summary>
        /// Breaks down a formula string into individual tokens.
        /// </summary>
        /// <param name="formula">The formula string to tokenize.</param>
        /// <returns>A list of tokens extracted from the formula.</returns>
        public List<string> Tokenize(string formula)
        {
            if (string.IsNullOrWhiteSpace(formula))
                throw new ArgumentException("Formula cannot be null or empty.", nameof(formula));

            var tokens = new List<string>();
            var regex = new Regex(@"(\+|-|\*|/|\(|\)|\^|,|""[^""]*""|[A-Za-z]+\d+|\d+(\.\d+)?|[A-Za-z]+)");
            var matches = regex.Matches(formula);

            foreach (Match match in matches)
            {
                tokens.Add(match.Value);
            }

            return tokens;
        }

        /// <summary>
        /// Parses a tokenized formula into an abstract syntax tree.
        /// </summary>
        /// <param name="tokens">The list of tokens to parse.</param>
        /// <returns>The root node of the parsed formula tree.</returns>
        public FormulaNode Parse(List<string> tokens)
        {
            if (tokens == null || tokens.Count == 0)
                throw new ArgumentException("Tokens list cannot be null or empty.", nameof(tokens));

            var stack = new Stack<FormulaNode>();
            var operators = new Stack<string>();

            foreach (var token in tokens)
            {
                if (IsNumber(token))
                {
                    stack.Push(new FormulaNode(FormulaNodeType.Number, double.Parse(token)));
                }
                else if (IsString(token))
                {
                    stack.Push(new FormulaNode(FormulaNodeType.String, token.Trim('"')));
                }
                else if (IsCellReference(token))
                {
                    stack.Push(new FormulaNode(FormulaNodeType.CellReference, token));
                }
                else if (IsFunction(token))
                {
                    operators.Push(token);
                }
                else if (token == "(")
                {
                    operators.Push(token);
                }
                else if (token == ")")
                {
                    while (operators.Count > 0 && operators.Peek() != "(")
                    {
                        ProcessOperator(stack, operators.Pop());
                    }
                    operators.Pop(); // Remove the "("

                    if (operators.Count > 0 && IsFunction(operators.Peek()))
                    {
                        ProcessFunction(stack, operators.Pop());
                    }
                }
                else if (IsOperator(token))
                {
                    while (operators.Count > 0 && Precedence(operators.Peek()) >= Precedence(token))
                    {
                        ProcessOperator(stack, operators.Pop());
                    }
                    operators.Push(token);
                }
            }

            while (operators.Count > 0)
            {
                ProcessOperator(stack, operators.Pop());
            }

            return stack.Pop();
        }

        /// <summary>
        /// Evaluates a parsed formula tree in the context of a specific cell.
        /// </summary>
        /// <param name="root">The root node of the formula tree.</param>
        /// <param name="contextCell">The cell in which the formula is being evaluated.</param>
        /// <returns>The result of the formula evaluation.</returns>
        public object Evaluate(FormulaNode root, Cell contextCell)
        {
            if (root == null)
                throw new ArgumentNullException(nameof(root));

            switch (root.Type)
            {
                case FormulaNodeType.Number:
                case FormulaNodeType.String:
                    return root.Value;
                case FormulaNodeType.CellReference:
                    return _calculationEngine.GetCellValue((string)root.Value);
                case FormulaNodeType.Function:
                    var function = (string)root.Value;
                    var args = root.Children.Select(child => Evaluate(child, contextCell)).ToArray();
                    return BuiltInFunctions[function](args);
                case FormulaNodeType.Operator:
                    var left = Evaluate(root.Children[0], contextCell);
                    var right = Evaluate(root.Children[1], contextCell);
                    return ApplyOperator((string)root.Value, left, right);
                default:
                    throw new InvalidOperationException($"Unknown node type: {root.Type}");
            }
        }

        /// <summary>
        /// Parses and evaluates a formula string in one step.
        /// </summary>
        /// <param name="formula">The formula string to parse and evaluate.</param>
        /// <param name="contextCell">The cell in which the formula is being evaluated.</param>
        /// <returns>The result of the formula evaluation.</returns>
        public object ParseAndEvaluate(string formula, Cell contextCell)
        {
            var tokens = Tokenize(formula);
            var root = Parse(tokens);
            return Evaluate(root, contextCell);
        }

        // Helper methods

        private bool IsNumber(string token)
        {
            return double.TryParse(token, out _);
        }

        private bool IsString(string token)
        {
            return token.StartsWith("\"") && token.EndsWith("\"");
        }

        private bool IsCellReference(string token)
        {
            return Regex.IsMatch(token, @"^[A-Za-z]+\d+$");
        }

        private bool IsFunction(string token)
        {
            return BuiltInFunctions.ContainsKey(token);
        }

        private bool IsOperator(string token)
        {
            return "+-*/^".Contains(token);
        }

        private int Precedence(string op)
        {
            switch (op)
            {
                case "+":
                case "-":
                    return 1;
                case "*":
                case "/":
                    return 2;
                case "^":
                    return 3;
                default:
                    return 0;
            }
        }

        private void ProcessOperator(Stack<FormulaNode> stack, string op)
        {
            var right = stack.Pop();
            var left = stack.Pop();
            stack.Push(new FormulaNode(FormulaNodeType.Operator, op) { Children = new List<FormulaNode> { left, right } });
        }

        private void ProcessFunction(Stack<FormulaNode> stack, string function)
        {
            var args = new List<FormulaNode>();
            while (stack.Count > 0 && stack.Peek().Type != FormulaNodeType.Function)
            {
                args.Insert(0, stack.Pop());
            }
            stack.Push(new FormulaNode(FormulaNodeType.Function, function) { Children = args });
        }

        private object ApplyOperator(string op, object left, object right)
        {
            var l = Convert.ToDouble(left);
            var r = Convert.ToDouble(right);

            switch (op)
            {
                case "+": return l + r;
                case "-": return l - r;
                case "*": return l * r;
                case "/": return l / r;
                case "^": return Math.Pow(l, r);
                default: throw new InvalidOperationException($"Unknown operator: {op}");
            }
        }
    }

    /// <summary>
    /// Represents a node in the formula abstract syntax tree.
    /// </summary>
    public class FormulaNode
    {
        public FormulaNodeType Type { get; set; }
        public object Value { get; set; }
        public List<FormulaNode> Children { get; set; }

        public FormulaNode(FormulaNodeType type, object value)
        {
            Type = type;
            Value = value;
            Children = new List<FormulaNode>();
        }
    }

    /// <summary>
    /// Enum representing the types of nodes in a formula tree.
    /// </summary>
    public enum FormulaNodeType
    {
        Number,
        String,
        CellReference,
        Function,
        Operator
    }
}