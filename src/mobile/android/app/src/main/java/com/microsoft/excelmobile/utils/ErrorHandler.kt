package com.microsoft.excelmobile.utils

import android.content.Context
import android.util.Log
import android.widget.Toast
import com.microsoft.excelmobile.ExcelApplication

/**
 * Singleton class for centralized error handling and logging in the Excel Mobile app
 */
class ErrorHandler private constructor(private val context: Context) {

    companion object {
        private var instance: ErrorHandler? = null

        /**
         * Get the singleton instance of ErrorHandler
         *
         * @param context The application context
         * @return The singleton instance of ErrorHandler
         */
        fun getInstance(context: Context): ErrorHandler {
            if (instance == null) {
                instance = ErrorHandler(context.applicationContext)
            }
            return instance!!
        }
    }

    /**
     * Log an error message
     *
     * @param tag The tag for the log message
     * @param message The error message
     * @param throwable The throwable associated with the error
     */
    fun logError(tag: String, message: String, throwable: Throwable) {
        Log.e(tag, message, throwable)
    }

    /**
     * Display an error message to the user via a Toast
     *
     * @param message The error message to display
     */
    fun showErrorToast(message: String) {
        Toast.makeText(context, message, Toast.LENGTH_LONG).show()
    }

    /**
     * Handle an exception by logging it and optionally showing a user-friendly message
     *
     * @param tag The tag for the log message
     * @param throwable The throwable to handle
     * @param showToast Whether to show a toast message to the user
     */
    fun handleException(tag: String, throwable: Throwable, showToast: Boolean) {
        logError(tag, throwable.message ?: "An error occurred", throwable)
        if (showToast) {
            showErrorToast("An unexpected error occurred. Please try again later.")
        }
    }
}