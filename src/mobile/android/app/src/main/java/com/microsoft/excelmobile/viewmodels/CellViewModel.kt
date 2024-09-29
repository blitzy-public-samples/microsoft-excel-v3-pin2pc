package com.microsoft.excelmobile.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.LiveData
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import com.microsoft.excelmobile.models.Cell
import com.microsoft.excelmobile.models.CellType
import com.microsoft.excelmobile.models.CellStyle
import com.microsoft.excelmobile.utils.DataValidator
import com.microsoft.excelmobile.services.ApiService

/**
 * ViewModel class for managing the state and behavior of a single cell in the Excel mobile Android application.
 *
 * @property initialCell The initial cell data.
 * @property apiService The API service for backend communication.
 */
class CellViewModel(
    initialCell: Cell,
    private val apiService: ApiService
) : ViewModel() {

    private val _cell = MutableLiveData<Cell>()
    val cell: LiveData<Cell> = _cell

    private val _isEditing = MutableLiveData<Boolean>()
    val isEditing: LiveData<Boolean> = _isEditing

    init {
        _cell.value = initialCell
        _isEditing.value = false
    }

    /**
     * Updates the cell value and syncs with the backend.
     *
     * @param newValue The new value for the cell.
     */
    fun updateCellValue(newValue: Any) {
        if (DataValidator.validateCellValue(newValue)) {
            val updatedCell = _cell.value?.copy(value = newValue)
            _cell.value = updatedCell
            syncWithBackend { apiService.updateCellValue(updatedCell?.id ?: "", newValue) }
        } else {
            // TODO: Handle invalid value error
        }
    }

    /**
     * Updates the cell formula and syncs with the backend.
     *
     * @param newFormula The new formula for the cell.
     */
    fun updateCellFormula(newFormula: String) {
        if (DataValidator.validateFormula(newFormula)) {
            val updatedCell = _cell.value?.copy(formula = newFormula)
            _cell.value = updatedCell
            syncWithBackend { apiService.updateCellFormula(updatedCell?.id ?: "", newFormula) }
        } else {
            // TODO: Handle invalid formula error
        }
    }

    /**
     * Updates the cell style and syncs with the backend.
     *
     * @param newStyle The new style for the cell.
     */
    fun updateCellStyle(newStyle: CellStyle) {
        val updatedCell = _cell.value?.copy(style = newStyle)
        _cell.value = updatedCell
        syncWithBackend { apiService.updateCellStyle(updatedCell?.id ?: "", newStyle) }
    }

    /**
     * Starts the cell editing mode.
     */
    fun startEditing() {
        _isEditing.value = true
    }

    /**
     * Stops the cell editing mode.
     */
    fun stopEditing() {
        _isEditing.value = false
    }

    /**
     * Syncs the cell data with the backend.
     *
     * @param apiCall The suspending function to call for API communication.
     */
    private fun syncWithBackend(apiCall: suspend () -> Unit) {
        viewModelScope.launch(Dispatchers.IO) {
            try {
                apiCall()
            } catch (e: Exception) {
                // TODO: Handle API error
            }
        }
    }
}

// TODO: Implement error handling and user feedback for API calls
// TODO: Add unit tests for CellViewModel
// TODO: Implement caching mechanism for offline support
// TODO: Optimize performance for large spreadsheets