#include "FormulaParser.h"
#include "DataStructures.h"
#include <stack>
#include <sstream>
#include <cctype>
#include <cmath>
#include <algorithm>

FormulaParser::FormulaParser(std::shared_ptr<Workbook> workbook) : workbook(workbook) {
    // Initialize the workbook member variable with the provided workbook
    this->workbook = workbook;

    // Populate the functionMap with built-in Excel functions
    initializeFunctionMap();

    // Implement basic arithmetic operations (+, -, *, /, ^)
    initializeArithmeticOperations();
}

CellValue FormulaParser::parseFormula(const std::string& formula, const CellAddress& currentCell) {
    // Remove leading '=' if present
    std::string cleanFormula = formula;
    if (!cleanFormula.empty() && cleanFormula[0] == '=') {
        cleanFormula = cleanFormula.substr(1);
    }

    // Tokenize the formula string
    std::vector<std::string> tokens = tokenizeFormula(cleanFormula);

    // Convert infix notation to postfix notation using the Shunting Yard algorithm
    std::vector<std::string> postfixTokens = infixToPostfix(tokens);

    // Evaluate the postfix expression
    return evaluatePostfix(postfixTokens, currentCell);
}

void FormulaParser::registerFunction(const std::string& functionName, std::function<CellValue(const std::vector<CellValue>&)> function) {
    // Convert functionName to uppercase for case-insensitive matching
    std::string upperFunctionName = functionName;
    std::transform(upperFunctionName.begin(), upperFunctionName.end(), upperFunctionName.begin(), ::toupper);

    // Add the function to the functionMap with the given name
    functionMap[upperFunctionName] = function;
}

CellValue FormulaParser::evaluateCell(const CellAddress& cellAddress) {
    // Retrieve the cell from the workbook
    Cell* cell = workbook->getCell(cellAddress);

    if (cell == nullptr) {
        return CellValue(); // Return an empty CellValue if the cell doesn't exist
    }

    // If the cell has a formula, parse and evaluate it
    if (cell->hasFormula()) {
        CellValue result = parseFormula(cell->getFormula(), cellAddress);
        cell->setValue(result);
        return result;
    }

    // If the cell doesn't have a formula, return its current value
    return cell->getValue();
}

std::vector<std::string> FormulaParser::tokenizeFormula(const std::string& formula) {
    std::vector<std::string> tokens;
    std::string currentToken;
    bool inString = false;

    for (char c : formula) {
        if (c == '"') {
            inString = !inString;
            currentToken += c;
        } else if (inString) {
            currentToken += c;
        } else if (std::isspace(c)) {
            if (!currentToken.empty()) {
                tokens.push_back(currentToken);
                currentToken.clear();
            }
        } else if (std::isalnum(c) || c == '_' || c == '.') {
            currentToken += c;
        } else {
            if (!currentToken.empty()) {
                tokens.push_back(currentToken);
                currentToken.clear();
            }
            tokens.push_back(std::string(1, c));
        }
    }

    if (!currentToken.empty()) {
        tokens.push_back(currentToken);
    }

    return tokens;
}

std::vector<std::string> FormulaParser::infixToPostfix(const std::vector<std::string>& tokens) {
    std::vector<std::string> output;
    std::stack<std::string> operatorStack;

    for (const std::string& token : tokens) {
        if (isOperator(token)) {
            while (!operatorStack.empty() && isOperator(operatorStack.top()) &&
                   precedence(operatorStack.top()) >= precedence(token)) {
                output.push_back(operatorStack.top());
                operatorStack.pop();
            }
            operatorStack.push(token);
        } else if (token == "(") {
            operatorStack.push(token);
        } else if (token == ")") {
            while (!operatorStack.empty() && operatorStack.top() != "(") {
                output.push_back(operatorStack.top());
                operatorStack.pop();
            }
            if (!operatorStack.empty() && operatorStack.top() == "(") {
                operatorStack.pop();
            }
        } else {
            output.push_back(token);
        }
    }

    while (!operatorStack.empty()) {
        output.push_back(operatorStack.top());
        operatorStack.pop();
    }

    return output;
}

CellValue FormulaParser::evaluatePostfix(const std::vector<std::string>& postfixTokens, const CellAddress& currentCell) {
    std::stack<CellValue> operandStack;

    for (const std::string& token : postfixTokens) {
        if (isOperator(token)) {
            CellValue right = operandStack.top();
            operandStack.pop();
            CellValue left = operandStack.top();
            operandStack.pop();
            operandStack.push(applyOperator(token, left, right));
        } else if (isFunction(token)) {
            std::vector<CellValue> args;
            while (!operandStack.empty() && operandStack.top().getType() != CellValue::Type::Function) {
                args.insert(args.begin(), operandStack.top());
                operandStack.pop();
            }
            operandStack.push(applyFunction(token, args));
        } else if (isCellReference(token)) {
            CellAddress referencedCell = resolveCellReference(token, currentCell);
            operandStack.push(evaluateCell(referencedCell));
        } else {
            operandStack.push(parseLiteral(token));
        }
    }

    return operandStack.top();
}

