import Foundation
import Combine

// Import the necessary modules
import Cell
import CellStyle
import DataValidator

/// ViewModel for a single cell in the Excel mobile application
class CellViewModel: ObservableObject {
    /// The cell model that this view model represents
    @Published var cell: Cell
    
    /// The data validator used for validating cell input
    private let dataValidator: DataValidator
    
    /// Initializes a new CellViewModel instance
    /// - Parameters:
    ///   - cell: The cell model to be represented by this view model
    ///   - dataValidator: The data validator to be used for input validation
    init(cell: Cell, dataValidator: DataValidator) {
        self.cell = cell
        self.dataValidator = dataValidator
    }
    
    /// Updates the value of the cell
    /// - Parameter newValue: The new value to be set for the cell
    /// - Returns: True if the update was successful, false otherwise
    func updateValue(_ newValue: Any) -> Bool {
        // Validate the new value using the dataValidator
        guard dataValidator.isValid(newValue) else {
            return false
        }
        
        // Update the cell's value and type
        cell.value = newValue
        cell.type = type(of: newValue)
        
        // If the cell has a formula, clear it
        if cell.formula != nil {
            cell.formula = nil
        }
        
        // Return true to indicate successful update
        return true
    }
    
    /// Updates the formula of the cell
    /// - Parameter newFormula: The new formula to be set for the cell
    /// - Returns: True if the update was successful, false otherwise
    func updateFormula(_ newFormula: String) -> Bool {
        // Validate the new formula using the dataValidator
        guard dataValidator.isValidFormula(newFormula) else {
            return false
        }
        
        // Update the cell's formula
        cell.formula = newFormula
        
        // Recalculate the cell's value based on the new formula
        recalculate()
        
        // Return true to indicate successful update
        return true
    }
    
    /// Updates the style of the cell
    /// - Parameter newStyle: The new style to be applied to the cell
    func updateStyle(_ newStyle: CellStyle) {
        cell.style = newStyle
    }
    
    /// Returns the formatted value of the cell
    /// - Returns: The formatted value of the cell as a string
    func formattedValue() -> String {
        return cell.formattedValue()
    }
    
    /// Recalculates the cell's value if it has a formula
    func recalculate() {
        if let formula = cell.formula {
            // Call the cell's calculateFormula method
            let result = cell.calculateFormula(formula)
            
            // Update the cell's value with the result of the calculation
            cell.value = result
        }
    }
}

// MARK: - Human Tasks
// TODO: Implement error handling and user feedback for invalid input in updateValue and updateFormula methods
// TODO: Add support for undo/redo operations on cell changes
// TODO: Implement a mechanism to notify other dependent cells when this cell's value changes