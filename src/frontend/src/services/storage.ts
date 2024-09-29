import { Workbook, Worksheet, Cell } from '../types/spreadsheet';
import { FrontendUser, UserSession } from '../types/user';

export class StorageService {
  constructor() {
    if (!this.isStorageAvailable('localStorage') || !this.isStorageAvailable('sessionStorage')) {
      throw new Error('Local storage or session storage is not supported by the browser');
    }
  }

  private isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
    try {
      const storage = window[type];
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return false;
    }
  }

  setItem(key: string, value: any): void {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  setSessionItem(key: string, value: any): void {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    sessionStorage.setItem(key, stringValue);
  }

  getSessionItem<T>(key: string): T | null {
    const item = sessionStorage.getItem(key);
    if (item === null) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  }

  removeSessionItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clearSession(): void {
    sessionStorage.clear();
  }

  cacheWorkbook(workbook: Workbook): void {
    this.setItem(`workbook_${workbook.id}`, workbook);
  }

  getCachedWorkbook(workbookId: string): Workbook | null {
    return this.getItem<Workbook>(`workbook_${workbookId}`);
  }

  saveUserSession(session: UserSession): void {
    this.setSessionItem('userSession', session);
  }

  getUserSession(): UserSession | null {
    return this.getSessionItem<UserSession>('userSession');
  }

  clearUserSession(): void {
    this.removeSessionItem('userSession');
  }
}

// Human tasks:
// TODO: Implement error handling for storage quota exceeded scenarios
// TODO: Add encryption for sensitive data stored in local or session storage
// TODO: Implement a mechanism to handle storage version changes and migrations