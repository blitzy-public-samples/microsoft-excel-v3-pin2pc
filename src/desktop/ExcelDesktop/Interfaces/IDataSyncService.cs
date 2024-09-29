using System;
using System.Threading.Tasks;

namespace ExcelDesktop.Interfaces
{
    /// <summary>
    /// Interface defining the contract for the Excel data synchronization service
    /// </summary>
    public interface IDataSyncService
    {
        /// <summary>
        /// Synchronizes the entire workbook with the cloud storage
        /// </summary>
        /// <param name="workbook">The workbook to be synchronized</param>
        /// <returns>A task that represents the asynchronous operation, returning true if sync was successful</returns>
        Task<bool> SyncWorkbook(Workbook workbook);

        /// <summary>
        /// Synchronizes a specific worksheet with the cloud storage
        /// </summary>
        /// <param name="worksheet">The worksheet to be synchronized</param>
        /// <returns>A task that represents the asynchronous operation, returning true if sync was successful</returns>
        Task<bool> SyncWorksheet(Worksheet worksheet);

        /// <summary>
        /// Synchronizes a specific cell with the cloud storage
        /// </summary>
        /// <param name="cell">The cell to be synchronized</param>
        /// <returns>A task that represents the asynchronous operation, returning true if sync was successful</returns>
        Task<bool> SyncCell(Cell cell);

        /// <summary>
        /// Enables automatic synchronization at specified intervals
        /// </summary>
        /// <param name="interval">The time interval for automatic synchronization</param>
        void EnableAutoSync(TimeSpan interval);

        /// <summary>
        /// Disables automatic synchronization
        /// </summary>
        void DisableAutoSync();

        /// <summary>
        /// Retrieves the current synchronization status
        /// </summary>
        /// <returns>A task that represents the asynchronous operation, returning the current sync status</returns>
        Task<SyncStatus> GetSyncStatus();

        /// <summary>
        /// Resolves a synchronization conflict
        /// </summary>
        /// <param name="conflict">The conflict to be resolved</param>
        /// <param name="strategy">The strategy to use for conflict resolution</param>
        /// <returns>A task that represents the asynchronous operation, returning true if the conflict was resolved successfully</returns>
        Task<bool> ResolveConflict(SyncConflict conflict, ConflictResolutionStrategy strategy);
    }

    // TODO: Define the SyncStatus class/structure
    public class SyncStatus
    {
        // Add properties to represent the current sync status and pending changes
    }

    // TODO: Define the SyncConflict class/structure
    public class SyncConflict
    {
        // Add properties to represent the conflicting data and metadata
    }

    // TODO: Implement the ConflictResolutionStrategy enum
    public enum ConflictResolutionStrategy
    {
        // Add enum values for different conflict resolution strategies
    }
}