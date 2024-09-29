import { injectable, inject } from 'inversify';
import { IApiService } from '../interfaces/IApiService';
import { ApiResponse, CreateWorkbookRequest, UpdateWorkbookRequest, ShareWorkbookRequest, WorkbookListResponse } from '../types/apiTypes';
import { Workbook } from '../../shared/types/workbook';
import { IDataStorage } from '../../shared/interfaces/IDataStorage';

@injectable()
export class WorkbookService implements IApiService {
    constructor(
        @inject('IDataStorage') private dataStorage: IDataStorage
    ) {}

    async createWorkbook(request: CreateWorkbookRequest): Promise<ApiResponse<Workbook>> {
        try {
            // Validate the request data
            this.validateCreateWorkbookRequest(request);

            // Create a new Workbook instance with the provided data
            const newWorkbook = new Workbook(request);

            // Save the workbook using the dataStorage service
            const savedWorkbook = await this.dataStorage.saveWorkbook(newWorkbook);

            // Return the created workbook wrapped in an ApiResponse
            return {
                success: true,
                data: savedWorkbook,
                message: 'Workbook created successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getWorkbook(workbookId: string): Promise<ApiResponse<Workbook>> {
        try {
            // Validate the workbookId
            if (!workbookId) {
                throw new Error('Invalid workbook ID');
            }

            // Retrieve the workbook from the dataStorage service
            const workbook = await this.dataStorage.getWorkbook(workbookId);

            if (!workbook) {
                return {
                    success: false,
                    error: 'Workbook not found'
                };
            }

            // Return the workbook wrapped in an ApiResponse
            return {
                success: true,
                data: workbook
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updateWorkbook(request: UpdateWorkbookRequest): Promise<ApiResponse<Workbook>> {
        try {
            // Validate the request data
            this.validateUpdateWorkbookRequest(request);

            // Retrieve the existing workbook from the dataStorage service
            const existingWorkbook = await this.dataStorage.getWorkbook(request.id);

            if (!existingWorkbook) {
                return {
                    success: false,
                    error: 'Workbook not found'
                };
            }

            // Update the workbook with the provided data
            Object.assign(existingWorkbook, request);

            // Save the updated workbook using the dataStorage service
            const updatedWorkbook = await this.dataStorage.updateWorkbook(existingWorkbook);

            // Return the updated workbook wrapped in an ApiResponse
            return {
                success: true,
                data: updatedWorkbook,
                message: 'Workbook updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deleteWorkbook(workbookId: string): Promise<ApiResponse<void>> {
        try {
            // Validate the workbookId
            if (!workbookId) {
                throw new Error('Invalid workbook ID');
            }

            // Delete the workbook using the dataStorage service
            await this.dataStorage.deleteWorkbook(workbookId);

            // Return a success response
            return {
                success: true,
                message: 'Workbook deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async listWorkbooks(page: number, pageSize: number): Promise<WorkbookListResponse> {
        try {
            // Validate the pagination parameters
            this.validatePaginationParams(page, pageSize);

            // Retrieve the workbooks from the dataStorage service with pagination
            const { workbooks, totalCount } = await this.dataStorage.listWorkbooks(page, pageSize);

            // Return the workbooks and total count wrapped in a WorkbookListResponse
            return {
                success: true,
                data: workbooks,
                totalCount,
                page,
                pageSize
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                totalCount: 0,
                page,
                pageSize
            };
        }
    }

    async shareWorkbook(request: ShareWorkbookRequest): Promise<ApiResponse<void>> {
        try {
            // Validate the request data
            this.validateShareWorkbookRequest(request);

            // Retrieve the workbook from the dataStorage service
            const workbook = await this.dataStorage.getWorkbook(request.workbookId);

            if (!workbook) {
                return {
                    success: false,
                    error: 'Workbook not found'
                };
            }

            // Check if the current user has permission to share the workbook
            if (!this.hasSharePermission(workbook, request.userId)) {
                return {
                    success: false,
                    error: 'You do not have permission to share this workbook'
                };
            }

            // Add the specified user to the workbook's shared users list with the given role
            await this.dataStorage.shareWorkbook(request.workbookId, request.sharedUserId, request.role);

            // Return a success response
            return {
                success: true,
                message: 'Workbook shared successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    private validateCreateWorkbookRequest(request: CreateWorkbookRequest): void {
        // Implement validation logic for create workbook request
        // Throw an error if validation fails
    }

    private validateUpdateWorkbookRequest(request: UpdateWorkbookRequest): void {
        // Implement validation logic for update workbook request
        // Throw an error if validation fails
    }

    private validatePaginationParams(page: number, pageSize: number): void {
        if (page < 1 || pageSize < 1) {
            throw new Error('Invalid pagination parameters');
        }
    }

    private validateShareWorkbookRequest(request: ShareWorkbookRequest): void {
        // Implement validation logic for share workbook request
        // Throw an error if validation fails
    }

    private hasSharePermission(workbook: Workbook, userId: string): boolean {
        // Implement logic to check if the user has permission to share the workbook
        // Return true if the user has permission, false otherwise
        return true; // Placeholder implementation
    }
}

// Human tasks:
// TODO: Implement error handling and logging for each method
// TODO: Add input validation for all method parameters
// TODO: Implement caching mechanism for frequently accessed workbooks
// TODO: Add support for workbook templates and duplication
// TODO: Implement versioning for workbooks to support undo/redo functionality