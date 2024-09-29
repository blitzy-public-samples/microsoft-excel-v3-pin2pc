package com.microsoft.excelmobile

import com.microsoft.excelmobile.services.CalculationEngine
import com.microsoft.excelmobile.utils.FormulaParser
import com.microsoft.excelmobile.models.Cell
import com.microsoft.excelmobile.models.Formula
import com.microsoft.excelmobile.models.Workbook
import com.microsoft.excelmobile.models.Worksheet
import org.junit.Before
import org.junit.Test
import org.junit.Assert.*
import org.mockito.Mock
import org.mockito.Mockito.*
import org.mockito.MockitoAnnotations

class CalculationEngineTest {

    private lateinit var calculationEngine: CalculationEngine

    @Mock
    private lateinit var formulaParser: FormulaParser

    @Before
    fun setup() {
        MockitoAnnotations.openMocks(this)
        calculationEngine = CalculationEngine(formulaParser)
    }

    @Test
    fun testEvaluateSimpleFormula() {
        // Create a simple formula (e.g., '=A1+B1')
        val formula = Formula("=A1+B1")
        val cellA1 = Cell("A1", "5")
        val cellB1 = Cell("B1", "3")

        // Mock the necessary cell values
        `when`(formulaParser.parse("=A1+B1")).thenReturn { cells ->
            cells["A1"]!!.toInt() + cells["B1"]!!.toInt()
        }

        // Call calculationEngine.evaluateFormula()
        val result = calculationEngine.evaluateFormula(formula, mapOf("A1" to cellA1, "B1" to cellB1))

        // Assert that the result matches the expected output
        assertEquals(8, result)
    }

    @Test
    fun testEvaluateComplexFormula() {
        // Create a complex formula (e.g., '=SUM(A1:A5) * AVERAGE(B1:B3)')
        val formula = Formula("=SUM(A1:A5) * AVERAGE(B1:B3)")
        val cells = mapOf(
            "A1" to Cell("A1", "1"),
            "A2" to Cell("A2", "2"),
            "A3" to Cell("A3", "3"),
            "A4" to Cell("A4", "4"),
            "A5" to Cell("A5", "5"),
            "B1" to Cell("B1", "10"),
            "B2" to Cell("B2", "20"),
            "B3" to Cell("B3", "30")
        )

        // Mock the necessary cell values and ranges
        `when`(formulaParser.parse("=SUM(A1:A5) * AVERAGE(B1:B3)")).thenReturn { cellMap ->
            val sum = (1..5).sumOf { cellMap["A$it"]!!.toInt() }
            val average = (1..3).map { cellMap["B$it"]!!.toInt() }.average()
            sum * average
        }

        // Call calculationEngine.evaluateFormula()
        val result = calculationEngine.evaluateFormula(formula, cells)

        // Assert that the result matches the expected output
        assertEquals(250.0, result, 0.001)
    }

    @Test
    fun testCalculateWorkbook() {
        // Create a mock Workbook with multiple Worksheets and Cells containing formulas
        val workbook = mock(Workbook::class.java)
        val worksheet1 = mock(Worksheet::class.java)
        val worksheet2 = mock(Worksheet::class.java)

        `when`(workbook.worksheets).thenReturn(listOf(worksheet1, worksheet2))

        val cells1 = mapOf(
            "A1" to Cell("A1", "5"),
            "B1" to Cell("B1", "=A1*2"),
            "C1" to Cell("C1", "=SUM(A1:B1)")
        )
        val cells2 = mapOf(
            "A1" to Cell("A1", "10"),
            "B1" to Cell("B1", "=A1+5"),
            "C1" to Cell("C1", "=AVERAGE(A1:B1)")
        )

        `when`(worksheet1.cells).thenReturn(cells1)
        `when`(worksheet2.cells).thenReturn(cells2)

        // Mock formula parsing
        `when`(formulaParser.parse("=A1*2")).thenReturn { cells -> cells["A1"]!!.toInt() * 2 }
        `when`(formulaParser.parse("=SUM(A1:B1)")).thenReturn { cells -> cells["A1"]!!.toInt() + cells["B1"]!!.toInt() }
        `when`(formulaParser.parse("=A1+5")).thenReturn { cells -> cells["A1"]!!.toInt() + 5 }
        `when`(formulaParser.parse("=AVERAGE(A1:B1)")).thenReturn { cells -> (cells["A1"]!!.toInt() + cells["B1"]!!.toInt()) / 2.0 }

        // Call calculationEngine.calculateWorkbook()
        calculationEngine.calculateWorkbook(workbook)

        // Verify that all cells with formulas have been updated with correct values
        assertEquals("10", cells1["B1"]!!.value)
        assertEquals("15", cells1["C1"]!!.value)
        assertEquals("15", cells2["B1"]!!.value)
        assertEquals("12.5", cells2["C1"]!!.value)
    }

