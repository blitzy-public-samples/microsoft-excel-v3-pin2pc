// ExcelCoreDLL.cpp
// Implementation file for the Excel desktop application's C++ core library DLL

#include "ExcelCoreDLL.h"
#include "DataStructures.h"
#include "CalculationEngine.h"
#include <unordered_map>
#include <memory>
#include <stdexcept>

// Global variables
std::unordered_map<int, std::unique_ptr<Workbook>> g_workbooks;
int g_nextWorkbookHandle = 1;

// Helper function to get a workbook by handle
Workbook* GetWorkbook(int workbookHandle) {
    auto it = g_workbooks.find(workbookHandle);
    if (it == g_workbooks.end()) {
        throw std::runtime_error("Invalid workbook handle");
    }
    return it->second.get();
}

extern "C" {

EXCELCORE_API int CreateWorkbook(const char* name) {
    try {
        // Create a new Workbook object with the given name
        auto workbook = std::make_unique<Workbook>(name);
        
        // Generate a unique handle for the workbook
        int handle = g_nextWorkbookHandle++;
        
        // Store the Workbook object in the g_workbooks map using the handle as the key
        g_workbooks[handle] = std::move(workbook);
        
        // Return the handle
        return handle;
    } catch (const std::exception& e) {
        // Log the error (implement proper logging)
        std::cerr << "Error in CreateWorkbook: " << e.what() << std::endl;
        return -1;
    }
}

EXCELCORE_API int AddWorksheet(int workbookHandle, const char* name) {
    try {
        // Retrieve the Workbook object using the workbookHandle from g_workbooks
        Workbook* workbook = GetWorkbook(workbookHandle);
        
        // Call the addWorksheet method on the Workbook object with the given name
        int worksheetIndex = workbook->addWorksheet(name);
        
        // Return the index of the newly added worksheet
        return worksheetIndex;
    } catch (const std::exception& e) {
        // Log the error (implement proper logging)
        std::cerr << "Error in AddWorksheet: " << e.what() << std::endl;
        return -1;
    }
}

EXCELCORE_API bool SetCellValue(int workbookHandle, int worksheetIndex, const char* cellAddress, const char* value) {
    try {
        // Retrieve the Workbook object using the workbookHandle from g_workbooks
        Workbook* workbook = GetWorkbook(workbookHandle);
        
        // Get the Worksheet object at the specified worksheetIndex
        Worksheet* worksheet = workbook->getWorksheet(worksheetIndex);
        
        // Parse the cellAddress string to create a CellAddress object
        CellAddress address = CellAddress::fromString(cellAddress);
        
        // Create a CellValue object from the provided value string
        CellValue cellValue(value);
        
        // Set the cell value using the parsed address and created CellValue
        worksheet->setCellValue(address, cellValue);
        
        return true;
    } catch (const std::exception& e) {
        // Log the error (implement proper logging)
        std::cerr << "Error in SetCellValue: " << e.what() << std::endl;
        return false;
    }
}

EXCELCORE_API bool GetCellValue(int workbookHandle, int worksheetIndex, const char* cellAddress, char* buffer, int bufferSize) {
    try {
        // Retrieve the Workbook object using the workbookHandle from g_workbooks
        Workbook* workbook = GetWorkbook(workbookHandle);
        
        // Get the Worksheet object at the specified worksheetIndex
        Worksheet* worksheet = workbook->getWorksheet(worksheetIndex);
        
        // Parse the cellAddress string to create a CellAddress object
        CellAddress address = CellAddress::fromString(cellAddress);
        
        // Get the cell value using the parsed address
        CellValue cellValue = worksheet->getCellValue(address);
        
        // Convert the cell value to a string
        std::string valueStr = cellValue.toString();
        
        // Copy the string to the provided buffer, respecting the bufferSize
        strncpy(buffer, valueStr.c_str(), bufferSize - 1);
        buffer[bufferSize - 1] = '\0';
        
        return true;
    } catch (const std::exception& e) {
        // Log the error (implement proper logging)
        std::cerr << "Error in GetCellValue: " << e.what() << std::endl;
        return false;
    }
}

EXCELCORE_API bool SetCellFormula(int workbookHandle, int worksheetIndex, const char* cellAddress, const char* formula) {
    try {
        // Retrieve the Workbook object using the workbookHandle from g_workbooks
        Workbook* workbook = GetWorkbook(workbookHandle);
        
        // Get the Worksheet object at the specified worksheetIndex
        Worksheet* worksheet = workbook->getWorksheet(worksheetIndex);
        
        // Parse the cellAddress string to create a CellAddress object
        CellAddress address = CellAddress::fromString(cellAddress);
        
        // Set the cell formula using the parsed address and provided formula
        worksheet->setCellFormula(address, formula);
        
        return true;
    } catch (const std::exception& e) {
        // Log the error (implement proper logging)
        std::cerr << "Error in SetCellFormula: " << e.what() << std::endl;
        return false;
    }
}

EXCELCORE_API bool CalculateWorkbook(int workbookHandle) {
    try {
        // Retrieve the Workbook object using the workbookHandle from g_workbooks
        Workbook* workbook = GetWorkbook(workbookHandle);
        
        // Create a CalculationEngine object
        CalculationEngine calcEngine;
        
        // Call the calculate method of the CalculationEngine, passing the Workbook object
        bool success = calcEngine.calculate(*workbook);
        
        return success;
    } catch (const std::exception& e) {
        // Log the error (implement proper logging)
        std::cerr << "Error in CalculateWorkbook: " << e.what() << std::endl;
        return false;
    }
}

} // extern "C"

// TODO: Implement proper error handling and logging for all functions
// TODO: Add support for multi-threading in the CalculateWorkbook function
// TODO: Implement memory management and resource cleanup functions
// TODO: Add functions for chart creation and manipulation
// TODO: Implement functions for importing and exporting Excel file formats
// TODO: Optimize performance for large workbooks and complex calculations