import i18next from 'i18next';
import moment from 'moment';
import numeral from 'numeral';
import { ERROR_MESSAGES } from '../constants/errorMessages';
import { ExcelValue } from '../types';

// Initialize i18next instance
export const i18n = i18next.createInstance();

/**
 * Initializes the i18next library with the application's supported languages and options
 * @param defaultLanguage The default language to use
 * @returns A promise that resolves when initialization is complete
 */
export async function initializeI18n(defaultLanguage: string): Promise<void> {
  // TODO: Import language resources
  const resources = {
    en: {
      translation: {
        // Add English translations here
      },
    },
    // Add other languages here
  };

  await i18n.init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

  // Initialize moment and numeral with the default language
  moment.locale(defaultLanguage);
  numeral.locale(defaultLanguage.toLowerCase());
}

/**
 * Translates a given key to the current language
 * @param key The translation key
 * @param options Optional parameters for the translation
 * @returns Translated text
 */
export function translate(key: string, options?: object): string {
  return i18n.t(key, options);
}

/**
 * Formats a date according to the current locale
 * @param date The date to format
 * @param format The desired format string
 * @returns Formatted date string
 */
export function formatDate(date: Date, format: string): string {
  return moment(date).format(format);
}

/**
 * Formats a number according to the current locale
 * @param value The number to format
 * @param format The desired format string
 * @returns Formatted number string
 */
export function formatNumber(value: number, format: string): string {
  return numeral(value).format(format);
}

/**
 * Formats a currency value according to the current locale
 * @param value The currency value to format
 * @param currencyCode The ISO 4217 currency code
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currencyCode: string): string {
  return new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: currencyCode,
  }).format(value);
}

/**
 * Changes the current language of the application
 * @param languageCode The ISO 639-1 language code
 * @returns A promise that resolves when the language change is complete
 */
export async function setLanguage(languageCode: string): Promise<void> {
  await i18n.changeLanguage(languageCode);
  moment.locale(languageCode);
  numeral.locale(languageCode.toLowerCase());
}

/**
 * Formats an ExcelValue according to its type and the current locale
 * @param value The ExcelValue to format
 * @param format Optional format string for date and number formatting
 * @returns Formatted string representation of the ExcelValue
 */
export function formatExcelValue(value: ExcelValue, format?: string): string {
  if (value === null || value === undefined) {
    return '';
  }

  switch (typeof value) {
    case 'number':
      return format ? formatNumber(value, format) : value.toString();
    case 'string':
      return value;
    case 'boolean':
      return value ? translate('TRUE') : translate('FALSE');
    case 'object':
      if (value instanceof Date) {
        return format ? formatDate(value, format) : value.toLocaleString(i18n.language);
      }
      return JSON.stringify(value);
    default:
      return translate(ERROR_MESSAGES.INVALID_VALUE);
  }
}

// Human tasks (commented list)
/**
 * TODO: Implement language-specific formatting rules for dates, numbers, and currencies
 * TODO: Create language resource files for all supported languages
 * TODO: Ensure all user-facing strings in the application are using the translation function
 * TODO: Implement a language detection mechanism based on user preferences or browser settings
 * TODO: Add support for right-to-left (RTL) languages if needed
 */