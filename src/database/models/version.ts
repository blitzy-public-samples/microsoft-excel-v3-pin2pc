import { Schema, model, Document } from 'mongoose';
import { BaseModel } from '../models/baseModel';
import { IVersion } from '../interfaces/IDataStorage';
import { Workbook } from './workbook';

export interface VersionDocument extends IVersion, Document {}

const versionSchema = new Schema<VersionDocument>({
  workbook: { type: Schema.Types.ObjectId, ref: 'Workbook', required: true },
  versionNumber: { type: Number, required: true },
  createdDate: { type: Date, default: Date.now },
  state: { type: Schema.Types.Mixed, required: true },
  description: { type: String },
});

versionSchema.index({ workbook: 1, versionNumber: 1 }, { unique: true });

export class Version extends BaseModel<VersionDocument> implements IVersion {
  constructor() {
    super('Version', versionSchema);
  }

  async createVersion(workbook: Workbook, state: object, description?: string): Promise<VersionDocument> {
    // Validate the workbook and state objects
    if (!workbook || !state) {
      throw new Error('Workbook and state are required');
    }

    // Get the latest version number for the workbook
    const latestVersion = await this.model.findOne({ workbook: workbook._id }).sort('-versionNumber').exec();
    const newVersionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;

    // Create a new Version object with the provided data
    const newVersion = new this.model({
      workbook: workbook._id,
      versionNumber: newVersionNumber,
      state,
      description,
    });

    // Save the new version
    await newVersion.save();

    // Update the workbook's versions array
    await Workbook.findByIdAndUpdate(workbook._id, { $push: { versions: newVersion._id } });

    return newVersion;
  }

  async getVersions(workbookId: string): Promise<VersionDocument[]> {
    // Find all versions associated with the given workbookId
    const versions = await this.model.find({ workbook: workbookId }).sort('-versionNumber').exec();
    return versions;
  }

  async getVersion(workbookId: string, versionNumber: number): Promise<VersionDocument | null> {
    // Find the version with the given workbookId and versionNumber
    const version = await this.model.findOne({ workbook: workbookId, versionNumber }).exec();
    return version;
  }

  async deleteVersion(versionId: string): Promise<void> {
    // Find the version by ID
    const version = await this.model.findById(versionId).exec();
    if (!version) {
      throw new Error('Version not found');
    }

    // Remove the version from the database
    await version.remove();

    // Update the workbook's versions array
    await Workbook.findByIdAndUpdate(version.workbook, { $pull: { versions: versionId } });
  }
}

export const VersionModel = new Version().model;

// Human tasks (commented)
/*
TODO: Implement efficient storage mechanism for version states, possibly using delta compression
TODO: Add a cleanup mechanism to remove old versions based on retention policy
TODO: Implement access control checks to ensure only authorized users can create or delete versions
TODO: Add validation for the 'state' object to ensure it contains all necessary workbook data
*/