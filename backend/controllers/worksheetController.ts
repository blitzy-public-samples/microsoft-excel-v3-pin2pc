import { Request, Response } from 'express';
import { Worksheet } from '../models/worksheet';
import { Cell } from '../models/cell';
import { Chart } from '../models/chart';
import { ICalculationEngine } from '../interfaces/ICalculationEngine';
import { IChartingEngine } from '../interfaces/IChartingEngine';

// Importing the calculation and charting engines
import { CalculationEngine } from '../services/calculationEngine';
import { ChartingEngine } from '../services/chartingEngine';

class WorksheetController {
  private calculationEngine: ICalculationEngine;
  private chartingEngine: IChartingEngine;

  constructor() {
    this.calculationEngine = new CalculationEngine();
    this.chartingEngine = new ChartingEngine();
  }

  // Create a new worksheet
  public async createWorksheet(req: Request, res: Response): Promise<void> {
    try {
      const { workbookId, name } = req.body;

      // Validate input data
      if (!workbookId || !name) {
        res.status(400).json({ error: 'Workbook ID and worksheet name are required' });
        return;
      }

      // Create a new Worksheet instance
      const worksheet = new Worksheet(workbookId, name);

      // Save the worksheet to the database
      await worksheet.save();

      // Update the workbook with the new worksheet reference
      // This step would typically be handled by a WorkbookService
      // await workbookService.addWorksheetReference(workbookId, worksheet.id);

      res.status(201).json(worksheet);
    } catch (error) {
      console.error('Error creating worksheet:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Retrieve a specific worksheet
  public async getWorksheet(req: Request, res: Response): Promise<void> {
    try {
      const { worksheetId } = req.params;

      // Fetch the worksheet from the database
      const worksheet = await Worksheet.findById(worksheetId);

      if (!worksheet) {
        res.status(404).json({ error: 'Worksheet not found' });
        return;
      }

      res.status(200).json(worksheet);
    } catch (error) {
      console.error('Error retrieving worksheet:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update an existing worksheet
  public async updateWorksheet(req: Request, res: Response): Promise<void> {
    try {
      const { worksheetId } = req.params;
      const updateData = req.body;

      // Validate the update data
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: 'No update data provided' });
        return;
      }

      // Fetch the worksheet from the database
      const worksheet = await Worksheet.findById(worksheetId);

      if (!worksheet) {
        res.status(404).json({ error: 'Worksheet not found' });
        return;
      }

      // Update the worksheet properties
      Object.assign(worksheet, updateData);

      // Save the updated worksheet
      await worksheet.save();

      res.status(200).json(worksheet);
    } catch (error) {
      console.error('Error updating worksheet:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete a worksheet
  public async deleteWorksheet(req: Request, res: Response): Promise<void> {
    try {
      const { worksheetId } = req.params;

      // Fetch the worksheet from the database
      const worksheet = await Worksheet.findById(worksheetId);

      if (!worksheet) {
        res.status(404).json({ error: 'Worksheet not found' });
        return;
      }

      // Remove the worksheet reference from the workbook
      // This step would typically be handled by a WorkbookService
      // await workbookService.removeWorksheetReference(worksheet.workbookId, worksheetId);

      // Delete the worksheet from the database
      await Worksheet.deleteOne({ _id: worksheetId });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting worksheet:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Add a new cell to the worksheet
  public async addCell(req: Request, res: Response): Promise<void> {
    try {
      const { worksheetId } = req.params;
      const cellData = req.body;

      // Validate the cell data
      if (!cellData.column || !cellData.row) {
        res.status(400).json({ error: 'Cell column and row are required' });
        return;
      }

      // Fetch the worksheet from the database
      const worksheet = await Worksheet.findById(worksheetId);

      if (!worksheet) {
        res.status(404).json({ error: 'Worksheet not found' });
        return;
      }

      // Create a new Cell instance
      const cell = new Cell(cellData);

      // Add the cell to the worksheet
      worksheet.addCell(cell);

      // Save the updated worksheet
      await worksheet.save();

      res.status(201).json(cell);
    } catch (error) {
      console.error('Error adding cell:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update an existing cell in the worksheet
  public async updateCell(req: Request, res: Response): Promise<void> {
    try {
      const { worksheetId, cellId } = req.params;
      const updateData = req.body;

      // Validate the update data
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: 'No update data provided' });
        return;
      }

      // Fetch the worksheet from the database
      const worksheet = await Worksheet.findById(worksheetId);

      if (!worksheet) {
        res.status(404).json({ error: 'Worksheet not found' });
        return;
      }

      // Find the cell in the worksheet
      const cell = worksheet.getCellById(cellId);

      if (!cell) {
        res.status(404).json({ error: 'Cell not found' });
        return;
      }

      // Update the cell properties
      Object.assign(cell, updateData);

      // If the cell value changed, trigger recalculation of dependent cells
      if (updateData.value !== undefined) {
        this.calculationEngine.recalculateDependents(worksheet, cell);
      }

      // Save the updated worksheet
      await worksheet.save();

      res.status(200).json(cell);
    } catch (error) {
      console.error('Error updating cell:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete a cell from the worksheet
  public async deleteCell(req: Request, res: Response): Promise<void> {
    try {
      const { worksheetId, cellId } = req.params;

      // Fetch the worksheet from the database
      const worksheet = await Worksheet.findById(worksheetId);

      if (!worksheet) {
        res.status(404).json({ error: 'Worksheet not found' });
        return;
      }

      // Remove the cell from the worksheet
      const removed = worksheet.removeCell(cellId);

      if (!removed) {
        res.status(404).json({ error: 'Cell not found' });
        return;
      }

      // Update dependent cells and formulas
      this.calculationEngine.updateDependencies(worksheet, cellId);

      // Save the updated worksheet
      await worksheet.save();

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting cell:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Add a new chart to the worksheet
  public async addChart(req: Request, res: Response): Promise<void> {
    try {
      const { worksheetId } = req.params;
      const chartData = req.body;

      // Validate the chart data
      if (!chartData.type || !chartData.dataRange) {
        res.status(400).json({ error: 'Chart type and data range are required' });
        return;
      }

      // Fetch the worksheet from the database
      const worksheet = await Worksheet.findById(worksheetId);

      if (!worksheet) {
        res.status(404).json({ error: 'Worksheet not found' });
        return;
      }

      // Create a new Chart instance
      const chart = new Chart(chartData);

      // Add the chart to the worksheet
      worksheet.addChart(chart);

      // Use the ChartingEngine to generate the chart
      this.chartingEngine.generateChart(chart, worksheet);

      // Save the updated worksheet
      await worksheet.save();

      res.status(201).json(chart);
    } catch (error) {
      console.error('Error adding chart:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update an existing chart in the worksheet
  public async updateChart(req: Request, res: Response): Promise<void> {
    try {
      const { worksheetId, chartId } = req.params;
      const updateData = req.body;

      // Validate the update data
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: 'No update data provided' });
        return;
      }

      // Fetch the worksheet from the database
      const worksheet = await Worksheet.findById(worksheetId);

      if (!worksheet) {
        res.status(404).json({ error: 'Worksheet not found' });
        return;
      }

      // Find the chart in the worksheet
      const chart = worksheet.getChartById(chartId);

      if (!chart) {
        res.status(404).json({ error: 'Chart not found' });
        return;
      }

      // Update the chart properties
      Object.assign(chart, updateData);

      // Use the ChartingEngine to update the chart
      this.chartingEngine.updateChart(chart, worksheet);

      // Save the updated worksheet
      await worksheet.save();

      res.status(200).json(chart);
    } catch (error) {
      console.error('Error updating chart:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete a chart from the worksheet
  public async deleteChart(req: Request, res: Response): Promise<void> {
    try {
      const { worksheetId, chartId } = req.params;

      // Fetch the worksheet from the database
      const worksheet = await Worksheet.findById(worksheetId);

      if (!worksheet) {
        res.status(404).json({ error: 'Worksheet not found' });
        return;
      }

      // Remove the chart from the worksheet
      const removed = worksheet.removeChart(chartId);

      if (!removed) {
        res.status(404).json({ error: 'Chart not found' });
        return;
      }

      // Save the updated worksheet
      await worksheet.save();

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting chart:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new WorksheetController();

// Human tasks:
// TODO: Implement error handling and logging for all controller functions
// TODO: Add input validation and sanitization for all incoming data
// TODO: Implement pagination for retrieving large worksheets
// TODO: Add support for bulk operations (e.g., updating multiple cells at once)
// TODO: Implement caching mechanism for frequently accessed worksheets