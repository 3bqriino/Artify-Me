import { en } from './en';
import { ar } from './ar';
import { Language } from '../types';

const translations = { en, ar };

// Fallback to English key if translation is missing
export const t = (key: keyof typeof en, lang: Language): string => {
  return translations[lang]?.[key] || translations.en[key] || key;
};
