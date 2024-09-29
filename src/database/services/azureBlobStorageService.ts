import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { IDataStorage } from "../interfaces/IDataStorage";
import { DbTypes } from "../types/dbTypes";
import { DB_CONSTANTS } from "../constants/dbConstants";

export class AzureBlobStorageService implements IDataStorage {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;

  constructor(connectionString: string) {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient = this.blobServiceClient.getContainerClient(DB_CONSTANTS.CONTAINER_NAME);
  }

  async createWorkbook(workbook: DbTypes.WorkbookCreate): Promise<DbTypes.Workbook> {
    const id = this.generateUniqueId();
    const blobName = `workbooks/${id}.json`;
    const content = JSON.stringify({ ...workbook, id });
    
    await this.containerClient.getBlockBlobClient(blobName).upload(content, content.length);
    
    return { ...workbook, id };
  }

  async getWorkbook(id: string): Promise<DbTypes.Workbook | null> {
    const blobName = `workbooks/${id}.json`;
    const blobClient = this.containerClient.getBlockBlobClient(blobName);
    
    try {
      const downloadResponse = await blobClient.download();
      const content = await this.streamToString(downloadResponse.readableStreamBody);
      return JSON.parse(content);
    } catch (error) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async updateWorkbook(id: string, workbook: DbTypes.WorkbookUpdate): Promise<DbTypes.Workbook> {
    const blobName = `workbooks/${id}.json`;
    const blobClient = this.containerClient.getBlockBlobClient(blobName);
    
    const existingWorkbook = await this.getWorkbook(id);
    if (!existingWorkbook) {
      throw new Error(`Workbook with id ${id} not found`);
    }
    
    const updatedWorkbook = { ...existingWorkbook, ...workbook };
    const content = JSON.stringify(updatedWorkbook);
    
    await blobClient.upload(content, content.length, { overwrite: true });
    
    return updatedWorkbook;
  }

  async deleteWorkbook(id: string): Promise<void> {
    const blobName = `workbooks/${id}.json`;
    await this.containerClient.getBlockBlobClient(blobName).delete();
    
    // Delete related worksheets, cells, formulas, and charts
    const prefix = `workbooks/${id}/`;
    for await (const blob of this.containerClient.listBlobsFlat({ prefix })) {
      await this.containerClient.getBlockBlobClient(blob.name).delete();
    }
  }

  async createWorksheet(workbookId: string, worksheet: DbTypes.WorksheetCreate): Promise<DbTypes.Worksheet> {
    const id = this.generateUniqueId();
    const blobName = `workbooks/${workbookId}/worksheets/${id}.json`;
    const content = JSON.stringify({ ...worksheet, id });
    
    await this.containerClient.getBlockBlobClient(blobName).upload(content, content.length);
    
    // Update the parent workbook to include the new worksheet ID
    const workbook = await this.getWorkbook(workbookId);
    if (workbook) {
      workbook.worksheetIds = [...(workbook.worksheetIds || []), id];
      await this.updateWorkbook(workbookId, workbook);
    }
    
    return { ...worksheet, id };
  }

  async getWorksheet(id: string): Promise<DbTypes.Worksheet | null> {
    const blobName = `workbooks/*/worksheets/${id}.json`;
    const blobItems = this.containerClient.listBlobsFlat({ prefix: 'workbooks/' });
    
    for await (const blob of blobItems) {
      if (blob.name.endsWith(`/worksheets/${id}.json`)) {
        const downloadResponse = await this.containerClient.getBlockBlobClient(blob.name).download();
        const content = await this.streamToString(downloadResponse.readableStreamBody);
        return JSON.parse(content);
      }
    }
    
    return null;
  }

  async updateWorksheet(id: string, worksheet: DbTypes.WorksheetUpdate): Promise<DbTypes.Worksheet> {
    const existingWorksheet = await this.getWorksheet(id);
    if (!existingWorksheet) {
      throw new Error(`Worksheet with id ${id} not found`);
    }
    
    const blobName = `workbooks/${existingWorksheet.workbookId}/worksheets/${id}.json`;
    const updatedWorksheet = { ...existingWorksheet, ...worksheet };
    const content = JSON.stringify(updatedWorksheet);
    
    await this.containerClient.getBlockBlobClient(blobName).upload(content, content.length, { overwrite: true });
    
    return updatedWorksheet;
  }

  async deleteWorksheet(id: string): Promise<void> {
    const worksheet = await this.getWorksheet(id);
    if (!worksheet) {
      throw new Error(`Worksheet with id ${id} not found`);
    }
    
    const blobName = `workbooks/${worksheet.workbookId}/worksheets/${id}.json`;
    await this.containerClient.getBlockBlobClient(blobName).delete();
    
    // Delete related cells, formulas, and charts
    const prefix = `workbooks/${worksheet.workbookId}/worksheets/${id}/`;
    for await (const blob of this.containerClient.listBlobsFlat({ prefix })) {
      await this.containerClient.getBlockBlobClient(blob.name).delete();
    }
    
    // Update the parent workbook to remove the worksheet ID
    const workbook = await this.getWorkbook(worksheet.workbookId);
    if (workbook) {
      workbook.worksheetIds = workbook.worksheetIds.filter(wsId => wsId !== id);
      await this.updateWorkbook(worksheet.workbookId, workbook);
    }
  }

  // Implement other methods (createCell, getCell, updateCell, deleteCell, etc.) following a similar pattern

  async beginTransaction(): Promise<void> {
    console.warn("Transactions are not supported in Azure Blob Storage");
  }

  async commitTransaction(): Promise<void> {
    console.warn("Transactions are not supported in Azure Blob Storage");
  }

  async rollbackTransaction(): Promise<void> {
    console.warn("Transactions are not supported in Azure Blob Storage");
  }

  private generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private async streamToString(readableStream: NodeJS.ReadableStream | undefined): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!readableStream) {
        reject(new Error("Readable stream is undefined"));
        return;
      }
      
      const chunks: any[] = [];
      readableStream.on("data", (data) => {
        chunks.push(data.toString());
      });
      readableStream.on("end", () => {
        resolve(chunks.join(""));
      });
      readableStream.on("error", reject);
    });
  }
}

// Human tasks:
// TODO: Implement error handling and retry logic for Azure Blob Storage operations
// TODO: Optimize blob naming conventions and folder structure for efficient querying and management
// TODO: Implement caching mechanisms to improve read performance for frequently accessed data
// TODO: Develop a strategy for handling concurrent updates and potential conflicts in Blob Storage
// TODO: Implement data compression techniques to reduce storage costs and improve transfer speeds
// TODO: Create a mechanism for periodic backups and point-in-time recovery of Blob Storage data