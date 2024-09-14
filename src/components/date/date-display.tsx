'use client';

import { FC, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { enUS, kk, ru } from 'date-fns/locale';
import { useLocale, useTranslations } from 'next-intl';

export const DateDisplay: FC = () => {
  const locale = useLocale(); // Get current locale from next-intl
  const t = useTranslations();

  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    const date = new Date();

    // Map locales to date-fns locales
    const dateFnsLocale = locale === 'ru' ? ru : locale === 'kz' ? kk : enUS;

    // Determine the date format string based on locale
    const formatString = t('date');

    const formatted = format(date, formatString, { locale: dateFnsLocale });
    setFormattedDate(formatted);
  }, [locale, t]);

  return <span>{formattedDate}</span>;
};
