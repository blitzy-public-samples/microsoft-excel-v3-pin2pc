import { Request, Response } from 'express';
import { IApiService } from '../interfaces/IApiService';
import { ApiResponse, CreateWorkbookRequest, UpdateWorkbookRequest, ShareWorkbookRequest, WorkbookListResponse } from '../types/apiTypes';
import { Workbook } from '../../shared/types/workbook';

export class WorkbookController {
    private apiService: IApiService;

    constructor(apiService: IApiService) {
        this.apiService = apiService;
    }

    public async createWorkbook(req: Request, res: Response): Promise<void> {
        try {
            const createWorkbookRequest: CreateWorkbookRequest = req.body;
            const response: ApiResponse<Workbook> = await this.apiService.createWorkbook(createWorkbookRequest);
            res.json(response);
        } catch (error) {
            // Error handling should be implemented here
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async getWorkbook(req: Request, res: Response): Promise<void> {
        try {
            const workbookId: string = req.params.workbookId;
            const response: ApiResponse<Workbook> = await this.apiService.getWorkbook(workbookId);
            res.json(response);
        } catch (error) {
            // Error handling should be implemented here
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async updateWorkbook(req: Request, res: Response): Promise<void> {
        try {
            const updateWorkbookRequest: UpdateWorkbookRequest = req.body;
            const response: ApiResponse<Workbook> = await this.apiService.updateWorkbook(updateWorkbookRequest);
            res.json(response);
        } catch (error) {
            // Error handling should be implemented here
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async deleteWorkbook(req: Request, res: Response): Promise<void> {
        try {
            const workbookId: string = req.params.workbookId;
            const response: ApiResponse<void> = await this.apiService.deleteWorkbook(workbookId);
            res.json(response);
        } catch (error) {
            // Error handling should be implemented here
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async listWorkbooks(req: Request, res: Response): Promise<void> {
        try {
            const page: number = parseInt(req.query.page as string) || 1;
            const pageSize: number = parseInt(req.query.pageSize as string) || 10;
            const response: WorkbookListResponse = await this.apiService.listWorkbooks(page, pageSize);
            res.json(response);
        } catch (error) {
            // Error handling should be implemented here
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async shareWorkbook(req: Request, res: Response): Promise<void> {
        try {
            const shareWorkbookRequest: ShareWorkbookRequest = req.body;
            const response: ApiResponse<void> = await this.apiService.shareWorkbook(shareWorkbookRequest);
            res.json(response);
        } catch (error) {
            // Error handling should be implemented here
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

// Human tasks:
// 1. Implement error handling and input validation for all controller methods (Required)
// 2. Add authentication and authorization checks to ensure users have appropriate permissions for each operation (Critical)
// 3. Consider implementing request logging for auditing purposes (Optional)
// 4. Evaluate the need for additional workbook-related operations, such as copying or exporting workbooks (Optional)