void FormulaParser::initializeFunctionMap() {
    // Implement common Excel functions (SUM, AVERAGE, MIN, MAX, COUNT, IF, VLOOKUP, etc.)
    registerFunction("SUM", [](const std::vector<CellValue>& args) {
        double sum = 0;
        for (const auto& arg : args) {
            if (arg.getType() == CellValue::Type::Number) {
                sum += arg.getNumber();
            }
        }
        return CellValue(sum);
    });

    registerFunction("AVERAGE", [](const std::vector<CellValue>& args) {
        double sum = 0;
        int count = 0;
        for (const auto& arg : args) {
            if (arg.getType() == CellValue::Type::Number) {
                sum += arg.getNumber();
                count++;
            }
        }
        return count > 0 ? CellValue(sum / count) : CellValue();
    });

    // Add more functions here...
}

void FormulaParser::initializeArithmeticOperations() {
    // Implement basic arithmetic operations (+, -, *, /, ^)
    operatorMap["+"] = [](double a, double b) { return a + b; };
    operatorMap["-"] = [](double a, double b) { return a - b; };
    operatorMap["*"] = [](double a, double b) { return a * b; };
    operatorMap["/"] = [](double a, double b) { return b != 0 ? a / b : std::numeric_limits<double>::quiet_NaN(); };
    operatorMap["^"] = [](double a, double b) { return std::pow(a, b); };
}

bool FormulaParser::isOperator(const std::string& token) {
    return operatorMap.find(token) != operatorMap.end();
}

bool FormulaParser::isFunction(const std::string& token) {
    std::string upperToken = token;
    std::transform(upperToken.begin(), upperToken.end(), upperToken.begin(), ::toupper);
    return functionMap.find(upperToken) != functionMap.end();
}

bool FormulaParser::isCellReference(const std::string& token) {
    // Implement cell reference validation logic
    // This is a simplified check and should be expanded for full Excel cell reference support
    return std::regex_match(token, std::regex("^[A-Za-z]+[0-9]+$"));
}

CellValue FormulaParser::parseLiteral(const std::string& token) {
    // Implement literal parsing logic
    try {
        return CellValue(std::stod(token));
    } catch (const std::invalid_argument&) {
        return CellValue(token);
    }
}

CellValue FormulaParser::applyOperator(const std::string& op, const CellValue& left, const CellValue& right) {
    if (left.getType() == CellValue::Type::Number && right.getType() == CellValue::Type::Number) {
        auto it = operatorMap.find(op);
        if (it != operatorMap.end()) {
            return CellValue(it->second(left.getNumber(), right.getNumber()));
        }
    }
    return CellValue(); // Return empty CellValue for type mismatch or unknown operator
}

CellValue FormulaParser::applyFunction(const std::string& func, const std::vector<CellValue>& args) {
    std::string upperFunc = func;
    std::transform(upperFunc.begin(), upperFunc.end(), upperFunc.begin(), ::toupper);
    auto it = functionMap.find(upperFunc);
    if (it != functionMap.end()) {
        return it->second(args);
    }
    return CellValue(); // Return empty CellValue for unknown function
}

CellAddress FormulaParser::resolveCellReference(const std::string& ref, const CellAddress& currentCell) {
    // Implement cell reference resolution logic
    // This is a simplified implementation and should be expanded for full Excel cell reference support
    std::string colStr;
    int row = 0;
    for (char c : ref) {
        if (std::isalpha(c)) {
            colStr += c;
        } else if (std::isdigit(c)) {
            row = row * 10 + (c - '0');
        }
    }
    int col = 0;
    for (char c : colStr) {
        col = col * 26 + (std::toupper(c) - 'A' + 1);
    }
    return CellAddress(col - 1, row - 1);
}

int FormulaParser::precedence(const std::string& op) {
    if (op == "^") return 3;
    if (op == "*" || op == "/") return 2;
    if (op == "+" || op == "-") return 1;
    return 0;
}

// Human tasks (commented):
/*
TODO: Implement circular reference detection and handling
TODO: Add support for array formulas
TODO: Implement comprehensive error handling for formula parsing and evaluation
TODO: Optimize formula evaluation for large spreadsheets
TODO: Add support for external data sources in formulas
TODO: Implement caching mechanism for frequently used cell values and intermediate results
TODO: Add support for more advanced Excel functions (e.g., financial, statistical, and database functions)
TODO: Implement proper handling of date and time values in formulas
*/