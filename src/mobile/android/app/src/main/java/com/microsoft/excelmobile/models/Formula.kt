package com.microsoft.excelmobile.models

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

/**
 * Represents a formula in a cell of an Excel spreadsheet
 *
 * @property expression The string representation of the formula
 * @property result The result of the formula evaluation
 */
@Parcelize
data class Formula(
    val expression: String,
    val result: FormulaResult
) : Parcelable {

    /**
     * Returns a string representation of the Formula
     *
     * @return The expression of the Formula
     */
    override fun toString(): String = expression
}

/**
 * Represents the result of a formula evaluation
 * This is a placeholder class and should be replaced with the actual implementation
 */
@Parcelize
data class FormulaResult(
    val value: String // Placeholder, replace with appropriate type
) : Parcelable

// TODO: Implement unit tests for the Formula class
// TODO: Add documentation comments for the Formula class and its properties