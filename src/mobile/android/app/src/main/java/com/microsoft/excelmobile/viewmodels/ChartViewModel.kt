package com.microsoft.excelmobile.viewmodels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.microsoft.excelmobile.models.Chart
import com.microsoft.excelmobile.models.Dataset
import com.microsoft.excelmobile.constants.AppConstants.CHART_TYPES
import javax.inject.Inject

/**
 * ViewModel class for managing chart-related operations and state
 */
class ChartViewModel @Inject constructor() : ViewModel() {

    private val _currentChart = MutableLiveData<Chart>()
    val currentChart: LiveData<Chart> = _currentChart

    /**
     * Creates a new chart with the given parameters
     *
     * @param type The type of the chart
     * @param title The title of the chart
     * @param labels The labels for the chart data
     * @param datasets The datasets for the chart
     */
    fun createChart(type: CHART_TYPES, title: String, labels: List<String>, datasets: List<Dataset>) {
        // Generate a unique ID for the chart
        val chartId = generateUniqueChartId()

        // Create a new Chart instance with the provided parameters
        val newChart = Chart(
            id = chartId,
            type = type,
            title = title,
            labels = labels,
            datasets = datasets
        )

        // Update _currentChart with the new Chart instance
        _currentChart.value = newChart
    }

    /**
     * Updates the title of the current chart
     *
     * @param newTitle The new title for the chart
     */
    fun updateChartTitle(newTitle: String) {
        // Get the current Chart from _currentChart
        val currentChart = _currentChart.value ?: return

        // Create a new Chart instance with the updated title
        val updatedChart = currentChart.copy(title = newTitle)

        // Update _currentChart with the new Chart instance
        _currentChart.value = updatedChart
    }

    /**
     * Updates the data of the current chart
     *
     * @param newLabels The new labels for the chart data
     * @param newDatasets The new datasets for the chart
     */
    fun updateChartData(newLabels: List<String>, newDatasets: List<Dataset>) {
        // Get the current Chart from _currentChart
        val currentChart = _currentChart.value ?: return

        // Create a new Chart instance with the updated labels and datasets
        val updatedChart = currentChart.copy(
            labels = newLabels,
            datasets = newDatasets
        )

        // Update _currentChart with the new Chart instance
        _currentChart.value = updatedChart
    }

    /**
     * Changes the type of the current chart
     *
     * @param newType The new type for the chart
     */
    fun changeChartType(newType: CHART_TYPES) {
        // Get the current Chart from _currentChart
        val currentChart = _currentChart.value ?: return

        // Create a new Chart instance with the updated type
        val updatedChart = currentChart.copy(type = newType)

        // Update _currentChart with the new Chart instance
        _currentChart.value = updatedChart
    }

    /**
     * Generates a unique ID for a new chart
     *
     * @return A unique string ID for the chart
     */
    private fun generateUniqueChartId(): String {
        // Implement a method to generate a unique ID, e.g., using UUID
        return "chart_${System.currentTimeMillis()}"
    }

    // TODO: Implement data validation logic for chart creation and updates
    // TODO: Add error handling and logging for chart operations
    // TODO: Implement unit tests for ChartViewModel
    // TODO: Optimize chart data updates for large datasets
}