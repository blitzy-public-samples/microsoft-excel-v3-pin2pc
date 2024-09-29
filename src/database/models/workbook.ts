import { Schema, model, Document } from 'mongoose';
import { BaseModel } from '../models/baseModel';
import { IWorkbook } from '../interfaces/IDataStorage';
import { Worksheet } from './worksheet';
import { User } from './user';
import { Version } from './version';

// Define the Workbook schema
const WorkbookSchema = new Schema<IWorkbook>({
  name: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  worksheets: [{ type: Schema.Types.ObjectId, ref: 'Worksheet' }],
  versions: [{ type: Schema.Types.ObjectId, ref: 'Version' }]
});

// Create the Workbook model
export const WorkbookModel = model<IWorkbook>('Workbook', WorkbookSchema);

// Define the Workbook class
export class Workbook extends BaseModel implements IWorkbook {
  id: string;
  name: string;
  createdDate: Date;
  modifiedDate: Date;
  owner: User;
  sharedWith: User[];
  worksheets: Worksheet[];
  versions: Version[];

  constructor(data: Partial<IWorkbook>) {
    super();
    Object.assign(this, data);
  }

  // Add a new worksheet to the workbook
  async addWorksheet(worksheet: Worksheet): Promise<void> {
    // Validate the worksheet object
    if (!(worksheet instanceof Worksheet)) {
      throw new Error('Invalid worksheet object');
    }

    // Add the worksheet to the worksheets array
    this.worksheets.push(worksheet);

    // Update the modifiedDate
    this.modifiedDate = new Date();

    // Save the workbook
    await this.save();
  }

  // Remove a worksheet from the workbook
  async removeWorksheet(worksheetId: string): Promise<void> {
    // Find the worksheet by ID
    const index = this.worksheets.findIndex(ws => ws.id === worksheetId);
    if (index === -1) {
      throw new Error('Worksheet not found');
    }

    // Remove the worksheet from the worksheets array
    this.worksheets.splice(index, 1);

    // Update the modifiedDate
    this.modifiedDate = new Date();

    // Save the workbook
    await this.save();
  }

  // Add a user to the sharedWith list
  async addSharedUser(user: User): Promise<void> {
    // Validate the user object
    if (!(user instanceof User)) {
      throw new Error('Invalid user object');
    }

    // Check if the user is already in the sharedWith list
    if (this.sharedWith.some(u => u.id === user.id)) {
      throw new Error('User is already shared with this workbook');
    }

    // Add the user to the sharedWith array
    this.sharedWith.push(user);

    // Update the modifiedDate
    this.modifiedDate = new Date();

    // Save the workbook
    await this.save();
  }

  // Remove a user from the sharedWith list
  async removeSharedUser(userId: string): Promise<void> {
    // Find the user by ID in the sharedWith list
    const index = this.sharedWith.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error('User not found in shared list');
    }

    // Remove the user from the sharedWith array
    this.sharedWith.splice(index, 1);

    // Update the modifiedDate
    this.modifiedDate = new Date();

    // Save the workbook
    await this.save();
  }

  // Create a new version of the workbook
  async createVersion(): Promise<Version> {
    // Create a new Version object with the current workbook state
    const newVersion = new Version({
      workbookId: this.id,
      versionNumber: this.versions.length + 1,
      timestamp: new Date(),
      state: JSON.stringify(this)
    });

    // Add the version to the versions array
    this.versions.push(newVersion);

    // Update the modifiedDate
    this.modifiedDate = new Date();

    // Save the workbook
    await this.save();

    return newVersion;
  }

  // Revert the workbook to a specific version
  async revertToVersion(versionId: string): Promise<void> {
    // Find the version by ID
    const version = this.versions.find(v => v.id === versionId);
    if (!version) {
      throw new Error('Version not found');
    }

    // Apply the version's state to the current workbook
    const versionState = JSON.parse(version.state);
    Object.assign(this, versionState);

    // Update the modifiedDate
    this.modifiedDate = new Date();

    // Save the workbook
    await this.save();
  }

  // Save the workbook to the database
  async save(): Promise<void> {
    await WorkbookModel.findByIdAndUpdate(this.id, this.toObject(), { new: true, upsert: true });
  }

  // Convert the Workbook instance to a plain object
  toObject(): object {
    return {
      id: this.id,
      name: this.name,
      createdDate: this.createdDate,
      modifiedDate: this.modifiedDate,
      owner: this.owner.id,
      sharedWith: this.sharedWith.map(u => u.id),
      worksheets: this.worksheets.map(ws => ws.id),
      versions: this.versions.map(v => v.id)
    };
  }
}

// Implement data validation logic for workbook properties
WorkbookSchema.pre('save', function(next) {
  // Add validation logic here
  // For example, check if the name is not empty
  if (!this.name || this.name.trim().length === 0) {
    next(new Error('Workbook name cannot be empty'));
  }
  next();
});

// Add indexing for frequently queried fields
WorkbookSchema.index({ name: 1, owner: 1 });

// Implement access control checks in methods that modify the workbook
// This should be done in a middleware or a service layer
// For example:
// export function checkWorkbookAccess(user: User, workbook: Workbook): boolean {
//   return workbook.owner.id === user.id || workbook.sharedWith.some(u => u.id === user.id);
// }

// Export the Workbook model
export { Workbook };