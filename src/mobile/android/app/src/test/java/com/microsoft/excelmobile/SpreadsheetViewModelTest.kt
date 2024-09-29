package com.microsoft.excelmobile

import androidx.arch.core.executor.testing.InstantTaskExecutorRule
import com.microsoft.excelmobile.models.Cell
import com.microsoft.excelmobile.models.Workbook
import com.microsoft.excelmobile.models.Worksheet
import com.microsoft.excelmobile.services.CalculationEngine
import com.microsoft.excelmobile.services.DataSyncService
import com.microsoft.excelmobile.viewmodels.SpreadsheetViewModel
import com.microsoft.excelmobile.util.LiveDataTestUtil.getOrAwaitValue
import io.mockk.MockK
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.runBlockingTest
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.Assert.*

@ExperimentalCoroutinesApi
class SpreadsheetViewModelTest {

    @get:Rule
    val instantExecutorRule = InstantTaskExecutorRule()

    private lateinit var viewModel: SpreadsheetViewModel
    private lateinit var calculationEngine: CalculationEngine
    private lateinit var dataSyncService: DataSyncService

    @Before
    fun setup() {
        calculationEngine = mockk(relaxed = true)
        dataSyncService = mockk(relaxed = true)
        viewModel = SpreadsheetViewModel(calculationEngine, dataSyncService)
    }

    @Test
    fun testLoadWorkbook() = runBlockingTest {
        // Create a mock Workbook
        val mockWorkbook = mockk<Workbook>()
        val mockWorksheet = mockk<Worksheet>()
        every { mockWorkbook.worksheets } returns listOf(mockWorksheet)
        every { dataSyncService.fetchWorkbook(any()) } returns mockWorkbook

        // Call viewModel.loadWorkbook
        viewModel.loadWorkbook("testWorkbookId")

        // Verify that currentWorkbook is updated
        assertEquals(mockWorkbook, viewModel.currentWorkbook.getOrAwaitValue())

        // Verify that currentWorksheet is set to the first worksheet
        assertEquals(mockWorksheet, viewModel.currentWorksheet.getOrAwaitValue())

        // Verify that calculateWorkbook is called
        verify { calculationEngine.calculateWorkbook(mockWorkbook) }
    }

    @Test
    fun testSwitchWorksheet() = runBlockingTest {
        // Create a mock Workbook with multiple Worksheets
        val mockWorkbook = mockk<Workbook>()
        val mockWorksheet1 = mockk<Worksheet>()
        val mockWorksheet2 = mockk<Worksheet>()
        every { mockWorkbook.worksheets } returns listOf(mockWorksheet1, mockWorksheet2)
        every { mockWorksheet2.id } returns "worksheet2Id"

        // Set the current workbook
        viewModel.currentWorkbook.value = mockWorkbook

        // Call viewModel.switchWorksheet
        viewModel.switchWorksheet("worksheet2Id")

        // Verify that currentWorksheet is updated to the correct worksheet
        assertEquals(mockWorksheet2, viewModel.currentWorksheet.getOrAwaitValue())

        // Verify that selectedCell is cleared
        assertNull(viewModel.selectedCell.getOrAwaitValue())
    }

    @Test
    fun testUpdateCell() = runBlockingTest {
        // Create a mock Worksheet with a Cell
        val mockWorksheet = mockk<Worksheet>()
        val mockCell = mockk<Cell>()
        every { mockWorksheet.getCell(any(), any()) } returns mockCell
        every { mockCell.value } returns "oldValue"

        // Set up expectations for calculationEngine.recalculateDependentCells
        every { calculationEngine.recalculateDependentCells(any(), any()) } returns mockWorksheet

        // Set the current worksheet
        viewModel.currentWorksheet.value = mockWorksheet

        // Call viewModel.updateCell
        viewModel.updateCell("A1", "newValue")

        // Verify that the cell value is updated
        verify { mockCell.value = "newValue" }

        // Verify that recalculateDependentCells is called
        verify { calculationEngine.recalculateDependentCells(mockWorksheet, mockCell) }

        // Verify that currentWorksheet is updated
        assertEquals(mockWorksheet, viewModel.currentWorksheet.getOrAwaitValue())

        // Verify that syncData is called
        verify { dataSyncService.synchronizeWorkbook(any()) }
    }

