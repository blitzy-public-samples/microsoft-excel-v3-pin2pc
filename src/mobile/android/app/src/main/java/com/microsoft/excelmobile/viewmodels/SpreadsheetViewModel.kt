package com.microsoft.excelmobile.viewmodels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.microsoft.excelmobile.models.Workbook
import com.microsoft.excelmobile.models.Worksheet
import com.microsoft.excelmobile.models.Cell
import com.microsoft.excelmobile.services.CalculationEngine
import com.microsoft.excelmobile.services.DataSyncService
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for managing spreadsheet data and operations in the Excel mobile Android application.
 * This class serves as the main ViewModel for the spreadsheet functionality, managing the state
 * of the current workbook, handling user interactions, and coordinating with various services
 * for calculations and data synchronization.
 */
class SpreadsheetViewModel @Inject constructor(
    private val calculationEngine: CalculationEngine,
    private val dataSyncService: DataSyncService
) : ViewModel() {

    private val _currentWorkbook = MutableLiveData<Workbook>()
    val currentWorkbook: LiveData<Workbook> = _currentWorkbook

    private val _currentWorksheet = MutableLiveData<Worksheet>()
    val currentWorksheet: LiveData<Worksheet> = _currentWorksheet

    private val _selectedCell = MutableLiveData<Cell>()
    val selectedCell: LiveData<Cell> = _selectedCell

    /**
     * Loads a workbook by its ID.
     * @param workbookId The ID of the workbook to load.
     */
    fun loadWorkbook(workbookId: String) {
        viewModelScope.launch {
            try {
                val workbook = dataSyncService.fetchWorkbook(workbookId)
                _currentWorkbook.value = workbook
                workbook.worksheets.firstOrNull()?.let { setCurrentWorksheet(it) }
                calculateWorkbook()
            } catch (e: Exception) {
                // TODO: Handle error and provide user feedback
            }
        }
    }

    /**
     * Switches to a different worksheet in the current workbook.
     * @param worksheetId The ID of the worksheet to switch to.
     */
    fun switchWorksheet(worksheetId: String) {
        _currentWorkbook.value?.worksheets?.find { it.id == worksheetId }?.let { worksheet ->
            setCurrentWorksheet(worksheet)
        }
    }

    /**
     * Updates the value of a cell and recalculates dependent cells.
     * @param cellAddress The address of the cell to update.
     * @param newValue The new value for the cell.
     */
    fun updateCell(cellAddress: String, newValue: Any) {
        viewModelScope.launch {
            try {
                val worksheet = _currentWorksheet.value ?: return@launch
                worksheet.updateCell(cellAddress, newValue)
                val updatedWorksheet = calculationEngine.recalculateDependentCells(worksheet, cellAddress)
                setCurrentWorksheet(updatedWorksheet)
                syncData()
            } catch (e: Exception) {
                // TODO: Handle error and provide user feedback
            }
        }
    }

    /**
     * Selects a cell in the current worksheet.
     * @param cellAddress The address of the cell to select.
     */
    fun selectCell(cellAddress: String) {
        _currentWorksheet.value?.getCell(cellAddress)?.let { cell ->
            _selectedCell.value = cell
        }
    }

    /**
     * Triggers a full calculation of the current workbook.
     */
    fun calculateWorkbook() {
        viewModelScope.launch {
            try {
                val workbook = _currentWorkbook.value ?: return@launch
                val calculatedWorkbook = calculationEngine.calculateWorkbook(workbook)
                _currentWorkbook.value = calculatedWorkbook
                calculatedWorkbook.worksheets.find { it.id == _currentWorksheet.value?.id }?.let { setCurrentWorksheet(it) }
                syncData()
            } catch (e: Exception) {
                // TODO: Handle error and provide user feedback
            }
        }
    }

    /**
     * Synchronizes the current workbook data with the server.
     */
    private fun syncData() {
        viewModelScope.launch {
            try {
                val workbook = _currentWorkbook.value ?: return@launch
                val syncedWorkbook = dataSyncService.syncWorkbook(workbook)
                _currentWorkbook.value = syncedWorkbook
                syncedWorkbook.worksheets.find { it.id == _currentWorksheet.value?.id }?.let { setCurrentWorksheet(it) }
            } catch (e: Exception) {
                // TODO: Handle error and provide user feedback
            }
        }
    }

    /**
     * Adds a new worksheet to the current workbook.
     * @param worksheetName The name of the new worksheet.
     */
    fun addWorksheet(worksheetName: String) {
        viewModelScope.launch {
            try {
                val workbook = _currentWorkbook.value ?: return@launch
                val newWorksheet = Worksheet(name = worksheetName)
                workbook.addWorksheet(newWorksheet)
                _currentWorkbook.value = workbook
                setCurrentWorksheet(newWorksheet)
                syncData()
            } catch (e: Exception) {
                // TODO: Handle error and provide user feedback
            }
        }
    }

    /**
     * Removes a worksheet from the current workbook.
     * @param worksheetId The ID of the worksheet to remove.
     */
    fun removeWorksheet(worksheetId: String) {
        viewModelScope.launch {
            try {
                val workbook = _currentWorkbook.value ?: return@launch
                workbook.removeWorksheet(worksheetId)
                _currentWorkbook.value = workbook
                if (_currentWorksheet.value?.id == worksheetId) {
                    workbook.worksheets.firstOrNull()?.let { setCurrentWorksheet(it) }
                }
                syncData()
            } catch (e: Exception) {
                // TODO: Handle error and provide user feedback
            }
        }
    }

    private fun setCurrentWorksheet(worksheet: Worksheet) {
        _currentWorksheet.value = worksheet
        _selectedCell.value = null
    }
}

// TODO: Implement error handling and user feedback for failed operations
// TODO: Add support for undo/redo operations
// TODO: Implement caching mechanism for recently accessed cells and worksheets
// TODO: Add performance optimizations for large workbooks and worksheets
// TODO: Implement real-time collaboration features