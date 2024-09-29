import XCTest
import Combine
@testable import ExcelMobile

class SpreadsheetViewModelTests: XCTestCase {
    var sut: SpreadsheetViewModel!
    var mockWorkbook: Workbook!
    var cancellables: Set<AnyCancellable>!
    
    override func setUp() {
        super.setUp()
        // Create a mock Workbook
        mockWorkbook = Workbook(id: "test-workbook", name: "Test Workbook")
        let worksheet = Worksheet(id: "test-worksheet", name: "Sheet1")
        mockWorkbook.worksheets = [worksheet]
        
        // Initialize the SpreadsheetViewModel with the mock Workbook
        sut = SpreadsheetViewModel(workbook: mockWorkbook)
        
        // Initialize an empty set for cancellables
        cancellables = Set<AnyCancellable>()
    }
    
    override func tearDown() {
        sut = nil
        mockWorkbook = nil
        cancellables = nil
        super.tearDown()
    }
    
    func testInitialization() {
        XCTAssertNotNil(sut, "SpreadsheetViewModel should not be nil")
        XCTAssertEqual(sut.workbook, mockWorkbook, "Workbook should be set correctly")
        XCTAssertEqual(sut.currentWorksheet, mockWorkbook.worksheets.first, "Current worksheet should be the first worksheet")
    }
    
    func testSelectCell() {
        sut.selectCell(row: 0, column: 0)
        XCTAssertNotNil(sut.selectedCell, "Selected cell should not be nil")
        XCTAssertEqual(sut.selectedCell?.row, 0, "Selected cell row should be 0")
        XCTAssertEqual(sut.selectedCell?.column, 0, "Selected cell column should be 0")
    }
    
    func testUpdateCellValue() {
        sut.updateCellValue(row: 0, column: 0, value: "Test")
        XCTAssertEqual(sut.currentWorksheet?.getCell(row: 0, column: 0)?.value, "Test", "Cell value should be updated")
        
        sut.updateCellValue(row: 0, column: 0, value: "=SUM(A1:A5)")
        XCTAssertTrue(sut.currentWorksheet?.getCell(row: 0, column: 0)?.hasFormula ?? false, "Cell should have a formula")
    }
    
    func testAddWorksheet() {
        let initialCount = sut.workbook.worksheets.count
        sut.addWorksheet(name: "New Sheet")
        XCTAssertEqual(sut.workbook.worksheets.count, initialCount + 1, "Worksheet count should increase by 1")
        XCTAssertEqual(sut.currentWorksheet?.name, "New Sheet", "Current worksheet should be the newly added worksheet")
    }
    
    func testRemoveWorksheet() {
        let initialCount = sut.workbook.worksheets.count
        sut.removeWorksheet()
        XCTAssertEqual(sut.workbook.worksheets.count, initialCount - 1, "Worksheet count should decrease by 1")
        XCTAssertNotEqual(sut.currentWorksheet?.id, mockWorkbook.worksheets.first?.id, "Current worksheet should not be the removed worksheet")
    }
    
    func testSwitchToWorksheet() {
        let newWorksheet = Worksheet(id: "new-worksheet", name: "New Sheet")
        sut.workbook.worksheets.append(newWorksheet)
        sut.switchToWorksheet(worksheetId: newWorksheet.id)
        XCTAssertEqual(sut.currentWorksheet?.id, newWorksheet.id, "Current worksheet should be the one with the given ID")
    }
    
    func testCalculateFormula() {
        let formulaCell = Cell(row: 0, column: 0, value: "=SUM(1,2,3)")
        let result = sut.calculateFormula(cell: formulaCell)
        XCTAssertEqual(result, 6, "Formula calculation should be correct")
    }
    
    func testSaveWorkbook() {
        let expectation = XCTestExpectation(description: "Save workbook")
        sut.saveWorkbook()
            .sink(receiveCompletion: { completion in
                if case .failure = completion {
                    XCTFail("Save workbook should not fail")
                }
                expectation.fulfill()
            }, receiveValue: { success in
                XCTAssertTrue(success, "Save workbook should return true")
            })
            .store(in: &cancellables)
        wait(for: [expectation], timeout: 5.0)
    }
    
    func testLoadWorkbook() {
        let expectation = XCTestExpectation(description: "Load workbook")
        let testWorkbookId = "test-workbook-id"
        sut.loadWorkbook(workbookId: testWorkbookId)
            .sink(receiveCompletion: { completion in
                if case .failure = completion {
                    XCTFail("Load workbook should not fail")
                }
                expectation.fulfill()
            }, receiveValue: { success in
                XCTAssertTrue(success, "Load workbook should return true")
                XCTAssertEqual(self.sut.workbook.id, testWorkbookId, "Loaded workbook should have the correct ID")
            })
            .store(in: &cancellables)
        wait(for: [expectation], timeout: 5.0)
    }
}

// MARK: - Pending Human Tasks
/*
 TODO: Implement mock objects for Workbook, Worksheet, and Cell to isolate tests
 TODO: Add more edge case tests for formula calculation
 TODO: Implement tests for concurrent editing scenarios
 TODO: Add performance tests for large spreadsheets
*/