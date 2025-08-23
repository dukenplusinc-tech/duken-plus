import { useTranslations } from 'next-intl';

export function useSafeTranslations(ns?: string) {
  const t = useTranslations(ns);

  function safe(key: string, fallback?: string): string {
    try {
      return t(key);
    } catch {
      return fallback ?? key;
    }
  }

  return { t, safe };
}
