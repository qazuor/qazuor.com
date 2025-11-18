import en from '@/locales/en/common.json';
import es from '@/locales/es/common.json';

export const languages = {
    en: 'English',
    es: 'Español'
};

export const defaultLang = 'en';

export const ui = {
    en,
    es
} as const;

export type Locale = keyof typeof ui;
