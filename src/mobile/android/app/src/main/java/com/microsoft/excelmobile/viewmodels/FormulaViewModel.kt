package com.microsoft.excelmobile.viewmodels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.microsoft.excelmobile.models.Formula
import com.microsoft.excelmobile.models.FormulaResult
import com.microsoft.excelmobile.models.Workbook
import com.microsoft.excelmobile.services.CalculationEngine
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class FormulaViewModel(private val calculationEngine: CalculationEngine) : ViewModel() {

    private val _currentFormula = MutableLiveData<String>()
    val currentFormula: LiveData<String> = _currentFormula

    private val _formulaResult = MutableLiveData<FormulaResult>()
    val formulaResult: LiveData<FormulaResult> = _formulaResult

    private val _isCalculating = MutableLiveData<Boolean>(false)
    val isCalculating: LiveData<Boolean> = _isCalculating

    fun setFormula(formula: String) {
        _currentFormula.value = formula
        calculateFormula()
    }

    private fun calculateFormula() {
        _isCalculating.value = true
        viewModelScope.launch(Dispatchers.Default) {
            try {
                val result = calculationEngine.evaluateFormula(_currentFormula.value ?: "")
                _formulaResult.postValue(result)
            } catch (e: Exception) {
                // Handle any exceptions and update _formulaResult with an error if necessary
                _formulaResult.postValue(FormulaResult.Error(e.message ?: "An error occurred"))
            } finally {
                _isCalculating.postValue(false)
            }
        }
    }

    fun updateWorkbookState(workbook: Workbook) {
        calculationEngine.updateWorkbookState(workbook)
        _currentFormula.value?.let { calculateFormula() }
    }
}

// TODO: Implement caching mechanism for formula results to improve performance
// TODO: Add support for formula suggestions and auto-completion
// TODO: Implement error handling for network-related issues during formula calculation