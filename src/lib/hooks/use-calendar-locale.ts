import { useLocale } from 'next-intl';
import { Locale as DateFnsLocale, enUS, kk, ru } from 'date-fns/locale';

import { Locale } from '@/config/languages';

/**
 * Hook to get the appropriate date-fns locale for react-day-picker based on current next-intl locale
 */
export function useCalendarLocale(): DateFnsLocale {
  const localeCode = useLocale();
  
  const localeMap: Record<Locale, DateFnsLocale> = {
    en: enUS,
    ru: ru,
    kz: kk, // Use Kazakh locale for kz
  };

  return localeMap[localeCode as Locale] || enUS;
}
