import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

import { locales } from '@/config/languages';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  return {
    messages: (await import(`./translations/${locale}.json`)).default,
  };
});
