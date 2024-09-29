import { I18n } from 'i18n-js';
import { NativeModules, Platform } from 'react-native';
import en from './en.json';

// Assuming StorageService interface
interface StorageService {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

const DEFAULT_LANGUAGE = 'en';

export class LocalizationManager {
  private i18n: I18n;
  private storageService: StorageService;
  private currentLanguage: string;

  constructor(storageService: StorageService) {
    this.i18n = new I18n();
    this.storageService = storageService;
    this.currentLanguage = DEFAULT_LANGUAGE;
    this.i18n.translations = { en };
    this.initializeLanguage();
  }

  async initializeLanguage(): Promise<void> {
    try {
      const deviceLanguage = this.getDeviceLanguage();
      const storedLanguage = await this.storageService.getItem('userLanguage');
      const languageToUse = storedLanguage || deviceLanguage || DEFAULT_LANGUAGE;
      await this.setLanguage(languageToUse);
    } catch (error) {
      console.error('Error initializing language:', error);
      this.setLanguage(DEFAULT_LANGUAGE);
    }
  }

  private getDeviceLanguage(): string {
    let deviceLanguage = DEFAULT_LANGUAGE;
    if (Platform.OS === 'ios') {
      deviceLanguage = NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0];
    } else if (Platform.OS === 'android') {
      deviceLanguage = NativeModules.I18nManager.localeIdentifier;
    }
    return deviceLanguage.split('_')[0]; // Get the language code part
  }

  async setLanguage(languageCode: string): Promise<void> {
    try {
      // Here we should check if the language is supported
      // For now, we'll assume it is and just set it
      this.currentLanguage = languageCode;
      await this.loadTranslations(languageCode);
      this.i18n.locale = languageCode;
      await this.storageService.setItem('userLanguage', languageCode);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  translate(key: string, options?: object): string {
    return this.i18n.t(key, options);
  }

  private async loadTranslations(languageCode: string): Promise<void> {
    if (languageCode !== DEFAULT_LANGUAGE) {
      try {
        // Here we should load translations from a remote source or local file
        // For now, we'll just use the default English translations
        const translations = en; // This should be replaced with actual loaded translations
        this.i18n.translations[languageCode] = translations;
      } catch (error) {
        console.error(`Error loading translations for ${languageCode}:`, error);
      }
    }
  }
}

// Human tasks (commented as requested):
/*
1. Implement logic to fetch translations from a remote source for languages other than English
2. Add support for RTL languages and layout changes
3. Implement a fallback mechanism for missing translations
4. Create unit tests for LocalizationManager methods
5. Optimize translation loading to minimize app startup time
*/