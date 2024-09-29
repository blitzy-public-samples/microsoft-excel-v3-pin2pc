import { Schema, model, Document } from 'mongoose';
import { BaseModel } from '../models/baseModel';
import { IWorksheet } from '../interfaces/IDataStorage';
import { Cell } from './cell';
import { Chart } from './chart';
import { Workbook } from './workbook';
import { WorksheetCreate, WorksheetUpdate } from '../types/dbTypes';

// Define the Worksheet schema
const worksheetSchema = new Schema<IWorksheet>({
  name: { type: String, required: true },
  index: { type: Number, required: true },
  workbook: { type: Schema.Types.ObjectId, ref: 'Workbook', required: true },
  cells: [{ type: Schema.Types.ObjectId, ref: 'Cell' }],
  charts: [{ type: Schema.Types.ObjectId, ref: 'Chart' }],
}, {
  timestamps: true,
});

// Create indexes for frequently queried fields
worksheetSchema.index({ name: 1 });
worksheetSchema.index({ index: 1 });
worksheetSchema.index({ workbook: 1 });

// Extend the Worksheet class from BaseModel
export class Worksheet extends BaseModel<IWorksheet> {
  constructor() {
    super(worksheetSchema);
  }

  // Add a new cell to the worksheet
  async addCell(cell: Cell): Promise<void> {
    // Validate the cell object
    if (!cell || !cell._id) {
      throw new Error('Invalid cell object');
    }

    // Add the cell to the cells array
    await this.model.findByIdAndUpdate(this._id, {
      $push: { cells: cell._id },
      $set: { updatedAt: new Date() }
    });
  }

  // Remove a cell from the worksheet
  async removeCell(cellId: string): Promise<void> {
    // Find the cell by ID
    const cell = await Cell.findById(cellId);
    if (!cell) {
      throw new Error('Cell not found');
    }

    // Remove the cell from the cells array
    await this.model.findByIdAndUpdate(this._id, {
      $pull: { cells: cellId },
      $set: { updatedAt: new Date() }
    });
  }

  // Add a new chart to the worksheet
  async addChart(chart: Chart): Promise<void> {
    // Validate the chart object
    if (!chart || !chart._id) {
      throw new Error('Invalid chart object');
    }

    // Add the chart to the charts array
    await this.model.findByIdAndUpdate(this._id, {
      $push: { charts: chart._id },
      $set: { updatedAt: new Date() }
    });
  }

  // Remove a chart from the worksheet
  async removeChart(chartId: string): Promise<void> {
    // Find the chart by ID
    const chart = await Chart.findById(chartId);
    if (!chart) {
      throw new Error('Chart not found');
    }

    // Remove the chart from the charts array
    await this.model.findByIdAndUpdate(this._id, {
      $pull: { charts: chartId },
      $set: { updatedAt: new Date() }
    });
  }

  // Retrieve a cell by its column and row
  async getCellByAddress(column: string, row: number): Promise<Cell | null> {
    const cells = await this.model.findById(this._id).populate('cells').exec();
    return cells?.cells.find((cell: Cell) => cell.column === column && cell.row === row) || null;
  }

  // Update the value of a cell
  async updateCellValue(cellId: string, value: any): Promise<void> {
    // Find the cell by ID
    const cell = await Cell.findById(cellId);
    if (!cell) {
      throw new Error('Cell not found');
    }

    // Update the cell's value
    await Cell.findByIdAndUpdate(cellId, { value, updatedAt: new Date() });

    // Update the worksheet's updatedAt timestamp
    await this.model.findByIdAndUpdate(this._id, { updatedAt: new Date() });
  }
}

// Create and export the Worksheet model
export default model<IWorksheet & Document>('Worksheet', worksheetSchema);

// Human tasks:
// TODO: Implement data validation logic for worksheet properties
// TODO: Add indexing for frequently queried fields (e.g., name, index)
// TODO: Implement access control checks in methods that modify the worksheet
// TODO: Optimize query performance for large worksheets with many cells and charts