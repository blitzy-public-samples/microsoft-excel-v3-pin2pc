package com.microsoft.excelmobile.utils

import androidx.compose.material.MaterialTheme
import androidx.compose.ui.graphics.Color

/**
 * Singleton class responsible for managing and applying themes in the Excel Mobile Android app
 */
object ThemeManager {
    // Global color constants
    val ExcelGreen = Color(0xFF217346)
    val MicrosoftBlue = Color(0xFF0078D4)

    // Current theme
    private var currentTheme: Theme = Theme.LightTheme

    /**
     * Sets the current theme for the application
     *
     * @param theme The theme to be set
     */
    fun setTheme(theme: Theme) {
        currentTheme = theme
        // TODO: Implement logic to notify observers about the theme change
    }

    /**
     * Gets the current theme of the application
     *
     * @return The current theme
     */
    fun getTheme(): Theme = currentTheme

    /**
     * Applies the current theme to the provided Composable content
     *
     * @param content The Composable content to be themed
     * @return Themed Composable content
     */
    @Composable
    fun applyTheme(content: @Composable () -> Unit) {
        MaterialTheme(
            colors = currentTheme.colors,
            typography = currentTheme.typography,
            shapes = currentTheme.shapes
        ) {
            content()
        }
    }
}

/**
 * Sealed class representing different themes available in the app
 */
sealed class Theme(
    val colors: Colors,
    val typography: Typography,
    val shapes: Shapes
) {
    /**
     * Object representing the light theme
     */
    object LightTheme : Theme(
        colors = lightColors(
            primary = ThemeManager.ExcelGreen,
            secondary = ThemeManager.MicrosoftBlue,
            // Define other colors for light theme
        ),
        typography = Typography(
            // Define typography for light theme
        ),
        shapes = Shapes(
            // Define shapes for light theme
        )
    )

    /**
     * Object representing the dark theme
     */
    object DarkTheme : Theme(
        colors = darkColors(
            primary = ThemeManager.ExcelGreen,
            secondary = ThemeManager.MicrosoftBlue,
            // Define other colors for dark theme
        ),
        typography = Typography(
            // Define typography for dark theme
        ),
        shapes = Shapes(
            // Define shapes for dark theme
        )
    )
}

// TODO: Implement accessibility features such as high contrast themes
// TODO: Add support for custom themes or brand-specific themes