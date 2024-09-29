#pragma once

#ifndef EXCELCORE_DLL_H
#define EXCELCORE_DLL_H

#include <string>
#include <vector>

// Define EXCELCORE_API for DLL export
#ifdef _WIN32
    #ifdef EXCELCORE_EXPORTS
        #define EXCELCORE_API __declspec(dllexport)
    #else
        #define EXCELCORE_API __declspec(dllimport)
    #endif
#else
    #define EXCELCORE_API
#endif

extern "C" {

// Function to create a new workbook
EXCELCORE_API int CreateWorkbook(const char* name);

// Function to add a new worksheet to a workbook
EXCELCORE_API int AddWorksheet(int workbookHandle, const char* name);

// Function to set the value of a cell
EXCELCORE_API bool SetCellValue(int workbookHandle, int worksheetIndex, const char* cellAddress, const char* value);

// Function to get the value of a cell
EXCELCORE_API bool GetCellValue(int workbookHandle, int worksheetIndex, const char* cellAddress, char* buffer, int bufferSize);

// Function to set a formula for a cell
EXCELCORE_API bool SetCellFormula(int workbookHandle, int worksheetIndex, const char* cellAddress, const char* formula);

// Function to recalculate all formulas in a workbook
EXCELCORE_API bool CalculateWorkbook(int workbookHandle);

} // extern "C"

// TODO: Implement error handling and logging mechanism for the DLL interface
// TODO: Add functions for chart creation and manipulation
// TODO: Implement memory management and resource cleanup functions
// TODO: Add support for multi-threading in calculation engine
// TODO: Implement functions for importing and exporting Excel file formats

#endif // EXCELCORE_DLL_H