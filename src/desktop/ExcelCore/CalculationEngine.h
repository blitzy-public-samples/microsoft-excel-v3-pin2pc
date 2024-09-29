#pragma once

#include <memory>
#include <unordered_map>
#include <functional>
#include <vector>
#include <string>

// Forward declarations
class Workbook;
class CellAddress;
class CellValue;

// Global constant
const double EPSILON = 1e-10;

class CalculationEngine {
public:
    // Constructor
    CalculationEngine();

    // Public methods
    void setWorkbook(std::shared_ptr<Workbook> workbook);
    CellValue evaluateFormula(const std::string& formula, const CellAddress& cellAddress);
    void updateCell(Cell& cell);
    void recalculateWorkbook();
    void addCustomFunction(const std::string& functionName, std::function<CellValue(const std::vector<CellValue>&)> function);

private:
    // Private member variables
    std::unordered_map<std::string, std::function<CellValue(const std::vector<CellValue>&)>> builtInFunctions;
    std::shared_ptr<Workbook> currentWorkbook;

    // Private helper methods
    void initializeBuiltInFunctions();
};

// TODO: Implement circular reference detection and resolution
// TODO: Add support for array formulas and dynamic arrays
// TODO: Implement multi-threaded calculation for large workbooks
// TODO: Add support for external data connections and real-time data