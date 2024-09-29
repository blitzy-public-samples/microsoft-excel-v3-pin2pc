import mongoose, { Schema, Document } from 'mongoose';
import { Worksheet } from './worksheet';
import { User } from './user';

// Interface to define the structure of a Workbook document
export interface IWorkbook extends Document {
  name: string;
  createdDate: Date;
  modifiedDate: Date;
  owner: User['_id'];
  sharedWith: User['_id'][];
  worksheets: Worksheet['_id'][];
  version: string;
  addWorksheet(worksheet: Worksheet): void;
  removeWorksheet(worksheetId: string): boolean;
  share(user: User): void;
  unshare(userId: string): boolean;
}

// Workbook schema definition
const WorkbookSchema: Schema = new Schema({
  name: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  worksheets: [{ type: Schema.Types.ObjectId, ref: 'Worksheet' }],
  version: { type: String, default: '1.0' }
});

// Add methods to the Workbook schema
WorkbookSchema.methods.addWorksheet = function(worksheet: Worksheet): void {
  this.worksheets.push(worksheet._id);
  this.modifiedDate = new Date();
};

WorkbookSchema.methods.removeWorksheet = function(worksheetId: string): boolean {
  const index = this.worksheets.indexOf(worksheetId);
  if (index > -1) {
    this.worksheets.splice(index, 1);
    this.modifiedDate = new Date();
    return true;
  }
  return false;
};

WorkbookSchema.methods.share = function(user: User): void {
  if (!this.sharedWith.includes(user._id)) {
    this.sharedWith.push(user._id);
    this.modifiedDate = new Date();
  }
};

WorkbookSchema.methods.unshare = function(userId: string): boolean {
  const index = this.sharedWith.indexOf(userId);
  if (index > -1) {
    this.sharedWith.splice(index, 1);
    this.modifiedDate = new Date();
    return true;
  }
  return false;
};

// Create and export the Workbook model
export const Workbook = mongoose.model<IWorkbook>('Workbook', WorkbookSchema);

// TODO: Implement data validation for workbook properties
// TODO: Add methods for version control and conflict resolution
// TODO: Implement access control checks in share and unshare methods