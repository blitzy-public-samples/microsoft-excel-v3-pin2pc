package com.microsoft.excelmobile.models

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import com.microsoft.excelmobile.constants.AppConstants.CHART_TYPES

/**
 * Represents a chart in the Excel mobile application
 */
@Parcelize
data class Chart(
    val id: String,
    val type: CHART_TYPES,
    val title: String,
    val labels: List<String>,
    val datasets: List<Dataset>
) : Parcelable

/**
 * Represents a dataset within a chart
 */
@Parcelize
data class Dataset(
    val label: String,
    val data: List<Double>
) : Parcelable

// TODO: Implement chart rendering logic in a separate ChartRenderer class
// TODO: Add methods for updating chart data dynamically
// TODO: Implement data validation for chart creation and updates