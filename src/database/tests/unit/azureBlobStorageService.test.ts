import { AzureBlobStorageService } from '../../services/azureBlobStorageService';
import { DbTypes } from '../../types/dbTypes';
import { DB_CONSTANTS } from '../../constants/dbConstants';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { jest } from '@jest/globals';

describe('AzureBlobStorageService', () => {
  let azureBlobStorageService: AzureBlobStorageService;
  let mockBlobServiceClient: jest.Mocked<BlobServiceClient>;
  let mockContainerClient: jest.Mocked<ContainerClient>;

  beforeEach(() => {
    mockBlobServiceClient = mockBlobServiceClient();
    mockContainerClient = mockContainerClient();
    azureBlobStorageService = new AzureBlobStorageService(mockBlobServiceClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadBlob', () => {
    it('should upload a blob successfully', async () => {
      const blobName = 'test-blob';
      const content = 'Test content';

      await azureBlobStorageService.uploadBlob(blobName, content);

      expect(mockContainerClient.getBlockBlobClient).toHaveBeenCalledWith(blobName);
      expect(mockContainerClient.getBlockBlobClient(blobName).upload).toHaveBeenCalledWith(content, content.length);
    });

    it('should throw an error if upload fails', async () => {
      const blobName = 'test-blob';
      const content = 'Test content';
      const error = new Error('Upload failed');

      mockContainerClient.getBlockBlobClient(blobName).upload.mockRejectedValue(error);

      await expect(azureBlobStorageService.uploadBlob(blobName, content)).rejects.toThrow('Upload failed');
    });
  });

  describe('downloadBlob', () => {
    it('should download a blob successfully', async () => {
      const blobName = 'test-blob';
      const content = 'Test content';

      mockContainerClient.getBlockBlobClient(blobName).download.mockResolvedValue({
        readableStreamBody: Buffer.from(content),
      } as any);

      const result = await azureBlobStorageService.downloadBlob(blobName);

      expect(mockContainerClient.getBlockBlobClient).toHaveBeenCalledWith(blobName);
      expect(mockContainerClient.getBlockBlobClient(blobName).download).toHaveBeenCalled();
      expect(result).toBe(content);
    });

    it('should throw an error if download fails', async () => {
      const blobName = 'test-blob';
      const error = new Error('Download failed');

      mockContainerClient.getBlockBlobClient(blobName).download.mockRejectedValue(error);

      await expect(azureBlobStorageService.downloadBlob(blobName)).rejects.toThrow('Download failed');
    });
  });

  describe('deleteBlob', () => {
    it('should delete a blob successfully', async () => {
      const blobName = 'test-blob';

      await azureBlobStorageService.deleteBlob(blobName);

      expect(mockContainerClient.getBlockBlobClient).toHaveBeenCalledWith(blobName);
      expect(mockContainerClient.getBlockBlobClient(blobName).delete).toHaveBeenCalled();
    });

    it('should throw an error if delete fails', async () => {
      const blobName = 'test-blob';
      const error = new Error('Delete failed');

      mockContainerClient.getBlockBlobClient(blobName).delete.mockRejectedValue(error);

      await expect(azureBlobStorageService.deleteBlob(blobName)).rejects.toThrow('Delete failed');
    });
  });

  describe('listBlobs', () => {
    it('should list blobs successfully', async () => {
      const blobs = [
        { name: 'blob1' },
        { name: 'blob2' },
        { name: 'blob3' },
      ];

      mockContainerClient.listBlobsFlat.mockReturnValue(blobs as any);

      const result = await azureBlobStorageService.listBlobs();

      expect(mockContainerClient.listBlobsFlat).toHaveBeenCalled();
      expect(result).toEqual(blobs.map(blob => blob.name));
    });

    it('should throw an error if listing blobs fails', async () => {
      const error = new Error('Listing blobs failed');

      mockContainerClient.listBlobsFlat.mockRejectedValue(error);

      await expect(azureBlobStorageService.listBlobs()).rejects.toThrow('Listing blobs failed');
    });
  });
});

function mockBlobServiceClient(): jest.Mocked<BlobServiceClient> {
  return {
    getContainerClient: jest.fn().mockReturnValue(mockContainerClient()),
  } as any;
}

function mockContainerClient(): jest.Mocked<ContainerClient> {
  return {
    getBlockBlobClient: jest.fn().mockReturnValue({
      upload: jest.fn().mockResolvedValue({}),
      download: jest.fn().mockResolvedValue({ readableStreamBody: Buffer.from('') }),
      delete: jest.fn().mockResolvedValue({}),
    }),
    listBlobsFlat: jest.fn().mockResolvedValue([]),
  } as any;
}

// Human tasks:
// 1. Implement comprehensive error handling tests for Azure Blob Storage operations
// 2. Add performance tests to ensure efficient blob operations
// 3. Create integration tests with actual Azure Blob Storage for end-to-end validation