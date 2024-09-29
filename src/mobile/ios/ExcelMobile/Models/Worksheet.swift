import Foundation

/// Represents a single worksheet in an Excel workbook
struct Worksheet {
    /// The name of the worksheet
    let name: String
    
    /// Unique identifier for the worksheet
    let id: UUID
    
    /// Dictionary of cells in the worksheet, keyed by their address
    private(set) var cells: [String: Cell]
    
    /// Number of rows in the worksheet
    let rowCount: Int
    
    /// Number of columns in the worksheet
    let columnCount: Int
    
    /// Initializes a new Worksheet instance
    /// - Parameters:
    ///   - name: The name of the worksheet
    ///   - rowCount: The number of rows in the worksheet
    ///   - columnCount: The number of columns in the worksheet
    init(name: String, rowCount: Int, columnCount: Int) {
        self.name = name
        self.id = UUID()
        self.cells = [:]
        self.rowCount = rowCount
        self.columnCount = columnCount
    }
    
    /// Retrieves the cell at the specified address
    /// - Parameter address: The address of the cell (e.g., "A1")
    /// - Returns: The cell at the given address or nil if not found
    func cellAt(address: String) -> Cell? {
        return cells[address]
    }
    
    /// Sets the value of a cell at the specified address
    /// - Parameters:
    ///   - address: The address of the cell (e.g., "A1")
    ///   - value: The value to set for the cell
    mutating func setCellValue(address: String, value: Any) {
        if let existingCell = cells[address] {
            existingCell.setValue(value)
        } else {
            let newCell = Cell(address: address, value: value)
            cells[address] = newCell
        }
    }
    
    /// Sets the formula for a cell at the specified address
    /// - Parameters:
    ///   - address: The address of the cell (e.g., "A1")
    ///   - formulaString: The formula string to set for the cell
    mutating func setCellFormula(address: String, formulaString: String) {
        let formula = Formula(expression: formulaString)
        if let existingCell = cells[address] {
            existingCell.setFormula(formula)
        } else {
            let newCell = Cell(address: address, formula: formula)
            cells[address] = newCell
        }
    }
    
    /// Calculates all formulas in the worksheet
    mutating func calculateAllFormulas() {
        for (address, cell) in cells {
            if let formula = cell.formula {
                // Assuming there's a method to calculate the formula
                let result = formula.calculate(in: self)
                cell.setValue(result)
            }
        }
    }
    
    /// Inserts a new row at the specified index
    /// - Parameter atIndex: The index at which to insert the new row
    mutating func insertRow(atIndex: Int) {
        // Shift all existing rows below the index down by one
        let cellsToUpdate = cells.filter { $0.key.row >= atIndex }
        for (address, cell) in cellsToUpdate.reversed() {
            let newAddress = CellAddressHelper.incrementRow(address)
            cells[newAddress] = cell
            cells.removeValue(forKey: address)
        }
        
        // Update the rowCount
        rowCount += 1
    }
    
    /// Inserts a new column at the specified index
    /// - Parameter atIndex: The index at which to insert the new column
    mutating func insertColumn(atIndex: Int) {
        // Shift all existing columns to the right of the index by one
        let cellsToUpdate = cells.filter { $0.key.column >= atIndex }
        for (address, cell) in cellsToUpdate.reversed() {
            let newAddress = CellAddressHelper.incrementColumn(address)
            cells[newAddress] = cell
            cells.removeValue(forKey: address)
        }
        
        // Update the columnCount
        columnCount += 1
    }
    
    /// Deletes the row at the specified index
    /// - Parameter atIndex: The index of the row to delete
    mutating func deleteRow(atIndex: Int) {
        // Remove all cells in the specified row
        cells = cells.filter { $0.key.row != atIndex }
        
        // Shift all rows below the deleted row up by one
        let cellsToUpdate = cells.filter { $0.key.row > atIndex }
        for (address, cell) in cellsToUpdate {
            let newAddress = CellAddressHelper.decrementRow(address)
            cells[newAddress] = cell
            cells.removeValue(forKey: address)
        }
        
        // Update the rowCount
        rowCount -= 1
    }
    
    /// Deletes the column at the specified index
    /// - Parameter atIndex: The index of the column to delete
    mutating func deleteColumn(atIndex: Int) {
        // Remove all cells in the specified column
        cells = cells.filter { $0.key.column != atIndex }
        
        // Shift all columns to the right of the deleted column left by one
        let cellsToUpdate = cells.filter { $0.key.column > atIndex }
        for (address, cell) in cellsToUpdate {
            let newAddress = CellAddressHelper.decrementColumn(address)
            cells[newAddress] = cell
            cells.removeValue(forKey: address)
        }
        
        // Update the columnCount
        columnCount -= 1
    }
}

// MARK: - Helper Extensions

extension String {
    var row: Int {
        // Implement logic to extract row number from cell address
        // For example: "A1" -> 1, "B2" -> 2
        fatalError("Not implemented")
    }
    
    var column: Int {
        // Implement logic to extract column index from cell address
        // For example: "A1" -> 0, "B2" -> 1
        fatalError("Not implemented")
    }
}

// MARK: - CellAddressHelper

enum CellAddressHelper {
    static func incrementRow(_ address: String) -> String {
        // Implement logic to increment row in cell address
        fatalError("Not implemented")
    }
    
    static func incrementColumn(_ address: String) -> String {
        // Implement logic to increment column in cell address
        fatalError("Not implemented")
    }
    
    static func decrementRow(_ address: String) -> String {
        // Implement logic to decrement row in cell address
        fatalError("Not implemented")
    }
    
    static func decrementColumn(_ address: String) -> String {
        // Implement logic to decrement column in cell address
        fatalError("Not implemented")
    }
}

// MARK: - Pending Human Tasks

/*
 TODO: Implement the following tasks:
 1. Implement undo/redo functionality for cell value changes and row/column operations (Required)
 2. Add support for cell ranges and multi-cell operations (Required)
 3. Implement efficient data structures for large worksheets (e.g., sparse matrix) (Optional)
 4. Add support for worksheet-level styles and formatting (Optional)
 */