    @Test
    fun testSelectCell() {
        // Create a mock Worksheet with a Cell
        val mockWorksheet = mockk<Worksheet>()
        val mockCell = mockk<Cell>()
        every { mockWorksheet.getCell(any(), any()) } returns mockCell

        // Set the current worksheet
        viewModel.currentWorksheet.value = mockWorksheet

        // Call viewModel.selectCell
        viewModel.selectCell("B2")

        // Verify that selectedCell is updated to the correct cell
        assertEquals(mockCell, viewModel.selectedCell.getOrAwaitValue())
    }

    @Test
    fun testCalculateWorkbook() = runBlockingTest {
        // Create a mock Workbook
        val mockWorkbook = mockk<Workbook>()

        // Set up expectations for calculationEngine.calculateWorkbook
        every { calculationEngine.calculateWorkbook(any()) } returns mockWorkbook

        // Set the current workbook
        viewModel.currentWorkbook.value = mockWorkbook

        // Call viewModel.calculateWorkbook
        viewModel.calculateWorkbook()

        // Verify that calculationEngine.calculateWorkbook is called
        verify { calculationEngine.calculateWorkbook(mockWorkbook) }

        // Verify that currentWorkbook is updated
        assertEquals(mockWorkbook, viewModel.currentWorkbook.getOrAwaitValue())

        // Verify that syncData is called
        verify { dataSyncService.synchronizeWorkbook(mockWorkbook) }
    }

    @Test
    fun testSyncData() = runBlockingTest {
        // Create a mock Workbook
        val mockWorkbook = mockk<Workbook>()

        // Set up expectations for dataSyncService.synchronizeWorkbook
        every { dataSyncService.synchronizeWorkbook(any()) } returns mockWorkbook

        // Set the current workbook
        viewModel.currentWorkbook.value = mockWorkbook

        // Call viewModel.syncData
        viewModel.syncData()

        // Verify that dataSyncService.synchronizeWorkbook is called
        verify { dataSyncService.synchronizeWorkbook(mockWorkbook) }

        // Verify that currentWorkbook is updated with any changes from the server
        assertEquals(mockWorkbook, viewModel.currentWorkbook.getOrAwaitValue())
    }

    @Test
    fun testAddWorksheet() = runBlockingTest {
        // Create a mock Workbook
        val mockWorkbook = mockk<Workbook>()
        val mockNewWorksheet = mockk<Worksheet>()
        every { mockWorkbook.addWorksheet(any()) } returns mockNewWorksheet

        // Set the current workbook
        viewModel.currentWorkbook.value = mockWorkbook

        // Call viewModel.addWorksheet
        viewModel.addWorksheet("New Worksheet")

        // Verify that a new worksheet is added to the workbook
        verify { mockWorkbook.addWorksheet("New Worksheet") }

        // Verify that currentWorkbook is updated
        assertEquals(mockWorkbook, viewModel.currentWorkbook.getOrAwaitValue())

        // Verify that currentWorksheet is switched to the new worksheet
        assertEquals(mockNewWorksheet, viewModel.currentWorksheet.getOrAwaitValue())

        // Verify that syncData is called
        verify { dataSyncService.synchronizeWorkbook(mockWorkbook) }
    }

    @Test
    fun testRemoveWorksheet() = runBlockingTest {
        // Create a mock Workbook with multiple Worksheets
        val mockWorkbook = mockk<Workbook>()
        val mockWorksheet1 = mockk<Worksheet>()
        val mockWorksheet2 = mockk<Worksheet>()
        every { mockWorkbook.worksheets } returns listOf(mockWorksheet1, mockWorksheet2)
        every { mockWorkbook.removeWorksheet(any()) } returns true
        every { mockWorksheet1.id } returns "worksheet1Id"
        every { mockWorksheet2.id } returns "worksheet2Id"

        // Set the current workbook and worksheet
        viewModel.currentWorkbook.value = mockWorkbook
        viewModel.currentWorksheet.value = mockWorksheet2

        // Call viewModel.removeWorksheet
        viewModel.removeWorksheet("worksheet2Id")

        // Verify that the worksheet is removed from the workbook
        verify { mockWorkbook.removeWorksheet("worksheet2Id") }

        // Verify that currentWorkbook is updated
        assertEquals(mockWorkbook, viewModel.currentWorkbook.getOrAwaitValue())

        // Verify that currentWorksheet is switched to another worksheet if the removed one was current
        assertEquals(mockWorksheet1, viewModel.currentWorksheet.getOrAwaitValue())

        // Verify that syncData is called
        verify { dataSyncService.synchronizeWorkbook(mockWorkbook) }
    }
}

// TODO: Implement additional test cases for error handling scenarios
// TODO: Add performance tests for large workbooks and worksheets
// TODO: Implement tests for concurrent modifications in a collaborative environment