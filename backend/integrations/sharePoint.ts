import { Client, AuthenticationProvider } from "@microsoft/microsoft-graph-client";
import { getConfig } from "../config/environment";
import { MicrosoftGraphService } from "./microsoftGraph";

export class SharePointService {
  private graphService: MicrosoftGraphService;

  constructor(graphService: MicrosoftGraphService) {
    this.graphService = graphService;
  }

  /**
   * Retrieves a list of SharePoint sites accessible to the user
   * @returns Promise<array> Array of SharePoint site metadata
   */
  async getSites(): Promise<any[]> {
    try {
      const response = await this.graphService.makeRequest("/sites", "GET");
      return response.value;
    } catch (error) {
      console.error("Error fetching SharePoint sites:", error);
      throw error;
    }
  }

  /**
   * Retrieves lists from a specific SharePoint site
   * @param siteId The ID of the SharePoint site
   * @returns Promise<array> Array of SharePoint list metadata
   */
  async getLists(siteId: string): Promise<any[]> {
    try {
      const response = await this.graphService.makeRequest(`/sites/${siteId}/lists`, "GET");
      return response.value;
    } catch (error) {
      console.error(`Error fetching lists for site ${siteId}:`, error);
      throw error;
    }
  }

  /**
   * Retrieves items from a specific SharePoint list
   * @param siteId The ID of the SharePoint site
   * @param listId The ID of the SharePoint list
   * @returns Promise<array> Array of list items
   */
  async getListItems(siteId: string, listId: string): Promise<any[]> {
    try {
      const response = await this.graphService.makeRequest(`/sites/${siteId}/lists/${listId}/items`, "GET");
      return response.value;
    } catch (error) {
      console.error(`Error fetching items for list ${listId} in site ${siteId}:`, error);
      throw error;
    }
  }

  /**
   * Creates a new item in a specific SharePoint list
   * @param siteId The ID of the SharePoint site
   * @param listId The ID of the SharePoint list
   * @param itemData The data for the new item
   * @returns Promise<object> Created list item
   */
  async createListItem(siteId: string, listId: string, itemData: any): Promise<any> {
    try {
      const response = await this.graphService.makeRequest(`/sites/${siteId}/lists/${listId}/items`, "POST", itemData);
      return response;
    } catch (error) {
      console.error(`Error creating item in list ${listId} in site ${siteId}:`, error);
      throw error;
    }
  }

  /**
   * Updates an existing item in a specific SharePoint list
   * @param siteId The ID of the SharePoint site
   * @param listId The ID of the SharePoint list
   * @param itemId The ID of the item to update
   * @param itemData The updated data for the item
   * @returns Promise<object> Updated list item
   */
  async updateListItem(siteId: string, listId: string, itemId: string, itemData: any): Promise<any> {
    try {
      const response = await this.graphService.makeRequest(`/sites/${siteId}/lists/${listId}/items/${itemId}`, "PATCH", itemData);
      return response;
    } catch (error) {
      console.error(`Error updating item ${itemId} in list ${listId} in site ${siteId}:`, error);
      throw error;
    }
  }

  /**
   * Deletes an item from a specific SharePoint list
   * @param siteId The ID of the SharePoint site
   * @param listId The ID of the SharePoint list
   * @param itemId The ID of the item to delete
   * @returns Promise<void>
   */
  async deleteListItem(siteId: string, listId: string, itemId: string): Promise<void> {
    try {
      await this.graphService.makeRequest(`/sites/${siteId}/lists/${listId}/items/${itemId}`, "DELETE");
    } catch (error) {
      console.error(`Error deleting item ${itemId} from list ${listId} in site ${siteId}:`, error);
      throw error;
    }
  }
}

/**
 * Factory function to create a new instance of SharePointService
 * @param graphService MicrosoftGraphService instance
 * @returns SharePointService New instance of SharePointService
 */
export function createSharePointService(graphService: MicrosoftGraphService): SharePointService {
  return new SharePointService(graphService);
}

// Human tasks:
// TODO: Implement proper error handling and retry mechanisms for SharePoint operations
// TODO: Add support for handling large lists and implement paging for getListItems
// TODO: Implement caching mechanism for frequently accessed SharePoint data
// TODO: Add support for SharePoint-specific features like content types and custom fields
// TODO: Implement proper permission checks for SharePoint operations
// TODO: Add support for working with SharePoint document libraries