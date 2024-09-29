import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

/**
 * Defines the base interface for all models in the application
 */
export interface IBaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Implements the IBaseModel interface and provides common functionality for all models
 */
@Injectable()
export class BaseModel implements IBaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Initializes a new instance of the BaseModel class
   * @param data Partial data to initialize the model
   */
  constructor(data: Partial<IBaseModel> = {}) {
    this.id = data.id || uuidv4();
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * Converts the model instance to a plain JavaScript object
   * @returns A plain JavaScript object representation of the model
   */
  toJSON(): object {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Validates the model instance
   * @returns True if the model is valid, false otherwise
   */
  validate(): boolean {
    // Check if all required properties are set
    if (!this.id || !this.createdAt || !this.updatedAt) {
      return false;
    }

    // Perform any additional validation logic
    // For now, we'll just check if the dates are valid
    if (!(this.createdAt instanceof Date) || !(this.updatedAt instanceof Date)) {
      return false;
    }

    return true;
  }
}

// Human tasks:
// TODO: Review and validate the BaseModel class to ensure it meets all requirements for the Excel-like application
// TODO: Determine if additional common properties or methods are needed for all models
// TODO: Implement specific validation logic in the validate method based on application requirements