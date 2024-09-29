import SwiftUI

struct ToolbarView: View {
    @ObservedObject var viewModel: SpreadsheetViewModel
    @ObservedObject var themeManager: ThemeManager
    
    init(viewModel: SpreadsheetViewModel) {
        self.viewModel = viewModel
        self.themeManager = ThemeManager.shared
    }
    
    var body: some View {
        HStack {
            formatButton()
            Spacer()
            insertButton()
            Spacer()
            formulaButton()
        }
        .padding()
        .background(themeManager.toolbarBackgroundColor)
    }
    
    private func formatButton() -> some View {
        Button(action: {
            viewModel.showFormattingOptions()
        }) {
            VStack {
                Image(systemName: "textformat")
                    .foregroundColor(themeManager.toolbarIconColor)
                Text("Format")
                    .font(themeManager.toolbarFont)
                    .foregroundColor(themeManager.toolbarTextColor)
            }
        }
        .buttonStyle(PlainButtonStyle())
    }
    
    private func insertButton() -> some View {
        Button(action: {
            viewModel.showInsertionOptions()
        }) {
            VStack {
                Image(systemName: "plus.square")
                    .foregroundColor(themeManager.toolbarIconColor)
                Text("Insert")
                    .font(themeManager.toolbarFont)
                    .foregroundColor(themeManager.toolbarTextColor)
            }
        }
        .buttonStyle(PlainButtonStyle())
    }
    
    private func formulaButton() -> some View {
        Button(action: {
            viewModel.showFormulaOptions()
        }) {
            VStack {
                Image(systemName: "function")
                    .foregroundColor(themeManager.toolbarIconColor)
                Text("Formula")
                    .font(themeManager.toolbarFont)
                    .foregroundColor(themeManager.toolbarTextColor)
            }
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Preview
struct ToolbarView_Previews: PreviewProvider {
    static var previews: some View {
        ToolbarView(viewModel: SpreadsheetViewModel())
    }
}

// MARK: - Human Tasks
/*
 TODO: Implement specific actions for each toolbar button
 TODO: Design and implement popovers or sheets for additional options
 TODO: Add accessibility labels and hints for each toolbar item
 TODO: Implement landscape mode layout adjustments (Optional)
*/