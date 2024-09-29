import axios from 'axios';
import { Client as OneDriveClient } from '@microsoft/microsoft-graph-client';
import { getConfig } from '../config/environment';

/**
 * Initializes and returns a OneDrive client instance
 * @param accessToken The access token for authentication
 * @returns Initialized OneDrive client
 */
export function initializeOneDriveClient(accessToken: string): OneDriveClient {
    return OneDriveClient.init({
        authProvider: (done) => {
            done(null, accessToken);
        }
    });
}

/**
 * Uploads a file to OneDrive
 * @param client Initialized OneDrive client
 * @param filePath The path where the file should be uploaded
 * @param fileContent The content of the file as a Buffer
 * @returns Promise resolving to the ID of the uploaded file
 */
export async function uploadFile(client: OneDriveClient, filePath: string, fileContent: Buffer): Promise<string> {
    try {
        const uploadSession = await client
            .api(`/me/drive/root:/${filePath}:/createUploadSession`)
            .post({});

        const uploadUrl = uploadSession.uploadUrl;
        const maxChunkSize = 320 * 1024; // 320 KB chunk size

        for (let i = 0; i < fileContent.length; i += maxChunkSize) {
            const chunk = fileContent.slice(i, Math.min(i + maxChunkSize, fileContent.length));
            await axios.put(uploadUrl, chunk, {
                headers: {
                    'Content-Length': chunk.length,
                    'Content-Range': `bytes ${i}-${i + chunk.length - 1}/${fileContent.length}`
                }
            });
        }

        const result = await client
            .api(`/me/drive/root:/${filePath}`)
            .get();

        return result.id;
    } catch (error) {
        console.error('Error uploading file to OneDrive:', error);
        throw error;
    }
}

/**
 * Downloads a file from OneDrive
 * @param client Initialized OneDrive client
 * @param fileId The ID of the file to download
 * @returns Promise resolving to the content of the downloaded file as a Buffer
 */
export async function downloadFile(client: OneDriveClient, fileId: string): Promise<Buffer> {
    try {
        const downloadUrl = await client
            .api(`/me/drive/items/${fileId}/content`)
            .getStream();

        const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
        return Buffer.from(response.data);
    } catch (error) {
        console.error('Error downloading file from OneDrive:', error);
        throw error;
    }
}

/**
 * Lists files in a specific OneDrive folder
 * @param client Initialized OneDrive client
 * @param folderId The ID of the folder to list files from
 * @returns Promise resolving to an array of file metadata objects
 */
export async function listFiles(client: OneDriveClient, folderId: string): Promise<Array<object>> {
    try {
        const result = await client
            .api(`/me/drive/items/${folderId}/children`)
            .get();

        return result.value.map((item: any) => ({
            id: item.id,
            name: item.name,
            size: item.size,
            lastModifiedDateTime: item.lastModifiedDateTime
        }));
    } catch (error) {
        console.error('Error listing files from OneDrive:', error);
        throw error;
    }
}

/**
 * Deletes a file from OneDrive
 * @param client Initialized OneDrive client
 * @param fileId The ID of the file to delete
 * @returns Promise resolving to void
 */
export async function deleteFile(client: OneDriveClient, fileId: string): Promise<void> {
    try {
        await client
            .api(`/me/drive/items/${fileId}`)
            .delete();
    } catch (error) {
        console.error('Error deleting file from OneDrive:', error);
        throw error;
    }
}

/**
 * Synchronizes a file between local storage and OneDrive
 * @param client Initialized OneDrive client
 * @param localFilePath The path of the local file
 * @param oneDriveFileId The ID of the file on OneDrive
 * @returns Promise resolving to void
 */
export async function syncFile(client: OneDriveClient, localFilePath: string, oneDriveFileId: string): Promise<void> {
    try {
        const localFileStats = await getLocalFileStats(localFilePath);
        const oneDriveFileInfo = await client
            .api(`/me/drive/items/${oneDriveFileId}`)
            .get();

        if (new Date(localFileStats.mtime) > new Date(oneDriveFileInfo.lastModifiedDateTime)) {
            const fileContent = await readLocalFile(localFilePath);
            await uploadFile(client, oneDriveFileInfo.name, fileContent);
        } else if (new Date(localFileStats.mtime) < new Date(oneDriveFileInfo.lastModifiedDateTime)) {
            const fileContent = await downloadFile(client, oneDriveFileId);
            await writeLocalFile(localFilePath, fileContent);
        }

        // Update local file metadata
        await updateLocalFileMetadata(localFilePath, oneDriveFileInfo.lastModifiedDateTime);
    } catch (error) {
        console.error('Error syncing file with OneDrive:', error);
        throw error;
    }
}

// Helper functions (these would need to be implemented or imported)
async function getLocalFileStats(filePath: string): Promise<any> {
    // Implementation needed
    throw new Error('Not implemented');
}

async function readLocalFile(filePath: string): Promise<Buffer> {
    // Implementation needed
    throw new Error('Not implemented');
}

async function writeLocalFile(filePath: string, content: Buffer): Promise<void> {
    // Implementation needed
    throw new Error('Not implemented');
}

async function updateLocalFileMetadata(filePath: string, lastModifiedDateTime: string): Promise<void> {
    // Implementation needed
    throw new Error('Not implemented');
}

// List of human tasks
/**
 * Human tasks:
 * 1. Implement proper error handling and retry mechanisms for OneDrive API calls
 * 2. Set up OAuth 2.0 authentication flow for obtaining OneDrive access tokens
 * 3. Implement rate limiting to comply with OneDrive API usage limits
 * 4. Create unit and integration tests for OneDrive integration functions
 * 5. Implement logging for OneDrive operations for debugging and auditing purposes
 */