    @Test
    fun testCalculateWorksheet() {
        // Create a mock Worksheet with Cells containing formulas
        val worksheet = mock(Worksheet::class.java)
        val cells = mapOf(
            "A1" to Cell("A1", "5"),
            "B1" to Cell("B1", "=A1*2"),
            "C1" to Cell("C1", "=SUM(A1:B1)")
        )

        `when`(worksheet.cells).thenReturn(cells)

        // Mock formula parsing
        `when`(formulaParser.parse("=A1*2")).thenReturn { cells -> cells["A1"]!!.toInt() * 2 }
        `when`(formulaParser.parse("=SUM(A1:B1)")).thenReturn { cells -> cells["A1"]!!.toInt() + cells["B1"]!!.toInt() }

        // Call calculationEngine.calculateWorksheet()
        calculationEngine.calculateWorksheet(worksheet)

        // Verify that all cells with formulas in the worksheet have been updated with correct values
        assertEquals("10", cells["B1"]!!.value)
        assertEquals("15", cells["C1"]!!.value)
    }

    @Test
    fun testRecalculateDependents() {
        // Create a mock Workbook with cells that have dependencies
        val workbook = mock(Workbook::class.java)
        val worksheet = mock(Worksheet::class.java)
        `when`(workbook.worksheets).thenReturn(listOf(worksheet))

        val cells = mapOf(
            "A1" to Cell("A1", "5"),
            "B1" to Cell("B1", "=A1*2"),
            "C1" to Cell("C1", "=SUM(A1:B1)")
        )
        `when`(worksheet.cells).thenReturn(cells)

        // Mock formula parsing
        `when`(formulaParser.parse("=A1*2")).thenReturn { cells -> cells["A1"]!!.toInt() * 2 }
        `when`(formulaParser.parse("=SUM(A1:B1)")).thenReturn { cells -> cells["A1"]!!.toInt() + cells["B1"]!!.toInt() }

        // Initial calculation
        calculationEngine.calculateWorkbook(workbook)

        // Change the value of a cell
        cells["A1"]!!.value = "10"

        // Call calculationEngine.recalculateDependents()
        calculationEngine.recalculateDependents(workbook, "A1")

        // Verify that all dependent cells have been updated correctly
        assertEquals("20", cells["B1"]!!.value)
        assertEquals("30", cells["C1"]!!.value)
    }

    @Test
    fun testCircularReferenceHandling() {
        // Create a mock Workbook with cells that form a circular reference
        val workbook = mock(Workbook::class.java)
        val worksheet = mock(Worksheet::class.java)
        `when`(workbook.worksheets).thenReturn(listOf(worksheet))

        val cells = mapOf(
            "A1" to Cell("A1", "=B1"),
            "B1" to Cell("B1", "=C1"),
            "C1" to Cell("C1", "=A1")
        )
        `when`(worksheet.cells).thenReturn(cells)

        // Mock formula parsing
        `when`(formulaParser.parse("=B1")).thenReturn { cells -> cells["B1"]!!.toInt() }
        `when`(formulaParser.parse("=C1")).thenReturn { cells -> cells["C1"]!!.toInt() }
        `when`(formulaParser.parse("=A1")).thenReturn { cells -> cells["A1"]!!.toInt() }

        // Call calculationEngine.calculateWorkbook()
        calculationEngine.calculateWorkbook(workbook)

        // Verify that the circular reference is detected and handled appropriately
        assertTrue(cells["A1"]!!.value.startsWith("#CIRCULAR"))
        assertTrue(cells["B1"]!!.value.startsWith("#CIRCULAR"))
        assertTrue(cells["C1"]!!.value.startsWith("#CIRCULAR"))
    }

    @Test
    fun testErrorHandling() {
        // Create formulas that would result in different types of errors
        val divisionByZeroFormula = Formula("=A1/B1")
        val valueErrorFormula = Formula("=A1+B1")
        val referenceErrorFormula = Formula("=A1+NonexistentCell")

        val cells = mapOf(
            "A1" to Cell("A1", "10"),
            "B1" to Cell("B1", "0")
        )

        // Mock formula parsing
        `when`(formulaParser.parse("=A1/B1")).thenReturn { cells ->
            if (cells["B1"]!!.toInt() == 0) throw ArithmeticException("Division by zero")
            cells["A1"]!!.toInt() / cells["B1"]!!.toInt()
        }
        `when`(formulaParser.parse("=A1+B1")).thenReturn { cells ->
            cells["A1"]!!.toInt() + cells["B1"]!!.toInt()
        }
        `when`(formulaParser.parse("=A1+NonexistentCell")).thenReturn { cells ->
            if (!cells.containsKey("NonexistentCell")) throw NoSuchElementException("Cell not found")
            cells["A1"]!!.toInt() + cells["NonexistentCell"]!!.toInt()
        }

        // Call calculationEngine.evaluateFormula() for each error case
        val divisionByZeroResult = calculationEngine.evaluateFormula(divisionByZeroFormula, cells)
        val valueErrorResult = calculationEngine.evaluateFormula(valueErrorFormula, cells)
        val referenceErrorResult = calculationEngine.evaluateFormula(referenceErrorFormula, cells)

        // Verify that the appropriate error is returned for each case
        assertEquals("#DIV/0!", divisionByZeroResult)
        assertEquals("10", valueErrorResult) // This should not produce an error
        assertEquals("#REF!", referenceErrorResult)
    }
}

// TODO: Implement performance tests for large workbook calculations
// TODO: Add tests for multi-threaded calculation scenarios
// TODO: Create tests for all supported Excel functions
// TODO: Implement integration tests with actual FormulaParser implementation