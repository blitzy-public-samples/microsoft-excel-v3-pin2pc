import { Schema, model, Document } from 'mongoose';
import { BaseModel } from '../models/baseModel';
import { IChart } from '../interfaces/IDataStorage';
import { Worksheet } from './worksheet';
import { ChartCreate, ChartUpdate } from '../types/dbTypes';

// Chart schema
const chartSchema = new Schema<IChart>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  worksheet: { type: Schema.Types.ObjectId, ref: 'Worksheet', required: true },
  dataRange: { type: Object, required: true },
  options: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Chart model
export class Chart extends BaseModel implements IChart {
  id: string;
  title: string;
  type: string;
  worksheet: Worksheet;
  dataRange: object;
  options: object;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: ChartCreate) {
    super();
    this.id = data.id;
    this.title = data.title;
    this.type = data.type;
    this.worksheet = data.worksheet;
    this.dataRange = data.dataRange;
    this.options = data.options;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Update the title of the chart
  async updateTitle(newTitle: string): Promise<void> {
    // Validate the new title
    if (!newTitle || newTitle.trim().length === 0) {
      throw new Error('Invalid title');
    }

    // Update the title property
    this.title = newTitle.trim();
    this.updatedAt = new Date();

    // Save the chart
    await this.save();
  }

  // Update the data range of the chart
  async updateDataRange(newDataRange: object): Promise<void> {
    // Validate the new data range
    if (!newDataRange || Object.keys(newDataRange).length === 0) {
      throw new Error('Invalid data range');
    }

    // Update the dataRange property
    this.dataRange = newDataRange;
    this.updatedAt = new Date();

    // Save the chart
    await this.save();
  }

  // Update the options of the chart
  async updateOptions(newOptions: object): Promise<void> {
    // Validate the new options
    if (!newOptions || Object.keys(newOptions).length === 0) {
      throw new Error('Invalid options');
    }

    // Update the options property
    this.options = newOptions;
    this.updatedAt = new Date();

    // Save the chart
    await this.save();
  }

  // Retrieve the data from the worksheet based on the chart's data range
  async getDataFromWorksheet(): Promise<object> {
    // Get the associated worksheet
    const worksheet = await Worksheet.findById(this.worksheet);
    if (!worksheet) {
      throw new Error('Associated worksheet not found');
    }

    // Retrieve cells based on the dataRange
    const cells = await worksheet.getCellsInRange(this.dataRange);

    // Format the data according to the chart type
    const formattedData = this.formatDataForChartType(cells);

    return formattedData;
  }

  // Helper method to format data based on chart type
  private formatDataForChartType(cells: any[]): object {
    // Implementation depends on the specific chart types supported
    // This is a placeholder and should be implemented based on requirements
    return {
      labels: cells.map(cell => cell.column),
      datasets: [{
        data: cells.map(cell => cell.value)
      }]
    };
  }
}

// Create and export the Mongoose model
export default model<IChart & Document>('Chart', chartSchema);

// Commented list of human tasks
/*
Human tasks:
1. Implement data validation logic for chart properties (Required)
2. Add support for different chart types and their specific options (Required)
3. Implement access control checks in methods that modify the chart (Critical)
4. Optimize query performance for charts with large data ranges (Required)
*/