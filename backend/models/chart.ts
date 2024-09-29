import mongoose, { Schema, Document } from 'mongoose';
import { Worksheet } from './worksheet'; // Assuming Worksheet model exists

// Interface to define the structure of a Chart document
export interface IChart extends Document {
  id: string;
  type: string;
  title: string;
  dataRange: object;
  options: object;
  createdDate: Date;
  modifiedDate: Date;
  worksheetId: string;
  updateDataRange(newDataRange: object): void;
  updateOptions(newOptions: object): void;
  getChartData(): Promise<object>;
}

// Schema definition for the Chart model
const ChartSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  dataRange: { type: Object, required: true },
  options: { type: Object, required: true },
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
  worksheetId: { type: String, required: true }
});

// Method to update the data range of the chart
ChartSchema.methods.updateDataRange = function(newDataRange: object): void {
  // TODO: Implement data validation for the new data range
  this.dataRange = newDataRange;
  this.modifiedDate = new Date();
};

// Method to update the chart options
ChartSchema.methods.updateOptions = function(newOptions: object): void {
  // TODO: Implement validation for the updated options
  this.options = { ...this.options, ...newOptions };
  this.modifiedDate = new Date();
};

// Method to retrieve the chart data based on its data range
ChartSchema.methods.getChartData = async function(): Promise<object> {
  try {
    const worksheet = await Worksheet.findById(this.worksheetId);
    if (!worksheet) {
      throw new Error('Associated worksheet not found');
    }
    
    // TODO: Implement logic to retrieve cells within the chart's data range
    // TODO: Format the data according to the chart type
    
    // Placeholder return, replace with actual formatted chart data
    return {
      type: this.type,
      data: {
        // Formatted data based on the chart type and data range
      }
    };
  } catch (error) {
    console.error('Error retrieving chart data:', error);
    throw error;
  }
};

// Create and export the Chart model
export const Chart = mongoose.model<IChart>('Chart', ChartSchema);

// TODO: Implement data validation for chart properties
// TODO: Add support for more chart types and their specific options
// TODO: Implement logic for updating charts when underlying data changes
// TODO: Add methods for exporting charts as images or SVGs