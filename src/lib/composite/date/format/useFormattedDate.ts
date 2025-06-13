import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Locale as DateFnsLocale, enUS, ru } from 'date-fns/locale';
import { useLocale } from 'next-intl';

import { Locale } from '@/config/languages';

const localeMap: Record<Locale, DateFnsLocale> = {
  en: enUS,
  ru: ru,
  kz: ru,
};

export const useFormattedDate = (
  datetime: string | null,
  dateFormat = 'PPpp'
) => {
  const [formattedDate, setFormattedDate] = useState('');
  const localeCode = useLocale();
  const locale = localeMap[localeCode as Locale] || enUS;

  useEffect(() => {
    if (datetime) {
      const date = parseISO(datetime);
      const formatted = format(date, dateFormat, { locale });
      setFormattedDate(formatted);
    }
  }, [datetime, dateFormat, locale]);

  return formattedDate;
};
