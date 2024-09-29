import { Request, Response } from 'express';
import { Workbook } from '../models/workbook';
import { User } from '../models/user';
import { IDataStorage } from '../../src/database/interfaces/IDataStorage';
import { authorizationTypes } from '../../shared/security/authorizationTypes';

class WorkbookController {
  private dataStorage: IDataStorage;

  constructor(dataStorage: IDataStorage) {
    this.dataStorage = dataStorage;
  }

  /**
   * Creates a new workbook for the authenticated user.
   */
  public async createWorkbook(req: Request, res: Response): Promise<void> {
    try {
      const workbookData = req.body;
      const userId = (req.user as User).id;

      // Validate input data
      if (!workbookData.name) {
        res.status(400).json({ error: 'Workbook name is required' });
        return;
      }

      // Create new Workbook instance
      const newWorkbook = new Workbook({
        ...workbookData,
        ownerId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Save workbook to database
      const savedWorkbook = await this.dataStorage.createWorkbook(newWorkbook);

      res.status(201).json(savedWorkbook);
    } catch (error) {
      console.error('Error creating workbook:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Retrieves a specific workbook by ID for the authenticated user.
   */
  public async getWorkbook(req: Request, res: Response): Promise<void> {
    try {
      const workbookId = req.params.id;
      const userId = (req.user as User).id;

      // Fetch workbook from database
      const workbook = await this.dataStorage.getWorkbook(workbookId);

      if (!workbook) {
        res.status(404).json({ error: 'Workbook not found' });
        return;
      }

      // Check user's authorization to access the workbook
      if (workbook.ownerId !== userId && !workbook.sharedWith.includes(userId)) {
        res.status(403).json({ error: 'Unauthorized access to workbook' });
        return;
      }

      res.status(200).json(workbook);
    } catch (error) {
      console.error('Error retrieving workbook:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Updates an existing workbook with provided data.
   */
  public async updateWorkbook(req: Request, res: Response): Promise<void> {
    try {
      const workbookId = req.params.id;
      const updateData = req.body;
      const userId = (req.user as User).id;

      // Validate input data
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: 'No update data provided' });
        return;
      }

      // Fetch workbook from database
      const workbook = await this.dataStorage.getWorkbook(workbookId);

      if (!workbook) {
        res.status(404).json({ error: 'Workbook not found' });
        return;
      }

      // Check user's authorization to modify the workbook
      if (workbook.ownerId !== userId) {
        res.status(403).json({ error: 'Unauthorized to modify workbook' });
        return;
      }

      // Update workbook with new data
      const updatedWorkbook = {
        ...workbook,
        ...updateData,
        updatedAt: new Date(),
      };

      // Save updated workbook to database
      const savedWorkbook = await this.dataStorage.updateWorkbook(updatedWorkbook);

      res.status(200).json(savedWorkbook);
    } catch (error) {
      console.error('Error updating workbook:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Deletes a specific workbook by ID.
   */
  public async deleteWorkbook(req: Request, res: Response): Promise<void> {
    try {
      const workbookId = req.params.id;
      const userId = (req.user as User).id;

      // Fetch workbook from database
      const workbook = await this.dataStorage.getWorkbook(workbookId);

      if (!workbook) {
        res.status(404).json({ error: 'Workbook not found' });
        return;
      }

      // Check user's authorization to delete the workbook
      if (workbook.ownerId !== userId) {
        res.status(403).json({ error: 'Unauthorized to delete workbook' });
        return;
      }

      // Delete workbook from database
      await this.dataStorage.deleteWorkbook(workbookId);

      res.status(200).json({ message: 'Workbook deleted successfully' });
    } catch (error) {
      console.error('Error deleting workbook:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Shares a workbook with another user.
   */
  public async shareWorkbook(req: Request, res: Response): Promise<void> {
    try {
      const workbookId = req.params.id;
      const { targetUserId } = req.body;
      const userId = (req.user as User).id;

      if (!targetUserId) {
        res.status(400).json({ error: 'Target user ID is required' });
        return;
      }

      // Fetch workbook from database
      const workbook = await this.dataStorage.getWorkbook(workbookId);

      if (!workbook) {
        res.status(404).json({ error: 'Workbook not found' });
        return;
      }

      // Check user's authorization to share the workbook
      if (workbook.ownerId !== userId) {
        res.status(403).json({ error: 'Unauthorized to share workbook' });
        return;
      }

      // Fetch target user from database
      const targetUser = await this.dataStorage.getUser(targetUserId);

      if (!targetUser) {
        res.status(404).json({ error: 'Target user not found' });
        return;
      }

      // Add target user to workbook's sharedWith array
      if (!workbook.sharedWith.includes(targetUserId)) {
        workbook.sharedWith.push(targetUserId);
      }

      // Save updated workbook to database
      const updatedWorkbook = await this.dataStorage.updateWorkbook(workbook);

      res.status(200).json({ message: 'Workbook shared successfully', workbook: updatedWorkbook });
    } catch (error) {
      console.error('Error sharing workbook:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Removes sharing access for a user from a workbook.
   */
  public async unshareWorkbook(req: Request, res: Response): Promise<void> {
    try {
      const workbookId = req.params.id;
      const { targetUserId } = req.body;
      const userId = (req.user as User).id;

      if (!targetUserId) {
        res.status(400).json({ error: 'Target user ID is required' });
        return;
      }

      // Fetch workbook from database
      const workbook = await this.dataStorage.getWorkbook(workbookId);

      if (!workbook) {
        res.status(404).json({ error: 'Workbook not found' });
        return;
      }

      // Check user's authorization to modify sharing settings
      if (workbook.ownerId !== userId) {
        res.status(403).json({ error: 'Unauthorized to modify sharing settings' });
        return;
      }

      // Remove target user from workbook's sharedWith array
      workbook.sharedWith = workbook.sharedWith.filter(id => id !== targetUserId);

      // Save updated workbook to database
      const updatedWorkbook = await this.dataStorage.updateWorkbook(workbook);

      res.status(200).json({ message: 'Workbook unshared successfully', workbook: updatedWorkbook });
    } catch (error) {
      console.error('Error unsharing workbook:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Lists all workbooks accessible to the authenticated user.
   */
  public async listWorkbooks(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as User).id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Fetch all workbooks owned by or shared with the authenticated user
      const workbooks = await this.dataStorage.listWorkbooks(userId, page, limit);

      res.status(200).json(workbooks);
    } catch (error) {
      console.error('Error listing workbooks:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default WorkbookController;

// Human tasks:
// TODO: Implement robust error handling for all controller functions
// TODO: Add input validation for all request parameters and body data
// TODO: Implement proper logging for all controller actions
// TODO: Add unit tests for all controller functions
// TODO: Implement rate limiting for API endpoints
// TODO: Add support for bulk operations (e.g., batch create, update, delete)