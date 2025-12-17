export const locales = ['en', 'kz', 'ru'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale = 'ru';

export const languages = [
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'kz',
    label: 'Казахский',
  },
  {
    value: 'ru',
    label: 'Русский',
  },
];
