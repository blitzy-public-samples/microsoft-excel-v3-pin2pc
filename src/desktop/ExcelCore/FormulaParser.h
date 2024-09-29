#pragma once

#include <string>
#include <vector>
#include <unordered_map>
#include <memory>
#include <functional>

// Forward declarations
class Workbook;
class CellAddress;
class CellValue;

class FormulaParser {
public:
    // Constructor
    FormulaParser(std::shared_ptr<Workbook> workbook);

    // Public methods
    CellValue parseFormula(const std::string& formula, const CellAddress& currentCell);
    void registerFunction(const std::string& functionName, std::function<CellValue(const std::vector<CellValue>&)> function);
    CellValue evaluateCell(const CellAddress& cellAddress);

private:
    // Private member variables
    std::shared_ptr<Workbook> workbook;
    std::unordered_map<std::string, std::function<CellValue(const std::vector<CellValue>&)>> functionMap;

    // Private helper methods
    void populateFunctionMap();
    std::vector<std::string> tokenizeFormula(const std::string& formula);
    std::vector<std::string> convertToPostfix(const std::vector<std::string>& tokens);
    CellValue evaluatePostfix(const std::vector<std::string>& postfixExpression, const CellAddress& currentCell);
};

// TODO: Implement circular reference detection and handling
// TODO: Add support for array formulas
// TODO: Implement error handling for formula parsing and evaluation
// TODO: Optimize formula evaluation for large spreadsheets
// TODO: Add support for external data sources in formulas