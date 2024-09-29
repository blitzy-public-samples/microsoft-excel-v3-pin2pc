import { test, expect } from '@playwright/test';
import { Workbook, Worksheet } from '../../types/spreadsheet';
import { cellAddressToIndices, indicesToCellAddress } from '../../utils/cellAddressHelper';

test.describe('Excel-like Spreadsheet E2E Tests', () => {
  let page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000'); // Adjust the URL as needed
    await page.waitForSelector('.spreadsheet-grid'); // Wait for the grid to be fully loaded
    await page.evaluate(() => {
      localStorage.clear(); // Clear any existing data or reset to a known state
    });
  });

  test('Basic cell editing', async () => {
    await test.step('Click on a cell', async () => {
      await page.click('.cell[data-cell-address="A1"]');
    });

    await test.step('Enter a value', async () => {
      await page.keyboard.type('Hello, Excel!');
      await page.keyboard.press('Enter');
    });

    await test.step('Verify that the cell displays the entered value', async () => {
      const cellContent = await page.textContent('.cell[data-cell-address="A1"]');
      expect(cellContent).toBe('Hello, Excel!');
    });

    await test.step('Click on another cell', async () => {
      await page.click('.cell[data-cell-address="B2"]');
    });

    await test.step('Verify that the first cell retains its value', async () => {
      const cellContent = await page.textContent('.cell[data-cell-address="A1"]');
      expect(cellContent).toBe('Hello, Excel!');
    });
  });

  test('Formula calculation', async () => {
    await test.step('Enter numeric values in multiple cells', async () => {
      await page.click('.cell[data-cell-address="A1"]');
      await page.keyboard.type('10');
      await page.keyboard.press('Enter');

      await page.click('.cell[data-cell-address="A2"]');
      await page.keyboard.type('20');
      await page.keyboard.press('Enter');
    });

    await test.step('Enter a formula in another cell that references the numeric cells', async () => {
      await page.click('.cell[data-cell-address="A3"]');
      await page.keyboard.type('=SUM(A1:A2)');
      await page.keyboard.press('Enter');
    });

    await test.step('Verify that the formula cell displays the correct calculated result', async () => {
      const formulaCellContent = await page.textContent('.cell[data-cell-address="A3"]');
      expect(formulaCellContent).toBe('30');
    });

    await test.step('Change one of the numeric values', async () => {
      await page.click('.cell[data-cell-address="A1"]');
      await page.keyboard.type('15');
      await page.keyboard.press('Enter');
    });

    await test.step('Verify that the formula cell updates automatically', async () => {
      const updatedFormulaCellContent = await page.textContent('.cell[data-cell-address="A3"]');
      expect(updatedFormulaCellContent).toBe('35');
    });
  });

  test('Cell formatting', async () => {
    await test.step('Select a cell', async () => {
      await page.click('.cell[data-cell-address="B2"]');
    });

    await test.step('Apply various formatting options', async () => {
      await page.click('.toolbar-button[data-format="bold"]');
      await page.click('.toolbar-button[data-format="italic"]');
      await page.click('.toolbar-button[data-format="color-red"]');
    });

    await test.step('Verify that the cell displays the correct formatting', async () => {
      const cellClasses = await page.getAttribute('.cell[data-cell-address="B2"]', 'class');
      expect(cellClasses).toContain('bold');
      expect(cellClasses).toContain('italic');
      expect(cellClasses).toContain('color-red');
    });

    await test.step('Clear formatting', async () => {
      await page.click('.toolbar-button[data-format="clear-formatting"]');
    });

    await test.step('Verify that the cell returns to its default state', async () => {
      const cellClasses = await page.getAttribute('.cell[data-cell-address="B2"]', 'class');
      expect(cellClasses).not.toContain('bold');
      expect(cellClasses).not.toContain('italic');
      expect(cellClasses).not.toContain('color-red');
    });
  });

  test('Grid navigation', async () => {
    await test.step('Use arrow keys to navigate between cells', async () => {
      await page.click('.cell[data-cell-address="C3"]');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowDown');
      const activeCell = await page.evaluate(() => document.activeElement.getAttribute('data-cell-address'));
      expect(activeCell).toBe('D4');
    });

    await test.step('Use mouse to click on different cells', async () => {
      await page.click('.cell[data-cell-address="E5"]');
      const activeCell = await page.evaluate(() => document.activeElement.getAttribute('data-cell-address'));
      expect(activeCell).toBe('E5');
    });

    await test.step('Test navigation to cells outside the visible area (scrolling)', async () => {
      await page.click('.cell[data-cell-address="A1"]');
      for (let i = 0; i < 50; i++) {
        await page.keyboard.press('ArrowDown');
      }
      const activeCell = await page.evaluate(() => document.activeElement.getAttribute('data-cell-address'));
      expect(activeCell).toBe('A51');
    });
  });

  test('Copy and paste', async () => {
    await test.step('Select a range of cells', async () => {
      await page.click('.cell[data-cell-address="A1"]');
      await page.keyboard.type('1');
      await page.keyboard.press('Enter');
      await page.keyboard.type('2');
      await page.keyboard.press('Enter');
      await page.keyboard.type('3');
      await page.keyboard.press('Enter');
      await page.keyboard.down('Shift');
      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('ArrowUp');
      await page.keyboard.up('Shift');
    });

    await test.step('Copy the selected range', async () => {
      await page.keyboard.press('Control+C');
    });

    await test.step('Paste into another area of the grid', async () => {
      await page.click('.cell[data-cell-address="C1"]');
      await page.keyboard.press('Control+V');
    });

    await test.step('Verify that the pasted cells match the original selection', async () => {
      const c1Content = await page.textContent('.cell[data-cell-address="C1"]');
      const c2Content = await page.textContent('.cell[data-cell-address="C2"]');
      const c3Content = await page.textContent('.cell[data-cell-address="C3"]');
      expect(c1Content).toBe('1');
      expect(c2Content).toBe('2');
      expect(c3Content).toBe('3');
    });
  });

  test('Undo and redo', async () => {
    await test.step('Perform a series of actions', async () => {
      await page.click('.cell[data-cell-address="A1"]');
      await page.keyboard.type('Test');
      await page.keyboard.press('Enter');
      await page.click('.toolbar-button[data-format="bold"]');
    });

    await test.step('Use the undo command multiple times', async () => {
      await page.keyboard.press('Control+Z');
      await page.keyboard.press('Control+Z');
      const cellContent = await page.textContent('.cell[data-cell-address="A1"]');
      expect(cellContent).toBe('');
    });

    await test.step('Use the redo command', async () => {
      await page.keyboard.press('Control+Y');
      await page.keyboard.press('Control+Y');
      const cellContent = await page.textContent('.cell[data-cell-address="A1"]');
      const cellClasses = await page.getAttribute('.cell[data-cell-address="A1"]', 'class');
      expect(cellContent).toBe('Test');
      expect(cellClasses).toContain('bold');
    });
  });
});

// Human tasks:
// TODO: Implement tests for advanced features like charts and pivot tables
// TODO: Add performance tests to ensure the application handles large datasets efficiently
// TODO: Implement tests for collaborative editing features
// TODO: Create tests for mobile-specific interactions and responsive design
// TODO: Develop tests for accessibility compliance