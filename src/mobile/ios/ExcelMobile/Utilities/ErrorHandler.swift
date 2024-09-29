import Foundation

/// A singleton class responsible for handling and logging errors in the Excel Mobile iOS application.
class ErrorHandler {
    /// The shared instance of ErrorHandler
    static let shared = ErrorHandler()
    
    /// The last error message
    private(set) var lastError: String = ""
    
    /// Private initializer to ensure singleton pattern
    private init() {}
    
    /// Handles an error by logging it and optionally displaying it to the user
    /// - Parameters:
    ///   - error: The error to be handled
    ///   - displayToUser: A boolean indicating whether to display the error to the user
    func handleError(_ error: Error, displayToUser: Bool = false) {
        // Log the error message and stack trace
        let errorMessage = error.localizedDescription
        let stackTrace = Thread.callStackSymbols.joined(separator: "\n")
        NSLog("Error: \(errorMessage)\nStack Trace:\n\(stackTrace)")
        
        // Store the error message in lastError
        lastError = errorMessage
        
        // If displayToUser is true, show an alert to the user with the error message
        if displayToUser {
            DispatchQueue.main.async {
                let alert = UIAlertController(title: "Error", message: errorMessage, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                
                if let topViewController = UIApplication.shared.windows.first?.rootViewController {
                    topViewController.present(alert, animated: true, completion: nil)
                }
            }
        }
    }
    
    /// Handles a formula-specific error
    /// - Parameter result: The FormulaResult containing the error
    func handleFormulaError(_ result: FormulaResult) {
        // Check if the FormulaResult contains an error
        if case .error(let errorMessage) = result {
            // Call handleError with the formula error message
            handleError(NSError(domain: "FormulaError", code: 0, userInfo: [NSLocalizedDescriptionKey: errorMessage]))
        }
    }
    
    /// Clears the last stored error
    func clearLastError() {
        lastError = ""
    }
}

// MARK: - FormulaResult Enum

/// Represents the result of a formula calculation
enum FormulaResult {
    case success(Any)
    case error(String)
}

// MARK: - Human Tasks

/*
Human tasks:
1. Implement specific error codes and messages for different types of errors in the Excel Mobile application (Required)
2. Integrate with a crash reporting service like Crashlytics for better error tracking in production (Optional)
*/