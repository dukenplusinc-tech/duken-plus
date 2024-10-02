import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';

/**
 * Hook to format a datetime string into a human-readable format
 *
 * @param datetime
 * @param dateFormat
 */
export const useFormattedDate = (
  datetime: string | null,
  dateFormat = 'PPpp'
) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (datetime) {
      const date = parseISO(datetime);
      const formatted = format(date, dateFormat);
      setFormattedDate(formatted);
    }
  }, [datetime, dateFormat]);

  return formattedDate;
};
