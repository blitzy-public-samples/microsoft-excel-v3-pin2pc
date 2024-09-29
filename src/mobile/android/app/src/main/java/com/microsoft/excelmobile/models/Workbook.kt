package com.microsoft.excelmobile.models

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

/**
 * Represents an Excel workbook in the mobile application
 */
@Parcelize
data class Workbook(
    val id: String,
    val name: String,
    val worksheets: List<Worksheet>,
    val author: String,
    val lastModified: Long
) : Parcelable {

    /**
     * Retrieves a worksheet by its index
     *
     * @param index The index of the worksheet to retrieve
     * @return The worksheet at the given index, or null if not found
     */
    fun getWorksheet(index: Int): Worksheet? {
        return worksheets.getOrNull(index)
    }

    /**
     * Adds a new worksheet to the workbook
     *
     * @param worksheet The worksheet to add
     */
    fun addWorksheet(worksheet: Worksheet) {
        (worksheets as? MutableList)?.add(worksheet)
        updateLastModified()
    }

    /**
     * Removes a worksheet from the workbook
     *
     * @param worksheetId The ID of the worksheet to remove
     * @return True if the worksheet was removed, false if not found
     */
    fun removeWorksheet(worksheetId: String): Boolean {
        val removed = (worksheets as? MutableList)?.removeIf { it.id == worksheetId } ?: false
        if (removed) {
            updateLastModified()
        }
        return removed
    }

    /**
     * Updates the last modified timestamp of the workbook
     */
    private fun updateLastModified() {
        // In a real implementation, this would update the lastModified property
        // However, since the property is val, we can't modify it here
        // This is a limitation of the current data class design
        // TODO: Consider making lastModified a var or using a mutable state holder
    }

    companion object {
        // Add any companion object members here if needed
    }
}

// TODO: Implement Worksheet data class
data class Worksheet(
    val id: String,
    // Add other properties as needed
)

// Human tasks (to be implemented):
// TODO: Implement custom Parcelable serialization if needed for complex properties
// TODO: Add methods for workbook-level operations (e.g., save, load, export)
// TODO: Implement version control or change tracking mechanism
// TODO: Add validation for workbook name and maximum number of worksheets
// TODO: Implement workbook-level formula calculation logic