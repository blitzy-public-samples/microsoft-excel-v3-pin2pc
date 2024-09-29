package com.microsoft.excelmobile.models

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Worksheet(
    val id: String,
    val name: String,
    val cells: Map<String, Cell>,
    val charts: List<Chart>
) : Parcelable {

    /**
     * Retrieves a cell by its address
     *
     * @param address The address of the cell to retrieve
     * @return The cell at the given address, or null if not found
     */
    fun getCell(address: String): Cell? {
        return cells[address]
    }

    /**
     * Sets or updates a cell in the worksheet
     *
     * @param cell The cell to be set or updated
     */
    fun setCell(cell: Cell) {
        // In a real implementation, this would modify the cells map
        // For now, we'll leave it as a comment due to the immutable nature of the data class
        // (cells as MutableMap)[cell.address] = cell
    }

    /**
     * Adds a new chart to the worksheet
     *
     * @param chart The chart to be added
     */
    fun addChart(chart: Chart) {
        // In a real implementation, this would modify the charts list
        // For now, we'll leave it as a comment due to the immutable nature of the data class
        // (charts as MutableList).add(chart)
    }

    /**
     * Removes a chart from the worksheet
     *
     * @param chartId The ID of the chart to be removed
     * @return True if the chart was removed, false if not found
     */
    fun removeChart(chartId: String): Boolean {
        // In a real implementation, this would modify the charts list
        // For now, we'll return false due to the immutable nature of the data class
        // return (charts as MutableList).removeAll { it.id == chartId }
        return false
    }
}

// TODO: Implement custom Parcelable serialization if needed for complex properties
// TODO: Add methods for bulk operations on cells (e.g., getCellRange, setCellRange)
// TODO: Implement worksheet-level formula calculation logic
// TODO: Add validation for worksheet name and maximum number of cells/charts