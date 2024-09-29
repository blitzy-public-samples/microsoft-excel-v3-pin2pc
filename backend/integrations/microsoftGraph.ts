import { Client, AuthenticationProvider } from "@microsoft/microsoft-graph-client";
import { getConfig } from "../config/environment";

/**
 * Service class for interacting with Microsoft Graph API
 */
class MicrosoftGraphService {
  private client: Client;

  /**
   * Initializes the Microsoft Graph client
   * @param accessToken - The access token for authentication
   */
  constructor(accessToken: string) {
    // Create an AuthenticationProvider using the provided access token
    const authProvider: AuthenticationProvider = (done) => {
      done(null, accessToken);
    };

    // Initialize the Microsoft Graph client with the authentication provider
    this.client = Client.init({
      authProvider,
    });
  }

  /**
   * Retrieves the user's profile information
   * @returns Promise<object> User profile data
   */
  async getUserProfile(): Promise<object> {
    try {
      // Make a GET request to /me endpoint
      const response = await this.client.api("/me").get();
      return response;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }

  /**
   * Retrieves a list of Excel workbooks from the user's OneDrive
   * @returns Promise<array> Array of workbook metadata
   */
  async getWorkbooks(): Promise<any[]> {
    try {
      // Make a GET request to /me/drive/root/search(q='.xlsx')
      const response = await this.client.api("/me/drive/root/search(q='.xlsx')").get();
      
      // Filter the results to include only Excel files
      const workbooks = response.value.filter((item: any) => item.file && item.file.mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      
      return workbooks;
    } catch (error) {
      console.error("Error fetching workbooks:", error);
      throw error;
    }
  }

  /**
   * Retrieves the content of a specific Excel workbook
   * @param workbookId - The ID of the workbook to retrieve
   * @returns Promise<object> Workbook content
   */
  async getWorkbookContent(workbookId: string): Promise<object> {
    try {
      // Make a GET request to /me/drive/items/{workbookId}/content
      const response = await this.client.api(`/me/drive/items/${workbookId}/content`).get();
      return response;
    } catch (error) {
      console.error("Error fetching workbook content:", error);
      throw error;
    }
  }

  /**
   * Updates the content of a specific Excel workbook
   * @param workbookId - The ID of the workbook to update
   * @param workbookContent - The new content of the workbook
   * @returns Promise<void>
   */
  async updateWorkbookContent(workbookId: string, workbookContent: object): Promise<void> {
    try {
      // Make a PUT request to /me/drive/items/{workbookId}/content with workbookContent
      await this.client.api(`/me/drive/items/${workbookId}/content`).put(workbookContent);
    } catch (error) {
      console.error("Error updating workbook content:", error);
      throw error;
    }
  }

  /**
   * Shares a workbook with other users
   * @param workbookId - The ID of the workbook to share
   * @param userEmails - An array of user email addresses to share the workbook with
   * @param permission - The permission level to grant (e.g., "read", "write")
   * @returns Promise<object> Sharing results
   */
  async shareWorkbook(workbookId: string, userEmails: string[], permission: string): Promise<object> {
    try {
      // Create a sharing link for the workbook
      const sharingLink = await this.client.api(`/me/drive/items/${workbookId}/createLink`)
        .post({
          type: "view",
          scope: "organization"
        });

      // Send sharing invitations to the specified user emails
      const sharingResults = await Promise.all(userEmails.map(async (email) => {
        const invitation = {
          requireSignIn: true,
          sendInvitation: true,
          roles: [permission],
          recipients: [
            {
              email: email
            }
          ],
          message: "I've shared an Excel workbook with you"
        };

        return this.client.api(`/me/drive/items/${workbookId}/invite`)
          .post(invitation);
      }));

      return {
        sharingLink: sharingLink.link,
        invitationResults: sharingResults
      };
    } catch (error) {
      console.error("Error sharing workbook:", error);
      throw error;
    }
  }
}

/**
 * Factory function to create a new instance of MicrosoftGraphService
 * @param accessToken - The access token for authentication
 * @returns MicrosoftGraphService New instance of MicrosoftGraphService
 */
export function createMicrosoftGraphService(accessToken: string): MicrosoftGraphService {
  return new MicrosoftGraphService(accessToken);
}

// Commented list of human tasks
/*
Human tasks:
1. Implement proper error handling and retry mechanisms for Graph API calls (Required)
2. Set up Microsoft Graph API credentials and configure in the environment (Critical)
3. Implement caching mechanism for frequently accessed data to reduce API calls (Optional)
4. Add pagination support for listing workbooks if the user has a large number of files (Required)
5. Implement proper scopes and permissions handling for different Graph API operations (Critical)
*/