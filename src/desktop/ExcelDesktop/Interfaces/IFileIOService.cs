using System;
using System.Threading.Tasks;
using ExcelDesktop.Models;

namespace ExcelDesktop.Interfaces
{
    /// <summary>
    /// Defines methods for reading, writing, and managing Excel workbook files.
    /// </summary>
    public interface IFileIOService
    {
        /// <summary>
        /// Asynchronously opens an Excel workbook file.
        /// </summary>
        /// <param name="filePath">The path to the Excel workbook file.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the opened Workbook object.</returns>
        Task<Workbook> OpenWorkbookAsync(string filePath);

        /// <summary>
        /// Asynchronously saves an Excel workbook to a file.
        /// </summary>
        /// <param name="workbook">The Workbook object to be saved.</param>
        /// <param name="filePath">The path where the workbook should be saved.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        Task SaveWorkbookAsync(Workbook workbook, string filePath);

        /// <summary>
        /// Asynchronously exports an Excel workbook to a PDF file.
        /// </summary>
        /// <param name="workbook">The Workbook object to be exported.</param>
        /// <param name="filePath">The path where the PDF file should be saved.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        Task ExportToPdfAsync(Workbook workbook, string filePath);

        /// <summary>
        /// Asynchronously imports data from a CSV file into a new workbook.
        /// </summary>
        /// <param name="filePath">The path to the CSV file to be imported.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the new Workbook object with imported data.</returns>
        Task<Workbook> ImportCsvAsync(string filePath);
    }
}

// TODO: Implement concrete classes that inherit from IFileIOService interface
// TODO: Add error handling and logging to the interface methods
// TODO: Consider adding methods for handling different file formats (e.g., .xlsx, .xls, .ods)