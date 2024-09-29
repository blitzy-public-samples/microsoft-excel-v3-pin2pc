import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types inline since SpreadsheetTypes.ts is not available yet
interface Cell {
  // Define cell properties
}

interface Worksheet {
  // Define worksheet properties
}

interface Workbook {
  id: string;
  // Define other workbook properties
}

export class StorageService {
  private STORAGE_KEY_PREFIX: string;

  constructor() {
    this.STORAGE_KEY_PREFIX = 'excel_mobile_';
  }

  async saveWorkbook(workbook: Workbook): Promise<void> {
    try {
      const key = `${this.STORAGE_KEY_PREFIX}${workbook.id}`;
      const workbookJson = JSON.stringify(workbook);
      await AsyncStorage.setItem(key, workbookJson);
    } catch (error) {
      console.error('Error saving workbook:', error);
      throw new Error('Failed to save workbook');
    }
  }

  async loadWorkbook(workbookId: string): Promise<Workbook | null> {
    try {
      const key = `${this.STORAGE_KEY_PREFIX}${workbookId}`;
      const workbookJson = await AsyncStorage.getItem(key);
      if (workbookJson) {
        return JSON.parse(workbookJson) as Workbook;
      }
      return null;
    } catch (error) {
      console.error('Error loading workbook:', error);
      throw new Error('Failed to load workbook');
    }
  }

  async deleteWorkbook(workbookId: string): Promise<void> {
    try {
      const key = `${this.STORAGE_KEY_PREFIX}${workbookId}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error deleting workbook:', error);
      throw new Error('Failed to delete workbook');
    }
  }

  async listWorkbooks(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys
        .filter(key => key.startsWith(this.STORAGE_KEY_PREFIX))
        .map(key => key.slice(this.STORAGE_KEY_PREFIX.length));
    } catch (error) {
      console.error('Error listing workbooks:', error);
      throw new Error('Failed to list workbooks');
    }
  }

  async clearAllWorkbooks(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const workbookKeys = keys.filter(key => key.startsWith(this.STORAGE_KEY_PREFIX));
      await AsyncStorage.multiRemove(workbookKeys);
    } catch (error) {
      console.error('Error clearing all workbooks:', error);
      throw new Error('Failed to clear all workbooks');
    }
  }
}

// Human tasks:
// TODO: Implement error handling and retry logic for AsyncStorage operations
// TODO: Add data compression for large workbooks to optimize storage usage (Optional)
// TODO: Implement a caching mechanism to improve performance for frequently accessed workbooks (Optional)