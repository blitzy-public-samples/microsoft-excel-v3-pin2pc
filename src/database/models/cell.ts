import { Schema, model, Document } from 'mongoose';
import { BaseModel } from '../models/baseModel';
import { ICell } from '../interfaces/IDataStorage';
import { Worksheet } from './worksheet';
import { Formula } from './formula';
import { CellCreate, CellUpdate, CellValue } from '../types/dbTypes';

// Define the Cell schema
const cellSchema = new Schema<ICell>({
  column: { type: String, required: true },
  row: { type: Number, required: true },
  value: { type: Schema.Types.Mixed, default: null },
  dataType: { type: String, default: 'empty' },
  worksheet: { type: Schema.Types.ObjectId, ref: 'Worksheet', required: true },
  formula: { type: Schema.Types.ObjectId, ref: 'Formula' },
  style: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Create indexes for frequently queried fields
cellSchema.index({ worksheet: 1, column: 1, row: 1 }, { unique: true });

// Cell class extending BaseModel and implementing ICell
export class Cell extends BaseModel implements ICell {
  column!: string;
  row!: number;
  value!: CellValue;
  dataType!: string;
  worksheet!: Worksheet;
  formula?: Formula;
  style!: object;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: CellCreate) {
    super();
    Object.assign(this, data);
  }

  // Set the value of the cell
  async setValue(value: CellValue): Promise<void> {
    // TODO: Implement data validation logic
    this.value = value;
    this.updateDataType();
    this.formula = undefined;
    this.updatedAt = new Date();
    await this.save();
  }

  // Set the formula for the cell
  async setFormula(formula: Formula): Promise<void> {
    // TODO: Implement formula validation logic
    this.formula = formula;
    this.value = await this.calculateFormulaValue();
    this.updateDataType();
    this.updatedAt = new Date();
    await this.save();
  }

  // Clear the contents of the cell
  async clearContents(): Promise<void> {
    this.value = null;
    this.formula = undefined;
    this.dataType = 'empty';
    this.updatedAt = new Date();
    await this.save();
  }

  // Set the style of the cell
  async setStyle(style: object): Promise<void> {
    // TODO: Implement style validation logic
    this.style = { ...this.style, ...style };
    this.updatedAt = new Date();
    await this.save();
  }

  // Get the formatted value of the cell
  getFormattedValue(): string {
    // TODO: Implement formatting logic based on dataType and style
    return String(this.value);
  }

  // Private method to update the dataType based on the value
  private updateDataType(): void {
    if (this.value === null) {
      this.dataType = 'empty';
    } else if (typeof this.value === 'number') {
      this.dataType = 'number';
    } else if (typeof this.value === 'boolean') {
      this.dataType = 'boolean';
    } else if (this.value instanceof Date) {
      this.dataType = 'date';
    } else {
      this.dataType = 'string';
    }
  }

  // Private method to calculate the value based on the formula
  private async calculateFormulaValue(): Promise<CellValue> {
    // TODO: Implement formula calculation logic
    return null;
  }
}

// Create and export the Mongoose model
export const CellModel = model<ICell>('Cell', cellSchema);

// Human tasks:
// TODO: Implement data validation logic for cell properties
// TODO: Add indexing for frequently queried fields (e.g., column, row)
// TODO: Implement access control checks in methods that modify the cell
// TODO: Optimize storage for large worksheets with many cells
// TODO: Implement caching mechanism for frequently accessed cells