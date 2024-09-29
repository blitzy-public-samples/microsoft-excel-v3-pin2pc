#pragma once

#include <cstdint>
#include <string>
#include <vector>
#include <unordered_map>
#include <chrono>
#include <variant>

namespace ExcelCore {

// Represents the address of a cell in a worksheet
class CellAddress {
public:
    uint32_t row;
    uint32_t column;

    std::string toString() const {
        // TODO: Implement conversion of column number to letter(s) and combine with row number
        return ""; // Placeholder
    }
};

// Enum to represent different cell types
enum class CellType {
    String,
    Number,
    Boolean,
    Date,
    Empty
};

// Represents the value stored in a cell, supporting various data types
class CellValue {
public:
    CellType getType() const {
        return type;
    }

    std::variant<std::string, double, bool, std::chrono::system_clock::time_point> getValue() const {
        return value;
    }

private:
    CellType type;
    std::variant<std::string, double, bool, std::chrono::system_clock::time_point> value;
};

// Represents a single cell in a worksheet
class Cell {
public:
    CellAddress address;
    CellValue value;
    std::string formula;

    void setFormula(const std::string& newFormula) {
        formula = newFormula;
    }

    void setValue(const CellValue& newValue) {
        value = newValue;
    }
};

// Represents a worksheet in a workbook
class Worksheet {
public:
    std::string name;
    std::unordered_map<CellAddress, Cell> cells;

    Cell& getCell(const CellAddress& address) {
        // TODO: Implement cell lookup and creation if it doesn't exist
        return cells[address]; // Placeholder
    }

    void setName(const std::string& newName) {
        name = newName;
    }
};

// Represents an Excel workbook containing multiple worksheets
class Workbook {
public:
    std::string name;
    std::vector<Worksheet> worksheets;

    Worksheet& addWorksheet(const std::string& name) {
        worksheets.emplace_back();
        worksheets.back().setName(name);
        return worksheets.back();
    }

    Worksheet& getWorksheet(size_t index) {
        if (index >= worksheets.size()) {
            throw std::out_of_range("Worksheet index out of range");
        }
        return worksheets[index];
    }
};

} // namespace ExcelCore

// TODO: Implement error handling for invalid cell addresses and out-of-range worksheet indices
// TODO: Add support for cell styles and formatting
// TODO: Implement memory management strategies for large workbooks