import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';

// Initialize i18next
const initI18n = async (): Promise<typeof i18next> => {
  await i18next
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
      },
      lng: 'en', // Default language
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // React already safes from XSS
      },
    });

  return i18next;
};

// Function to change the current language
const changeLanguage = async (lang: string): Promise<void> => {
  await i18next.changeLanguage(lang);
  // You might want to add logic here to persist the language choice
  // For example, saving it to localStorage or updating user preferences in the backend
};

// Function to get the current language
const getCurrentLanguage = (): string => {
  return i18next.language;
};

export { initI18n, changeLanguage, getCurrentLanguage };

// Human tasks:
// TODO: Add support for additional languages beyond English
// TODO: Implement language detection based on user's browser settings