import SwiftUI

struct CellView: View {
    @ObservedObject var cell: Cell
    var isSelected: Bool
    var onCellTap: (Cell) -> Void
    
    init(cell: Cell, isSelected: Bool, onCellTap: @escaping (Cell) -> Void) {
        self.cell = cell
        self.isSelected = isSelected
        self.onCellTap = onCellTap
    }
    
    var body: some View {
        ZStack {
            cellBackgroundColor()
            
            Text(formattedValue())
                .font(ThemeManager.shared.cellFont)
                .foregroundColor(ThemeManager.shared.cellTextColor)
                .padding(4)
        }
        .frame(minWidth: 0, maxWidth: .infinity, minHeight: 0, maxHeight: .infinity)
        .onTapGesture {
            onCellTap(cell)
        }
    }
    
    private func formattedValue() -> String {
        // Call the cell's formattedValue() method
        // If the cell contains a formula, show the calculated result
        return cell.formattedValue()
    }
    
    private func cellBackgroundColor() -> Color {
        // Use ThemeManager to get the appropriate color based on the cell's style
        let baseColor = ThemeManager.shared.cellBackgroundColor(for: cell.style)
        
        // If the cell is selected, apply a selection highlight color
        return isSelected ? baseColor.opacity(0.8) : baseColor
    }
}

// MARK: - Preview
struct CellView_Previews: PreviewProvider {
    static var previews: some View {
        CellView(cell: Cell(value: "Sample", style: .normal), isSelected: false) { _ in }
    }
}

// MARK: - Human Tasks
/*
 TODO: Implement cell editing functionality when the cell is double-tapped or enters edit mode
 TODO: Add support for displaying cell borders based on the cell's style
 TODO: Implement a custom shape for cells with diagonal borders or other complex styles
 TODO: Add accessibility labels and hints for VoiceOver support
*/