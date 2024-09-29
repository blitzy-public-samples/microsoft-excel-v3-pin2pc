import Foundation

/// Represents a cell in a spreadsheet.
public struct Cell: Identifiable, Codable, Equatable {
    /// Unique identifier for the cell.
    public let id: UUID
    
    /// The row index of the cell.
    public let row: Int
    
    /// The column index of the cell.
    public let column: Int
    
    /// The value stored in the cell.
    public var value: CellValue
    
    /// The formula associated with the cell, if any.
    public var formula: String?
    
    /// The formatted display value of the cell.
    public var displayValue: String {
        // TODO: Implement proper formatting based on cell type and user settings
        return value.description
    }
    
    /// Initializes a new cell.
    /// - Parameters:
    ///   - row: The row index of the cell.
    ///   - column: The column index of the cell.
    ///   - value: The initial value of the cell.
    ///   - formula: The formula associated with the cell, if any.
    public init(row: Int, column: Int, value: CellValue, formula: String? = nil) {
        self.id = UUID()
        self.row = row
        self.column = column
        self.value = value
        self.formula = formula
    }
}

/// Represents the possible types of values that can be stored in a cell.
public enum CellValue: Codable, Equatable {
    case empty
    case string(String)
    case number(Double)
    case boolean(Bool)
    case date(Date)
    case error(String)
    
    public var description: String {
        switch self {
        case .empty:
            return ""
        case .string(let value):
            return value
        case .number(let value):
            return String(value)
        case .boolean(let value):
            return value ? "TRUE" : "FALSE"
        case .date(let value):
            // TODO: Implement proper date formatting
            return ISO8601DateFormatter().string(from: value)
        case .error(let value):
            return "#ERROR: \(value)"
        }
    }
}

extension Cell {
    /// Returns the cell's address in A1 notation.
    public var address: String {
        let columnName = Cell.columnIndexToName(column)
        return "\(columnName)\(row + 1)"
    }
    
    /// Converts a 0-based column index to a column name (e.g., 0 -> "A", 25 -> "Z", 26 -> "AA").
    private static func columnIndexToName(_ index: Int) -> String {
        var name = ""
        var columnNumber = index + 1
        while columnNumber > 0 {
            columnNumber -= 1
            name = String(UnicodeScalar((columnNumber % 26) + 65)!) + name
            columnNumber /= 26
        }
        return name
    }
}

// MARK: - Hashable

extension Cell: Hashable {
    public func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}

// MARK: - CustomStringConvertible

extension Cell: CustomStringConvertible {
    public var description: String {
        return "Cell(\(address): \(displayValue))"
    }
}